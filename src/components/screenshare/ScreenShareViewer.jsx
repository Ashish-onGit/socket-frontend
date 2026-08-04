import React, { useRef, useEffect, useState } from "react";
import { FiMonitor, FiX, FiMaximize, FiMinimize, FiVideoOff, FiMessageSquare, FiSend } from "react-icons/fi";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useScreenShareContext } from "../../context/ScreenShareContext";
import { addMessage } from "../../features/chat/chatSlice";

export default function ScreenShareViewer() {
  const { isSharing, isViewing, remoteStream, localStream, stopShare, connectionState, socket } = useScreenShareContext();
  const videoRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatSize, setChatSize] = useState({ width: 300, height: 360 });
  const chatScrollRef = useRef(null);
  const dispatch = useDispatch();
  const dragControls = useDragControls();

  const currentUser = useSelector((state) => state.auth.user);
  const activeConversation = useSelector((state) => state.chat.activeConversation);
  const conversations = useSelector((state) => state.chat.conversations);
  const messages = conversations[activeConversation]?.messages || [];

  const isActive = isSharing || isViewing;
  const stream = isSharing ? localStream : remoteStream;

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.parentElement?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (isChatOpen && chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isChatOpen]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !socket || !activeConversation) return;

    const msgObj = {
      id: Date.now().toString(),
      sender: currentUser.username,
      receiver: activeConversation,
      message: chatInput.trim(),
      timestamp: new Date().toISOString(),
      replyTo: null,
      reactions: {},
      read: false,
      edited: false,
      deleted: false,
      type: "text",
    };

    dispatch(addMessage({ message: msgObj, currentUser: currentUser.username }));
    socket.emit("send_message", msgObj);
    setChatInput("");
  };

  const startDrag = (event) => {
    dragControls.start(event);
  };

  const handleResizeStart = (corner, e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = chatSize.width;
    const startHeight = chatSize.height;

    const onMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      if (corner.includes("right")) {
        newWidth = startWidth + deltaX;
      } else if (corner.includes("left")) {
        newWidth = startWidth - deltaX;
      }

      if (corner.includes("bottom")) {
        newHeight = startHeight + deltaY;
      } else if (corner.includes("top")) {
        newHeight = startHeight - deltaY;
      }

      // Constrain size between 240px and 600px
      newWidth = Math.max(240, Math.min(600, newWidth));
      newHeight = Math.max(240, Math.min(650, newHeight));

      setChatSize({ width: newWidth, height: newHeight });
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0, y: -20 }}
        animate={{ opacity: 1, height: "auto", y: 0 }}
        exit={{ opacity: 0, height: 0, y: -20 }}
        className="w-full bg-zinc-950 border-b border-white/10 relative shadow-xl overflow-hidden group"
        style={{ minHeight: "240px", maxHeight: "60vh" }}
      >
        {/* Header Overlay */}
        <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 to-transparent z-10 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center space-x-2 text-white">
            <FiMonitor size={18} className="text-brand-teal" />
            <span className="font-medium text-sm">
              {isSharing ? "You are sharing your screen" : "Viewing screen"}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              connectionState === "connected" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
            }`}>
              {connectionState === "connected" ? "Live" : "Connecting..."}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              {isFullscreen ? <FiMinimize size={16} /> : <FiMaximize size={16} />}
            </button>
            {isSharing && (
              <button
                onClick={stopShare}
                className="px-3 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors flex items-center space-x-1 shadow-lg shadow-red-500/20"
              >
                <FiX size={16} />
                <span>Stop</span>
              </button>
            )}
          </div>
        </div>

        {/* Video Player */}
        {stream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isSharing} // Mute local stream to prevent echo
            className="w-full h-full object-contain bg-zinc-950"
            style={{ maxHeight: "60vh" }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 min-h-[240px]">
            <FiVideoOff size={48} className="mb-4 opacity-50" />
            <p>Waiting for video stream...</p>
          </div>
        )}

        {/* Floating Chat Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="absolute bottom-4 right-4 p-3 rounded-full bg-brand-teal text-white shadow-lg shadow-brand-teal/30 hover:bg-teal-500 transition-colors z-20"
        >
          {isChatOpen ? <FiX size={20} /> : <FiMessageSquare size={20} />}
        </button>

        {/* Floating Chat Panel */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              drag
              dragControls={dragControls}
              dragListener={false}
              dragMomentum={false}
              dragConstraints={videoRef.current?.parentElement || false}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              style={{ width: `${chatSize.width}px`, height: `${chatSize.height}px` }}
              className="absolute bottom-16 right-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 flex flex-col z-20 overflow-hidden relative select-none"
            >
              {/* Corner Resize Handles */}
              <div
                onMouseDown={(e) => handleResizeStart("top-left", e)}
                className="absolute top-0 left-0 w-3.5 h-3.5 cursor-nwse-resize z-30 hover:bg-brand-teal/40 transition-colors rounded-tl-2xl"
                title="Resize Top-Left"
              />
              <div
                onMouseDown={(e) => handleResizeStart("top-right", e)}
                className="absolute top-0 right-0 w-3.5 h-3.5 cursor-nesw-resize z-30 hover:bg-brand-teal/40 transition-colors rounded-tr-2xl"
                title="Resize Top-Right"
              />
              <div
                onMouseDown={(e) => handleResizeStart("bottom-left", e)}
                className="absolute bottom-0 left-0 w-3.5 h-3.5 cursor-nesw-resize z-30 hover:bg-brand-teal/40 transition-colors rounded-bl-2xl"
                title="Resize Bottom-Left"
              />
              <div
                onMouseDown={(e) => handleResizeStart("bottom-right", e)}
                className="absolute bottom-0 right-0 w-3.5 h-3.5 cursor-nwse-resize z-30 hover:bg-brand-teal/40 transition-colors rounded-br-2xl"
                title="Resize Bottom-Right"
              />

              <div
                onPointerDown={startDrag}
                className="p-3 bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-100 dark:border-white/5 font-semibold text-sm text-gray-800 dark:text-gray-200 flex-shrink-0 cursor-grab active:cursor-grabbing flex items-center justify-between"
              >
                <span>Live Chat</span>
                <span className="text-[10px] text-gray-400 font-normal">Drag header to move</span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3 space-y-3" ref={chatScrollRef}>
                {messages.length === 0 ? (
                  <div className="text-center text-xs text-gray-400 mt-10">No messages yet.</div>
                ) : (
                  messages.slice(-20).map((msg) => {
                    const isSelf = msg.sender === currentUser.username;
                    return (
                      <div key={msg.id} className={`flex ${isSelf ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] rounded-xl px-3 py-2 text-[11px] ${
                          isSelf 
                            ? "bg-brand-teal text-white rounded-br-none" 
                            : "bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 rounded-bl-none"
                        }`}>
                          {msg.message}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form onSubmit={handleSendMessage} className="p-2 bg-gray-50 dark:bg-zinc-800/50 border-t border-gray-100 dark:border-white/5 flex items-center gap-2 flex-shrink-0">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-full px-3 py-1.5 text-[11px] focus:outline-none focus:border-brand-teal text-gray-900 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="p-1.5 rounded-full bg-brand-teal text-white disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <FiSend size={12} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
