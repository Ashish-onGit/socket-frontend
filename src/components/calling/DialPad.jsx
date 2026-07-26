import React, { useState } from "react";
import { FiPhone, FiVideo, FiDelete } from "react-icons/fi";

export default function DialPad({ onInitiateCall, callError, isDialing }) {
  const [callId, setCallId] = useState("");

  const handleKeyPress = (num) => {
    if (num === "*" || num === "#") return; // Restrict user ID to digits only
    if (callId.length < 8) {
      setCallId((p) => p + num);
    }
  };

  const handleDelete = () => {
    setCallId((p) => p.slice(0, -1));
  };

  const handleClear = () => {
    setCallId("");
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const cleaned = text.trim().replace(/\D/g, ""); // extract numbers only
      if (cleaned.length > 8) {
        setCallId(cleaned.slice(0, 8));
      } else {
        setCallId(cleaned);
      }
    } catch (err) {
      console.error("Failed to read system clipboard", err);
    }
  };

  const handleStartCall = (type) => {
    if (callId.length === 8) {
      onInitiateCall(callId, type);
    }
  };

  const keypadItems = [
    { num: "1", letters: "" },
    { num: "2", letters: "A B C" },
    { num: "3", letters: "D E F" },
    { num: "4", letters: "G H I" },
    { num: "5", letters: "J K L" },
    { num: "6", letters: "M N O" },
    { num: "7", letters: "P Q R S" },
    { num: "8", letters: "T U V" },
    { num: "9", letters: "W X Y Z" },
    { num: "*", letters: "" },
    { num: "0", letters: "+" },
    { num: "#", letters: "" }
  ];

  return (
    <div className="w-full max-w-sm mx-auto text-center space-y-6 py-6 font-sans">
      
      {/* Top Section: Prominent Entered Number / User ID Display */}
      <div className="space-y-2">
        <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-zinc-550 block select-none">
          Enter Call ID
        </label>
        
        <div className="h-16 bg-gray-50 dark:bg-black/40 border border-gray-150/45 dark:border-white/5 rounded-2xl flex items-center justify-between px-5 relative overflow-hidden transition-all duration-300">
          <div className="flex-1 text-center pl-8">
            <span className="text-2xl font-mono font-extrabold tracking-widest text-gray-800 dark:text-gray-100 block truncate">
              {callId || "••••••••"}
            </span>
          </div>
          
          <div className="w-8 flex items-center justify-center">
            {callId ? (
              <button
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 active:scale-90 transition-all cursor-pointer flex items-center justify-center p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/5"
                title="Backspace"
              >
                <FiDelete size={18} />
              </button>
            ) : (
              <button
                onClick={handlePaste}
                className="text-[9.5px] font-extrabold text-brand-teal hover:underline cursor-pointer uppercase tracking-wider whitespace-nowrap"
                title="Paste Call ID"
              >
                Paste
              </button>
            )}
          </div>
        </div>

        {callError && (
          <p className="text-[9.5px] font-bold text-red-500 bg-red-50 dark:bg-red-950/10 border border-red-100 dark:border-red-950/20 py-1.5 px-3 rounded-xl animate-fade-in text-left">
            ⚠️ {callError}
          </p>
        )}
      </div>

      {/* Middle Section: Large Numeric Keypad with Circular Buttons */}
      <div className="grid grid-cols-3 gap-y-4 gap-x-6 justify-items-center max-w-[280px] mx-auto py-2">
        {keypadItems.map((item, idx) => {
          const isSpecial = item.num === "*" || item.num === "#";
          return (
            <button
              key={idx}
              onClick={() => handleKeyPress(item.num)}
              disabled={isSpecial}
              className={`w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all select-none duration-150 border relative ${
                isSpecial
                  ? "bg-transparent border-transparent text-gray-300 dark:text-zinc-700 opacity-40 cursor-default"
                  : "bg-gray-50 dark:bg-zinc-900 border-gray-100 dark:border-white/5 hover:border-brand-teal/30 dark:hover:border-brand-teal/30 hover:bg-gray-100/80 dark:hover:bg-zinc-800/80 text-gray-800 dark:text-gray-200 cursor-pointer active:scale-90 active:bg-gray-200 dark:active:bg-zinc-700 shadow-sm"
              }`}
            >
              <span className="text-lg font-bold font-sans">{item.num}</span>
              {item.letters && (
                <span className="text-[6.5px] uppercase tracking-wider text-gray-400 dark:text-zinc-550 font-bold -mt-0.5 leading-none">
                  {item.letters}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Section: Circular Call Buttons Side-by-Side */}
      <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-100 dark:border-white/5">
        {/* Voice Call Button */}
        <div className="flex flex-col items-center gap-1.5">
          <button
            onClick={() => handleStartCall("audio")}
            disabled={callId.length !== 8 || isDialing}
            className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-emerald-500/40 text-white flex items-center justify-center shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
            title="Voice Call"
          >
            <FiPhone size={20} />
          </button>
          <span className="text-[8.5px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-zinc-550 select-none">
            Voice
          </span>
        </div>

        {/* Video Call Button */}
        <div className="flex flex-col items-center gap-1.5">
          <button
            onClick={() => handleStartCall("video")}
            disabled={callId.length !== 8 || isDialing}
            className="w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-purple-600/40 text-white flex items-center justify-center shadow-lg hover:shadow-purple-600/20 active:scale-95 transition-all cursor-pointer"
            title="Video Call"
          >
            <FiVideo size={20} />
          </button>
          <span className="text-[8.5px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-zinc-550 select-none">
            Video
          </span>
        </div>
      </div>
      
    </div>
  );
}
