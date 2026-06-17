import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendNewUserNotification } from "@/lib/email";

export async function POST(req: Request) {
  const secret = process.env.SUPABASE_WEBHOOK_SECRET;
  if (secret) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const record = (body as { record?: { id?: string; username?: string; full_name?: string | null } }).record;
  if (!record?.id) return NextResponse.json({ ok: true });

  const supabase = createAdminClient();

  const { data: settings } = await supabase
    .from("platform_settings")
    .select("notification_email")
    .single();

  if (!settings?.notification_email) return NextResponse.json({ ok: true });

  const { data: authUser } = await supabase.auth.admin.getUserById(record.id);
  const email = authUser?.user?.email;

  await sendNewUserNotification(settings.notification_email, {
    username: record.username ?? record.id,
    full_name: record.full_name ?? null,
    email,
  });

  return NextResponse.json({ ok: true });
}
