import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import calendarData from "@/mock/calendar-2020-2030.json";

/** 单日 Mock 日历条目 */
export interface DayEntry {
  lunar: string;
  lunarMonth: string;
  lunarDay: string;
  ganZhi: {
    year: string;
    month: string;
    day: string;
  };
  solarTerm: string | null;
  festivals: string[];
}

/** 节气条目 */
export interface SolarTermEntry {
  name: string;
  date: string;
  time: string;
}

/** Mock 数据覆盖年份范围 */
export const CALENDAR_YEAR_MIN = 2020;
export const CALENDAR_YEAR_MAX = 2030;

const days = calendarData.days as Record<string, DayEntry>;
const solarTermsByYear = calendarData.solarTermsByYear as Record<
  string,
  SolarTermEntry[]
>;

/**
 * 将 Date 格式化为 yyyy-MM-dd
 */
export function formatDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/**
 * 判断日期是否在 Mock 数据覆盖范围内
 */
export function isDateInRange(date: Date): boolean {
  const year = date.getFullYear();
  return year >= CALENDAR_YEAR_MIN && year <= CALENDAR_YEAR_MAX;
}

/**
 * 获取指定日期的 Mock 日历数据
 */
export function getDayEntry(date: Date): DayEntry | null {
  if (!isDateInRange(date)) return null;
  return days[formatDateKey(date)] ?? null;
}

/**
 * 获取指定年份的全部节气列表
 */
export function getSolarTermsForYear(year: number): SolarTermEntry[] {
  if (year < CALENDAR_YEAR_MIN || year > CALENDAR_YEAR_MAX) return [];
  return solarTermsByYear[String(year)] ?? [];
}

/**
 * 格式化公历日期为中文展示
 */
export function formatSolarDate(date: Date): string {
  return format(date, "yyyy年M月d日 EEEE", { locale: zhCN });
}

/**
 * 格式化节气日期时间
 */
export function formatSolarTermDateTime(entry: SolarTermEntry): string {
  const [y, m, d] = entry.date.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return `${format(date, "M月d日", { locale: zhCN })} ${entry.time}`;
}
