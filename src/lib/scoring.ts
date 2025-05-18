// Sistema de pontuação do Mentei App

export interface ScoringAction {
  type: string;
  points: number;
  description: string;
}

export const SCORING_ACTIONS: Record<string, ScoringAction> = {
  // Ações básicas
  CREATE_POST: {
    type: 'CREATE_POST',
    points: 10,
    description: 'Criar uma nova mentira'
  },
  
  // Reações recebidas
  RECEIVE_REACTION_QUASE_ACREDITEI: {
    type: 'RECEIVE_REACTION_QUASE_ACREDITEI',
    points: 5,
    description: 'Alguém quase acreditou na sua mentira'
  },
  RECEIVE_REACTION_HAHAHA: {
    type: 'RECEIVE_REACTION_HAHAHA',
    points: 3,
    description: 'Sua mentira foi engraçada'
  },
  RECEIVE_REACTION_MENTIRA_EPICA: {
    type: 'RECEIVE_REACTION_MENTIRA_EPICA',
    points: 8,
    description: 'Sua mentira foi épica!'
  },
  
  // Comentários
  RECEIVE_COMMENT: {
    type: 'RECEIVE_COMMENT',
    points: 5,
    description: 'Alguém comentou na sua mentira'
  },
  CREATE_COMMENT: {
    type: 'CREATE_COMMENT',
    points: 2,
    description: 'Comentar em uma mentira'
  },
  
  // Batalhas
  WIN_BATTLE: {
    type: 'WIN_BATTLE',
    points: 20,
    description: 'Vencer uma batalha de mentiras'
  },
  LOSE_BATTLE: {
    type: 'LOSE_BATTLE',
    points: 5,
    description: 'Participar de uma batalha'
  },
  VOTE_IN_BATTLE: {
    type: 'VOTE_IN_BATTLE',
    points: 3,
    description: 'Votar em uma batalha'
  },
  
  // Streaks
  DAILY_LOGIN: {
    type: 'DAILY_LOGIN',
    points: 5,
    description: 'Login diário'
  },
  STREAK_3_DAYS: {
    type: 'STREAK_3_DAYS',
    points: 15,
    description: 'Streak de 3 dias'
  },
  STREAK_7_DAYS: {
    type: 'STREAK_7_DAYS',
    points: 30,
    description: 'Streak de 7 dias'
  },
  STREAK_30_DAYS: {
    type: 'STREAK_30_DAYS',
    points: 100,
    description: 'Streak de 30 dias'
  },
  
  // Conquistas
  FIRST_POST: {
    type: 'FIRST_POST',
    points: 20,
    description: 'Primeira mentira criada'
  },
  POPULAR_POST: {
    type: 'POPULAR_POST',
    points: 50,
    description: 'Mentira com mais de 100 reações'
  },
  VIRAL_POST: {
    type: 'VIRAL_POST',
    points: 100,
    description: 'Mentira com mais de 1000 reações'
  },
  
  // Ações negativas (penalidades)
  POST_REPORTED: {
    type: 'POST_REPORTED',
    points: -10,
    description: 'Post denunciado e removido'
  }
};

// Multiplicadores de pontuação
export const SCORE_MULTIPLIERS = {
  PRO_USER: 1.5,
  WEEKEND: 1.2,
  SPECIAL_EVENT: 2.0
};

// Níveis de usuário baseados em pontuação
export const USER_LEVELS = [
  { level: 1, minScore: 0, maxScore: 99, title: 'Mentiroso Iniciante' },
  { level: 2, minScore: 100, maxScore: 299, title: 'Mentiroso Amador' },
  { level: 3, minScore: 300, maxScore: 599, title: 'Mentiroso Experiente' },
  { level: 4, minScore: 600, maxScore: 999, title: 'Mentiroso Profissional' },
  { level: 5, minScore: 1000, maxScore: 1499, title: 'Mentiroso Expert' },
  { level: 6, minScore: 1500, maxScore: 2249, title: 'Mestre das Mentiras' },
  { level: 7, minScore: 2250, maxScore: 2999, title: 'Grão-Mestre das Mentiras' },
  { level: 8, minScore: 3000, maxScore: 3999, title: 'Lenda das Mentiras' },
  { level: 9, minScore: 4000, maxScore: 4999, title: 'Mito das Mentiras' },
  { level: 10, minScore: 5000, maxScore: Infinity, title: 'Deus das Mentiras' }
];

// Função para calcular nível baseado na pontuação
export function calculateLevel(score: number): { level: number; title: string; progress: number } {
  const userLevel = USER_LEVELS.find(level => score >= level.minScore && score <= level.maxScore);
  
  if (!userLevel) {
    return { level: 1, title: 'Mentiroso Iniciante', progress: 0 };
  }
  
  // Calcular progresso para o próximo nível
  let progress = 0;
  if (userLevel.level < USER_LEVELS.length) {
    const nextLevel = USER_LEVELS[userLevel.level];
    const scoreInCurrentLevel = score - userLevel.minScore;
    const levelRange = nextLevel.minScore - userLevel.minScore;
    progress = Math.min(100, Math.round((scoreInCurrentLevel / levelRange) * 100));
  }
  
  return {
    level: userLevel.level,
    title: userLevel.title,
    progress
  };
}

// Função para calcular multiplicador
export function calculateMultiplier(user: { isPro?: boolean }, date?: Date): number {
  let multiplier = 1.0;
  
  // Bônus PRO
  if (user.isPro) {
    multiplier *= SCORE_MULTIPLIERS.PRO_USER;
  }
  
  // Bônus de fim de semana
  const checkDate = date || new Date();
  const dayOfWeek = checkDate.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    multiplier *= SCORE_MULTIPLIERS.WEEKEND;
  }
  
  // TODO: Implementar bônus de eventos especiais
  
  return multiplier;
}

// Função para aplicar pontuação
export function applyScore(
  action: ScoringAction,
  user: { isPro?: boolean },
  date?: Date
): number {
  const multiplier = calculateMultiplier(user, date);
  return Math.round(action.points * multiplier);
}

// Função para calcular ranking
export interface RankingEntry {
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
  score: number;
  level: number;
  title: string;
  position: number;
  battleWins: number;
  totalPosts: number;
}

export type RankingPeriod = 'daily' | 'weekly' | 'monthly' | 'all-time';

export function calculateRankingPosition(users: any[]): RankingEntry[] {
  // Ordenar usuários por pontuação decrescente
  const sortedUsers = users.sort((a, b) => b.pontuacaoTotal - a.pontuacaoTotal);
  
  return sortedUsers.map((user, index) => {
    const levelInfo = calculateLevel(user.pontuacaoTotal);
    
    return {
      userId: user.id,
      username: user.username,
      displayName: user.display_name || user.username,
      avatar: user.avatar || user.image,
      score: user.pontuacaoTotal,
      level: levelInfo.level,
      title: levelInfo.title,
      position: index + 1,
      battleWins: user.battleWins || 0,
      totalPosts: user._count?.posts || 0
    };
  });
}