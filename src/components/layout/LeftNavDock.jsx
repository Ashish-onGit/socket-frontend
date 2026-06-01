import React from "react";
import { useSelector } from "react-redux";
import { FiClock, FiFileText, FiEye, FiUsers, FiBarChart2, FiVideo } from "react-icons/fi";
import Avatar from "../common/Avatar";
import Tooltip from "../common/Tooltip";
import ThemeSwitcher from "../common/ThemeSwitcher";
import { useLocation, useNavigate } from "react-router-dom";

export default function LeftNavDock({ theme, toggleTheme, onOpenSettings }) {
  const currentUser = useSelector((state) => state.auth.user);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: <FiClock size={18} />, label: "Chats History", path: "/chat" },
    { icon: <FiFileText size={18} />, label: "Files", path: "/files" },
    { icon: <FiEye size={18} />, label: "Channels", path: "/channels" },
    { icon: <FiUsers size={18} />, label: "Contacts", path: "/contacts" },
    { icon: <FiBarChart2 size={18} />, label: "Analytics", path: "/analytics" },
    { icon: <FiVideo size={18} />, label: "Calls", path: "/calls" }
  ];

  return (
    <div className="w-16 h-full flex flex-col justify-between items-center py-5 border-r border-brand-border-light dark:border-white/5 bg-white dark:bg-brand-sec-dark flex-shrink-0 relative z-10">
      {/* Brand Logo */}
      <div 
        onClick={() => navigate("/chat")}
        className="flex flex-col items-center select-none cursor-pointer"
      >
        <div className="w-8 h-8 rounded-xl bg-brand-teal text-white flex items-center justify-center font-bold shadow-md shadow-brand-teal/20">
          ▲
        </div>
      </div>

      {/* Navigation Icons */}
      <div className="flex flex-col gap-6 w-full items-center">
        {navItems.map((item, idx) => {
          const isActive = item.path === "/chat"
            ? (location.pathname.startsWith("/chat") || location.pathname.startsWith("/archived"))
            : location.pathname.startsWith(item.path);
          return (
            <Tooltip key={idx} text={item.label} position="right">
              <button
                onClick={() => navigate(item.path)}
                className={`p-2.5 rounded-xl transition-all duration-200 cursor-pointer relative flex items-center justify-center ${
                  isActive
                    ? "bg-brand-teal/10 text-brand-teal"
                    : "text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-white/5"
                }`}
              >
                {/* Active vertical bar on the left */}
                {isActive && (
                  <span className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-brand-teal rounded-r" />
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
          className="cursor-pointer hover:scale-105 active:scale-95 transition-transform"
        >
          <Avatar name={currentUser?.username} size="sm" showStatus={true} isOnline={true} />
        </div>
      </div>
    </div>
  );
}
