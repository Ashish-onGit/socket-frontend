import React from "react";

const COLORS = [
  "bg-indigo-500 text-white",
  "bg-purple-500 text-white",
  "bg-pink-500 text-white",
  "bg-blue-500 text-white",
  "bg-emerald-500 text-white",
  "bg-teal-500 text-white",
  "bg-amber-500 text-white",
  "bg-rose-500 text-white"
];

function getAvatarColor(name) {
  if (!name) return COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLORS.length;
  return COLORS[index];
}

export default function Avatar({ name, size = "md", isOnline = false, showStatus = true }) {
  const initials = name ? name.substring(0, 2).toUpperCase() : "?";
  const colorClass = getAvatarColor(name);

  const sizeClasses = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs font-medium",
    md: "w-10 h-10 text-sm font-semibold",
    lg: "w-12 h-12 text-base font-bold",
    xl: "w-16 h-16 text-xl font-bold",
    xxl: "w-24 h-24 text-3xl font-bold"
  };

  const statusClasses = {
    xs: "w-2 h-2 border",
    sm: "w-2.5 h-2.5 border-2",
    md: "w-3 h-3 border-2",
    lg: "w-3.5 h-3.5 border-2",
    xl: "w-4 h-4 border-2",
    xxl: "w-5 h-5 border-2"
  };

  return (
    <div className="relative inline-flex items-center justify-center select-none flex-shrink-0">
      <div
        className={`rounded-full flex items-center justify-center uppercase shadow-sm ${sizeClasses[size]} ${colorClass}`}
      >
        {initials}
      </div>
      {showStatus && (
        <span
          className={`absolute bottom-0 right-0 rounded-full border-white dark:border-[#1A1A1A] transition-all duration-300 ${
            statusClasses[size]
          } ${isOnline ? "bg-emerald-500" : "bg-gray-400"}`}
        />
      )}
    </div>
  );
}
