'use client'

import { useState } from 'react'
import { Upload, Sparkles, Wand2, Shirt, Zap, Shield, Rocket, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Header } from '@/components/header'
import { useConfig } from '@/lib/config-context'

export default function Home() {
  const { theme, t, locale } = useConfig()
  const features = [
    {
      icon: Sparkles,
      title: locale === 'en' ? 'Parallel Universe' : '平行宇宙',
      description: locale === 'en'
        ? 'Transform into astronaut, rockstar, chef, cyberpunk warrior and more'
        : '变身宇航员、摇滚明星、大厨、赛博朋克战士等',
      gradient: 'from-blue-500 to-cyan-500',
      examples: locale === 'en'
        ? ['Astronaut', 'Rockstar', 'Chef', 'Cyberpunk']
        : ['宇航员', '摇滚明星', '大厨', '赛博朋克']
    },
    {
      icon: Wand2,
      title: locale === 'en' ? 'AI Pranks' : 'AI 恶搞',
      description: locale === 'en'
        ? 'Create believable fake photos - Maldives, Dubai, Mars, luxury cars'
        : '创建逼真的假照片 - 马尔代夫、迪拜、火星、豪车',
      gradient: 'from-cyan-500 to-teal-500',
      examples: locale === 'en'
        ? ['Maldives Beach', 'Dubai Skyline', 'Mars Surface', 'Luxury Car']
        : ['马尔代夫海滩', '迪拜天际线', '火星表面', '豪华跑车']
    },
    {
      icon: Shirt,
      title: locale === 'en' ? 'Instant Outfit' : '瞬间换装',
      description: locale === 'en'
        ? 'Try different fashion styles instantly without changing clothes'
        : '无需换衣服即可尝试不同时尚风格',
      gradient: 'from-teal-500 to-blue-500',
      examples: locale === 'en'
        ? ['Casual', 'Business', 'Streetwear', 'Vintage']
        : ['休闲', '商务', '街头', '复古']
    }
  ]

  const stats = [
    { value: '100K+', label: locale === 'en' ? 'Images Generated' : '图片生成' },
    { value: '50K+', label: locale === 'en' ? 'Happy Users' : '满意用户' },
    { value: '<2s', label: locale === 'en' ? 'Average Speed' : '平均速度' },
    { value: '4K', label: locale === 'en' ? 'Max Quality' : '最高质量' }
  ]

  const benefits = [
    {
      icon: Zap,
      title: locale === 'en' ? 'Lightning Fast' : '闪电般快速',
      description: locale === 'en'
        ? 'Generate stunning images in under 2 seconds'
        : '2 秒内生成惊艳图片'
    },
    {
      icon: Shield,
      title: locale === 'en' ? 'Privacy First' : '隐私优先',
      description: locale === 'en'
        ? 'Your photos are processed securely and never stored'
        : '您的照片安全处理，绝不存储'
    },
    {
      icon: Rocket,
      title: locale === 'en' ? 'Professional Quality' : '专业品质',
      description: locale === 'en'
        ? 'Up to 4K resolution with no watermark on Pro plan'
        : 'Pro 套餐支持 4K 分辨率，无水印'
    }
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.background}`}>
      <Header />

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-4 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20"
          >
            <span className="text-blue-400 text-sm font-medium">{t.poweredByAI}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="text-white">{t.heroTitle1}</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {t.heroTitle2}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
          >
            {t.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/create">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-6 text-lg">
                <Sparkles className="w-5 h-5 mr-2" />
                {t.startCreatingFree}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/community">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg">
                {t.viewExamples}
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="mb-20">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold text-white text-center mb-12"
          >
            {t.threePowerfulFeatures}
          </motion.h3>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer group"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 mb-4">{feature.description}</p>
                <div className="flex flex-wrap gap-2">
                  {feature.examples.map((example) => (
                    <span key={example} className="px-3 py-1 rounded-full bg-white/5 text-gray-300 text-xs border border-white/10">
                      {example}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="grid md:grid-cols-3 gap-6 mb-20"
        >
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">{benefit.title}</h4>
              <p className="text-gray-400 text-sm">{benefit.description}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="text-center bg-gradient-to-r from-blue-900/50 to-cyan-900/50 rounded-3xl p-12 border border-blue-500/20"
        >
          <h3 className="text-3xl font-bold text-white mb-4">{t.readyToTransform}</h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            {t.joinThousands}
          </p>
          <Link href="/create">
            <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
              {t.getStartedNow}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-xl mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © 2024 Morph AI. {t.allRightsReserved}
            </div>
            <div className="flex gap-6">
              <Link href="/pricing" className="text-gray-400 hover:text-white text-sm transition-colors">{t.pricing}</Link>
              <Link href="/community" className="text-gray-400 hover:text-white text-sm transition-colors">{t.community}</Link>
              <a href="mailto:support@morph.ai" className="text-gray-400 hover:text-white text-sm transition-colors">{t.support}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
