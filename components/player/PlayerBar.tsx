"use client";
import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/lib/store";
import { getAvatarColor, getStationInitials } from "@/lib/utils";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import SleepTimer from "./SleepTimer";
import {
  Play, Pause, Volume2, VolumeX, Heart, Radio, Loader2, Share2,
} from "lucide-react";
import Image from "next/image";

export default function PlayerBar() {
  const {
    currentStation, status, volume, isMuted,
    pause, resume, setVolume, toggleMute, setStatus, toggleFavorite, isFavorite,
  } = usePlayerStore();

  useKeyboardShortcuts();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!currentStation) return;

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;
    const url = currentStation.url_resolved || currentStation.url;
    audio.volume = isMuted ? 0 : volume / 100;

    audio.oncanplay = () => setStatus("playing");
    audio.onerror = () => {
      // Try url as fallback if url_resolved failed
      if (audio.src === (currentStation.url_resolved || currentStation.url) && currentStation.url && audio.src !== currentStation.url) {
        audio.src = currentStation.url;
        audio.play().catch(() => setStatus("error"));
      } else {
        setStatus("error");
      }
    };
    audio.onwaiting = () => setStatus("loading");
    audio.onplaying = () => {
      setStatus("playing");
      // Track play count
      fetch("/api/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stationId: currentStation.stationuuid,
          stationName: currentStation.name,
          countryCode: currentStation.countrycode,
        }),
      }).catch(() => {});
    };

    const isHLS = url.includes(".m3u8");

    if (isHLS) {
      import("hls.js").then(({ default: Hls }) => {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(url);
          hls.attachMedia(audio);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            audio.play().catch(() => setStatus("error"));
          });
          hls.on(Hls.Events.ERROR, () => setStatus("error"));
        } else if (audio.canPlayType("application/vnd.apple.mpegurl")) {
          // Safari native HLS
          audio.src = url;
          audio.play().catch(() => setStatus("error"));
        } else {
          setStatus("error");
        }
      });
    } else {
      audio.src = url;
      audio.play().catch(() => setStatus("error"));
    }

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [currentStation]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (status === "paused") audioRef.current.pause();
    if (status === "playing") audioRef.current.play().catch(() => {});
  }, [status]);

  if (!currentStation) return null;

  const isPlaying = status === "playing";
  const isLoading = status === "loading";
  const isError = status === "error";
  const favorited = isFavorite(currentStation.stationuuid);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-gray-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">

        {/* Station info */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl">
            {currentStation.favicon ? (
              <Image
                src={currentStation.favicon}
                alt={currentStation.name}
                fill
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : null}
            <div
              className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${getAvatarColor(currentStation.name)} text-sm font-bold text-white`}
            >
              {getStationInitials(currentStation.name)}
            </div>
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-white">{currentStation.name}</p>
            <div className="flex items-center gap-2">
              {isLoading ? (
                <span className="flex items-center gap-1 text-xs text-orange-400">
                  <Loader2 className="h-3 w-3 animate-spin" /> Connecting...
                </span>
              ) : isPlaying ? (
                <span className="flex items-center gap-1 text-xs text-green-400">
                  <Radio className="h-3 w-3 animate-pulse" /> Live
                </span>
              ) : isError ? (
                <span className="text-xs text-red-400">Stream unavailable — works after deployment</span>
              ) : (
                <span className="text-xs text-gray-400">Paused</span>
              )}
              {currentStation.language && (
                <span className="text-xs text-gray-500">· {currentStation.language}</span>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleFavorite(currentStation)}
            className="rounded-full p-2 text-gray-400 transition hover:text-red-400"
          >
            <Heart
              className={`h-5 w-5 ${favorited ? "fill-red-500 text-red-500" : ""}`}
            />
          </button>

          <button
            onClick={() => (isPlaying ? pause() : resume())}
            disabled={isLoading}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-400 disabled:opacity-60"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-5 w-5 fill-white" />
            ) : (
              <Play className="h-5 w-5 fill-white" />
            )}
          </button>
        </div>

        {/* Share */}
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.origin + "/stations/" + currentStation.stationuuid);
            alert("Link copied!");
          }}
          className="hidden rounded-full p-2 text-gray-400 transition hover:text-white sm:block"
          title="Share station"
        >
          <Share2 className="h-4 w-4" />
        </button>

        {/* Sleep timer */}
        <SleepTimer />

        {/* Volume */}
        <div className="hidden items-center gap-2 sm:flex">
          <button onClick={toggleMute} className="text-gray-400 transition hover:text-white">
            {isMuted || volume === 0 ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="h-1.5 w-24 cursor-pointer appearance-none rounded-full bg-gray-700 accent-orange-500"
          />
        </div>
      </div>
    </div>
  );
}
