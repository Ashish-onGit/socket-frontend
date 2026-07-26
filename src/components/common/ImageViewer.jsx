import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiZoomIn,
  FiZoomOut,
  FiDownload,
  FiShare2,
  FiChevronLeft,
  FiChevronRight,
  FiRotateCw,
} from "react-icons/fi";

export default function ImageViewer({
  isOpen,
  images = [],
  initialIndex = 0,
  onClose,
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const imgRef = useRef(null);
  const touchStartRef = useRef({ distance: 0, time: 0 });

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      resetZoom();
    }
  }, [isOpen, initialIndex]);

  // Handle arrow keys and escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, images]);

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  const handlePrev = () => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    resetZoom();
  };

  const handleNext = () => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    resetZoom();
  };

  const handleZoomIn = () => {
    setScale((s) => Math.min(s + 0.5, 4));
  };

  const handleZoomOut = () => {
    setScale((s) => {
      const nextScale = Math.max(s - 0.5, 1);
      if (nextScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return nextScale;
    });
  };

  const handleRotate = () => {
    setRotation((r) => r + 90);
  };

  // Double tap / Double click to zoom
  const handleDoubleTap = (e) => {
    e.stopPropagation();
    const now = Date.now();
    const lastTap = touchStartRef.current.time;
    
    if (now - lastTap < 300) {
      // Double tap detected
      if (scale > 1) {
        resetZoom();
      } else {
        setScale(2.5);
      }
    }
    touchStartRef.current.time = now;
  };

  // Pinch Zoom (Mobile)
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const distance = getTouchDistance(e.touches[0], e.touches[1]);
      touchStartRef.current.distance = distance;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && touchStartRef.current.distance > 0) {
      e.preventDefault();
      const distance = getTouchDistance(e.touches[0], e.touches[1]);
      const factor = distance / touchStartRef.current.distance;
      setScale((s) => Math.max(1, Math.min(s * factor, 4)));
      touchStartRef.current.distance = distance;
    }
  };

  const getTouchDistance = (t1, t2) => {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Download image
  const handleDownload = async () => {
    const currentImg = images[currentIndex];
    if (!currentImg) return;
    try {
      const response = await fetch(currentImg.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = currentImg.name || "downloaded-image.jpg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // Fallback
      window.open(currentImg.url, "_blank");
    }
  };

  // Share image
  const handleShare = async () => {
    const currentImg = images[currentIndex];
    if (!currentImg) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentImg.name || "Shared Image",
          url: currentImg.url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: Copy URL to clipboard
      try {
        await navigator.clipboard.writeText(currentImg.url);
        alert("Image link copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    }
  };

  if (!isOpen || images.length === 0) return null;

  const currentImg = images[currentIndex];

  const viewerContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex flex-col justify-between bg-black/95 select-none font-sans overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent z-10 text-white">
          <div className="min-w-0 flex-1 pl-2">
            <p className="text-xs font-bold truncate max-w-xs sm:max-w-md">
              {currentImg.name || `Image ${currentIndex + 1} of ${images.length}`}
            </p>
            <p className="text-[9px] opacity-60 mt-0.5">
              {images.length > 1 && `${currentIndex + 1} / ${images.length}`}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-lg hover:bg-white/10 active:scale-95 transition cursor-pointer"
              title="Zoom In"
            >
              <FiZoomIn size={16} />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-lg hover:bg-white/10 active:scale-95 transition cursor-pointer"
              title="Zoom Out"
            >
              <FiZoomOut size={16} />
            </button>
            <button
              onClick={handleRotate}
              className="p-2 rounded-lg hover:bg-white/10 active:scale-95 transition cursor-pointer"
              title="Rotate"
            >
              <FiRotateCw size={15} />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 rounded-lg hover:bg-white/10 active:scale-95 transition cursor-pointer"
              title="Download"
            >
              <FiDownload size={15} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg hover:bg-white/10 active:scale-95 transition cursor-pointer"
              title="Share"
            >
              <FiShare2 size={15} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 active:scale-95 transition cursor-pointer text-red-400 hover:text-red-300"
              title="Close (Esc)"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* Middle Canvas: Interactive Image Block */}
        <div 
          className="flex-1 w-full h-full relative flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onClick={onClose}
        >
          {/* Navigation Chevrons */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-6 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/5 active:scale-90 transition z-25 flex items-center justify-center cursor-pointer"
              >
                <FiChevronLeft size={22} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-6 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/5 active:scale-90 transition z-25 flex items-center justify-center cursor-pointer"
              >
                <FiChevronRight size={22} />
              </button>
            </>
          )}

          {/* Interactive Image Container */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="max-w-[90%] max-h-[85%] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.img
              ref={imgRef}
              src={currentImg.url}
              alt={currentImg.name || "Fullscreen view"}
              draggable={false}
              onClick={handleDoubleTap}
              style={{
                scale,
                rotate: rotation,
                x: position.x,
                y: position.y,
              }}
              drag={scale > 1}
              dragConstraints={{ left: -250 * scale, right: 250 * scale, top: -250 * scale, bottom: 250 * scale }}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={(e, info) => {
                setIsDragging(false);
                setPosition({ x: info.offset.x + position.x, y: info.offset.y + position.y });
              }}
              className={`max-w-full max-h-full object-contain rounded-lg shadow-2xl select-none ${
                scale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
              }`}
            />
          </motion.div>
        </div>

        {/* Bottom Thumbnail Tracker */}
        {images.length > 1 && (
          <div className="p-4 bg-gradient-to-t from-black/60 to-transparent flex justify-center gap-1.5 overflow-x-auto z-10 no-scrollbar max-w-full">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                  resetZoom();
                }}
                className={`w-10 h-10 rounded border-2 overflow-hidden flex-shrink-0 transition-all cursor-pointer ${
                  idx === currentIndex ? "border-brand-teal scale-110" : "border-white/20 opacity-55 hover:opacity-85"
                }`}
              >
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </AnimatePresence>
  );

  return typeof document !== "undefined"
    ? createPortal(viewerContent, document.body)
    : null;
}
