import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { PricingCards } from '@/components/pricing/pricing-cards'
import Link from 'next/link'
import type { UserRole, Plan } from '@/lib/billing/plans'

export const metadata = {
  title: 'Pricing — Ensombly',
  description: 'Simple plans that grow with your ambition.',
}

export default async function PricingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let userRole: UserRole = 'user'
  let currentPlan: Plan = 'free'

  if (user) {
    const [{ data: profile }, { data: sub }] = await Promise.all([
      supabase.from('profiles').select('role').eq('id', user.id).single(),
      supabase
        .from('subscriptions')
        .select('plan, status')
        .eq('user_id', user.id)
        .maybeSingle(),
    ])

    const role = profile?.role
    if (role === 'founder' || role === 'investor') userRole = role

    const status = sub?.status
    if ((status === 'active' || status === 'on_trial') && (sub?.plan === 'gold' || sub?.plan === 'platinum')) {
      currentPlan = sub.plan as Plan
    }
  }

  const admin = createAdminClient()
  const { data: settings } = await admin.from('platform_settings').select('disable_sub').single()
  const subsDisabled = settings?.disable_sub ?? false

  return (
    <div className="min-h-[calc(100vh-4rem)] py-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[2]">
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Home
        </Link>
      </div>
      <PricingCards
        initialRole={userRole}
        currentPlan={currentPlan}
        isLoggedIn={!!user}
        subsDisabled={subsDisabled}
      />
    </div>
  )
}
