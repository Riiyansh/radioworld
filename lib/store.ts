"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Station, PlayerStatus } from "./types";

interface PlayerStore {
  currentStation: Station | null;
  status: PlayerStatus;
  volume: number;
  isMuted: boolean;
  favorites: Station[];
  recentlyPlayed: Station[];
  play: (station: Station) => void;
  pause: () => void;
  resume: () => void;
  setStatus: (status: PlayerStatus) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  toggleFavorite: (station: Station) => void;
  isFavorite: (uuid: string) => boolean;
  addToRecent: (station: Station) => void;
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      currentStation: null,
      status: "idle",
      volume: 80,
      isMuted: false,
      favorites: [],
      recentlyPlayed: [],

      play: (station) => {
        set({ currentStation: station, status: "loading" });
        get().addToRecent(station);
      },

      pause: () => set({ status: "paused" }),
      resume: () => set({ status: "playing" }),
      setStatus: (status) => set({ status }),
      setVolume: (volume) => set({ volume, isMuted: volume === 0 }),
      toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),

      toggleFavorite: (station) => {
        const { favorites } = get();
        const exists = favorites.find((f) => f.stationuuid === station.stationuuid);
        set({
          favorites: exists
            ? favorites.filter((f) => f.stationuuid !== station.stationuuid)
            : [station, ...favorites],
        });
      },

      isFavorite: (uuid) => get().favorites.some((f) => f.stationuuid === uuid),

      addToRecent: (station) => {
        const recent = get().recentlyPlayed.filter(
          (s) => s.stationuuid !== station.stationuuid
        );
        set({ recentlyPlayed: [station, ...recent].slice(0, 10) });
      },
    }),
    {
      name: "india-radio-store",
      partialize: (s) => ({
        favorites: s.favorites,
        recentlyPlayed: s.recentlyPlayed,
        volume: s.volume,
      }),
    }
  )
);
