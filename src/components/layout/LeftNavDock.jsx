import React from "react";
import { useSelector } from "react-redux";
import { MessageSquare, Folder, Radio, Users, BarChart2, Video } from "lucide-react";
import { motion } from "framer-motion";
import Avatar from "../common/Avatar";
import Tooltip from "../common/Tooltip";
import ThemeSwitcher from "../common/ThemeSwitcher";
import { useLocation, useNavigate } from "react-router-dom";

export default function LeftNavDock({ theme, toggleTheme, onOpenSettings }) {
  const currentUser = useSelector((state) => state.auth.user);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: <MessageSquare className="w-5 h-5" />, label: "Chats History", path: "/chat" },
    { icon: <Folder className="w-5 h-5" />, label: "Files", path: "/files" },
    { icon: <Radio className="w-5 h-5" />, label: "Channels", path: "/channels" },
    { icon: <Users className="w-5 h-5" />, label: "Contacts", path: "/contacts" },
    { icon: <BarChart2 className="w-5 h-5" />, label: "Analytics", path: "/analytics" },
    { icon: <Video className="w-5 h-5" />, label: "Calls", path: "/calls" },
  ];

  return (
    <div className="w-16 h-full flex flex-col justify-between items-center py-5 border-r border-slate-200 dark:border-[rgba(255,255,255,0.08)] bg-slate-50/90 dark:bg-[#0B0F14]/90 backdrop-blur-xl flex-shrink-0 relative z-20 select-none">
      {/* Brand Logo with Glow */}
      <div
        onClick={() => navigate("/chat")}
        className="flex flex-col items-center cursor-pointer group"
      >
        <div
          className="w-9 h-9 rounded-[14px] bg-[#0D9488] text-white flex items-center justify-center font-bold shadow-sm transition-colors duration-200"
        >
          ▲
        </div>
      </div>

      {/* Navigation Icons */}
      <div className="flex flex-col gap-3 w-full items-center px-2">
        {navItems.map((item, idx) => {
          const isActive =
            item.path === "/chat"
              ? location.pathname.startsWith("/chat") || location.pathname.startsWith("/archived")
              : location.pathname.startsWith(item.path);

          return (
            <Tooltip key={idx} text={item.label} position="right">
              <button
                onClick={() => navigate(item.path)}
                className={`w-11 h-11 rounded-[16px] transition-colors duration-200 cursor-pointer relative flex items-center justify-center ${
                  isActive
                    ? "bg-[#0D9488]/15 text-[#0D9488] shadow-none"
                    : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-white/5"
                }`}
              >
                {/* Active indicator pill */}
                {isActive && (
                  <span
                    className="absolute -left-2 w-1.5 h-6 bg-[#0D9488] rounded-r-full shadow-none"
                  />
                )}
                {item.icon}
              </button>
            </Tooltip>
          );
        })}
      </div>

      {/* Theme Switcher & Current User Avatar */}
      <div className="flex flex-col items-center gap-4">
        <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
        <div
          onClick={onOpenSettings}
          className="cursor-pointer relative p-0.5 rounded-full border border-transparent hover:border-slate-300 dark:hover:border-white/20 transition-colors shadow-sm"
        >
          <Avatar name={currentUser?.username} size="sm" showStatus={true} isOnline={true} />
        </div>
      </div>
    </div>
  );
}
