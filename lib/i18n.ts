export type Locale = 'en' | 'zh'

export interface Translations {
  // Header
  create: string
  community: string
  pricing: string
  signIn: string
  signOut: string
  settings: string
  adminPanel: string
  back: string

  // Home
  poweredByAI: string
  heroTitle1: string
  heroTitle2: string
  heroSubtitle: string
  startCreatingFree: string
  viewExamples: string

  // Stats
  imagesGenerated: string
  happyUsers: string
  averageSpeed: string
  maxQuality: string

  // Features
  threePowerfulFeatures: string
  parallelUniverse: string
  parallelUniverseDesc: string
  aiPranks: string
  aiPranksDesc: string
  instantOutfit: string
  instantOutfitDesc: string

  // Benefits
  lightningFast: string
  lightningFastDesc: string
  privacyFirst: string
  privacyFirstDesc: string
  professionalQuality: string
  professionalQualityDesc: string

  // CTA
  readyToTransform: string
  joinThousands: string
  getStartedNow: string

  // Create Page
  chooseYourMagic: string
  selectTransformation: string
  changeFeature: string
  qualityMode: string
  yourPhoto: string
  uploadPhoto: string
  uploadHint: string
  changePhoto: string
  generatedResult: string
  download: string
  share: string
  chooseTemplate: string
  random: string
  generatingMagic: string
  usingMode: string
  uploadToStart: string

  // Quality Modes
  standard: string
  standardDesc: string
  pro: string
  proDesc: string
  max: string
  maxDesc: string
  credits: string

  // Footer
  allRightsReserved: string
  support: string
}

export const translations: Record<Locale, Translations> = {
  en: {
    // Header
    create: 'Create',
    community: 'Community',
    pricing: 'Pricing',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    settings: 'Settings',
    adminPanel: 'Admin Panel',
    back: 'Back',

    // Home
    poweredByAI: '✨ Powered by Advanced AI',
    heroTitle1: 'Transform Your Photos',
    heroTitle2: 'Into Viral Content',
    heroSubtitle: 'Create stunning AI transformations in seconds. No design skills needed.',
    startCreatingFree: 'Start Creating Free',
    viewExamples: 'View Examples',

    // Stats
    imagesGenerated: 'Images Generated',
    happyUsers: 'Happy Users',
    averageSpeed: 'Average Speed',
    maxQuality: 'Max Quality',

    // Features
    threePowerfulFeatures: 'Three Powerful Features',
    parallelUniverse: 'Parallel Universe',
    parallelUniverseDesc: 'Transform into astronaut, rockstar, chef, cyberpunk warrior and more',
    aiPranks: 'AI Pranks',
    aiPranksDesc: 'Create believable fake photos - Maldives, Dubai, Mars, luxury cars',
    instantOutfit: 'Instant Outfit',
    instantOutfitDesc: 'Try different fashion styles instantly without changing clothes',

    // Benefits
    lightningFast: 'Lightning Fast',
    lightningFastDesc: 'Generate stunning images in under 2 seconds',
    privacyFirst: 'Privacy First',
    privacyFirstDesc: 'Your photos are processed securely and never stored',
    professionalQuality: 'Professional Quality',
    professionalQualityDesc: 'Up to 4K resolution with no watermark on Pro plan',

    // CTA
    readyToTransform: 'Ready to Transform Your Photos?',
    joinThousands: 'Join thousands of creators making viral content with AI. Start free, no credit card required.',
    getStartedNow: 'Get Started Now',

    // Create Page
    chooseYourMagic: 'Choose Your Magic',
    selectTransformation: 'Select a transformation type to get started',
    changeFeature: 'Change Feature',
    qualityMode: 'Quality Mode',
    yourPhoto: 'Your Photo',
    uploadPhoto: 'Upload a photo',
    uploadHint: 'PNG, JPG up to 20MB',
    changePhoto: 'Change Photo',
    generatedResult: 'Generated Result',
    download: 'Download',
    share: 'Share',
    chooseTemplate: 'Choose a Template',
    random: 'Random',
    generatingMagic: 'Generating magic...',
    usingMode: 'Using',
    uploadToStart: 'Upload a photo to start creating',

    // Quality Modes
    standard: 'Standard',
    standardDesc: 'Fast generation, good quality',
    pro: 'Pro',
    proDesc: 'High quality, detailed',
    max: 'Max',
    maxDesc: 'Maximum quality, ultra detailed',
    credits: 'credits',

    // Footer
    allRightsReserved: 'All rights reserved',
    support: 'Support'
  },
  zh: {
    // Header
    create: '创作',
    community: '社区',
    pricing: '定价',
    signIn: '登录',
    signOut: '退出登录',
    settings: '设置',
    adminPanel: '管理面板',
    back: '返回',

    // Home
    poweredByAI: '✨ 先进 AI 技术驱动',
    heroTitle1: '让你的照片',
    heroTitle2: '变成爆款内容',
    heroSubtitle: '几秒钟创建惊艳的 AI 变换效果，无需设计技能。',
    startCreatingFree: '免费开始创作',
    viewExamples: '查看示例',

    // Stats
    imagesGenerated: '图片生成',
    happyUsers: '满意用户',
    averageSpeed: '平均速度',
    maxQuality: '最高质量',

    // Features
    threePowerfulFeatures: '三大强大功能',
    parallelUniverse: '平行宇宙',
    parallelUniverseDesc: '变身宇航员、摇滚明星、大厨、赛博朋克战士等',
    aiPranks: 'AI 恶搞',
    aiPranksDesc: '创建逼真的假照片 - 马尔代夫、迪拜、火星、豪车',
    instantOutfit: '瞬间换装',
    instantOutfitDesc: '无需换衣服即可尝试不同时尚风格',

    // Benefits
    lightningFast: '闪电般快速',
    lightningFastDesc: '2 秒内生成惊艳图片',
    privacyFirst: '隐私优先',
    privacyFirstDesc: '您的照片安全处理，绝不存储',
    professionalQuality: '专业品质',
    professionalQualityDesc: 'Pro 套餐支持 4K 分辨率，无水印',

    // CTA
    readyToTransform: '准备好变换你的照片了吗？',
    joinThousands: '加入数千名创作者，用 AI 制作爆款内容。免费开始，无需信用卡。',
    getStartedNow: '立即开始',

    // Create Page
    chooseYourMagic: '选择你的魔法',
    selectTransformation: '选择一个变换类型开始创作',
    changeFeature: '更换功能',
    qualityMode: '质量模式',
    yourPhoto: '你的照片',
    uploadPhoto: '上传照片',
    uploadHint: 'PNG、JPG 最大 20MB',
    changePhoto: '更换照片',
    generatedResult: '生成结果',
    download: '下载',
    share: '分享',
    chooseTemplate: '选择模板',
    random: '随机',
    generatingMagic: '正在生成魔法...',
    usingMode: '使用',
    uploadToStart: '上传照片开始创作',

    // Quality Modes
    standard: '标准',
    standardDesc: '快速生成，良好质量',
    pro: '专业',
    proDesc: '高质量，细节丰富',
    max: '极致',
    maxDesc: '最高质量，超精细',
    credits: '积分',

    // Footer
    allRightsReserved: '版权所有',
    support: '支持'
  }
}

export function getTranslations(locale: Locale): Translations {
  return translations[locale]
}
