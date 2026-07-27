import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContextMenu({ x, y, isOpen, onClose, items, onReact }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleCloseEvent = () => {
      onClose();
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
      document.addEventListener("contextmenu", handleOutsideClick);
      window.addEventListener("close-menus", handleCloseEvent);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("contextmenu", handleOutsideClick);
      window.removeEventListener("close-menus", handleCloseEvent);
    };
  }, [isOpen, onClose]);

  // Adjust menu placement to avoid clipping on screens
  const menuWidth = 176;
  const menuHeight = 250;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const adjustedX = x + menuWidth > screenWidth ? screenWidth - menuWidth - 10 : x;
  const adjustedY = y + menuHeight > screenHeight ? screenHeight - menuHeight - 10 : y;

  const reactionEmojis = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          style={{ top: adjustedY, left: adjustedX }}
          onClick={(e) => e.stopPropagation()}
          className="fixed z-50 w-44 rounded-[16px] shadow-xl dark:shadow-[0_10px_30px_rgba(0,0,0,0.6)] bg-white dark:bg-[#0E1117]/95 backdrop-blur-2xl border border-slate-200 dark:border-[rgba(255,255,255,0.08)] py-1.5 text-slate-900 dark:text-white overflow-hidden"
        >
          {/* Reaction Quick Bar */}
          {onReact && (
            <div className="flex items-center justify-around px-2 py-1.5 mb-1 border-b border-slate-200 dark:border-[rgba(255,255,255,0.08)] bg-slate-50 dark:bg-white/5">
              {reactionEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={(e) => {
                    e.stopPropagation();
                    onReact(emoji);
                    onClose();
                  }}
                  className="hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg text-base transition-colors p-1 cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Action Items */}
          {items.map((item, idx) => {
            if (item.divider) {
              return <div key={idx} className="border-t border-slate-200 dark:border-[rgba(255,255,255,0.08)] my-1" />;
            }
            return (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  item.onClick && item.onClick(e);
                  onClose();
                }}
                className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-xs text-left transition-colors cursor-pointer ${
                  item.danger
                    ? "text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                    : "text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                }`}
              >
                {item.icon && <span className="text-sm opacity-80">{item.icon}</span>}
                {item.label}
              </button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
