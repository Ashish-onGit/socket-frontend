import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Message from "./Message";
import { FiLogOut } from "react-icons/fi";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";

function Chat({ message, setMessage, sendMessage, onLogout }) {
  const username = useSelector((state) => state.auth.user?.username);
  const chat = useSelector((state) => state.chat.messages);
  const messagesEndRef = useRef(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  // Scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && message.trim() !== "") {
      sendMessage();
    }
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        showEmojiPicker
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  return (
    <div className="min-h-[100dvh] flex flex-col text-gray-100 radial-bg overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 flex justify-between items-center bg-opacity-80 backdrop-blur-md p-4 rounded-lg shadow-lg z-10">
        <h2 className="text-xl font-semibold">Hey, {username}</h2>
        <button
          onClick={onLogout}
          aria-label="Logout"
          className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition"
        >
          <FiLogOut size={20} />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto p-4 rounded-3xl shadow-inner my-4 pt-4">
        {chat.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No messages yet
          </p>
        ) : (
          chat.map((msg, idx) => (
            <Message
              key={idx}
              message={msg.message}
              fromSelf={msg.fromSelf}
              sender={msg.sender || "Unknown"}
            />
          ))
        )}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 left-0 right-0 w-full px-4 pb-[env(safe-area-inset-bottom)] mb-3 z-20">
        <div
          className="
            flex items-center gap-2
            bg-white dark:bg-gray-900
            p-3 rounded-full shadow-lg
          "
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type here..."
            className="
              flex-1 min-w-0
              p-3 pl-4
              rounded-full border border-gray-300 dark:border-gray-700
              bg-gray-50 dark:bg-gray-700
              text-gray-900 dark:text-white
              focus:outline-none focus:ring-1 focus:ring-purple-500
            "
          />

          {/* Emoji Button */}
          <button
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            aria-label="Emoji Picker"
            className="p-2 rounded-full text-3xl hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            ☺
          </button>

          {/* Send Button */}
          <button
            onClick={sendMessage}
            aria-label="Send Message"
            className="
              flex items-center justify-center
              bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700
              text-white px-6 py-2 rounded-full transition
            "
          >
            <IoSend size={22} />
          </button>
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div
            ref={emojiPickerRef}
            className="absolute bottom-24 right-6 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
          >
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
