import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, MessageSquare, Shield, Send, Heart, Flame, Rocket } from "lucide-react";

export default function HeroOrbit() {
  return (
    <div className="relative w-full max-w-xl mx-auto h-[320px] sm:h-[360px] flex items-center justify-center select-none my-2">
      {/* Background Radial Spotlight Glow for Hero */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] bg-gradient-to-tr from-[#00E5B0]/20 via-[#5B8CFF]/15 to-[#8B5CF6]/20 rounded-full blur-[70px] pointer-events-none animate-pulse" />

      {/* Outer Rotating Orbit Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        className="absolute w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] rounded-full border border-dashed border-slate-300 dark:border-[rgba(255,255,255,0.08)] flex items-center justify-center pointer-events-none"
      >
        {/* Orbital Node 1 on Outer Ring */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#00E5B0] shadow-[0_0_12px_#00E5B0]" />
        {/* Orbital Node 2 on Outer Ring */}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#8B5CF6] shadow-[0_0_10px_#8B5CF6]" />
      </motion.div>

      {/* Middle Counter-Rotating Orbit Ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] rounded-full border border-slate-200 dark:border-[rgba(255,255,255,0.06)] flex items-center justify-center pointer-events-none"
      >
        {/* Orbital Node on Middle Ring */}
        <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 rounded-full bg-[#5B8CFF] shadow-[0_0_10px_#5B8CFF]" />
      </motion.div>

      {/* Inner Pulsing Ring */}
      <div className="absolute w-[130px] h-[130px] sm:w-[150px] sm:h-[150px] rounded-full border border-[#00E5B0]/20 animate-ping pointer-events-none opacity-20" />

      {/* Center 3D Glass Chat Orb / AI Assistant Orb */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-[32px] bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-[#12161f] dark:via-[#0E1117] dark:to-[#050505] border border-slate-200 dark:border-[rgba(255,255,255,0.15)] shadow-lg flex flex-col items-center justify-center cursor-pointer group transition-shadow hover:shadow-xl"
      >
        {/* Glowing inner core */}
        <div className="absolute inset-2 rounded-[24px] bg-gradient-to-br from-[#0D9488]/15 via-transparent to-[#8B5CF6]/15 opacity-70 group-hover:opacity-100 transition-opacity" />
        
        {/* Center Icon */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="p-3 rounded-2xl bg-gradient-to-tr from-[#0D9488]/20 to-[#5B8CFF]/20 border border-white/10 shadow-inner"
          >
            <Sparkles className="w-8 h-8 sm:w-9 sm:h-9 text-[#0D9488]" />
          </motion.div>
        </div>
      </motion.div>

      {/* --- FLOATING ILLUSTRATION ELEMENTS AROUND HERO --- */}

      {/* 1. Top-Left Live Notification Bubble */}
      <motion.div
        initial={{ opacity: 0, x: -30, y: -20 }}
        animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.2 },
          x: { duration: 0.6, delay: 0.2 },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute top-4 sm:top-6 left-2 sm:left-6 bg-white/90 dark:bg-[#0E1117]/90 backdrop-blur-xl border border-slate-200 dark:border-[rgba(255,255,255,0.08)] px-3.5 py-2 rounded-2xl shadow-sm flex items-center gap-2.5 z-20 cursor-default hover:border-slate-300 dark:hover:border-[rgba(255,255,255,0.2)] transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#5B8CFF] flex items-center justify-center text-[10px] font-bold text-white shadow-inner flex-shrink-0 relative">
          SA
          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#0D9488] border border-white dark:border-[#0E1117]" />
        </div>
        <div className="flex flex-col text-left min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-900 dark:text-white">Sarah A.</span>
            <span className="text-[9px] text-slate-400 dark:text-zinc-500">Just now</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-zinc-300 truncate font-sans">
            Have you seen the new design? 🔥
          </p>
        </div>
      </motion.div>

      {/* 2. Top-Right Typing Indicator Pill */}
      <motion.div
        initial={{ opacity: 0, x: 30, y: -20 }}
        animate={{ opacity: 1, x: 0, y: [0, 8, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.3 },
          x: { duration: 0.6, delay: 0.3 },
          y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
        }}
        className="absolute top-6 sm:top-10 right-2 sm:right-6 bg-white/90 dark:bg-[#0E1117]/90 backdrop-blur-xl border border-slate-200 dark:border-[rgba(255,255,255,0.08)] px-3.5 py-2 rounded-2xl shadow-sm flex items-center gap-2.5 z-20 cursor-default hover:border-slate-300 dark:hover:border-[rgba(255,255,255,0.2)] transition-colors"
      >
        <div className="w-6 h-6 rounded-full bg-[#0D9488] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
          AL
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-slate-700 dark:text-zinc-300">Alex is typing</span>
          <div className="flex items-center gap-0.5 ml-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] animate-bounce" />
          </div>
        </div>
      </motion.div>

      {/* 3. Bottom-Left Emoji Reaction Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
        transition={{
          opacity: { duration: 0.5, delay: 0.4 },
          scale: { duration: 0.5, delay: 0.4 },
          y: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 },
        }}
        className="absolute bottom-6 sm:bottom-8 left-6 sm:left-12 bg-white/90 dark:bg-[#0E1117]/90 backdrop-blur-xl border border-slate-200 dark:border-[rgba(255,255,255,0.08)] px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2 z-20 text-xs hover:border-slate-300 dark:hover:border-white/20 transition-colors"
      >
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-slate-800 dark:text-white font-medium text-[11px]">
          🚀 24
        </span>
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-500/20 border border-pink-500/30 text-slate-800 dark:text-white font-medium text-[11px]">
          ❤️ 18
        </span>
      </motion.div>

      {/* 4. Bottom-Right Performance Status Pill */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1, y: [0, 6, 0] }}
        transition={{
          opacity: { duration: 0.5, delay: 0.5 },
          scale: { duration: 0.5, delay: 0.5 },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
        }}
        className="absolute bottom-4 sm:bottom-6 right-6 sm:right-14 bg-white/90 dark:bg-[#0E1117]/90 backdrop-blur-xl border border-slate-200 dark:border-[rgba(255,255,255,0.08)] px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-2 z-20 hover:border-slate-300 dark:hover:border-white/20 transition-colors"
      >
        <Zap className="w-3.5 h-3.5 text-[#0D9488] fill-[#0D9488]/20" />
        <span className="text-[11px] font-semibold text-slate-800 dark:text-zinc-200 tracking-wide">
          ⚡ &lt; 1ms Latency
        </span>
      </motion.div>

      {/* 5. Left Floating Avatar Node */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        className="hidden sm:flex absolute top-1/2 -left-6 -translate-y-1/2 w-9 h-9 rounded-full bg-gradient-to-tr from-[#0D9488] to-[#5B8CFF] p-[1.5px] shadow-sm z-15 items-center justify-center"
      >
        <div className="w-full h-full rounded-full bg-white dark:bg-[#0E1117] flex items-center justify-center text-[10px] font-bold text-slate-900 dark:text-white relative">
          JD
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#0D9488] border border-white dark:border-[#0E1117]" />
        </div>
      </motion.div>

      {/* 6. Right Floating Avatar Node */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1, y: [0, 12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        className="hidden sm:flex absolute top-1/2 -right-6 -translate-y-1/2 w-9 h-9 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-pink-500 p-[1.5px] shadow-sm z-15 items-center justify-center"
      >
        <div className="w-full h-full rounded-full bg-white dark:bg-[#0E1117] flex items-center justify-center text-[10px] font-bold text-slate-900 dark:text-white relative">
          EL
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#0D9488] border border-white dark:border-[#0E1117]" />
        </div>
      </motion.div>
    </div>
  );
}
