import React, { useState } from "react";
import { motion } from "framer-motion";

export default function AnimatedInput({
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconClick,
  placeholder = "",
  value,
  onChange,
  onKeyDown,
  type = "text",
  error = "",
  success = false,
  className = "",
  inputClassName = "",
  disabled = false,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);

  let borderStyle = "border-slate-300 dark:border-[rgba(255,255,255,0.08)]";
  if (error) {
    borderStyle = "border-red-500/60 text-red-600 dark:text-red-300";
  } else if (success) {
    borderStyle = "border-green-500/60 text-green-600 dark:text-green-300";
  } else if (isFocused) {
    borderStyle = "border-slate-500 dark:border-zinc-500";
  }

  return (
    <div className={`flex flex-col gap-1 w-full font-sans ${className}`}>
      <div
        className={`relative flex items-center w-full bg-white dark:bg-[#0E1117]/90 backdrop-blur-md rounded-[16px] border px-3.5 py-2.5 transition-colors duration-200 shadow-sm ${borderStyle}`}
      >
        {Icon && (
          <Icon
            className={`w-4 h-4 mr-2.5 flex-shrink-0 transition-colors duration-200 ${
              isFocused ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-zinc-500"
            }`}
          />
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full bg-transparent text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none disabled:opacity-50 ${inputClassName}`}
          {...props}
        />
        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="ml-2 text-slate-400 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer p-1"
          >
            <RightIcon className="w-4 h-4" />
          </button>
        )}
      </div>
      {error && (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] text-red-400 font-medium ml-1"
        >
          {error}
        </motion.span>
      )}
    </div>
  );
}
