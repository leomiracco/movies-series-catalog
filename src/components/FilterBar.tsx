"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";
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

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [type, setType] = useState(searchParams.get("type") || "movie");
  const [genre, setGenre] = useState(searchParams.get("genre") || "");
  const [year, setYear] = useState(searchParams.get("year") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "vote_average.desc");
  const [query, setQuery] = useState(searchParams.get("query") || "");

  useEffect(() => {
    setType(searchParams.get("type") || "movie");
    setGenre(searchParams.get("genre") || "");
    setYear(searchParams.get("year") || "");
    setSortBy(searchParams.get("sortBy") || "vote_average.desc");
    setQuery(searchParams.get("query") || "");
  }, [searchParams]);

  const genresList = type === "movie" ? MOVIE_GENRES : TV_GENRES;

  const updateFilters = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    Object.entries(newParams).forEach(([key, val]) => {
      if (val && val.trim() !== "") params.set(key, val.trim());
      else params.delete(key);
    });

    router.push(`/?${params.toString()}`);
  };

  // Enviar búsqueda leyendo directamente el input de la pantalla
  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem("searchQuery") as HTMLInputElement;
    const value = input ? input.value : query;
    input?.blur(); // Cierra el teclado del teléfono
    updateFilters({ query: value });
  };

  // Enviar año leyendo directamente el input
  const handleYearSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem("yearInput") as HTMLInputElement;
    const value = input ? input.value : year;
    input?.blur();
    updateFilters({ year: value });
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (val.trim() === "") updateFilters({ query: "" });
  };

  const clearSearch = () => {
    setQuery("");
    updateFilters({ query: "" });
  };

  const handleYearChange = (val: string) => {
    setYear(val);
    if (val.trim() === "") updateFilters({ year: "" });
  };

  const clearYear = () => {
    setYear("");
    updateFilters({ year: "" });
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl shadow-lg mb-8 text-neutral-100 flex flex-col gap-4">
      {/* Buscador de texto con botón táctil Z-20 */}
      <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
        <button
          type="submit"
          className="absolute left-0 top-0 bottom-0 pl-3 pr-2 flex items-center justify-center text-neutral-400 hover:text-amber-400 z-20 cursor-pointer"
          title="Buscar"
        >
          <Search className="w-5 h-5" />
        </button>

        <input
          name="searchQuery"
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="Buscar por nombre..."
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          className="w-full pl-11 pr-10 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-100 focus:outline-none focus:border-amber-500 transition-colors placeholder-neutral-500 relative z-10"
        />

        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-0 top-0 bottom-0 pr-3 pl-2 flex items-center justify-center text-neutral-400 hover:text-white z-20 cursor-pointer"
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
              const newType = e.target.value;
              setType(newType);
              setGenre("");
              updateFilters({ type: newType, genre: "" });
            }}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-amber-500"
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
            onChange={(e) => {
              const val = e.target.value;
              setGenre(val);
              updateFilters({ genre: val });
            }}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-amber-500"
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
          <form onSubmit={handleYearSubmit} className="relative flex items-center w-full">
            <input
              name="yearInput"
              type="number"
              inputMode="numeric"
              enterKeyHint="search"
              placeholder="Ej: 1980, 2022..."
              value={year}
              onChange={(e) => handleYearChange(e.target.value)}
              onBlur={(e) => updateFilters({ year: e.target.value })}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 pr-8 text-sm text-neutral-100 focus:outline-none focus:border-amber-500 placeholder-neutral-500"
            />
            {year && (
              <button
                type="button"
                onClick={clearYear}
                className="absolute right-2 text-neutral-400 hover:text-white p-1 z-20 cursor-pointer"
                title="Limpiar año"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>

        {/* Ordenar */}
        <div>
          <label className="block text-xs text-neutral-400 mb-1">Ordenar por</label>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              updateFilters({ sortBy: e.target.value });
            }}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-amber-500"
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