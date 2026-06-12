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
  CALENDAR_YEAR_MAX,
  CALENDAR_YEAR_MIN,
  getFestivalsForYear,
  type FestivalEntry,
} from "@/lib/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Calendar } from "lucide-react";

interface FestivalListProps {
  initialYear?: number;
}

/**
 * 节日一览列表组件
 * 顶部提供年份下拉选择，下方以卡片列表展示全部带节日的日期
 */
export function FestivalList({ initialYear }: FestivalListProps) {
  const currentYear = new Date().getFullYear();
  const defaultYear =
    initialYear ??
    (currentYear >= CALENDAR_YEAR_MIN && currentYear <= CALENDAR_YEAR_MAX
      ? currentYear
      : CALENDAR_YEAR_MIN);

  const [year, setYear] = useState<number>(defaultYear);

  const festivals = useMemo(() => getFestivalsForYear(year), [year]);

  const yearOptions = useMemo(() => {
    const options: number[] = [];
    for (let y = CALENDAR_YEAR_MIN; y <= CALENDAR_YEAR_MAX; y++) {
      options.push(y);
    }
    return options;
  }, []);

  const todayKey = format(new Date(), "yyyy-MM-dd");

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg">{year} 年节日一览</CardTitle>
            <CardDescription>
              共 {festivals.length} 个带节日标签的日期 · 数据范围{" "}
              {CALENDAR_YEAR_MIN}–{CALENDAR_YEAR_MAX} 年
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <label
              htmlFor="festival-year-select"
              className="text-sm font-medium text-muted-foreground"
            >
              年份
            </label>
            <select
              id="festival-year-select"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y} 年
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {festivals.length === 0 ? (
          <p className="text-sm text-muted-foreground">该年份暂无节日数据。</p>
        ) : (
          <ul className="grid gap-2 sm:gap-3">
            {festivals.map((entry) => (
              <FestivalCard
                key={entry.dateKey}
                entry={entry}
                isToday={entry.dateKey === todayKey}
              />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

interface FestivalCardProps {
  entry: FestivalEntry;
  isToday?: boolean;
}

/**
 * 单条节日卡片
 */
function FestivalCard({ entry, isToday }: FestivalCardProps) {
  const monthLabel = `${format(entry.date, "M", { locale: zhCN })}月`;
  const dayLabel = format(entry.date, "d", { locale: zhCN });
  const monthDay = format(entry.date, "M月d日", { locale: zhCN });
  const weekday = format(entry.date, "EEEE", { locale: zhCN });

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
                {monthDay}
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
            <div className="flex items-center gap-1 text-xs text-muted-foreground sm:text-sm">
              <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>农历 {entry.lunar}</span>
            </div>
          </div>
        </div>

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
      </div>
    </li>
  );
}
