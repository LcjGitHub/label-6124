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

/** 节日条目（包含公历日期字符串） */
export interface FestivalEntry {
  dateKey: string;
  date: Date;
  lunar: string;
  lunarMonth: string;
  lunarDay: string;
  festivals: string[];
  solarTerm: string | null;
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

/**
 * 获取指定年份的全部带节日的日期列表
 * 按公历日期升序排列，无节日的日期不返回
 */
export function getFestivalsForYear(year: number): FestivalEntry[] {
  if (year < CALENDAR_YEAR_MIN || year > CALENDAR_YEAR_MAX) return [];

  const result: FestivalEntry[] = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const key = formatDateKey(d);
    const entry = days[key];
    if (entry && entry.festivals.length > 0) {
      result.push({
        dateKey: key,
        date: new Date(d),
        lunar: entry.lunar,
        lunarMonth: entry.lunarMonth,
        lunarDay: entry.lunarDay,
        festivals: [...entry.festivals],
        solarTerm: entry.solarTerm,
      });
    }
  }

  return result;
}

/**
 * 今日概览信息
 */
export interface TodayOverview {
  date: Date;
  lunar: string;
  ganZhiYear: string;
  ganZhiMonth: string;
  ganZhiDay: string;
  solarTerm: string | null;
}

/**
 * 获取今日概览信息（农历、干支、节气）
 */
export function getTodayOverview(): TodayOverview | null {
  const today = new Date();
  const entry = getDayEntry(today);
  if (!entry) return null;
  return {
    date: today,
    lunar: entry.lunar,
    ganZhiYear: entry.ganZhi.year,
    ganZhiMonth: entry.ganZhi.month,
    ganZhiDay: entry.ganZhi.day,
    solarTerm: entry.solarTerm,
  };
}

/**
 * 下一节气信息
 */
export interface NextSolarTerm {
  name: string;
  date: string;
  time: string;
  daysLeft: number;
}

/**
 * 计算两个日期之间相差的天数（date2 - date1）
 */
function diffInDays(date1: Date, date2: Date): number {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * 获取当年下一个节气信息（含当天节气），当年已无剩余节气则返回 null
 */
export function getNextSolarTerm(fromDate: Date = new Date()): NextSolarTerm | null {
  const fromKey = formatDateKey(fromDate);
  const year = fromDate.getFullYear();
  const terms = getSolarTermsForYear(year);
  const nextTerm = terms.find((t) => t.date >= fromKey);

  if (!nextTerm) return null;

  const [y, m, d] = nextTerm.date.split("-").map(Number);
  const termDate = new Date(y, m - 1, d);
  const daysLeft = diffInDays(fromDate, termDate);

  return {
    name: nextTerm.name,
    date: nextTerm.date,
    time: nextTerm.time,
    daysLeft,
  };
}
