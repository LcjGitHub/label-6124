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
import {
  CALENDAR_YEAR_MAX,
  CALENDAR_YEAR_MIN,
  formatSolarDate,
  getNextSolarTerm,
  getTodayOverview,
} from "@/lib/calendar";
import { cn } from "@/lib/utils";

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

  const today = new Date();
  const inRange =
    today.getFullYear() >= CALENDAR_YEAR_MIN &&
    today.getFullYear() <= CALENDAR_YEAR_MAX;

  if (!overview || !inRange) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">今日概览</CardTitle>
          <CardDescription>{formatSolarDate(today)}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            今日不在 Mock 数据范围内（{CALENDAR_YEAR_MIN}–{CALENDAR_YEAR_MAX}）。
          </p>
        </CardContent>
      </Card>
    );
  }

  const solarTermDisplay = overview.solarTerm ?? "无节气";
  const nextTermDisplay = nextTerm
    ? nextTerm.daysLeft === 0
      ? `今天是「${nextTerm.name}」`
      : `距离「${nextTerm.name}」还有 ${nextTerm.daysLeft} 天`
    : "暂无下一节气数据";

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-lg">今日概览</CardTitle>
            <CardDescription>{formatSolarDate(overview.date)}</CardDescription>
          </div>
          {overview.solarTerm && (
            <Badge variant="default" className="shrink-0">
              {overview.solarTerm}
            </Badge>
          )}
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
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              下一节气
            </span>
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
