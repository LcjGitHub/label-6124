"use client";

import { Badge } from "@/components/ui/badge";
import { formatGanZhi, formatSolarTermDisplay, type DayEntry } from "@/lib/calendar";

export interface InfoRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

export function InfoRow({ label, value, highlight }: InfoRowProps) {
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

export interface DateInfoContentProps {
  entry: DayEntry;
}

export function DateInfoContent({ entry }: DateInfoContentProps) {
  const solarTermDisplay = formatSolarTermDisplay(entry);
  const ganZhiDisplay = formatGanZhi(entry);

  return (
    <div className="space-y-4">
      <InfoRow label="农历" value={entry.lunar} />
      <InfoRow label="干支" value={ganZhiDisplay} />
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
    </div>
  );
}
