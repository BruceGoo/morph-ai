'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { useConfig } from '@/lib/config-context'

export default function PricingPage() {
  const { theme, locale } = useConfig()
  const { data: session } = useSession()
  const router = useRouter()
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [paymentProvider, setPaymentProvider] = useState<'stripe' | 'paypal'>('stripe')
  const [loading, setLoading] = useState(false)

  const plans = [
    {
      name: 'Free',
      price: 0,
      period: '',
      features: locale === 'en' ? [
        '5 generations per day',
        '720p quality',
        'Watermark on images',
        'Basic templates',
        'Community access'
      ] : [
        '每天5次生成',
        '720p质量',
        '图片带水印',
        '基础模板',
        '社区访问'
      ],
      cta: locale === 'en' ? 'Get Started' : '开始使用',
      popular: false
    },
    {
      name: 'Pro',
      price: billingPeriod === 'monthly' ? 19.99 : 199.99,
      period: billingPeriod === 'monthly' ? (locale === 'en' ? '/month' : '/月') : (locale === 'en' ? '/year' : '/年'),
      savings: billingPeriod === 'yearly' ? (locale === 'en' ? 'Save $40' : '节省 $40') : null,
      stripePriceId: billingPeriod === 'monthly'
        ? process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY
        : process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY,
      paypalPlanId: billingPeriod === 'monthly'
        ? process.env.NEXT_PUBLIC_PAYPAL_PLAN_PRO_MONTHLY
        : process.env.NEXT_PUBLIC_PAYPAL_PLAN_PRO_YEARLY,
      features: locale === 'en' ? [
        'Unlimited generations',
        '4K quality',
        'No watermark',
        'All templates',
        'Priority processing',
        'Download history',
        'Early access to new features'
      ] : [
        '无限生成',
        '4K质量',
        '无水印',
        '所有模板',
        '优先处理',
        '下载历史',
        '抢先体验新功能'
      ],
      cta: locale === 'en' ? 'Upgrade to Pro' : '升级到Pro',
      popular: true
    },
    {
      name: 'Enterprise',
      price: locale === 'en' ? 'Custom' : '定制',
      period: '',
      features: locale === 'en' ? [
        'Everything in Pro',
        'Custom templates',
        'API access',
        'Dedicated support',
        'White-label option',
        'Custom integrations',
        'SLA guarantee'
      ] : [
        'Pro的所有功能',
        '定制模板',
        'API访问',
        '专属支持',
        '白标选项',
        '定制集成',
        'SLA保证'
      ],
      cta: locale === 'en' ? 'Contact Sales' : '联系销售',
      popular: false
    }
  ]

  const handleSubscribe = async (plan: typeof plans[0]) => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (plan.name === 'Free') {
      router.push('/create')
      return
    }

    if (plan.name === 'Enterprise') {
      window.location.href = 'mailto:sales@morph.ai'
      return
    }

    setLoading(true)

    try {
      if (paymentProvider === 'stripe') {
        const response = await fetch('/api/payment/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            priceId: plan.stripePriceId,
            mode: 'subscription'
          })
        })

        const data = await response.json()
        if (data.url) {
          window.location.href = data.url
        }
      } else {
        const response = await fetch('/api/payment/paypal/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planId: plan.paypalPlanId
          })
        })

        const data = await response.json()
        if (data.approvalUrl) {
          window.location.href = data.approvalUrl
        }
      }
    } catch (error) {
      console.error('Subscription error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.background}`}>
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 text-white">
            {locale === 'en' ? 'Choose Your Plan' : '选择您的套餐'}
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            {locale === 'en' ? 'Start free, upgrade when you need more' : '免费开始，需要时再升级'}
          </p>

          {/* Billing Period Toggle */}
          <div className="inline-flex items-center gap-4 bg-white rounded-full p-2 shadow-lg mb-8">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-full transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-full transition-all ${
                billingPeriod === 'yearly'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </div>

          {/* Payment Provider Toggle */}
          <div className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-lg">
            <button
              onClick={() => setPaymentProvider('stripe')}
              className={`px-6 py-2 rounded-full transition-all ${
                paymentProvider === 'stripe'
                  ? `bg-gradient-to-r ${theme.colors.buttonGradient} text-white`
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              💳 Credit Card
            </button>
            <button
              onClick={() => setPaymentProvider('paypal')}
              className={`px-6 py-2 rounded-full transition-all ${
                paymentProvider === 'paypal'
                  ? `bg-gradient-to-r ${theme.colors.buttonGradient} text-white`
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              PayPal
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-lg relative ${
                plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r ${theme.colors.buttonGradient} text-white px-4 py-1 rounded-full text-sm font-medium`}>
                  {locale === 'en' ? 'Most Popular' : '最受欢迎'}
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  {typeof plan.price === 'number' ? (
                    <>
                      <span className="text-4xl font-bold text-white">${plan.price}</span>
                      <span className="text-gray-400">{plan.period}</span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                  )}
                </div>
                {plan.savings && (
                  <div className="text-green-400 text-sm font-medium mt-2">
                    {plan.savings}
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribe(plan)}
                disabled={loading}
                className={`w-full ${
                  plan.popular
                    ? `bg-gradient-to-r ${theme.colors.buttonGradient} hover:opacity-90`
                    : 'border-white/20 text-white hover:bg-white/10'
                }`}
                variant={plan.popular ? 'default' : 'outline'}
              >
                {loading ? (locale === 'en' ? 'Processing...' : '处理中...') : plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-8 text-white">
            {locale === 'en' ? 'Frequently Asked Questions' : '常见问题'}
          </h3>
          <div className="space-y-4">
            <details className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6 shadow-lg">
              <summary className="font-semibold cursor-pointer text-white">
                {locale === 'en' ? 'Can I cancel anytime?' : '可以随时取消吗？'}
              </summary>
              <p className="mt-2 text-gray-400">
                {locale === 'en'
                  ? "Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
                  : '可以！您可以随时取消订阅。您将继续拥有访问权限直到计费周期结束。'}
              </p>
            </details>
            <details className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6 shadow-lg">
              <summary className="font-semibold cursor-pointer text-white">
                {locale === 'en' ? 'What payment methods do you accept?' : '接受哪些支付方式？'}
              </summary>
              <p className="mt-2 text-gray-400">
                {locale === 'en'
                  ? 'We accept all major credit cards through Stripe and PayPal payments.'
                  : '我们通过Stripe接受所有主要信用卡和PayPal支付。'}
              </p>
            </details>
            <details className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6 shadow-lg">
              <summary className="font-semibold cursor-pointer text-white">
                {locale === 'en' ? 'Is there a free trial?' : '有免费试用吗？'}
              </summary>
              <p className="mt-2 text-gray-400">
                {locale === 'en'
                  ? 'Our Free plan gives you 5 generations per day forever. No credit card required!'
                  : '我们的免费计划永久提供每天5次生成。无需信用卡！'}
              </p>
            </details>
          </div>
        </div>
      </main>
    </div>
  )
}
