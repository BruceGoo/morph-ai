'use client'

import { useEffect, useState } from 'react'
import { Heart, MessageCircle, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Header } from '@/components/header'
import { useConfig } from '@/lib/config-context'

interface Generation {
  id: string
  generatedImageUrl: string
  category: string
  templateId: string
  user: {
    name: string | null
    image: string | null
  }
  _count: {
    likes: number
    comments: number
  }
  views: number
  createdAt: string
}

export default function CommunityPage() {
  const { theme, locale } = useConfig()
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'universe' | 'prank' | 'outfit'>('all')

  useEffect(() => {
    fetchGenerations()
  }, [])

  const fetchGenerations = async () => {
    try {
      const response = await fetch('/api/community/feed')
      const data = await response.json()
      setGenerations(data.generations || [])
    } catch (error) {
      console.error('Failed to fetch generations:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredGenerations = filter === 'all'
    ? generations
    : generations.filter(g => g.category === filter)

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.background}`}>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-2 text-white">
            {locale === 'en' ? 'Community Gallery' : '社区画廊'}
          </h2>
          <p className="text-gray-400">
            {locale === 'en' ? 'Discover amazing creations from our community' : '发现社区的精彩创作'}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {[
            { id: 'all', label: locale === 'en' ? 'All' : '全部' },
            { id: 'universe', label: locale === 'en' ? 'Universe' : '平行宇宙' },
            { id: 'prank', label: locale === 'en' ? 'Prank' : '恶搞' },
            { id: 'outfit', label: locale === 'en' ? 'Outfit' : '换装' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filter === f.id
                  ? `bg-gradient-to-r ${theme.colors.buttonGradient} text-white`
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGenerations.map((generation, index) => (
              <motion.div
                key={generation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all"
              >
                <div className="relative aspect-square">
                  <img
                    src={generation.generatedImageUrl}
                    alt="Generated"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                    {generation.category}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${theme.colors.gradient} flex items-center justify-center text-white font-medium`}>
                      {generation.user.name?.[0] || 'U'}
                    </div>
                    <span className="font-medium text-sm text-white">
                      {generation.user.name || 'Anonymous'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-gray-400 text-sm">
                    <button className="flex items-center gap-1 hover:text-red-400 transition-colors">
                      <Heart className="w-4 h-4" />
                      {generation._count.likes}
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      {generation._count.comments}
                    </button>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {generation.views}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredGenerations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">
              {locale === 'en' ? 'No creations yet in this category' : '此分类暂无创作'}
            </p>
            <Link href="/create">
              <Button className={`bg-gradient-to-r ${theme.colors.buttonGradient}`}>
                {locale === 'en' ? 'Be the first to create' : '成为第一个创作者'}
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
