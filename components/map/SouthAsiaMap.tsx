"use client";
import { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// ISO numeric codes for South Asia
const SOUTH_ASIA: Record<string, { name: string; emoji: string; color: string; hoverColor: string }> = {
  "356": { name: "India",      emoji: "🇮🇳", color: "#f97316", hoverColor: "#fb923c" },
  "586": { name: "Pakistan",   emoji: "🇵🇰", color: "#22c55e", hoverColor: "#4ade80" },
  "050": { name: "Bangladesh", emoji: "🇧🇩", color: "#3b82f6", hoverColor: "#60a5fa" },
  "524": { name: "Nepal",      emoji: "🇳🇵", color: "#a855f7", hoverColor: "#c084fc" },
  "064": { name: "Bhutan",     emoji: "🇧🇹", color: "#ec4899", hoverColor: "#f472b6" },
};

// Country code numeric → alpha2
const NUM_TO_ALPHA: Record<string, string> = {
  "356": "IN",
  "586": "PK",
  "050": "BD",
  "524": "NP",
  "064": "BT",
};

interface Props {
  selectedCountry: string;
  stationCounts: Record<string, number>;
  onSelectCountry: (code: string) => void;
}

export default function SouthAsiaMap({ selectedCountry, stationCounts, onSelectCountry }: Props) {
  const [tooltip, setTooltip] = useState<{ name: string; count: number; x: number; y: number } | null>(null);

  return (
    <div className="relative w-full rounded-2xl border border-white/10 bg-gray-900/50 p-2 overflow-hidden">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [80, 28], scale: 600 }}
        style={{ width: "100%", height: "420px" }}
      >
        <ZoomableGroup zoom={1} minZoom={0.8} maxZoom={4}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies
                .filter((geo) => SOUTH_ASIA[geo.id])
                .map((geo) => {
                  const info = SOUTH_ASIA[geo.id];
                  const alpha2 = NUM_TO_ALPHA[geo.id];
                  const isSelected = selectedCountry === alpha2;
                  const count = stationCounts[alpha2] || 0;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => onSelectCountry(isSelected ? "" : alpha2)}
                      onMouseEnter={(e) => {
                        setTooltip({
                          name: info.name,
                          count,
                          x: (e as unknown as MouseEvent).clientX,
                          y: (e as unknown as MouseEvent).clientY,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                      style={{
                        default: {
                          fill: isSelected ? info.hoverColor : info.color,
                          stroke: "#0f172a",
                          strokeWidth: 1.5,
                          outline: "none",
                          opacity: selectedCountry && !isSelected ? 0.4 : 1,
                          cursor: "pointer",
                          filter: isSelected
                            ? `drop-shadow(0 0 8px ${info.color})`
                            : "none",
                          transition: "all 0.2s ease",
                        },
                        hover: {
                          fill: info.hoverColor,
                          stroke: "#fff",
                          strokeWidth: 2,
                          outline: "none",
                          opacity: 1,
                          cursor: "pointer",
                        },
                        pressed: {
                          fill: info.hoverColor,
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 rounded-xl border border-white/10 bg-gray-900/95 px-3 py-2 text-sm shadow-xl backdrop-blur-sm"
          style={{ left: tooltip.x + 12, top: tooltip.y - 40 }}
        >
          <p className="font-semibold text-white">{tooltip.name}</p>
          <p className="text-gray-400">{tooltip.count} stations</p>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
        {Object.entries(SOUTH_ASIA).map(([num, info]) => {
          const alpha2 = NUM_TO_ALPHA[num];
          const count = stationCounts[alpha2] || 0;
          const isSelected = selectedCountry === alpha2;
          return (
            <button
              key={num}
              onClick={() => onSelectCountry(isSelected ? "" : alpha2)}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all ${
                isSelected
                  ? "border-white/30 bg-white/15 text-white"
                  : "border-white/10 bg-gray-900/80 text-gray-400 hover:text-white"
              }`}
            >
              <span>{info.emoji}</span>
              <span>{info.name}</span>
              <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-xs">
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
