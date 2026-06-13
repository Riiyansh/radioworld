"use client";
import { Station } from "@/lib/types";
import { usePlayerStore } from "@/lib/store";
import { getAvatarColor, getStationInitials } from "@/lib/utils";
import { Play, Pause, Heart, Wifi, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function StationCard({ station }: { station: Station }) {
  const { currentStation, status, play, pause, resume, toggleFavorite, isFavorite } =
    usePlayerStore();

  const isActive = currentStation?.stationuuid === station.stationuuid;
  const isPlaying = isActive && status === "playing";
  const favorited = isFavorite(station.stationuuid);

  const handlePlay = () => {
    if (isActive) {
      isPlaying ? pause() : resume();
    } else {
      play(station);
    }
  };

  return (
    <div
      className={`group relative flex cursor-pointer flex-col gap-3 rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
        isActive
          ? "border-orange-500/50 bg-orange-500/10 shadow-lg shadow-orange-500/10"
          : "border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/8"
      }`}
    >
      {/* Favicon / Avatar */}
      <div className="relative mx-auto h-16 w-16 overflow-hidden rounded-2xl shadow-lg">
        {station.favicon ? (
          <Image
            src={station.favicon}
            alt={station.name}
            fill
            className="object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : null}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${getAvatarColor(station.name)} text-lg font-bold text-white`}
        >
          {getStationInitials(station.name)}
        </div>

        {/* Play overlay */}
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
        >
          {isPlaying ? (
            <Pause className="h-7 w-7 fill-white text-white" />
          ) : (
            <Play className="h-7 w-7 fill-white text-white" />
          )}
        </button>
      </div>

      {/* Info */}
      <div className="min-w-0 text-center">
        <p className="truncate text-sm font-semibold text-white">{station.name}</p>
        {station.state && (
          <p className="truncate text-xs text-gray-400">{station.state}</p>
        )}
        {station.language && (
          <p className="truncate text-xs text-gray-500">{station.language}</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {station.bitrate > 0 && (
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Wifi className="h-3 w-3" />
            {station.bitrate}kbps
          </span>
        )}
        <div className="ml-auto flex items-center gap-1">
          <Link href={`/stations/${station.stationuuid}`}
            onClick={(e) => e.stopPropagation()}
            className="rounded-full p-1 text-gray-600 transition hover:text-gray-300">
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(station); }}
            className="rounded-full p-1 text-gray-500 transition hover:text-red-400"
          >
            <Heart className={`h-4 w-4 ${favorited ? "fill-red-500 text-red-500" : ""}`} />
          </button>
        </div>
      </div>

      {/* Live indicator */}
      {isPlaying && (
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
          Live
        </div>
      )}
    </div>
  );
}
