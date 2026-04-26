'use client'

import { useConfig } from '@/lib/config-context'
import { Button } from '@/components/ui/button'
import { Palette, Globe } from 'lucide-react'
import { Header } from '@/components/header'
import { themes } from '@/lib/themes'

export default function SettingsPage() {
  const { theme, themeId, setTheme, locale, setLocale, t } = useConfig()

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.background}`}>
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Language Selection */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-6 h-6 text-gray-400" />
            <h2 className="text-2xl font-bold text-white">Language / 语言</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => setLocale('en')}
              className={`p-6 rounded-2xl border-2 transition-all text-left ${
                locale === 'en'
                  ? `border-${theme.colors.primary}-500 bg-${theme.colors.primary}-500/10`
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <div className="text-3xl mb-2">🇺🇸</div>
              <div className="text-lg font-semibold text-white mb-1">English</div>
              <div className="text-sm text-gray-400">International</div>
            </button>

            <button
              onClick={() => setLocale('zh')}
              className={`p-6 rounded-2xl border-2 transition-all text-left ${
                locale === 'zh'
                  ? `border-${theme.colors.primary}-500 bg-${theme.colors.primary}-500/10`
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <div className="text-3xl mb-2">🇨🇳</div>
              <div className="text-lg font-semibold text-white mb-1">简体中文</div>
              <div className="text-sm text-gray-400">中国大陆</div>
            </button>
          </div>
        </div>

        {/* Theme Selection */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-6 h-6 text-gray-400" />
            <h2 className="text-2xl font-bold text-white">
              {locale === 'en' ? 'Theme Style' : '主题风格'}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.values(themes).map((themeOption) => (
              <button
                key={themeOption.id}
                onClick={() => setTheme(themeOption.id)}
                className={`p-6 rounded-2xl border-2 transition-all text-left ${
                  themeId === themeOption.id
                    ? `border-${theme.colors.primary}-500 bg-${theme.colors.primary}-500/10`
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${themeOption.colors.gradient} mb-4`}></div>
                <div className="text-lg font-semibold text-white mb-1">
                  {locale === 'en' ? themeOption.name : themeOption.nameCn}
                </div>
                <div className="text-sm text-gray-400">
                  {locale === 'en' ? themeOption.description : themeOption.descriptionCn}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="mt-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">
            {locale === 'en' ? 'Preview' : '预览'}
          </h3>
          <div className="space-y-4">
            <Button className={`bg-gradient-to-r ${theme.colors.buttonGradient} hover:${theme.colors.buttonHover} text-white`}>
              {locale === 'en' ? 'Sample Button' : '示例按钮'}
            </Button>
            <div className={`inline-block px-4 py-2 rounded-full ${theme.colors.badgeBg} border ${theme.colors.badgeBorder}`}>
              <span className={`text-sm font-medium ${theme.colors.badgeText}`}>
                {locale === 'en' ? '✨ Sample Badge' : '✨ 示例标签'}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
