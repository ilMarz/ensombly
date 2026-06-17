import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";
import { Resend } from "resend";

const Body = z.object({
  message: z.string().min(10).max(2000),
  url: z.string().optional(),
});

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = Body.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const admin = createAdminClient();
  const [{ data: settings }, { data: profile }] = await Promise.all([
    admin.from("platform_settings").select("notification_email").single(),
    admin.from("profiles").select("username, full_name").eq("id", user.id).single(),
  ]);

  if (!settings?.notification_email) {
    return NextResponse.json({ error: "No notification email configured" }, { status: 503 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const senderName = profile?.full_name ?? profile?.username ?? user.email ?? "Utente sconosciuto";
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ensombly.com";

  await resend.emails.send({
    from: `Ensombly <noreply@ensombly.com>`,
    to: settings.notification_email,
    subject: `🐛 Bug report da ${senderName}`,
    html: `
      <p><strong>Segnalazione bug</strong> ricevuta da <strong>${senderName}</strong> (${user.email})</p>
      ${body.data.url ? `<p><strong>Pagina:</strong> <a href="${body.data.url}">${body.data.url}</a></p>` : ""}
      <p><strong>Messaggio:</strong></p>
      <blockquote style="border-left:3px solid #ccc;padding-left:12px;color:#555;">
        ${body.data.message.replace(/\n/g, "<br>")}
      </blockquote>
      <p><a href="${SITE_URL}/admin">Vai alla dashboard admin →</a></p>
    `,
  });

  return NextResponse.json({ ok: true });
}
