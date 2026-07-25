import React, { useState } from "react";
import { FiPhone, FiVideo, FiDelete } from "react-icons/fi";

export default function DialPad({ onInitiateCall, callError, isDialing }) {
  const [callId, setCallId] = useState("");

  const handleKeyPress = (num) => {
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

  const buttons = [1, 2, 3, 4, 5, 6, 7, 8, 9, "Clear", 0, "Delete"];

  return (
    <div className="max-w-xs mx-auto text-center space-y-6 py-6 font-sans">
      <div className="space-y-1.5">
        <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-zinc-550 block">
          Enter Call ID
        </label>
        <div className="h-14 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl flex items-center justify-center relative px-4 overflow-hidden">
          <span className="text-xl font-mono font-bold tracking-widest text-gray-800 dark:text-gray-50">
            {callId || "••••••••"}
          </span>
          {callId ? (
            <button
              onClick={handleClear}
              className="absolute right-3 text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 font-bold cursor-pointer"
            >
              Clear
            </button>
          ) : (
            <button
              onClick={handlePaste}
              className="absolute right-3 text-[10px] text-brand-teal hover:text-brand-teal/80 font-bold cursor-pointer"
            >
              Paste
            </button>
          )}
        </div>
        {callError && (
          <p className="text-[9.5px] font-bold text-red-500 bg-red-50 dark:bg-red-950/10 border border-red-100 dark:border-red-950/20 py-1.5 px-3 rounded-xl animate-fade-in">
            {callError}
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {buttons.map((btn, idx) => {
          if (btn === "Clear") {
            return (
              <button
                key={idx}
                onClick={handleClear}
                className="h-12 rounded-xl flex items-center justify-center text-[10px] font-extrabold text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer active:scale-95 transition-transform"
              >
                CLEAR
              </button>
            );
          }
          if (btn === "Delete") {
            return (
              <button
                key={idx}
                onClick={handleDelete}
                className="h-12 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer active:scale-95 transition-transform"
              >
                <FiDelete size={16} />
              </button>
            );
          }
          return (
            <button
              key={idx}
              onClick={() => handleKeyPress(btn.toString())}
              className="h-12 rounded-xl flex flex-col items-center justify-center bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-brand-teal/20 text-sm font-bold text-gray-800 dark:text-gray-200 cursor-pointer active:scale-95 transition-all shadow-sm"
            >
              {btn}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => handleStartCall("audio")}
          disabled={callId.length !== 8 || isDialing}
          className="flex-1 py-3 bg-brand-teal text-white rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-teal/95 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold shadow-md shadow-brand-teal/20 active:scale-98"
        >
          <FiPhone size={14} />
          Voice Call
        </button>
        <button
          onClick={() => handleStartCall("video")}
          disabled={callId.length !== 8 || isDialing}
          className="flex-1 py-3 bg-purple-600 text-white rounded-2xl flex items-center justify-center gap-2 hover:bg-purple-650 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold shadow-md shadow-purple-600/20 active:scale-98"
        >
          <FiVideo size={14} />
          Video Call
        </button>
      </div>
    </div>
  );
}
