import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMessageSquare,
  FiFileText,
  FiHash,
  FiUsers,
  FiSettings,
  FiArchive,
  FiUser,
} from "react-icons/fi";
import { updateProfile } from "../../features/auth/authSlice";
import {
  loadUserChats,
  addMessage,
  editMessage,
  deleteMessage,
  toggleReaction,
  markAsRead,
  setConversations,
} from "../../features/chat/chatSlice";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import InfoPanel from "./InfoPanel";
import Avatar from "../common/Avatar";
import LeftNavDock from "./LeftNavDock";
import ConfirmDialog from "../common/ConfirmDialog";
import { useToast } from "../common/ToastContext";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FilesSidebar,
  FilesMainArea,
  ChannelsSidebar,
  ChannelsMainArea,
  ContactsSidebar,
  ContactsMainArea,
  AnalyticsSidebar,
  AnalyticsMainArea,
  CallsSidebar,
  CallsMainArea,
  SettingsSidebar,
  SettingsMainArea,
} from "./SubViews";

export default function MainLayout({ socket, onLogout, theme, toggleTheme }) {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const currentUser = useSelector((state) => state.auth.user);
  const activeConversation = useSelector(
    (state) => state.chat.activeConversation,
  );
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const searchParams = new URLSearchParams(location.search);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = React.useCallback((mouseDownEvent) => {
    mouseDownEvent.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = React.useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = React.useCallback(
    (mouseMoveEvent) => {
      if (isResizing) {
        const newWidth = mouseMoveEvent.clientX - 64; // ClientX minus rail width
        if (newWidth >= 150 && newWidth <= 400) {
          setSidebarWidth(newWidth);
        }
      }
    },
    [isResizing],
  );

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Layout toggles
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // States managed locally
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({}); // { [username]: boolean }

  // Settings states
  const [settingsBio, setSettingsBio] = useState(
    currentUser?.bio || "Hey there! I am using SocketChat.",
  );

  // Load chats from database on login
  useEffect(() => {
    if (currentUser?.token) {
      const fetchChats = async () => {
        try {
          const backendURL =
            import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
          const res = await fetch(`${backendURL}/api/conversations`, {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            dispatch(setConversations(data));
          }
        } catch (err) {
          console.error("Failed to load chats from server:", err);
        }
      };
      fetchChats();
    }
  }, [currentUser?.token, dispatch]);

  // Hydrate settings bio
  useEffect(() => {
    if (currentUser?.bio) {
      setSettingsBio(currentUser.bio);
    }
  }, [currentUser]);

  // Desktop redirection for missing query parameters
  useEffect(() => {
    const handleDesktopRedirect = () => {
      if (window.innerWidth < 768) return;

      const searchParams = new URLSearchParams(location.search);
      if (currentPath === "/channels" && !searchParams.get("name")) {
        navigate("/channels?name=%23general", { replace: true });
      } else if (currentPath === "/files" && !searchParams.get("category")) {
        navigate("/files?category=all", { replace: true });
      }
    };

    handleDesktopRedirect();

    window.addEventListener("resize", handleDesktopRedirect);
    return () => window.removeEventListener("resize", handleDesktopRedirect);
  }, [currentPath, location.search, navigate]);

  // Socket Events
  useEffect(() => {
    if (!socket || !currentUser?.username) return;

    // Register user with socket
    socket.emit("register_user", currentUser.username);

    // Online Users list listener
    socket.on("online_users_list", (users) => {
      setOnlineUsers(users.filter((u) => u !== currentUser.username));
    });

    // Receive message listener
    socket.on("receive_message", (data) => {
      // Re-route message to redux
      // Set receiver as currentUser
      dispatch(
        addMessage({
          message: data,
          currentUser: currentUser.username,
        }),
      );
      // Auto-consider outgoing messages as read by other user if they replied
      dispatch(
        markAsRead({
          participant: data.sender,
          currentUser: currentUser.username,
          fromSelf: false,
        }),
      );
      // showToast(`New message from ${data.sender}`, "info");
    });

    // Message events listener
    socket.on("message_edited", (data) => {
      dispatch(
        editMessage({
          messageId: data.id,
          newContent: data.newContent,
          participant: data.sender,
          currentUser: currentUser.username,
        }),
      );
    });

    socket.on("message_deleted", (data) => {
      dispatch(
        deleteMessage({
          messageId: data.id,
          participant: data.sender,
          currentUser: currentUser.username,
        }),
      );
    });

    socket.on("message_reacted", (data) => {
      dispatch(
        toggleReaction({
          messageId: data.id,
          emoji: data.emoji,
          username: data.username,
          participant: data.sender,
          currentUser: currentUser.username,
        }),
      );
    });

    socket.on("message_read_receipt", (data) => {
      dispatch(
        markAsRead({
          participant: data.sender,
          currentUser: currentUser.username,
          fromSelf: false,
        }),
      );
    });

    // Typing Listeners
    socket.on("show_typing", (username) => {
      setTypingUsers((prev) => ({ ...prev, [username]: true }));
    });

    socket.on("hide_typing", (username) => {
      setTypingUsers((prev) => ({ ...prev, [username]: false }));
    });

    return () => {
      socket.off("online_users_list");
      socket.off("show_typing");
      socket.off("hide_typing");
      socket.off("message_edited");
      socket.off("message_deleted");
      socket.off("message_reacted");
      socket.off("message_read_receipt");
    };
  }, [socket, currentUser?.username, dispatch, showToast]);

  const handleSaveSettings = () => {
    dispatch(updateProfile({ bio: settingsBio }));
    showToast("Profile settings updated", "success");
  };

  // Import addMessage, editMessage, deleteMessage, toggleReaction, markAsRead locally if needed
  // (We imported them at top of file already!)

  const isCurrentChatOnline = onlineUsers.includes(activeConversation);

  // Determine current routing subviews
  let sidebarElement = null;
  let mainElement = null;
  let showRightPanel = false;

  if (currentPath.startsWith("/files")) {
    sidebarElement = (
      <FilesSidebar
        onCategorySelect={(cat) => navigate(`/files?category=${cat}`)}
      />
    );
    mainElement = <FilesMainArea />;
  } else if (currentPath.startsWith("/channels")) {
    sidebarElement = <ChannelsSidebar />;
    mainElement = <ChannelsMainArea />;
  } else if (currentPath.startsWith("/contacts")) {
    sidebarElement = <ContactsSidebar onlineUsers={onlineUsers} />;
    mainElement = <ContactsMainArea onlineUsers={onlineUsers} />;
  } else if (currentPath.startsWith("/analytics")) {
    sidebarElement = <AnalyticsSidebar />;
    mainElement = <AnalyticsMainArea />;
  } else if (currentPath.startsWith("/calls")) {
    sidebarElement = <CallsSidebar />;
    mainElement = <CallsMainArea />;
  } else if (currentPath.startsWith("/settings")) {
    sidebarElement = <SettingsSidebar />;
    mainElement = (
      <SettingsMainArea
        currentUser={currentUser}
        settingsBio={settingsBio}
        setSettingsBio={setSettingsBio}
        handleSaveSettings={handleSaveSettings}
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={() => setShowLogoutConfirm(true)}
      />
    );
  } else {
    // Default chat view (/chat or /)
    sidebarElement = (
      <Sidebar
        theme={theme}
        toggleTheme={toggleTheme}
        onlineUsers={onlineUsers}
        onOpenSettings={() => navigate("/settings")}
        onLogout={() => setShowLogoutConfirm(true)}
      />
    );
    mainElement = (
      <ChatArea
        socket={socket}
        onlineUsers={onlineUsers}
        typingUsers={typingUsers}
        onToggleInfoPanel={() => setShowInfoPanel(!showInfoPanel)}
      />
    );
    showRightPanel = showInfoPanel && activeConversation;
  }

  // Settings is always full-page (no sidebar); treat it like an active detail so mainElement shows on mobile
  const isSettingsPath = currentPath.startsWith("/settings");
  const isMobileDetailActive =
    isSettingsPath ||
    (currentPath === "/chat" || currentPath === "/archived"
      ? !!activeConversation
      : (currentPath === "/channels" && !!searchParams.get("name")) ||
        (currentPath === "/files" && !!searchParams.get("category")) ||
        (currentPath === "/contacts" && !!searchParams.get("username")) ||
        (currentPath === "/calls" && !!searchParams.get("dial")));

  // Bottom nav always visible on settings; hidden on detail views in other sections
  const isMobileNavVisible =
    isSettingsPath ||
    !isMobileDetailActive ||
    currentPath.startsWith("/analytics");

  const mobileNavItems = [
    { icon: <FiMessageSquare size={18} />, label: "Chats", path: "/chat" },
    { icon: <FiArchive size={18} />, label: "Archive", path: "/archived" },
    { icon: <FiFileText size={18} />, label: "Files", path: "/files" },
    { icon: <FiHash size={18} />, label: "Channels", path: "/channels" },
    { icon: <FiUser size={18} />, label: "Profile", path: "/settings" },
  ];

  const isMobile = windowWidth < 768;

  return (
    <div className="w-screen h-[100dvh] relative flex items-center justify-center p-0 md:p-4 bg-brand-bg-light dark:bg-brand-bg-dark overflow-hidden">
      {/* Main Layout Container */}
      <div className="w-full h-full rounded-none md:rounded-[2rem] overflow-hidden bg-white dark:bg-brand-sec-dark flex flex-col relative z-10 border border-brand-border-light dark:border-white/5 shadow-2xl">
        {/* Workspace panel content area */}
        <div className="flex-1 flex flex-row min-h-0 relative">
          {isMobile ? (
            /* Mobile View (<768px): Animated Slide Transitions */
            <div className="flex-1 relative overflow-hidden w-full h-full">
              <AnimatePresence initial={false} mode="sync">
                {!isMobileDetailActive ? (
                  /* Screen 1: Sidebar (Chat List) */
                  <motion.div
                    key="mobile-sidebar"
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", damping: 26, stiffness: 210 }}
                    className="absolute inset-0 w-full h-full z-10"
                  >
                    {sidebarElement}
                  </motion.div>
                ) : (
                  /* Screen 2: Active Chat / Settings / Channels / Files details */
                  <motion.div
                    key="mobile-main"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 26, stiffness: 210 }}
                    className="absolute inset-0 w-full h-full z-10 bg-white dark:bg-brand-bg-dark flex flex-col"
                  >
                    {mainElement}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mobile sliding drawer overlay for InfoPanel */}
              <AnimatePresence>
                {showRightPanel && (
                  <>
                    {/* Backdrop overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.4 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowInfoPanel(false)}
                      className="absolute inset-0 bg-black z-30 backdrop-blur-xs"
                    />
                    {/* Sliding Drawer */}
                    <motion.div
                      initial={{ x: "100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "100%" }}
                      transition={{ type: "tween", duration: 0.3 }}
                      className="absolute right-0 top-0 bottom-0 z-40 w-full max-w-[320px] bg-white dark:bg-[#1A1A1A] h-full shadow-2xl"
                    >
                      <InfoPanel
                        activeConversation={activeConversation}
                        isOnline={isCurrentChatOnline}
                        onClose={() => setShowInfoPanel(false)}
                      />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* Tablet/Desktop View (>=768px): Side-by-side Layouts */
            <>
              {/* Left Navigation Dock - always visible on desktop/tablet */}
              <div className="h-full flex-shrink-0">
                <LeftNavDock
                  theme={theme}
                  toggleTheme={toggleTheme}
                  onOpenSettings={() => navigate("/settings")}
                />
              </div>

              {/* Sidebar - resizable on desktop (>=768px) */}
              {!isSettingsPath && (
                <>
                  <div
                    style={{ width: `${sidebarWidth}px` }}
                    className="h-full flex-shrink-0 overflow-hidden relative"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={currentPath}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 12 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        className="absolute inset-0 w-full h-full"
                      >
                        {sidebarElement}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Draggable resize handle */}
                  <div
                    onMouseDown={startResizing}
                    className={`w-[4px] hover:w-[6px] h-full cursor-col-resize transition-all select-none relative z-20 flex-shrink-0 ${
                      isResizing
                        ? "bg-brand-teal"
                        : "bg-gray-100 hover:bg-brand-teal/50 dark:bg-white/5 dark:hover:bg-brand-teal/50"
                    }`}
                  />
                </>
              )}

              {/* Chat / Main area - flexible with smooth workspace transition */}
              <div className="h-full flex-grow flex flex-col min-w-0 relative overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={currentPath}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full flex flex-col"
                  >
                    {mainElement}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Details Info Panel */}
              {/* Desktop layout: displays as static column beside ChatArea */}
              {showRightPanel && windowWidth >= 1200 && (
                <div className="h-full flex-shrink-0 w-[320px] border-l border-brand-border-light dark:border-white/5">
                  <InfoPanel
                    activeConversation={activeConversation}
                    isOnline={isCurrentChatOnline}
                    onClose={() => setShowInfoPanel(false)}
                  />
                </div>
              )}

              {/* Tablet layout: displays as a sliding drawer overlay from right */}
              <AnimatePresence>
                {showRightPanel && windowWidth < 1200 && (
                  <>
                    {/* Backdrop overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.4 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowInfoPanel(false)}
                      className="absolute inset-0 bg-black/40 z-30 backdrop-blur-xs"
                    />
                    {/* Sliding Drawer */}
                    <motion.div
                      initial={{ x: "100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "100%" }}
                      transition={{ type: "tween", duration: 0.3 }}
                      className="absolute right-0 top-0 bottom-0 z-40 w-[320px] bg-white dark:bg-[#1A1A1A] h-full shadow-2xl"
                    >
                      <InfoPanel
                        activeConversation={activeConversation}
                        isOnline={isCurrentChatOnline}
                        onClose={() => setShowInfoPanel(false)}
                      />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </>
          )}
        </div>

        {/* Pinterest-style Floating Glassmorphism Mobile Navigation */}
        {isMobileNavVisible && (
          <div className="md:hidden flex-shrink-0 flex justify-center pb-[calc(16px+env(safe-area-inset-bottom,0px))] pt-2 px-4 bg-transparent select-none z-30">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-full max-w-[420px] flex items-center justify-between p-2 px-3 rounded-[30px] bg-white/70 dark:bg-zinc-900/80 backdrop-blur-xl border border-gray-150/45 dark:border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
            >
              {mobileNavItems.map((item, idx) => {
                const isActive =
                  item.path === "/chat"
                    ? currentPath.startsWith("/chat")
                    : item.path
                      ? currentPath.startsWith(item.path)
                      : false;
                return (
                  <motion.button
                    key={idx}
                    onClick={() => navigate(item.path)}
                    whileTap={{ scale: 0.95 }}
                    className="relative flex flex-col items-center justify-center cursor-pointer select-none flex-1 min-w-[72px] max-w-[90px]"
                    style={{ height: "60px" }}
                  >
                    {/* Active elevated circular background container */}
                    {isActive && (
                      <motion.div
                        layoutId="nav-active-circle"
                        className="absolute top-1.5 w-11 h-11 rounded-full bg-white dark:bg-zinc-800 shadow-[0_4px_16px_rgba(13,148,136,0.18)] dark:shadow-[0_4px_16px_rgba(13,148,136,0.35)] border border-gray-100 dark:border-white/5 z-0"
                        transition={{
                          type: "spring",
                          damping: 24,
                          stiffness: 280,
                        }}
                      />
                    )}

                    {/* Icon */}
                    <motion.div
                      animate={{
                        y: isActive ? -4 : 0,
                        scale: isActive ? 1.15 : 1,
                        color: isActive
                          ? "var(--brand-teal, #0d9488)"
                          : "rgb(156 163 175)",
                      }}
                      transition={{
                        type: "spring",
                        damping: 20,
                        stiffness: 220,
                      }}
                      className="relative z-10 flex items-center justify-center"
                    >
                      {item.icon}
                    </motion.div>

                    {/* Label — only shows for active tab */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          key="label"
                          initial={{ opacity: 0, y: 4, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                          className="absolute bottom-1 z-10 text-[9.5px] font-extrabold text-brand-teal dark:text-teal-400 uppercase tracking-widest leading-none"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={onLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out of SocketChat?"
        confirmLabel="Logout"
        cancelLabel="Cancel"
        type="danger"
      />
    </div>
  );
}
