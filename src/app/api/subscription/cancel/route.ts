import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { lemonSqueezySetup, cancelSubscription } from "@lemonsqueezy/lemonsqueezy.js";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data: sub } = await admin
    .from("subscriptions")
    .select("ls_subscription_id, status")
    .eq("user_id", user.id)
    .single();

  if (!sub?.ls_subscription_id) {
    return NextResponse.json({ error: "No active subscription" }, { status: 404 });
  }

  if (!["active", "on_trial"].includes(sub.status)) {
    return NextResponse.json({ error: "Subscription is not active" }, { status: 400 });
  }

  lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY! });

  const { error } = await cancelSubscription(sub.ls_subscription_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
