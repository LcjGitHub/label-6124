"use client";

import { FavoriteItemCard } from "@/components/favorite-item";
import { useFavoritesStore } from "@/store/favorites-store";
import { Star } from "lucide-react";

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavoritesStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          我的收藏
        </h1>
        <p className="mt-1 text-muted-foreground">
          收藏的日期会保存在本地浏览器中，共 {favorites.length} 条
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <Star className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg font-medium text-muted-foreground">
            还没有收藏任何日期
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            在日期查询页面点击收藏按钮，即可将日期添加到这里
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {favorites.map((item) => (
            <FavoriteItemCard
              key={item.dateKey}
              item={item}
              onRemove={removeFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
