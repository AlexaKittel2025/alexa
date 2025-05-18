/**
 * Função utilitária para extrair o nível do usuário de forma segura
 * Lida com diferentes formatos de dados de nível
 */
export function getUserLevel(user: any): number {
  if (!user) return 1;
  
  // Se o usuário tem um objeto de gamificação com level
  if (user.level && typeof user.level === 'object') {
    return user.level.level || 1;
  }
  
  // Se o level é um número direto
  if (typeof user.level === 'number') {
    return user.level;
  }
  
  // Se o usuário tem gamificationData
  if (user.gamificationData && user.gamificationData.level) {
    if (typeof user.gamificationData.level === 'object') {
      return user.gamificationData.level.level || 1;
    }
    return user.gamificationData.level || 1;
  }
  
  // Valor padrão
  return 1;
}

/**
 * Função utilitária para extrair o score/pontos do usuário de forma segura
 */
export function getUserScore(user: any): number {
  if (!user) return 0;
  
  // Score direto
  if (typeof user.score === 'number') {
    return user.score;
  }
  
  // Points direto
  if (typeof user.points === 'number') {
    return user.points;
  }
  
  // Se o usuário tem um objeto de gamificação
  if (user.level && typeof user.level === 'object') {
    return user.level.xp || 0;
  }
  
  // Se o usuário tem gamificationData
  if (user.gamificationData) {
    if (user.gamificationData.level && typeof user.gamificationData.level === 'object') {
      return user.gamificationData.level.xp || 0;
    }
    return user.gamificationData.coins || 0;
  }
  
  // Valor padrão
  return 0;
}

/**
 * Função utilitária para extrair o título do nível do usuário
 */
export function getUserLevelTitle(user: any): string {
  if (!user) return 'Mentiroso Iniciante';
  
  // Se o usuário tem um objeto de gamificação com level
  if (user.level && typeof user.level === 'object') {
    return user.level.title || 'Mentiroso Iniciante';
  }
  
  // Se o usuário tem gamificationData
  if (user.gamificationData && user.gamificationData.level) {
    if (typeof user.gamificationData.level === 'object') {
      return user.gamificationData.level.title || 'Mentiroso Iniciante';
    }
  }
  
  // Baseado no nível numérico
  const level = getUserLevel(user);
  
  if (level >= 50) return 'Mestre das Mentiras';
  if (level >= 30) return 'Mentiroso Profissional';
  if (level >= 20) return 'Mentiroso Experiente';
  if (level >= 10) return 'Mentiroso Avançado';
  if (level >= 5) return 'Mentiroso Intermediário';
  
  return 'Mentiroso Iniciante';
}