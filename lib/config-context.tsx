'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ThemeType, getTheme, Theme } from './themes'
import { Locale, getTranslations, Translations } from './i18n'

interface ConfigContextType {
  theme: Theme
  themeId: ThemeType
  setTheme: (theme: ThemeType) => void
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translations
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined)

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeType>('tech-blue')
  const [locale, setLocale] = useState<Locale>('en')

  // Load from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType
    const savedLocale = localStorage.getItem('locale') as Locale

    if (savedTheme && ['tech-blue', 'dopamine', 'warm'].includes(savedTheme)) {
      setThemeId(savedTheme)
    }

    if (savedLocale && ['en', 'zh'].includes(savedLocale)) {
      setLocale(savedLocale)
    }
  }, [])

  const handleSetTheme = (newTheme: ThemeType) => {
    setThemeId(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    localStorage.setItem('locale', newLocale)
  }

  const theme = getTheme(themeId)
  const t = getTranslations(locale)

  return (
    <ConfigContext.Provider
      value={{
        theme,
        themeId,
        setTheme: handleSetTheme,
        locale,
        setLocale: handleSetLocale,
        t
      }}
    >
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig() {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider')
  }
  return context
}
