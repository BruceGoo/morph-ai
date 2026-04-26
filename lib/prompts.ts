export const universePrompts = {
  astronaut: {
    name: 'Astronaut',
    prompt: 'professional astronaut in detailed NASA spacesuit, inside International Space Station, floating in zero gravity, Earth visible through window, cinematic lighting, ultra realistic, 8k',
    negativePrompt: 'cartoon, anime, low quality, blurry'
  },
  rockstar: {
    name: 'Rock Star',
    prompt: 'rock star performing on stage, electric guitar, dramatic stage lighting, smoke effects, leather jacket, energetic pose, concert crowd in background, professional photography',
    negativePrompt: 'cartoon, anime, low quality'
  },
  chef: {
    name: 'Michelin Chef',
    prompt: 'michelin star chef in professional white chef uniform, modern luxury restaurant kitchen, plating gourmet dish, professional kitchen lighting, culinary artistry, high-end photography',
    negativePrompt: 'cartoon, anime, low quality'
  },
  cyberpunk: {
    name: 'Cyberpunk',
    prompt: 'cyberpunk character, neon city background, futuristic clothing, glowing tech implants, rain-soaked streets, blade runner aesthetic, cinematic, highly detailed',
    negativePrompt: 'cartoon, low quality, blurry'
  },
  '80s': {
    name: '80s Disco',
    prompt: '1980s disco dancer, colorful retro outfit, disco ball lighting, dance floor, vintage aesthetic, film grain, nostalgic vibe, professional photography',
    negativePrompt: 'modern, cartoon, low quality'
  },
  medieval: {
    name: 'Medieval Knight',
    prompt: 'medieval knight in shining armor, castle background, holding sword and shield, dramatic lighting, historical accuracy, epic fantasy, cinematic',
    negativePrompt: 'modern, cartoon, low quality'
  }
}

export const prankPrompts = {
  maldives: {
    name: 'Maldives Beach',
    prompt: 'luxury overwater villa in Maldives, crystal clear turquoise water, tropical paradise, person relaxing, professional travel photography, golden hour lighting',
    negativePrompt: 'cartoon, low quality, fake looking'
  },
  dubai: {
    name: 'Dubai Tower',
    prompt: 'person at top of Burj Khalifa Dubai, cityscape view, luxury setting, golden hour, professional photography, breathtaking view',
    negativePrompt: 'cartoon, low quality'
  },
  mars: {
    name: 'Mars Surface',
    prompt: 'astronaut on Mars surface, red planet landscape, space suit, Mars rover in background, NASA quality, realistic space photography',
    negativePrompt: 'cartoon, fake, low quality'
  },
  lambo: {
    name: 'Lamborghini',
    prompt: 'person sitting in luxury Lamborghini sports car, leather interior, dashboard view, expensive car, professional automotive photography',
    negativePrompt: 'cartoon, low quality'
  },
  jet: {
    name: 'Private Jet',
    prompt: 'inside private jet, luxury aircraft interior, leather seats, person relaxing, champagne, wealthy lifestyle, professional photography',
    negativePrompt: 'cartoon, low quality'
  },
  yacht: {
    name: 'Luxury Yacht',
    prompt: 'person on luxury yacht deck, ocean view, sunset, expensive lifestyle, professional photography, Mediterranean sea',
    negativePrompt: 'cartoon, low quality'
  }
}

export const outfitPrompts = {
  punk: {
    name: 'Punk Rock',
    prompt: 'punk rock style outfit, leather jacket with studs, ripped jeans, band t-shirt, edgy fashion, urban background, professional fashion photography',
    negativePrompt: 'cartoon, low quality'
  },
  kpop: {
    name: 'K-Pop Idol',
    prompt: 'K-pop idol fashion, trendy Korean street style, colorful outfit, Seoul background, professional fashion photography, modern aesthetic',
    negativePrompt: 'cartoon, low quality'
  },
  harajuku: {
    name: 'Harajuku',
    prompt: 'Harajuku street fashion, colorful Japanese style, Tokyo background, creative outfit, kawaii aesthetic, professional street photography',
    negativePrompt: 'cartoon, low quality'
  },
  supermodel: {
    name: 'Supermodel',
    prompt: 'high fashion supermodel outfit, runway style, designer clothes, professional fashion photography, vogue magazine quality',
    negativePrompt: 'cartoon, low quality'
  },
  hanfu: {
    name: 'Hanfu',
    prompt: 'traditional Chinese Hanfu clothing, elegant silk robes, ancient Chinese garden background, cultural fashion, professional photography',
    negativePrompt: 'cartoon, low quality, modern'
  },
  suit: {
    name: 'Business Suit',
    prompt: 'professional business suit, corporate attire, modern office background, executive style, professional business photography',
    negativePrompt: 'cartoon, low quality'
  }
}

export type PromptCategory = 'universe' | 'prank' | 'outfit'

export interface PromptData {
  name: string
  prompt: string
  negativePrompt: string
}

export function getPrompt(category: PromptCategory, templateId: string): PromptData | undefined {
  const prompts = {
    universe: universePrompts,
    prank: prankPrompts,
    outfit: outfitPrompts
  }

  return prompts[category][templateId as keyof typeof prompts[typeof category]]
}
