import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiSearch, FiPlus, FiArchive, FiTrash2, FiChevronLeft,
  FiSliders, FiChevronRight, FiChevronDown, FiLogOut,
  FiX, FiLoader, FiUsers, FiMessageSquare,
} from "react-icons/fi";
import { BsPinAngle, BsPinAngleFill } from "react-icons/bs";
import ConfirmDialog from "../common/ConfirmDialog";
import {
  setActiveConversation, createConversation, pinConversation,
  archiveConversation, deleteConversation,
} from "../../features/chat/chatSlice";
import Avatar from "../common/Avatar";
import Dropdown from "../common/Dropdown";

// ─── Helpers ────────────────────────────────────────────────────────────────

const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

// ─── ConversationItem (memoized for perf) ───────────────────────────────────

const ConversationItem = React.memo(({
  chat, isActive, currentUser, onSelect, onPin, onArchive, onDelete, getRelativeTime,
}) => (
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

    {/* Dropdown Menu */}
    <div className="opacity-75 hover:opacity-100 ml-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
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
            onClick: onPin,
          },
          {
            label: chat.isArchived ? "Unarchive Chat" : "Archive Chat",
            icon: <FiArchive size={12} />,
            onClick: onArchive,
          },
          { divider: true },
          {
            label: "Delete Chat",
            icon: <FiTrash2 size={12} />,
            danger: true,
            onClick: onDelete,
          },
        ]}
      />
    </div>
  </div>
), (prev, next) => (
  prev.isActive === next.isActive &&
  prev.chat.username === next.chat.username &&
  prev.chat.isOnline === next.chat.isOnline &&
  prev.chat.isPinned === next.chat.isPinned &&
  prev.chat.isArchived === next.chat.isArchived &&
  prev.chat.unreadCount === next.chat.unreadCount &&
  prev.chat.lastMsg?.timestamp === next.chat.lastMsg?.timestamp &&
  prev.chat.lastMsg?.message === next.chat.lastMsg?.message &&
  prev.chat.lastMsg?.deleted === next.chat.lastMsg?.deleted
));

// ─── NewChatPanel ────────────────────────────────────────────────────────────

function NewChatPanel({ currentUser, onlineUsers, conversations, onClose, onStarted }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(null); // username being started
  const [error, setError] = useState("");
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-focus input when panel opens
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
    // Load suggestions immediately (all users except self)
    searchUsers("");
  }, []);

  const searchUsers = useCallback(async (q) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${backendURL}/api/users/search?query=${encodeURIComponent(q)}`,
        { headers: { Authorization: `Bearer ${currentUser?.token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      } else {
        setError("Search failed. Check your connection.");
        setResults([]);
      }
    } catch {
      setError("Cannot reach server.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.token]);

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchUsers(val), 300);
  };

  const handleSelectUser = async (user) => {
    if (starting) return;

    // If conversation already exists in Redux, just open it
    if (conversations[user.username]) {
      onStarted(user.username);
      return;
    }

    // Otherwise call the backend start endpoint (find-or-create)
    setStarting(user.username);
    try {
      const res = await fetch(`${backendURL}/api/conversations/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.token}`,
        },
        body: JSON.stringify({ recipientId: user._id }),
      });

      if (res.ok) {
        onStarted(user.username);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to start conversation");
      }
    } catch {
      setError("Server error. Try again.");
    } finally {
      setStarting(null);
    }
  };

  return (
    <div className="flex flex-col bg-white dark:bg-brand-panel-dark border-b border-brand-border-light dark:border-white/5">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <span className="text-[10px] font-extrabold text-gray-500 dark:text-zinc-400 uppercase tracking-widest">
          New Conversation
        </span>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition cursor-pointer"
        >
          <FiX size={13} />
        </button>
      </div>

      {/* Search Input */}
      <div className="px-3 pb-2">
        <div className="relative flex items-center">
          {loading ? (
            <FiLoader size={13} className="absolute left-3 text-brand-teal animate-spin" />
          ) : (
            <FiSearch size={13} className="absolute left-3 text-gray-400" />
          )}
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by name or username..."
            value={query}
            onChange={handleQueryChange}
            className="w-full py-2 pl-8 pr-4 text-[11px] rounded-xl bg-brand-bg-light dark:bg-zinc-800 border border-transparent focus:border-brand-teal focus:outline-none text-gray-900 dark:text-white transition-all font-sans"
          />
        </div>
        {error && (
          <p className="text-[9px] text-red-500 mt-1 pl-1">{error}</p>
        )}
      </div>

      {/* Results List */}
      <div className="max-h-64 overflow-y-auto custom-scrollbar px-2 pb-3">
        {!loading && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <FiUsers size={24} className="text-gray-300 dark:text-zinc-600 mb-2" />
            <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500">
              {query.trim() ? `No users found for "${query}"` : "No users registered yet"}
            </p>
            <p className="text-[9px] text-gray-300 dark:text-zinc-600 mt-0.5">
              Try a different search term
            </p>
          </div>
        )}

        {results.map((user) => {
          const isOnline = onlineUsers.includes(user.username) || user.isOnline;
          const alreadyExists = !!conversations[user.username];
          const isStarting = starting === user.username;

          return (
            <button
              key={user._id}
              onClick={() => handleSelectUser(user)}
              disabled={isStarting}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-brand-teal/5 dark:hover:bg-white/5 transition cursor-pointer group text-left disabled:opacity-60"
            >
              <div className="flex-shrink-0">
                <Avatar name={user.username} size="md" isOnline={isOnline} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-gray-800 dark:text-gray-100 truncate">
                  {user.name || user.username}
                </p>
                <p className="text-[9px] text-gray-400 dark:text-zinc-500 truncate">
                  @{user.username}
                  {isOnline ? (
                    <span className="ml-1.5 inline-flex items-center gap-0.5 text-emerald-500">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 inline-block" />
                      Online
                    </span>
                  ) : user.updatedAt ? (
                    <span className="ml-1.5 text-gray-300 dark:text-zinc-600">
                      · last seen {new Date(user.updatedAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                    </span>
                  ) : null}
                </p>
              </div>
              <div className="flex-shrink-0">
                {isStarting ? (
                  <FiLoader size={13} className="text-brand-teal animate-spin" />
                ) : alreadyExists ? (
                  <span className="text-[9px] font-bold text-brand-teal bg-brand-teal/10 px-2 py-0.5 rounded-full">
                    Open
                  </span>
                ) : (
                  <span className="text-[9px] font-bold text-gray-400 group-hover:text-brand-teal transition px-2 py-0.5 rounded-full group-hover:bg-brand-teal/10">
                    <FiMessageSquare size={11} />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

export default function Sidebar({ theme, toggleTheme, onlineUsers = [], onOpenSettings, onLogout }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const conversations = useSelector((state) => state.chat.conversations);
  const activeConversation = useSelector((state) => state.chat.activeConversation);

  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [confirmDeleteChat, setConfirmDeleteChat] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const showArchived = location.pathname === "/archived";

  // When a user is selected from the search panel
  const handleConversationStarted = (username) => {
    // Ensure conversation exists in Redux (create if new)
    dispatch(createConversation({ participant: username, currentUser: currentUser.username }));
    dispatch(setActiveConversation(username));
    setShowNewChat(false);
    navigate("/chat");
  };

  const handlePin = async (username) => {
    dispatch(pinConversation({ participant: username, currentUser: currentUser.username }));
    try {
      await fetch(`${backendURL}/api/conversations/pin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ participant: username }),
      });
    } catch (err) {
      console.error("Failed to pin conversation:", err);
    }
  };

  const handleArchive = async (username) => {
    dispatch(archiveConversation({ participant: username, currentUser: currentUser.username }));
    try {
      await fetch(`${backendURL}/api/conversations/archive`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ participant: username }),
      });
    } catch (err) {
      console.error("Failed to archive conversation:", err);
    }
  };

  const chatsList = Object.entries(conversations)
    .map(([username, details]) => ({
      username,
      ...details,
      isOnline: onlineUsers.includes(username),
      lastMsg: details.messages[details.messages.length - 1] || null,
    }))
    .filter((c) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        c.username.toLowerCase().includes(searchQuery.toLowerCase());
      if (showArchived) return c.isArchived && matchesSearch;
      return !c.isArchived && matchesSearch;
    })
    .sort((a, b) => {
      const timeA = a.lastMsg ? new Date(a.lastMsg.timestamp).getTime() : 0;
      const timeB = b.lastMsg ? new Date(b.lastMsg.timestamp).getTime() : 0;
      return timeB - timeA;
    });

  const pinnedChats = chatsList.filter((c) => c.isPinned);
  const otherChats = chatsList.filter((c) => !c.isPinned);

  const getRelativeTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
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
          {!showArchived && (
            <button
              onClick={() => navigate("/archived")}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition cursor-pointer flex items-center justify-center"
              title="Archived Chats"
            >
              <FiArchive size={14} />
            </button>
          )}
          <button
            onClick={toggleTheme}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition cursor-pointer flex items-center justify-center"
            title="Toggle Theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
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

      {/* Profile row */}
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

      {/* Search and Add New Chat */}
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
          <button
            onClick={() => setShowNewChat((v) => !v)}
            className={`w-full flex items-center justify-center gap-2 py-2.5 text-[11px] font-bold rounded-xl transition border cursor-pointer ${
              showNewChat
                ? "text-white bg-brand-teal border-brand-teal shadow-md shadow-brand-teal/20"
                : "text-brand-teal bg-brand-teal/5 hover:bg-brand-teal/10 border-dashed border-brand-teal/20"
            }`}
          >
            {showNewChat ? <FiX size={13} /> : <FiPlus size={13} />}
            {showNewChat ? "Cancel" : "New Conversation"}
          </button>
        )}
      </div>

      {/* New Chat User Search Panel */}
      {showNewChat && !showArchived && (
        <NewChatPanel
          currentUser={currentUser}
          onlineUsers={onlineUsers}
          conversations={conversations}
          onClose={() => setShowNewChat(false)}
          onStarted={handleConversationStarted}
        />
      )}

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-4">
        {chatsList.length === 0 ? (
          <div className="p-8 text-center text-gray-400 dark:text-gray-500 text-xs">
            {showArchived ? "No archived conversations" : (
              <div className="flex flex-col items-center gap-3">
                <FiMessageSquare size={28} className="opacity-30 animate-pulse" />
                <div>
                  <p className="font-bold text-gray-400 dark:text-zinc-500">No conversations yet</p>
                  <p className="text-[10px] text-gray-300 dark:text-zinc-600 mt-1">Click "New Conversation" to start chatting</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
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
                    onPin={() => handlePin(chat.username)}
                    onArchive={() => handleArchive(chat.username)}
                    onDelete={() => setConfirmDeleteChat(chat.username)}
                    getRelativeTime={getRelativeTime}
                  />
                ))}
              </div>
            )}

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
                    onPin={() => handlePin(chat.username)}
                    onArchive={() => handleArchive(chat.username)}
                    onDelete={() => setConfirmDeleteChat(chat.username)}
                    getRelativeTime={getRelativeTime}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!confirmDeleteChat}
        onClose={() => setConfirmDeleteChat(null)}
        onConfirm={async () => {
          const participantToDelete = confirmDeleteChat;
          dispatch(deleteConversation({ participant: participantToDelete, currentUser: currentUser.username }));
          setConfirmDeleteChat(null);
          try {
            await fetch(`${backendURL}/api/conversations/${participantToDelete}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${currentUser.token}` },
            });
          } catch (err) {
            console.error("Failed to delete conversation:", err);
          }
        }}
        title="Delete Conversation"
        message={`Are you sure you want to delete the conversation with @${confirmDeleteChat}? All message history will be permanently deleted.`}
      />
    </div>
  );
}
