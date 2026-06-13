"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { usePlayerStore } from "@/lib/store";
import { Station } from "@/lib/types";
import StationCard from "@/components/stations/StationCard";
import { getAvatarColor, getStationInitials } from "@/lib/utils";
import { Play, Pause, Heart, Share2, Radio, Wifi, Globe, Tag, Loader2 } from "lucide-react";
import Image from "next/image";

export default function StationDetailPage() {
  const { id } = useParams();
  const [station, setStation] = useState<Station | null>(null);
  const [similar, setSimilar] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentStation, status, play, pause, resume, toggleFavorite, isFavorite } = usePlayerStore();

  useEffect(() => {
    if (!id) return;
    fetch(`/api/stations?q=${encodeURIComponent(String(id))}`)
      .then((r) => r.json())
      .then((data: Station[]) => {
        const found = data.find((s) => s.stationuuid === id) || data[0];
        if (found) {
          setStation(found);
          // Load similar
          fetch(`/api/stations?country=${found.countrycode}`)
            .then((r) => r.json())
            .then((all: Station[]) => setSimilar(all.filter((s) => s.stationuuid !== found.stationuuid).slice(0, 6)));
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
    </div>
  );

  if (!station) return (
    <div className="flex h-64 items-center justify-center text-gray-400">Station not found</div>
  );

  const isActive = currentStation?.stationuuid === station.stationuuid;
  const isPlaying = isActive && status === "playing";
  const favorited = isFavorite(station.stationuuid);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      {/* Station hero */}
      <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 to-gray-950 p-8 sm:flex-row sm:items-center">
        <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl shadow-2xl">
          {station.favicon && (
            <Image src={station.favicon} alt={station.name} fill className="object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          )}
          <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${getAvatarColor(station.name)} text-3xl font-bold text-white`}>
            {getStationInitials(station.name)}
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <h1 className="text-2xl font-bold text-white">{station.name}</h1>
            <p className="text-gray-400">{station.country} {station.state && `· ${station.state}`}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {station.language && <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-300">{station.language}</span>}
            {station.bitrate > 0 && <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-300">{station.bitrate}kbps</span>}
            {station.codec && <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-300">{station.codec}</span>}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => isActive ? (isPlaying ? pause() : resume()) : play(station)}
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 font-semibold text-white shadow-lg hover:bg-orange-400"
            >
              {isPlaying ? <Pause className="h-5 w-5 fill-white" /> : <Play className="h-5 w-5 fill-white" />}
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button onClick={() => toggleFavorite(station)} className="rounded-xl border border-white/10 p-2.5 text-gray-400 hover:text-red-400">
              <Heart className={`h-5 w-5 ${favorited ? "fill-red-500 text-red-500" : ""}`} />
            </button>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link copied!"); }}
              className="rounded-xl border border-white/10 p-2.5 text-gray-400 hover:text-white">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { icon: Globe, label: "Country", value: station.country },
          { icon: Radio, label: "Language", value: station.language || "—" },
          { icon: Wifi, label: "Bitrate", value: station.bitrate ? `${station.bitrate} kbps` : "—" },
          { icon: Tag, label: "Genre", value: station.tags.split(",")[0] || "—" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-xl border border-white/5 bg-white/5 p-4">
            <Icon className="mb-2 h-4 w-4 text-orange-400" />
            <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
            <p className="mt-1 text-sm font-medium text-white capitalize truncate">{value}</p>
          </div>
        ))}
      </div>

      {/* Tags */}
      {station.tags && (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {station.tags.split(",").filter(Boolean).map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">{tag.trim()}</span>
            ))}
          </div>
        </div>
      )}

      {/* Similar */}
      {similar.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-bold text-white">More from {station.country}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {similar.map((s) => <StationCard key={s.stationuuid} station={s} />)}
          </div>
        </div>
      )}
    </div>
  );
}
