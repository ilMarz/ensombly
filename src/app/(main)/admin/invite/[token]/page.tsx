import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AcceptInvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/login?redirect=/admin/invite/${token}`);

  const adminClient = createAdminClient();

  const { data: invitation } = await adminClient
    .from("admin_invitations")
    .select("id, email, used_at, expires_at")
    .eq("token", token)
    .single();

  if (!invitation) {
    return <ErrorPage message="Invito non valido o inesistente." />;
  }
  if (invitation.used_at) {
    return <ErrorPage message="Questo invito è già stato utilizzato." />;
  }
  if (new Date(invitation.expires_at) < new Date()) {
    return <ErrorPage message="Questo invito è scaduto." />;
  }

  await Promise.all([
    adminClient.from("profiles").update({ is_admin: true }).eq("id", user.id),
    adminClient.from("admin_invitations").update({ used_at: new Date().toISOString() }).eq("id", invitation.id),
  ]);

  redirect("/admin");
}

function ErrorPage({ message }: { message: string }) {
  return (
    <div className="max-w-md mx-auto px-6 py-20 text-center space-y-4">
      <p className="text-lg font-semibold">{message}</p>
      <Link href="/" className="text-sm text-primary hover:underline">
        Torna alla home →
      </Link>
    </div>
  );
}
