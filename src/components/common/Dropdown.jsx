import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Dropdown({ trigger, items, align = "right" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    const handleCloseEvent = () => {
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("contextmenu", handleClickOutside);
    window.addEventListener("close-menus", handleCloseEvent);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("contextmenu", handleClickOutside);
      window.removeEventListener("close-menus", handleCloseEvent);
    };
  }, []);

  const alignClasses = align === "left" ? "left-0" : "right-0";

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div 
        onClick={(e) => { 
          e.stopPropagation(); 
          if (!isOpen) {
            window.dispatchEvent(new CustomEvent("close-menus"));
          }
          setIsOpen(!isOpen); 
        }} 
        className="cursor-pointer"
      >
        {trigger}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className={`absolute ${alignClasses} mt-2 w-48 rounded-[16px] shadow-xl dark:shadow-[0_10px_30px_rgba(0,0,0,0.6)] bg-white dark:bg-[#0E1117]/95 backdrop-blur-2xl border border-slate-200 dark:border-[rgba(255,255,255,0.08)] z-50 overflow-hidden py-1.5 text-slate-900 dark:text-white`}
          >
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
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-xs text-left transition-colors cursor-pointer ${
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
    </div>
  );
}
