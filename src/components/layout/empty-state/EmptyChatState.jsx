import React, { useEffect } from "react";
import { motion } from "framer-motion";
import TopBarWidgets from "./TopBarWidgets";
import HeroOrbit from "./HeroOrbit";

const particles = [
  { top: "15%", left: "12%", size: "w-1 h-1", delay: 0 },
  { top: "25%", left: "85%", size: "w-1.5 h-1.5", delay: 1 },
  { top: "65%", left: "8%", size: "w-1 h-1", delay: 2 },
  { top: "75%", left: "88%", size: "w-2 h-2", delay: 1.5 },
  { top: "45%", left: "92%", size: "w-1 h-1", delay: 0.5 },
  { top: "85%", left: "20%", size: "w-1.5 h-1.5", delay: 2.5 },
];

export default function EmptyChatState({ onlineUsers = [], currentUser = null }) {
  // Global shortcut to open sidebar search/new chat when in empty state
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "f" || e.key === "k")) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("open-new-chat"));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex-1 w-full h-full bg-slate-50 dark:bg-[#050505] relative overflow-hidden flex flex-col items-center justify-center select-none">
      {/* --- BACKGROUND LAYERS --- */}
      
      {/* Dotted Matrix / High-Tech Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),dark:linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_65%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* Aurora Gradient Mesh & Glowing Radial Blobs */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-[#00E5B0]/25 via-[#5B8CFF]/15 to-[#8B5CF6]/25 rounded-full blur-[140px] pointer-events-none z-0"
      />
      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute -bottom-48 -right-24 w-[550px] h-[550px] bg-[#8B5CF6]/20 rounded-full blur-[150px] pointer-events-none z-0"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/3 -left-40 w-[450px] h-[450px] bg-[#00E5B0]/15 rounded-full blur-[140px] pointer-events-none z-0"
      />

      {/* Subtle Floating Ambient Particles */}
      {particles.map((p, idx) => (
        <motion.div
          key={idx}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: 5 + idx,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
          style={{ top: p.top, left: p.left }}
          className={`absolute rounded-full bg-[#0D9488]/50 blur-[0.5px] pointer-events-none z-0 ${p.size}`}
        />
      ))}

      {/* --- TOP BAR WIDGETS --- */}
      {/* <TopBarWidgets onlineUsers={onlineUsers} /> */}
      {/* --- MAIN CONTENT CENTER --- */}
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center px-4 py-6 z-10 my-auto">
        {/* Animated Hero Section with 3D Glass Orb */}
        <HeroOrbit />

        {/* Heading & Badge Section */}
        <div className="space-y-3 mt-2 sm:mt-4 z-10 max-w-2xl mx-auto">
          {/* Mini Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 dark:bg-[#0E1117]/90 border border-slate-200 dark:border-[rgba(255,255,255,0.08)] shadow-sm backdrop-blur-md cursor-default"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-slate-700 dark:text-zinc-300 font-sans">
              Next-Gen Realtime Engine
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight font-sans"
          >
            Start Meaningful{" "}
            <span className="bg-gradient-to-r from-[#0D9488] via-[#5B8CFF] to-[#8B5CF6] bg-clip-text text-transparent">
              Conversations
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed font-normal font-sans"
          >
            Select a conversation or start a new channel to experience instant, secure
            messaging with beautiful interactions.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
