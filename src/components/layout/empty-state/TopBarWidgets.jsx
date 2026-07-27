import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Clock, ShieldCheck, Sparkles } from "lucide-react";

export default function TopBarWidgets({ onlineUsers = [] }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const onlineCount = onlineUsers.length > 0 ? onlineUsers.length : 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-4 inset-x-0 w-full max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4 px-6 z-30 select-none pointer-events-auto"
    >
      {/* Live Online Users Counter Pill */}
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#0E1117]/80 backdrop-blur-md border border-slate-200 dark:border-[rgba(255,255,255,0.08)] shadow-sm hover:border-slate-300 dark:hover:border-white/20 transition-colors duration-200">
        <span className="relative flex h-2 w-2">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0D9488]"></span>
        </span>
        <Activity className="w-3.5 h-3.5 text-[#0D9488]" />
        <span className="text-xs font-medium text-slate-700 dark:text-zinc-300 tracking-wide">
          <strong className="text-slate-900 dark:text-white font-semibold">{onlineCount}</strong> online in network
        </span>
      </div>

      {/* Security Badge Pill (Mobile / Desktop) */}
      <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 dark:bg-[#0E1117]/60 backdrop-blur-md border border-slate-200 dark:border-[rgba(255,255,255,0.08)] text-slate-500 dark:text-zinc-400 text-xs">
        <ShieldCheck className="w-3.5 h-3.5 text-[#5B8CFF]" />
        <span>End-to-End Encrypted Tunnel</span>
      </div>

      {/* Today's Date / Live Time Widget */}
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#0E1117]/80 backdrop-blur-md border border-slate-200 dark:border-[rgba(255,255,255,0.08)] shadow-sm text-xs text-slate-700 dark:text-zinc-300 font-mono">
        <Clock className="w-3.5 h-3.5 text-[#8B5CF6]" />
        <span>{formattedTime}</span>
        <span className="text-slate-400 dark:text-zinc-600">•</span>
        <span className="text-slate-500 dark:text-zinc-400 font-sans font-medium">{formattedDate}</span>
      </div>
    </motion.div>
  );
}
