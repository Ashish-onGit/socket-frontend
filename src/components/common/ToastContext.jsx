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
            let icon = <FiCheckCircle className="text-emerald-500 flex-shrink-0" size={18} />;
            let borderClass = "border-l-4 border-emerald-500";
            
            if (t.type === "error") {
              icon = <FiAlertCircle className="text-red-500 flex-shrink-0" size={18} />;
              borderClass = "border-l-4 border-red-500";
            } else if (t.type === "info") {
              icon = <FiInfo className="text-indigo-500 flex-shrink-0" size={18} />;
              borderClass = "border-l-4 border-indigo-500";
            }

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ type: "spring", duration: 0.35 }}
                className={`pointer-events-auto flex items-center justify-between w-full p-3.5 rounded-xl shadow-2xl bg-white dark:bg-zinc-800 border border-gray-100 dark:border-white/5 ${borderClass}`}
              >
                <div className="flex items-center gap-3">
                  {icon}
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-100 tracking-wide font-sans">{t.message}</span>
                </div>
                <button
                  onClick={() => removeToast(t.id)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 flex items-center justify-center cursor-pointer"
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
