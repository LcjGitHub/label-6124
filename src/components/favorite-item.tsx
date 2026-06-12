"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FavoriteItem } from "@/store/favorites-store";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

interface FavoriteItemCardProps {
  item: FavoriteItem;
  onRemove: (dateKey: string) => void;
}

export function FavoriteItemCard({ item, onRemove }: FavoriteItemCardProps) {
  const [year, month, day] = item.dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const solarDateStr = format(date, "yyyy年M月d日 EEEE", { locale: zhCN });

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base font-semibold">{solarDateStr}</span>
              {item.solarTerm && (
                <Badge variant="default" className="shrink-0">
                  {item.solarTerm}
                </Badge>
              )}
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">农历：</span>
                <span className="text-foreground">{item.lunar}</span>
              </div>
              <div>
                <span className="font-medium">干支：</span>
                <span className="text-foreground">
                  {item.ganZhi.year}年 · {item.ganZhi.month}月 · {item.ganZhi.day}日
                </span>
              </div>
              <div>
                <span className="font-medium">节气：</span>
                <span className={item.solarTerm ? "text-foreground font-medium text-primary" : "text-foreground"}>
                  {item.solarTerm ?? "无"}
                </span>
              </div>
              {item.festivals.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="font-medium">节日：</span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.festivals.map((f) => (
                      <Badge key={f} variant="secondary" className="text-xs">
                        {f}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(item.dateKey)}
            className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            title="取消收藏"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
