import { SolarTermsTimeline } from "@/components/solar-terms-timeline";

/**
 * 当年节气时间轴页面
 */
export default function SolarTermsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          节气时间轴
        </h1>
        <p className="mt-1 text-muted-foreground">
          展示当前选中年份的 24 节气时间列表（可在首页切换日期以变更年份）
        </p>
      </div>
      <SolarTermsTimeline />
    </div>
  );
}
