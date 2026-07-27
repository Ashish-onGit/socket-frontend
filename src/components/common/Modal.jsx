import React from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Modal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md overflow-hidden rounded-[24px] bg-white dark:bg-[#0E1117]/95 backdrop-blur-2xl border border-slate-200 dark:border-[rgba(255,255,255,0.08)] p-6 text-slate-900 dark:text-white z-10 shadow-xl dark:shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[rgba(255,255,255,0.08)] pb-3.5 mb-4">
              <h3 className="text-lg font-extrabold font-sans tracking-wide text-slate-900 dark:text-white">{title}</h3>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center w-8 h-8 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="relative font-sans text-sm">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
