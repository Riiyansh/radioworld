"use client";
import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { getIndianStations } from "@/lib/api";
import { Station } from "@/lib/types";
import StationCard from "@/components/stations/StationCard";
import { Loader2, MapPin, Radio, X } from "lucide-react";

const WorldMap = dynamic(() => import("@/components/map/WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[480px] items-center justify-center rounded-2xl border border-white/10 bg-gray-900/50">
      <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
    </div>
  ),
});

const CONTINENTS: Record<string, string[]> = {
  "All": [],
  "Asia": ["IN","PK","BD","NP","BT","JP","CN","AE","SA","KR","ID","TH","VN","PH","IR","IQ","TR"],
  "Europe": ["GB","DE","FR","IT","ES","NL","SE","PL","RU","CH","AT","BE","NO","DK","FI","PT","RO","UA","CZ","HU"],
  "Americas": ["US","CA","BR","MX","AR","CO","CL","PE","VE","CU","DO","EC","BO","GT","HN","NI","PA"],
  "Africa": ["ZA","NG","KE","EG","MA","ET","GH","TN","SN","CM","AO","UG","MZ","ZM","ZW","CD"],
  "Oceania": ["AU","NZ","PG","FJ"],
};

export default function MapPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [activeContinent, setActiveContinent] = useState("All");

  useEffect(() => {
    getIndianStations().then((data) => {
      setStations(data);
      setLoading(false);
    });
  }, []);

  const stationCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    stations.forEach((s) => {
      counts[s.countrycode] = (counts[s.countrycode] || 0) + 1;
    });
    return counts;
  }, [stations]);

  const filteredStations = useMemo(() => {
    let result = stations;
    if (selectedCountry) return result.filter((s) => s.countrycode === selectedCountry);
    if (activeContinent !== "All") {
      const codes = CONTINENTS[activeContinent];
      return result.filter((s) => codes.includes(s.countrycode));
    }
    return result;
  }, [stations, selectedCountry, activeContinent]);

  const totalCountries = Object.keys(stationCounts).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-white">
            <MapPin className="h-6 w-6 text-orange-400" /> World Radio Map
          </h1>
          <p className="mt-1 text-gray-400">
            {loading ? "Loading..." : `${stations.length.toLocaleString()} stations across ${totalCountries} countries`}
          </p>
        </div>
        {selectedCountry && (
          <button onClick={() => setSelectedCountry("")} className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-400 hover:text-white">
            <X className="h-4 w-4" /> Clear
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {Object.keys(CONTINENTS).map((c) => (
          <button key={c} onClick={() => { setActiveContinent(c); setSelectedCountry(""); }}
            className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${activeContinent === c && !selectedCountry ? "bg-orange-500 text-white" : "border border-white/10 bg-white/5 text-gray-400 hover:text-white"}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <WorldMap selectedCountry={selectedCountry} stationCounts={stationCounts} onSelectCountry={setSelectedCountry} />

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Radio className="h-4 w-4 text-orange-400" />
              {selectedCountry ? `${selectedCountry} Stations` : activeContinent === "All" ? "Trending Worldwide" : `${activeContinent}`}
            </h2>
            <span className="text-sm text-gray-400">{filteredStations.length}</span>
          </div>
          {loading ? (
            <div className="flex h-48 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-orange-400" /></div>
          ) : filteredStations.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-2xl border border-white/5 bg-white/5 text-gray-400">
              <Radio className="h-10 w-10 opacity-30" /><p className="text-sm">No stations found</p>
            </div>
          ) : (
            <div className="grid max-h-[440px] grid-cols-2 gap-3 overflow-y-auto pr-1">
              {filteredStations.slice(0, 40).map((station) => (
                <StationCard key={station.stationuuid} station={station} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
