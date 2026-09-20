"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star, ExternalLink, X, Film, Globe } from "lucide-react";
import { MediaDetail, MediaItem } from "@/types/tmdb";

interface Props {
  item: MediaItem | null;
  type: "movie" | "tv";
  onClose: () => void;
}

export default function MediaModal({ item, type, onClose }: Props) {
  const [detail, setDetail] = useState<MediaDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!item) return;
    setLoading(true);
    fetch(`/api/details?type=${type}&id=${item.id}`)
      .then((res) => res.json())
      .then((data) => setDetail(data))
      .finally(() => setLoading(false));
  }, [item, type]);

  if (!item) return null;

  const originalTitle = item.original_title || item.original_name;
  const date = item.release_date || item.first_air_date;

  // Extraer el país de origen (en películas viene en production_countries, en series en origin_country)
  const countries = detail?.production_countries?.length
    ? detail.production_countries.map((c) => c.name).join(", ")
    : detail?.origin_country?.length
    ? detail.origin_country.join(", ")
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full p-6 text-neutral-100 shadow-2xl overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="relative w-40 aspect-[2/3] flex-shrink-0 mx-auto rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950 flex items-center justify-center">
            {item.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={originalTitle || ""}
                fill
                sizes="160px"
                className="object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-neutral-600 gap-2 p-2 text-center">
                <Film className="w-8 h-8 stroke-[1.5]" />
                <span className="text-xs">Sin póster</span>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between flex-grow">
            <div>
              {/* Etiquetas: Idioma y País de Origen */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
                  Idioma: {item.original_language}
                </span>

                {loading ? (
                  <span className="text-xs text-neutral-500">Cargando país...</span>
                ) : countries ? (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-amber-400" />
                    {countries}
                  </span>
                ) : null}
              </div>

              <h2 className="text-2xl font-black text-white">{originalTitle}</h2>
              <p className="text-sm text-neutral-400 mb-3">{date}</p>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {item.vote_average.toFixed(1)} / 10
                </div>
                <span className="text-xs text-neutral-500">
                  ({item.vote_count} votos en TMDb)
                </span>
              </div>

              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Sinopsis
              </h4>
              <p className="text-sm text-neutral-300 leading-relaxed max-h-44 overflow-y-auto pr-1">
                {loading
                  ? "Cargando sinopsis..."
                  : detail?.overview || item.overview || "Sinopsis no disponible."}
              </p>
            </div>

            {/* Enlace a IMDb */}
            <div className="mt-6 pt-4 border-t border-neutral-800 flex justify-between items-center">
              {detail?.imdb_id ? (
                <a
                  href={`https://www.imdb.com/title/${detail.imdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#F5C518] hover:bg-[#e2b616] text-black font-bold px-4 py-2 rounded-lg text-sm transition-all"
                >
                  Ver en IMDb
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <span className="text-xs text-neutral-500">
                  {loading ? "Buscando IMDb ID..." : "No disponible en IMDb"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}