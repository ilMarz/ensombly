'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ArrowRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { UserRole, Plan } from '@/lib/billing/plans'
import { PricingToggle, type BillingPeriod } from './pricing-toggle'

// ─── Data ────────────────────────────────────────────────────────────────────

const ROLE_LABELS: Record<UserRole, string> = {
  user: 'Collaborator',
  founder: 'Founder',
  investor: 'Investor',
}

const PRICES = {
  gold:     { monthly: 3.99, yearly: 40, perMonth: 3.33 },
  platinum: { monthly: 9.99, yearly: 99.99, perMonth: 8.33 },
} as const

const VARIANTS = {
  gold: {
    monthly: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_GOLD_MONTHLY ?? '',
    yearly:  process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_GOLD_YEARLY  ?? '',
  },
  platinum: {
    monthly: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PLATINUM_MONTHLY ?? '',
    yearly:  process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PLATINUM_YEARLY  ?? '',
  },
}

interface Feature { text: string; inherited?: boolean }

const FEATURES: Record<UserRole, Record<Plan, Feature[]>> = {
  user: {
    free: [
      { text: 'Unlimited join requests' },
      { text: 'Browse all projects' },
      { text: 'Basic search filters' },
      { text: 'Public profile page' },
    ],
    gold: [
      { text: 'Profile highlighted to founders' },
      { text: 'Advanced search & filters' },
      { text: 'Early access to new projects' },
      { text: 'Verified badge' },
      { text: 'Priority application status' },
      { text: 'All Free features', inherited: true },
    ],
    platinum: [
      { text: 'Direct message to founders' },
      { text: 'Maximum profile boost' },
      { text: 'Application analytics' },
      { text: 'All Gold features', inherited: true },
    ],
  },
  founder: {
    free: [
      { text: '1 project per month' },
      { text: '1 active project at a time' },
      { text: 'Receive applications' },
      { text: 'Public project page' },
    ],
    gold: [
      { text: 'Up to 5 projects per month' },
      { text: 'Project boost in search' },
      { text: 'Advanced talent filters' },
      { text: 'Project analytics' },
      { text: 'Verified badge' },
      { text: 'All Free features', inherited: true },
    ],
    platinum: [
      { text: 'Unlimited projects' },
      { text: 'Direct outreach to members' },
      { text: 'Investor network access' },
      { text: 'Team management' },
      { text: 'Advanced analytics & export' },
      { text: 'All Gold features', inherited: true },
    ],
  },
  investor: {
    free: [
      { text: '3 interests per month' },
      { text: 'Browse public projects' },
      { text: 'Basic project filters' },
      { text: 'Public investor profile' },
    ],
    gold: [
      { text: 'Unlimited interest expressions' },
      { text: 'Deal flow filters' },
      { text: 'Early access to new projects' },
      { text: 'Verified Investor badge' },
      { text: 'Saved searches & alerts' },
      { text: 'All Free features', inherited: true },
    ],
    platinum: [
      { text: 'Direct message to founders' },
      { text: 'Exclusive pre-launch deal flow' },
      { text: 'Advanced analytics & export' },
      { text: 'Profile highlighted to founders' },
      { text: 'All Gold features', inherited: true },
    ],
  },
}

const TAGLINES: Record<Plan, string> = {
  free:     'Explore and connect at no cost.',
  gold:     'Stand out. Get seen. Move faster.',
  platinum: 'Full reach. Maximum impact.',
}

// ─── Root component ───────────────────────────────────────────────────────────

interface PricingCardsProps {
  initialRole: UserRole
  currentPlan: Plan
  isLoggedIn: boolean
  subsDisabled?: boolean
}

export function PricingCards({ initialRole, currentPlan, isLoggedIn, subsDisabled = false }: PricingCardsProps) {
  const router = useRouter()
  const [role, setRole]     = useState<UserRole>(initialRole)
  const [period, setPeriod] = useState<BillingPeriod>('monthly')
  const [loading, setLoading] = useState<'gold' | 'platinum' | null>(null)
  const [cancelling, setCancelling] = useState(false)
  const [cancelModal, setCancelModal] = useState<'idle' | 'confirm' | 'success' | 'error'>('idle')

  async function handleCancel() {
    setCancelModal('confirm')
  }

  async function confirmCancel() {
    setCancelling(true)
    try {
      const res = await fetch('/api/subscription/cancel', { method: 'POST' })
      if (!res.ok) throw new Error()
      setCancelModal('success')
    } catch {
      setCancelModal('error')
    } finally {
      setCancelling(false)
    }
  }

  function closeCancelModal() {
    if (cancelModal === 'success') router.refresh()
    setCancelModal('idle')
  }

  async function handleCheckout(tier: 'gold' | 'platinum') {
    if (!isLoggedIn) { router.push('/login?redirect=/pricing'); return }
    const variantId = VARIANTS[tier][period]
    setLoading(tier)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId }),
      })
      if (!res.ok) throw new Error()
      const { url } = await res.json() as { url: string }
      window.location.href = url
    } catch {
      setLoading(null)
    }
  }

  const goldPrice     = period === 'monthly' ? PRICES.gold.monthly     : PRICES.gold.perMonth
  const platinumPrice = period === 'monthly' ? PRICES.platinum.monthly : PRICES.platinum.perMonth

  return (
    <div className="max-w-5xl mx-auto">

      {/* ── Cancel modal ─────────────────────────────────────────────── */}
      {cancelModal !== 'idle' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={cancelModal === 'success' ? closeCancelModal : undefined} />
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl shadow-black/40 w-full max-w-md p-6 space-y-5">
            {cancelModal === 'success' ? (
              <>
                <div className="text-center space-y-3 py-2">
                  <p className="text-3xl">✓</p>
                  <p className="font-semibold text-emerald-400">Abbonamento cancellato</p>
                  <p className="text-sm text-muted-foreground">
                    Il tuo piano rimarrà attivo fino alla fine del periodo di fatturazione corrente.
                  </p>
                </div>
                <button
                  onClick={closeCancelModal}
                  className="w-full px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Chiudi
                </button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <h2 className="font-semibold text-base">Cancella abbonamento</h2>
                  <p className="text-sm text-muted-foreground">
                    Sei sicuro di voler cancellare il tuo abbonamento?
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Il piano resterà attivo fino alla fine del periodo di fatturazione corrente, dopodiché tornerai al piano gratuito.
                  </p>
                </div>
                {cancelModal === 'error' && (
                  <p className="text-sm text-red-400">Errore durante la cancellazione. Riprova.</p>
                )}
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={closeCancelModal}
                    disabled={cancelling}
                    className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-secondary transition-colors disabled:opacity-50"
                  >
                    Annulla
                  </button>
                  <button
                    onClick={confirmCancel}
                    disabled={cancelling}
                    className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {cancelling ? 'Cancellazione...' : 'Sì, cancella'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="text-center mb-14 space-y-4 animate-fade-up">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-12 bg-border" />
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground/55">
            Pricing
          </span>
          <div className="h-px w-12 bg-border" />
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight">
          Invest in your{' '}
          <span className="text-gradient">network</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
          Choose the plan that fits how you use Ensombly.
          Upgrade or cancel anytime.
        </p>
      </div>

      {/* ── Selectors ────────────────────────────────────────────────── */}
      <div
        className="flex flex-col items-center gap-5 mb-12 animate-fade-up"
        style={{ animationDelay: '0.1s' }}
      >
        <div className="flex items-center gap-0.5 glass-card rounded-xl p-1">
          {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={cn(
                'px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                role === r
                  ? 'bg-primary/15 text-foreground'
                  : 'text-muted-foreground hover:text-foreground/80'
              )}
            >
              {ROLE_LABELS[r]}
            </button>
          ))}
        </div>
        <PricingToggle value={period} onChange={setPeriod} />
      </div>

      {/* ── Cards ────────────────────────────────────────────────────── */}
      {subsDisabled ? (
        <div className="animate-fade-up space-y-6" style={{ animationDelay: '0.15s' }}>
          {/* Free card — always interactive */}
          <div className="max-w-sm mx-auto">
            <TierCard
              name="Free"
              tagline={TAGLINES.free}
              price={null}
              period={period}
              features={FEATURES[role].free}
              cta={isLoggedIn ? 'Go to dashboard' : 'Get started free'}
              isCurrent={false}
              onCtaClick={() => router.push(isLoggedIn ? '/dashboard' : '/login?mode=signup')}
              delay="0s"
            />
          </div>
          {/* Paid plans — blurred, coming soon */}
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 items-start opacity-40 pointer-events-none select-none blur-[1px]">
              <TierCard name="Gold" tagline={TAGLINES.gold} price={PRICES.gold.monthly} period={period} yearlyTotal={PRICES.gold.yearly} features={FEATURES[role].gold} cta="Upgrade to Gold" isCurrent={false} highlighted badge="Most popular" onCtaClick={() => {}} delay="0s" />
              <TierCard name="Platinum" tagline={TAGLINES.platinum} price={PRICES.platinum.monthly} period={period} yearlyTotal={PRICES.platinum.yearly} features={FEATURES[role].platinum} cta="Upgrade to Platinum" isCurrent={false} accent onCtaClick={() => {}} delay="0s" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="inline-flex flex-col items-center gap-3 bg-card border border-border rounded-2xl px-10 py-8 shadow-xl shadow-black/30">
                <span className="text-3xl">🚀</span>
                <p className="text-lg font-semibold">Abbonamenti in arrivo</p>
                <p className="text-sm text-muted-foreground max-w-xs text-center">
                  I piani a pagamento saranno disponibili a breve. Torna presto!
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={`grid grid-cols-1 gap-4 sm:gap-5 items-start ${
          currentPlan === 'free' ? 'sm:grid-cols-3' : 'sm:grid-cols-2 max-w-2xl mx-auto'
        }`}>
          {currentPlan === 'free' && (
            <TierCard
              name="Free"
              tagline={TAGLINES.free}
              price={null}
              period={period}
              features={FEATURES[role].free}
              cta={isLoggedIn ? 'Go to dashboard' : 'Get started free'}
              isCurrent={isLoggedIn}
              onCtaClick={() => router.push(isLoggedIn ? '/dashboard' : '/login?mode=signup')}
              delay="0.15s"
            />
          )}

          {(currentPlan === 'free' || currentPlan === 'gold') && (
            <TierCard
              name="Gold"
              tagline={TAGLINES.gold}
              price={goldPrice}
              period={period}
              yearlyTotal={PRICES.gold.yearly}
              features={FEATURES[role].gold}
              cta={currentPlan === 'gold' ? 'Piano attivo' : 'Upgrade to Gold'}
              isCurrent={currentPlan === 'gold'}
              highlighted
              badge={currentPlan === 'free' ? 'Most popular' : undefined}
              isLoading={loading === 'gold'}
              hideCta={!isLoggedIn}
              onCtaClick={() => currentPlan === 'free' && handleCheckout('gold')}
              onCancelClick={currentPlan === 'gold' ? handleCancel : undefined}
              cancelLoading={cancelling}
              delay={currentPlan === 'gold' ? '0.15s' : '0.2s'}
            />
          )}

          <TierCard
            name="Platinum"
            tagline={TAGLINES.platinum}
            price={platinumPrice}
            period={period}
            yearlyTotal={PRICES.platinum.yearly}
            features={FEATURES[role].platinum}
            cta={currentPlan === 'platinum' ? 'Piano attivo' : 'Upgrade to Platinum'}
            isCurrent={currentPlan === 'platinum'}
            accent
            isLoading={loading === 'platinum'}
            hideCta={!isLoggedIn}
            onCtaClick={() => currentPlan !== 'platinum' && handleCheckout('platinum')}
            onCancelClick={currentPlan === 'platinum' ? handleCancel : undefined}
            cancelLoading={cancelling}
            delay={currentPlan === 'free' ? '0.25s' : currentPlan === 'gold' ? '0.2s' : '0.15s'}
          />
        </div>
      )}

      {/* ── Footer note ──────────────────────────────────────────────── */}
      <p
        className="text-center text-xs text-muted-foreground/45 mt-10 animate-fade-up"
        style={{ animationDelay: '0.3s' }}
      >
        Prices shown exclude VAT · VAT is calculated at checkout based on your location ·
        Cancel anytime, no lock-in
      </p>
    </div>
  )
}

// ─── TierCard ─────────────────────────────────────────────────────────────────

interface TierCardProps {
  name: string
  tagline: string
  price: number | null
  period: BillingPeriod
  yearlyTotal?: number
  features: Feature[]
  cta: string
  isCurrent: boolean
  highlighted?: boolean
  accent?: boolean
  badge?: string
  isLoading?: boolean
  hideCta?: boolean
  onCtaClick: () => void
  onCancelClick?: () => void
  cancelLoading?: boolean
  delay: string
}

function TierCard({
  name, tagline, price, period, yearlyTotal,
  features, cta, isCurrent, highlighted, accent,
  badge, isLoading, hideCta, onCtaClick, onCancelClick, cancelLoading, delay,
}: TierCardProps) {
  return (
    <div
      className={cn(
        'glass-card rounded-2xl p-6 flex flex-col gap-5 animate-fade-up transition-all duration-300',
        highlighted && 'ring-1 ring-primary/40 shadow-2xl shadow-primary/10 sm:-translate-y-1.5',
        accent && 'ring-1 ring-accent/25',
      )}
      style={{ animationDelay: delay }}
    >
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className={cn(
            'text-[11px] font-bold tracking-[0.16em] uppercase',
            highlighted ? 'text-primary' : accent ? 'text-accent' : 'text-muted-foreground/60'
          )}>
            {name}
          </span>
          {badge && (
            <span className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{tagline}</p>
      </div>

      {/* Price */}
      <div className="min-h-[4rem]">
        {price === null ? (
          <div className="flex items-end gap-1">
            <span className="font-heading text-4xl font-bold">€0</span>
            <span className="text-muted-foreground text-sm mb-1.5">/mo</span>
          </div>
        ) : (
          <>
            <div className="flex items-end gap-1">
              <span className="font-heading text-4xl font-bold">
                €{price.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-muted-foreground text-sm mb-1.5">/mo</span>
            </div>
            {period === 'yearly' && yearlyTotal && (
              <p className="text-xs text-muted-foreground/55 mt-0.5">
                billed €{yearlyTotal}/year
              </p>
            )}
          </>
        )}
      </div>

      {/* CTA */}
      {!hideCta && <button
        onClick={onCtaClick}
        disabled={isCurrent || !!isLoading}
        className={cn(
          'w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200',
          isCurrent
            ? 'bg-muted/40 text-muted-foreground cursor-default'
            : highlighted
            ? 'btn-gradient text-white'
            : accent
            ? 'bg-accent/10 text-accent ring-1 ring-accent/25 hover:bg-accent/20'
            : 'bg-primary/8 text-foreground ring-1 ring-border hover:bg-primary/12',
          isLoading && 'opacity-60 cursor-wait'
        )}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            {cta}
            {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
          </>
        )}
      </button>}

      {/* Cancel */}
      {onCancelClick && (
        <button
          onClick={onCancelClick}
          disabled={cancelLoading}
          className="w-full text-xs text-muted-foreground/60 hover:text-red-400 transition-colors disabled:opacity-40 py-1"
        >
          {cancelLoading ? 'Cancellazione...' : 'Cancella abbonamento'}
        </button>
      )}

      {/* Divider */}
      <div className="h-px bg-border/50" />

      {/* Features */}
      <ul className="space-y-3 flex-1">
        {features.map((f, i) => (
          <li key={i} className={cn('flex items-start gap-3', f.inherited && 'opacity-35')}>
            <span className={cn(
              'mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center',
              highlighted ? 'bg-primary/15' : accent ? 'bg-accent/15' : 'bg-primary/10'
            )}>
              <Check className={cn(
                'w-2.5 h-2.5',
                highlighted ? 'text-primary' : accent ? 'text-accent' : 'text-primary/70'
              )} />
            </span>
            <span className={cn(
              'text-sm leading-relaxed',
              f.inherited ? 'text-muted-foreground/50 italic' : 'text-foreground/80'
            )}>
              {f.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
