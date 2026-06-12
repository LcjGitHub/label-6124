"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
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
  formatSolarTermDateTime,
  getSolarTermsForYear,
} from "@/lib/calendar";
import { useDateStore } from "@/store/date-store";
import { cn } from "@/lib/utils";
import { formatDateKey } from "@/lib/calendar";

/**
 * 当年节气时间轴列表
 */
export function SolarTermsTimeline() {
  const router = useRouter();
  const selectedDate = useDateStore((s) => s.selectedDate);
  const setSelectedDateFromString = useDateStore((s) => s.setSelectedDateFromString);
  const year = selectedDate.getFullYear();
  const todayKey = formatDateKey(new Date());
  const selectedKey = formatDateKey(selectedDate);

  const terms = useMemo(() => getSolarTermsForYear(year), [year]);

  const inRange = year >= CALENDAR_YEAR_MIN && year <= CALENDAR_YEAR_MAX;

  const handleTermClick = (dateStr: string) => {
    const result = setSelectedDateFromString(dateStr);
    if (result.valid) {
      router.push("/");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{year} 年节气时间轴</CardTitle>
        <CardDescription>
          共 24 个节气 · Mock 数据
          {!inRange && ` · 超出范围（${CALENDAR_YEAR_MIN}–${CALENDAR_YEAR_MAX}）`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!inRange || terms.length === 0 ? (
          <p className="text-sm text-muted-foreground">暂无该年份节气数据。</p>
        ) : (
          <ol className="relative border-l border-border pl-4 sm:pl-6">
            {terms.map((term, index) => {
              const isToday = term.date === todayKey;
              const isSelected = term.date === selectedKey;
              const isPast =
                term.date < todayKey ||
                (term.date === todayKey && false);

              return (
                <li key={term.name} className="mb-6 last:mb-0">
                  <span
                    className={cn(
                      "absolute -left-1.5 flex h-3 w-3 items-center justify-center rounded-full border-2 bg-background",
                      isSelected
                        ? "border-primary bg-primary"
                        : isToday
                          ? "border-orange-500 bg-orange-500"
                          : "border-muted-foreground/40"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => handleTermClick(term.date)}
                    className={cn(
                      "w-full text-left rounded-lg border p-3 sm:p-4 transition-colors cursor-pointer",
                      isSelected && "border-primary bg-primary/5",
                      isToday && !isSelected && "border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30"
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{term.name}</span>
                      <span className="text-xs text-muted-foreground">
                        第 {index + 1} 节气
                      </span>
                      {isToday && (
                        <Badge variant="outline" className="text-orange-600">
                          今天
                        </Badge>
                      )}
                      {isSelected && !isToday && (
                        <Badge variant="default">已选日期</Badge>
                      )}
                      {isPast && !isToday && !isSelected && (
                        <Badge variant="secondary">已过</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatSolarTermDateTime(term)}
                    </p>
                  </button>
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
