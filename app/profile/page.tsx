"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { usePlayerStore } from "@/lib/store";
import StationCard from "@/components/stations/StationCard";
import Link from "next/link";
import { User, Heart, Clock, LogOut, Radio, BarChart2 } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { favorites, recentlyPlayed } = usePlayerStore();
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/stats").then((r) => r.json()).then(setStats).catch(() => {});
  }, []);

  if (status === "loading") return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
    </div>
  );

  if (!session) return (
    <div className="flex h-64 flex-col items-center justify-center gap-4">
      <User className="h-12 w-12 text-gray-600" />
      <p className="text-gray-400">Sign in to see your profile</p>
      <Link href="/auth/signin" className="rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-400">
        Sign In
      </Link>
    </div>
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* Profile card */}
      <div className="flex items-center gap-5 rounded-2xl border border-white/10 bg-gradient-to-r from-orange-500/10 to-transparent p-6">
        {session.user?.image ? (
          <Image src={session.user.image} alt="avatar" width={72} height={72} className="rounded-full ring-2 ring-orange-500/50" />
        ) : (
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-orange-500 text-2xl font-bold text-white">
            {session.user?.name?.[0] || "R"}
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">{session.user?.name}</h1>
          <p className="text-sm text-gray-400">{session.user?.email}</p>
          <div className="mt-2 flex gap-4 text-sm text-gray-400">
            <span><span className="font-semibold text-white">{favorites.length}</span> favorites</span>
            <span><span className="font-semibold text-white">{recentlyPlayed.length}</span> recently played</span>
          </div>
        </div>
        <button onClick={() => signOut()} className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-400 hover:text-white">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      {/* Stats */}
      {stats.length > 0 && (
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
            <BarChart2 className="h-5 w-5 text-orange-400" /> Most Played on RadioWorld
          </h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {stats.slice(0, 6).map((s, i) => (
              <div key={s.stationId} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-4 py-3">
                <span className="text-lg font-bold text-gray-600">#{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{s.stationName}</p>
                  <p className="text-xs text-gray-500">{s.countryCode} · {s.playCount.toLocaleString()} plays</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Favorites */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
          <Heart className="h-5 w-5 text-red-400 fill-red-400" /> Your Favorites
        </h2>
        {favorites.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-2xl border border-white/5 bg-white/5 text-gray-400">
            <p className="text-sm">No favorites yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {favorites.map((s) => <StationCard key={s.stationuuid} station={s} />)}
          </div>
        )}
      </section>

      {/* Recently played */}
      {recentlyPlayed.length > 0 && (
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
            <Clock className="h-5 w-5 text-orange-400" /> Recently Played
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {recentlyPlayed.map((s) => <StationCard key={s.stationuuid} station={s} />)}
          </div>
        </section>
      )}
    </div>
  );
}
