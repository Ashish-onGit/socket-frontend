import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { FiSearch, FiSettings, FiPlus, FiArchive, FiTrash2, FiChevronLeft, FiMenu, FiSliders, FiChevronRight, FiChevronDown, FiLogOut } from "react-icons/fi";
import { BsPinAngle, BsPinAngleFill } from "react-icons/bs";
import ConfirmDialog from "../common/ConfirmDialog";
import { setActiveConversation, createConversation, pinConversation, archiveConversation, deleteConversation } from "../../features/chat/chatSlice";
import Avatar from "../common/Avatar";
import Dropdown from "../common/Dropdown";
import Tooltip from "../common/Tooltip";

const ConversationItem = React.memo(({
  chat,
  isActive,
  currentUser,
  onSelect,
  onPin,
  onArchive,
  onDelete,
  getRelativeTime
}) => {
  return (
    <div
      className={`group flex items-center justify-between p-3 my-1 rounded-xl transition-all cursor-pointer relative ${
        isActive
          ? "bg-brand-teal text-white shadow-lg shadow-brand-teal/20"
          : "hover:bg-gray-100 dark:hover:bg-white/5"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Avatar name={chat.username} size="md" isOnline={chat.isOnline} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold truncate ${isActive ? "text-white" : "text-gray-800 dark:text-gray-100"}`}>
              {chat.username}
            </span>
            <span className={`text-[9px] ${isActive ? "text-white/80" : "text-gray-400 dark:text-gray-500"}`}>
              {getRelativeTime(chat.lastMsg?.timestamp)}
            </span>
          </div>
          
          <div className="flex items-center justify-between mt-0.5">
            <p className={`text-[10px] truncate max-w-[150px] ${isActive ? "text-white/90" : "text-gray-500 dark:text-gray-400"}`}>
              {chat.lastMsg ? (
                chat.lastMsg.deleted ? (
                  <span className="italic opacity-80">Message deleted</span>
                ) : (
                  chat.lastMsg.message
                )
              ) : (
                <span className="italic opacity-60">No messages yet</span>
              )}
            </p>
            
            <div className="flex items-center gap-1.5 flex-shrink-0 ml-1">
              {chat.isPinned && (
                <BsPinAngleFill size={11} className={isActive ? "text-white" : "text-brand-teal"} />
              )}
              {chat.unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                  {chat.unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dropdown Options - always visible (no hover delay) for better mobile accessibility */}
      <div
        className="opacity-75 hover:opacity-100 ml-2 flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <Dropdown
          trigger={
            <button className={`p-1 z-50 rounded-lg hover:bg-black/10 transition-colors ${isActive ? "text-white" : "text-gray-400 hover:text-gray-700"} flex items-center justify-center`}>
              <FiChevronDown size={14} />
            </button>
          }
          items={[
            {
              label: chat.isPinned ? "Unpin Chat" : "Pin Chat",
              icon: <BsPinAngle size={12} />,
              onClick: onPin
            },
            {
              label: chat.isArchived ? "Unarchive Chat" : "Archive Chat",
              icon: <FiArchive size={12} />,
              onClick: onArchive
            },
            { divider: true },
            {
              label: "Delete Chat",
              icon: <FiTrash2 size={12} />,
              danger: true,
              onClick: onDelete
            }
          ]}
        />
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.isActive === nextProps.isActive &&
    prevProps.chat.username === nextProps.chat.username &&
    prevProps.chat.isOnline === nextProps.chat.isOnline &&
    prevProps.chat.isPinned === nextProps.chat.isPinned &&
    prevProps.chat.isArchived === nextProps.chat.isArchived &&
    prevProps.chat.unreadCount === nextProps.chat.unreadCount &&
    prevProps.chat.lastMsg?.timestamp === nextProps.chat.lastMsg?.timestamp &&
    prevProps.chat.lastMsg?.message === nextProps.chat.lastMsg?.message &&
    prevProps.chat.lastMsg?.deleted === nextProps.chat.lastMsg?.deleted
  );
});

export default function Sidebar({ theme, toggleTheme, onlineUsers = [], onOpenSettings, onLogout }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const conversations = useSelector((state) => state.chat.conversations);
  const activeConversation = useSelector((state) => state.chat.activeConversation);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [newChatUser, setNewChatUser] = useState("");
  const [showAddChat, setShowAddChat] = useState(false);
  const [confirmDeleteChat, setConfirmDeleteChat] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const showArchived = location.pathname === "/archived";

  const handleStartChat = (e) => {
    e.preventDefault();
    if (!newChatUser.trim() || newChatUser.trim() === currentUser.username) return;
    dispatch(createConversation({ participant: newChatUser.trim(), currentUser: currentUser.username }));
    dispatch(setActiveConversation(newChatUser.trim()));
    setNewChatUser("");
    setShowAddChat(false);
  };

  // Prepare chats list sorted by pinned, then by last message timestamp
  const chatsList = Object.entries(conversations)
    .map(([username, details]) => ({
      username,
      ...details,
      isOnline: onlineUsers.includes(username),
      lastMsg: details.messages[details.messages.length - 1] || null
    }))
    .filter((c) => {
      const matchesSearch = searchQuery.trim() === "" || c.username.toLowerCase().includes(searchQuery.toLowerCase());
      if (showArchived) {
        return c.isArchived && matchesSearch;
      }
      return !c.isArchived && matchesSearch;
    })
    .sort((a, b) => {
      const timeA = a.lastMsg ? a.lastMsg.timestamp : 0;
      const timeB = b.lastMsg ? b.lastMsg.timestamp : 0;
      return timeB - timeA;
    });

  const pinnedChats = chatsList.filter((c) => c.isPinned);
  const otherChats = chatsList.filter((c) => !c.isPinned);

  const getRelativeTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-brand-panel-dark relative z-10 select-none">
      {/* Sidebar Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-brand-border-light dark:border-white/5 bg-white dark:bg-brand-panel-dark select-none flex-shrink-0">
        <div className="flex items-center gap-2">
          {showArchived && (
            <button 
              onClick={() => navigate("/chat")}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 hover:text-gray-800 transition cursor-pointer flex items-center justify-center mr-1"
              title="Back"
            >
              <FiChevronLeft size={16} />
            </button>
          )}
          <span className="text-[12px] font-extrabold tracking-wider text-gray-800 dark:text-gray-100 uppercase font-sans">
            {showArchived ? "Archived" : "Conversations"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {!showArchived && (
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-extrabold text-emerald-500 uppercase tracking-wider">Live</span>
            </div>
          )}

          {/* Archived Chats Toggle */}
          {!showArchived && (
            <button 
              onClick={() => navigate("/archived")}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition cursor-pointer flex items-center justify-center"
              title="Archived Chats"
            >
              <FiArchive size={14} />
            </button>
          )}

          {/* Theme switcher */}
          <button 
            onClick={toggleTheme}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition cursor-pointer flex items-center justify-center"
            title="Toggle Theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {/* Logout button */}
          {onLogout && (
            <button 
              onClick={onLogout}
              className="p-1 rounded-lg text-gray-400 hover:text-red-500 transition cursor-pointer flex items-center justify-center"
              title="Logout"
            >
              <FiLogOut size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Profile status row */}
      <div className="px-4 py-3 flex items-center gap-3 border-b border-brand-border-light dark:border-white/5">
        <Avatar name={currentUser?.username} size="sm" isOnline={true} showStatus={true} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-gray-800 dark:text-gray-100 truncate font-sans">{currentUser?.username}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[9px] font-semibold text-emerald-500">Available</span>
          </div>
        </div>
      </div>

      {/* Search and Add new Chat */}
      <div className="p-3 space-y-2">
        <div className="relative flex items-center">
          <FiSearch className="absolute left-3 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 pl-9 pr-9 text-[11px] rounded-xl bg-brand-bg-light dark:bg-zinc-800 border border-transparent focus:border-brand-teal focus:outline-none text-gray-900 dark:text-white transition-all font-sans"
          />
          <button className="absolute right-3 text-gray-400 hover:text-gray-600 cursor-pointer">
            <FiSliders size={13} />
          </button>
        </div>
        
        {!showArchived && (
          showAddChat ? (
            <form onSubmit={handleStartChat} className="flex gap-1.5 mt-2">
              <input
                type="text"
                placeholder="Username to chat..."
                value={newChatUser}
                onChange={(e) => setNewChatUser(e.target.value)}
                className="flex-1 px-3 py-2 text-[10px] rounded-xl bg-white dark:bg-zinc-800 border border-brand-border-light dark:border-white/10 focus:outline-none text-gray-900 dark:text-white font-sans"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-[10px] font-bold bg-brand-teal hover:bg-brand-teal/90 text-white rounded-xl transition cursor-pointer"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => { setShowAddChat(false); setNewChatUser(""); }}
                className="px-2 py-1.5 text-[10px] font-bold bg-gray-200 dark:bg-white/10 hover:bg-gray-300 text-gray-700 dark:text-gray-200 rounded-xl cursor-pointer"
              >
                ✕
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowAddChat(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-[11px] font-bold text-brand-teal bg-brand-teal/5 hover:bg-brand-teal/10 rounded-xl transition border border-dashed border-brand-teal/20 cursor-pointer"
            >
              <FiPlus size={13} />
              Add New Conversation
            </button>
          )
        )}
      </div>

      {/* Conversations Scroll List Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-4">
        {chatsList.length === 0 ? (
          <div className="p-8 text-center text-gray-400 dark:text-gray-500 text-xs">
            {showArchived ? "No archived conversations" : "No active conversations"}
          </div>
        ) : (
          <>
            {/* Favorites Section */}
            {pinnedChats.length > 0 && (
              <div className="space-y-1">
                <div className="px-3 py-2 flex items-center justify-between text-[9px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-widest select-none">
                  <span>Favorites</span>
                  <FiChevronRight size={13} className="text-gray-400" />
                </div>
                {pinnedChats.map((chat) => (
                  <ConversationItem
                    key={chat.username}
                    chat={chat}
                    isActive={activeConversation === chat.username}
                    currentUser={currentUser}
                    onSelect={() => dispatch(setActiveConversation(chat.username))}
                    onPin={() => dispatch(pinConversation({ participant: chat.username, currentUser: currentUser.username }))}
                    onArchive={() => dispatch(archiveConversation({ participant: chat.username, currentUser: currentUser.username }))}
                    onDelete={() => setConfirmDeleteChat(chat.username)}
                    getRelativeTime={getRelativeTime}
                  />
                ))}
              </div>
            )}

            {/* Last Chats Section */}
            {otherChats.length > 0 && (
              <div className="space-y-1">
                <div className="px-3 py-2 flex items-center justify-between text-[9px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-widest select-none">
                  <span>Last chats</span>
                  <span className="text-gray-400">•••</span>
                </div>
                {otherChats.map((chat) => (
                  <ConversationItem
                    key={chat.username}
                    chat={chat}
                    isActive={activeConversation === chat.username}
                    currentUser={currentUser}
                    onSelect={() => dispatch(setActiveConversation(chat.username))}
                    onPin={() => dispatch(pinConversation({ participant: chat.username, currentUser: currentUser.username }))}
                    onArchive={() => dispatch(archiveConversation({ participant: chat.username, currentUser: currentUser.username }))}
                    onDelete={() => setConfirmDeleteChat(chat.username)}
                    getRelativeTime={getRelativeTime}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!confirmDeleteChat}
        onClose={() => setConfirmDeleteChat(null)}
        onConfirm={() => {
          dispatch(deleteConversation({ participant: confirmDeleteChat, currentUser: currentUser.username }));
          setConfirmDeleteChat(null);
        }}
        title="Delete Conversation"
        message={`Are you sure you want to delete the conversation with @${confirmDeleteChat}? All message history will be permanently deleted.`}
      />
    </div>
  );
}
