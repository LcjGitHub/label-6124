"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  DateValidationResult,
  formatDateKey,
  parseDateInput,
} from "@/lib/calendar";

interface DateStore {
  selectedDate: Date;
  hydrated: boolean;
  setHydrated: () => void;
  setSelectedDate: (date: Date) => void;
  setSelectedDateFromString: (input: string) => DateValidationResult;
}

export const useDateStore = create<DateStore>()(
  persist(
    (set) => ({
      selectedDate: new Date(),
      hydrated: false,

      setHydrated: () => set({ hydrated: true }),

      setSelectedDate: (date) => set({ selectedDate: date }),
      setSelectedDateFromString: (input) => {
        const result = parseDateInput(input);
        if (result.valid && result.date) {
          set({ selectedDate: result.date });
        }
        return result;
      },
    }),
    {
      name: "lunar-calendar-selected-date",
      storage: createJSONStorage(() => localStorage),
      serialize: (state) => {
        return JSON.stringify({
          state: {
            ...state.state,
            selectedDate: formatDateKey(state.state.selectedDate),
          },
          version: state.version,
        });
      },
      deserialize: (str) => {
        const parsed = JSON.parse(str);
        const dateKey = parsed.state.selectedDate;
        if (dateKey && typeof dateKey === "string") {
          const [year, month, day] = dateKey.split("-").map(Number);
          parsed.state.selectedDate = new Date(year, month - 1, day);
        }
        return parsed;
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated();
        }
      },
      partialize: (state) => ({ selectedDate: state.selectedDate }),
    }
  )
);

export function useSelectedDateKey(): string {
  return useDateStore((s) => formatDateKey(s.selectedDate));
}
