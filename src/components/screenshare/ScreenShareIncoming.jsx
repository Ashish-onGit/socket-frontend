import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMonitor, FiCheck, FiX } from "react-icons/fi";
import { useScreenShareContext } from "../../context/ScreenShareContext";

export default function ScreenShareIncoming() {
  const { incomingRequest, acceptShare, declineShare } = useScreenShareContext();

  if (!incomingRequest) return null;

  const { fromUser } = incomingRequest;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.95 }}
        className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[60] w-[90%] max-w-sm"
      >
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 p-5 overflow-hidden relative">
          
          {/* Background Glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-teal/20 blur-3xl rounded-full pointer-events-none" />

          <div className="flex items-start space-x-4 relative z-10">
            <div className="w-12 h-12 rounded-full bg-brand-teal/10 flex items-center justify-center flex-shrink-0 text-brand-teal">
              <FiMonitor size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-gray-900 dark:text-white font-semibold text-base">
                Screen Share Request
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {fromUser?.name || fromUser?.username}
                </span>{" "}
                wants to share their screen with you.
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center space-x-3">
            <button
              onClick={declineShare}
              className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-medium text-sm transition-colors flex items-center justify-center space-x-2"
            >
              <FiX size={16} />
              <span>Decline</span>
            </button>
            <button
              onClick={acceptShare}
              className="flex-1 py-2.5 rounded-xl bg-brand-teal hover:bg-teal-500 text-white font-medium text-sm transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-brand-teal/25"
            >
              <FiCheck size={16} />
              <span>Accept</span>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
