export type Plan = 'free' | 'gold' | 'platinum'
export type UserRole = 'user' | 'founder' | 'investor'

export interface PlanLimits {
  projectsPerMonth: number | null  // null = unlimited
  interestsPerMonth: number | null // null = unlimited
}

const PLAN_LIMITS: Record<UserRole, Record<Plan, PlanLimits>> = {
  user: {
    free:     { projectsPerMonth: null, interestsPerMonth: null },
    gold:     { projectsPerMonth: null, interestsPerMonth: null },
    platinum: { projectsPerMonth: null, interestsPerMonth: null },
  },
  founder: {
    free:     { projectsPerMonth: 1,    interestsPerMonth: null },
    gold:     { projectsPerMonth: 5,    interestsPerMonth: null },
    platinum: { projectsPerMonth: null, interestsPerMonth: null },
  },
  investor: {
    free:     { projectsPerMonth: null, interestsPerMonth: 3    },
    gold:     { projectsPerMonth: null, interestsPerMonth: null },
    platinum: { projectsPerMonth: null, interestsPerMonth: null },
  },
}

export function getPlanLimits(role: UserRole, plan: Plan): PlanLimits {
  return PLAN_LIMITS[role][plan]
}

export function variantToPlan(variantId: string): Plan | null {
  const map: Partial<Record<string, Plan>> = {}
  const gm = process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_GOLD_MONTHLY
  const gy = process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_GOLD_YEARLY
  const pm = process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PLATINUM_MONTHLY
  const py = process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PLATINUM_YEARLY
  if (gm) map[gm] = 'gold'
  if (gy) map[gy] = 'gold'
  if (pm) map[pm] = 'platinum'
  if (py) map[py] = 'platinum'
  return map[variantId] ?? null
}
