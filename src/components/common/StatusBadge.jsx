import React from "react";
import { motion } from "framer-motion";

export default function StatusBadge({
  status = "online", // online | offline | busy | away | custom
  label = "",
  pulse = true,
  className = "",
  size = "sm", // sm | md
}) {
  const statusColors = {
    online: "bg-[#0D9488] shadow-none",
    offline: "bg-zinc-500 shadow-none",
    busy: "bg-red-500 shadow-none",
    away: "bg-amber-400 shadow-none",
    custom: "bg-indigo-500 shadow-none",
  };

  const dotSize = size === "sm" ? "w-2 h-2" : "w-2.5 h-2.5";
  const textSize = size === "sm" ? "text-[11px]" : "text-xs";
  const padding = size === "sm" ? "px-2.5 py-1" : "px-3 py-1.5";

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-[#0E1117]/80 backdrop-blur-md border border-slate-200 dark:border-[rgba(255,255,255,0.08)] font-sans ${padding} ${className}`}
    >
      <span className={`relative flex ${dotSize}`}>
        {pulse && status !== "offline" && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusColors[status].split(" ")[0]}`}
          />
        )}
        <span
          className={`relative inline-flex rounded-full ${dotSize} ${statusColors[status]}`}
        />
      </span>
      {label && <span className={`font-medium text-slate-700 dark:text-zinc-300 ${textSize}`}>{label}</span>}
    </div>
  );
}
