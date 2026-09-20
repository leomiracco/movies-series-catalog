import { TMDBResponse, MediaDetail, MediaItem } from "@/types/tmdb";

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function getCatalog(params: {
  type?: "movie" | "tv";
  query?: string;
  year?: string;
  genre?: string;
  sortBy?: string;
  page?: number;
}): Promise<TMDBResponse> {
  const type = params.type || "movie";
  const page = params.page || 1;
  const year = params.year ? parseInt(params.year) : undefined;
  const genre = params.genre;
  const sortBy = params.sortBy || "vote_average.desc";

  let tmdbSortBy = sortBy;
  if (type === "tv") {
    if (sortBy === "primary_release_date.desc") tmdbSortBy = "first_air_date.desc";
    else if (sortBy === "primary_release_date.asc") tmdbSortBy = "first_air_date.asc";
  }

  const minVotes = year ? (year <= 1990 ? 50 : 100) : 100;
  const isSearch = Boolean(params.query && params.query.trim() !== "");

  // CASO A: Búsqueda por texto
  if (isSearch) {
    const query = params.query!.trim();
    const buildSearchUrl = (p: number) => {
      const u = new URLSearchParams({
        api_key: API_KEY || "",
        language: "es-ES",
        query,
        page: p.toString(),
      });
      if (year) {
        if (type === "movie") u.append("primary_release_year", year.toString());
        else u.append("first_air_date_year", year.toString());
      }
      return `${BASE_URL}/search/${type}?${u.toString()}`;
    };

    const firstRes = await fetch(buildSearchUrl(1), { next: { revalidate: 3600 } });
    if (!firstRes.ok) return { page: 1, results: [], total_pages: 0, total_results: 0 };
    const firstData: TMDBResponse = await firstRes.json();

    let allResults: MediaItem[] = [...(firstData.results || [])];
    // 20 páginas x 20 entregas = hasta 400 títulos
    const pagesToFetch = Math.min(firstData.total_pages, 20);

    if (pagesToFetch > 1) {
      const fetchPromises = [];
      for (let p = 2; p <= pagesToFetch; p++) {
        fetchPromises.push(
          fetch(buildSearchUrl(p), { next: { revalidate: 3600 } })
            .then((r) => (r.ok ? r.json() : { results: [] }))
            .then((d: TMDBResponse) => d.results || [])
        );
      }
      const restResults = await Promise.all(fetchPromises);
      restResults.forEach((batch) => allResults.push(...batch));
    }

    // Eliminar posibles duplicados devueltos por TMDb
    const uniqueMap = new Map<number, MediaItem>();
    allResults.forEach((item) => item?.id && uniqueMap.set(item.id, item));
    allResults = Array.from(uniqueMap.values());

    // Si seleccionó un género en la búsqueda por nombre, filtramos en memoria
    if (genre && genre !== "") {
      const genreId = parseInt(genre);
      allResults = allResults.filter((item) => item.genre_ids?.includes(genreId));
    }

    allResults.sort((a, b) => {
      if (sortBy === "vote_average.desc") {
        return (b.vote_average || 0) - (a.vote_average || 0);
      }
      if (sortBy === "vote_average.asc") {
        return (a.vote_average || 0) - (b.vote_average || 0);
      }
      if (sortBy === "primary_release_date.desc") {
        const dateA = new Date(a.release_date || a.first_air_date || 0).getTime();
        const dateB = new Date(b.release_date || b.first_air_date || 0).getTime();
        return dateB - dateA;
      }
      if (sortBy === "primary_release_date.asc") {
        const dateA = new Date(a.release_date || a.first_air_date || "9999").getTime();
        const dateB = new Date(b.release_date || b.first_air_date || "9999").getTime();
        return dateA - dateB;
      }
      return 0;
    });

    const startIndex = (page - 1) * 20;
    const paginatedResults = allResults.slice(startIndex, startIndex + 20);

    return {
      page,
      results: paginatedResults,
      total_pages: Math.ceil(allResults.length / 20) || 1,
      total_results: allResults.length,
    };
  }

  // CASO B: Descubrimiento general con filtros
  const urlParams = new URLSearchParams({
    api_key: API_KEY || "",
    language: "es-ES",
    page: page.toString(),
    sort_by: tmdbSortBy,
    "vote_count.gte": minVotes.toString(),
  });

  if (year) {
    if (type === "movie") urlParams.append("primary_release_year", year.toString());
    else urlParams.append("first_air_date_year", year.toString());
  }

  // Filtro de género en TMDb (si no es "Todos")
  if (genre && genre !== "") {
    urlParams.append("with_genres", genre);
  }

  const res = await fetch(`${BASE_URL}/discover/${type}?${urlParams.toString()}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }

  return res.json();
}

// Obtener detalle con respaldo en inglés y país de origen
export async function getMediaDetails(type: "movie" | "tv", id: number): Promise<MediaDetail | null> {
  try {
    const resEs = await fetch(
      `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=es-ES&append_to_response=external_ids`,
      { next: { revalidate: 86400 } }
    );
    const dataEs: MediaDetail = await resEs.json();

    if (!dataEs.overview || dataEs.overview.trim() === "") {
      const resEn = await fetch(
        `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=en-US`,
        { next: { revalidate: 86400 } }
      );
      const dataEn = await resEn.json();
      dataEs.overview = dataEn.overview || "Sinopsis no disponible.";
    }

    dataEs.imdb_id = dataEs.imdb_id || dataEs.external_ids?.imdb_id;

    return dataEs;
  } catch (error) {
    console.error("Error al obtener detalle:", error);
    return null;
  }
}