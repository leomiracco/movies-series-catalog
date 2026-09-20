"use client";

import Form from "next/form";
import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();

  const currentType = searchParams.get("type") || "movie";
  const currentGenre = searchParams.get("genre") || "";
  const currentYear = searchParams.get("year") || "";
  const currentSortBy = searchParams.get("sortBy") || "vote_average.desc";
  const currentQuery = searchParams.get("query") || "";

  const genresList = currentType === "movie" ? MOVIE_GENRES : TV_GENRES;

  return (
    <Form
      action="/"
      className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl shadow-lg mb-8 text-neutral-100 flex flex-col gap-4"
    >
      {/* Buscador de texto con next/form nativo */}
      <div className="relative flex items-center w-full">
        <button
          type="submit"
          className="absolute left-0 top-0 bottom-0 pl-3 pr-2 flex items-center justify-center text-neutral-400 hover:text-amber-400 z-10 cursor-pointer"
          title="Buscar"
        >
          <Search className="w-5 h-5" />
        </button>

        <input
          name="query"
          type="text"
          placeholder="Buscar por nombre..."
          defaultValue={currentQuery}
          key={currentQuery}
          className="w-full pl-11 pr-10 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-100 focus:outline-none focus:border-amber-500 transition-colors placeholder-neutral-500"
        />

        {currentQuery && (
          <a
            href={`/?type=${currentType}&genre=${currentGenre}&year=${currentYear}&sortBy=${currentSortBy}`}
            className="absolute right-0 top-0 bottom-0 pr-3 pl-2 flex items-center justify-center text-neutral-400 hover:text-white z-10 cursor-pointer"
            title="Limpiar búsqueda"
          >
            <X className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* 4 Controles de filtro */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Catálogo */}
        <div>
          <label className="block text-xs text-neutral-400 mb-1">Catálogo</label>
          <select
            name="type"
            defaultValue={currentType}
            key={`type-${currentType}`}
            onChange={(e) => {
              const form = e.currentTarget.form;
              if (form) {
                const genreSelect = form.elements.namedItem("genre") as HTMLSelectElement;
                if (genreSelect) genreSelect.value = "";
                form.requestSubmit();
              }
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
            name="genre"
            defaultValue={currentGenre}
            key={`genre-${currentGenre}`}
            onChange={(e) => e.currentTarget.form?.requestSubmit()}
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
          <div className="relative flex items-center w-full">
            <input
              name="year"
              type="number"
              placeholder="Ej: 1980, 2022..."
              defaultValue={currentYear}
              key={`year-${currentYear}`}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 pr-8 text-sm text-neutral-100 focus:outline-none focus:border-amber-500 placeholder-neutral-500"
            />
            {currentYear && (
              <a
                href={`/?type=${currentType}&genre=${currentGenre}&sortBy=${currentSortBy}&query=${currentQuery}`}
                className="absolute right-2 text-neutral-400 hover:text-white p-1 z-10 cursor-pointer"
                title="Limpiar año"
              >
                <X className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Ordenar */}
        <div>
          <label className="block text-xs text-neutral-400 mb-1">Ordenar por</label>
          <select
            name="sortBy"
            defaultValue={currentSortBy}
            key={`sort-${currentSortBy}`}
            onChange={(e) => e.currentTarget.form?.requestSubmit()}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-amber-500"
          >
            <option value="vote_average.desc">Mayor Rating</option>
            <option value="vote_average.asc">Menor Rating</option>
            <option value="primary_release_date.desc">Más Recientes</option>
            <option value="primary_release_date.asc">Más Antiguas</option>
          </select>
        </div>
      </div>
    </Form>
  );
}