import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertTriangle, FiLock, FiWifiOff, FiShield, FiRefreshCw, FiHome } from "react-icons/fi";

// ==========================================
// 1. 404 NOT FOUND PAGE
// ==========================================
export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-bg-light dark:bg-brand-bg-dark flex flex-col items-center justify-center p-6 text-center font-sans text-gray-800 dark:text-gray-200">
      <div className="max-w-md w-full bg-white dark:bg-brand-card-dark rounded-3xl border border-brand-border-light dark:border-white/5 p-8 shadow-2xl flex flex-col items-center relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-rose-500/5 blur-2xl pointer-events-none" />
        
        <div className="w-20 h-20 rounded-2xl bg-rose-555/10 text-rose-500 flex items-center justify-center mb-6 animate-bounce">
          <span className="text-3xl font-black">404</span>
        </div>

        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
          Page Not Found
        </h2>
        <p className="text-xs text-gray-450 dark:text-zinc-500 mb-6 leading-relaxed">
          The link you followed may be broken, or the page may have been removed or moved to a different address.
        </p>

        <button
          onClick={() => navigate("/chat")}
          className="flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold text-white bg-brand-teal hover:bg-brand-teal/90 rounded-xl transition shadow-md shadow-brand-teal/20 cursor-pointer w-full"
        >
          <FiHome size={14} /> Back to Chats
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 2. 500 SERVER ERROR PAGE
// ==========================================
export function ServerErrorPage({ onRetry }) {
  return (
    <div className="min-h-screen bg-brand-bg-light dark:bg-brand-bg-dark flex flex-col items-center justify-center p-6 text-center font-sans text-gray-800 dark:text-gray-200">
      <div className="max-w-md w-full bg-white dark:bg-brand-card-dark rounded-3xl border border-brand-border-light dark:border-white/5 p-8 shadow-2xl flex flex-col items-center relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-red-500/5 blur-2xl pointer-events-none" />
        
        <div className="w-20 h-20 rounded-2xl bg-red-500/10 text-red-550 flex items-center justify-center mb-6">
          <FiAlertTriangle size={36} />
        </div>

        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
          Server Connection Error
        </h2>
        <p className="text-xs text-gray-450 dark:text-zinc-500 mb-6 leading-relaxed">
          Our servers are currently experiencing difficulties or responding slowly. Please check your internet connectivity or try again in a few moments.
        </p>

        <button
          onClick={onRetry || (() => window.location.reload())}
          className="flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold text-white bg-red-650 hover:bg-red-700 dark:bg-red-600/25 dark:hover:bg-red-600/40 border border-transparent dark:border-red-500/20 rounded-xl transition cursor-pointer w-full"
        >
          <FiRefreshCw size={14} className="animate-spin-slow" /> Retry Connection
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 3. 401 UNAUTHORIZED PAGE
// ==========================================
export function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-bg-light dark:bg-brand-bg-dark flex flex-col items-center justify-center p-6 text-center font-sans text-gray-800 dark:text-gray-200">
      <div className="max-w-md w-full bg-white dark:bg-brand-card-dark rounded-3xl border border-brand-border-light dark:border-white/5 p-8 shadow-2xl flex flex-col items-center relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none" />
        
        <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-6">
          <FiLock size={34} />
        </div>

        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
          Session Expired
        </h2>
        <p className="text-xs text-gray-450 dark:text-zinc-500 mb-6 leading-relaxed">
          Your credentials could not be validated or your security session has expired. Please re-authenticate at the sign-in portal.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition shadow-md shadow-indigo-600/20 cursor-pointer w-full"
        >
          Sign In Again
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 4. 403 FORBIDDEN PAGE
// ==========================================
export function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-bg-light dark:bg-brand-bg-dark flex flex-col items-center justify-center p-6 text-center font-sans text-gray-800 dark:text-gray-200">
      <div className="max-w-md w-full bg-white dark:bg-brand-card-dark rounded-3xl border border-brand-border-light dark:border-white/5 p-8 shadow-2xl flex flex-col items-center relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-amber-500/5 blur-2xl pointer-events-none" />
        
        <div className="w-20 h-20 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-500 flex items-center justify-center mb-6">
          <FiShield size={34} />
        </div>

        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
          Access Restricted
        </h2>
        <p className="text-xs text-gray-450 dark:text-zinc-500 mb-6 leading-relaxed">
          You do not have administrative clearance or permission tags to view this client workspace section.
        </p>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold text-gray-700 dark:text-gray-250 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl border border-gray-200 dark:border-white/5 transition cursor-pointer w-full"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 5. OFFLINE OVERLAY SCREEN
// ==========================================
export function OfflineScreen() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[9999] flex items-center justify-center p-4 bg-red-500/90 dark:bg-red-900/90 backdrop-blur-md text-white select-none shadow-lg py-3 animate-fade-in font-sans text-xs">
      <div className="flex items-center gap-2.5 max-w-lg w-full justify-center">
        <FiWifiOff size={16} className="animate-pulse" />
        <span className="font-extrabold uppercase tracking-wide">Connection Interrupted:</span>
        <span className="text-[11px] opacity-90 font-medium">
          You are currently offline. Check your router, network adapter or gateway settings. Reconnecting automatically...
        </span>
      </div>
    </div>
  );
}

// ==========================================
// 6. LOADING LAYOUT STATE
// ==========================================
export function LoadingState() {
  return (
    <div className="flex-1 w-full h-full flex flex-col items-center justify-center bg-brand-bg-light dark:bg-brand-bg-dark font-sans p-6 text-center select-none">
      <div className="flex flex-col items-center max-w-xs">
        {/* Pulsing loading circle with ambient glow */}
        <div className="relative mb-5 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-brand-teal/20 border-t-brand-teal animate-spin" />
          <div className="absolute w-12 h-12 rounded-full bg-brand-teal/5 animate-ping opacity-75" />
        </div>
        <h4 className="text-[10px] font-extrabold tracking-widest text-brand-teal uppercase">
          Workspace Initializing
        </h4>
        <p className="text-[9.5px] text-gray-400 dark:text-zinc-500 mt-1.5 font-medium leading-relaxed">
          Sustaining live web socket sessions and synchronizing local datasets safely. Please stand by...
        </p>
      </div>
    </div>
  );
}
