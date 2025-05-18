import { mockUsers } from './mockData';

export type RankingPeriod = 'all-time' | 'monthly' | 'weekly';

export interface RankingUser {
  id: string;
  username: string;
  avatarUrl: string;
  points: number;
  rank: number;
  change?: number;
  isPro?: boolean;
}

class RankingService {
  // Obter ranking de usuários por período
  async getRankingByPeriod(period: RankingPeriod, limit: number = 10): Promise<RankingUser[]> {
    try {
      // Por enquanto, vamos usar dados mockados e simular diferentes períodos
      const currentDate = new Date();
      
      // Simular diferentes pontuações baseadas no período
      const users = mockUsers.map((user, index) => {
        let points = user.points || 0;
        
        // Simular variação de pontos por período
        switch (period) {
          case 'weekly':
            points = Math.floor(points * 0.1 + Math.random() * 100);
            break;
          case 'monthly':
            points = Math.floor(points * 0.5 + Math.random() * 500);
            break;
          default:
            // all-time usa os pontos totais
            points = points;
        }
        
        return {
          id: user.id,
          username: user.username,
          avatarUrl: user.avatarUrl,
          points: points,
          rank: 0, // Será calculado abaixo
          change: Math.floor(Math.random() * 10) - 5, // Simular mudança de posição
          isPro: user.isPro
        };
      });
      
      // Ordenar por pontos (decrescente) e atribuir ranks
      users.sort((a, b) => b.points - a.points);
      users.forEach((user, index) => {
        user.rank = index + 1;
      });
      
      // Retornar apenas o limite solicitado
      return users.slice(0, limit);
    } catch (error) {
      console.error('Erro ao buscar ranking:', error);
      throw error;
    }
  }

  // Obter posição de um usuário específico no ranking
  async getUserRankPosition(userId: string, period: RankingPeriod): Promise<number> {
    try {
      const ranking = await this.getRankingByPeriod(period, 100); // Buscar top 100
      const userPosition = ranking.findIndex(user => user.id === userId);
      return userPosition >= 0 ? userPosition + 1 : -1;
    } catch (error) {
      console.error('Erro ao buscar posição do usuário:', error);
      return -1;
    }
  }

  // Obter ranking local (por cidade/estado)
  async getLocalRanking(location: string, period: RankingPeriod, limit: number = 10): Promise<RankingUser[]> {
    try {
      // Por enquanto, vamos simular um ranking local
      const globalRanking = await this.getRankingByPeriod(period, limit * 2);
      
      // Simular filtragem por localização
      return globalRanking.slice(0, limit);
    } catch (error) {
      console.error('Erro ao buscar ranking local:', error);
      throw error;
    }
  }

  // Obter estatísticas do ranking
  async getRankingStats(period: RankingPeriod): Promise<{
    totalUsers: number;
    averagePoints: number;
    topUserPoints: number;
  }> {
    try {
      const ranking = await this.getRankingByPeriod(period, 100);
      
      if (ranking.length === 0) {
        return {
          totalUsers: 0,
          averagePoints: 0,
          topUserPoints: 0
        };
      }
      
      const totalPoints = ranking.reduce((sum, user) => sum + user.points, 0);
      
      return {
        totalUsers: ranking.length,
        averagePoints: Math.floor(totalPoints / ranking.length),
        topUserPoints: ranking[0].points
      };
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
      throw error;
    }
  }
}

export const rankingService = new RankingService();