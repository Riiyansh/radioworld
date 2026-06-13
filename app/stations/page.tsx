"use client";
import { useEffect, useState, useMemo } from "react";
import { getIndianStations, getUniqueLanguages, getUniqueStates, getUniqueTags } from "@/lib/api";
import { Station, Filters } from "@/lib/types";
import StationCard from "@/components/stations/StationCard";
import StationFilters from "@/components/stations/StationFilters";
import { useSearchParams } from "next/navigation";
import { Loader2, Radio } from "lucide-react";

export default function StationsPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<Filters>({
    language: searchParams.get("language") || "",
    state: searchParams.get("state") || "",
    genre: searchParams.get("genre") || "",
    search: "",
    country: searchParams.get("country") || "",
  });

  useEffect(() => {
    getIndianStations().then((data) => {
      setStations(data);
      setLoading(false);
    });
  }, []);

  const languages = useMemo(() => getUniqueLanguages(stations), [stations]);
  const states = useMemo(() => getUniqueStates(stations), [stations]);
  const genres = useMemo(() => getUniqueTags(stations), [stations]);

  const filtered = useMemo(() => {
    return stations.filter((s) => {
      if (filters.search && !s.name.toLowerCase().includes(filters.search.toLowerCase()))
        return false;
      if (filters.language && !s.language.toLowerCase().includes(filters.language))
        return false;
      if (filters.state && s.state !== filters.state) return false;
      if (filters.genre && !s.tags.toLowerCase().includes(filters.genre)) return false;
      if (filters.country && s.countrycode !== filters.country) return false;
      return true;
    });
  }, [stations, filters]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Radio className="h-6 w-6 text-orange-400" /> All Indian Radio Stations
        </h1>
        <p className="text-gray-400 mt-1">
          {loading ? "Loading..." : `${filtered.length} stations found`}
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters */}
        <aside className="hidden w-64 flex-shrink-0 lg:block">
          <div className="sticky top-24 rounded-2xl border border-white/5 bg-white/5 p-5">
            <StationFilters
              filters={filters}
              languages={languages}
              states={states}
              genres={genres}
              onChange={setFilters}
            />
          </div>
        </aside>

        {/* Mobile filters */}
        <div className="mb-4 lg:hidden w-full">
          <StationFilters
            filters={filters}
            languages={languages}
            states={states}
            genres={genres}
            onChange={setFilters}
          />
        </div>

        {/* Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 text-gray-400">
              <Radio className="h-12 w-12 opacity-30" />
              <p>No stations match your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
              {filtered.map((station) => (
                <StationCard key={station.stationuuid} station={station} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
