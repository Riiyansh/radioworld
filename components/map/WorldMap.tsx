"use client";
import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface Props {
  selectedCountry: string;
  stationCounts: Record<string, number>;
  onSelectCountry: (code: string) => void;
}

// ISO numeric → alpha2
const ISO_MAP: Record<string, string> = {
  "004":"AF","008":"AL","012":"DZ","024":"AO","032":"AR","036":"AU","040":"AT",
  "050":"BD","056":"BE","068":"BO","076":"BR","100":"BG","104":"MM","116":"KH",
  "120":"CM","124":"CA","144":"LK","152":"CL","156":"CN","170":"CO","180":"CD",
  "188":"CR","192":"CU","203":"CZ","208":"DK","214":"DO","218":"EC","818":"EG",
  "231":"ET","246":"FI","250":"FR","276":"DE","288":"GH","300":"GR","320":"GT",
  "324":"GN","332":"HT","340":"HN","348":"HU","356":"IN","360":"ID","364":"IR",
  "368":"IQ","372":"IE","376":"IL","380":"IT","388":"JM","392":"JP","400":"JO",
  "404":"KE","408":"KP","410":"KR","414":"KW","418":"LA","422":"LB","504":"MA",
  "484":"MX","496":"MN","508":"MZ","524":"NP","528":"NL","558":"NI","566":"NG",
  "578":"NO","586":"PK","591":"PA","604":"PE","608":"PH","616":"PL","620":"PT",
  "630":"PR","634":"QA","642":"RO","643":"RU","682":"SA","686":"SN","706":"SO",
  "710":"ZA","724":"ES","752":"SE","756":"CH","760":"SY","764":"TH","788":"TN",
  "792":"TR","800":"UG","804":"UA","784":"AE","826":"GB","840":"US","858":"UY",
  "860":"UZ","862":"VE","704":"VN","887":"YE","894":"ZM","716":"ZW","064":"BT",
};

function getColor(count: number, isSelected: boolean): string {
  if (isSelected) return "#f97316";
  if (count === 0) return "#1e293b";
  if (count < 5) return "#1d4ed8";
  if (count < 20) return "#2563eb";
  if (count < 50) return "#3b82f6";
  if (count < 100) return "#6366f1";
  return "#8b5cf6";
}

export default function WorldMap({ selectedCountry, stationCounts, onSelectCountry }: Props) {
  const [tooltip, setTooltip] = useState<{ name: string; count: number; x: number; y: number } | null>(null);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-gray-900/50">
      <ComposableMap
        projection="geoNaturalEarth1"
        style={{ width: "100%", height: "480px" }}
      >
        <ZoomableGroup zoom={1} minZoom={0.5} maxZoom={8}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const alpha2 = ISO_MAP[String(geo.id).padStart(3, "0")] || "";
                const count = stationCounts[alpha2] || 0;
                const isSelected = selectedCountry === alpha2;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => {
                      if (alpha2) onSelectCountry(isSelected ? "" : alpha2);
                    }}
                    onMouseEnter={(e) => {
                      if (!alpha2) return;
                      setTooltip({
                        name: geo.properties?.name || alpha2,
                        count,
                        x: (e as unknown as MouseEvent).clientX,
                        y: (e as unknown as MouseEvent).clientY,
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    style={{
                      default: {
                        fill: getColor(count, isSelected),
                        stroke: "#0f172a",
                        strokeWidth: 0.5,
                        outline: "none",
                        cursor: alpha2 ? "pointer" : "default",
                        transition: "fill 0.15s ease",
                      },
                      hover: {
                        fill: alpha2 ? "#f97316" : "#1e293b",
                        stroke: "#0f172a",
                        strokeWidth: 0.5,
                        outline: "none",
                        opacity: 0.9,
                      },
                      pressed: {
                        fill: "#ea580c",
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
          <p className="text-gray-400">
            {tooltip.count > 0 ? `${tooltip.count} stations` : "No stations available"}
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-xl border border-white/10 bg-gray-900/90 px-3 py-2 text-xs backdrop-blur-sm">
        <span className="text-gray-400">Stations:</span>
        {[
          { color: "#1e293b", label: "0" },
          { color: "#1d4ed8", label: "1-4" },
          { color: "#3b82f6", label: "5-49" },
          { color: "#6366f1", label: "50-99" },
          { color: "#8b5cf6", label: "100+" },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-sm" style={{ background: color }} />
            <span className="text-gray-400">{label}</span>
          </span>
        ))}
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-orange-500" />
          <span className="text-orange-400">Selected</span>
        </span>
      </div>

      <div className="absolute right-3 top-3 rounded-lg border border-white/10 bg-gray-900/80 px-2 py-1 text-xs text-gray-400 backdrop-blur-sm">
        Scroll to zoom · Drag to pan · Click to filter
      </div>
    </div>
  );
}
