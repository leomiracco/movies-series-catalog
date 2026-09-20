"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronsLeft } from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const maxPages = Math.min(totalPages, 500);

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/?${params.toString()}`);
  };

  if (maxPages <= 1) return null;

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mt-10 mb-12">
      {/* Botón para volver a la página 1 */}
      {currentPage > 1 && (
        <button
          onClick={() => goToPage(1)}
          className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm text-neutral-300 hover:text-white font-medium transition-colors flex items-center gap-1"
          title="Ir a la primera página"
        >
          <ChevronsLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Primera</span>
        </button>
      )}

      <button
        disabled={currentPage <= 1}
        onClick={() => goToPage(currentPage - 1)}
        className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:pointer-events-none rounded-lg text-sm text-white font-medium transition-colors"
      >
        Anterior
      </button>

      <span className="text-sm text-neutral-400 px-2">
        Página <span className="text-amber-400 font-bold">{currentPage}</span> de {maxPages}
      </span>

      <button
        disabled={currentPage >= maxPages}
        onClick={() => goToPage(currentPage + 1)}
        className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:pointer-events-none rounded-lg text-sm text-white font-medium transition-colors"
      >
        Siguiente
      </button>
    </div>
  );
}