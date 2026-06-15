import { createAdminClient } from '@/lib/supabase/admin'
import { variantToPlan } from '@/lib/billing/plans'
import { z } from 'zod'
import crypto from 'node:crypto'
import { NextResponse } from 'next/server'

const SubscriptionPayload = z.object({
  meta: z.object({
    event_name: z.string(),
    custom_data: z.object({ user_id: z.string() }).optional(),
  }),
  data: z.object({
    id: z.string(),
    attributes: z.object({
      customer_id: z.number(),
      variant_id: z.number(),
      status: z.string(),
      renews_at: z.string().nullable(),
      ends_at: z.string().nullable(),
    }),
  }),
})

function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  const digest = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  const digestBuf = Buffer.from(digest, 'utf8')
  const sigBuf = Buffer.from(signature, 'utf8')
  if (digestBuf.length !== sigBuf.length) return false
  return crypto.timingSafeEqual(digestBuf, sigBuf)
}

const SUBSCRIPTION_EVENTS = new Set([
  'subscription_created',
  'subscription_updated',
  'subscription_cancelled',
  'subscription_resumed',
  'subscription_expired',
  'subscription_paused',
  'subscription_unpaused',
])

export async function POST(request: Request) {
  const rawBody = await request.text()
  const signature = request.headers.get('x-signature') ?? ''
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET ?? ''

  if (!secret || !verifySignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let payload: unknown
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const result = SubscriptionPayload.safeParse(payload)
  if (!result.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const { meta, data } = result.data

  if (!SUBSCRIPTION_EVENTS.has(meta.event_name)) {
    return NextResponse.json({ ok: true })
  }

  const userId = meta.custom_data?.user_id
  if (!userId) {
    return NextResponse.json({ error: 'Missing user_id in custom_data' }, { status: 400 })
  }

  const variantId = String(data.attributes.variant_id)
  const plan = variantToPlan(variantId) ?? 'free'

  const supabase = createAdminClient()

  const { error } = await supabase.from('subscriptions').upsert(
    {
      user_id: userId,
      ls_subscription_id: data.id,
      ls_customer_id: String(data.attributes.customer_id),
      variant_id: variantId,
      status: data.attributes.status as 'on_trial' | 'active' | 'paused' | 'past_due' | 'unpaid' | 'cancelled' | 'expired',
      plan,
      renews_at: data.attributes.renews_at,
      ends_at: data.attributes.ends_at,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'ls_subscription_id' }
  )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
