import { Station } from "./types";

// All fetching goes through our Next.js API route (/api/stations)
// so requests come from the browser, not the server.

export async function getIndianStations(): Promise<Station[]> {
  try {
    const res = await fetch("/api/stations", { cache: "no-store" });
    if (!res.ok) return [];
    const data: Station[] = await res.json();
    return data.filter((s) => s.url_resolved || s.url);
  } catch {
    return [];
  }
}

export async function searchStations(query: string): Promise<Station[]> {
  try {
    const res = await fetch(`/api/stations?q=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export function getUniqueLanguages(stations: Station[]): string[] {
  const langs = new Set<string>();
  stations.forEach((s) => {
    s.language
      .split(",")
      .map((l) => l.trim())
      .filter(Boolean)
      .forEach((l) => langs.add(l.charAt(0).toUpperCase() + l.slice(1)));
  });
  return Array.from(langs).sort();
}

export function getUniqueStates(stations: Station[]): string[] {
  const states = new Set<string>();
  stations.forEach((s) => {
    if (s.state?.trim()) states.add(s.state.trim());
  });
  return Array.from(states).sort();
}

export function getUniqueTags(stations: Station[]): string[] {
  const tags = new Set<string>();
  stations.forEach((s) => {
    s.tags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 1 && t.length < 20)
      .forEach((t) => tags.add(t));
  });
  return Array.from(tags).sort().slice(0, 30);
}
