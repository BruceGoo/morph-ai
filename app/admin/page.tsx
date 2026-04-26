'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Header } from '@/components/header'
import { useConfig } from '@/lib/config-context'
import {
  Users,
  CreditCard,
  Image as ImageIcon,
  DollarSign,
  UserCheck
} from 'lucide-react'

interface Stats {
  totalUsers: number
  activeUsers: number
  totalGenerations: number
  totalRevenue: number
  freeUsers: number
  proUsers: number
  enterpriseUsers: number
}

interface User {
  id: string
  email: string
  name: string | null
  role: string
  subscriptionTier: string
  totalGenerations: number
  createdAt: string
}

interface Payment {
  id: string
  amount: number
  currency: string
  status: string
  subscriptionTier: string | null
  createdAt: string
  user: {
    email: string
    name: string | null
  }
}

export default function AdminPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { theme, locale } = useConfig()
  const [stats, setStats] = useState<Stats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/')
      return
    }

    fetchData()
  }, [session, status, router])

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, paymentsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/users'),
        fetch('/api/admin/payments')
      ])

      if (statsRes.ok) setStats(await statsRes.json())
      if (usersRes.ok) setUsers(await usersRes.json())
      if (paymentsRes.ok) setPayments(await paymentsRes.json())
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.colors.background}`}>
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'ADMIN') {
    return null
  }

  const statCards = [
    {
      icon: Users,
      label: locale === 'en' ? 'Total Users' : '总用户数',
      value: stats?.totalUsers || 0,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: UserCheck,
      label: locale === 'en' ? 'Active Users' : '活跃用户',
      value: stats?.activeUsers || 0,
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: ImageIcon,
      label: locale === 'en' ? 'Total Generations' : '总生成数',
      value: stats?.totalGenerations || 0,
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: DollarSign,
      label: locale === 'en' ? 'Total Revenue' : '总收入',
      value: `$${(stats?.totalRevenue || 0).toFixed(2)}`,
      color: 'from-yellow-500 to-orange-500'
    }
  ]

  const tierCards = [
    {
      label: 'Free',
      value: stats?.freeUsers || 0,
      color: 'bg-gray-500/20 border-gray-500/30'
    },
    {
      label: 'Pro',
      value: stats?.proUsers || 0,
      color: 'bg-blue-500/20 border-blue-500/30'
    },
    {
      label: 'Enterprise',
      value: stats?.enterpriseUsers || 0,
      color: 'bg-purple-500/20 border-purple-500/30'
    }
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.background}`}>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {locale === 'en' ? 'Admin Dashboard' : '管理员面板'}
          </h1>
          <p className="text-gray-400">
            {locale === 'en' ? 'Monitor and manage your platform' : '监控和管理您的平台'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{card.value}</div>
              <div className="text-sm text-gray-400">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Subscription Tiers */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            {locale === 'en' ? 'Subscription Distribution' : '订阅分布'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tierCards.map((tier, index) => (
              <div
                key={index}
                className={`${tier.color} border rounded-xl p-4`}
              >
                <div className="text-2xl font-bold text-white mb-1">{tier.value}</div>
                <div className="text-sm text-gray-300">{tier.label} {locale === 'en' ? 'Users' : '用户'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            {locale === 'en' ? 'Recent Users' : '最近用户'}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    {locale === 'en' ? 'Email' : '邮箱'}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    {locale === 'en' ? 'Name' : '姓名'}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    {locale === 'en' ? 'Tier' : '等级'}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    {locale === 'en' ? 'Generations' : '生成数'}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    {locale === 'en' ? 'Joined' : '加入时间'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 10).map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 text-sm text-gray-300">{user.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{user.name || '-'}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        user.subscriptionTier === 'ENTERPRISE' ? 'bg-purple-500/20 text-purple-300' :
                        user.subscriptionTier === 'PRO' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-gray-500/20 text-gray-300'
                      }`}>
                        {user.subscriptionTier}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-300">{user.totalGenerations}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            {locale === 'en' ? 'Recent Payments' : '最近支付'}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    {locale === 'en' ? 'User' : '用户'}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    {locale === 'en' ? 'Amount' : '金额'}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    {locale === 'en' ? 'Plan' : '计划'}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    {locale === 'en' ? 'Status' : '状态'}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    {locale === 'en' ? 'Date' : '日期'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.slice(0, 10).map((payment) => (
                  <tr key={payment.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 text-sm text-gray-300">
                      {payment.user.name || payment.user.email}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-300">
                      {payment.currency} {payment.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-300">
                      {payment.subscriptionTier || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        payment.status === 'COMPLETED' ? 'bg-green-500/20 text-green-300' :
                        payment.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-300">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
