"use client";

import { useMemo, useState, useEffect, useRef } from "react";
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
  formatDateSummary,
  formatSolarDate,
  formatSolarTermDateTime,
  getDayEntry,
  getNextSolarTerm,
  getTodayOverview,
  SolarTermEntry,
} from "@/lib/calendar";
import { Copy, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type CopyStatus = "idle" | "success" | "error";

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
  const today = useMemo(() => new Date(), []);
  const overview = useMemo(() => getTodayOverview(), []);
  const nextTerm = useMemo(() => getNextSolarTerm(), []);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const inRange =
    today.getFullYear() >= CALENDAR_YEAR_MIN &&
    today.getFullYear() <= CALENDAR_YEAR_MAX;

  const dayEntry = useMemo(() => {
    if (!inRange) return null;
    return getDayEntry(today);
  }, [inRange, today]);

  const handleCopy = async () => {
    if (!dayEntry) return;

    try {
      const summary = formatDateSummary(today, dayEntry);
      await navigator.clipboard.writeText(summary);
      setCopyStatus("success");
    } catch (e) {
      setCopyStatus("error");
    }

    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = setTimeout(() => {
      setCopyStatus("idle");
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

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
        <div className="border-t pt-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {copyStatus === "success" && (
                <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                  <Check className="h-4 w-4" />
                  复制成功
                </span>
              )}
              {copyStatus === "error" && (
                <span className="flex items-center gap-1 text-sm font-medium text-destructive">
                  <X className="h-4 w-4" />
                  复制失败
                </span>
              )}
              {copyStatus === "idle" && (
                <span className="text-sm text-muted-foreground">
                  一键复制今日摘要
                </span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!dayEntry}
              className="shrink-0 gap-1.5"
            >
              {copyStatus === "success" ? (
                <Check className="h-4 w-4" />
              ) : copyStatus === "error" ? (
                <X className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copyStatus === "idle" ? "复制" : copyStatus === "success" ? "已复制" : "重试"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
