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

  // Check if a feed has active tracks
  const hasRemoteFeed = remoteStream && remoteStream.getTracks().length > 0;
  const hasLocalFeed = localStream && !videoOff && localStream.getTracks().length > 0;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0F0F10] text-white flex flex-col items-center justify-between p-6 font-sans">
      
      {/* Fullscreen Option for Video Call */}
      {callState === "connected" && callType === "video" && (
        <button
          onClick={() => setIsFullscreen((prev) => !prev)}
          className="absolute top-6 right-6 z-[100] p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white cursor-pointer transition-all active:scale-95 shadow-lg"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
        >
          {isFullscreen ? <FiMinimize2 size={16} /> : <FiMaximize2 size={16} />}
        </button>
      )}

      {/* Top Section: Peer Info / Connection State */}
      <div className={topSectionClass}>
        {callState !== "connected" && (
          <div className="relative group">
            {callState === "ringing" && (
              <div className="absolute inset-0 rounded-full bg-brand-teal/20 scale-125 blur-sm animate-pulse pointer-events-none" />
            )}
            <Avatar name={peerUser?.username} size="xxl" showStatus={false} />
          </div>
        )}

        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            {peerUser?.name || peerUser?.username}
          </h2>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
            {callState === "dialing" && "Calling..."}
            {callState === "ringing" && `Incoming ${callType} Call...`}
            {callState === "connected" && (
              <span className="text-brand-teal font-bold flex items-center gap-1.5 justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active ({formatTime(duration)})
              </span>
            )}
          </p>
          {connectionState && callState === "connected" && (
            <p className="text-[9px] text-zinc-550 font-bold uppercase tracking-widest mt-0.5">
              Signal: {connectionState}
            </p>
          )}
        </div>
      </div>

      {/* Center Section: Stream Windows / Audio Dashboard */}
      <div className={centerSectionClass}>
        
        {/* Connected Video UI */}
        {callState === "connected" && callType === "video" && (
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
              <div className="w-full h-full flex flex-col items-center justify-center text-zinc-550 text-xs bg-black/80">
                <Avatar name={peerUser?.username} size="xl" showStatus={false} />
                <p className="mt-3">Waiting for partner camera feed...</p>
              </div>
            )}

            {/* Draggable Secondary Mini View */}
            {(isSwapped ? hasRemoteFeed : hasLocalFeed) && (
              <div
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
                onClick={handlePreviewClick}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px)`,
                }}
                className="absolute bottom-4 right-4 w-28 h-36 rounded-xl overflow-hidden border border-white/10 shadow-2xl z-30 bg-[#171717] cursor-grab active:cursor-grabbing select-none touch-none hover:shadow-brand-teal/10 transition-shadow"
                title="Tap to swap video screens"
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
        )}

        {/* Connected Audio UI / Ringing Screen */}
        {(callType === "audio" || callState !== "connected") && (
          <div className="flex flex-col items-center justify-center space-y-4">
            {callState === "connected" && (
              <>
                <div className="w-24 h-24 rounded-full bg-brand-teal/10 border border-brand-teal/30 flex items-center justify-center animate-pulse">
                  <FiMic size={36} className="text-brand-teal" />
                </div>
                <p className="text-xs text-zinc-400">Audio link established</p>
              </>
            )}
            {callState === "dialing" && (
              <p className="text-xs text-zinc-550 italic animate-pulse">Waiting for response...</p>
            )}
          </div>
        )}
      </div>

      {/* Bottom Section: Call Controllers */}
      <div className={bottomSectionClass}>
        
        {/* Ringing (Incoming) Mode controls */}
        {callState === "ringing" && (
          <>
            <button
              onClick={onReject}
              className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center cursor-pointer shadow-lg shadow-red-500/25 active:scale-95 transition-transform"
            >
              <FiPhoneOff size={22} />
            </button>
            <button
              onClick={onAccept}
              className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center cursor-pointer shadow-lg shadow-emerald-500/25 active:scale-95 transition-transform"
            >
              <FiPhone size={22} />
            </button>
          </>
        )}

        {/* Dialing (Outgoing) Mode controls */}
        {callState === "dialing" && (
          <button
            onClick={onCancel}
            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center cursor-pointer shadow-lg shadow-red-500/25 active:scale-95 transition-transform"
          >
            <FiPhoneOff size={22} />
          </button>
        )}

        {/* Connected Mode controls */}
        {callState === "connected" && (
          <>
            <button
              onClick={handleToggleMic}
              className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition border ${
                micMuted
                  ? "bg-red-500/20 border-red-500 text-red-500"
                  : "bg-white/5 border-white/10 text-white hover:bg-white/10"
              }`}
            >
              {micMuted ? <FiMicOff size={22} /> : <FiMic size={22} />}
            </button>

            {callType === "video" && (
              <button
                onClick={handleToggleCamera}
                className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition border ${
                  videoOff
                    ? "bg-red-500/20 border-red-500 text-red-500"
                    : "bg-white/5 border-white/10 text-white hover:bg-white/10"
              }`}
              >
                {videoOff ? <FiVideoOff size={22} /> : <FiVideo size={22} />}
              </button>
            )}

            <button
              onClick={onHangUp}
              className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center cursor-pointer shadow-lg shadow-red-500/25 active:scale-95 transition-transform"
            >
              <FiPhoneOff size={22} />
            </button>
          </>
        )}

      </div>
    </div>
  );
}
