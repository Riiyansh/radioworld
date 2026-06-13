import { NextResponse } from "next/server";
import fallbackStations from "@/data/stations.json";

const SERVERS = [
  "https://de1.api.radio-browser.info/json",
  "https://nl1.api.radio-browser.info/json",
  "https://at1.api.radio-browser.info/json",
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";

  const country = searchParams.get("country") || "";

  const path = query
    ? `/stations/search${country ? `?countrycode=${country}&` : "?"}name=${encodeURIComponent(query)}&limit=100&hidebroken=true`
    : country
    ? `/stations/bycountrycode/${country}?limit=300&hidebroken=true&order=clickcount&reverse=true`
    : `/stations/search?limit=500&hidebroken=true&order=clickcount&reverse=true`;

  for (const base of SERVERS) {
    try {
      const res = await fetch(`${base}${path}`, {
        headers: { "User-Agent": "india-radio-app/1.0" },
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.length > 0) return NextResponse.json(data);
      }
    } catch {
      continue;
    }
  }

  // Fallback to static dataset when API is unreachable
  if (query) {
    const filtered = fallbackStations.filter((s) =>
      s.name.toLowerCase().includes(query.toLowerCase())
    );
    return NextResponse.json(filtered);
  }
  return NextResponse.json(fallbackStations);
}
