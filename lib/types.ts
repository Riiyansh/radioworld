export interface Station {
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  favicon: string;
  tags: string;
  country: string;
  countrycode: string;
  state: string;
  language: string;
  votes: number;
  clickcount: number;
  bitrate: number;
  codec: string;
  lastcheckok: number;
}

export interface Filters {
  language: string;
  state: string;
  genre: string;
  search: string;
  country: string;
}

export const COUNTRIES = [
  { code: "IN", name: "India", emoji: "🇮🇳" },
  { code: "PK", name: "Pakistan", emoji: "🇵🇰" },
  { code: "BD", name: "Bangladesh", emoji: "🇧🇩" },
  { code: "NP", name: "Nepal", emoji: "🇳🇵" },
  { code: "BT", name: "Bhutan", emoji: "🇧🇹" },
];

export type PlayerStatus = "idle" | "loading" | "playing" | "paused" | "error";
