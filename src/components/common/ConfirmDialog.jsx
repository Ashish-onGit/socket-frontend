import React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  type = "danger" // danger, info, success
}) {
  const accentColorClass =
    type === "danger"
      ? "bg-red-600 hover:bg-red-700"
      : type === "success"
      ? "bg-emerald-600 hover:bg-emerald-700"
      : "bg-indigo-600 hover:bg-indigo-700";

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-sm overflow-hidden rounded-[24px] bg-white dark:bg-[#0E1117]/95 backdrop-blur-2xl border border-slate-200 dark:border-[rgba(255,255,255,0.08)] p-6 text-slate-900 dark:text-white z-10 shadow-xl dark:shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
          >
            {/* Icon & Title */}
            <div className="mb-4">
              <h3 className="text-lg font-extrabold font-sans tracking-wide mb-2 flex items-center gap-2 text-slate-900 dark:text-white">
                {type === "danger" && <span className="text-red-500 font-bold text-xl">⚠️</span>}
                {title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed font-sans">{message}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white border border-slate-300 dark:border-[rgba(255,255,255,0.08)] transition-all duration-200 cursor-pointer"
              >
                {cancelLabel}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`px-4 py-2 text-xs font-extrabold rounded-xl text-white shadow-lg transition-all duration-200 cursor-pointer ${accentColorClass}`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
}
