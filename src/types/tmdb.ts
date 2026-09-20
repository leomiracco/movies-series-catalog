export interface MediaItem {
  id: number;
  media_type?: "movie" | "tv";
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  original_language: string;
  overview: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
}

export interface TMDBResponse {
  page: number;
  results: MediaItem[];
  total_pages: number;
  total_results: number;
}

export interface MediaDetail extends MediaItem {
  tagline?: string;
  genres: { id: number; name: string }[];
  runtime?: number;
  episode_run_time?: number[];
  imdb_id?: string;
  external_ids?: {
    imdb_id?: string;
  };
  origin_country?: string[];
  production_countries?: {
    iso_3166_1: string;
    name: string;
  }[];
}