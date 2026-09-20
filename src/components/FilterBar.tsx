"use client";

import { FormEvent } from "react";
import { Search, X } from "lucide-react";

const MOVIE_GENRES = [
  { id: 28, name: "Acción" },
  { id: 12, name: "Aventura" },
  { id: 16, name: "Animación" },
  { id: 35, name: "Comedia" },
  { id: 80, name: "Crimen" },
  { id: 99, name: "Documental" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Familia" },
  { id: 14, name: "Fantasía" },
  { id: 36, name: "Historia" },
  { id: 27, name: "Terror" },
  { id: 10402, name: "Música" },
  { id: 9648, name: "Misterio" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Ciencia ficción" },
  { id: 53, name: "Suspenso" },
  { id: 10752, name: "Bélica" },
  { id: 37, name: "Western" },
];

const TV_GENRES = [
  { id: 10759, name: "Acción & Aventura" },
  { id: 16, name: "Animación" },
  { id: 35, name: "Comedia" },
  { id: 80, name: "Crimen" },
  { id: 99, name: "Documental" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Familia" },
  { id: 10762, name: "Infantil" },
  { id: 9648, name: "Misterio" },
  { id: 10764, name: "Reality" },
  { id: 10765, name: "Ciencia ficción & Fantasía" },
  { id: 10766, name: "Telenovela" },
  { id: 10768, name: "Guerra & Política" },
  { id: 37, name: "Western" },
];

interface FilterBarProps {
  query: string;
  setQuery: (val: string) => void;
  onSearchSubmit: () => void;
  type: "movie" | "tv";
  setType: (val: "movie" | "tv") => void;
  genre: string;
  setGenre: (val: string) => void;
  year: string;
  setYear: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
}

export default function FilterBar({
  query,
  setQuery,
  onSearchSubmit,
  type,
  setType,
  genre,
  setGenre,
  year,
  setYear,
  sortBy,
  setSortBy,
}: FilterBarProps) {
  const genresList = type === "movie" ? MOVIE_GENRES : TV_GENRES;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    onSearchSubmit();
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl shadow-lg mb-8 text-neutral-100 flex flex-col gap-4">
      {/* Buscador de texto */}
      <form onSubmit={handleSubmit} className="relative flex items-center w-full">
        <button
          type="button"
          onClick={handleSubmit}
          className="absolute left-0 top-0 bottom-0 pl-3 pr-2 flex items-center justify-center text-neutral-400 hover:text-amber-400 z-10 cursor-pointer"
          title="Buscar ahora"
        >
          <Search className="w-5 h-5" />
        </button>

        <input
          type="text"
          placeholder="Buscar por nombre (busca solo o presiona Enter/Lupa)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-11 pr-10 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-100 focus:outline-none focus:border-amber-500 transition-colors placeholder-neutral-500"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-0 top-0 bottom-0 pr-3 pl-2 flex items-center justify-center text-neutral-400 hover:text-white z-10 cursor-pointer"
            title="Limpiar búsqueda"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* 4 Controles de filtro */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Catálogo */}
        <div>
          <label className="block text-xs text-neutral-400 mb-1">Catálogo</label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value as "movie" | "tv");
              setGenre("");
            }}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="movie">Películas</option>
            <option value="tv">Series de TV</option>
          </select>
        </div>

        {/* Género */}
        <div>
          <label className="block text-xs text-neutral-400 mb-1">Género</label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="">Todos los géneros</option>
            {genresList.map((g) => (
              <option key={g.id} value={g.id.toString()}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* Año */}
        <div>
          <label className="block text-xs text-neutral-400 mb-1">Año</label>
          <div className="relative flex items-center w-full">
            <input
              type="number"
              placeholder="Ej: 1980, 2022..."
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 pr-8 text-sm text-neutral-100 focus:outline-none focus:border-amber-500 placeholder-neutral-500"
            />
            {year && (
              <button
                type="button"
                onClick={() => setYear("")}
                className="absolute right-2 text-neutral-400 hover:text-white p-1 z-10 cursor-pointer"
                title="Limpiar año"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Ordenar */}
        <div>
          <label className="block text-xs text-neutral-400 mb-1">Ordenar por</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="vote_average.desc">Mayor Rating</option>
            <option value="vote_average.asc">Menor Rating</option>
            <option value="primary_release_date.desc">Más Recientes</option>
            <option value="primary_release_date.asc">Más Antiguas</option>
          </select>
        </div>
      </div>
    </div>
  );
}