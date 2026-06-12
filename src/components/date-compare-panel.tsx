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
  formatSolarDate,
  getDayEntry,
  type DayEntry,
} from "@/lib/calendar";
import { zhCN } from "date-fns/locale";

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
          数据范围二零二零–二零三零年
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => d && onDateChange(d)}
          locale={zhCN}
          fromDate={new Date(2020, 0, 1)}
          toDate={new Date(2030, 11, 31)}
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
            该日期不在模拟数据范围内（二零二零–二零三零年）。
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
