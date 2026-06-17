import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendAdminInvite } from "@/lib/email";
import { z } from "zod";

const Body = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  const admin = await requireAdmin().catch(() => null);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const body = Body.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: "Invalid email" }, { status: 400 });

  const supabase = createAdminClient();

  const { data: invitation, error } = await supabase
    .from("admin_invitations")
    .insert({ email: body.data.email, invited_by: admin.id })
    .select("token")
    .single();

  if (error || !invitation) {
    return NextResponse.json({ error: error?.message ?? "Failed to create invitation" }, { status: 500 });
  }

  await sendAdminInvite(body.data.email, invitation.token);

  return NextResponse.json({ ok: true });
}
