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
import {
  CALENDAR_YEAR_MAX,
  CALENDAR_YEAR_MIN,
  formatSolarDate,
  getDayEntry,
  type DayEntry,
} from "@/lib/calendar";
import { zhCN } from "date-fns/locale";
import { DateInfoContent } from "@/components/date-info-display";

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
          onSelect={(d) => d && onDateChange(d)}
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
          <p className="text-sm text-muted-foreground">请选择一个公历日期</p>
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
            该日期不在模拟数据范围内（{CALENDAR_YEAR_MIN}–{CALENDAR_YEAR_MAX} 年）。
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{formatSolarDate(date)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <DateInfoContent entry={entry} />
      </CardContent>
    </Card>
  );
}

export function DateComparePanel() {
  const [leftDate, setLeftDate] = useState<Date | undefined>(undefined);
  const [rightDate, setRightDate] = useState<Date | undefined>(undefined);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <DateCompareSide
          title="左侧日期"
          date={leftDate}
          onDateChange={setLeftDate}
        />
        <DateCompareSide
          title="右侧日期"
          date={rightDate}
          onDateChange={setRightDate}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <InfoDisplay title="左侧信息" date={leftDate} />
        <InfoDisplay title="右侧信息" date={rightDate} />
      </div>
    </div>
  );
}
