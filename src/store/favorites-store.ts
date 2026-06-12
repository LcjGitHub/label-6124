"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { DayEntry, formatDateKey } from "@/lib/calendar";

export interface FavoriteItem {
  dateKey: string;
  lunar: string;
  lunarMonth: string;
  lunarDay: string;
  ganZhi: DayEntry["ganZhi"];
  solarTerm: string | null;
  festivals: string[];
  addedAt: number;
}

interface FavoritesStore {
  favorites: FavoriteItem[];
  hydrated: boolean;
  setHydrated: () => void;
  addFavorite: (date: Date, entry: DayEntry) => void;
  removeFavorite: (dateKey: string) => void;
  isFavorite: (dateKey: string) => boolean;
  toggleFavorite: (date: Date, entry: DayEntry) => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      hydrated: false,

      setHydrated: () => set({ hydrated: true }),

      addFavorite: (date, entry) => {
        const dateKey = formatDateKey(date);
        if (get().isFavorite(dateKey)) return;

        const newItem: FavoriteItem = {
          dateKey,
          lunar: entry.lunar,
          lunarMonth: entry.lunarMonth,
          lunarDay: entry.lunarDay,
          ganZhi: { ...entry.ganZhi },
          solarTerm: entry.solarTerm,
          festivals: [...entry.festivals],
          addedAt: Date.now(),
        };

        set((state) => ({
          favorites: [newItem, ...state.favorites],
        }));
      },

      removeFavorite: (dateKey) => {
        set((state) => ({
          favorites: state.favorites.filter((f) => f.dateKey !== dateKey),
        }));
      },

      isFavorite: (dateKey) => {
        return get().favorites.some((f) => f.dateKey === dateKey);
      },

      toggleFavorite: (date, entry) => {
        const dateKey = formatDateKey(date);
        if (get().isFavorite(dateKey)) {
          get().removeFavorite(dateKey);
        } else {
          get().addFavorite(date, entry);
        }
      },
    }),
    {
      name: "lunar-calendar-favorites",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated();
        }
      },
    }
  )
);
