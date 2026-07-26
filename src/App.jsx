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
import { TermsOfService, PrivacyPolicy } from "./components/common/TermsAndPrivacy";
import { NotFoundPage, OfflineScreen } from "./components/common/ErrorPages";
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
    if (user?.token) {
      socket.auth = { token: user.token };
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

    const handleForceLogout = (data) => {
      dispatch(logoutAction());
      dispatch(loadUserChats(null));
      socket.disconnect();
      alert(data?.reason || "Your account has been logged in on another device.");
      navigate("/login");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("force-logout", handleForceLogout);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("force-logout", handleForceLogout);
    };
  }, [showToast, dispatch, navigate]);

  // Synchronize authentication logouts/updates across multiple tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "user") {
        if (!e.newValue) {
          // User was logged out in another tab
          dispatch(logoutAction());
          dispatch(loadUserChats(null));
          socket.disconnect();
          navigate("/login");
        } else {
          // User was logged in/updated in another tab
          try {
            const parsed = JSON.parse(e.newValue);
            dispatch(loginSuccess({ user: parsed, token: parsed.token }));
          } catch (err) {
            console.error("Storage event sync error:", err);
          }
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [dispatch, navigate]);

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

      const data = await res.json();
      if (res.ok) {
        dispatch(loginSuccess(data));
        navigate("/chat");
        return { success: true };
      } else {
        return { success: false, error: data.error || "Invalid credentials" };
      }
    } catch (err) {
      return { success: false, error: "Failed to connect to authentication server" };
    }
  };

  const handleRegister = async (username, pass) => {
    try {
      const res = await fetch(`${backendURL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: pass }),
      });

      const data = await res.json();
      if (res.ok) {
        navigate("/login");
        return { success: true };
      } else {
        return { success: false, error: data.error || "Registration failed" };
      }
    } catch (err) {
      return { success: false, error: "Failed to connect to registration server" };
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
      <OfflineScreen />
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

        {/* Public Legal Pages */}
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* Root Redirect */}
        <Route path="/" element={<Navigate to={user ? "/chat" : "/login"} replace />} />

        <Route 
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
        >
          {["/chat", "/archived", "/files", "/channels", "/contacts", "/analytics", "/calls", "/settings"].map((path) => (
            <Route key={path} path={path} element={null} />
          ))}
        </Route>

        {/* Fallback routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
