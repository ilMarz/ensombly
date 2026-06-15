import { createClient } from '@/lib/supabase/server'
import { lemonSqueezySetup, createCheckout } from '@lemonsqueezy/lemonsqueezy.js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json() as { variantId?: string }
  const { variantId } = body

  if (!variantId) {
    return NextResponse.json({ error: 'variantId required' }, { status: 400 })
  }

  lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY! })

  const origin = new URL(request.url).origin

  const { data, error } = await createCheckout(
    process.env.LEMONSQUEEZY_STORE_ID!,
    variantId,
    {
      checkoutData: {
        email: user.email,
        custom: { user_id: user.id },
      },
      productOptions: {
        redirectUrl: `${origin}/dashboard?upgraded=true`,
      },
      testMode: process.env.NODE_ENV !== 'production',
    }
  )

  if (error || !data?.data?.attributes?.url) {
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 })
  }

  return NextResponse.json({ url: data.data.attributes.url })
}
