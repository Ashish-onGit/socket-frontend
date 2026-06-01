import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logout as logoutAction } from "./features/auth/authSlice";
import { loadUserChats } from "./features/chat/chatSlice";
import Login from "./components/Login";
import Register from "./components/Register";
import MainLayout from "./components/layout/MainLayout";
import { useToast } from "./components/common/ToastContext";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./index.css";

const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
const socket = io(backendURL, { autoConnect: false });

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const user = useSelector((state) => state.auth.user);

  // Run a one-time localStorage migration to replace "Saumya" with "Gauri"
  useEffect(() => {
    try {
      // 1. Rename chats_of_Saumya to chats_of_Gauri
      const saumyaChats = localStorage.getItem("chats_of_Saumya");
      if (saumyaChats) {
        localStorage.setItem("chats_of_Gauri", saumyaChats);
        localStorage.removeItem("chats_of_Saumya");
      }

      // 2. Loop through all keys to perform sub-replacements
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;

        // Migrate channels
        if (key.startsWith("channel_")) {
          const val = localStorage.getItem(key);
          if (val && val.includes("Saumya")) {
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed)) {
              const updated = parsed.map(msg => ({
                ...msg,
                sender: msg.sender === "Saumya" ? "Gauri" : msg.sender
              }));
              localStorage.setItem(key, JSON.stringify(updated));
            }
          }
        }

        // Migrate chats of any user (e.g. chats_of_Ashish)
        if (key.startsWith("chats_of_")) {
          const val = localStorage.getItem(key);
          if (val && (val.includes("Saumya") || val.includes("saumya"))) {
            const parsed = JSON.parse(val);
            const updated = {};
            for (const [username, details] of Object.entries(parsed)) {
              const newUsername = username === "Saumya" ? "Gauri" : username;
              const updatedMessages = (details.messages || []).map(msg => ({
                ...msg,
                sender: msg.sender === "Saumya" ? "Gauri" : msg.sender,
                receiver: msg.receiver === "Saumya" ? "Gauri" : msg.receiver
              }));
              updated[newUsername] = {
                ...details,
                messages: updatedMessages
              };
            }
            localStorage.setItem(key, JSON.stringify(updated));
          }
        }
      }
    } catch (e) {
      console.error("Localstorage migration error:", e);
    }
  }, []);

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  // Apply theme to document html element
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Connect socket on login/refresh
  useEffect(() => {
    if (user?.username) {
      socket.connect();
    } else {
      socket.disconnect();
    }
  }, [user]);

  // Monitor socket connection events
  useEffect(() => {
    const handleConnect = () => {
      showToast("Successfully connected to chat server", "success");
    };

    const handleDisconnect = () => {
      showToast("Disconnected from chat server", "error");
    };

    const handleConnectError = () => {
      showToast("Connection to server failed. Reconnecting...", "error");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
    };
  }, [showToast]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    showToast(`Theme changed to ${nextTheme === "dark" ? "Dark" : "Light"}`, "info");
  };

  const handleLogin = async (username, pass) => {
    try {
      const res = await fetch(`${backendURL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: pass }),
      });

      if (res.ok) {
        dispatch(loginSuccess({ username }));
        navigate("/chat");
        return true;
      }
      return false;
    } catch (err) {
      showToast("Failed to connect to authentication server", "error");
      return false;
    }
  };

  const handleRegister = async (username, pass) => {
    try {
      const res = await fetch(`${backendURL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: pass }),
      });

      if (res.ok) {
        navigate("/login");
        return true;
      }
      return false;
    } catch (err) {
      showToast("Failed to connect to registration server", "error");
      return false;
    }
  };

  const onLogout = () => {
    dispatch(logoutAction());
    dispatch(loadUserChats(null));
    socket.disconnect();
    showToast("Logged out successfully", "info");
    navigate("/login");
  };

  return (
    <div className="w-full h-full bg-brand-bg-light dark:bg-brand-bg-dark transition-colors duration-200">
      <Routes>
        <Route 
          path="/login" 
          element={
            !user ? (
              <Login
                onLogin={handleLogin}
                switchToRegister={() => navigate("/register")}
                theme={theme}
                toggleTheme={toggleTheme}
              />
            ) : (
              <Navigate to="/chat" replace />
            )
          } 
        />

        <Route 
          path="/register" 
          element={
            !user ? (
              <Register
                onRegister={handleRegister}
                switchToLogin={() => navigate("/login")}
                theme={theme}
                toggleTheme={toggleTheme}
              />
            ) : (
              <Navigate to="/chat" replace />
            )
          } 
        />

        {["/chat", "/files", "/channels", "/contacts", "/analytics", "/calls", "/settings"].map((path) => (
          <Route 
            key={path}
            path={path} 
            element={
              user ? (
                <MainLayout
                  socket={socket}
                  onLogout={onLogout}
                  theme={theme}
                  toggleTheme={toggleTheme}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
        ))}

        {/* Fallback routes */}
        <Route path="*" element={<Navigate to={user ? "/chat" : "/login"} replace />} />
      </Routes>
    </div>
  );
}

export default App;
