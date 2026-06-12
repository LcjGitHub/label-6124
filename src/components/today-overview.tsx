"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CALENDAR_YEAR_MAX,
  CALENDAR_YEAR_MIN,
  formatDateKey,
  formatSolarDate,
  formatSolarTermDateTime,
  getDayEntry,
  getNextSolarTerm,
  getTodayOverview,
  SolarTermEntry,
} from "@/lib/calendar";
import { useFavoritesStore } from "@/store/favorites-store";
import { cn } from "@/lib/utils";
import { Star, StarOff } from "lucide-react";

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

export function TodayOverview() {
  const overview = useMemo(() => getTodayOverview(), []);
  const nextTerm = useMemo(() => getNextSolarTerm(), []);
  const todayEntry = useMemo(() => getDayEntry(new Date()), []);
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  const today = new Date();
  const dateKey = formatDateKey(today);
  const favorited = todayEntry ? isFavorite(dateKey) : false;

  const inRange =
    today.getFullYear() >= CALENDAR_YEAR_MIN &&
    today.getFullYear() <= CALENDAR_YEAR_MAX;

  const handleToggleFavorite = () => {
    if (todayEntry) {
      toggleFavorite(today, todayEntry);
    }
  };

  if (!overview || !inRange) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">今日概览</CardTitle>
          <CardDescription>{formatSolarDate(today)}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            今日不在数据支持范围内（{CALENDAR_YEAR_MIN}–{CALENDAR_YEAR_MAX} 年）。
          </p>
        </CardContent>
      </Card>
    );
  }

  const solarTermDisplay = overview.solarTerm ?? "无";
  const nextTermDisplay = nextTerm
    ? nextTerm.daysLeft === 0
      ? `今天是「${nextTerm.name}」`
      : `距离「${nextTerm.name}」还有 ${nextTerm.daysLeft} 天`
    : "当年已无更多节气";

  const nextTermDateTimeDisplay = nextTerm
    ? formatSolarTermDateTime(nextTerm as unknown as SolarTermEntry)
    : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-lg">今日概览</CardTitle>
            <CardDescription>{formatSolarDate(overview.date)}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {overview.solarTerm && (
              <Badge variant="default" className="shrink-0">
                {overview.solarTerm}
              </Badge>
            )}
            <Button
              variant={favorited ? "default" : "outline"}
              size="sm"
              onClick={handleToggleFavorite}
              className="shrink-0 gap-1.5"
            >
              {favorited ? (
                <>
                  <Star className="h-4 w-4 fill-current" />
                  <span className="hidden sm:inline">已收藏</span>
                </>
              ) : (
                <>
                  <StarOff className="h-4 w-4" />
                  <span className="hidden sm:inline">收藏</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <InfoRow label="农历" value={overview.lunar} />
        <InfoRow
          label="干支"
          value={`${overview.ganZhiYear}年 · ${overview.ganZhiMonth}月 · ${overview.ganZhiDay}日`}
        />
        <InfoRow
          label="当日节气"
          value={solarTermDisplay}
          highlight={!!overview.solarTerm}
        />
        <div
          className={cn(
            "rounded-lg border p-3",
            nextTerm && nextTerm.daysLeft === 0
              ? "border-primary bg-primary/5"
              : "bg-muted/30"
          )}
        >
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              下一节气
            </span>
            <div className="flex flex-col items-start gap-1 sm:items-end">
              <span
                className={cn(
                  "text-base font-semibold",
                  nextTerm && nextTerm.daysLeft === 0
                    ? "text-primary"
                    : "text-foreground"
                )}
              >
                {nextTermDisplay}
              </span>
              {nextTermDateTimeDisplay && (
                <span className="text-sm text-muted-foreground">
                  {nextTermDateTimeDisplay}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
