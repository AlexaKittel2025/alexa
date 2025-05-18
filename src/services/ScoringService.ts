import { PrismaClient } from '@prisma/client';
import { 
  SCORING_ACTIONS, 
  applyScore, 
  calculateLevel, 
  ScoringAction,
  RankingPeriod,
  calculateRankingPosition
} from '@/lib/scoring';

const prisma = new PrismaClient();

export class ScoringService {
  // Aplicar pontuação para uma ação
  static async applyScoreToUser(
    userId: string, 
    actionType: keyof typeof SCORING_ACTIONS,
    metadata?: any
  ): Promise<void> {
    try {
      const action = SCORING_ACTIONS[actionType];
      if (!action) {
        throw new Error(`Ação de pontuação inválida: ${actionType}`);
      }

      // Buscar usuário
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { stats: true }
      });

      if (!user) {
        throw new Error(`Usuário não encontrado: ${userId}`);
      }

      // Calcular pontos com multiplicadores
      const points = applyScore(action, { isPro: user.isPro });

      // Atualizar pontuação do usuário
      await prisma.user.update({
        where: { id: userId },
        data: {
          pontuacaoTotal: { increment: points },
          score: { increment: points }
        }
      });

      // Atualizar estatísticas do usuário
      if (user.stats) {
        await prisma.userStats.update({
          where: { userId },
          data: {
            totalPontos: { increment: points },
            pontosDiarios: { increment: points },
            pontosMensais: { increment: points }
          }
        });
      } else {
        // Criar estatísticas se não existirem
        await prisma.userStats.create({
          data: {
            userId,
            totalPontos: points,
            pontosDiarios: points,
            pontosMensais: points
          }
        });
      }

      // Atualizar nível do usuário
      const newScore = user.pontuacaoTotal + points;
      const levelInfo = calculateLevel(newScore);
      
      await prisma.user.update({
        where: { id: userId },
        data: {
          nivelMentiroso: levelInfo.level,
          level: levelInfo.level
        }
      });

      // Criar conquista se atingir novo nível
      if (levelInfo.level > user.nivelMentiroso) {
        await prisma.achievement.create({
          data: {
            userId,
            description: `Alcançou o nível ${levelInfo.level}: ${levelInfo.title}`,
            nivel: levelInfo.level
          }
        });
      }

    } catch (error) {
      console.error('Erro ao aplicar pontuação:', error);
      throw error;
    }
  }

  // Obter ranking de usuários
  static async getRanking(
    period: RankingPeriod = 'all-time',
    limit: number = 10,
    offset: number = 0
  ) {
    try {
      let whereClause = {};
      let orderByField = 'pontuacaoTotal';

      // Filtrar por período
      switch (period) {
        case 'daily':
          orderByField = 'pontosDiarios';
          break;
        case 'weekly':
          // Implementar lógica para semanal
          break;
        case 'monthly':
          orderByField = 'pontosMensais';
          break;
      }

      // Buscar usuários
      const users = await prisma.user.findMany({
        where: whereClause,
        include: {
          stats: true,
          _count: {
            select: {
              posts: true,
              battlesWon: true
            }
          }
        },
        orderBy: period === 'all-time' 
          ? { pontuacaoTotal: 'desc' }
          : { stats: { [orderByField]: 'desc' } },
        take: limit,
        skip: offset
      });

      // Transformar para formato de ranking
      const usersForRanking = users.map(user => ({
        ...user,
        pontuacaoTotal: period === 'all-time' 
          ? user.pontuacaoTotal 
          : user.stats?.[orderByField] || 0,
        battleWins: user._count.battlesWon
      }));

      return calculateRankingPosition(usersForRanking);
    } catch (error) {
      console.error('Erro ao obter ranking:', error);
      return [];
    }
  }

  // Obter posição do usuário no ranking
  static async getUserRankingPosition(userId: string, period: RankingPeriod = 'all-time') {
    try {
      const ranking = await this.getRanking(period, 1000); // Buscar top 1000
      const userPosition = ranking.find(entry => entry.userId === userId);
      
      if (!userPosition) {
        // Se o usuário não estiver no top 1000, calcular posição aproximada
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: { stats: true }
        });

        if (!user) return null;

        let scoreField = period === 'all-time' ? 'pontuacaoTotal' : 'pontosDiarios';
        const score = period === 'all-time' 
          ? user.pontuacaoTotal 
          : user.stats?.[scoreField] || 0;

        // Contar quantos usuários têm pontuação maior
        const usersAbove = await prisma.user.count({
          where: {
            [scoreField]: { gt: score }
          }
        });

        const levelInfo = calculateLevel(user.pontuacaoTotal);

        return {
          userId: user.id,
          username: user.username,
          displayName: user.display_name || user.username,
          avatar: user.avatar || user.image,
          score,
          level: levelInfo.level,
          title: levelInfo.title,
          position: usersAbove + 1,
          battleWins: user.battleWins || 0,
          totalPosts: await prisma.post.count({ where: { authorId: userId } })
        };
      }

      return userPosition;
    } catch (error) {
      console.error('Erro ao obter posição no ranking:', error);
      return null;
    }
  }

  // Resetar pontos diários (executar via cron job)
  static async resetDailyPoints() {
    try {
      await prisma.userStats.updateMany({
        data: { pontosDiarios: 0 }
      });
    } catch (error) {
      console.error('Erro ao resetar pontos diários:', error);
    }
  }

  // Resetar pontos mensais (executar via cron job)
  static async resetMonthlyPoints() {
    try {
      await prisma.userStats.updateMany({
        data: { pontosMensais: 0 }
      });
    } catch (error) {
      console.error('Erro ao resetar pontos mensais:', error);
    }
  }

  // Aplicar pontuação para ações específicas
  static async onPostCreated(userId: string, postId: string) {
    await this.applyScoreToUser(userId, 'CREATE_POST', { postId });

    // Verificar se é o primeiro post
    const postCount = await prisma.post.count({
      where: { authorId: userId }
    });

    if (postCount === 1) {
      await this.applyScoreToUser(userId, 'FIRST_POST', { postId });
    }
  }

  static async onReactionReceived(
    postAuthorId: string, 
    reactionType: string,
    postId: string
  ) {
    switch (reactionType) {
      case 'quaseAcreditei':
        await this.applyScoreToUser(postAuthorId, 'RECEIVE_REACTION_QUASE_ACREDITEI', { postId });
        break;
      case 'hahaha':
        await this.applyScoreToUser(postAuthorId, 'RECEIVE_REACTION_HAHAHA', { postId });
        break;
      case 'mentiraEpica':
        await this.applyScoreToUser(postAuthorId, 'RECEIVE_REACTION_MENTIRA_EPICA', { postId });
        break;
    }

    // Verificar marcos de popularidade
    const reactionCount = await prisma.reaction.count({
      where: { postId }
    });

    if (reactionCount === 100) {
      await this.applyScoreToUser(postAuthorId, 'POPULAR_POST', { postId });
    } else if (reactionCount === 1000) {
      await this.applyScoreToUser(postAuthorId, 'VIRAL_POST', { postId });
    }
  }

  static async onCommentCreated(commenterId: string, postAuthorId: string) {
    await this.applyScoreToUser(commenterId, 'CREATE_COMMENT');
    await this.applyScoreToUser(postAuthorId, 'RECEIVE_COMMENT');
  }

  static async onBattleResult(winnerId: string, loserId: string) {
    await this.applyScoreToUser(winnerId, 'WIN_BATTLE');
    await this.applyScoreToUser(loserId, 'LOSE_BATTLE');
  }

  static async onBattleVote(voterId: string) {
    await this.applyScoreToUser(voterId, 'VOTE_IN_BATTLE');
  }

  static async onDailyLogin(userId: string) {
    await this.applyScoreToUser(userId, 'DAILY_LOGIN');

    // Verificar e atualizar streak
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (user) {
      const today = new Date();
      const lastLogin = user.lastLogin;
      
      let newStreak = 1;
      if (lastLogin) {
        const daysDiff = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
          newStreak = user.currentStreak + 1;
        } else if (daysDiff === 0) {
          return; // Já fez login hoje
        }
      }

      // Atualizar streak
      await prisma.user.update({
        where: { id: userId },
        data: {
          currentStreak: newStreak,
          bestStreak: Math.max(newStreak, user.bestStreak),
          lastLogin: today
        }
      });

      // Aplicar bônus de streak
      if (newStreak === 3) {
        await this.applyScoreToUser(userId, 'STREAK_3_DAYS');
      } else if (newStreak === 7) {
        await this.applyScoreToUser(userId, 'STREAK_7_DAYS');
      } else if (newStreak === 30) {
        await this.applyScoreToUser(userId, 'STREAK_30_DAYS');
      }
    }
  }
}