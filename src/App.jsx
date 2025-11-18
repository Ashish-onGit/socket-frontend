import React, { useEffect, useRef, useState } from "react";
// import React, { useEffect, useRef, useState } from "reactsocket.io-client";
import { useDispatch, useSelector } from "react-redux";
import {
  loginSuccess,
  logout as logoutAction,
} from "./features/auth/authSlice";
import { addMessage, clearMessages } from "./features/chat/chatSlice";
import Login from "./components/Login";
import Register from "./components/Register";
import Chat from "./components/Chat";
import "./App.css";


const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
const socket = io(backendURL);

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const chat = useSelector((state) => state.chat.messages);
  const [step, setStep] = useState(user ? "chat" : "login");
  const [message, setMessage] = useState("");
  const [typingUser, setTypingUser] = useState(""); // ✅ Typing indicator state
  const myId = useRef("");
  // console.log(typingUser,"from app")

  useEffect(() => {
    socket.on("connect", () => {
      myId.current = socket.id;
    });

    socket.on("receive_message", (data) => {
      dispatch(
        addMessage({
          message: data.message,
          sender: data.sender,
          fromSelf: data.sender === user?.username,
        })
      );
    });

    // ✅ Listen for typing events
    socket.on("show_typing", (username) => setTypingUser(`${username} is typing...`));
    socket.on("hide_typing", () => setTypingUser(""));



    return () => {
      socket.off("connect");
      socket.off("receive_message");
      socket.off("show_typing");
      socket.off("hide_typing");
    };
  }, [dispatch, user]);

  const handleLogin = async (username, pass) => {
    try {
      const res = await fetch(`${backendURL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: pass }),
      });

      if (res.ok) {
        dispatch(loginSuccess({ username }));
        setStep("chat");
      } else {
        alert("Invalid credentials");
      }
    } catch {
      alert("Server error");
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
        setStep("login");
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } catch {
      alert("Server error");
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("send_message", { message, username: user.username });
      socket.emit("stop_typing"); // ✅ Stop typing when message sent
      setMessage("");
    }
  };

  const onLogout = () => {
    if (confirm("Are you sure?")) {
      dispatch(logoutAction());
      dispatch(clearMessages());
      setStep("login");
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#2e026d] via-[#1a1a1a] to-black">
      {step === "login" && (
        <Login
          onLogin={handleLogin}
          switchToRegister={() => setStep("register")}
        />
      )}

      {step === "register" && (
        <Register
          onRegister={handleRegister}
          switchToLogin={() => setStep("login")}
        />
      )}

      {step === "chat" && (
        <Chat
          username={user.username}
          chat={chat}
          message={message}
          setMessage={(val) => {
            setMessage(val);
            // console.log("Emitting typing event with username:", user?.username);
            socket.emit("typing", user.username); 
            clearTimeout(window.typingTimeout);
            window.typingTimeout = setTimeout(() => {
              socket.emit("stop_typing");
            }, 1000);
          }}
          sendMessage={sendMessage}
          onLogout={onLogout}
          typingUser={typingUser} 
        />
      )}
    </div>
  );
}

export default App;
import { io } from "socket.io-client";
