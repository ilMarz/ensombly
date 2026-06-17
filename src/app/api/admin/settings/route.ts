import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const Body = z.object({
  notification_email: z.string().email().optional(),
  beta_mode: z.boolean().optional(),
  disable_sub: z.boolean().optional(),
}).refine((d) => Object.values(d).some((v) => v !== undefined), { message: "No fields provided" });

export async function POST(req: Request) {
  const admin = await requireAdmin().catch(() => null);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const body = Body.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("platform_settings")
    .update({ ...body.data, updated_at: new Date().toISOString() })
    .eq("id", true);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
