import { DateComparePanel } from "@/components/date-compare-panel";

export default function DateComparePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          日期对比
        </h1>
        <p className="mt-1 text-muted-foreground">
          选择两个公历日期，并排对比农历、干支、节气与节日标签
        </p>
      </div>
      <DateComparePanel />
    </div>
  );
}
