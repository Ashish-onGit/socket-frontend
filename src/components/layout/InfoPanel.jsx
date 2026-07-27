import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FiChevronRight, FiFolder, FiChevronLeft, FiMoreHorizontal } from "react-icons/fi";
import Avatar from "../common/Avatar";
import { useNavigate } from "react-router-dom";

export default function InfoPanel({ activeConversation, isOnline, onClose }) {
  const navigate = useNavigate();
  const conversations = useSelector((state) => state.chat.conversations);
  const chatDetails = conversations[activeConversation] || null;
  console.log(chatDetails )
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
    <div className="w-full md:w-80 h-full flex flex-col bg-slate-50/90 dark:bg-[#0B0F14]/90 backdrop-blur-xl border-l border-slate-200 dark:border-[rgba(255,255,255,0.08)] relative z-10 font-sans">
      
      {/* Header (Matches Reference image: > Shared files) */}
      <div className="p-4 flex items-center gap-3 border-b border-slate-200 dark:border-[rgba(255,255,255,0.08)] bg-transparent">
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-white/5 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
        >
          <FiChevronLeft size={16} />
        </button>
        <span className="text-xs font-extrabold tracking-wide text-slate-900 dark:text-white uppercase">
          Shared files
        </span>
      </div>

      {/* Target card showcase */}
      <div className="p-6 flex flex-col items-center text-center">
        {/* Mock visual or avatar */}
        <div className="w-16 h-16 rounded-full overflow-hidden border border-[rgba(255,255,255,0.1)] select-none shadow-sm">
          <Avatar name={activeConversation} size="xl" showStatus={false} />
        </div>
        <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-3">
          {chatDetails?.recipient?.name || activeConversation}
        </h4>
        {chatDetails?.recipient?.name && (
          <p className="text-[9px] text-zinc-500 mt-0.5">@{activeConversation}</p>
        )}
        <p className="text-[10px] text-zinc-400 mt-0.5">
          {isOnline ? "Active now" : "Offline"}
        </p>
        {chatDetails?.recipient?.bio && (
          <p className="text-[10px] text-zinc-400 italic mt-2.5 px-4 line-clamp-2">
            "{chatDetails.recipient.bio}"
          </p>
        )}
      </div>

      {/* Stats side-by-side buttons (Matches Reference layout) */}
      <div className="px-5 grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => { setActiveMediaTab("files"); navigate("/files?category=all"); }}
          className={`p-3.5 rounded-[20px] border text-left transition-colors duration-200 cursor-pointer flex flex-col justify-between h-20 relative ${
            activeMediaTab === "files"
              ? "bg-slate-200 dark:bg-[#0E1117]/95 border-slate-400 dark:border-zinc-500 text-slate-900 dark:text-white shadow-sm"
              : "bg-white/60 dark:bg-[#0E1117]/40 border-slate-200 dark:border-[rgba(255,255,255,0.08)] text-slate-500 dark:text-zinc-400 hover:bg-white dark:hover:bg-[#0E1117]/70"
          }`}
        >
          <span className="text-[9.5px] font-extrabold uppercase tracking-wider block">All files</span>
          <div className="flex items-end justify-between w-full mt-2">
            <span className="text-lg font-extrabold text-slate-900 dark:text-white">{totalFilesCount}</span>
            <FiFolder size={18} className="opacity-80" />
          </div>
        </button>

        <button
          onClick={() => { setActiveMediaTab("links"); navigate("/files?category=other"); }}
          className={`p-3.5 rounded-[20px] border text-left transition-colors duration-200 cursor-pointer flex flex-col justify-between h-20 relative ${
            activeMediaTab === "links"
              ? "bg-slate-200 dark:bg-[#0E1117]/95 border-slate-400 dark:border-zinc-500 text-slate-900 dark:text-white shadow-sm"
              : "bg-white/60 dark:bg-[#0E1117]/40 border-slate-200 dark:border-[rgba(255,255,255,0.08)] text-slate-500 dark:text-zinc-400 hover:bg-white dark:hover:bg-[#0E1117]/70"
          }`}
        >
          <span className="text-[9.5px] font-extrabold uppercase tracking-wider block">All links</span>
          <div className="flex items-end justify-between w-full mt-2">
            <span className="text-lg font-extrabold text-slate-900 dark:text-white">{totalLinksCount}</span>
            <span className="text-xs font-bold font-sans">🔗</span>
          </div>
        </button>
      </div>

      {/* File type Section header */}
      <div className="px-5 py-2 flex items-center justify-between text-[10px] font-extrabold text-slate-500 dark:text-zinc-400 uppercase tracking-wider select-none border-t border-slate-200 dark:border-[rgba(255,255,255,0.08)] pt-4">
        <span>File type</span>
        <button className="text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white transition">
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
              className="flex items-center justify-between p-3.5 rounded-[18px] bg-white/60 dark:bg-[#0E1117]/40 hover:bg-white dark:hover:bg-[#0E1117]/80 border border-transparent hover:border-slate-200 dark:hover:border-[rgba(255,255,255,0.08)] transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                {/* Colored icon holder */}
                <div className={`p-2.5 rounded-[14px] flex items-center justify-center ${cat.iconColor}`}>
                  <FiFolder size={16} />
                </div>
                <div className="text-left font-sans">
                  <p className="text-[11px] font-bold text-slate-900 dark:text-white">{cat.name}</p>
                  <p className="text-[9px] text-zinc-500 mt-0.5">
                    {cat.count} files, {cat.size}
                  </p>
                </div>
              </div>

              <FiChevronRight size={14} className="text-slate-400 dark:text-zinc-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            </div>
          ))}
        </div>

        {/* Shared Media Grid */}
        <div className="px-2">
          <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider pl-1 block mb-3">
            Recent Media
          </span>
          {sharedPhotos.length === 0 ? (
            <div className="grid grid-cols-3 gap-2 px-1">
              <div className="aspect-square rounded-[16px] bg-slate-100 dark:bg-[#0E1117]/40 border border-slate-200 dark:border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[9px] text-slate-500 dark:text-zinc-600 font-medium">No media</div>
              <div className="aspect-square rounded-[16px] bg-slate-100 dark:bg-[#0E1117]/40 border border-slate-200 dark:border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[9px] text-slate-500 dark:text-zinc-600 font-medium">No media</div>
              <div className="aspect-square rounded-[16px] bg-slate-100 dark:bg-[#0E1117]/40 border border-slate-200 dark:border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[9px] text-slate-500 dark:text-zinc-600 font-medium">No media</div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 px-1">
              {sharedPhotos.slice(-6).map((img, idx) => (
                <a key={idx} href={img.fileUrl} target="_blank" rel="noopener noreferrer" className="aspect-square rounded-[16px] overflow-hidden border border-slate-200 dark:border-[rgba(255,255,255,0.08)] shadow-sm block hover:opacity-90 transition-opacity duration-200">
                  <img src={img.fileUrl} alt="Shared" className="w-full h-full object-cover" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="px-2">
          <span className="text-[10px] font-extrabold text-slate-500 dark:text-zinc-400 uppercase tracking-wider pl-1 block mb-3">
            User Profile
          </span>
          <div className="p-4 rounded-[20px] bg-white dark:bg-[#0E1117]/60 border border-slate-200 dark:border-[rgba(255,255,255,0.08)] space-y-3.5 font-sans text-[11px] shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-zinc-500 font-medium">User ID</span>
              <span className="font-mono font-bold text-slate-700 dark:text-zinc-300 select-all cursor-pointer" title="Select and copy User ID">
                {chatDetails?.recipient?._id || "••••••••"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-zinc-500 font-medium">Username</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                @{activeConversation}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-zinc-500 font-medium">Calling ID</span>
              <span className="font-mono font-bold text-[#0D9488] select-all cursor-pointer" title="Select and copy Call ID">
                {chatDetails?.recipient?.uniqueId || "••••••••"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-zinc-500 font-medium">Status</span>
              <span className={`font-bold ${isOnline ? "text-[#0D9488]" : "text-slate-500 dark:text-zinc-500"}`}>
                {isOnline ? "Available" : "Offline"}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
