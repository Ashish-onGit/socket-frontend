import { useEffect } from "react";

export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape shortcut
      if (e.key === "Escape" && shortcuts["Escape"]) {
        shortcuts["Escape"](e);
      }
      
      // Ctrl + F or Cmd + F
      if ((e.ctrlKey || e.metaKey) && e.key?.toLowerCase() === "f" && shortcuts["ctrl+f"]) {
        shortcuts["ctrl+f"](e);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}
