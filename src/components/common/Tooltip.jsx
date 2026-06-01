import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Tooltip({ text, position = "top", children }) {
  const [show, setShow] = useState(false);

  const posClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2"
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-40 px-2.5 py-1 text-[10px] font-semibold text-white bg-gray-900/90 dark:bg-gray-950/95 backdrop-blur-sm rounded-md shadow-md whitespace-nowrap pointer-events-none ${posClasses[position]}`}
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
