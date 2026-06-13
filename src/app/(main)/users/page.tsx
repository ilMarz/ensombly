import { createClient } from "@/lib/supabase/server";
import { UsersList } from "./users-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "People",
  description: "Discover founders, collaborators, and investors building on Ensombly.",
  alternates: { canonical: "/users" },
};

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("profiles")
    .select("id, username, full_name, bio, avatar_url, role, looking_for, is_verified, skills")
    .order("created_at", { ascending: false })
    .limit(500);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">People</h1>
        <p className="text-muted-foreground mt-1.5 text-sm">Discover founders, collaborators, and investors</p>
      </div>
      <UsersList users={(users ?? []) as Parameters<typeof UsersList>[0]["users"]} initialQuery={q ?? ""} />
    </div>
  );
}
