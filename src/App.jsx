import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import {
  loginSuccess,
  logout as logoutAction,
} from "./features/auth/authSlice";
import { addMessage, clearMessages } from "./features/chat/chatSlice";
import { ToastContainer,Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
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
  const [typingUser, setTypingUser] = useState("");

  const myId = useRef("");

  // ------------------------------
  // SOCKET EVENT LISTENERS
  // ------------------------------
  useEffect(() => {
    socket.on("connect", () => {
      myId.current = socket.id;
    });

    socket.on("receive_message", (data) => {
      // Do NOT strip replyTo — keep full object
      dispatch(
        addMessage({
          ...data,
          fromSelf: data.sender === user?.username,
        })
      );
    });

    socket.on("show_typing", (username) => {
      setTypingUser(`${username} is typing...`);
    });

    socket.on("hide_typing", () => setTypingUser(""));

    return () => {
      socket.off("connect");
      socket.off("receive_message");
      socket.off("show_typing");
      socket.off("hide_typing");
    };
  }, [dispatch, user]);

  // ------------------------------
  // AUTH
  // ------------------------------
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
        return true;
      } else {
        // alert("Invalid credentials");
        return false;
      }
    } catch {
      alert("Server error");
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
        setStep("login");
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } catch {
      alert("Server error");
    }
  };

  // ------------------------------
  // SEND MESSAGE (NOW FULL OBJECT)
  // ------------------------------
  const sendMessage = (msgObj) => {
    if (!msgObj || !msgObj.message.trim()) return;

    // Add immediately to Redux for instant UI
    dispatch(addMessage({ ...msgObj }));

    // Send full message to server
    socket.emit("send_message", msgObj);

    // Stop typing
    socket.emit("stop_typing");
  };

  // ------------------------------
  // LOGOUT
  // ------------------------------
  const onLogout = () => {
    if (confirm("Are you sure?")) {
      dispatch(logoutAction());
      dispatch(clearMessages());
      setStep("login");
      toast.info("Logged out");
      socket.disconnect();
    }
  };

  return (
    <>
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
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
     
        newestOnTop={true}
         transition={Slide}
        bodyClassName="text-sm font-medium"
        style={{ zIndex: 99999 ,padding:"10px 20px", borderRadius:20}}
        closeButton={false}
      />
    </>
  );
}

export default App;
