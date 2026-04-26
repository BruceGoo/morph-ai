'use client'

import { useState } from 'react'
import { Sparkles, Wand2, Shirt, Shuffle, Download, Share2, Zap, Crown, Rocket, Settings, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Header } from '@/components/header'
import { useConfig } from '@/lib/config-context'

type FeatureType = 'universe' | 'prank' | 'outfit' | null
type QualityMode = 'standard' | 'pro' | 'max'

export default function CreatePage() {
  const { theme, locale, t } = useConfig()
  const [selectedFeature, setSelectedFeature] = useState<FeatureType>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [qualityMode, setQualityMode] = useState<QualityMode>('standard')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const qualityModes = [
    {
      id: 'standard' as const,
      name: t.standard,
      icon: Zap,
      speed: '~2s',
      resolution: '720p',
      credits: 2,
      description: t.standardDesc
    },
    {
      id: 'pro' as const,
      name: t.pro,
      icon: Crown,
      speed: '~5s',
      resolution: '1080p',
      credits: 12,
      description: t.proDesc
    },
    {
      id: 'max' as const,
      name: t.max,
      icon: Rocket,
      speed: '~10s',
      resolution: '4K',
      credits: 24,
      description: t.maxDesc
    }
  ]

  const features = [
    {
      id: 'universe' as const,
      icon: Sparkles,
      title: locale === 'en' ? 'Parallel Universe' : '平行宇宙',
      description: locale === 'en' ? 'Transform into alternate realities' : '变身到平行现实',
      gradient: 'from-blue-500 to-cyan-500',
      templates: locale === 'en' ? [
        { id: 'astronaut', name: 'Astronaut', emoji: '🚀' },
        { id: 'rockstar', name: 'Rock Star', emoji: '🎸' },
        { id: 'chef', name: 'Michelin Chef', emoji: '👨‍🍳' },
        { id: 'cyberpunk', name: 'Cyberpunk', emoji: '🤖' },
        { id: '80s', name: '80s Disco', emoji: '🕺' },
        { id: 'medieval', name: 'Medieval Knight', emoji: '⚔️' },
      ] : [
        { id: 'astronaut', name: '宇航员', emoji: '🚀' },
        { id: 'rockstar', name: '摇滚明星', emoji: '🎸' },
        { id: 'chef', name: '米其林大厨', emoji: '👨‍🍳' },
        { id: 'cyberpunk', name: '赛博朋克', emoji: '🤖' },
        { id: '80s', name: '80年代迪斯科', emoji: '🕺' },
        { id: 'medieval', name: '中世纪骑士', emoji: '⚔️' },
      ]
    },
    {
      id: 'prank' as const,
      icon: Wand2,
      title: locale === 'en' ? 'AI Pranks' : 'AI 恶搞',
      description: locale === 'en' ? 'Create believable fake photos' : '创建逼真的假照片',
      gradient: 'from-cyan-500 to-teal-500',
      templates: locale === 'en' ? [
        { id: 'maldives', name: 'Maldives Beach', emoji: '🏝️' },
        { id: 'dubai', name: 'Dubai Tower', emoji: '🏙️' },
        { id: 'mars', name: 'Mars Surface', emoji: '🔴' },
        { id: 'lambo', name: 'Lamborghini', emoji: '🏎️' },
        { id: 'jet', name: 'Private Jet', emoji: '✈️' },
        { id: 'yacht', name: 'Luxury Yacht', emoji: '🛥️' },
      ] : [
        { id: 'maldives', name: '马尔代夫海滩', emoji: '🏝️' },
        { id: 'dubai', name: '迪拜塔', emoji: '🏙️' },
        { id: 'mars', name: '火星表面', emoji: '🔴' },
        { id: 'lambo', name: '兰博基尼', emoji: '🏎️' },
        { id: 'jet', name: '私人飞机', emoji: '✈️' },
        { id: 'yacht', name: '豪华游艇', emoji: '🛥️' },
      ]
    },
    {
      id: 'outfit' as const,
      icon: Shirt,
      title: locale === 'en' ? 'Instant Outfit' : '瞬间换装',
      description: locale === 'en' ? 'Try any style instantly' : '瞬间尝试任何风格',
      gradient: 'from-teal-500 to-blue-500',
      templates: locale === 'en' ? [
        { id: 'punk', name: 'Punk Rock', emoji: '🎸' },
        { id: 'kpop', name: 'K-Pop Idol', emoji: '💫' },
        { id: 'harajuku', name: 'Harajuku', emoji: '🌸' },
        { id: 'supermodel', name: 'Supermodel', emoji: '👗' },
        { id: 'hanfu', name: 'Hanfu', emoji: '🏮' },
        { id: 'suit', name: 'Business Suit', emoji: '💼' },
      ] : [
        { id: 'punk', name: '朋克摇滚', emoji: '🎸' },
        { id: 'kpop', name: 'K-Pop偶像', emoji: '💫' },
        { id: 'harajuku', name: '原宿风', emoji: '🌸' },
        { id: 'supermodel', name: '超模', emoji: '👗' },
        { id: 'hanfu', name: '汉服', emoji: '🏮' },
        { id: 'suit', name: '商务西装', emoji: '💼' },
      ]
    }
  ]

  const handleGenerate = async (templateId: string) => {
    setIsGenerating(true)
    setSelectedTemplate(templateId)
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000))
    setGeneratedImage(uploadedImage) // Placeholder
    setIsGenerating(false)
  }

  const selectedFeatureData = features.find(f => f.id === selectedFeature)
  const selectedQuality = qualityModes.find(q => q.id === qualityMode)

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.background}`}>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!selectedFeature ? (
            <motion.div
              key="feature-select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">{t.chooseYourMagic}</h2>
                <p className="text-gray-400">{t.selectTransformation}</p>
              </div>
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {features.map((feature) => (
                  <motion.button
                    key={feature.id}
                    onClick={() => setSelectedFeature(feature.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-blue-500/50 transition-all text-left group"
                  >
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="template-select"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedFeature(null)}
                  className="gap-2 text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t.changeFeature}
                </Button>
                <h2 className="text-3xl font-bold text-white">{selectedFeatureData?.title}</h2>
              </div>

              {/* Quality Mode Selection */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="w-5 h-5 text-gray-400" />
                  <h3 className="text-lg font-semibold text-white">{t.qualityMode}</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {qualityModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setQualityMode(mode.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        qualityMode === mode.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <mode.icon className={`w-5 h-5 ${qualityMode === mode.id ? 'text-blue-400' : 'text-gray-400'}`} />
                        <span className={`font-semibold ${qualityMode === mode.id ? 'text-white' : 'text-gray-300'}`}>
                          {mode.name}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="text-gray-400">{mode.description}</div>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-gray-500">{mode.speed}</span>
                          <span className="text-gray-500">{mode.resolution}</span>
                          <span className={qualityMode === mode.id ? 'text-blue-400' : 'text-gray-500'}>
                            {mode.credits} {t.credits}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left: Image Upload/Preview */}
                <div className="space-y-4">
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">{t.yourPhoto}</h3>
                    {!uploadedImage ? (
                      <label className="block">
                        <div className="border-2 border-dashed border-blue-500/30 rounded-xl p-12 text-center hover:border-blue-500/50 transition-colors cursor-pointer bg-white/5">
                          <Sparkles className="w-12 h-12 mx-auto mb-3 text-blue-400" />
                          <p className="font-medium text-white mb-1">{t.uploadPhoto}</p>
                          <p className="text-sm text-gray-400">{t.uploadHint}</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onloadend = () => setUploadedImage(reader.result as string)
                              reader.readAsDataURL(file)
                            }
                          }}
                        />
                      </label>
                    ) : (
                      <div className="space-y-4">
                        <img src={uploadedImage} alt="Uploaded" className="w-full rounded-lg" />
                        <Button
                          variant="outline"
                          className="w-full border-white/20 text-white hover:bg-white/10"
                          onClick={() => setUploadedImage(null)}
                        >
                          {t.changePhoto}
                        </Button>
                      </div>
                    )}
                  </div>

                  {generatedImage && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                    >
                      <h3 className="text-lg font-semibold text-white mb-4">{t.generatedResult}</h3>
                      <img src={generatedImage} alt="Generated" className="w-full rounded-lg mb-4" />
                      <div className="flex gap-2">
                        <Button className="flex-1 gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                          <Download className="w-4 h-4" />
                          {t.download}
                        </Button>
                        <Button variant="outline" className="flex-1 gap-2 border-white/20 text-white hover:bg-white/10">
                          <Share2 className="w-4 h-4" />
                          {t.share}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Right: Templates */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{t.chooseTemplate}</h3>
                    <Button variant="ghost" size="sm" className="gap-2 text-gray-300 hover:text-white hover:bg-white/10">
                      <Shuffle className="w-4 h-4" />
                      {t.random}
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {selectedFeatureData?.templates.map((template) => (
                      <motion.button
                        key={template.id}
                        onClick={() => uploadedImage && handleGenerate(template.id)}
                        disabled={!uploadedImage || isGenerating}
                        whileHover={{ scale: uploadedImage ? 1.05 : 1 }}
                        whileTap={{ scale: uploadedImage ? 0.95 : 1 }}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          uploadedImage
                            ? selectedTemplate === template.id
                              ? 'border-blue-500 bg-blue-500/10'
                              : 'border-white/10 bg-white/5 hover:border-blue-500/50'
                            : 'border-white/5 bg-white/5 cursor-not-allowed opacity-30'
                        }`}
                      >
                        <div className="text-4xl mb-2">{template.emoji}</div>
                        <div className="text-sm font-medium text-white">{template.name}</div>
                      </motion.button>
                    ))}
                  </div>

                  {isGenerating && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-4"
                    >
                      <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-500/10 border border-blue-500/20 rounded-full">
                        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                        <div className="text-left">
                          <div className="text-sm font-medium text-white">{t.generatingMagic}</div>
                          <div className="text-xs text-gray-400">{t.usingMode} {selectedQuality?.name}</div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {!uploadedImage && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      {t.uploadToStart}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
