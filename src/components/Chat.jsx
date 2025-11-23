import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { FiLogOut } from "react-icons/fi";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";

function Chat({
  username,
  chat = [],
  message,
  setMessage,
  sendMessage,
  onLogout,
  typingUser,
}) {
  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const textareaRef = useRef(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  // console.log(showEmojiPicker)
  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // Enter to send
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      message.trim() !== "" && handleSend();
    }
  };

  // Emoji click
  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  // Auto resize textarea
  const handleInputResize = () => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      Math.min(textareaRef.current.scrollHeight, 96) + "px";
  };

  useEffect(handleInputResize, [message]);

  // Close emoji picker on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target)
      ) {
        console.log(showEmojiPicker," from use eeffect")
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showEmojiPicker]);

  // Send message with reply info
  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage = {
      message: message.trim(),
      sender: username,
      fromSelf: true,
      replyTo: replyTo
        ? {
            message: replyTo.message,
            sender: replyTo.sender,
          }
        : null,
    };

    sendMessage(newMessage); // IMPORTANT: send full object
    setMessage("");
    setReplyTo(null);
  };

  return (
    <div className="relative min-h-[100dvh] flex flex-col text-gray-100 radial-bg overflow-x-hidden pb-28">
      {/* Header */}
      <div className="fixed w-full top-0 flex justify-between items-center bg-opacity-80 backdrop-blur-md p-4 rounded-lg shadow-lg z-10">
        <h2 className="text-xl font-semibold">Hey, {username}</h2>
        <button
          onClick={onLogout}
          className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition"
        >
          <FiLogOut size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4 rounded-3xl shadow-inner my-2 pt-20">
        {chat.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            {/* No words have landed here yet */}
            No messages yet. Be the first! 😎
          </p>
        ) : (
          chat.map((msg, idx) => (
            <Message
              key={idx}
              message={msg}
              fromSelf={msg.fromSelf}
              sender={msg.sender}
              onReply={(m) => setReplyTo(m)}
            />
          ))
        )}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Typing indicator */}
      {typingUser && (
        <div className="text-sm text-gray-400 italic px-4 pb-2">
          {typingUser}
        </div>
      )}

      {/* Input section */}
      <div className="fixed left-0 right-0 bottom-0 w-full px-4 mb-2 z-20">
        {/* Reply preview */}
        {replyTo && (
          <div className="flex flex-col items-start justify-between overflow-hidden bg-gray-200 dark:bg-gray-800 p-2 rounded-t-lg border-l-4 border-purple-500 mb-1">
            {/* Header Row */}
            <div className="flex w-full justify-between items-center">
              <div className="text-sm">
                Replying to <strong>{replyTo.sender}</strong>:
              </div>
              <button
                onClick={() => setReplyTo(null)}
                className="text-red-500 hover:text-red-700 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Message Preview */}
            <div className="max-h-14 overflow-hidden w-full">
              <span className="opacity-80 block truncate w-full">
                {replyTo.message}
              </span>
            </div>
          </div>
        )}
        {/* Input bar */}
        <div className="backdrop-blur-xl bg-opacity-80 flex items-center gap-2 bg-white dark:bg-gray-900 p-3 rounded-full shadow-lg">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleInputResize();
            }}
            onKeyDown={handleKeyPress}
            placeholder="Type here..."
            className="flex-1 min-w-0 p-3 pl-4 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none overflow-y-auto no-scrollbar max-h-14"
            rows={1}
          />

          {/* Emoji */}
          <button
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="p-2 rounded-full text-3xl hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            ☺
          </button>

          {/* Send */}
          <button
            onClick={handleSend}
            className="flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-2 rounded-full transition"
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
