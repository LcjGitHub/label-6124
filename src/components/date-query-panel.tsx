"use client";

import { useState, KeyboardEvent, useEffect, useRef, useMemo } from "react";
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
  DateValidationResult,
  formatDateKey,
  formatDateSummary,
  formatSolarDate,
  getDayEntry,
  getSolarTermsForMonth,
} from "@/lib/calendar";
import { zhCN } from "date-fns/locale";
import { Star, StarOff, ArrowRight, Copy, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

function DateInputForm() {
  const { selectedDate, setSelectedDateFromString } = useDateStore();
  const [yearInput, setYearInput] = useState("");
  const [monthInput, setMonthInput] = useState("");
  const [dayInput, setDayInput] = useState("");
  const [validation, setValidation] = useState<DateValidationResult | null>(
    null,
  );
  const isEditingRef = useRef(false);

  useEffect(() => {
    if (!isEditingRef.current) {
      const y = String(selectedDate.getFullYear());
      const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const d = String(selectedDate.getDate()).padStart(2, "0");
      setYearInput(y);
      setMonthInput(m);
      setDayInput(d);
    }
  }, [selectedDate]);

  const clearValidation = () => {
    if (validation !== null) {
      setValidation(null);
    }
  };

  const handleJump = () => {
    const y = yearInput.trim();
    const m = monthInput.trim();
    const d = dayInput.trim();

    if (!y || !m || !d) {
      setValidation({ valid: false, error: "请填写完整的年、月、日" });
      return;
    }

    const input = `${y}-${m}-${d}`;
    const result = setSelectedDateFromString(input);
    setValidation(result);
    isEditingRef.current = false;
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleJump();
    }
  };

  const handleYearChange = (val: string) => {
    isEditingRef.current = true;
    clearValidation();
    setYearInput(val.replace(/\D/g, ""));
  };

  const handleMonthChange = (val: string) => {
    isEditingRef.current = true;
    clearValidation();
    setMonthInput(val.replace(/\D/g, ""));
  };

  const handleDayChange = (val: string) => {
    isEditingRef.current = true;
    clearValidation();
    setDayInput(val.replace(/\D/g, ""));
  };

  const inputBaseClass =
    "h-10 rounded-md border border-input bg-background px-3 text-sm " +
    "ring-offset-background placeholder:text-muted-foreground " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
    "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-2">
        <div className="flex-1 space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">年</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="请输入年份"
            maxLength={4}
            value={yearInput}
            onChange={(e) => handleYearChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(inputBaseClass, "w-full")}
          />
        </div>
        <div className="w-14 space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">月</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="月"
            maxLength={2}
            value={monthInput}
            onChange={(e) => handleMonthChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(inputBaseClass, "w-full")}
          />
        </div>
        <div className="w-14 space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">日</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="日"
            maxLength={2}
            value={dayInput}
            onChange={(e) => handleDayChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(inputBaseClass, "w-full")}
          />
        </div>
        <Button onClick={handleJump} size="sm" className="shrink-0 gap-1">
          <ArrowRight className="h-4 w-4" />
          跳转
        </Button>
      </div>
      {validation && !validation.valid && validation.error && (
        <p className="text-xs font-medium text-destructive">{validation.error}</p>
      )}
      {validation && validation.valid && (
        <p className="text-xs font-medium text-primary">跳转成功</p>
      )}
    </div>
  );
}

/**
 * 公历日期选择器
 */
export function DatePickerPanel() {
  const { selectedDate, setSelectedDate, hydrated } = useDateStore();
  const [month, setMonth] = useState<Date>(selectedDate);

  useEffect(() => {
    setMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  }, [selectedDate]);

  const solarTermDates = useMemo(
    () => getSolarTermsForMonth(month.getFullYear(), month.getMonth() + 1),
    [month],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">选择公历日期</CardTitle>
        <CardDescription>
          数据范围 {CALENDAR_YEAR_MIN}–{CALENDAR_YEAR_MAX} 年
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!hydrated ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span>加载中...</span>
            </div>
          </div>
        ) : (
          <>
            <DateInputForm />
            <div className="flex justify-center border-t pt-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                month={month}
                onMonthChange={setMonth}
                locale={zhCN}
                fromDate={new Date(CALENDAR_YEAR_MIN, 0, 1)}
                toDate={new Date(CALENDAR_YEAR_MAX, 11, 31)}
                modifiers={{ solarTerm: solarTermDates }}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

type CopyStatus = "idle" | "success" | "error";

/**
 * 农历、干支、节气、节日展示卡片
 */
export function DayInfoPanel() {
  const selectedDate = useDateStore((s) => s.selectedDate);
  const dateHydrated = useDateStore((s) => s.hydrated);
  const entry = getDayEntry(selectedDate);
  const { isFavorite, toggleFavorite, hydrated: favoritesHydrated } = useFavoritesStore();
  const dateKey = formatDateKey(selectedDate);
  const favorited = entry && dateHydrated && favoritesHydrated ? isFavorite(dateKey) : false;
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const solarTermDisplay = entry?.solarTerm ?? "无";

  const handleToggleFavorite = () => {
    if (entry && favoritesHydrated) {
      toggleFavorite(selectedDate, entry);
    }
  };

  const handleCopy = async () => {
    if (!entry) return;

    try {
      const summary = formatDateSummary(selectedDate, entry);
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

  if (!dateHydrated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">日期信息</CardTitle>
          <CardDescription>正在恢复日期...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span>加载中...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
            disabled={!favoritesHydrated}
            className="shrink-0 gap-1.5"
          >
            {!favoritesHydrated ? (
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
                  一键复制日期摘要
                </span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
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
