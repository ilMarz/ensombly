import { createClient } from '@/lib/supabase/server'
import { getPlanLimits } from './plans'
import type { Plan, UserRole } from './plans'

export async function getUserPlan(userId: string): Promise<Plan> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', userId)
    .single()

  if (!data || !['on_trial', 'active'].includes(data.status)) return 'free'
  return data.plan as Plan
}

function startOfCurrentMonth(): string {
  const d = new Date()
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

export async function checkProjectLimit(
  userId: string,
  role: UserRole
): Promise<{ allowed: boolean; limit: number | null; used: number }> {
  const supabase = await createClient()
  const plan = await getUserPlan(userId)
  const { projectsPerMonth } = getPlanLimits(role, plan)

  if (projectsPerMonth === null) return { allowed: true, limit: null, used: 0 }

  const { count } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('founder_id', userId)
    .gte('created_at', startOfCurrentMonth())

  const used = count ?? 0
  return { allowed: used < projectsPerMonth, limit: projectsPerMonth, used }
}

export async function checkInvestorInterestLimit(
  userId: string
): Promise<{ allowed: boolean; limit: number | null; used: number }> {
  const supabase = await createClient()
  const plan = await getUserPlan(userId)
  const { interestsPerMonth } = getPlanLimits('investor', plan)

  if (interestsPerMonth === null) return { allowed: true, limit: null, used: 0 }

  const { count } = await supabase
    .from('investor_interests')
    .select('*', { count: 'exact', head: true })
    .eq('investor_id', userId)
    .gte('created_at', startOfCurrentMonth())

  const used = count ?? 0
  return { allowed: used < interestsPerMonth, limit: interestsPerMonth, used }
}
