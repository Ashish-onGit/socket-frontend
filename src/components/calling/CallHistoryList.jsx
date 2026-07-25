import React, { useEffect, useState } from "react";
import { FiPhone, FiVideo, FiArrowUpRight, FiArrowDownLeft, FiClock, FiLoader } from "react-icons/fi";
import Avatar from "../common/Avatar";

export default function CallHistoryList({ currentUser, onInitiateCall }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
      const userData = localStorage.getItem("user");
      const token = userData ? JSON.parse(userData).token : null;
      
      const res = await fetch(`${backendURL}/api/calls/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      } else {
        setError("Failed to load call log");
      }
    } catch (err) {
      setError("Server connection error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const formatDuration = (seconds) => {
    if (!seconds) return "0s";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const getRelativeTime = (timestamp) => {
    const date = new Date(timestamp);
    const isToday = new Date().toDateString() === date.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FiLoader className="text-brand-teal animate-spin" size={24} />
        <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">Loading Logs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-xs font-bold text-red-500 font-sans">
        {error}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-400 dark:text-zinc-550 font-sans space-y-2">
        <p className="text-3xl">📞</p>
        <p className="text-xs font-bold uppercase tracking-wider">No calls made yet</p>
        <p className="text-[10px] opacity-75">Your voice and video call logs will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 font-sans max-w-sm mx-auto">
      <div className="flex items-center justify-between px-2">
        <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-zinc-500">
          Recent Calls
        </h4>
        <button
          onClick={fetchHistory}
          className="text-[9px] font-bold text-brand-teal hover:underline cursor-pointer"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-2 max-h-[350px] overflow-y-auto custom-scrollbar pr-1">
        {history.map((call) => {
          const isCaller = call.caller?._id === currentUser?._id;
          const peer = isCaller ? call.receiver : call.caller;
          if (!peer) return null;

          const isMissed = !isCaller && call.status === "missed";
          const isRejected = !isCaller && call.status === "rejected";

          return (
            <div
              key={call._id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl hover:border-brand-teal/20 transition-all shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Avatar name={peer.username} size="md" showStatus={false} />
                <div className="min-w-0">
                  <p className={`text-xs font-extrabold truncate ${isMissed ? "text-red-500 dark:text-red-400" : "text-gray-800 dark:text-gray-200"}`}>
                    {peer.name || peer.username}
                  </p>
                  
                  <div className="flex items-center gap-1 text-[9px] text-gray-400 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                    {isCaller ? (
                      <FiArrowUpRight size={10} className="text-emerald-500" />
                    ) : (
                      <FiArrowDownLeft size={10} className={isMissed ? "text-red-500" : "text-brand-teal"} />
                    )}

                    <span className="capitalize">
                      {isMissed ? "Missed" : isRejected ? "Rejected" : call.status}
                    </span>

                    <span>•</span>

                    <span>{getRelativeTime(call.createdAt)}</span>

                    {call.status === "completed" && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <FiClock size={8} />
                          {formatDuration(call.duration)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onInitiateCall(peer.uniqueId, "audio")}
                  className="p-2 rounded-xl bg-brand-teal/10 hover:bg-brand-teal/25 text-brand-teal transition cursor-pointer"
                  title="Voice call back"
                >
                  <FiPhone size={12} />
                </button>
                <button
                  onClick={() => onInitiateCall(peer.uniqueId, "video")}
                  className="p-2 rounded-xl bg-purple-600/10 hover:bg-purple-600/25 text-purple-600 dark:text-purple-400 transition cursor-pointer"
                  title="Video call back"
                >
                  <FiVideo size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
