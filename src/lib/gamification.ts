// Sistema de Gamificação Unificado

export interface UserLevel {
  level: number;
  xp: number;
  xpToNextLevel: number;
  title: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'posts' | 'battles' | 'engagement' | 'special';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  criteria: {
    type: string;
    value: number;
  };
  xpReward: number;
  coinReward: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'common' | 'rare' | 'epic' | 'legendary';
  cost: number;
  effects?: string[];
  unlocked: boolean;
  unlockedAt?: string;
}

export interface GamificationData {
  userId: string;
  level: UserLevel;
  coins: number;
  achievements: Achievement[];
  badges: Badge[];
  stats: {
    totalPosts: number;
    totalBattles: number;
    battlesWon: number;
    totalLikes: number;
    totalComments: number;
    totalReactions: number;
    loginStreak: number;
    bestLoginStreak: number;
    lastLoginDate: string;
  };
}

// Definições de XP
const XP_VALUES = {
  CREATE_POST: 10,
  WIN_BATTLE: 50,
  LOSE_BATTLE: 15,
  RECEIVE_LIKE: 2,
  RECEIVE_COMMENT: 5,
  RECEIVE_REACTION: 3,
  DAILY_LOGIN: 10,
  WEEKLY_STREAK: 50,
};

// Títulos por nível
const LEVEL_TITLES = [
  { min: 1, max: 5, title: 'Mentiroso Iniciante' },
  { min: 6, max: 10, title: 'Contador de Lorotas' },
  { min: 11, max: 20, title: 'Fabulista Amador' },
  { min: 21, max: 30, title: 'Criador de Histórias' },
  { min: 31, max: 40, title: 'Mentiroso Experiente' },
  { min: 41, max: 50, title: 'Mestre das Ilusões' },
  { min: 51, max: 75, title: 'Enganador Profissional' },
  { min: 76, max: 100, title: 'Lenda da Mentira' },
  { min: 101, max: 150, title: 'Mito da Lorota' },
  { min: 151, max: 999, title: 'Imperador das Mentiras' },
];

// Definições de achievements
export const ACHIEVEMENTS: Achievement[] = [
  // Posts
  {
    id: 'first-post',
    title: 'Primeira Mentira',
    description: 'Publique sua primeira mentira',
    icon: '📝',
    category: 'posts',
    tier: 'bronze',
    criteria: { type: 'totalPosts', value: 1 },
    xpReward: 50,
    coinReward: 10,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'posts-10',
    title: 'Mentiroso Amador',
    description: 'Publique 10 mentiras',
    icon: '📚',
    category: 'posts',
    tier: 'silver',
    criteria: { type: 'totalPosts', value: 10 },
    xpReward: 100,
    coinReward: 30,
    unlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'posts-50',
    title: 'Mentiroso Profissional',
    description: 'Publique 50 mentiras',
    icon: '📖',
    category: 'posts',
    tier: 'gold',
    criteria: { type: 'totalPosts', value: 50 },
    xpReward: 500,
    coinReward: 100,
    unlocked: false,
    progress: 0,
    maxProgress: 50,
  },
  
  // Battles
  {
    id: 'first-battle-win',
    title: 'Primeira Vitória',
    description: 'Vença sua primeira batalha',
    icon: '🏆',
    category: 'battles',
    tier: 'bronze',
    criteria: { type: 'battlesWon', value: 1 },
    xpReward: 100,
    coinReward: 20,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'battles-won-10',
    title: 'Gladiador',
    description: 'Vença 10 batalhas',
    icon: '⚔️',
    category: 'battles',
    tier: 'silver',
    criteria: { type: 'battlesWon', value: 10 },
    xpReward: 300,
    coinReward: 50,
    unlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'battles-won-50',
    title: 'Campeão Supremo',
    description: 'Vença 50 batalhas',
    icon: '👑',
    category: 'battles',
    tier: 'platinum',
    criteria: { type: 'battlesWon', value: 50 },
    xpReward: 1000,
    coinReward: 200,
    unlocked: false,
    progress: 0,
    maxProgress: 50,
  },
  
  // Engagement
  {
    id: 'likes-100',
    title: 'Popular',
    description: 'Receba 100 curtidas',
    icon: '❤️',
    category: 'engagement',
    tier: 'silver',
    criteria: { type: 'totalLikes', value: 100 },
    xpReward: 200,
    coinReward: 40,
    unlocked: false,
    progress: 0,
    maxProgress: 100,
  },
  {
    id: 'comments-50',
    title: 'Conversador',
    description: 'Receba 50 comentários',
    icon: '💬',
    category: 'engagement',
    tier: 'silver',
    criteria: { type: 'totalComments', value: 50 },
    xpReward: 150,
    coinReward: 30,
    unlocked: false,
    progress: 0,
    maxProgress: 50,
  },
  
  // Special
  {
    id: 'login-streak-7',
    title: 'Dedicado',
    description: 'Faça login por 7 dias seguidos',
    icon: '🔥',
    category: 'special',
    tier: 'silver',
    criteria: { type: 'loginStreak', value: 7 },
    xpReward: 200,
    coinReward: 50,
    unlocked: false,
    progress: 0,
    maxProgress: 7,
  },
  {
    id: 'login-streak-30',
    title: 'Viciado',
    description: 'Faça login por 30 dias seguidos',
    icon: '💎',
    category: 'special',
    tier: 'diamond',
    criteria: { type: 'loginStreak', value: 30 },
    xpReward: 1000,
    coinReward: 300,
    unlocked: false,
    progress: 0,
    maxProgress: 30,
  },
];

// Definições de badges
export const BADGES: Badge[] = [
  {
    id: 'colorful-lies',
    name: 'Mentiras Coloridas',
    description: 'Suas mentiras ganham destaque com cores',
    icon: '🌈',
    tier: 'common',
    cost: 100,
    effects: ['text-gradient'],
    unlocked: false,
  },
  {
    id: 'crown-of-lies',
    name: 'Coroa das Mentiras',
    description: 'Exiba uma coroa ao lado do seu nome',
    icon: '👑',
    tier: 'rare',
    cost: 300,
    effects: ['crown-icon'],
    unlocked: false,
  },
  {
    id: 'fire-effect',
    name: 'Mentiras em Chamas',
    description: 'Suas mentiras aparecem com efeito de fogo',
    icon: '🔥',
    tier: 'epic',
    cost: 500,
    effects: ['fire-animation'],
    unlocked: false,
  },
  {
    id: 'legendary-liar',
    name: 'Mentiroso Lendário',
    description: 'O badge supremo para os maiores mentirosos',
    icon: '✨',
    tier: 'legendary',
    cost: 1000,
    effects: ['rainbow-glow', 'special-border'],
    unlocked: false,
  },
];

// Funções auxiliares
export function calculateLevel(xp: number): UserLevel {
  const level = Math.floor(Math.sqrt(xp / 50)) + 1;
  const currentLevelXp = Math.pow(level - 1, 2) * 50;
  const nextLevelXp = Math.pow(level, 2) * 50;
  const xpInCurrentLevel = xp - currentLevelXp;
  const xpToNextLevel = nextLevelXp - currentLevelXp;
  
  const titleInfo = LEVEL_TITLES.find(t => level >= t.min && level <= t.max) 
    || LEVEL_TITLES[LEVEL_TITLES.length - 1];
  
  return {
    level,
    xp: xpInCurrentLevel,
    xpToNextLevel,
    title: titleInfo.title,
  };
}

export function initializeUserGamification(userId: string): GamificationData {
  const existingData = localStorage.getItem(`gamification_${userId}`);
  
  if (existingData) {
    return JSON.parse(existingData);
  }
  
  const initialData: GamificationData = {
    userId,
    level: {
      level: 1,
      xp: 0,
      xpToNextLevel: 50,
      title: 'Mentiroso Iniciante',
    },
    coins: 0,
    achievements: ACHIEVEMENTS.map(a => ({ ...a })),
    badges: BADGES.map(b => ({ ...b })),
    stats: {
      totalPosts: 0,
      totalBattles: 0,
      battlesWon: 0,
      totalLikes: 0,
      totalComments: 0,
      totalReactions: 0,
      loginStreak: 0,
      bestLoginStreak: 0,
      lastLoginDate: new Date().toISOString(),
    },
  };
  
  saveGamificationData(userId, initialData);
  return initialData;
}

export function saveGamificationData(userId: string, data: GamificationData) {
  localStorage.setItem(`gamification_${userId}`, JSON.stringify(data));
}

export function loadGamificationData(userId: string): GamificationData {
  const data = localStorage.getItem(`gamification_${userId}`);
  return data ? JSON.parse(data) : initializeUserGamification(userId);
}

// Alias para compatibilidade com o código existente
export function getUserData(userId: string): GamificationData {
  return loadGamificationData(userId);
}

// Funções para adicionar XP
export function addXP(userId: string, amount: number, reason: string): GamificationData {
  const data = loadGamificationData(userId);
  const totalXp = (data.level.level - 1) * (data.level.level - 1) * 50 + data.level.xp + amount;
  data.level = calculateLevel(totalXp);
  
  saveGamificationData(userId, data);
  return data;
}

// Função para verificar e desbloquear achievements
export function checkAchievements(userId: string): Achievement[] {
  const data = loadGamificationData(userId);
  const unlockedNow: Achievement[] = [];
  
  data.achievements.forEach(achievement => {
    if (!achievement.unlocked) {
      const statValue = data.stats[achievement.criteria.type as keyof typeof data.stats] as number;
      
      if (statValue >= achievement.criteria.value) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date().toISOString();
        achievement.progress = achievement.maxProgress;
        
        // Adicionar recompensas
        data.coins += achievement.coinReward;
        addXP(userId, achievement.xpReward, `Achievement: ${achievement.title}`);
        
        unlockedNow.push(achievement);
      } else {
        achievement.progress = Math.min(statValue, achievement.maxProgress);
      }
    }
  });
  
  saveGamificationData(userId, data);
  return unlockedNow;
}

// Função para desbloquear badge
export function unlockBadge(userId: string, badgeId: string): boolean {
  const data = loadGamificationData(userId);
  const badge = data.badges.find(b => b.id === badgeId);
  
  if (!badge || badge.unlocked) return false;
  
  if (data.coins >= badge.cost) {
    data.coins -= badge.cost;
    badge.unlocked = true;
    badge.unlockedAt = new Date().toISOString();
    
    saveGamificationData(userId, data);
    return true;
  }
  
  return false;
}

// Função para atualizar estatísticas
export function updateStats(userId: string, updates: Partial<GamificationData['stats']>): GamificationData {
  const data = loadGamificationData(userId);
  
  Object.entries(updates).forEach(([key, value]) => {
    if (key in data.stats) {
      (data.stats as any)[key] = value;
    }
  });
  
  // Verificar login streak
  const today = new Date().toDateString();
  const lastLogin = new Date(data.stats.lastLoginDate).toDateString();
  
  if (today !== lastLogin) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (yesterday.toDateString() === lastLogin) {
      data.stats.loginStreak++;
      if (data.stats.loginStreak > data.stats.bestLoginStreak) {
        data.stats.bestLoginStreak = data.stats.loginStreak;
      }
    } else {
      data.stats.loginStreak = 1;
    }
    
    data.stats.lastLoginDate = new Date().toISOString();
    addXP(userId, XP_VALUES.DAILY_LOGIN, 'Daily Login');
  }
  
  saveGamificationData(userId, data);
  checkAchievements(userId);
  
  return data;
}

// Função para ações específicas
export function onPostCreated(userId: string) {
  const data = loadGamificationData(userId);
  data.stats.totalPosts++;
  updateStats(userId, { totalPosts: data.stats.totalPosts });
  addXP(userId, XP_VALUES.CREATE_POST, 'Post Created');
}

export function onBattleWon(userId: string) {
  const data = loadGamificationData(userId);
  data.stats.battlesWon++;
  data.stats.totalBattles++;
  updateStats(userId, { 
    battlesWon: data.stats.battlesWon,
    totalBattles: data.stats.totalBattles 
  });
  addXP(userId, XP_VALUES.WIN_BATTLE, 'Battle Won');
}

export function onBattleLost(userId: string) {
  const data = loadGamificationData(userId);
  data.stats.totalBattles++;
  updateStats(userId, { totalBattles: data.stats.totalBattles });
  addXP(userId, XP_VALUES.LOSE_BATTLE, 'Battle Lost');
}

export function onReceiveLike(userId: string) {
  const data = loadGamificationData(userId);
  data.stats.totalLikes++;
  updateStats(userId, { totalLikes: data.stats.totalLikes });
  addXP(userId, XP_VALUES.RECEIVE_LIKE, 'Like Received');
}

export function onReceiveComment(userId: string) {
  const data = loadGamificationData(userId);
  data.stats.totalComments++;
  updateStats(userId, { totalComments: data.stats.totalComments });
  addXP(userId, XP_VALUES.RECEIVE_COMMENT, 'Comment Received');
}

export function onReceiveReaction(userId: string) {
  const data = loadGamificationData(userId);
  data.stats.totalReactions++;
  updateStats(userId, { totalReactions: data.stats.totalReactions });
  addXP(userId, XP_VALUES.RECEIVE_REACTION, 'Reaction Received');
}