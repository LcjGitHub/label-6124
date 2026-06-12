"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
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
  formatSolarDate,
  type ReverseLookupResult,
} from "@/lib/calendar";
import { format } from "date-fns";
import { CalendarSearch } from "lucide-react";

export function LunarReverseLookup() {
  const [lunarMonth, setLunarMonth] = useState<string>("");
  const [lunarDay, setLunarDay] = useState<string>("");

  const results = useMemo(() => {
    if (!lunarMonth || !lunarDay) return [];
    return reverseLookupLunar(lunarMonth, lunarDay);
  }, [lunarMonth, lunarDay]);

  const bothSelected = !!lunarMonth && !!lunarDay;

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
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
              onChange={(e) => setLunarMonth(e.target.value)}
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
              onChange={(e) => setLunarDay(e.target.value)}
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
        </div>

        {!bothSelected ? (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-8 text-center">
            <CalendarSearch className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              请先选择农历月份与日期
            </p>
            <p className="text-xs text-muted-foreground/70">
              数据范围 {CALENDAR_YEAR_MIN}–{CALENDAR_YEAR_MAX} 年
            </p>
          </div>
        ) : results.length === 0 ? (
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
          <ul className="space-y-3">
            {results.map((entry) => (
              <ResultCard key={entry.dateKey} entry={entry} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

interface ResultCardProps {
  entry: ReverseLookupResult;
}

function ResultCard({ entry }: ResultCardProps) {
  const solarTermDisplay = entry.solarTerm ?? "无";
  const todayKey = format(new Date(), "yyyy-MM-dd");
  const isToday = entry.dateKey === todayKey;

  return (
    <li>
      <Card className={isToday ? "border-primary/30 bg-primary/5" : ""}>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">
              {formatSolarDate(entry.date)}
            </CardTitle>
            {isToday && (
              <Badge variant="default" className="text-[10px] px-1.5 py-0">
                今天
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <InfoRow label="农历" value={entry.lunar} />
          <InfoRow
            label="干支"
            value={`${entry.ganZhi.year}年 · ${entry.ganZhi.month}月 · ${entry.ganZhi.day}日`}
          />
          <InfoRow
            label="当日节气"
            value={solarTermDisplay}
            highlight={!!entry.solarTerm}
          />
          {entry.festivals.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-sm font-medium text-muted-foreground">
                节日标签
              </span>
              <div className="flex flex-wrap gap-2">
                {entry.festivals.map((f) => (
                  <Badge key={f} variant="secondary">
                    {f}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </li>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function InfoRow({ label, value, highlight }: InfoRowProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span
        className={
          highlight
            ? "text-base font-semibold text-primary"
            : "text-base font-medium"
        }
      >
        {value}
      </span>
    </div>
  );
}
