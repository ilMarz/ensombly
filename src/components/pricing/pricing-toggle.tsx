'use client'

import { cn } from '@/lib/utils'

export type BillingPeriod = 'monthly' | 'yearly'

interface PricingToggleProps {
  value: BillingPeriod
  onChange: (v: BillingPeriod) => void
}

export function PricingToggle({ value, onChange }: PricingToggleProps) {
  return (
    <div className="inline-flex items-center gap-0.5 glass-card rounded-xl p-1">
      {(['monthly', 'yearly'] as BillingPeriod[]).map((period) => (
        <button
          key={period}
          onClick={() => onChange(period)}
          className={cn(
            'flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            value === period
              ? 'bg-primary/15 text-foreground'
              : 'text-muted-foreground hover:text-foreground/70'
          )}
        >
          <span className="capitalize">{period}</span>
          {period === 'yearly' && (
            <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-accent/15 text-accent">
              −17%
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
