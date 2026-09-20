"use client";

import { useState } from "react";
import { MediaItem } from "@/types/tmdb";
import MediaCard from "./MediaCard";
import MediaModal from "./MediaModal";

interface Props {
  items: MediaItem[];
  type: "movie" | "tv";
}

export default function MediaCardGrid({ items, type }: Props) {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-20 text-neutral-500 text-sm">
        No se encontraron títulos con estos filtros.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((item, index) => (
          <MediaCard
            key={`${item.id}-${index}`}
            item={item}
            type={type}
            onSelect={(selected) => setSelectedItem(selected)}
          />
        ))}
      </div>

      <MediaModal
        item={selectedItem}
        type={type}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
}