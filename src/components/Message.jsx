import React from "react";
import { FiCopy } from "react-icons/fi";
import { LuReplyAll } from "react-icons/lu";
import { toast } from "react-toastify";

function Message({ message, fromSelf, sender, onReply }) {
  const text = message?.message ?? "";
  const replyTo = message?.replyTo ?? null;

  // Detect code block ( ... )
  const isCode = text.trim().startsWith("");

  // Remove triple backticks for rendering/copying
  // const cleanCode = (str) => str.replace(//g, "").trim();
  // const cleanCode = (str) => str.replace(/```/g, "").trim();

  const handleCopy = () => {
    const content =  text;
    navigator.clipboard.writeText(content);
    toast.success("Copied!",{autoClose:700,})
    // console.log("Message copied to clipboard!");
  };

  return (
    <div
      className={`flex mb-3 flex-col  ${
        fromSelf ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex flex-col ${
          fromSelf ? "items-end  ml-auto" : "items-start mr-auto"
        } max-w-[80%]`}
      >
        <div className="pt-1 overflow-hidden rounded-xl text-sm shadow-md min-w-16 bg-zinc-800 bg-opacity-10 backdrop-blur-md">
          {/* Sender */}
          <div
            className={`h-5 min-w-16 flex items-end ${
              fromSelf ? "justify-start pl-2" : "justify-end pr-2"
            }`}
          >
            <p className="text-xs font-semibold mb-1 opacity-80 overflow-hidden">
              {message.sender || sender}
            </p>
          </div>

          {/* Quoted Reply */}
          {replyTo && (
            <div
              className={`mb-2 p-2 rounded-lg border-l-4 ${
                fromSelf
                  ? "bg-purple-700 border-indigo-400"
                  : "bg-gray-100 dark:bg-gray-800 border-purple-500"
              }`}
            >
              <p className="text-xs font-bold">{replyTo.sender}</p>
              <p className="text-xs opacity-80 break-words line-clamp-2">
                {replyTo.message}
              </p>
            </div>
          )}

          <p
            className={`w-[60%] ${
              fromSelf
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
            } text-base leading-relaxed whitespace-pre-line break-words min-w-12  w-full px-4 pb-4`}
          >
            {text.trim()}
          </p>
        </div>
      </div>
      <div className={`flex ${fromSelf ? "justify-end" : "justify-start"}`}>
        <button
          onClick={() => onReply(message)}
          className={`p-2 mt-auto rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 ${
            fromSelf ? "order-0 ml-2" : "order-1 mr-2"
          }`}
        >
          <LuReplyAll size={18} />
        </button>
        <button
          onClick={handleCopy}
          className="p-2 rounded-full hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-white transition mt-1"
        >
          <FiCopy size={18} />
        </button>
      </div>
    </div>
  );
}

export default Message;

// const cleanCode = (str) => str.replace(/```/g, "").trim();
