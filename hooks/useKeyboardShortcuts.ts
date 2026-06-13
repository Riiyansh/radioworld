"use client";
import { useEffect } from "react";
import { usePlayerStore } from "@/lib/store";

export function useKeyboardShortcuts() {
  const { status, pause, resume, toggleMute, volume, setVolume } = usePlayerStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          status === "playing" ? pause() : resume();
          break;
        case "KeyM":
          toggleMute();
          break;
        case "ArrowUp":
          e.preventDefault();
          setVolume(Math.min(100, volume + 5));
          break;
        case "ArrowDown":
          e.preventDefault();
          setVolume(Math.max(0, volume - 5));
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [status, volume, pause, resume, toggleMute, setVolume]);
}
