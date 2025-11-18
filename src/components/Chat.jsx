import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { FiLogOut } from "react-icons/fi";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";

function Chat({ username, chat, message, setMessage, sendMessage, onLogout, typingUser }) {
  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const inputBarRef = useRef(null);
  const textareaRef = useRef(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() !== "") {
        sendMessage();
      }
    }
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  // Auto-resize textarea but cap at max height
  const handleInputResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 96); // 96px ≈ 3 rows
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    handleInputResize();
  }, [message]);

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
    <div className="relative min-h-[100dvh] flex flex-col text-gray-100 radial-bg overflow-x-hidden pb-28">
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
      <div className="flex-grow overflow-y-auto p-4 rounded-3xl shadow-inner my-2 pt-4">
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

      {/* Typing Indicator */}
      {typingUser && (
        <div className="text-sm text-gray-400 italic px-4 pb-2">{typingUser}</div>
      )}


      {/* Input Area */}
      <div
        ref={inputBarRef}
        className="fixed left-0 right-0 bottom-0 w-full px-4 pb-[env(safe-area-inset-bottom)] mb-2 z-20"
      >
        <div
          className="
            flex items-center gap-2
            bg-white dark:bg-gray-900
            p-3 rounded-full shadow-lg
          "
        >
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleInputResize();
            }}
            onKeyDown={handleKeyPress}
            placeholder="Type here..."
            rows={1}
            className="
              flex-1 min-w-0
              p-3 pl-4
              rounded-full border border-gray-300 dark:border-gray-700
              bg-gray-50 dark:bg-gray-700
              text-gray-900 dark:text-white
              focus:outline-none focus:ring-1 focus:ring-purple-500
              resize-none overflow-y-auto no-scrollbar
              max-h-14
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
