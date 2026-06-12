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

export const LUNAR_MONTHS = [
  "正月", "二月", "三月", "四月",
  "五月", "六月", "七月", "八月",
  "九月", "十月", "冬月", "腊月",
];

export const LUNAR_DAYS = [
  "初一", "初二", "初三", "初四", "初五",
  "初六", "初七", "初八", "初九", "初十",
  "十一", "十二", "十三", "十四", "十五",
  "十六", "十七", "十八", "十九", "二十",
  "廿一", "廿二", "廿三", "廿四", "廿五",
  "廿六", "廿七", "廿八", "廿九", "三十",
];

const days = calendarData.days as Record<string, DayEntry>;
const solarTermsByYear = calendarData.solarTermsByYear as Record<
  string,
  SolarTermEntry[]
>;

export function formatDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function isDateInRange(date: Date): boolean {
  const year = date.getFullYear();
  return year >= CALENDAR_YEAR_MIN && year <= CALENDAR_YEAR_MAX;
}

export function getDayEntry(date: Date): DayEntry | null {
  if (!isDateInRange(date)) return null;
  return days[formatDateKey(date)] ?? null;
}

export function formatGanZhi(entry: DayEntry): string {
  return `${entry.ganZhi.year}年 · ${entry.ganZhi.month}月 · ${entry.ganZhi.day}日`;
}

export function formatSolarTermDisplay(entry: DayEntry): string {
  return entry.solarTerm ?? "无";
}

/**
 * 获取指定年份的全部节气列表
 */
export function getSolarTermsForYear(year: number): SolarTermEntry[] {
  if (year < CALENDAR_YEAR_MIN || year > CALENDAR_YEAR_MAX) return [];
  return solarTermsByYear[String(year)] ?? [];
}

/**
 * 获取指定年月的节气日期对象列表
 * @param year 年份
 * @param month 月份（1-12）
 */
export function getSolarTermsForMonth(
  year: number,
  month: number,
): Date[] {
  const allTerms = getSolarTermsForYear(year);
  const monthStr = String(month).padStart(2, "0");
  return allTerms
    .filter((term) => term.date.split("-")[1] === monthStr)
    .map((term) => {
      const [y, m, d] = term.date.split("-").map(Number);
      return new Date(y, m - 1, d);
    });
}

export function formatSolarDate(date: Date): string {
  return format(date, "yyyy年M月d日 EEEE", { locale: zhCN });
}

export function formatSolarTermDateTime(entry: SolarTermEntry): string {
  const [year, month, day] = entry.date.split("-").map(Number);
  const date = new Date(year, month - 1, day);
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

export interface ReverseLookupResult {
  dateKey: string;
  date: Date;
  lunar: string;
  lunarMonth: string;
  lunarDay: string;
  ganZhi: DayEntry["ganZhi"];
  solarTerm: string | null;
  festivals: string[];
}

export function reverseLookupLunar(
  lunarMonth: string,
  lunarDay: string,
): ReverseLookupResult[] {
  const results: ReverseLookupResult[] = [];

  const startDate = new Date(CALENDAR_YEAR_MIN, 0, 1);
  const endDate = new Date(CALENDAR_YEAR_MAX, 11, 31);

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const key = formatDateKey(d);
    const entry = days[key];
    if (
      entry &&
      entry.lunarMonth === lunarMonth &&
      entry.lunarDay === lunarDay
    ) {
      results.push({
        dateKey: key,
        date: new Date(d),
        lunar: entry.lunar,
        lunarMonth: entry.lunarMonth,
        lunarDay: entry.lunarDay,
        ganZhi: { ...entry.ganZhi },
        solarTerm: entry.solarTerm,
        festivals: [...entry.festivals],
      });
    }
  }

  return results;
}

export interface DateValidationResult {
  valid: boolean;
  date?: Date;
  error?: string;
}

export function parseDateInput(input: string): DateValidationResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { valid: false, error: "请输入日期" };
  }

  const result = extractYearMonthDay(trimmed);
  if (!result) {
    return {
      valid: false,
      error: "格式错误，请输入完整的年、月、日，例如二〇二四年六月十五日",
    };
  }

  return validateGregorianDate(result.year, result.month, result.day);
}

interface ParsedDateParts {
  year: number;
  month: number;
  day: number;
}

function extractYearMonthDay(input: string): ParsedDateParts | null {
  const patterns: RegExp[] = [
    /^(\d{4})[\-/.](\d{1,2})[\-/.](\d{1,2})$/,
    /^(\d{4})年(\d{1,2})月(\d{1,2})日?$/,
    /^(\d{4})(\d{2})(\d{2})$/,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) {
      return {
        year: parseInt(match[1], 10),
        month: parseInt(match[2], 10),
        day: parseInt(match[3], 10),
      };
    }
  }

  return null;
}

export function validateGregorianDate(
  year: number,
  month: number,
  day: number,
): DateValidationResult {
  if (!isYearInRange(year)) {
    return {
      valid: false,
      error: `年份超出范围，仅限 ${CALENDAR_YEAR_MIN}–${CALENDAR_YEAR_MAX} 年`,
    };
  }

  if (!isMonthValid(month)) {
    return { valid: false, error: "月份错误，应为 1–12" };
  }

  if (!isDayValid(day)) {
    return { valid: false, error: "日期错误，应为 1–31" };
  }

  if (!isDateExists(year, month, day)) {
    return { valid: false, error: "日期无效，该月没有这一天" };
  }

  return { valid: true, date: new Date(year, month - 1, day) };
}

function isYearInRange(year: number): boolean {
  return year >= CALENDAR_YEAR_MIN && year <= CALENDAR_YEAR_MAX;
}

function isMonthValid(month: number): boolean {
  return month >= 1 && month <= 12;
}

function isDayValid(day: number): boolean {
  return day >= 1 && day <= 31;
}

function isDateExists(year: number, month: number, day: number): boolean {
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function formatDateSummary(date: Date, entry: DayEntry): string {
  const solarDate = formatSolarDate(date);
  const solarTerm = formatSolarTermDisplay(entry);
  const festivals =
    entry.festivals.length > 0 ? entry.festivals.join("、") : "无";

  return [
    `公历：${solarDate}`,
    `农历：${entry.lunar}`,
    `干支：${formatGanZhi(entry)}`,
    `节气：${solarTerm}`,
    `节日：${festivals}`,
  ].join("；") + "。";
}
