import { PrismaClient } from '@prisma/client';
import { NotificationService } from './NotificationService';
import { ScoringService } from './ScoringService';

const prisma = new PrismaClient();

export interface BattlePost {
  id: string;
  content: string;
  imageUrl?: string;
  authorId: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  createdAt: Date;
  votes: number;
}

export interface Battle {
  id: string;
  postA: BattlePost;
  postB?: BattlePost;
  postAId: string;
  postBId?: string;
  status: 'waiting' | 'active' | 'finished';
  winnerId?: string;
  winnerPostId?: string;
  votesA: number;
  votesB: number;
  totalVotes: number;
  timeLimit: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BattleVote {
  id: string;
  userId: string;
  battleId: string;
  postId: string;
  createdAt: Date;
}

export interface BattleStats {
  totalBattles: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  currentStreak: number;
  bestStreak: number;
  totalVotes: number;
  accuracy: number; // % de votos no vencedor
}

export class BattleService {
  // Criar um novo post de batalha
  static async createBattlePost(userId: string, content: string, imageUrl?: string): Promise<BattlePost> {
    try {
      const post = await prisma.post.create({
        data: {
          content,
          imageUrl,
          authorId: userId,
          isBattlePost: true
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              display_name: true,
              avatar: true,
              image: true
            }
          }
        }
      });

      return {
        id: post.id,
        content: post.content,
        imageUrl: post.imageUrl || undefined,
        authorId: post.authorId,
        author: {
          id: post.author.id,
          username: post.author.username,
          displayName: post.author.display_name,
          avatar: post.author.avatar || post.author.image || undefined
        },
        createdAt: post.createdAt,
        votes: 0
      };
    } catch (error) {
      console.error('Erro ao criar post de batalha:', error);
      throw error;
    }
  }

  // Criar nova batalha ou juntar-se a uma existente
  static async createOrJoinBattle(userId: string, content: string, imageUrl?: string): Promise<Battle> {
    try {
      // Verificar se há batalha esperando oponente
      const waitingBattle = await prisma.battle.findFirst({
        where: {
          status: 'waiting'
        },
        include: {
          postA: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  display_name: true,
                  avatar: true,
                  image: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      if (waitingBattle && waitingBattle.postA.authorId !== userId) {
        // Criar post B e ativar batalha
        const postB = await this.createBattlePost(userId, content, imageUrl);
        
        const updatedBattle = await prisma.battle.update({
          where: { id: waitingBattle.id },
          data: {
            postBId: postB.id,
            status: 'active',
            timeLimit: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
          },
          include: {
            postA: {
              include: {
                author: {
                  select: {
                    id: true,
                    username: true,
                    display_name: true,
                    avatar: true,
                    image: true
                  }
                }
              }
            },
            postB: {
              include: {
                author: {
                  select: {
                    id: true,
                    username: true,
                    display_name: true,
                    avatar: true,
                    image: true
                  }
                }
              }
            }
          }
        });

        // Notificar o criador da batalha
        await NotificationService.createBattleChallengeNotification(
          userId, // quem desafiou
          waitingBattle.postA.authorId, // quem foi desafiado
          updatedBattle.id
        );

        return this.formatBattle(updatedBattle);
      } else {
        // Criar nova batalha
        const postA = await this.createBattlePost(userId, content, imageUrl);
        
        const battle = await prisma.battle.create({
          data: {
            postAId: postA.id,
            status: 'waiting',
            votesA: 0,
            votesB: 0,
            timeLimit: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 dias para encontrar oponente
          },
          include: {
            postA: {
              include: {
                author: {
                  select: {
                    id: true,
                    username: true,
                    display_name: true,
                    avatar: true,
                    image: true
                  }
                }
              }
            }
          }
        });

        return this.formatBattle(battle);
      }
    } catch (error) {
      console.error('Erro ao criar/juntar batalha:', error);
      throw error;
    }
  }

  // Votar em uma batalha
  static async voteInBattle(userId: string, battleId: string, postId: string): Promise<Battle> {
    try {
      // Verificar se já votou
      const existingVote = await prisma.battleVote.findFirst({
        where: {
          userId,
          battleId
        }
      });

      if (existingVote) {
        throw new Error('Você já votou nesta batalha');
      }

      // Buscar batalha
      const battle = await prisma.battle.findUnique({
        where: { id: battleId },
        include: {
          postA: true,
          postB: true
        }
      });

      if (!battle) {
        throw new Error('Batalha não encontrada');
      }

      if (battle.status !== 'active') {
        throw new Error('Esta batalha não está ativa');
      }

      // Verificar se é participante
      if (battle.postA.authorId === userId || battle.postB?.authorId === userId) {
        throw new Error('Você não pode votar na sua própria batalha');
      }

      // Criar voto
      await prisma.battleVote.create({
        data: {
          userId,
          battleId,
          postId
        }
      });

      // Atualizar contadores
      const isVoteForA = postId === battle.postAId;
      const updatedBattle = await prisma.battle.update({
        where: { id: battleId },
        data: {
          votesA: { increment: isVoteForA ? 1 : 0 },
          votesB: { increment: isVoteForA ? 0 : 1 }
        },
        include: {
          postA: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  display_name: true,
                  avatar: true,
                  image: true
                }
              }
            }
          },
          postB: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  display_name: true,
                  avatar: true,
                  image: true
                }
              }
            }
          }
        }
      });

      // Verificar se é hora de finalizar
      if (updatedBattle.votesA + updatedBattle.votesB >= 10 || new Date() > updatedBattle.timeLimit) {
        await this.finishBattle(battleId);
      }

      // Dar pontos por votar
      await ScoringService.applyScoreToUser(userId, 'VOTE_BATTLE');

      return this.formatBattle(updatedBattle);
    } catch (error) {
      console.error('Erro ao votar na batalha:', error);
      throw error;
    }
  }

  // Finalizar batalha
  static async finishBattle(battleId: string): Promise<Battle> {
    try {
      const battle = await prisma.battle.findUnique({
        where: { id: battleId },
        include: {
          postA: true,
          postB: true
        }
      });

      if (!battle || battle.status !== 'active') {
        throw new Error('Batalha não pode ser finalizada');
      }

      // Determinar vencedor
      let winnerId: string | null = null;
      let winnerPostId: string | null = null;
      
      if (battle.votesA > battle.votesB) {
        winnerId = battle.postA.authorId;
        winnerPostId = battle.postAId;
      } else if (battle.votesB > battle.votesA) {
        winnerId = battle.postB!.authorId;
        winnerPostId = battle.postBId!;
      }
      // Se empate, fica sem vencedor

      // Atualizar batalha
      const finishedBattle = await prisma.battle.update({
        where: { id: battleId },
        data: {
          status: 'finished',
          winnerId,
          winnerPostId
        },
        include: {
          postA: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  display_name: true,
                  avatar: true,
                  image: true
                }
              }
            }
          },
          postB: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  display_name: true,
                  avatar: true,
                  image: true
                }
              }
            }
          }
        }
      });

      // Atualizar estatísticas dos participantes
      if (winnerId) {
        const loserId = winnerId === battle.postA.authorId ? battle.postB!.authorId : battle.postA.authorId;
        
        // Vencedor
        await prisma.user.update({
          where: { id: winnerId },
          data: {
            battleWins: { increment: 1 },
            currentBattleStreak: { increment: 1 }
          }
        });

        // Perdedor
        await prisma.user.update({
          where: { id: loserId },
          data: {
            battleLosses: { increment: 1 },
            currentBattleStreak: 0
          }
        });

        // Notificar resultado
        await NotificationService.createBattleResultNotification(winnerId, loserId, battleId, true);
        await NotificationService.createBattleResultNotification(winnerId, loserId, battleId, false);

        // Aplicar pontos
        await ScoringService.applyScoreToUser(winnerId, 'WIN_BATTLE');
      } else {
        // Empate
        await prisma.user.updateMany({
          where: {
            id: { in: [battle.postA.authorId, battle.postB!.authorId] }
          },
          data: {
            battleDraws: { increment: 1 }
          }
        });
      }

      return this.formatBattle(finishedBattle);
    } catch (error) {
      console.error('Erro ao finalizar batalha:', error);
      throw error;
    }
  }

  // Obter batalha ativa
  static async getActiveBattle(): Promise<Battle | null> {
    try {
      const battle = await prisma.battle.findFirst({
        where: {
          status: { in: ['waiting', 'active'] }
        },
        include: {
          postA: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  display_name: true,
                  avatar: true,
                  image: true
                }
              }
            }
          },
          postB: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  display_name: true,
                  avatar: true,
                  image: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      if (!battle) return null;

      // Verificar se expirou
      if (new Date() > battle.timeLimit) {
        if (battle.status === 'active') {
          await this.finishBattle(battle.id);
        } else {
          // Cancelar batalha sem oponente
          await prisma.battle.update({
            where: { id: battle.id },
            data: { status: 'finished' }
          });
        }
        return null;
      }

      return this.formatBattle(battle);
    } catch (error) {
      console.error('Erro ao buscar batalha ativa:', error);
      return null;
    }
  }

  // Obter histórico de batalhas do usuário
  static async getUserBattleHistory(userId: string, limit: number = 10): Promise<Battle[]> {
    try {
      const battles = await prisma.battle.findMany({
        where: {
          status: 'finished',
          OR: [
            { postA: { authorId: userId } },
            { postB: { authorId: userId } }
          ]
        },
        include: {
          postA: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  display_name: true,
                  avatar: true,
                  image: true
                }
              }
            }
          },
          postB: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  display_name: true,
                  avatar: true,
                  image: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit
      });

      return battles.map(battle => this.formatBattle(battle));
    } catch (error) {
      console.error('Erro ao buscar histórico de batalhas:', error);
      return [];
    }
  }

  // Obter estatísticas de batalha do usuário
  static async getUserBattleStats(userId: string): Promise<BattleStats> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          battleVotes: true,
          battlesAsPostA: {
            where: { status: 'finished' }
          },
          battlesAsPostB: {
            where: { status: 'finished' }
          }
        }
      });

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const totalBattles = user.battlesAsPostA.length + user.battlesAsPostB.length;
      const wins = user.battleWins || 0;
      const losses = user.battleLosses || 0;
      const draws = user.battleDraws || 0;
      const winRate = totalBattles > 0 ? (wins / totalBattles) * 100 : 0;

      // Calcular accuracy dos votos
      let correctVotes = 0;
      for (const vote of user.battleVotes) {
        const battle = await prisma.battle.findUnique({
          where: { id: vote.battleId }
        });
        if (battle && battle.winnerPostId === vote.postId) {
          correctVotes++;
        }
      }
      const accuracy = user.battleVotes.length > 0 
        ? (correctVotes / user.battleVotes.length) * 100 
        : 0;

      return {
        totalBattles,
        wins,
        losses,
        draws,
        winRate,
        currentStreak: user.currentBattleStreak || 0,
        bestStreak: user.bestBattleStreak || 0,
        totalVotes: user.battleVotes.length,
        accuracy
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas de batalha:', error);
      return {
        totalBattles: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        winRate: 0,
        currentStreak: 0,
        bestStreak: 0,
        totalVotes: 0,
        accuracy: 0
      };
    }
  }

  // Verificar se usuário pode votar
  static async canUserVote(userId: string, battleId: string): Promise<boolean> {
    try {
      const [battle, existingVote] = await Promise.all([
        prisma.battle.findUnique({
          where: { id: battleId },
          include: {
            postA: true,
            postB: true
          }
        }),
        prisma.battleVote.findFirst({
          where: {
            userId,
            battleId
          }
        })
      ]);

      if (!battle || battle.status !== 'active' || existingVote) {
        return false;
      }

      // Não pode votar na própria batalha
      if (battle.postA.authorId === userId || battle.postB?.authorId === userId) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao verificar permissão de voto:', error);
      return false;
    }
  }

  // Formatar batalha para resposta
  private static formatBattle(battle: any): Battle {
    const totalVotes = battle.votesA + battle.votesB;
    
    return {
      id: battle.id,
      postA: {
        id: battle.postA.id,
        content: battle.postA.content,
        imageUrl: battle.postA.imageUrl,
        authorId: battle.postA.authorId,
        author: {
          id: battle.postA.author.id,
          username: battle.postA.author.username,
          displayName: battle.postA.author.display_name,
          avatar: battle.postA.author.avatar || battle.postA.author.image
        },
        createdAt: battle.postA.createdAt,
        votes: battle.votesA
      },
      postB: battle.postB ? {
        id: battle.postB.id,
        content: battle.postB.content,
        imageUrl: battle.postB.imageUrl,
        authorId: battle.postB.authorId,
        author: {
          id: battle.postB.author.id,
          username: battle.postB.author.username,
          displayName: battle.postB.author.display_name,
          avatar: battle.postB.author.avatar || battle.postB.author.image
        },
        createdAt: battle.postB.createdAt,
        votes: battle.votesB
      } : undefined,
      postAId: battle.postAId,
      postBId: battle.postBId,
      status: battle.status,
      winnerId: battle.winnerId,
      winnerPostId: battle.winnerPostId,
      votesA: battle.votesA,
      votesB: battle.votesB,
      totalVotes,
      timeLimit: battle.timeLimit,
      createdAt: battle.createdAt,
      updatedAt: battle.updatedAt
    };
  }
}