import { create } from "zustand";
import { formatDateKey } from "@/lib/calendar";

interface DateStore {
  /** 当前选中的公历日期 */
  selectedDate: Date;
  /** 设置选中日期 */
  setSelectedDate: (date: Date) => void;
}

/**
 * 全局日期选择状态
 */
export const useDateStore = create<DateStore>((set) => ({
  selectedDate: new Date(),
  setSelectedDate: (date) => set({ selectedDate: date }),
}));

/**
 * 获取选中日期键值（yyyy-MM-dd）
 */
export function useSelectedDateKey(): string {
  return useDateStore((s) => formatDateKey(s.selectedDate));
}
