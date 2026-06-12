import { DatePickerPanel, DayInfoPanel } from "@/components/date-query-panel";

/**
 * 首页：公历日期查询
 */
export default function HomePage() {
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
      <div className="grid gap-6 md:grid-cols-2">
        <DatePickerPanel />
        <DayInfoPanel />
      </div>
    </div>
  );
}
