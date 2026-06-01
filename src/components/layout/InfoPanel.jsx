import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FiChevronRight, FiFolder, FiChevronLeft, FiMoreHorizontal } from "react-icons/fi";
import Avatar from "../common/Avatar";
import { useNavigate } from "react-router-dom";

export default function InfoPanel({ activeConversation, isOnline, onClose }) {
  const navigate = useNavigate();
  const conversations = useSelector((state) => state.chat.conversations);
  const chatDetails = conversations[activeConversation] || null;
  const messages = chatDetails?.messages || [];

  const [activeMediaTab, setActiveMediaTab] = useState("files"); // files vs links

  // Extract counts
  const sharedPhotos = messages.filter((m) => !m.deleted && m.type === "image" && m.fileUrl);
  const sharedFiles = messages.filter((m) => !m.deleted && m.type === "file" && m.fileUrl);

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const sharedLinks = messages.filter((m) => !m.deleted && m.message && urlRegex.test(m.message));

  const totalFilesCount = sharedFiles.length + sharedPhotos.length;
  const totalLinksCount = sharedLinks.length;

  const docs = sharedFiles.filter(m => {
    const ext = m.fileName?.split('.').pop()?.toLowerCase();
    return ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'rar'].includes(ext);
  });
  const movies = sharedFiles.filter(m => {
    const ext = m.fileName?.split('.').pop()?.toLowerCase();
    return ['mp4', 'mkv', 'avi', 'mov', 'webm'].includes(ext);
  });
  const others = sharedFiles.filter(m => {
    const ext = m.fileName?.split('.').pop()?.toLowerCase();
    return !['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'rar', 'mp4', 'mkv', 'avi', 'mov', 'webm'].includes(ext);
  });

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFilesSize = (fileList) => {
    let totalBytes = 0;
    fileList.forEach(m => {
      if (m.fileSize) {
        const match = m.fileSize.match(/^([\d.]+)\s*(KB|MB|Bytes|GB)$/i);
        if (match) {
          const val = parseFloat(match[1]);
          const unit = match[2].toUpperCase();
          if (unit === 'KB') totalBytes += val * 1024;
          else if (unit === 'MB') totalBytes += val * 1024 * 1024;
          else if (unit === 'GB') totalBytes += val * 1024 * 1024 * 1024;
          else totalBytes += val;
        }
      }
    });
    return formatBytes(totalBytes);
  };

  const fileCategories = [
    {
      name: "Documents",
      count: docs.length,
      size: getFilesSize(docs),
      iconColor: "text-purple-500 bg-purple-500/10",
    },
    {
      name: "Photos",
      count: sharedPhotos.length,
      size: getFilesSize(sharedPhotos),
      iconColor: "text-amber-500 bg-amber-500/10",
    },
    {
      name: "Movies",
      count: movies.length,
      size: getFilesSize(movies),
      iconColor: "text-brand-teal bg-brand-teal/10",
    },
    {
      name: "Other",
      count: others.length,
      size: getFilesSize(others),
      iconColor: "text-rose-500 bg-rose-500/10",
    }
  ];

  return (
    <div className="w-full md:w-80 h-full flex flex-col bg-white dark:bg-brand-panel-dark border-l border-brand-border-light dark:border-white/5 relative z-10 font-sans">
      
      {/* Header (Matches Reference image: > Shared files) */}
      <div className="p-4 flex items-center gap-3">
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-gray-700 transition cursor-pointer"
        >
          <FiChevronLeft size={16} />
        </button>
        <span className="text-xs font-extrabold tracking-wide text-gray-800 dark:text-gray-100">
          Shared files
        </span>
      </div>

      {/* Target card showcase */}
      <div className="p-6 flex flex-col items-center text-center">
        {/* Mock visual or avatar */}
        <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-100 dark:border-white/10 select-none">
          <Avatar name={activeConversation} size="xl" showStatus={false} />
        </div>
        <h4 className="text-xs font-bold text-gray-800 dark:text-gray-100 mt-3">
          {chatDetails?.recipient?.name || activeConversation}
        </h4>
        {chatDetails?.recipient?.name && (
          <p className="text-[9px] text-gray-400 dark:text-zinc-500 mt-0.5">@{activeConversation}</p>
        )}
        <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-0.5">
          {isOnline ? "Active now" : "Offline"}
        </p>
        {chatDetails?.recipient?.bio && (
          <p className="text-[10px] text-gray-500 dark:text-gray-400 italic mt-2.5 px-4 line-clamp-2">
            "{chatDetails.recipient.bio}"
          </p>
        )}
      </div>

      {/* Stats side-by-side buttons (Matches Reference layout) */}
      <div className="px-5 grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => { setActiveMediaTab("files"); navigate("/files?category=all"); }}
          className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between h-20 relative ${
            activeMediaTab === "files"
              ? "bg-[#CCFBF1]/60 dark:bg-brand-teal/20 border-brand-teal/30 text-brand-teal"
              : "bg-gray-50 dark:bg-zinc-800/40 border-transparent text-gray-400"
          }`}
        >
          <span className="text-[9px] font-bold uppercase tracking-wider block">All files</span>
          <div className="flex items-end justify-between w-full mt-2">
            <span className="text-lg font-extrabold text-gray-800 dark:text-gray-100">{totalFilesCount}</span>
            <FiFolder size={18} className="opacity-80" />
          </div>
          {activeMediaTab === "files" && (
            <span className="absolute right-2 top-2 w-1.5 h-1.5 rounded-full bg-brand-teal" />
          )}
        </button>

        <button
          onClick={() => { setActiveMediaTab("links"); navigate("/files?category=other"); }}
          className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between h-20 relative ${
            activeMediaTab === "links"
              ? "bg-[#CCFBF1]/60 dark:bg-brand-teal/20 border-brand-teal/30 text-brand-teal"
              : "bg-gray-50 dark:bg-zinc-800/40 border-transparent text-gray-400"
          }`}
        >
          <span className="text-[9px] font-bold uppercase tracking-wider block">All links</span>
          <div className="flex items-end justify-between w-full mt-2">
            <span className="text-lg font-extrabold text-gray-800 dark:text-gray-100">{totalLinksCount}</span>
            <span className="text-xs font-bold font-sans">🔗</span>
          </div>
          {activeMediaTab === "links" && (
            <span className="absolute right-2 top-2 w-1.5 h-1.5 rounded-full bg-brand-teal" />
          )}
        </button>
      </div>

      {/* File type Section header */}
      <div className="px-5 py-2 flex items-center justify-between text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider select-none border-t border-brand-border-light dark:border-white/5 pt-4">
        <span>File type</span>
        <button className="text-gray-400 hover:text-gray-700">
          <FiMoreHorizontal size={14} />
        </button>
      </div>

      {/* Scrollable cabinet content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-6 mt-2 pb-6">
        
        {/* Categories list */}
        <div className="space-y-2">
          {fileCategories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/files?category=${cat.name.toLowerCase()}`)}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition duration-150 cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                {/* Colored icon holder */}
                <div className={`p-2 rounded-xl flex items-center justify-center ${cat.iconColor}`}>
                  <FiFolder size={15} />
                </div>
                <div className="text-left font-sans">
                  <p className="text-[11px] font-bold text-gray-700 dark:text-gray-200">{cat.name}</p>
                  <p className="text-[9px] text-gray-400 dark:text-zinc-500 mt-0.5">
                    {cat.count} files, {cat.size}
                  </p>
                </div>
              </div>

              <FiChevronRight size={14} className="text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
            </div>
          ))}
        </div>

        {/* Shared Media Grid */}
        <div className="px-2">
          <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider pl-1 block mb-3">
            Recent Media
          </span>
          {sharedPhotos.length === 0 ? (
            <div className="grid grid-cols-3 gap-2 px-1">
              <div className="aspect-square rounded-xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 border border-gray-100 dark:border-white/5 flex items-center justify-center text-[9px] text-gray-400 font-medium">No media</div>
              <div className="aspect-square rounded-xl bg-gradient-to-br from-teal-500/5 to-emerald-500/5 dark:from-teal-500/10 dark:to-emerald-500/10 border border-gray-100 dark:border-white/5 flex items-center justify-center text-[9px] text-gray-400 font-medium">No media</div>
              <div className="aspect-square rounded-xl bg-gradient-to-br from-pink-500/5 to-rose-500/5 dark:from-pink-500/10 dark:to-rose-500/10 border border-gray-100 dark:border-white/5 flex items-center justify-center text-[9px] text-gray-400 font-medium">No media</div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 px-1">
              {sharedPhotos.slice(-6).map((img, idx) => (
                <a key={idx} href={img.fileUrl} target="_blank" rel="noopener noreferrer" className="aspect-square rounded-xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm block hover:scale-105 transition-transform duration-200">
                  <img src={img.fileUrl} alt="Shared" className="w-full h-full object-cover" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Chat Analytics */}
        <div className="px-2">
          <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider pl-1 block mb-3">
            Chat Analytics
          </span>
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/20 border border-gray-100 dark:border-white/5 space-y-3 font-sans text-[11px]">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Messages</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">{messages.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Last Active</span>
              <span className="font-bold text-gray-800 dark:text-gray-200 truncate max-w-[150px]">
                {messages.length > 0 
                  ? new Date(messages[messages.length - 1].timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) 
                  : "Never"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Joined Date</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">
                {chatDetails?.recipient?.createdAt 
                  ? new Date(chatDetails.recipient.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
                  : "June 1, 2026"}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
