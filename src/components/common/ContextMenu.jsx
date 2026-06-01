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
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.12 }}
          style={{ top: adjustedY, left: adjustedX }}
          className="fixed z-50 w-44 rounded-xl shadow-2xl glass-panel premium-card py-1.5 text-gray-900 dark:text-gray-100 overflow-hidden"
        >
          {/* Reaction Quick Bar */}
          {onReact && (
            <div className="flex items-center justify-around px-2 py-1 mb-1 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/10">
              {reactionEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onReact(emoji);
                    onClose();
                  }}
                  className="hover:scale-125 text-base transition-transform p-1 cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Action Items */}
          {items.map((item, idx) => {
            if (item.divider) {
              return <div key={idx} className="border-t border-gray-100 dark:border-white/5 my-1" />;
            }
            return (
              <button
                key={idx}
                onClick={(e) => {
                  item.onClick && item.onClick(e);
                  onClose();
                }}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
                  item.danger
                    ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5"
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
