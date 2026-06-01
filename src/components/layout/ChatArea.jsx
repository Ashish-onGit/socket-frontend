import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPhone,
  FiVideo,
  FiTrash2,
  FiFileText,
  FiSend,
  FiPaperclip,
  FiSmile,
  FiCornerUpLeft,
  FiEdit3,
  FiCopy,
  FiShare2,
  FiChevronLeft,
  FiInfo,
  FiTrash,
  FiX,
  FiCheck,
  FiCheckSquare,
  FiSearch,
  FiMoreVertical,
  FiUsers,
} from "react-icons/fi";
import {
  addMessage,
  editMessage,
  deleteMessage,
  toggleReaction,
  setActiveConversation,
  clearChat,
  markAsRead,
} from "../../features/chat/chatSlice";
import Avatar from "../common/Avatar";
import ContextMenu from "../common/ContextMenu";
import ConfirmDialog from "../common/ConfirmDialog";
import Tooltip from "../common/Tooltip";
import Dropdown from "../common/Dropdown";
import EmojiPicker from "emoji-picker-react";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { useToast } from "../common/ToastContext";

const MessageItem = React.memo(
  ({
    msg,
    fromSelf,
    currentUser,
    onContextMenu,
    onTouchStart,
    onTouchEnd,
    onTouchMove,
    onReact,
    onReply,
    onCopy,
    onEdit,
    onDelete,
  }) => {
    const reactionSummary = msg.reactions ? Object.entries(msg.reactions) : [];
    return (
      <div
        className={`flex flex-col group/msg relative ${fromSelf ? "items-end" : "items-start"}`}
        onContextMenu={(e) => onContextMenu(e, msg)}
        onTouchStart={() => onTouchStart(msg)}
        onTouchEnd={onTouchEnd}
        onTouchMove={onTouchMove}
        onTouchCancel={onTouchEnd}
      >
        {/* Sender Label and Timestamp above bubble */}
        <div className="text-[9px] text-gray-400 dark:text-zinc-500 mb-1 pl-1 pr-1 font-sans">
          <span className="font-bold">{fromSelf ? "You" : msg.sender}</span>
          <span className="mx-1">•</span>
          <span>
            {new Date(msg.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* Quoted Reply Above Bubble */}
        {msg.replyTo && (
          <div className="text-[9px] text-gray-400 dark:text-zinc-500 mb-1 max-w-[65%] truncate flex items-center gap-1 font-sans pl-1">
            <FiCornerUpLeft size={10} />
            Replying to <span className="font-bold">{msg.replyTo.sender}</span>:
            "{msg.replyTo.message}"
          </div>
        )}

        {/* Bubble Content */}
        <div className="flex items-end gap-2 max-w-[75%] relative">
          {!fromSelf && (
            <div className="mb-0.5">
              <Avatar name={msg.sender} size="xs" showStatus={false} />
            </div>
          )}

          <div className="flex flex-col relative">
            <div
              className={`p-3 rounded-2xl relative text-[11px] leading-relaxed break-words font-sans ${
                msg.deleted
                  ? "italic text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10"
                  : fromSelf
                    ? "bg-[#DDE9F9] dark:bg-zinc-800 text-gray-800 dark:text-gray-100 rounded-br-none"
                    : "bg-white dark:bg-zinc-900/60 text-gray-800 dark:text-gray-100 border border-brand-border-light dark:border-white/5 rounded-bl-none shadow-sm"
              }`}
            >
              {/* File attachments */}
              {msg.fileUrl && !msg.deleted && (
                <div className="mb-2 overflow-hidden rounded-lg bg-black/5 dark:bg-black/20 p-2 border border-gray-200 dark:border-white/5">
                  {msg.type === "image" ? (
                    <a
                      href={msg.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block max-w-xs"
                    >
                      <img
                        src={msg.fileUrl}
                        alt={msg.fileName}
                        className="max-h-36 rounded object-cover hover:opacity-90 transition-opacity"
                      />
                    </a>
                  ) : (
                    <a
                      href={msg.fileUrl}
                      download={msg.fileName}
                      className="flex items-center gap-2 hover:underline text-brand-teal cursor-pointer"
                    >
                      <FiFileText size={18} className="flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold truncate text-[10px]">
                          {msg.fileName}
                        </p>
                        <p className="text-[9px] opacity-70">{msg.fileSize}</p>
                      </div>
                    </a>
                  )}
                </div>
              )}

              {/* Message Body */}
              <p className="whitespace-pre-wrap">{msg.message}</p>

              {/* Checkmarks inside bubble */}
              {fromSelf && !msg.deleted && (
                <div className="flex items-center justify-end gap-1 mt-1 text-[9px] opacity-50 font-sans">
                  {msg.edited && <span>edited</span>}
                  {msg.read ? (
                    <FiCheckSquare className="text-brand-teal" size={10} />
                  ) : (
                    <FiCheck size={10} />
                  )}
                </div>
              )}
            </div>

            {/* Reactions */}
            {reactionSummary.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1 pl-1">
                {reactionSummary.map(([reactorName, reactorEmoji]) => (
                  <Tooltip key={reactorName} text={reactorName}>
                    <span
                      onClick={() => onReact(msg, reactorEmoji)}
                      className="text-[9px] bg-white dark:bg-zinc-800 border border-gray-100 dark:border-white/10 px-1.5 py-0.5 rounded-full shadow-sm cursor-pointer select-none hover:scale-115 transition-transform"
                    >
                      {reactorEmoji}
                    </span>
                  </Tooltip>
                ))}
              </div>
            )}
          </div>

          {/* Hover triggers (only on desktop/tablet) */}
          {!msg.deleted && (
            <div
              className={`absolute top-1/2 -translate-y-1/2 opacity-0 md:group-hover/msg:opacity-100 transition-opacity flex items-center gap-1 z-20 ${fromSelf ? "right-full mr-2" : "left-full ml-2"}`}
            >
              <button
                onClick={() => onReply(msg)}
                className="p-1 rounded-lg bg-white dark:bg-zinc-800 text-gray-500 hover:text-gray-800 hover:bg-gray-100 border border-gray-100 dark:border-white/5 shadow-sm cursor-pointer"
                title="Reply"
              >
                <FiCornerUpLeft size={11} />
              </button>
              <button
                onClick={() => onCopy(msg)}
                className="p-1 rounded-lg bg-white dark:bg-zinc-800 text-gray-500 hover:text-gray-800 hover:bg-gray-100 border border-gray-100 dark:border-white/5 shadow-sm cursor-pointer"
                title="Copy Message"
              >
                <FiCopy size={11} />
              </button>
              <button
                onClick={() => onReact(msg, "❤️")}
                className="p-1 rounded-lg bg-white dark:bg-zinc-800 text-gray-500 hover:text-red-500 hover:bg-gray-100 border border-gray-100 dark:border-white/5 shadow-sm cursor-pointer"
              >
                ❤️
              </button>
            </div>
          )}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.msg.id === nextProps.msg.id &&
      prevProps.msg.message === nextProps.msg.message &&
      prevProps.msg.deleted === nextProps.msg.deleted &&
      prevProps.msg.edited === nextProps.msg.edited &&
      prevProps.msg.read === nextProps.msg.read &&
      JSON.stringify(prevProps.msg.reactions) ===
        JSON.stringify(nextProps.msg.reactions) &&
      prevProps.fromSelf === nextProps.fromSelf
    );
  },
);

export default function ChatArea({
  socket,
  onlineUsers = [],
  typingUsers = {},
  onToggleInfoPanel,
}) {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const currentUser = useSelector((state) => state.auth.user);
  const activeConversation = useSelector(
    (state) => state.chat.activeConversation,
  );
  const conversations = useSelector((state) => state.chat.conversations);
  const chatDetails = conversations[activeConversation] || null;
  const messages = chatDetails?.messages || [];
  const isOnline = onlineUsers.includes(activeConversation);

  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const [messageText, setMessageText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [attachment, setAttachment] = useState(null); // { name, type, url, size }

  // Header active tab: "messages" or "participants"
  const [headerTab, setHeaderTab] = useState("messages");

  // Context Menu State
  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    x: 0,
    y: 0,
    message: null,
  });
  // Confirm Dialog State
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmDeleteMsg, setConfirmDeleteMsg] = useState(null);

  // Search inside active conversation
  const [searchOpen, setSearchOpen] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState("");

  // Pagination / Lazy loading messages limit
  const [visibleMessagesCount, setVisibleMessagesCount] = useState(50);

  // Mobile long-press menu state
  const [mobileMenuMessage, setMobileMenuMessage] = useState(null);
  const longPressTimer = useRef(null);

  const [chatWindowWidth, setChatWindowWidth] = useState(window.innerWidth);
  const [isParticipantsBSOpen, setIsParticipantsBSOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setChatWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset pagination when active conversation changes
  useEffect(() => {
    setVisibleMessagesCount(50);
  }, [activeConversation]);

  // Smooth scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  // Mark messages as read when new ones arrive
  useEffect(() => {
    if (activeConversation && chatDetails?.unreadCount > 0) {
      dispatch(
        markAsRead({
          participant: activeConversation,
          currentUser: currentUser.username,
          fromSelf: true,
        }),
      );
      socket.emit("message_read", {
        sender: currentUser.username,
        receiver: activeConversation,
      });
    }
  }, [
    messages.length,
    activeConversation,
    chatDetails?.unreadCount,
    currentUser.username,
    dispatch,
    socket,
  ]);

  // Auto resize textarea
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      Math.min(textareaRef.current.scrollHeight, 100) + "px";
  }, [messageText]);

  // Keyboard Shortcuts (Esc to cancel editing/replying/emoji picker)
  useKeyboardShortcuts({
    Escape: () => {
      setReplyTo(null);
      setEditingMessage(null);
      setShowEmojiPicker(false);
      setSearchOpen(false);
      setChatSearchQuery("");
    },
    "ctrl+f": (e) => {
      e.preventDefault();
      setSearchOpen(true);
    },
  });

  // Handle typing status notification
  const handleTextareaChange = (e) => {
    setMessageText(e.target.value);

    // Emit typing status
    socket.emit("typing", {
      sender: currentUser.username,
      receiver: activeConversation,
    });

    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => {
      socket.emit("stop_typing", {
        sender: currentUser.username,
        receiver: activeConversation,
      });
    }, 1500);
  };

  const handleSend = () => {
    if (!messageText.trim() && !attachment) return;

    const msgId =
      Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    const timestamp = Date.now();

    if (editingMessage) {
      // Edit existing message
      dispatch(
        editMessage({
          messageId: editingMessage.id,
          newContent: messageText.trim(),
          participant: activeConversation,
          currentUser: currentUser.username,
        }),
      );
      socket.emit("message_edit", {
        id: editingMessage.id,
        sender: currentUser.username,
        receiver: activeConversation,
        newContent: messageText.trim(),
      });
      showToast("Message edited", "info");
      setEditingMessage(null);
    } else {
      // Send new message
      const msgObj = {
        id: msgId,
        sender: currentUser.username,
        receiver: activeConversation,
        message: messageText.trim(),
        timestamp,
        replyTo: replyTo
          ? { id: replyTo.id, message: replyTo.message, sender: replyTo.sender }
          : null,
        reactions: {},
        read: false,
        edited: false,
        deleted: false,
      };

      if (attachment) {
        msgObj.type = attachment.type;
        msgObj.fileUrl = attachment.url;
        msgObj.fileName = attachment.name;
        msgObj.fileSize = attachment.size;
      } else {
        msgObj.type = "text";
      }

      dispatch(
        addMessage({ message: msgObj, currentUser: currentUser.username }),
      );
      socket.emit("send_message", msgObj);
      // showToast("Message sent", "success");
      setReplyTo(null);
      setAttachment(null);
    }

    setMessageText("");
    socket.emit("stop_typing", {
      sender: currentUser.username,
      receiver: activeConversation,
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMessageTouchStart = (msg) => {
    if (window.innerWidth >= 768) return;
    longPressTimer.current = setTimeout(() => {
      setMobileMenuMessage(msg);
    }, 600);
  };

  const handleMessageTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleMessageTouchMove = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showEmojiPicker]);

  // File attachments simulation
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    const sizeFormatted = (file.size / 1024).toFixed(1) + " KB";

    setAttachment({
      name: file.name,
      type: file.type.startsWith("image/") ? "image" : "file",
      url: objectUrl,
      size: sizeFormatted,
    });

    showToast(`Attached ${file.name}`, "info");
    e.target.value = null; // Clear input
  };

  // Message Actions
  const handleCopyMessage = (msg) => {
    navigator.clipboard.writeText(msg.message);
    showToast("Copied to clipboard!", "success");
  };

  const handleReactMessage = (msg, emoji) => {
    dispatch(
      toggleReaction({
        messageId: msg.id,
        emoji,
        username: currentUser.username,
        participant: activeConversation,
        currentUser: currentUser.username,
      }),
    );
    socket.emit("message_reaction", {
      id: msg.id,
      emoji,
      username: currentUser.username,
      sender: currentUser.username,
      receiver: activeConversation,
    });
  };

  const handleStartEdit = (msg) => {
    setEditingMessage(msg);
    setMessageText(msg.message);
    setReplyTo(null);
    if (textareaRef.current) textareaRef.current.focus();
  };

  const handleConfirmDelete = () => {
    if (!confirmDeleteMsg) return;
    dispatch(
      deleteMessage({
        messageId: confirmDeleteMsg.id,
        participant: activeConversation,
        currentUser: currentUser.username,
      }),
    );
    socket.emit("message_delete", {
      id: confirmDeleteMsg.id,
      sender: currentUser.username,
      receiver: activeConversation,
    });
    showToast("Message deleted", "error");
    setConfirmDeleteMsg(null);
  };

  // Date separating logic
  const groupMessagesByDate = (msgs) => {
    const groups = {};
    msgs.forEach((m) => {
      const dateStr = new Date(m.timestamp).toDateString();
      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(m);
    });
    return groups;
  };

  const formatDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Filter messages based on search query
  const filteredMessages = messages.filter((m) => {
    if (!chatSearchQuery.trim() || m.deleted) return true;
    return m.message.toLowerCase().includes(chatSearchQuery.toLowerCase());
  });

  const displayedMessages = filteredMessages.slice(-visibleMessagesCount);
  const messageGroups = groupMessagesByDate(displayedMessages);

  if (!activeConversation) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center p-8 bg-brand-bg-light dark:bg-brand-bg-dark relative">
        <div className="text-center max-w-sm space-y-3 z-10 select-none">
          <div className="text-5xl animate-float">💬</div>
          <h3 className="text-sm font-extrabold text-gray-800 dark:text-gray-200 font-sans">
            Aether Messaging
          </h3>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed font-sans">
            Start a premium, real-time messaging channel. Search or add a user
            on the sidebar to begin.
          </p>
        </div>
      </div>
    );
  }

  const getContextMenuItems = (msg) => {
    const items = [
      {
        label: "Reply",
        icon: <FiCornerUpLeft size={13} />,
        onClick: () => {
          setReplyTo(msg);
          setEditingMessage(null);
        },
      },
      {
        label: "Copy Text",
        icon: <FiCopy size={13} />,
        onClick: () => handleCopyMessage(msg),
      },
    ];

    if (msg.sender === currentUser.username && !msg.deleted) {
      items.push({
        label: "Edit Message",
        icon: <FiEdit3 size={13} />,
        onClick: () => handleStartEdit(msg),
      });
      items.push({ divider: true });
      items.push({
        label: "Delete Message",
        icon: <FiTrash2 size={13} />,
        danger: true,
        onClick: () => setConfirmDeleteMsg(msg),
      });
    }

    return items;
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-brand-bg-light dark:bg-brand-bg-dark relative overflow-hidden">
      {/* Chat Header (Responsive pill design & options) */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-brand-border-light dark:border-white/5 bg-white dark:bg-brand-panel-dark relative z-10 select-none">
        
        {/* Left: User Info and Segmented Control (Tabs) */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => dispatch(setActiveConversation(null))}
            className="md:hidden p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 hover:text-gray-800"
          >
            <FiChevronLeft size={20} />
          </button>
          <Avatar
            name={activeConversation}
            size="sm"
            isOnline={isOnline}
            showStatus={true}
          />
          <div className="min-w-0 mr-3">
            <h4 className="text-xs font-extrabold text-gray-800 dark:text-gray-100 truncate font-sans">
              {activeConversation}
            </h4>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-sans mt-0.5">
              {isOnline ? (
                <span className="text-brand-teal font-semibold">Active now</span>
              ) : (
                "Offline"
              )}
            </p>
          </div>

          {/* Segmented Control Pill Tabs - next to username, hidden on mobile */}
          {chatWindowWidth >= 768 && (
            <div className="bg-gray-100 dark:bg-zinc-800/80 p-0.5 rounded-xl flex ml-2 flex-shrink-0">
              <button
                onClick={() => setHeaderTab("messages")}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  headerTab === "messages"
                    ? "bg-white dark:bg-zinc-700 text-brand-teal dark:text-white shadow-sm"
                    : "text-gray-400 dark:text-zinc-500 hover:text-gray-700"
                }`}
              >
                Messages
              </button>
              <button
                onClick={() => {
                  setHeaderTab("messages");
                  onToggleInfoPanel();
                }}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  headerTab === "participants"
                    ? "bg-white dark:bg-zinc-700 text-brand-teal dark:text-white shadow-sm"
                    : "text-gray-400 dark:text-zinc-500 hover:text-gray-700"
                }`}
              >
                Participants
              </button>
            </div>
          )}
        </div>

        {/* Right: Action icons and Dropdown menu */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <Tooltip text="Voice Call">
            <button
              onClick={() => showToast("Starting voice call...", "info")}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-white/5 transition cursor-pointer"
            >
              <FiPhone size={14} />
            </button>
          </Tooltip>

          <Tooltip text="Video Call">
            <button
              onClick={() => showToast("Starting video call...", "info")}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-white/5 transition cursor-pointer"
            >
              <FiVideo size={14} />
            </button>
          </Tooltip>

          {searchOpen ? (
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 border border-transparent focus-within:border-brand-teal rounded-xl px-2 py-1 font-sans mr-1">
              <input
                type="text"
                placeholder="Search..."
                value={chatSearchQuery}
                onChange={(e) => setChatSearchQuery(e.target.value)}
                className="text-[10px] bg-transparent border-none focus:outline-none text-gray-900 dark:text-white w-20 md:w-36"
                autoFocus
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setChatSearchQuery("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          ) : (
            <Tooltip text="Search messages">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-white/5 transition cursor-pointer"
              >
                <FiSearch size={14} />
              </button>
            </Tooltip>
          )}

          <Tooltip text="Chat Info">
            <button
              onClick={onToggleInfoPanel}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-white/5 transition cursor-pointer"
            >
              <FiInfo size={14} />
            </button>
          </Tooltip>
        </div>
      </div>

      {headerTab === "messages" ? (
        <>
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5 relative z-0">
            {filteredMessages.length > visibleMessagesCount && (
              <div className="flex justify-center py-2">
                <button
                  onClick={() => setVisibleMessagesCount((prev) => prev + 50)}
                  className="text-[10px] font-extrabold text-brand-teal hover:underline cursor-pointer bg-brand-teal/5 dark:bg-brand-teal/10 px-4 py-1.5 rounded-full transition-all border border-brand-teal/10 hover:border-brand-teal/30"
                >
                  Load older messages
                </button>
              </div>
            )}

            {displayedMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 p-8">
                <p className="text-xs font-semibold font-sans">
                  No messages yet
                </p>
                <p className="text-[10px] opacity-75 mt-1 font-sans">
                  Be the first to say hello!
                </p>
              </div>
            ) : (
              Object.entries(messageGroups).map(([dateStr, msgs]) => (
                <div key={dateStr} className="space-y-4">
                  {/* Date Separator */}
                  <div className="flex items-center justify-center my-6">
                    <span className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest px-3 py-1 bg-gray-200/40 dark:bg-white/5 rounded-full font-sans">
                      {formatDateLabel(dateStr)}
                    </span>
                  </div>

                  {/* Messages Details */}
                  {msgs.map((msg) => {
                    const fromSelf = msg.sender === currentUser.username;
                    return (
                      <MessageItem
                        key={msg.id}
                        msg={msg}
                        fromSelf={fromSelf}
                        currentUser={currentUser}
                        onContextMenu={(e, message) => {
                          e.preventDefault();
                          setContextMenu({
                            isOpen: true,
                            x: e.clientX,
                            y: e.clientY,
                            message,
                          });
                        }}
                        onTouchStart={handleMessageTouchStart}
                        onTouchEnd={handleMessageTouchEnd}
                        onTouchMove={handleMessageTouchMove}
                        onReact={handleReactMessage}
                        onReply={(message) => {
                          setReplyTo(message);
                          setEditingMessage(null);
                        }}
                        onCopy={handleCopyMessage}
                        onEdit={handleStartEdit}
                        onDelete={(message) => setConfirmDeleteMsg(message)}
                      />
                    );
                  })}
                </div>
              ))
            )}
            <div ref={messagesEndRef}></div>
          </div>

          {/* Typing indicators */}
          {typingUsers[activeConversation] && (
            <div className="px-5 py-2 flex items-center gap-2 text-[10px] text-gray-400 dark:text-zinc-500 select-none">
              <span className="font-bold">{activeConversation}</span> is typing
              <div className="flex items-center gap-0.5 ml-1">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          )}

          {/* Message Composer (Bottom Rounded Box) */}
          <div className="p-3 border-t border-brand-border-light dark:border-white/5 bg-white/70 dark:bg-brand-panel-dark/80 backdrop-blur-md relative z-10">
            {replyTo && (
              <div className="flex items-center justify-between p-2 mb-2 bg-gray-100 dark:bg-zinc-800/80 rounded-xl border-l-4 border-brand-teal text-[10px] font-sans">
                <div className="min-w-0">
                  <p className="font-bold">Replying to {replyTo.sender}</p>
                  <p className="truncate opacity-75">{replyTo.message}</p>
                </div>
                <button
                  onClick={() => setReplyTo(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={14} />
                </button>
              </div>
            )}

            {editingMessage && (
              <div className="flex items-center justify-between p-2 mb-2 bg-gray-100 dark:bg-zinc-800/80 rounded-xl border-l-4 border-amber-500 text-[10px] font-sans">
                <div className="min-w-0">
                  <p className="font-bold text-amber-500">Editing Message</p>
                  <p className="truncate opacity-75">
                    {editingMessage.message}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingMessage(null);
                    setMessageText("");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={14} />
                </button>
              </div>
            )}

            {attachment && (
              <div className="flex items-center justify-between p-2 mb-2 bg-gray-100 dark:bg-zinc-800/80 rounded-xl border-l-4 border-brand-teal text-[10px] font-sans">
                <div className="flex items-center gap-2 min-w-0">
                  <FiFileText className="text-brand-teal" size={14} />
                  <div className="min-w-0">
                    <p className="font-bold truncate">{attachment.name}</p>
                    <p className="opacity-75">{attachment.size}</p>
                  </div>
                </div>
                <button
                  onClick={() => setAttachment(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={14} />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex-1 bg-gray-100 dark:bg-white/5 border border-transparent focus-within:border-brand-teal rounded-2xl px-4 py-2 flex items-center gap-2 animate-all">
                <textarea
                  ref={textareaRef}
                  value={messageText}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyPress}
                  rows={1}
                  placeholder="Write your message..."
                  className="flex-1 bg-transparent border-none focus:outline-none text-[11px] text-gray-900 dark:text-white placeholder-gray-400 font-sans resize-none py-1.5 leading-normal max-h-24 custom-scrollbar"
                />

                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition cursor-pointer"
                >
                  <FiSmile size={16} />
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition cursor-pointer"
                >
                  <FiPaperclip size={16} />
                </button>
              </div>

              <button
                onClick={handleSend}
                className="p-2.5 rounded-full bg-brand-teal hover:bg-brand-teal/95 text-white shadow-md shadow-brand-teal/20 transition flex items-center justify-center cursor-pointer flex-shrink-0"
              >
                <FiSend size={14} />
              </button>
            </div>

            {/* Emoji picker */}
            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                className="absolute bottom-16 right-4 z-50 rounded-2xl overflow-hidden shadow-2xl"
              >
                <EmojiPicker
                  onEmojiClick={(emojiObj) =>
                    setMessageText((p) => p + emojiObj.emoji)
                  }
                  width={280}
                  height={320}
                />
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-brand-bg-light dark:bg-brand-bg-dark flex flex-col items-center">
          <Avatar name={activeConversation} size="xl" isOnline={isOnline} />
          <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 mt-3 font-sans">
            {activeConversation}
          </h4>
          <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-sans mt-0.5">
            Participant Details
          </p>

          <div className="w-full max-w-sm mt-6 border-t border-gray-100 dark:border-white/5 pt-4 space-y-3 font-sans text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Username</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                @{activeConversation}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Online Status</span>
              <span
                className={`font-semibold ${isOnline ? "text-brand-teal" : "text-gray-500"}`}
              >
                {isOnline ? "Active now" : "Offline"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Context menus & dialogs */}
      <ContextMenu
        isOpen={contextMenu.isOpen}
        x={contextMenu.x}
        y={contextMenu.y}
        onClose={() =>
          setContextMenu({ isOpen: false, x: 0, y: 0, message: null })
        }
        onReact={(emoji) => handleReactMessage(contextMenu.message, emoji)}
        items={
          contextMenu.message ? getContextMenuItems(contextMenu.message) : []
        }
      />

      <ConfirmDialog
        isOpen={confirmClear}
        onClose={() => setConfirmClear(false)}
        onConfirm={() => {
          dispatch(
            clearChat({
              participant: activeConversation,
              currentUser: currentUser.username,
            }),
          );
          showToast("Chat cleared", "info");
        }}
        title="Clear History"
        message="Are you sure you want to clear all message logs? This cannot be undone."
      />

      <ConfirmDialog
        isOpen={!!confirmDeleteMsg}
        onClose={() => setConfirmDeleteMsg(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Message"
        message="Are you sure you want to delete this message?"
      />

      {/* Participants Bottom Sheet (Mobile) */}
      <AnimatePresence>
        {isParticipantsBSOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsParticipantsBSOpen(false)}
              className="fixed inset-0 bg-black z-50 backdrop-blur-xs"
            />
            {/* Slide-up Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-55 bg-white dark:bg-[#1C1C1E] rounded-t-[2rem] p-5 shadow-2xl flex flex-col font-sans max-h-[80vh] pb-safe border-t border-brand-border-light dark:border-white/5"
            >
              {/* Notch */}
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-zinc-700 rounded-full mx-auto mb-4" />

              <h3 className="text-xs font-extrabold text-gray-800 dark:text-gray-100 uppercase tracking-wider mb-4 px-2">
                Participants (2)
              </h3>

              <div className="divide-y divide-gray-100 dark:divide-white/5 px-2 overflow-y-auto max-h-[40vh] custom-scrollbar mb-4">
                {/* Current User Row */}
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={currentUser?.username} size="sm" isOnline={true} showStatus={true} />
                    <div>
                      <p className="text-[11px] font-bold text-gray-800 dark:text-gray-100">
                        {currentUser?.username} <span className="text-[9px] text-gray-400 font-normal">(You)</span>
                      </p>
                      <p className="text-[9px] text-brand-teal mt-0.5 font-semibold">Active now</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-brand-teal/10 text-brand-teal border border-brand-teal/20">
                    Admin
                  </span>
                </div>

                {/* Other User Row */}
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={activeConversation} size="sm" isOnline={isOnline} showStatus={true} />
                    <div>
                      <p className="text-[11px] font-bold text-gray-800 dark:text-gray-100">
                        {activeConversation}
                      </p>
                      <p className={`text-[9px] mt-0.5 font-semibold ${isOnline ? "text-brand-teal" : "text-gray-400"}`}>
                        {isOnline ? "Active now" : "Offline"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsParticipantsBSOpen(false)}
                className="w-full py-3 text-xs font-bold text-center text-white bg-brand-teal hover:bg-brand-teal/90 rounded-xl cursor-pointer transition shadow-md shadow-brand-teal/20"
              >
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
