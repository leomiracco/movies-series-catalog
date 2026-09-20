"use client";

import Image from "next/image";
import { Star, Film } from "lucide-react";
import { MediaItem } from "@/types/tmdb";

interface Props {
  item: MediaItem;
  type: "movie" | "tv";
  onSelect: (item: MediaItem) => void;
}

export default function MediaCard({ item, onSelect }: Props) {
  const originalTitle = item.original_title || item.original_name;
  const translatedTitle = item.title || item.name;
  const date = item.release_date || item.first_air_date;
  const year = date ? date.split("-")[0] : "S/D";
  const rating = item.vote_average ? item.vote_average.toFixed(1) : "N/A";

  return (
    <div
      onClick={() => onSelect(item)}
      className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow hover:border-amber-500/50 hover:shadow-amber-500/10 cursor-pointer flex flex-col group transition-all"
    >
      <div className="relative aspect-[2/3] w-full bg-neutral-950 overflow-hidden flex items-center justify-center">
        {item.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
            alt={originalTitle || "Poster"}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-neutral-600 gap-2 p-4 text-center">
            <Film className="w-10 h-10 stroke-[1.5]" />
            <span className="text-xs">Sin póster</span>
          </div>
        )}

        <div className="absolute top-2 right-2 bg-neutral-900/80 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-amber-400 flex items-center gap-1 border border-neutral-700">
          <Star className="w-3 h-3 fill-amber-400" />
          {rating}
        </div>
        <div className="absolute top-2 left-2 bg-neutral-900/80 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-neutral-300 uppercase border border-neutral-700">
          {item.original_language}
        </div>
      </div>

      <div className="p-3 flex flex-col flex-grow justify-between">
        <div>
          <h3
            className="font-bold text-sm text-neutral-100 line-clamp-1 group-hover:text-amber-400 transition-colors"
            title={originalTitle}
          >
            {originalTitle}
          </h3>
          {translatedTitle !== originalTitle && (
            <p className="text-xs text-neutral-400 line-clamp-1 italic">{translatedTitle}</p>
          )}
        </div>
        <p className="text-xs text-neutral-500 mt-2 font-medium">{year}</p>
      </div>
    </div>
  );
}