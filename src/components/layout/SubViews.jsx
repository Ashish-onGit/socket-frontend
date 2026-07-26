import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  FiFileText, FiFolder, FiSearch, FiChevronRight, FiUsers, FiLock, FiVideo, 
  FiPhone, FiSend, FiPaperclip, FiSmile, FiVolume2, FiVolumeX, FiPlus, FiPhoneCall,
  FiPhoneMissed, FiArrowUpRight, FiArrowDownLeft, FiClock, FiActivity, FiMessageSquare,
  FiDatabase, FiMaximize2, FiShare2, FiChevronLeft, FiSave, FiLogOut, FiSliders,
  FiGrid, FiList, FiTrendingUp, FiUser, FiInfo, FiMoon, FiShield, FiBell, FiWifi, FiCheckCircle, FiEdit2,
  FiKey, FiCopy
} from "react-icons/fi";
import { BsPinAngleFill, BsGrid, BsList } from "react-icons/bs";
import Avatar from "../common/Avatar";
import ThemeSwitcher from "../common/ThemeSwitcher";
import { useToast } from "../common/ToastContext";
import { setActiveConversation, createConversation } from "../../features/chat/chatSlice";
import DialPad from "../calling/DialPad";
import CallHistoryList from "../calling/CallHistoryList";

// ==========================================
// UNIFIED VIEW HEADER HELPER
// ==========================================
export function UnifiedHeader({ title, subtitle, search, actions, showMobileBack, onMobileBack }) {
  return (
    <div className="h-16 px-6 border-b border-brand-border-light dark:border-white/5 bg-white dark:bg-brand-panel-dark flex items-center justify-between z-10 flex-shrink-0 select-none">
      <div className="flex items-center gap-3 min-w-0">
        {showMobileBack && (
          <button 
            onClick={onMobileBack}
            className="md:hidden p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 hover:text-gray-800 transition cursor-pointer"
          >
            <FiChevronLeft size={16} />
          </button>
        )}
        <div className="min-w-0">
          <h2 className="text-[12px] font-extrabold tracking-wider text-gray-800 dark:text-gray-100 uppercase font-sans truncate">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[9px] text-gray-400 dark:text-zinc-500 mt-0.5 font-sans truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      {search && (
        <div className="hidden sm:block flex-1 max-w-xs mx-4">
          {search}
        </div>
      )}

      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 1. FILES VIEW COMPONENTS
// ==========================================
export function FilesSidebar({ onCategorySelect }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activeCategory = queryParams.get("category") || "all";

  const categories = [
    { id: "all", name: "All files", icon: <FiFolder size={14} />, color: "text-brand-teal bg-brand-teal/10" },
    { id: "documents", name: "Documents", icon: <FiFileText size={14} />, color: "text-purple-500 bg-purple-500/10" },
    { id: "photos", name: "Photos", icon: <FiFolder size={14} />, color: "text-amber-500 bg-amber-500/10" },
    { id: "movies", name: "Movies", icon: <FiFolder size={14} />, color: "text-emerald-500 bg-emerald-500/10" },
    { id: "other", name: "Other", icon: <FiFolder size={14} />, color: "text-rose-500 bg-rose-500/10" }
  ];

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-brand-panel-dark border-r border-brand-border-light dark:border-white/5 font-sans">
      <div className="h-16 px-4 flex items-center justify-between border-b border-brand-border-light dark:border-white/5">
        <span className="text-[12px] font-extrabold tracking-wider text-gray-800 dark:text-gray-100 uppercase">Files Cabinet</span>
        <span className="text-[9px] bg-brand-teal/10 text-brand-teal px-2 py-0.5 rounded-full font-bold">Cabinet</span>
      </div>

      <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
        <span className="text-[9px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-widest block mb-3">Categories</span>
        <div className="space-y-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onCategorySelect(cat.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? "bg-brand-teal text-white shadow-md shadow-brand-teal/20"
                    : "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-1.5 rounded-lg flex items-center justify-center ${isActive ? "bg-white/20 text-white" : cat.color}`}>
                    {cat.icon}
                  </div>
                  <span className="text-[11px] font-bold truncate">{cat.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function FilesMainArea() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 h-full flex flex-col bg-brand-bg-light dark:bg-brand-bg-dark relative overflow-hidden font-sans">
      <UnifiedHeader 
        title="Files Cabinet" 
        subtitle="Shared documents and attachments locker"
        showMobileBack={true}
        onMobileBack={() => navigate("/files")}
      />

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto custom-scrollbar">
        {/* Glassmorphic Card */}
        <div className="w-full max-w-xl bg-white/60 dark:bg-brand-card-dark/60 backdrop-blur-xl border border-brand-border-light dark:border-white/5 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
          {/* Decorative ambient glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-brand-teal/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />

          {/* Premium Icon Badge */}
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-teal to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-brand-teal/20 animate-pulse-slow">
              <FiFileText size={38} />
            </div>
            <span className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-extrabold text-[8px] uppercase tracking-widest shadow-md">
              Coming Soon
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white uppercase tracking-wider mb-2 font-sans">
            Files
          </h2>

          {/* Subtitle */}
          <p className="text-xs text-brand-teal dark:text-teal-400 font-bold uppercase tracking-widest mb-4">
            This section is currently under development
          </p>

          <p className="text-[11px] text-gray-400 dark:text-zinc-500 max-w-sm mb-8 leading-relaxed font-sans">
            A secure hub to keep track of all files, documents, and media shared across your workspaces and individual chats.
          </p>

          {/* Features Checklist Card */}
          <div className="w-full bg-gray-50/50 dark:bg-zinc-800/40 border border-gray-100/55 dark:border-white/5 rounded-2xl p-5 text-left space-y-4">
            <h4 className="text-[9.5px] font-extrabold text-gray-555 dark:text-zinc-400 uppercase tracking-widest">
              Soon you'll be able to:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Upload Files", desc: "Upload docs directly from your device." },
                { title: "Share Documents", desc: "Send sheets, PDFs, and media instantly." },
                { title: "Organize Attachments", desc: "Group attachments by type or sender." },
                { title: "Search Shared Files", desc: "Instantly locate items by keyword or filter." }
              ].map((feat, idx) => (
                <div key={idx} className="flex gap-2.5 items-start">
                  <span className="w-5 h-5 rounded-full bg-brand-teal/10 text-brand-teal flex items-center justify-center flex-shrink-0 mt-0.5 text-[9px] font-bold">
                    ✓
                  </span>
                  <div>
                    <h5 className="text-[11px] font-bold text-gray-800 dark:text-gray-50">{feat.title}</h5>
                    <p className="text-[9px] text-gray-400 dark:text-zinc-500 mt-0.5">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. CHANNELS VIEW COMPONENTS
// ==========================================
export function ChannelsSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const activeChannel = searchParams.get("name") || "";

  const channels = [
    { name: "#general", desc: "Company wide chatter" },
    { name: "#announcements", desc: "Corporate updates" },
    { name: "#dev-talk", desc: "Coding and support" },
    { name: "#design-feedback", desc: "Visual review logs" }
  ];

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-brand-panel-dark border-r border-brand-border-light dark:border-white/5 font-sans">
      <div className="h-16 px-4 flex items-center justify-between border-b border-brand-border-light dark:border-white/5">
        <span className="text-[12px] font-extrabold tracking-wider text-gray-800 dark:text-gray-100 uppercase">Channels</span>
        <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-brand-teal cursor-pointer">
          <FiPlus size={14} />
        </button>
      </div>

      <div className="p-4 space-y-1 flex-1 overflow-y-auto custom-scrollbar">
        <span className="text-[9px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-widest block mb-3">Group Channels</span>
        {channels.map((chan) => {
          const isActive = activeChannel === chan.name;
          return (
              <button
              key={chan.name}
              onClick={() => navigate(`/channels?name=${encodeURIComponent(chan.name)}`)}
              className={`w-full text-left p-3 rounded-xl transition cursor-pointer flex justify-between items-center ${
                isActive ? "bg-brand-teal text-white shadow-md shadow-brand-teal/20" : "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200"
              }`}
            >
              <div className="min-w-0 flex-1 mr-2">
                <p className={`text-[11px] font-bold ${isActive ? "text-white" : "text-gray-800 dark:text-gray-100"}`}>{chan.name}</p>
                <p className={`text-[9px] ${isActive ? "text-white/85" : "text-gray-400 dark:text-zinc-500"} mt-0.5 truncate`}>{chan.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ChannelsMainArea() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 h-full flex flex-col bg-brand-bg-light dark:bg-brand-bg-dark relative overflow-hidden font-sans">
      <UnifiedHeader 
        title="Channels Hub"
        subtitle="Dedicated communication spaces for teams"
        showMobileBack={true}
        onMobileBack={() => navigate("/channels")}
      />

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto custom-scrollbar">
        {/* Modern Placeholder Container */}
        <div className="w-full max-w-2xl bg-white/60 dark:bg-brand-card-dark/60 backdrop-blur-xl border border-brand-border-light dark:border-white/5 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-36 h-36 rounded-full bg-brand-teal/10 blur-2xl pointer-events-none" />

          {/* Icon Badge */}
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 animate-pulse-slow">
              <FiUsers size={38} />
            </div>
            <span className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full bg-brand-teal text-white font-extrabold text-[8px] uppercase tracking-widest shadow-md">
              Coming Soon
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
            Channels
          </h2>

          {/* Subtitle */}
          <p className="text-xs text-indigo-500 dark:text-indigo-400 font-extrabold uppercase tracking-widest mb-4">
            Under Development
          </p>

          <p className="text-[11px] text-gray-400 dark:text-zinc-500 max-w-md mb-8 leading-relaxed">
            Channels will allow communities and teams to communicate in dedicated spaces. Organize discussions by projects, topics, departments, or interests.
          </p>

          {/* Features Grid */}
          <div className="w-full bg-gray-50/50 dark:bg-zinc-800/40 border border-gray-100/55 dark:border-white/5 rounded-2xl p-5 text-left">
            <h4 className="text-[9.5px] font-extrabold text-gray-500 dark:text-zinc-400 uppercase tracking-widest mb-4">
              Features Coming Soon
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { title: "Public Channels", desc: "Open spaces for anyone in the company to join and contribute." },
                { title: "Private Channels", desc: "Invite-only spaces for secure and sensitive conversations." },
                { title: "Threaded Conversations", desc: "Keep discussions organized by replying directly to messages." },
                { title: "Channel Permissions", desc: "Granular roles to manage who can view, post, or edit messages." },
                { title: "Mentions & Alerts", desc: "Notify team members instantly with @mentions and ping updates." },
                { title: "File Sharing & Pins", desc: "Share project documents and pin important resources." }
              ].map((feat, idx) => (
                <div key={idx} className="p-3 bg-white dark:bg-zinc-900/40 rounded-xl border border-gray-100 dark:border-white/5 hover:scale-[1.02] transition-transform">
                  <h5 className="text-[10px] font-bold text-gray-800 dark:text-gray-150 uppercase tracking-wide">{feat.title}</h5>
                  <p className="text-[9px] text-gray-450 dark:text-zinc-500 mt-1 leading-normal">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. CONTACTS VIEW COMPONENTS
// ==========================================
export function ContactsSidebar({ onlineUsers }) {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeUser = searchParams.get("username") || "";
  const [search, setSearch] = useState("");
  const [usersList, setUsersList] = useState([]);
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
        const res = await fetch(`${backendURL}/api/users/search?query=${search}`, {
          headers: {
            "Authorization": `Bearer ${currentUser?.token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setUsersList(data);
        }
      } catch (err) {
        console.error("Failed to fetch search users:", err);
      }
    };

    fetchUsers();
  }, [search, currentUser?.token]);

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-brand-panel-dark border-r border-brand-border-light dark:border-white/5 font-sans">
      <div className="h-16 px-4 flex items-center justify-between border-b border-brand-border-light dark:border-white/5">
        <span className="text-[12px] font-extrabold tracking-wider text-gray-800 dark:text-gray-100 uppercase">Contacts</span>
      </div>

      <div className="p-4 flex-1 flex flex-col min-h-0">
        <div className="relative flex items-center mb-4">
          <FiSearch className="absolute left-3.5 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2.5 pl-10 pr-4 text-[11px] rounded-2xl bg-brand-bg-light dark:bg-zinc-800/80 border border-transparent focus:border-brand-teal/50 focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-brand-teal/10 focus:outline-none text-gray-900 dark:text-white transition-all font-sans"
          />
        </div>

        <span className="text-[9px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-widest block mb-3">Members</span>
        <div className="space-y-1 overflow-y-auto custom-scrollbar flex-1">
          {usersList.length === 0 ? (
            <div className="text-center p-4 text-[10px] text-gray-400">No users found</div>
          ) : (
            usersList.map((usr) => {
              const isActive = activeUser === usr.username;
              const isOnline = onlineUsers.includes(usr.username) || usr.isOnline;
              return (
                <div 
                  key={usr.username} 
                  onClick={() => navigate(`/contacts?username=${usr.username}`)}
                  className={`flex items-center justify-between p-3 my-1.5 rounded-2xl transition-all cursor-pointer ${
                    isActive 
                      ? "bg-brand-teal text-white shadow-lg shadow-brand-teal/20" 
                      : "hover:bg-gray-150 dark:hover:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-white/5 text-gray-700 dark:text-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <Avatar name={usr.username} size="md" isOnline={isOnline} />
                    <div className="text-left font-sans min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[12px] font-extrabold truncate ${isActive ? "text-white" : "text-gray-800 dark:text-gray-100"}`}>
                          {usr.name || usr.username}
                        </span>
                        <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-gray-350 dark:bg-zinc-700"}`} />
                      </div>
                      <p className={`text-[9.5px] font-mono font-bold ${isActive ? "text-white/80" : "text-brand-teal/90"} mt-0.5`}>
                        ID: {usr.uniqueId || "••••••••"}
                      </p>
                      <p className={`text-[9px] truncate ${isActive ? "text-white/70" : "text-gray-400 dark:text-zinc-550"} mt-0.5`}>
                        {usr.bio || "Hey there! I am using SocketChat."}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export function ContactsMainArea({ onlineUsers = [], onInitiateCall }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const currentUser = useSelector((state) => state.auth.user);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedUser = searchParams.get("username");
  const [profileUser, setProfileUser] = useState(null);

  // Fetch full details of selected contact dynamically
  useEffect(() => {
    const fetchProfile = async () => {
      if (!selectedUser) return;
      try {
        const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
        const res = await fetch(`${backendURL}/api/users/search?query=${encodeURIComponent(selectedUser)}`, {
          headers: {
            "Authorization": `Bearer ${currentUser?.token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          // Find exact username match
          const exact = data.find((u) => u.username === selectedUser);
          setProfileUser(exact || null);
        }
      } catch (err) {
        console.error("Failed to load user profile", err);
      }
    };
    fetchProfile();
  }, [selectedUser, currentUser?.token]);

  if (!selectedUser) {
    return (
      <div className="flex-1 h-full flex flex-col bg-brand-bg-light dark:bg-brand-bg-dark relative overflow-hidden font-sans">
        <UnifiedHeader 
          title="Contacts Profile" 
          subtitle="View user profiles"
          showMobileBack={false}
        />
        <div className="flex-1 flex flex-col justify-center items-center p-8 text-center">
          <div className="bg-brand-teal/5 dark:bg-brand-teal/10 p-6 rounded-full mb-4 animate-pulse">
            <FiUsers className="text-brand-teal" size={36} />
          </div>
          <h4 className="text-xs font-extrabold text-gray-800 dark:text-gray-200 uppercase tracking-widest">Nothing here yet!</h4>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 max-w-xs mt-2">
            Select a member from the sidebar list to view their detailed profile card.
          </p>
        </div>
      </div>
    );
  }

  const startPrivateChat = () => {
    dispatch(createConversation({ participant: selectedUser, currentUser: currentUser.username }));
    dispatch(setActiveConversation(selectedUser));
    navigate("/chat");
  };

  const handleStartCall = (type) => {
    if (profileUser?.uniqueId) {
      onInitiateCall(profileUser.uniqueId, type);
    } else {
      alert("This user does not have a valid Call ID.");
    }
  };

  const isUserOnline = onlineUsers.includes(selectedUser) || selectedUser === "Ashish" || selectedUser === "Gauri" || profileUser?.isOnline;

  return (
    <div className="flex-1 h-full flex flex-col bg-brand-bg-light dark:bg-brand-bg-dark relative overflow-hidden font-sans">
      <UnifiedHeader 
        title={`${selectedUser} Profile`}
        subtitle="Directory details and actions"
        showMobileBack={true}
        onMobileBack={() => navigate("/contacts")}
      />

      <div className="flex-1 flex items-center justify-center p-6 md:p-8 overflow-y-auto custom-scrollbar relative">
        {/* Modern Blurred Mesh Backdrop (Glassmorphic Accent Overlay) */}
        <div className="absolute top-0 inset-x-0 h-40 pointer-events-none overflow-hidden opacity-30 dark:opacity-20 select-none">
          <div className={`w-[250px] h-[250px] rounded-full blur-3xl mx-auto -mt-20 ${
            selectedUser === "Ashish" 
              ? "bg-amber-500" 
              : selectedUser === "Gauri" 
                ? "bg-brand-teal" 
                : "bg-purple-500"
          }`} />
        </div>

        {/* Premium Glassmorphic Card Container */}
        <div className="max-w-md w-full bg-white/75 dark:bg-[#080808]/85 border border-brand-border-light dark:border-white/5 backdrop-blur-lg p-8 rounded-[2rem] shadow-2xl flex flex-col space-y-6 z-10 transition-all select-none">
          
          {/* Top Profile Header (Avatar and Badges) */}
          <div className="flex flex-col items-center">
            {/* Glowing avatar backing aligned to online status */}
            <div className="relative group">
              <div className={`absolute -inset-1 rounded-full blur-lg opacity-40 group-hover:opacity-70 transition duration-500 ${isUserOnline ? 'bg-emerald-500' : 'bg-zinc-500'}`} />
              <div className="relative p-1 rounded-full bg-white dark:bg-brand-panel-dark">
                <Avatar name={selectedUser} size="xxl" isOnline={isUserOnline} showStatus={true} />
              </div>
            </div>
            
            <h3 className="text-base font-extrabold text-gray-800 dark:text-white mt-4 font-sans tracking-tight leading-none">
              {profileUser?.name || selectedUser}
            </h3>
            <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-sans mt-1.5">
              @{selectedUser}
            </p>
            
            {/* Role Badge */}
            <span className={`text-[9px] font-extrabold px-3 py-1 rounded-full mt-3 uppercase tracking-wider border shadow-sm ${
              selectedUser === "Ashish" 
                ? "bg-amber-500/10 text-amber-500 border-amber-500/20" 
                : selectedUser === "Gauri" 
                  ? "bg-brand-teal/10 text-brand-teal border-brand-teal/20" 
                  : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
            }`}>
              {selectedUser === "Ashish" ? "Administrator" : selectedUser === "Gauri" ? "Moderator" : "Member"}
            </span>
          </div>

          {/* Details Section */}
          <div className="border-t border-b border-gray-100 dark:border-white/5 py-5 space-y-4 font-sans text-xs">
            
            {/* Timezone */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-gray-400 dark:text-zinc-500 select-none">
                <FiClock size={13} className="text-gray-400" />
                <span className="font-medium text-[11px]">Timezone</span>
              </div>
              <span className="font-bold text-gray-800 dark:text-zinc-200">IST (UTC+5:30)</span>
            </div>

            {/* Bio Status */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-gray-400 dark:text-zinc-500 select-none">
                <FiInfo size={13} className="text-gray-400" />
                <span className="font-medium text-[11px]">Bio Status</span>
              </div>
              <span className="font-bold text-gray-800 dark:text-zinc-200 italic max-w-[160px] truncate" title={profileUser?.bio}>
                {profileUser?.bio || "Hey there! I am using SocketChat."}
              </span>
            </div>

            {/* Call ID with easy copying */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-gray-400 dark:text-zinc-500 select-none">
                <FiKey size={13} className="text-gray-400" />
                <span className="font-medium text-[11px]">Call ID</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-brand-teal select-text cursor-pointer hover:underline" title="Call ID">
                  {profileUser?.uniqueId || "••••••••"}
                </span>
                {profileUser?.uniqueId && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(profileUser.uniqueId);
                      showToast("Call ID copied!", "success");
                    }}
                    className="p-1 rounded-md text-gray-400 dark:text-zinc-500 hover:text-brand-teal dark:hover:text-brand-teal hover:bg-brand-teal/10 transition cursor-pointer flex items-center justify-center"
                    title="Copy Call ID"
                  >
                    <FiCopy size={11} />
                  </button>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-gray-400 dark:text-zinc-500 select-none">
                <FiActivity size={13} className="text-gray-400" />
                <span className="font-medium text-[11px]">Presence</span>
              </div>
              <span className={`font-bold uppercase tracking-wider text-[10px] ${isUserOnline ? "text-emerald-500" : "text-zinc-400"}`}>
                {isUserOnline ? "Available" : "Offline"}
              </span>
            </div>

          </div>

          {/* Action Buttons Section */}
          <div className="flex flex-col gap-3 pt-2">
            {/* Primary Button: Message */}
            <button 
              onClick={startPrivateChat}
              className="w-full flex items-center justify-center gap-2 py-3.5 text-xs font-bold text-white bg-brand-teal hover:bg-brand-teal/95 hover:shadow-md hover:shadow-brand-teal/20 rounded-2xl transition-all duration-300 active:scale-98 cursor-pointer"
            >
              <FiMessageSquare size={14} />
              <span>Send Private Message</span>
            </button>

            {/* Secondary Row: Voice & Video calls */}
            <div className="grid grid-cols-2 gap-3 w-full">
              <button 
                onClick={() => handleStartCall("audio")}
                className="flex items-center justify-center gap-2 py-3 text-xs font-bold text-gray-700 dark:text-zinc-200 bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 border border-gray-200/50 dark:border-white/5 rounded-2xl transition-all duration-300 active:scale-98 cursor-pointer"
              >
                <FiPhone size={14} />
                <span>Voice Call</span>
              </button>
              <button 
                onClick={() => handleStartCall("video")}
                className="flex items-center justify-center gap-2 py-3 text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 hover:shadow-md hover:shadow-purple-500/20 rounded-2xl transition-all duration-300 active:scale-98 cursor-pointer"
              >
                <FiVideo size={14} />
                <span>Video Call</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. ANALYTICS VIEW COMPONENTS
// ==========================================
export function AnalyticsSidebar() {
  const [period, setPeriod] = useState("weekly");
  const items = ["Today", "Weekly", "Monthly", "All-time"];

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-brand-panel-dark border-r border-brand-border-light dark:border-white/5 font-sans">
      <div className="h-16 px-4 flex items-center justify-between border-b border-brand-border-light dark:border-white/5">
        <span className="text-[12px] font-extrabold tracking-wider text-gray-800 dark:text-gray-100 uppercase">Analytics</span>
      </div>
      <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
        <span className="text-[9px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-widest block mb-3">Scope</span>
        <div className="space-y-1">
          {items.map((it) => (
            <button
              key={it}
              onClick={() => setPeriod(it.toLowerCase())}
              className={`w-full text-left p-3 rounded-xl transition cursor-pointer font-bold text-[11px] ${
                period === it.toLowerCase() 
                  ? "bg-brand-teal text-white shadow-md shadow-brand-teal/20" 
                  : "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300"
              }`}
            >
              {it}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AnalyticsMainArea() {
  const stats = [
    { title: "Messages Sent", count: "1,240", icon: <FiMessageSquare size={15} />, trend: "+12.4% vs last week", color: "text-brand-teal bg-brand-teal/10" },
    { title: "Active Duration", count: "48h 12m", icon: <FiActivity size={15} />, trend: "+8.2% vs last week", color: "text-purple-500 bg-purple-500/10" },
    { title: "Calls Logged", count: "32", icon: <FiPhoneCall size={15} />, trend: "-3.5% vs last week", color: "text-amber-500 bg-amber-500/10" },
    { title: "Storage Used", count: "2.4 MB", icon: <FiDatabase size={15} />, trend: "0.2% growth rate", color: "text-rose-500 bg-rose-500/10" }
  ];

  return (
    <div className="flex-1 h-full flex flex-col bg-brand-bg-light dark:bg-brand-bg-dark relative overflow-hidden font-sans">
      <UnifiedHeader 
        title="Analytics Dashboard" 
        subtitle="SaaS Dashboard and Metrics Overview"
        showMobileBack={false}
        actions={
          <span className="text-[9px] text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            DEMO DATA
          </span>
        }
      />

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 space-y-6">
        {/* Warning Alert Banner */}
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3 text-left">
          <FiInfo className="text-amber-600 dark:text-amber-450 mt-0.5 flex-shrink-0" size={16} />
          <div>
            <h5 className="text-[11px] font-extrabold text-amber-800 dark:text-amber-400 uppercase tracking-wide">
              Demo Analytics
            </h5>
            <p className="text-[9.5px] text-amber-700 dark:text-amber-500/90 mt-1 leading-normal">
              The metrics, statistics, and graphs shown on this dashboard reflect simulation indicator data. Live system telemetry and server logs analytics will be integrated in a future update.
            </p>
          </div>
        </div>

        {/* Statistics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((st, idx) => (
            <div key={idx} className="p-5 bg-white dark:bg-brand-card-dark border border-brand-border-light dark:border-white/5 rounded-2xl shadow-sm text-left flex flex-col justify-between relative overflow-hidden">
              <span className="absolute top-2 right-2 text-[8px] font-bold text-amber-500/60 bg-amber-500/5 px-1.5 py-0.5 rounded uppercase tracking-wider">
                Demo
              </span>
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">{st.title}</span>
                <div className={`p-2 rounded-xl flex items-center justify-center ${st.color}`}>
                  {st.icon}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xl font-extrabold text-gray-800 dark:text-gray-100">{st.count}</p>
                <p className="text-[9px] text-emerald-500 mt-1 font-bold flex items-center gap-1">
                  <FiTrendingUp size={11} /> {st.trend}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Transmission volume history */}
        <div className="bg-white dark:bg-brand-card-dark border border-brand-border-light dark:border-white/5 rounded-3xl p-6 flex flex-col text-left shadow-sm relative">
          <span className="absolute top-6 right-6 text-[8px] font-bold text-amber-500/60 bg-amber-500/5 px-2 py-0.5 rounded-full uppercase tracking-wider border border-amber-500/10">
            Preview Dataset
          </span>
          <div className="mb-6">
            <h4 className="text-[11px] font-extrabold text-gray-800 dark:text-gray-100 uppercase tracking-wider">Message Volume History</h4>
            <p className="text-[9px] text-gray-400 dark:text-zinc-500 mt-0.5">Transmission traffic statistics over the past week (Sample Feed)</p>
          </div>
          
          <div className="h-48 pl-2 pr-2 relative mt-4 flex items-end justify-between">
            {/* Gridlines */}
            <div className="absolute inset-0 flex flex-col justify-between border-l border-b border-gray-100 dark:border-white/5">
              <div className="border-t border-dashed border-gray-100 dark:border-white/5 w-full h-0" />
              <div className="border-t border-dashed border-gray-100 dark:border-white/5 w-full h-0" />
              <div className="border-t border-dashed border-gray-100 dark:border-white/5 w-full h-0" />
            </div>

            {[
              { label: "Mon", height: "40%" },
              { label: "Tue", height: "65%" },
              { label: "Wed", height: "50%" },
              { label: "Thu", height: "85%" },
              { label: "Fri", height: "70%" },
              { label: "Sat", height: "30%" },
              { label: "Sun", height: "35%" }
            ].map((day, idx) => (
              <div 
                key={idx} 
                style={{ height: day.height }} 
                className="w-10 bg-brand-teal/20 hover:bg-brand-teal/40 dark:bg-brand-teal/15 dark:hover:bg-brand-teal/30 transition-all rounded-t-lg flex items-end justify-center pb-2 z-10 group cursor-pointer"
              >
                <span className="text-[8px] font-extrabold text-brand-teal uppercase opacity-70 group-hover:opacity-100 transition">
                  {day.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. CALLS VIEW COMPONENTS
// ==========================================
export function CallsSidebar({ currentUser, onInitiateCall }) {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-brand-panel-dark border-r border-brand-border-light dark:border-white/5 font-sans">
      <div className="h-16 px-4 flex items-center justify-between border-b border-brand-border-light dark:border-white/5">
        <span className="text-[12px] font-extrabold tracking-wider text-gray-800 dark:text-gray-100 uppercase">Recent Calls</span>
        <button 
          onClick={() => navigate("/calls?dial=true")}
          className="px-3 py-1 text-[9px] font-bold text-white bg-brand-teal hover:bg-brand-teal/90 rounded-lg transition cursor-pointer shadow-sm"
        >
          Dial
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
        <CallHistoryList currentUser={currentUser} onInitiateCall={onInitiateCall} />
      </div>
    </div>
  );
}

export function CallsMainArea({ onInitiateCall, callError, isDialing }) {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const showDial = searchParams.get("dial");

  if (!showDial) {
    return (
      <div className="flex-1 h-full flex flex-col bg-brand-bg-light dark:bg-brand-bg-dark relative overflow-hidden font-sans">
        <UnifiedHeader 
          title="Voice Calls" 
          subtitle="Communication log & dialer"
          showMobileBack={false}
        />
        <div className="flex-1 flex flex-col justify-center items-center p-8 text-center">
          <div className="bg-brand-teal/5 dark:bg-brand-teal/10 p-6 rounded-full mb-4 animate-pulse">
            <FiVideo className="text-brand-teal" size={36} />
          </div>
          <h4 className="text-xs font-extrabold text-gray-800 dark:text-gray-200 uppercase tracking-widest">No active call</h4>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 max-w-xs mt-2">
            Click Dial on the sidebar to open the dialing pad or use your Call ID to invite other members.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col bg-brand-bg-light dark:bg-brand-bg-dark relative overflow-hidden font-sans">
      <UnifiedHeader 
        title="Dialpad"
        subtitle="Initiate WebRTC Calls using 8-digit Call ID"
        showMobileBack={true}
        onMobileBack={() => navigate("/calls")}
      />

      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto custom-scrollbar">
        <div className="max-w-md w-full bg-white dark:bg-brand-card-dark p-6 rounded-[2rem] border border-brand-border-light dark:border-white/5 shadow-md">
          <DialPad 
            onInitiateCall={onInitiateCall} 
            callError={callError} 
            isDialing={isDialing} 
          />
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 6. SETTINGS VIEW COMPONENTS
// ==========================================
export function SettingsSidebar() {
  return null;
}

export const CosmosBackground = React.memo(function CosmosBackground() {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles = [];
    const maxParticles = 40;
    const mouse = { x: null, y: null, active: false };

    class Particle {
      constructor(x, y, isMouseTrail = false) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 0.5;
        this.isMouseTrail = isMouseTrail;
        
        // Cosmos palette: teal, purple, cyan, pink
        const colors = [
          "rgba(13, 148, 136, ",
          "rgba(168, 85, 247, ",
          "rgba(6, 182, 212, ",
          "rgba(236, 72, 153, "
        ];
        this.colorPrefix = colors[Math.floor(Math.random() * colors.length)];
        
        if (isMouseTrail) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 1.5 + 0.5;
          this.vx = Math.cos(angle) * speed;
          this.vy = Math.sin(angle) * speed;
          this.alpha = 1.0;
          this.decay = Math.random() * 0.015 + 0.01;
        } else {
          this.vx = (Math.random() - 0.5) * 0.2;
          this.vy = (Math.random() - 0.5) * 0.2;
          this.alpha = Math.random() * 0.5 + 0.1;
          this.decay = 0;
        }
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.isMouseTrail) {
          this.alpha -= this.decay;
        } else {
          this.alpha += (Math.random() - 0.5) * 0.02;
          if (this.alpha < 0.1) this.alpha = 0.1;
          if (this.alpha > 0.6) this.alpha = 0.6;

          if (this.x < 0) this.x = width;
          if (this.x > width) this.x = 0;
          if (this.y < 0) this.y = height;
          if (this.y > height) this.y = 0;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${this.colorPrefix}${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle(Math.random() * width, Math.random() * height, false));
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;

      if (particles.length < maxParticles + 45) {
        for (let i = 0; i < 2; i++) {
          particles.push(new Particle(mouse.x, mouse.y, true));
        }
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener("mousemove", handleMouseMove);
      parent.addEventListener("mouseleave", handleMouseLeave);
    }

    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      // Connect close ambient stars
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          if (!p1.isMouseTrail && !p2.isMouseTrail) {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 80) {
              const lineAlpha = (1 - dist / 80) * 0.08;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(13, 148, 136, ${lineAlpha})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw();

        if (p.isMouseTrail && p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (parent) {
        parent.removeEventListener("mousemove", handleMouseMove);
        parent.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
});

export function SettingsMainArea({
  currentUser,
  settingsBio,
  setSettingsBio,
  handleSaveSettings,
  theme,
  toggleTheme,
  onLogout
}) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [saved, setSaved] = React.useState(false);
  const [editing, setEditing] = React.useState(false);

  if (!currentUser) return null;

  const onSave = () => {
    handleSaveSettings();
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const getJoinedDate = () => {
    if (currentUser.createdAt) {
      return new Date(currentUser.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    }
    return "July 2026";
  };  return (
    <div className="flex-1 h-full flex flex-col bg-brand-bg-light dark:bg-brand-bg-dark font-sans overflow-hidden relative">
      <UnifiedHeader 
        title="Profile" 
        subtitle="Manage your profile and workspace preferences"
        showMobileBack={true}
        onMobileBack={() => navigate("/chat")}
      />

      <div className="flex-1 overflow-y-auto custom-scrollbar flex items-center justify-center p-6 relative tech-grid-overlay">
        
        {/* Interactive Cosmos Star Trail Canvas */}
        <CosmosBackground />

        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-teal-400/20 dark:bg-teal-500/10 rounded-full filter blur-3xl animate-blob" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-purple-400/20 dark:bg-purple-500/10 rounded-full filter blur-3xl animate-blob [animation-delay:3s]" />
          <div className="absolute -bottom-10 left-20 w-80 h-80 bg-pink-400/20 dark:bg-pink-500/10 rounded-full filter blur-3xl animate-blob [animation-delay:6s]" />
        </div>

        <div className="max-w-md w-full text-center space-y-8 py-8 relative z-10 bg-white/70 dark:bg-brand-card-dark/65 backdrop-blur-xl border border-brand-border-light dark:border-white/5 rounded-3xl p-8 shadow-xl overflow-hidden">
          
          {/* Futuristic Corner Crosshairs */}
          <div className="absolute top-2 left-3 text-[10px] font-mono text-brand-teal/40 dark:text-teal-400/25 font-bold pointer-events-none select-none">+</div>
          <div className="absolute top-2 right-3 text-[10px] font-mono text-brand-teal/40 dark:text-teal-400/25 font-bold pointer-events-none select-none">+</div>
          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-brand-teal/40 dark:text-teal-400/25 font-bold pointer-events-none select-none">+</div>
          <div className="absolute bottom-2 right-3 text-[10px] font-mono text-brand-teal/40 dark:text-teal-400/25 font-bold pointer-events-none select-none">+</div>
          
          {/* 1. Pinterest Style Avatar & Identity Block */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <div className="relative ring-4 ring-white dark:ring-brand-bg-dark rounded-full shadow-md overflow-hidden">
                <Avatar name={currentUser.username} size="xxl" showStatus={false} />
              </div>
            </div>
            
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {currentUser.name || currentUser.username}
              </h1>
              <p className="text-[11px] text-gray-400 dark:text-zinc-555 font-medium font-sans">
                {currentUser.email || `${currentUser.username}@socketchat.com`}
              </p>
            </div>
          </div>

          {/* 2. Status Bio Box (Minimalistic click-to-edit status) */}
          <div className="max-w-xs mx-auto relative h-10 flex items-center justify-center">
            {editing ? (
              <div className="space-y-2 w-full animate-fade-in">
                <input
                  type="text"
                  value={settingsBio}
                  onChange={(e) => setSettingsBio(e.target.value)}
                  maxLength={120}
                  autoFocus
                  placeholder="What's on your mind?"
                  className="w-full text-center py-2 px-3 text-xs rounded-xl bg-gray-50 dark:bg-white/5 border border-brand-teal/30 focus:border-brand-teal focus:outline-none text-gray-900 dark:text-white transition-all font-sans"
                />
                <div className="flex items-center justify-center gap-1.5">
                  <button
                    onClick={() => setEditing(false)}
                    className="px-2.5 py-1 text-[9px] font-semibold text-gray-450 hover:text-gray-655 dark:hover:text-zinc-350 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onSave}
                    className="px-3 py-1 text-[9px] font-bold bg-brand-teal text-white rounded-lg cursor-pointer hover:bg-brand-teal/90 transition shadow-sm"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="group relative inline-block">
                <p 
                  onClick={() => setEditing(true)}
                  className="text-xs text-gray-655 dark:text-gray-300 leading-relaxed cursor-pointer hover:text-brand-teal dark:hover:text-brand-teal transition-colors px-4 italic font-sans"
                >
                  "{settingsBio || "Add a status bio..."}"
                </p>
                {saved && (
                  <span className="absolute left-1/2 -translate-x-1/2 -bottom-5 text-[8px] font-bold text-emerald-500 uppercase tracking-widest whitespace-nowrap animate-fade-in">
                    Saved!
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 3. Sleek, Flat Settings Details */}
          <div className="max-w-xs mx-auto border-t border-b border-gray-100 dark:border-white/5 py-6 space-y-5">
            {/* Call ID Item */}
            <div className="flex items-center justify-between text-xs font-sans">
              <span className="text-gray-455 dark:text-zinc-500 font-medium">Workspace Call ID</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-gray-800 dark:text-zinc-200">
                  {currentUser.uniqueId || "83749204"}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(currentUser.uniqueId || "83749204");
                    showToast("Call ID copied!", "success");
                  }}
                  className="text-[9px] font-bold text-brand-teal hover:underline cursor-pointer"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Joined Date Item */}
            <div className="flex items-center justify-between text-xs font-sans">
              <span className="text-gray-455 dark:text-zinc-500 font-medium">Member Since</span>
              <span className="font-semibold text-gray-700 dark:text-zinc-300">
                {getJoinedDate()}
              </span>
            </div>

            {/* Interface Theme Switcher Row */}
            <div className="flex items-center justify-between text-xs font-sans">
              <span className="text-gray-455 dark:text-zinc-500 font-medium">Dark Theme</span>
              <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
            </div>
          </div>

          {/* 4. Action Buttons (Sign Out / Close) */}
          <div className="flex flex-col items-center space-y-3">
            <button
              onClick={() => onLogout()}
              className="px-6 py-2.5 text-xs font-bold text-red-500 hover:text-white dark:text-red-400 dark:hover:text-white bg-transparent border border-red-200/50 hover:bg-red-500 dark:border-red-500/20 dark:hover:bg-red-550 rounded-full transition cursor-pointer"
            >
              Sign out
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
