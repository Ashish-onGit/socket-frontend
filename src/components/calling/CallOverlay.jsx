import React, { useEffect, useRef, useState } from "react";
import { FiPhone, FiPhoneOff, FiVideo, FiVideoOff, FiMic, FiMicOff, FiMaximize2, FiMinimize2 } from "react-icons/fi";
import Avatar from "../common/Avatar";

export default function CallOverlay({
  callState,       // "dialing" | "ringing" | "connected" | "ended"
  callType,        // "audio" | "video"
  peerUser,        // { username, name, avatar }
  localStream,
  remoteStream,
  onAccept,
  onReject,
  onCancel,
  onHangUp,
  connectionState
}) {
  const primaryVideoRef = useRef(null);   // Large background view
  const secondaryVideoRef = useRef(null); // Small preview view
  
  const [micMuted, setMicMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSwapped, setIsSwapped] = useState(false); // Swapping local/remote views
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const dragStartRef = useRef(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  // Reset states on call termination
  useEffect(() => {
    if (callState === "idle" || !callState) {
      setIsFullscreen(false);
      setIsSwapped(false);
      setPosition({ x: 0, y: 0 });
      positionRef.current = { x: 0, y: 0 };
      isDraggingRef.current = false;
    }
  }, [callState]);

  // Handle preview window drag events
  const handleDragStart = (e) => {
    isDraggingRef.current = false;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    dragStartRef.current = {
      x: clientX,
      y: clientY,
      startX: positionRef.current.x,
      startY: positionRef.current.y
    };

    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("touchmove", handleDragMove, { passive: false });
    document.addEventListener("touchend", handleDragEnd);
  };

  const handleDragMove = (e) => {
    if (!dragStartRef.current) return;
    isDraggingRef.current = true; // Mark as drag to prevent click/swap
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    const deltaX = clientX - dragStartRef.current.x;
    const deltaY = clientY - dragStartRef.current.y;

    const newX = dragStartRef.current.startX + deltaX;
    const newY = dragStartRef.current.startY + deltaY;

    positionRef.current = { x: newX, y: newY };
    setPosition({ x: newX, y: newY });
  };

  const handleDragEnd = () => {
    dragStartRef.current = null;
    document.removeEventListener("mousemove", handleDragMove);
    document.removeEventListener("mouseup", handleDragEnd);
    document.removeEventListener("touchmove", handleDragMove);
    document.removeEventListener("touchend", handleDragEnd);
  };

  // Toggle swaps on tapping mini-preview if user wasn't dragging
  const handlePreviewClick = () => {
    if (isDraggingRef.current) return;
    setIsSwapped((prev) => !prev);
  };

  // Map active streams to primary and secondary video elements based on isSwapped state
  useEffect(() => {
    const primaryVid = primaryVideoRef.current;
    const secondaryVid = secondaryVideoRef.current;

    const primaryStream = isSwapped ? localStream : remoteStream;
    const secondaryStream = isSwapped ? remoteStream : localStream;

    if (primaryVid) {
      primaryVid.srcObject = primaryStream;
    }
    if (secondaryVid) {
      secondaryVid.srcObject = secondaryStream;
    }
  }, [localStream, remoteStream, isSwapped, callState]);

  useEffect(() => {
    let timer;
    if (callState === "connected") {
      setDuration(0);
      timer = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setDuration(0);
    }
    return () => clearInterval(timer);
  }, [callState]);

  // Auto-hide controls when call connects
  useEffect(() => {
    if (callState === "connected") {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowControls(true);
    }
  }, [callState]);

  const handleOverlayClick = (e) => {
    // If user clicked inside any button or control interactive elements, do not toggle
    if (e.target.closest("button") || e.target.closest("video")) return;
    setShowControls((prev) => !prev);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleToggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = micMuted;
      });
      setMicMuted(!micMuted);
    }
  };

  const handleToggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = videoOff;
      });
      setVideoOff(!videoOff);
    }
  };

  if (callState === "idle" || !callState) return null;

  const centerSectionClass = isFullscreen
    ? "fixed inset-0 z-0 bg-[#0F0F10] w-full h-full"
    : "flex-1 w-full max-w-md my-6 rounded-2xl overflow-hidden relative flex items-center justify-center bg-black/40 border border-white/5 z-10";

  const topSectionClass = isFullscreen
    ? "w-full absolute top-12 left-0 right-0 z-30 flex flex-col items-center space-y-3 text-center pointer-events-none"
    : "w-full flex flex-col items-center mt-12 space-y-3 text-center z-10";

  const bottomSectionClass = isFullscreen
    ? "w-full absolute bottom-10 left-0 right-0 z-30 flex items-center justify-around max-w-xs mx-auto"
    : "w-full max-w-xs mb-10 flex items-center justify-around z-10";

  const isIncoming = callState === "ringing";
  const isOutgoing = callState === "dialing";

  // Check if a feed has active tracks
  const hasRemoteFeed = remoteStream && remoteStream.getTracks().length > 0;
  const hasLocalFeed = localStream && !videoOff && localStream.getTracks().length > 0;

  // 1. Ringing & Dialing Screen UI
  if (callState === "ringing" || callState === "dialing") {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#0F0F10] text-white flex flex-col items-center justify-between p-8 font-sans overflow-hidden select-none">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-brand-teal/10 blur-3xl animate-pulse" />
          <div className="absolute -top-20 -left-20 w-[300px] h-[300px] rounded-full bg-brand-teal/5 blur-3xl" />
        </div>

        {/* Top Header */}
        <div className="w-full flex flex-col items-center mt-12 space-y-4 text-center z-10">
          <span className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-brand-teal bg-brand-teal/10 px-3.5 py-1.5 rounded-full border border-brand-teal/20 shadow-sm animate-pulse">
            {isIncoming 
              ? `Incoming ${callType === "video" ? "Video" : "Voice"} Call`
              : `Calling (${callType === "video" ? "Video" : "Voice"})`}
          </span>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {peerUser?.name || peerUser?.username}
          </h2>
          <p className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-widest">
            {isIncoming ? "Ringing..." : "Connecting..."}
          </p>
        </div>

        {/* Center: Ripple Pulsing Avatar */}
        <div className="flex-1 w-full flex items-center justify-center relative z-10 my-4">
          <div className="relative flex items-center justify-center">
            {/* Pulsing Ripple Rings */}
            <div className="absolute w-36 h-36 rounded-full border border-brand-teal/20 animate-ping opacity-60 pointer-events-none" style={{ animationDuration: "2.5s" }} />
            <div className="absolute w-52 h-52 rounded-full border border-brand-teal/10 animate-ping opacity-45 pointer-events-none" style={{ animationDuration: "3.5s" }} />
            <div className="absolute w-68 h-68 rounded-full border border-brand-teal/5 animate-ping opacity-25 pointer-events-none" style={{ animationDuration: "4.5s" }} />

            {/* Glowing Avatar Backing */}
            <div className="absolute inset-0 rounded-full bg-brand-teal/20 blur-md pointer-events-none" />

            <div className="relative p-1 rounded-full bg-gradient-to-tr from-brand-teal to-transparent shadow-2xl shadow-brand-teal/30">
              <Avatar name={peerUser?.username} size="xxl" showStatus={false} />
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="w-full max-w-xs mb-12 flex items-center justify-center gap-10 z-10">
          {isIncoming ? (
            <>
              {/* Reject */}
              <button
                onClick={onReject}
                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center cursor-pointer shadow-lg shadow-red-500/30 hover:shadow-red-500/50 active:scale-95 transition-all duration-300 hover:rotate-12"
                title="Decline Call"
              >
                <FiPhoneOff size={24} />
              </button>

              {/* Accept */}
              <button
                onClick={onAccept}
                className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center cursor-pointer shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 active:scale-95 transition-all duration-300 animate-pulse"
                title="Answer Call"
              >
                {callType === "video" ? <FiVideo size={24} /> : <FiPhone size={24} />}
              </button>
            </>
          ) : (
            /* Cancel Outgoing */
            <button
              onClick={onCancel}
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center cursor-pointer shadow-lg shadow-red-500/30 hover:shadow-red-500/50 active:scale-95 transition-all duration-300 hover:rotate-12"
              title="Cancel Call"
            >
              <FiPhoneOff size={24} />
            </button>
          )}
        </div>
      </div>
    );
  }

  // 2. Connected Video Call Screen UI
  if (callType === "video") {
    return (
      <div 
        onClick={handleOverlayClick}
        className="fixed inset-0 z-[9999] bg-[#0F0F10] text-white flex flex-col items-center justify-between p-6 font-sans overflow-hidden cursor-pointer select-none"
      >
        {/* Fullscreen Option for Video Call */}
        <button
          onClick={(e) => { e.stopPropagation(); setIsFullscreen((prev) => !prev); }}
          className={`absolute top-6 right-6 z-[100] p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white cursor-pointer transition-all duration-300 active:scale-95 shadow-lg backdrop-blur-md ${showControls ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
        >
          {isFullscreen ? <FiMinimize2 size={16} /> : <FiMaximize2 size={16} />}
        </button>

        {/* Floating Info Pill at top-left */}
        <div className={`absolute top-6 left-6 z-40 bg-black/60 border border-white/10 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-3 transition-all duration-300 ${showControls ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}>
          <Avatar name={peerUser?.username} size="sm" showStatus={false} />
          <div className="text-left font-sans">
            <p className="text-xs font-bold text-white leading-none">{peerUser?.name || peerUser?.username}</p>
            <span className="text-[9px] text-brand-teal font-extrabold flex items-center gap-1.5 mt-1 leading-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Center Section: Main Video View */}
        <div className={centerSectionClass}>
          <div className="absolute inset-0 w-full h-full">
            {/* Primary Large View */}
            {(isSwapped ? hasLocalFeed : hasRemoteFeed) ? (
              <video
                ref={primaryVideoRef}
                autoPlay
                playsInline
                className={`w-full h-full ${isFullscreen ? "object-contain bg-black" : "object-cover"} ${isSwapped ? "transform -scale-x-100" : ""}`}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 text-xs bg-[#121214] space-y-4">
                <div className="p-1.5 rounded-full bg-white/5 border border-white/10 animate-pulse">
                  <Avatar name={peerUser?.username} size="xl" showStatus={false} />
                </div>
                <p className="font-bold tracking-wide uppercase text-[10px] text-zinc-550">Waiting for camera feed...</p>
              </div>
            )}

            {/* Draggable Secondary Mini View */}
            {(isSwapped ? hasRemoteFeed : hasLocalFeed) && (
              <div
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
                onClick={(e) => { e.stopPropagation(); handlePreviewClick(); }}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px)`,
                }}
                className="absolute bottom-6 right-6 w-28 h-36 rounded-2xl overflow-hidden border border-white/15 shadow-2xl z-30 bg-[#121214] cursor-grab active:cursor-grabbing select-none touch-none hover:border-white/30 transition-colors"
                title="Tap to swap screens"
              >
                <video
                  ref={secondaryVideoRef}
                  autoPlay
                  playsInline
                  muted={!isSwapped} // Only mute local preview
                  className={`w-full h-full object-cover pointer-events-none ${!isSwapped ? "transform -scale-x-100" : ""}`}
                />
              </div>
            )}
          </div>
        </div>

        {/* Floating Bottom Control Bar */}
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-40 bg-black/60 border border-white/10 backdrop-blur-md px-6 py-4 rounded-3xl flex items-center gap-6 shadow-2xl transition-all duration-300 ${showControls ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95 pointer-events-none"}`}>
          <button
            onClick={(e) => { e.stopPropagation(); handleToggleMic(); }}
            className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-95 border ${
              micMuted
                ? "bg-red-500/20 border-red-500 text-red-500"
                : "bg-white/10 border-white/10 text-white hover:bg-white/20"
            }`}
            title={micMuted ? "Unmute Mic" : "Mute Mic"}
          >
            {micMuted ? <FiMicOff size={20} /> : <FiMic size={20} />}
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); handleToggleCamera(); }}
            className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-95 border ${
              videoOff
                ? "bg-red-500/20 border-red-500 text-red-500"
                : "bg-white/10 border-white/10 text-white hover:bg-white/20"
            }`}
            title={videoOff ? "Turn Camera On" : "Turn Camera Off"}
          >
            {videoOff ? <FiVideoOff size={20} /> : <FiVideo size={20} />}
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onHangUp(); }}
            className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center cursor-pointer shadow-lg shadow-red-500/30 active:scale-95 transition-all duration-300 hover:rotate-12"
            title="Hang Up"
          >
            <FiPhoneOff size={20} />
          </button>
        </div>
      </div>
    );
  }

  // 3. Connected Audio Call Screen UI
  return (
    <div 
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[9999] bg-[#0F0F10] text-white flex flex-col items-center justify-between p-8 font-sans overflow-hidden select-none cursor-pointer"
    >
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-brand-teal/10 blur-3xl animate-pulse" />
      </div>

      {/* Top Section */}
      <div className={`w-full flex flex-col items-center mt-12 space-y-3 text-center z-10 transition-all duration-300 ${showControls ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}>
        <span className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-brand-teal bg-brand-teal/10 px-3.5 py-1.5 rounded-full border border-brand-teal/20 shadow-sm">
          Active Voice Call
        </span>
        <h2 className="text-2xl font-extrabold text-white tracking-tight mt-2">
          {peerUser?.name || peerUser?.username}
        </h2>
        <span className="text-xs text-brand-teal font-extrabold flex items-center gap-1.5 justify-center mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {formatTime(duration)}
        </span>
        {connectionState && (
          <p className="text-[9px] text-zinc-550 font-bold uppercase tracking-widest mt-0.5">
            Signal: {connectionState}
          </p>
        )}
      </div>

      {/* Center Section: Mic breathing halo */}
      <div className="flex-1 w-full flex items-center justify-center relative z-10 my-4">
        <div className="relative flex items-center justify-center">
          {/* Breathing Rings */}
          <div className="absolute w-40 h-40 rounded-full bg-brand-teal/5 border border-brand-teal/10 animate-ping opacity-60 pointer-events-none" style={{ animationDuration: "3s" }} />
          <div className="absolute w-56 h-56 rounded-full border border-brand-teal/5 animate-pulse opacity-40 pointer-events-none" />

          <div className="relative p-1.5 rounded-full bg-gradient-to-tr from-brand-teal to-transparent shadow-2xl shadow-brand-teal/20">
            <div className="relative">
              <Avatar name={peerUser?.username} size="xxl" showStatus={false} />
              {micMuted && (
                <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-red-500 border-2 border-[#0F0F10] flex items-center justify-center text-white shadow-lg shadow-red-500/30">
                  <FiMicOff size={14} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section Controls */}
      <div className={`w-full max-w-xs mb-12 flex items-center justify-center gap-8 z-10 transition-all duration-300 ${showControls ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95 pointer-events-none"}`}>
        <button
          onClick={(e) => { e.stopPropagation(); handleToggleMic(); }}
          className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-95 border ${
            micMuted
              ? "bg-red-500/20 border-red-500 text-red-500"
              : "bg-white/10 border-white/10 text-white hover:bg-white/20"
          }`}
          title={micMuted ? "Unmute Mic" : "Mute Mic"}
        >
          {micMuted ? <FiMicOff size={22} /> : <FiMic size={22} />}
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onHangUp(); }}
          className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center cursor-pointer shadow-lg shadow-red-500/30 active:scale-95 transition-all duration-300 hover:rotate-12"
          title="Hang Up"
        >
          <FiPhoneOff size={22} />
        </button>
      </div>
    </div>
  );
}
