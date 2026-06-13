"use client";
import { useEffect, useState } from "react";
import { getIndianStations, getUniqueLanguages } from "@/lib/api";
import { Station } from "@/lib/types";
import StationCard from "@/components/stations/StationCard";
import Link from "next/link";
import { Radio, TrendingUp, Globe, Loader2 } from "lucide-react";

export default function Home() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getIndianStations().then((data) => {
      setStations(data);
      setLoading(false);
    });
  }, []);

  const languages = getUniqueLanguages(stations);
  const featured = stations.slice(0, 8);
  const byLanguage = languages.slice(0, 6);

  if (loading) return (
    <div className="flex h-64 items-center justify-center gap-3 text-gray-400">
      <Loader2 className="h-6 w-6 animate-spin text-orange-400" />
      <span>Loading stations...</span>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-12">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 via-red-600 to-pink-700 p-8 md:p-12">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            {stations.length}+ stations live
          </div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">
            The World's Radio,<br />All in One Place
          </h1>
          <p className="mb-6 max-w-md text-lg text-white/80">
            Stream 30,000+ live radio stations from every country on Earth. Free, no signup, just play.
          </p>
          <Link
            href="/stations"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-orange-600 shadow-lg transition hover:bg-orange-50"
          >
            <Radio className="h-5 w-5" /> Browse All Stations
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-4">
        {[
          { icon: Radio, label: "Stations", value: stations.length + "+" },
          { icon: Globe, label: "Languages", value: languages.length + "+" },
          { icon: TrendingUp, label: "Live Now", value: "Free" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-2xl border border-white/5 bg-white/5 p-5 text-center">
            <Icon className="mx-auto mb-2 h-6 w-6 text-orange-400" />
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-sm text-gray-400">{label}</p>
          </div>
        ))}
      </section>

      {/* Trending */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-400" /> Trending Stations
          </h2>
          <Link href="/stations" className="text-sm text-orange-400 hover:text-orange-300">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
          {featured.map((station) => (
            <StationCard key={station.stationuuid} station={station} />
          ))}
        </div>
      </section>

      {/* Browse by language */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-white">Browse by Language</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {byLanguage.map((lang) => {
            const count = stations.filter((s) =>
              s.language.toLowerCase().includes(lang.toLowerCase())
            ).length;
            return (
              <Link
                key={lang}
                href={`/stations?language=${lang.toLowerCase()}`}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/5 bg-white/5 p-5 text-center transition hover:border-orange-500/30 hover:bg-orange-500/5"
              >
                <span className="text-2xl">
                  {lang === "Hindi" ? "🇮🇳" : lang === "Tamil" ? "🎵" : lang === "Telugu" ? "🎶" :
                   lang === "Bengali" ? "📻" : lang === "Marathi" ? "🎙️" : "📡"}
                </span>
                <p className="font-semibold text-white">{lang}</p>
                <p className="text-xs text-gray-500">{count} stations</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
