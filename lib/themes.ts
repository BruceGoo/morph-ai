export type ThemeType = 'tech-blue' | 'dopamine' | 'warm'

export interface Theme {
  id: ThemeType
  name: string
  nameCn: string
  description: string
  descriptionCn: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    gradient: string
    cardGradient: string
    buttonGradient: string
    buttonHover: string
    textGradient: string
    borderHover: string
    iconBg: string
    badgeBg: string
    badgeBorder: string
    badgeText: string
    loadingBg: string
    loadingBorder: string
    loadingSpin: string
  }
}

export const themes: Record<ThemeType, Theme> = {
  'tech-blue': {
    id: 'tech-blue',
    name: 'Tech Blue',
    nameCn: '科技蓝',
    description: 'Modern and professional',
    descriptionCn: '现代专业风格',
    colors: {
      primary: 'blue',
      secondary: 'cyan',
      accent: 'teal',
      background: 'from-slate-950 via-blue-950 to-slate-950',
      gradient: 'from-blue-500 to-cyan-500',
      cardGradient: 'from-blue-900/50 to-cyan-900/50',
      buttonGradient: 'from-blue-600 to-cyan-600',
      buttonHover: 'from-blue-700 to-cyan-700',
      textGradient: 'from-blue-400 via-cyan-400 to-blue-400',
      borderHover: 'border-blue-500/50',
      iconBg: 'bg-blue-500/10',
      badgeBg: 'bg-blue-500/10',
      badgeBorder: 'border-blue-500/20',
      badgeText: 'text-blue-400',
      loadingBg: 'bg-blue-500/10',
      loadingBorder: 'border-blue-500/20',
      loadingSpin: 'border-blue-400'
    }
  },
  'dopamine': {
    id: 'dopamine',
    name: 'Dopamine',
    nameCn: '多巴胺',
    description: 'Vibrant and energetic',
    descriptionCn: '活力多彩风格',
    colors: {
      primary: 'pink',
      secondary: 'purple',
      accent: 'fuchsia',
      background: 'from-purple-950 via-fuchsia-950 to-purple-950',
      gradient: 'from-pink-500 to-purple-500',
      cardGradient: 'from-pink-900/50 to-purple-900/50',
      buttonGradient: 'from-pink-600 to-purple-600',
      buttonHover: 'from-pink-700 to-purple-700',
      textGradient: 'from-pink-400 via-purple-400 to-pink-400',
      borderHover: 'border-pink-500/50',
      iconBg: 'bg-pink-500/10',
      badgeBg: 'bg-pink-500/10',
      badgeBorder: 'border-pink-500/20',
      badgeText: 'text-pink-400',
      loadingBg: 'bg-pink-500/10',
      loadingBorder: 'border-pink-500/20',
      loadingSpin: 'border-pink-400'
    }
  },
  'warm': {
    id: 'warm',
    name: 'Warm Sunset',
    nameCn: '暖色调',
    description: 'Warm and inviting',
    descriptionCn: '温暖活力风格',
    colors: {
      primary: 'orange',
      secondary: 'amber',
      accent: 'yellow',
      background: 'from-slate-950 via-orange-950 to-slate-950',
      gradient: 'from-orange-500 to-amber-500',
      cardGradient: 'from-orange-900/50 to-amber-900/50',
      buttonGradient: 'from-orange-600 to-amber-600',
      buttonHover: 'from-orange-700 to-amber-700',
      textGradient: 'from-orange-400 via-amber-400 to-orange-400',
      borderHover: 'border-orange-500/50',
      iconBg: 'bg-orange-500/10',
      badgeBg: 'bg-orange-500/10',
      badgeBorder: 'border-orange-500/20',
      badgeText: 'text-orange-400',
      loadingBg: 'bg-orange-500/10',
      loadingBorder: 'border-orange-500/20',
      loadingSpin: 'border-orange-400'
    }
  }
}

export function getTheme(themeId: ThemeType): Theme {
  return themes[themeId]
}
