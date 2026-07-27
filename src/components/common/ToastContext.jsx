import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Portal Container */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[99999] flex flex-col gap-2.5 items-center w-full max-w-sm px-4 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            let icon = <FiCheckCircle className="text-[#0D9488] flex-shrink-0" size={18} />;
            let borderClass = "border-l-4 border-[#0D9488]";
            
            if (t.type === "error") {
              icon = <FiAlertCircle className="text-red-500 flex-shrink-0" size={18} />;
              borderClass = "border-l-4 border-red-500";
            } else if (t.type === "info") {
              icon = <FiInfo className="text-sky-500 dark:text-sky-400 flex-shrink-0" size={18} />;
              borderClass = "border-l-4 border-sky-500 dark:border-sky-400";
            }

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`pointer-events-auto flex items-center justify-between w-full p-3.5 rounded-[16px] shadow-xl dark:shadow-[0_10px_30px_rgba(0,0,0,0.6)] bg-white dark:bg-[#0E1117]/95 backdrop-blur-2xl border border-slate-200 dark:border-[rgba(255,255,255,0.08)] ${borderClass}`}
              >
                <div className="flex items-center gap-3">
                  {icon}
                  <span className="text-xs font-bold text-slate-900 dark:text-white tracking-wide font-sans">{t.message}</span>
                </div>
                <button
                  onClick={() => removeToast(t.id)}
                  className="text-slate-400 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors p-1 flex items-center justify-center cursor-pointer"
                >
                  <FiX size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
