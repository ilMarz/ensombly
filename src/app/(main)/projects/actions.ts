"use server";

import { createClient } from "@/lib/supabase/server";

function normalizeTitle(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
}

export async function checkDuplicates(title: string, sector: string) {
  const supabase = await createClient();
  const norm = normalizeTitle(title);

  const { data } = await supabase
    .from("projects")
    .select("id, title, sector, profiles(username, full_name)")
    .order("created_at", { ascending: false })
    .limit(500);

  if (!data) return [];

  return data.filter((p) => {
    const pNorm = normalizeTitle(p.title);
    const sameOrNearSector = !sector || !p.sector || p.sector === sector;
    const titleMatch =
      pNorm === norm ||
      (norm.length > 4 && pNorm.includes(norm)) ||
      (pNorm.length > 4 && norm.includes(pNorm));
    return titleMatch && sameOrNearSector;
  }).map((p) => ({
    id: p.id,
    title: p.title,
    sector: p.sector,
    founderName: (p.profiles as { full_name?: string | null; username?: string } | null)?.full_name
      ?? (p.profiles as { username?: string } | null)?.username
      ?? "Unknown",
  }));
}
