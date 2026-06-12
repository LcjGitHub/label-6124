"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  CALENDAR_YEAR_MAX,
  CALENDAR_YEAR_MIN,
  DateValidationResult,
  formatDateKey,
  parseDateInput,
} from "@/lib/calendar";
import { getPersistStorage } from "@/lib/client-storage";

interface DateStore {
  selectedDate: Date;
  hydrated: boolean;
  highlightedDateKey: string | null;
  setHydrated: () => void;
  setSelectedDate: (date: Date) => void;
  setSelectedDateFromString: (input: string) => DateValidationResult;
  setHighlightedDateKey: (dateKey: string | null) => void;
}

const DATE_KEY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function isValidDateKey(key: string): boolean {
  if (!DATE_KEY_REGEX.test(key)) return false;
  const [year, month, day] = key.split("-").map(Number);
  if (year < CALENDAR_YEAR_MIN || year > CALENDAR_YEAR_MAX) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export const useDateStore = create<DateStore>()(
  persist(
    (set) => ({
      selectedDate: new Date(),
      hydrated: false,
      highlightedDateKey: null,

      setHydrated: () => set({ hydrated: true }),

      setSelectedDate: (date) => set({ selectedDate: date }),
      setSelectedDateFromString: (input) => {
        const result = parseDateInput(input);
        if (result.valid && result.date) {
          set({ selectedDate: result.date });
        }
        return result;
      },
      setHighlightedDateKey: (dateKey) => set({ highlightedDateKey: dateKey }),
    }),
    {
      name: "lunar-calendar-selected-date",
      storage: createJSONStorage(() => getPersistStorage(), {
        replacer: (_key, value) => {
          if (value instanceof Date) {
            return formatDateKey(value);
          }
          return value;
        },
        reviver: (_key, value) => {
          if (typeof value === "string" && DATE_KEY_REGEX.test(value)) {
            if (isValidDateKey(value)) {
              const [year, month, day] = value.split("-").map(Number);
              return new Date(year, month - 1, day);
            }
            return new Date();
          }
          return value;
        },
      }),
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
