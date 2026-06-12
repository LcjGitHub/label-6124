import { FestivalList } from "@/components/festival-list";

/**
 * 节日一览页面
 */
export default function FestivalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          节日一览
        </h1>
        <p className="mt-1 text-muted-foreground">
          按年份查看全部带节日标签的日期，含公历、农历与节日名称
        </p>
      </div>
      <FestivalList />
    </div>
  );
}
