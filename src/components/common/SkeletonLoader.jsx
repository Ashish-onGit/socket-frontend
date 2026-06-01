import React from "react";

export default function SkeletonLoader({ variant = "chatList", count = 3 }) {
  const pulseClass = "animate-pulse bg-gray-200 dark:bg-zinc-700/80 rounded";

  if (variant === "chatList") {
    return (
      <div className="space-y-4 w-full">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="flex items-center gap-3 p-3">
            <div className={`${pulseClass} w-10 h-10 rounded-full flex-shrink-0`} />
            <div className="flex-1 space-y-2 min-w-0">
              <div className="flex justify-between">
                <div className={`${pulseClass} w-24 h-4`} />
                <div className={`${pulseClass} w-10 h-3`} />
              </div>
              <div className={`${pulseClass} w-40 h-3`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "messageList") {
    return (
      <div className="space-y-6 w-full p-4">
        {Array.from({ length: count }).map((_, idx) => {
          const fromSelf = idx % 2 === 0;
          return (
            <div key={idx} className={`flex w-full ${fromSelf ? "justify-end" : "justify-start"}`}>
              <div className={`flex items-end gap-2 max-w-[70%] ${fromSelf ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`${pulseClass} w-8 h-8 rounded-full flex-shrink-0`} />
                <div className="space-y-1">
                  <div className={`${pulseClass} h-12 w-48 rounded-2xl ${fromSelf ? "rounded-br-none" : "rounded-bl-none"}`} />
                  <div className={`${pulseClass} h-3 w-12 ${fromSelf ? "ml-auto" : "mr-auto"}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (variant === "profile") {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-4 w-full">
        <div className={`${pulseClass} w-24 h-24 rounded-full`} />
        <div className={`${pulseClass} w-32 h-5`} />
        <div className={`${pulseClass} w-48 h-3.5`} />
        <div className="w-full pt-4 space-y-3">
          <div className="flex justify-between">
            <div className={`${pulseClass} w-20 h-4`} />
            <div className={`${pulseClass} w-10 h-4`} />
          </div>
          <div className="flex justify-between">
            <div className={`${pulseClass} w-24 h-4`} />
            <div className={`${pulseClass} w-8 h-4`} />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
