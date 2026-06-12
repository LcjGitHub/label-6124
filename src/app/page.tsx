"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { DatePickerPanel, DayInfoPanel } from "@/components/date-query-panel";
import { TodayOverview } from "@/components/today-overview";
import { useDateStore } from "@/store/date-store";
import { formatDateKey, parseDateInput } from "@/lib/calendar";

/**
 * 首页：公历日期查询
 */
export default function HomePage() {
  const searchParams = useSearchParams();
  const { setSelectedDate, setHighlightedDateKey, hydrated } = useDateStore();

  useEffect(() => {
    if (!hydrated) return;

    const dateParam = searchParams.get("date");
    if (dateParam) {
      const result = parseDateInput(dateParam);
      if (result.valid && result.date) {
        setSelectedDate(result.date);
        const dateKey = formatDateKey(result.date);
        setHighlightedDateKey(dateKey);

        const timer = setTimeout(() => {
          setHighlightedDateKey(null);
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
  }, [searchParams, hydrated, setSelectedDate, setHighlightedDateKey]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          日期查询
        </h1>
        <p className="mt-1 text-muted-foreground">
          选择公历日期，查看农历、干支、节气与节日标签
        </p>
      </div>
      <TodayOverview />
      <div className="grid gap-6 md:grid-cols-2">
        <DatePickerPanel />
        <DayInfoPanel />
      </div>
    </div>
  );
}
