import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-03-25.dahlia',
  typescript: true,
})

export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    dailyGenerations: 5,
    features: [
      '5 generations per day',
      '720p quality',
      'Watermark on images',
      'Basic templates'
    ]
  },
  PRO: {
    name: 'Pro',
    priceMonthly: 19.99,
    priceYearly: 199.99,
    stripePriceIdMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    stripePriceIdYearly: process.env.STRIPE_PRICE_PRO_YEARLY,
    paypalPlanIdMonthly: process.env.PAYPAL_PLAN_PRO_MONTHLY,
    paypalPlanIdYearly: process.env.PAYPAL_PLAN_PRO_YEARLY,
    dailyGenerations: -1, // unlimited
    features: [
      'Unlimited generations',
      '4K quality',
      'No watermark',
      'All templates',
      'Priority processing',
      'Download history'
    ]
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 'Custom',
    features: [
      'Everything in Pro',
      'Custom templates',
      'API access',
      'Dedicated support',
      'White-label option'
    ]
  }
}

export async function createCheckoutSession(
  userId: string,
  priceId: string,
  mode: 'subscription' | 'payment' = 'subscription'
) {
  const session = await stripe.checkout.sessions.create({
    customer_email: undefined, // Will be filled from user
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode,
    success_url: `${process.env.NEXTAUTH_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
    metadata: {
      userId,
    },
  })

  return session
}

export async function createPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXTAUTH_URL}/account`,
  })

  return session
}
