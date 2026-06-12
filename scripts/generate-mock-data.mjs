/**
 * 生成 2020–2030 年 Mock 日历数据（节气、干支、节日）
 */
import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const LUNAR_MONTHS = [
  "正月", "二月", "三月", "四月", "五月", "六月",
  "七月", "八月", "九月", "十月", "冬月", "腊月",
];
const LUNAR_DAYS = [
  "初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十",
  "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
  "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十",
];

const SOLAR_TERMS = [
  "小寒", "大寒", "立春", "雨水", "惊蛰", "春分",
  "清明", "谷雨", "立夏", "小满", "芒种", "夏至",
  "小暑", "大暑", "立秋", "处暑", "白露", "秋分",
  "寒露", "霜降", "立冬", "小雪", "大雪", "冬至",
];

/** 各年节气大致起始日（Mock 近似值） */
const TERM_BASE_DAYS = [
  [6, 20, 4, 19, 6, 21, 5, 20, 6, 21, 6, 21, 7, 23, 8, 23, 8, 23, 8, 24, 7, 22, 7, 22],
  [6, 20, 4, 19, 5, 20, 4, 20, 5, 21, 5, 21, 7, 22, 7, 23, 7, 23, 8, 23, 7, 22, 7, 21],
  [5, 20, 3, 18, 5, 20, 4, 19, 5, 20, 5, 21, 7, 22, 7, 22, 7, 22, 8, 23, 7, 22, 7, 21],
  [5, 20, 4, 19, 5, 20, 4, 19, 5, 21, 5, 21, 7, 22, 7, 22, 7, 23, 8, 23, 7, 22, 7, 21],
  [5, 20, 3, 18, 5, 20, 4, 19, 5, 21, 5, 21, 7, 22, 7, 22, 7, 22, 8, 23, 7, 22, 7, 21],
  [5, 20, 3, 18, 4, 20, 4, 19, 5, 21, 5, 21, 7, 22, 7, 22, 7, 22, 8, 23, 7, 22, 7, 21],
  [5, 20, 3, 18, 5, 20, 4, 19, 5, 21, 5, 21, 7, 22, 7, 22, 7, 22, 8, 23, 7, 22, 7, 21],
  [6, 20, 4, 19, 5, 20, 4, 20, 5, 21, 5, 21, 7, 22, 7, 23, 7, 23, 8, 23, 7, 22, 7, 21],
  [5, 20, 3, 18, 5, 20, 4, 19, 5, 21, 5, 21, 7, 22, 7, 22, 7, 22, 8, 23, 7, 22, 7, 21],
  [5, 20, 3, 18, 5, 20, 4, 19, 5, 21, 5, 21, 7, 22, 7, 22, 7, 22, 8, 23, 7, 22, 7, 21],
  [6, 20, 4, 19, 5, 20, 4, 20, 5, 21, 5, 21, 7, 22, 7, 23, 7, 23, 8, 23, 7, 22, 7, 21],
];

const FIXED_FESTIVALS = {
  "01-01": "元旦",
  "02-14": "情人节",
  "03-08": "妇女节",
  "04-01": "愚人节",
  "05-01": "劳动节",
  "05-04": "青年节",
  "06-01": "儿童节",
  "10-01": "国庆节",
  "12-25": "圣诞节",
};

/**
 * @param {number} year
 * @returns {string}
 */
function getYearGanZhi(year) {
  const stem = STEMS[(year - 4) % 10];
  const branch = BRANCHES[(year - 4) % 12];
  return stem + branch;
}

/**
 * @param {Date} date
 * @returns {string}
 */
function getDayGanZhi(date) {
  const base = new Date(2000, 0, 1);
  const diff = Math.floor((date - base) / 86400000);
  const stem = STEMS[(diff + 4) % 10];
  const branch = BRANCHES[(diff + 6) % 12];
  return stem + branch;
}

/**
 * @param {Date} date
 * @returns {string}
 */
function getMonthGanZhi(date, yearGanZhi) {
  const month = date.getMonth();
  const yearStemIndex = STEMS.indexOf(yearGanZhi[0]);
  const stemIndex = (yearStemIndex * 2 + month + 2) % 10;
  const branchIndex = (month + 2) % 12;
  return STEMS[stemIndex] + BRANCHES[branchIndex];
}

/**
 * @param {number} year
 * @returns {Array<{ name: string; date: string; time: string }>}
 */
function generateSolarTermsForYear(year) {
  const yearIndex = year - 2020;
  const baseDays = TERM_BASE_DAYS[yearIndex] ?? TERM_BASE_DAYS[0];
  const terms = [];

  for (let i = 0; i < 24; i++) {
    const month = Math.floor(i / 2) + 1;
    const day = baseDays[i];
    const hour = 8 + (i % 6);
    const minute = (i * 7) % 60;
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    terms.push({
      name: SOLAR_TERMS[i],
      date: dateStr,
      time: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    });
  }

  return terms;
}

/**
 * @param {number} year
 * @returns {Record<string, string>}
 */
function buildSolarTermDayMap(year) {
  const terms = generateSolarTermsForYear(year);
  const map = {};
  for (const t of terms) {
    map[t.date] = t.name;
  }
  return map;
}

/**
 * @param {number} dayOfYear
 * @returns {{ lunarMonth: string; lunarDay: string; lunar: string }}
 */
function getLunarMock(dayOfYear) {
  const cycle = 354;
  const pos = dayOfYear % cycle;
  const monthLen = 29.5;
  const monthIndex = Math.floor(pos / monthLen) % 12;
  const dayIndex = Math.floor(pos % monthLen) % 30;
  const lunarMonth = LUNAR_MONTHS[monthIndex];
  const lunarDay = LUNAR_DAYS[dayIndex];
  return { lunarMonth, lunarDay, lunar: `${lunarMonth}${lunarDay}` };
}

/**
 * @param {string} lunarMonth
 * @param {string} lunarDay
 * @returns {string[]}
 */
function getLunarFestivals(lunarMonth, lunarDay) {
  const festivals = [];
  if (lunarMonth === "正月" && lunarDay === "初一") festivals.push("春节");
  if (lunarMonth === "正月" && lunarDay === "十五") festivals.push("元宵节");
  if (lunarMonth === "五月" && lunarDay === "初五") festivals.push("端午节");
  if (lunarMonth === "八月" && lunarDay === "十五") festivals.push("中秋节");
  if (lunarMonth === "九月初九" || (lunarMonth === "九月" && lunarDay === "初九")) festivals.push("重阳节");
  return festivals;
}

function generate() {
  const days = {};
  const solarTermsByYear = {};

  for (let year = 2020; year <= 2030; year++) {
    solarTermsByYear[String(year)] = generateSolarTermsForYear(year);
    const termMap = buildSolarTermDayMap(year);
    const yearGanZhi = getYearGanZhi(year);
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const totalDays = isLeap ? 366 : 365;

    for (let d = 0; d < totalDays; d++) {
      const date = new Date(year, 0, 1);
      date.setDate(date.getDate() + d);
      const key = date.toISOString().slice(0, 10);
      const mmdd = key.slice(5);
      const lunar = getLunarMock(d + year * 365);
      const festivals = [];

      if (FIXED_FESTIVALS[mmdd]) festivals.push(FIXED_FESTIVALS[mmdd]);
      festivals.push(...getLunarFestivals(lunar.lunarMonth, lunar.lunarDay));

      days[key] = {
        lunar: lunar.lunar,
        lunarMonth: lunar.lunarMonth,
        lunarDay: lunar.lunarDay,
        ganZhi: {
          year: yearGanZhi,
          month: getMonthGanZhi(date, yearGanZhi),
          day: getDayGanZhi(date),
        },
        solarTerm: termMap[key] ?? null,
        festivals: [...new Set(festivals)],
      };
    }
  }

  const output = {
    meta: {
      range: "2020-2030",
      description: "Mock 日历数据：农历、干支、节气、节日标签",
      generatedAt: new Date().toISOString(),
    },
    days,
    solarTermsByYear,
  };

  const outPath = join(__dirname, "../src/mock/calendar-2020-2030.json");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(output, null, 2), "utf-8");
  console.log(`Generated ${Object.keys(days).length} days -> ${outPath}`);
}

generate();
