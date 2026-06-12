"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LUNAR_MONTHS,
  LUNAR_DAYS,
  reverseLookupLunar,
  CALENDAR_YEAR_MIN,
  CALENDAR_YEAR_MAX,
  type ReverseLookupResult,
} from "@/lib/calendar";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Search, CalendarSearch } from "lucide-react";

export function LunarReverseLookup() {
  const [lunarMonth, setLunarMonth] = useState<string>("");
  const [lunarDay, setLunarDay] = useState<string>("");
  const [searched, setSearched] = useState(false);

  const results = useMemo(() => {
    if (!lunarMonth || !lunarDay) return [];
    return reverseLookupLunar(lunarMonth, lunarDay);
  }, [lunarMonth, lunarDay]);

  const handleSearch = () => {
    if (lunarMonth && lunarDay) {
      setSearched(true);
    }
  };

  const handleReset = () => {
    setLunarMonth("");
    setLunarDay("");
    setSearched(false);
  };

  const todayKey = format(new Date(), "yyyy-MM-dd");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">农历反查</CardTitle>
        <CardDescription>
          选择农历月份与日期，查找对应的公历日期 · 数据范围{" "}
          {CALENDAR_YEAR_MIN}–{CALENDAR_YEAR_MAX} 年
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1.5">
            <label
              htmlFor="lunar-month-select"
              className="text-sm font-medium text-muted-foreground"
            >
              农历月份
            </label>
            <select
              id="lunar-month-select"
              value={lunarMonth}
              onChange={(e) => {
                setLunarMonth(e.target.value);
                setSearched(false);
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="" disabled>
                请选择月份
              </option>
              {LUNAR_MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 space-y-1.5">
            <label
              htmlFor="lunar-day-select"
              className="text-sm font-medium text-muted-foreground"
            >
              农历日期
            </label>
            <select
              id="lunar-day-select"
              value={lunarDay}
              onChange={(e) => {
                setLunarDay(e.target.value);
                setSearched(false);
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="" disabled>
                请选择日期
              </option>
              {LUNAR_DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSearch}
              disabled={!lunarMonth || !lunarDay}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                lunarMonth && lunarDay
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "cursor-not-allowed bg-muted text-muted-foreground"
              )}
            >
              <Search className="h-4 w-4" />
              查询
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              重置
            </button>
          </div>
        </div>

        {searched && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              查询结果：{lunarMonth}{lunarDay}，共 {results.length} 条匹配
            </h3>

            {results.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-8 text-center">
                <CalendarSearch className="h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  在 {CALENDAR_YEAR_MIN}–{CALENDAR_YEAR_MAX} 年范围内未找到「{lunarMonth}{lunarDay}」对应的公历日期
                </p>
                <p className="text-xs text-muted-foreground/70">
                  部分农历日期在某些年份可能不存在（如小月无三十）
                </p>
              </div>
            ) : (
              <ul className="grid gap-2 sm:gap-3">
                {results.map((entry) => (
                  <ResultCard
                    key={entry.dateKey}
                    entry={entry}
                    isToday={entry.dateKey === todayKey}
                  />
                ))}
              </ul>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ResultCardProps {
  entry: ReverseLookupResult;
  isToday?: boolean;
}

function ResultCard({ entry, isToday }: ResultCardProps) {
  const monthLabel = `${format(entry.date, "M", { locale: zhCN })}月`;
  const dayLabel = format(entry.date, "d", { locale: zhCN });
  const yearLabel = format(entry.date, "yyyy", { locale: zhCN });
  const weekday = format(entry.date, "EEEE", { locale: zhCN });
  const monthDay = format(entry.date, "M月d日", { locale: zhCN });

  return (
    <li>
      <div
        className={cn(
          "flex flex-col gap-2 rounded-lg border p-3 transition-colors sm:flex-row sm:items-center sm:justify-between sm:p-4",
          isToday
            ? "border-primary/30 bg-primary/5"
            : "bg-card hover:bg-accent/30"
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg border text-center leading-tight",
              isToday
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-muted/50"
            )}
          >
            <span className="text-[10px] font-medium opacity-80">
              {monthLabel}
            </span>
            <span className="text-base font-bold">{dayLabel}</span>
          </div>

          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-semibold text-sm sm:text-base">
                {yearLabel}年{monthDay}
              </span>
              <span className="text-xs text-muted-foreground sm:text-sm">
                {weekday}
              </span>
              {isToday && (
                <Badge variant="default" className="text-[10px] px-1.5 py-0">
                  今天
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground sm:text-sm">
              <span>干支 {entry.ganZhi.year}年·{entry.ganZhi.month}月·{entry.ganZhi.day}日</span>
              {entry.solarTerm && (
                <span className="font-medium text-primary">
                  {entry.solarTerm}
                </span>
              )}
            </div>
          </div>
        </div>

        {entry.festivals.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pl-15 sm:pl-0 sm:justify-end">
            {entry.festivals.map((festival) => (
              <Badge
                key={festival}
                variant="secondary"
                className="text-xs sm:text-sm"
              >
                {festival}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </li>
  );
}
