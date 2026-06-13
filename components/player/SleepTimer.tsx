"use client";
import { useState, useEffect, useRef } from "react";
import { Moon, X } from "lucide-react";
import { usePlayerStore } from "@/lib/store";

const OPTIONS = [15, 30, 60, 90];

export default function SleepTimer() {
  const [open, setOpen] = useState(false);
  const [minutesLeft, setMinutesLeft] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { pause } = usePlayerStore();

  const start = (mins: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMinutesLeft(mins);
    setOpen(false);
    timerRef.current = setTimeout(() => {
      pause();
      setMinutesLeft(null);
    }, mins * 60 * 1000);
  };

  const cancel = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMinutesLeft(null);
  };

  useEffect(() => {
    if (minutesLeft === null) return;
    const interval = setInterval(() => {
      setMinutesLeft((prev) => {
        if (prev === null || prev <= 1) { clearInterval(interval); return null; }
        return prev - 1;
      });
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [minutesLeft !== null]);

  return (
    <div className="relative hidden sm:block">
      {minutesLeft !== null ? (
        <button
          onClick={cancel}
          className="flex items-center gap-1.5 rounded-lg border border-orange-500/30 bg-orange-500/10 px-2.5 py-1.5 text-xs text-orange-400 hover:bg-orange-500/20"
        >
          <Moon className="h-3.5 w-3.5" />
          {minutesLeft}m
          <X className="h-3 w-3" />
        </button>
      ) : (
        <button
          onClick={() => setOpen((o) => !o)}
          className="rounded-lg p-1.5 text-gray-400 transition hover:text-white"
          title="Sleep timer"
        >
          <Moon className="h-5 w-5" />
        </button>
      )}

      {open && (
        <div className="absolute bottom-10 right-0 w-40 rounded-xl border border-white/10 bg-gray-900 p-2 shadow-xl">
          <p className="mb-1.5 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sleep after</p>
          {OPTIONS.map((m) => (
            <button key={m} onClick={() => start(m)}
              className="w-full rounded-lg px-3 py-1.5 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white">
              {m} minutes
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
