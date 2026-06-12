import { LunarReverseLookup } from "@/components/lunar-reverse-lookup";

export default function LunarReversePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          农历反查
        </h1>
        <p className="mt-1 text-muted-foreground">
          选择农历月份与日期，查找所有对应的公历日期及干支、节气、节日信息
        </p>
      </div>
      <LunarReverseLookup />
    </div>
  );
}
