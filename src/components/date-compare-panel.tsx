"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
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
  getDayEntry,
  type DayEntry,
} from "@/lib/calendar";
import { zhCN } from "date-fns/locale";
import { ArrowLeftRight } from "lucide-react";

interface DateCompareSideProps {
  title: string;
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

function DateCompareSide({ title, date, onDateChange }: DateCompareSideProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>
          数据范围 {CALENDAR_YEAR_MIN}–{CALENDAR_YEAR_MAX} 年
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          locale={zhCN}
          fromDate={new Date(CALENDAR_YEAR_MIN, 0, 1)}
          toDate={new Date(CALENDAR_YEAR_MAX, 11, 31)}
          defaultMonth={date}
        />
      </CardContent>
    </Card>
  );
}

interface InfoDisplayProps {
  title: string;
  date: Date | undefined;
}

function InfoDisplay({ title, date }: InfoDisplayProps) {
  if (!date) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>请选择日期</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">请在上方选择一个公历日期</p>
        </CardContent>
      </Card>
    );
  }

  const entry: DayEntry | null = getDayEntry(date);

  if (!entry) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{formatSolarDate(date)}</CardDescription>
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{formatSolarDate(date)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
        {entry.festivals.length > 0 ? (
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
        ) : (
          <div className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">节日标签</span>
            <p className="text-base font-medium text-muted-foreground">无</p>
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

export function DateComparePanel() {
  const [leftDate, setLeftDate] = useState<Date | undefined>(new Date());
  const [rightDate, setRightDate] = useState<Date | undefined>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d;
  });

  const handleSwap = () => {
    const temp = leftDate;
    setLeftDate(rightDate);
    setRightDate(temp);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <DateCompareSide
          title="日期 A"
          date={leftDate}
          onDateChange={setLeftDate}
        />
        <DateCompareSide
          title="日期 B"
          date={rightDate}
          onDateChange={setRightDate}
        />
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleSwap}
          className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowLeftRight className="h-4 w-4" />
          交换日期
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <InfoDisplay title="日期 A 信息" date={leftDate} />
        <InfoDisplay title="日期 B 信息" date={rightDate} />
      </div>
    </div>
  );
}
