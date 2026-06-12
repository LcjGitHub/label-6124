"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDateStore } from "@/store/date-store";
import { useFavoritesStore } from "@/store/favorites-store";
import {
  CALENDAR_YEAR_MAX,
  CALENDAR_YEAR_MIN,
  formatDateKey,
  formatSolarDate,
  getDayEntry,
} from "@/lib/calendar";
import { zhCN } from "date-fns/locale";
import { Star, StarOff } from "lucide-react";

/**
 * 公历日期选择器
 */
export function DatePickerPanel() {
  const { selectedDate, setSelectedDate } = useDateStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">选择公历日期</CardTitle>
        <CardDescription>
          数据范围 {CALENDAR_YEAR_MIN}–{CALENDAR_YEAR_MAX} 年
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          locale={zhCN}
          fromDate={new Date(CALENDAR_YEAR_MIN, 0, 1)}
          toDate={new Date(CALENDAR_YEAR_MAX, 11, 31)}
          defaultMonth={selectedDate}
        />
      </CardContent>
    </Card>
  );
}

/**
 * 农历、干支、节气、节日展示卡片
 */
export function DayInfoPanel() {
  const selectedDate = useDateStore((s) => s.selectedDate);
  const entry = getDayEntry(selectedDate);
  const { isFavorite, toggleFavorite, hydrated } = useFavoritesStore();
  const dateKey = formatDateKey(selectedDate);
  const favorited = entry && hydrated ? isFavorite(dateKey) : false;

  if (!entry) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">日期信息</CardTitle>
          <CardDescription>{formatSolarDate(selectedDate)}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            该日期不在 Mock 数据范围内（{CALENDAR_YEAR_MIN}–{CALENDAR_YEAR_MAX}）。
          </p>
        </CardContent>
      </Card>
    );
  }

  const solarTermDisplay = entry.solarTerm ?? "无";

  const handleToggleFavorite = () => {
    if (entry && hydrated) {
      toggleFavorite(selectedDate, entry);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-lg">日期信息</CardTitle>
            <CardDescription>{formatSolarDate(selectedDate)}</CardDescription>
          </div>
          <Button
            variant={favorited ? "default" : "outline"}
            size="sm"
            onClick={handleToggleFavorite}
            disabled={!hydrated}
            className="shrink-0 gap-1.5"
          >
            {!hydrated ? (
              <>
                <div className="h-4 w-4 animate-pulse rounded-full bg-current opacity-50" />
                <span>加载中</span>
              </>
            ) : favorited ? (
              <>
                <Star className="h-4 w-4 fill-current" />
                <span>已收藏</span>
              </>
            ) : (
              <>
                <StarOff className="h-4 w-4" />
                <span>收藏</span>
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <InfoRow label="农历" value={entry.lunar} />
        <InfoRow
          label="干支"
          value={`${entry.ganZhi.year}年 · ${entry.ganZhi.month}月 · ${entry.ganZhi.day}日`}
        />
        <InfoRow label="当日节气" value={solarTermDisplay} highlight={!!entry.solarTerm} />
        {entry.festivals.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">节日标签</span>
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
  );
}

interface InfoRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

/**
 * 信息行展示
 */
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
