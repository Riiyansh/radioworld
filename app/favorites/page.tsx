"use client";
import { usePlayerStore } from "@/lib/store";
import StationCard from "@/components/stations/StationCard";
import Link from "next/link";
import { Heart, Radio } from "lucide-react";

export default function FavoritesPage() {
  const { favorites, recentlyPlayed } = usePlayerStore();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-10">
      {/* Favorites */}
      <section>
        <h1 className="mb-6 text-2xl font-bold text-white flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-400 fill-red-400" /> Your Favorites
        </h1>
        {favorites.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-white/5 bg-white/5 text-gray-400">
            <Heart className="h-10 w-10 opacity-30" />
            <p>No favorites yet — heart a station to save it here</p>
            <Link href="/stations" className="text-sm text-orange-400 hover:text-orange-300">
              Browse stations →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {favorites.map((station) => (
              <StationCard key={station.stationuuid} station={station} />
            ))}
          </div>
        )}
      </section>

      {/* Recently Played */}
      {recentlyPlayed.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold text-white flex items-center gap-2">
            <Radio className="h-5 w-5 text-orange-400" /> Recently Played
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {recentlyPlayed.map((station) => (
              <StationCard key={station.stationuuid} station={station} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
