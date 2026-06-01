import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  FiFileText, FiFolder, FiSearch, FiChevronRight, FiUsers, FiLock, FiVideo, 
  FiPhone, FiSend, FiPaperclip, FiSmile, FiVolume2, FiVolumeX, FiPlus, FiPhoneCall,
  FiPhoneMissed, FiArrowUpRight, FiArrowDownLeft, FiClock, FiActivity, FiMessageSquare,
  FiDatabase, FiMaximize2, FiShare2, FiChevronLeft, FiSave, FiLogOut, FiSliders,
  FiGrid, FiList, FiTrendingUp, FiUser, FiInfo, FiMoon, FiShield, FiBell, FiWifi, FiCheckCircle, FiEdit2
} from "react-icons/fi";
import { BsPinAngleFill, BsGrid, BsList } from "react-icons/bs";
import Avatar from "../common/Avatar";
import ThemeSwitcher from "../common/ThemeSwitcher";
import { useToast } from "../common/ToastContext";
import { setActiveConversation, createConversation } from "../../features/chat/chatSlice";

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
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category") || "all";
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const headerSearch = (
    <div className="relative">
      <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={13} />
      <input
        type="text"
        placeholder="Search files..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full py-1.5 pl-8 pr-4 text-[10px] rounded-xl bg-brand-bg-light dark:bg-zinc-800 border border-transparent focus:border-brand-teal focus:outline-none text-gray-900 dark:text-white transition-all"
      />
    </div>
  );

  const headerActions = (
    <button 
      onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
      className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition cursor-pointer"
      title={viewMode === "grid" ? "List View" : "Grid View"}
    >
      {viewMode === "grid" ? <FiList size={14} /> : <FiGrid size={14} />}
    </button>
  );

  return (
    <div className="flex-1 h-full flex flex-col bg-brand-bg-light dark:bg-brand-bg-dark relative overflow-hidden font-sans">
      <UnifiedHeader 
        title="Files Cabinet" 
        subtitle="Files attached in conversations will appear here"
        search={headerSearch}
        actions={headerActions}
        showMobileBack={true}
        onMobileBack={() => navigate("/files")}
      />

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="flex justify-between items-center mb-6 pl-1 pr-1">
          <h3 className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
            {category.charAt(0).toUpperCase() + category.slice(1)} Files
          </h3>
        </div>

        {/* Empty state — no dummy data shown */}
        <div className="h-64 flex flex-col items-center justify-center text-center text-gray-400">
          <FiFolder size={36} className="opacity-20 mb-3" />
          <p className="text-[11px] font-bold text-gray-400 dark:text-zinc-500">No files shared yet</p>
          <p className="text-[10px] text-gray-300 dark:text-zinc-600 mt-1 max-w-xs">
            Files and images attached in your conversations will appear here.
          </p>
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
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);
  const currentUser = useSelector((state) => state.auth.user);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const activeChannel = searchParams.get("name") || "#general";

  useEffect(() => {
    const cached = localStorage.getItem(`channel_${activeChannel}`);
    if (cached) {
      setMessages(JSON.parse(cached));
    } else {
      setMessages([]);
    }
  }, [activeChannel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updated = [...messages, { sender: currentUser.username, text: inputText.trim(), time }];
    setMessages(updated);
    localStorage.setItem(`channel_${activeChannel}`, JSON.stringify(updated));
    setInputText("");
  };

  const headerActions = (
    <span className="text-[9px] text-brand-teal bg-brand-teal/5 border border-brand-teal/20 px-3 py-1 rounded-full font-bold">
      Public Group
    </span>
  );

  return (
    <div className="flex-1 h-full flex flex-col bg-brand-bg-light dark:bg-brand-bg-dark relative overflow-hidden font-sans">
      <UnifiedHeader 
        title={activeChannel}
        subtitle="Real-time updates and group discussions"
        actions={headerActions}
        showMobileBack={true}
        onMobileBack={() => navigate("/channels")}
      />

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
        {messages.map((msg, idx) => {
          const fromSelf = msg.sender === currentUser.username;
          return (
            <div key={idx} className={`flex flex-col ${fromSelf ? "items-end" : "items-start"}`}>
              <div className="text-[9px] text-gray-400 mb-1 pl-1 pr-1 font-sans">
                <span className="font-bold">{msg.sender}</span>
                <span className="mx-1">&bull;</span>
                <span>{msg.time}</span>
              </div>
              <div className={`p-3 rounded-2xl text-[11px] leading-relaxed max-w-[65%] font-sans break-words ${
                fromSelf 
                  ? "bg-[#DDE9F9] dark:bg-zinc-800 text-gray-800 dark:text-gray-100 rounded-br-none" 
                  : "bg-white dark:bg-zinc-900/60 text-gray-800 dark:text-gray-100 border border-brand-border-light dark:border-white/5 rounded-bl-none"
              }`}>
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef}></div>
      </div>

      <div className="p-4 border-t border-brand-border-light dark:border-white/5 bg-white/70 dark:bg-brand-panel-dark/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-100 dark:bg-white/5 border border-transparent focus-within:border-brand-teal rounded-2xl px-4 py-2 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={`Post a message to ${activeChannel}...`}
              className="flex-1 bg-transparent border-none focus:outline-none text-[11px] text-gray-900 dark:text-white font-sans"
            />
          </div>
          <button
            onClick={handleSend}
            className="p-2.5 rounded-full bg-brand-teal hover:bg-brand-teal/95 text-white shadow-md shadow-brand-teal/20 transition flex items-center justify-center cursor-pointer"
          >
            <FiSend size={14} />
          </button>
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
        <div className="relative mb-4">
          <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={13} />
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-1.5 pl-8 pr-4 text-[10px] rounded-xl bg-brand-bg-light dark:bg-zinc-800 border border-transparent focus:border-brand-teal focus:outline-none text-gray-900 dark:text-white transition-all font-sans"
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
                  className={`flex items-center justify-between p-2.5 rounded-xl transition cursor-pointer ${
                    isActive ? "bg-brand-teal text-white shadow-md shadow-brand-teal/20" : "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={usr.username} size="sm" isOnline={isOnline} />
                    <div className="text-left font-sans min-w-0">
                      <p className={`text-[11px] font-bold truncate ${isActive ? "text-white" : "text-gray-800 dark:text-gray-100"}`}>{usr.name || usr.username}</p>
                      <p className={`text-[9px] truncate ${isActive ? "text-white/85" : "text-gray-400"} mt-0.5`}>{usr.bio || "Available"}</p>
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

export function ContactsMainArea({ onlineUsers = [] }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedUser = searchParams.get("username");

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

  const isUserOnline = onlineUsers.includes(selectedUser) || selectedUser === "Ashish" || selectedUser === "Gauri";

  return (
    <div className="flex-1 h-full flex flex-col bg-brand-bg-light dark:bg-brand-bg-dark relative overflow-hidden font-sans">
      <UnifiedHeader 
        title={`${selectedUser} Profile`}
        subtitle="Directory details and actions"
        showMobileBack={true}
        onMobileBack={() => navigate("/contacts")}
      />

      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto custom-scrollbar">
        <div className="max-w-sm w-full bg-white dark:bg-brand-card-dark p-8 rounded-3xl border border-brand-border-light dark:border-white/5 shadow-md text-center space-y-6">
          <div className="flex flex-col items-center">
            <Avatar name={selectedUser} size="xxl" isOnline={isUserOnline} showStatus={true} />
            <h3 className="text-sm font-bold text-gray-800 dark:text-white mt-4">{selectedUser}</h3>
            <span className="text-[9px] bg-brand-teal/15 text-brand-teal font-extrabold px-3 py-0.5 rounded-full mt-2 uppercase tracking-wider">
              {selectedUser === "Ashish" ? "Admin" : selectedUser === "Gauri" ? "Moderator" : "Member"}
            </span>
          </div>

          <div className="border-t border-b border-gray-100 dark:border-white/5 py-4 space-y-3 font-sans text-[11px]">
            <div className="flex justify-between pl-2 pr-2">
              <span className="text-gray-400 font-medium">Timezone</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">IST (UTC+5:30)</span>
            </div>
            <div className="flex justify-between pl-2 pr-2">
              <span className="text-gray-400 font-medium">Bio Status</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200 italic max-w-[160px] truncate">
                {selectedUser === "Ashish" ? "Senior MERN stack lead" : selectedUser === "Gauri" ? "Visual UI designer" : "SocketChat contributor"}
              </span>
            </div>
            <div className="flex justify-between pl-2 pr-2">
              <span className="text-gray-400 font-medium">Status</span>
              <span className={`font-bold ${isUserOnline ? "text-emerald-500" : "text-gray-400"}`}>
                {isUserOnline ? "Available" : "Offline"}
              </span>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button 
              onClick={startPrivateChat}
              className="flex items-center gap-1.5 px-4 py-2.5 text-[10px] font-bold text-white bg-brand-teal hover:bg-brand-teal/90 rounded-xl transition shadow-sm cursor-pointer"
            >
              <FiMessageSquare size={13} />
              Send Message
            </button>
            <button 
              onClick={() => alert(`Voice calling simulation for @${selectedUser}...`)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-[10px] font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl transition cursor-pointer"
            >
              <FiPhone size={13} />
              Voice Call
            </button>
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
        title="Analytics" 
        subtitle="SaaS Dashboard and Metrics Overview"
        showMobileBack={false}
      />

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6">
        {/* Statistics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((st, idx) => (
            <div key={idx} className="p-5 bg-white dark:bg-brand-card-dark border border-brand-border-light dark:border-white/5 rounded-2xl shadow-sm text-left flex flex-col justify-between">
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
        <div className="bg-white dark:bg-brand-card-dark border border-brand-border-light dark:border-white/5 rounded-3xl p-6 flex flex-col text-left shadow-sm">
          <div className="mb-6">
            <h4 className="text-[11px] font-extrabold text-gray-800 dark:text-gray-100 uppercase tracking-wider">Message Volume History</h4>
            <p className="text-[9px] text-gray-400 dark:text-zinc-500 mt-0.5">Transmission traffic statistics over the past week</p>
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
export function CallsSidebar() {
  const navigate = useNavigate();
  const logs = [
    { name: "Gauri", type: "incoming", duration: "12m 45s", time: "Today, 2:15 PM" },
    { name: "Ashish", type: "outgoing", duration: "4m 12s", time: "Yesterday, 6:30 PM" },
    { name: "Gauri", type: "missed", duration: "0s", time: "May 30, 10:20 AM" },
    { name: "Gauri", type: "incoming", duration: "32m 10s", time: "May 28, 4:15 PM" }
  ];

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

      <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-1">
        <span className="text-[9px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-widest block mb-3">Call Logs</span>
        {logs.map((log, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0">
                {log.type === "incoming" && <FiArrowDownLeft className="text-emerald-500" size={15} />}
                {log.type === "outgoing" && <FiArrowUpRight className="text-brand-teal" size={15} />}
                {log.type === "missed" && <FiPhoneMissed className="text-rose-500" size={15} />}
              </div>
              <div className="text-left font-sans min-w-0">
                <p className="text-[11px] font-bold text-gray-800 dark:text-gray-100 truncate">{log.name}</p>
                <p className="text-[9px] text-gray-400 dark:text-zinc-500 mt-0.5 truncate">{log.time} ({log.duration})</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CallsMainArea() {
  const [dialNum, setDialNum] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isDialing = searchParams.get("dial");
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

  if (!isDialing) {
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
          <h4 className="text-xs font-extrabold text-gray-800 dark:text-gray-200 uppercase tracking-widest">No recent calls</h4>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 max-w-xs mt-2">
            Click Dial on the sidebar to open the dialing pad or start voice call simulations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col bg-brand-bg-light dark:bg-brand-bg-dark relative overflow-hidden font-sans">
      <UnifiedHeader 
        title="Dialpad"
        subtitle="Initiate simulated calls"
        showMobileBack={true}
        onMobileBack={() => navigate("/calls")}
      />

      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto custom-scrollbar">
        <div className="max-w-xs w-full bg-white dark:bg-brand-card-dark p-6 rounded-[2rem] border border-brand-border-light dark:border-white/5 shadow-md space-y-6">
          <div className="text-center pt-2">
            <input
              type="text"
              readOnly
              value={dialNum || "Enter number..."}
              className={`w-full bg-transparent text-center border-none focus:outline-none text-lg font-extrabold tracking-widest ${
                dialNum ? "text-gray-800 dark:text-white" : "text-gray-400"
              }`}
            />
          </div>

          <div className="grid grid-cols-3 gap-3.5 justify-items-center">
            {keys.map((k) => (
              <button
                key={k}
                onClick={() => setDialNum((n) => n + k)}
                className="w-12 h-12 rounded-full border border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/5 font-extrabold text-[12px] flex items-center justify-center transition cursor-pointer text-gray-700 dark:text-gray-200"
              >
                {k}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            {dialNum && (
              <button
                onClick={() => setDialNum("")}
                className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 flex items-center justify-center text-[10px] font-bold cursor-pointer text-gray-600 dark:text-gray-300"
              >
                Clear
              </button>
            )}

            <button
              onClick={() => alert(`Dialing ${dialNum || "Gauri"}...`)}
              className="w-12 h-12 rounded-full bg-brand-teal hover:bg-brand-teal/90 text-white flex items-center justify-center shadow-md shadow-brand-teal/20 transition cursor-pointer"
            >
              <FiPhoneCall size={16} />
            </button>
          </div>
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
  const [saved, setSaved] = React.useState(false);
  const [editing, setEditing] = React.useState(false);

  if (!currentUser) return null;

  const onSave = () => {
    handleSaveSettings();
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-brand-bg-light dark:bg-brand-bg-dark font-sans overflow-hidden">
      <UnifiedHeader 
        title="Settings" 
        subtitle="Manage your profile and appearance preferences"
        showMobileBack={true}
        onMobileBack={() => navigate("/chat")}
      />

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Banner Hero */}
        <div className="relative w-full">
          <div className="h-24 sm:h-28 bg-gradient-to-br from-brand-teal via-teal-500 to-cyan-600 dark:from-teal-700 dark:via-teal-600 dark:to-cyan-800 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 left-1/3 w-24 h-24 rounded-full bg-white/5 blur-xl" />
          </div>
          <div className="absolute -bottom-8 left-6">
            <div className="ring-4 ring-brand-bg-light dark:ring-brand-bg-dark rounded-full shadow-md">
              <Avatar name={currentUser.username} size="xl" showStatus={false} />
            </div>
          </div>
        </div>

        {/* Settings Body */}
        <div className="px-6 pt-12 pb-10 max-w-2xl mx-auto space-y-6 text-left">
          {/* User Profile Ident */}
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-gray-900 dark:text-white">{currentUser.username}</h2>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-brand-teal/10 text-brand-teal border border-brand-teal/20">
                Standard Account
              </span>
              <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                Online
              </span>
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-white dark:bg-brand-card-dark rounded-2xl border border-brand-border-light dark:border-white/5 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-white/5">
              <div className="p-1.5 rounded-lg bg-brand-teal/10 text-brand-teal"><FiEdit2 size={13} /></div>
              <div>
                <h3 className="text-[11px] font-extrabold text-gray-800 dark:text-gray-100 uppercase tracking-wider">Profile</h3>
                <p className="text-[9px] text-gray-400 dark:text-zinc-500">Customize your public bio status message</p>
              </div>
            </div>
            <div className="p-5 space-y-3.5">
              <div className="flex items-center justify-between">
                <label className="text-[9px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Bio / Status</label>
                {!editing && (
                  <button onClick={() => setEditing(true)} className="text-[10px] font-bold text-brand-teal hover:underline cursor-pointer">
                    Edit
                  </button>
                )}
              </div>
              {editing ? (
                <div className="space-y-3">
                  <textarea
                    value={settingsBio}
                    onChange={(e) => setSettingsBio(e.target.value)}
                    maxLength={120}
                    autoFocus
                    placeholder="What's on your mind?"
                    rows={3}
                    className="w-full p-3 text-xs rounded-xl bg-gray-50 dark:bg-white/5 border border-brand-teal/40 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/10 focus:outline-none text-gray-900 dark:text-white resize-none transition-all font-sans"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-gray-400 dark:text-zinc-600">{settingsBio.length}/120</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditing(false)}
                        className="px-3 py-1.5 text-[10px] font-semibold text-gray-500 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 rounded-lg cursor-pointer transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={onSave}
                        className="flex items-center gap-1.5 px-4 py-1.5 text-[10px] font-bold rounded-lg cursor-pointer transition bg-brand-teal hover:bg-brand-teal/90 text-white shadow-sm"
                      >
                        <FiSave size={11} /> Save
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 p-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 min-h-[44px]">
                  {saved ? (
                    <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold">
                      <FiCheckCircle size={13} /> Saved successfully!
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
                      {settingsBio || <span className="text-gray-400 dark:text-zinc-500 italic">No bio set &mdash; edit to add one.</span>}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Appearance Card */}
          <div className="bg-white dark:bg-brand-card-dark rounded-2xl border border-brand-border-light dark:border-white/5 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-white/5">
              <div className="p-1.5 rounded-lg bg-brand-teal/10 text-brand-teal"><FiMoon size={13} /></div>
              <div>
                <h3 className="text-[11px] font-extrabold text-gray-800 dark:text-gray-100 uppercase tracking-wider">Appearance</h3>
                <p className="text-[9px] text-gray-400 dark:text-zinc-500">Adjust the visual theme of your client workspace</p>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                <div>
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{theme === "dark" ? "Dark Mode" : "Light Mode"}</p>
                  <p className="text-[9px] text-gray-400 dark:text-zinc-500 mt-0.5">
                    {theme === "dark" ? "Easy on your eyes at night" : "Bright and crisp interface design"}
                  </p>
                </div>
                <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
              </div>
            </div>
          </div>

          {/* Preferences Card */}
          <div className="bg-white dark:bg-brand-card-dark rounded-2xl border border-brand-border-light dark:border-white/5 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-white/5">
              <div className="p-1.5 rounded-lg bg-brand-teal/10 text-brand-teal"><FiBell size={13} /></div>
              <div>
                <h3 className="text-[11px] font-extrabold text-gray-800 dark:text-gray-100 uppercase tracking-wider">Preferences</h3>
                <p className="text-[9px] text-gray-400 dark:text-zinc-500">Live network connectivity and updates status</p>
              </div>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {[
                { icon: <FiBell size={14} />, bg: "bg-purple-500/10 text-purple-500", label: "Message Notifications", desc: "Get browser push notifications", badge: "ON", bc: "bg-purple-500/10 text-purple-500" },
                { icon: <FiWifi size={14} />, bg: "bg-emerald-500/10 text-emerald-500", label: "Connection Node", desc: "Connected via Socket.io channels", badge: "LIVE", bc: "bg-emerald-500/10 text-emerald-500" },
                { icon: <FiInfo size={14} />, bg: "bg-blue-500/10 text-blue-500", label: "Workspace Version", desc: "SocketChat Premium Desktop build", badge: "v1.0", bc: "bg-gray-100 dark:bg-white/5 text-gray-400" },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${row.bg}`}>{row.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-gray-800 dark:text-gray-200 truncate">{row.label}</p>
                    <p className="text-[9px] text-gray-400 dark:text-zinc-500 mt-0.5 truncate">{row.desc}</p>
                  </div>
                  <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ${row.bc}`}>{row.badge}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security Zone */}
          <div className="bg-white dark:bg-brand-card-dark rounded-2xl border border-red-200 dark:border-red-500/15 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-red-100 dark:border-red-500/10 bg-red-50/50 dark:bg-red-500/5">
              <div className="p-1.5 rounded-lg bg-red-500/10 text-red-500"><FiShield size={13} /></div>
              <div>
                <h3 className="text-[11px] font-extrabold text-red-500 uppercase tracking-wider">Account Security</h3>
                <p className="text-[9px] text-gray-400 dark:text-zinc-500">Signout option to clear credentials</p>
              </div>
            </div>
            <div className="p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10">
                <div>
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Sign out of SocketChat Workspace</p>
                  <p className="text-[9px] text-gray-400 dark:text-zinc-500 mt-0.5">Ends your session and clears browser data store safely.</p>
                </div>
                <button
                  onClick={() => onLogout()}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-[10px] font-bold text-red-500 hover:text-white bg-white dark:bg-red-500/10 hover:bg-red-500 border border-red-200 dark:border-red-500/20 rounded-xl transition cursor-pointer whitespace-nowrap w-full sm:w-auto"
                >
                  <FiLogOut size={13} /> Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
