import React from "react";
import { FiCopy } from "react-icons/fi";

function Message({ message, fromSelf, sender }) {
  const isCode = message.startsWith("```");

  const handleCopy = () => {
    navigator.clipboard.writeText(message.replace(/```/g, ""));
    alert("Message copied to clipboard!");
  };

  return (
    <div
      className={`flex mb-3 items-end ${
        fromSelf ? "justify-end" : "justify-start"
      }`}
    >
      {/* Chat Bubble + Copy Button Container */}
      <div
        className={`flex flex-col ${
          fromSelf ? "items-end" : "items-start"
        }`}
      >
        {/* Chat Bubble */}
        <div
          className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow-md ${
            fromSelf
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
          }`}
        >
          {!fromSelf && (
            <p className="text-xs font-semibold mb-1 opacity-80">
              {sender}
            </p>
          )}

          {isCode ? (
            <pre className="bg-black text-green-400 p-3 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre">
              <code>{message.replace(/```/g, "")}</code>
            </pre>
          ) : (
            <p className="text-base leading-relaxed whitespace-pre-line break-words">
              {message}
            </p>
          )}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="mt-2 p-2 rounded-full hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-white transition"
          title="Copy message"
        >
          <FiCopy size={18} />
        </button>
      </div>
    </div>
  );
}

export default Message;
