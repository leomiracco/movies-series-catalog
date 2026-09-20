"use client";

import { ChevronsLeft } from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  const maxPages = Math.min(totalPages, 500);

  if (maxPages <= 1) return null;

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mt-10 mb-12">
      {currentPage > 1 && (
        <button
          onClick={() => {
            onPageChange(1);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm text-neutral-300 hover:text-white font-medium transition-colors flex items-center gap-1 cursor-pointer"
          title="Ir a la primera página"
        >
          <ChevronsLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Primera</span>
        </button>
      )}

      <button
        disabled={currentPage <= 1}
        onClick={() => {
          onPageChange(currentPage - 1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:pointer-events-none rounded-lg text-sm text-white font-medium transition-colors cursor-pointer"
      >
        Anterior
      </button>

      <span className="text-sm text-neutral-400 px-2">
        Página <span className="text-amber-400 font-bold">{currentPage}</span> de {maxPages}
      </span>

      <button
        disabled={currentPage >= maxPages}
        onClick={() => {
          onPageChange(currentPage + 1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:pointer-events-none rounded-lg text-sm text-white font-medium transition-colors cursor-pointer"
      >
        Siguiente
      </button>
    </div>
  );
}