import { NextRequest, NextResponse } from "next/server";
import { getMediaDetails } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = (searchParams.get("type") as "movie" | "tv") || "movie";
  const id = parseInt(searchParams.get("id") || "0");

  if (!id) {
    return NextResponse.json({ error: "ID no válido" }, { status: 400 });
  }

  const details = await getMediaDetails(type, id);
  return NextResponse.json(details);
}