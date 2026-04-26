'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sparkles, ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

interface PaymentConfig {
  stripeEnabled: boolean
  paypalEnabled: boolean
  defaultProvider: 'stripe' | 'paypal'
  stripePriceProMonthly: string
  stripePriceProYearly: string
  paypalPlanProMonthly: string
  paypalPlanProYearly: string
}

export default function AdminPaymentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [config, setConfig] = useState<PaymentConfig>({
    stripeEnabled: true,
    paypalEnabled: true,
    defaultProvider: 'stripe',
    stripePriceProMonthly: '',
    stripePriceProYearly: '',
    paypalPlanProMonthly: '',
    paypalPlanProYearly: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/')
      return
    }

    fetchConfig()
  }, [session, status, router])

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/payment-config')
      const data = await response.json()
      if (data.config) {
        setConfig(data.config)
      }
    } catch (error) {
      console.error('Failed to fetch config:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/payment-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })

      if (response.ok) {
        alert('Payment configuration saved successfully!')
      } else {
        alert('Failed to save configuration')
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save configuration')
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <h1 className="text-2xl font-bold">Payment Settings</h1>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-purple-600 to-pink-600"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Provider Selection */}
        <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold mb-4">Payment Providers</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Stripe</h3>
                <p className="text-sm text-gray-600">Credit card payments via Stripe</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.stripeEnabled}
                  onChange={(e) => setConfig({ ...config, stripeEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">PayPal</h3>
                <p className="text-sm text-gray-600">PayPal payments and subscriptions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.paypalEnabled}
                  onChange={(e) => setConfig({ ...config, paypalEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">Default Provider</label>
            <select
              value={config.defaultProvider}
              onChange={(e) => setConfig({ ...config, defaultProvider: e.target.value as 'stripe' | 'paypal' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>
        </div>

        {/* Stripe Configuration */}
        {config.stripeEnabled && (
          <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
            <h2 className="text-xl font-bold mb-4">Stripe Configuration</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Pro Monthly Price ID
                </label>
                <input
                  type="text"
                  value={config.stripePriceProMonthly}
                  onChange={(e) => setConfig({ ...config, stripePriceProMonthly: e.target.value })}
                  placeholder="price_xxxxxxxxxxxxx"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Get this from your Stripe Dashboard → Products
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Pro Yearly Price ID
                </label>
                <input
                  type="text"
                  value={config.stripePriceProYearly}
                  onChange={(e) => setConfig({ ...config, stripePriceProYearly: e.target.value })}
                  placeholder="price_xxxxxxxxxxxxx"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* PayPal Configuration */}
        {config.paypalEnabled && (
          <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
            <h2 className="text-xl font-bold mb-4">PayPal Configuration</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Pro Monthly Plan ID
                </label>
                <input
                  type="text"
                  value={config.paypalPlanProMonthly}
                  onChange={(e) => setConfig({ ...config, paypalPlanProMonthly: e.target.value })}
                  placeholder="P-xxxxxxxxxxxxx"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Get this from your PayPal Dashboard → Products & Services
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Pro Yearly Plan ID
                </label>
                <input
                  type="text"
                  value={config.paypalPlanProYearly}
                  onChange={(e) => setConfig({ ...config, paypalPlanProYearly: e.target.value })}
                  placeholder="P-xxxxxxxxxxxxx"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Setup Instructions</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
            <li>Create products and prices in your Stripe/PayPal dashboard</li>
            <li>Copy the Price IDs / Plan IDs and paste them above</li>
            <li>Make sure webhook endpoints are configured correctly</li>
            <li>Test payments in sandbox mode before going live</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
