"use client";
import { Filters, COUNTRIES } from "@/lib/types";
import { Search, X } from "lucide-react";

interface Props {
  filters: Filters;
  languages: string[];
  states: string[];
  genres: string[];
  onChange: (filters: Filters) => void;
}

const PILL = "cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-all";
const ACTIVE = "border-orange-500 bg-orange-500/20 text-orange-300";
const INACTIVE = "border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-white";

export default function StationFilters({ filters, languages, states, genres, onChange }: Props) {
  const set = (key: keyof Filters, value: string) =>
    onChange({ ...filters, [key]: filters[key] === value ? "" : value });

  const hasFilters =
    filters.language || filters.state || filters.genre || filters.search || filters.country;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search stations..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-white placeholder-gray-500 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30"
        />
        {filters.search && (
          <button
            onClick={() => onChange({ ...filters, search: "" })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Countries */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Country</p>
        <div className="flex flex-wrap gap-2">
          {COUNTRIES.map((c) => (
            <button
              key={c.code}
              onClick={() => set("country", c.code)}
              className={`${PILL} ${filters.country === c.code ? ACTIVE : INACTIVE}`}
            >
              {c.emoji} {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Languages */}
      {languages.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Language</p>
          <div className="flex flex-wrap gap-2">
            {languages.slice(0, 15).map((lang) => (
              <button
                key={lang}
                onClick={() => set("language", lang.toLowerCase())}
                className={`${PILL} ${filters.language === lang.toLowerCase() ? ACTIVE : INACTIVE}`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* States */}
      {states.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">State</p>
          <div className="flex flex-wrap gap-2">
            {states.map((state) => (
              <button
                key={state}
                onClick={() => set("state", state)}
                className={`${PILL} ${filters.state === state ? ACTIVE : INACTIVE}`}
              >
                {state}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Genres */}
      {genres.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Genre</p>
          <div className="flex flex-wrap gap-2">
            {genres.slice(0, 20).map((genre) => (
              <button
                key={genre}
                onClick={() => set("genre", genre)}
                className={`${PILL} ${filters.genre === genre ? ACTIVE : INACTIVE}`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Clear filters */}
      {hasFilters && (
        <button
          onClick={() => onChange({ language: "", state: "", genre: "", search: "", country: "" })}
          className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300"
        >
          <X className="h-3 w-3" /> Clear all filters
        </button>
      )}
    </div>
  );
}
