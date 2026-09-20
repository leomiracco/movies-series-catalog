"use client";

import { useState, useEffect, useCallback } from "react";
import FilterBar from "@/components/FilterBar";
import MediaCardGrid from "@/components/MediaCardGrid";
import Pagination from "@/components/Pagination";
import { MediaItem, TMDBResponse } from "@/types/tmdb";
import { Loader2 } from "lucide-react";

// ============================================================================
// INTERRUPTORES DE BÚSQUEDA EN TIEMPO REAL:
// false = Solo busca al presionar Enter (o tocar la lupa).
// true  = Busca automáticamente a medida que vas escribiendo.
// ============================================================================
const ENABLE_LIVE_SEARCH = false;      // Para el buscador por nombre
const ENABLE_LIVE_YEAR_SEARCH = false; // Para el buscador por año

export default function HomePage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de los filtros
  const [type, setType] = useState<"movie" | "tv">("movie");
  const [genre, setGenre] = useState("");
  const [sortBy, setSortBy] = useState("vote_average.desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Texto del nombre
  const [queryInput, setQueryInput] = useState("");
  const [activeQuery, setActiveQuery] = useState("");

  // Texto del año
  const [yearInput, setYearInput] = useState("");
  const [activeYear, setActiveYear] = useState("");

  // Búsqueda en vivo de Nombre (controlada por su switch)
  useEffect(() => {
    if (!ENABLE_LIVE_SEARCH) {
      if (queryInput === "" && activeQuery !== "") {
        setActiveQuery("");
        setPage(1);
      }
      return;
    }

    const timer = setTimeout(() => {
      setActiveQuery(queryInput);
      setPage(1);
    }, 450);
    return () => clearTimeout(timer);
  }, [queryInput, activeQuery]);

  // Búsqueda en vivo de Año (controlada por su switch)
  useEffect(() => {
    if (!ENABLE_LIVE_YEAR_SEARCH) {
      if (yearInput === "" && activeYear !== "") {
        setActiveYear("");
        setPage(1);
      }
      return;
    }

    const timer = setTimeout(() => {
      setActiveYear(yearInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [yearInput, activeYear]);

  // Búsqueda inmediata de Nombre (Enter o Lupa)
  const handleImmediateSearch = () => {
    setActiveQuery(queryInput);
    setPage(1);
  };

  // Búsqueda inmediata de Año (Enter en casilla de año)
  const handleImmediateYearSearch = () => {
    setActiveYear(yearInput);
    setPage(1);
  };

  // Función para consultar la API interna
  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type,
        page: page.toString(),
        sortBy,
      });

      if (activeQuery.trim() !== "") params.set("query", activeQuery.trim());
      if (genre) params.set("genre", genre);
      if (activeYear.trim() !== "") params.set("year", activeYear.trim());

      const res = await fetch(`/api/catalog?${params.toString()}`);
      if (res.ok) {
        const data: TMDBResponse = await res.json();
        setItems(data.results || []);
        setTotalPages(data.total_pages || 1);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error("Error al cargar catálogo:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [type, page, sortBy, activeQuery, genre, activeYear]);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  return (
    <main className="min-h-screen bg-black text-neutral-100 p-4 sm:p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mb-2">
          Catálogo Cinematográfico
        </h1>
        <p className="text-neutral-400 text-sm">
          Explora películas y series de todos los tiempos con sus títulos de origen originales.
        </p>
      </header>

      <FilterBar
        query={queryInput}
        setQuery={setQueryInput}
        onSearchSubmit={handleImmediateSearch}
        type={type}
        setType={(t) => {
          setType(t);
          setPage(1);
        }}
        genre={genre}
        setGenre={(g) => {
          setGenre(g);
          setPage(1);
        }}
        year={yearInput}
        setYear={setYearInput}
        onYearSubmit={handleImmediateYearSearch}
        sortBy={sortBy}
        setSortBy={(s) => {
          setSortBy(s);
          setPage(1);
        }}
      />

      {/* Indicador de carga animado */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-amber-500 gap-3">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="text-sm text-neutral-400 font-medium">Buscando en el catálogo...</p>
        </div>
      ) : (
        <>
          <MediaCardGrid items={items} type={type} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </>
      )}
    </main>
  );
}