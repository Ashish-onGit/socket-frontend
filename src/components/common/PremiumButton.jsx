import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function PremiumButton({
  children,
  onClick,
  variant = "primary", // primary | secondary | outline | ghost | danger
  size = "md", // sm | md | lg
  icon: Icon,
  disabled = false,
  loading = false,
  className = "",
  type = "button",
  ...props
}) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs rounded-xl gap-1.5",
    md: "px-4 py-2.5 text-sm rounded-[16px] gap-2",
    lg: "px-6 py-3 text-base rounded-[16px] gap-2.5",
  };

  const variantClasses = {
    primary:
      "bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold shadow-sm border border-transparent",
    secondary:
      "bg-slate-200 hover:bg-slate-300 dark:bg-[#0E1117]/90 dark:hover:bg-[#161b24] text-slate-800 dark:text-zinc-200 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-[rgba(255,255,255,0.08)] hover:border-slate-400 dark:hover:border-white/20 shadow-sm",
    outline:
      "bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-[rgba(255,255,255,0.15)] hover:border-slate-400 dark:hover:border-white/30 shadow-sm",
    ghost:
      "bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white border border-transparent",
    danger:
      "bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm border border-transparent",
  };

  const baseClasses = `inline-flex items-center justify-center font-sans transition-colors duration-200 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  return (
    <button
      type={type}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      className={baseClasses}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 flex-shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}
