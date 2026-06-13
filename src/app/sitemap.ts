import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const supabase = await createClient();

  const [{ data: projects }, { data: profiles }] = await Promise.all([
    supabase
      .from("projects")
      .select("id, created_at")
      .is("archived_at", null)
      .limit(1000),
    supabase
      .from("profiles")
      .select("username, created_at")
      .limit(1000),
  ]);

  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/projects`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
  ];

  const projectPages: MetadataRoute.Sitemap = (projects ?? []).map((p) => ({
    url: `${base}/projects/${p.id}`,
    lastModified: p.created_at ? new Date(p.created_at) : now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const profilePages: MetadataRoute.Sitemap = (profiles ?? []).map((p) => ({
    url: `${base}/u/${p.username}`,
    lastModified: p.created_at ? new Date(p.created_at) : now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...projectPages, ...profilePages];
}
