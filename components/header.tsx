'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sparkles, Globe, Palette, ChevronDown, LogOut, User, Settings as SettingsIcon, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useConfig } from '@/lib/config-context'
import { themes } from '@/lib/themes'
import { useSession, signOut } from 'next-auth/react'

export function Header() {
  const router = useRouter()
  const { theme, themeId, setTheme, locale, setLocale, t } = useConfig()
  const { data: session } = useSession()
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  return (
    <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${theme.colors.gradient} flex items-center justify-center`}>
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className={`text-2xl font-bold bg-gradient-to-r ${theme.colors.textGradient} bg-clip-text text-transparent`}>
            Morph AI
          </h1>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/create" className="text-gray-300 hover:text-white transition-colors">
            {t.create}
          </Link>
          <Link href="/community" className="text-gray-300 hover:text-white transition-colors">
            {t.community}
          </Link>
          <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
            {t.pricing}
          </Link>

          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangMenu(!showLangMenu)
                setShowThemeMenu(false)
                setShowUserMenu(false)
              }}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm">{locale === 'en' ? 'EN' : '中文'}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-lg overflow-hidden">
                <button
                  onClick={() => {
                    setLocale('en')
                    setShowLangMenu(false)
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-white/5 transition-colors flex items-center gap-3 ${
                    locale === 'en' ? 'bg-white/10 text-white' : 'text-gray-300'
                  }`}
                >
                  <span className="text-xl">🇺🇸</span>
                  <span className="text-sm">English</span>
                </button>
                <button
                  onClick={() => {
                    setLocale('zh')
                    setShowLangMenu(false)
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-white/5 transition-colors flex items-center gap-3 ${
                    locale === 'zh' ? 'bg-white/10 text-white' : 'text-gray-300'
                  }`}
                >
                  <span className="text-xl">🇨🇳</span>
                  <span className="text-sm">简体中文</span>
                </button>
              </div>
            )}
          </div>

          {/* Theme Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowThemeMenu(!showThemeMenu)
                setShowLangMenu(false)
                setShowUserMenu(false)
              }}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <Palette className="w-4 h-4" />
              <ChevronDown className="w-4 h-4" />
            </button>
            {showThemeMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-lg overflow-hidden">
                {Object.values(themes).map((themeOption) => (
                  <button
                    key={themeOption.id}
                    onClick={() => {
                      setTheme(themeOption.id)
                      setShowThemeMenu(false)
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-white/5 transition-colors flex items-center gap-3 ${
                      themeId === themeOption.id ? 'bg-white/10' : ''
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${themeOption.colors.gradient}`}></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">
                        {locale === 'en' ? themeOption.name : themeOption.nameCn}
                      </div>
                      <div className="text-xs text-gray-400">
                        {locale === 'en' ? themeOption.description : themeOption.descriptionCn}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Menu or Sign In */}
          {session ? (
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu)
                  setShowLangMenu(false)
                  setShowThemeMenu(false)
                }}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="text-sm">{session.user?.name || session.user?.email}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-lg overflow-hidden">
                  {session.user?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors flex items-center gap-3 text-gray-300"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span className="text-sm">{t.adminPanel}</span>
                    </Link>
                  )}
                  <Link
                    href="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors flex items-center gap-3 text-gray-300"
                  >
                    <SettingsIcon className="w-4 h-4" />
                    <span className="text-sm">{t.settings}</span>
                  </Link>
                  <button
                    onClick={() => {
                      setShowUserMenu(false)
                      handleSignOut()
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors flex items-center gap-3 text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">{t.signOut}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/signin">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                {t.signIn}
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
