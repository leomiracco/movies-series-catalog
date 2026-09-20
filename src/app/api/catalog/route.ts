import { NextRequest, NextResponse } from "next/server";
import { getCatalog } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = (searchParams.get("type") as "movie" | "tv") || "movie";
  const query = searchParams.get("query") || undefined;
  const year = searchParams.get("year") || undefined;
  const genre = searchParams.get("genre") || undefined;
  const sortBy = searchParams.get("sortBy") || undefined;
  const page = parseInt(searchParams.get("page") || "1");

  try {
    const data = await getCatalog({ type, query, year, genre, sortBy, page });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en API catalog:", error);
    return NextResponse.json(
      { results: [], total_pages: 0, page: 1, total_results: 0 },
      { status: 500 }
    );
  }
}