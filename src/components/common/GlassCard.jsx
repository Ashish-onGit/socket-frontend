import React from "react";
import { motion } from "framer-motion";

export default function GlassCard({
  children,
  className = "",
  hoverEffect = false,
  onClick,
  radius = "rounded-[20px]",
  ...props
}) {
  const baseClasses = `bg-white/80 dark:bg-[#0E1117]/80 backdrop-blur-md border border-slate-200 dark:border-[rgba(255,255,255,0.08)] shadow-sm dark:shadow-[0_4px_25px_rgba(0,0,0,0.3)] transition-all duration-300 ${radius} ${className}`;

  if (hoverEffect || onClick) {
    return (
      <div
        onClick={onClick}
        className={`${baseClasses} hover:border-slate-300 dark:hover:border-white/20 transition-colors duration-200 ${onClick ? "cursor-pointer" : ""}`}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <div className={baseClasses} onClick={onClick} {...props}>
      {children}
    </div>
  );
}
