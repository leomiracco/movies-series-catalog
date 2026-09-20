export const dynamic = "force-dynamic";

import { getCatalog } from "@/lib/tmdb";
import FilterBar from "@/components/FilterBar";
import MediaCardGrid from "@/components/MediaCardGrid";
import Pagination from "@/components/Pagination";

interface PageProps {
  searchParams: Promise<{
    type?: "movie" | "tv";
    query?: string;
    year?: string;
    genre?: string;
    sortBy?: string;
    page?: string;
  }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const type = resolvedParams.type || "movie";
  const page = resolvedParams.page ? parseInt(resolvedParams.page) : 1;

  const data = await getCatalog({
    type,
    query: resolvedParams.query,
    year: resolvedParams.year,
    genre: resolvedParams.genre,
    sortBy: resolvedParams.sortBy,
    page,
  });

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

      <FilterBar />

      <MediaCardGrid items={data.results} type={type} />

      <Pagination currentPage={data.page} totalPages={data.total_pages} />
    </main>
  );
}