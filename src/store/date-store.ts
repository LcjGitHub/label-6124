import { create } from "zustand";
import {
  DateValidationResult,
  formatDateKey,
  parseDateInput,
} from "@/lib/calendar";

interface DateStore {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  setSelectedDateFromString: (input: string) => DateValidationResult;
}

export const useDateStore = create<DateStore>((set) => ({
  selectedDate: new Date(),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedDateFromString: (input) => {
    const result = parseDateInput(input);
    if (result.valid && result.date) {
      set({ selectedDate: result.date });
    }
    return result;
  },
}));

export function useSelectedDateKey(): string {
  return useDateStore((s) => formatDateKey(s.selectedDate));
}
