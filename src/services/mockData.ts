import { User, Post, Battle, ChatMessage, Challenge, Achievement, Storyment, Notification } from '../types';
import { generateRealPersonAvatar, generateCoverImage, generatePostImage } from '../utils/avatarUtils';

// Função para converter Date em string no formato ISO
const dateToString = (date: Date): string => {
  return date.toISOString();
};

// Usuários mockados com avatares reais
export const mockUsers: User[] = [
  {
    id: 'user1',
    username: 'contador_mentiras',
    displayName: 'Contador de Mentiras',
    email: 'contador@mentei.com',
    photoURL: generateRealPersonAvatar('men'),
    coverImage: generateCoverImage(),
    bio: 'Especialista em contar histórias que ninguém acredita, mas todos adoram ouvir.',
    points: 1250,
    level: 12,
    isPro: true,
    createdAt: new Date(2022, 8, 15).toISOString(),
    stats: { followers: 142, following: 89, posts: 0, battles: 0 },
  },
  {
    id: 'user2',
    username: 'imaginativo',
    displayName: 'Criativo Demais',
    email: 'criativo@mentei.com',
    photoURL: generateRealPersonAvatar('women'),
    coverImage: generateCoverImage(),
    bio: 'Especialista em criar histórias que parecem reais, mas não são.',
    points: 830,
    level: 9,
    isPro: false,
    createdAt: new Date(2023, 1, 22).toISOString(),
    stats: { followers: 87, following: 120, posts: 0, battles: 0 },
  },
  {
    id: 'user3',
    username: 'mentirinhasdodia',
    displayName: 'Mentiras Diárias',
    email: 'diarias@mentei.com',
    photoURL: generateRealPersonAvatar('men'),
    coverImage: generateCoverImage(),
    bio: 'Uma mentira por dia não faz mal a ninguém. Siga para doses diárias de criatividade!',
    points: 1850,
    level: 18,
    isPro: true,
    createdAt: new Date(2022, 11, 10).toISOString(),
    stats: { followers: 295, following: 76, posts: 0, battles: 0 },
  },
  {
    id: 'user4',
    username: 'inventora',
    displayName: 'Inventora de Histórias',
    email: 'inventora@mentei.com',
    photoURL: generateRealPersonAvatar('women'),
    coverImage: generateCoverImage(),
    bio: 'Transformo o impossível em histórias incríveis. Arte da mentira criativa 🎨',
    points: 2100,
    level: 21,
    isPro: true,
    createdAt: new Date(2022, 5, 8).toISOString(),
    stats: { followers: 421, following: 203, posts: 0, battles: 0 },
  },
  {
    id: 'user5',
    username: 'fabulas_modernas',
    displayName: 'Fábulas Modernas',
    email: 'fabulas@mentei.com',
    photoURL: generateRealPersonAvatar('men'),
    coverImage: generateCoverImage(),
    bio: 'Atualizando fábulas antigas para o mundo moderno. Cada mentira tem uma lição!',
    points: 670,
    level: 7,
    isPro: false,
    createdAt: new Date(2023, 3, 17).toISOString(),
    stats: { followers: 56, following: 89, posts: 0, battles: 0 },
  },
  {
    id: 'user6',
    username: 'historiasimpossíveis',
    displayName: 'Histórias Impossíveis',
    email: 'impossivel@mentei.com',
    photoURL: generateRealPersonAvatar('women'),
    coverImage: generateCoverImage(),
    bio: 'Se é impossível, eu conto como se fosse real. Especialista em absurdos críveis.',
    points: 1580,
    level: 15,
    isPro: true,
    createdAt: new Date(2022, 10, 30).toISOString(),
    stats: { followers: 234, following: 145, posts: 0, battles: 0 },
  },
  {
    id: 'user7',
    username: 'o_mentiroso',
    displayName: 'O Mentiroso',
    email: 'mentiroso@mentei.com',
    photoURL: generateRealPersonAvatar('men'),
    coverImage: generateCoverImage(),
    bio: 'Nem tudo que eu digo é mentira... Mas quase tudo é! 😄',
    points: 950,
    level: 10,
    isPro: false,
    createdAt: new Date(2023, 0, 5).toISOString(),
    stats: { followers: 124, following: 201, posts: 0, battles: 0 },
  },
  {
    id: 'user8',
    username: 'ficcao_real',
    displayName: 'Ficção Real',
    email: 'ficcao@mentei.com',
    photoURL: generateRealPersonAvatar('women'),
    coverImage: generateCoverImage(),
    bio: 'Onde a realidade encontra a ficção. Minhas mentiras são tão boas que parecem verdade.',
    points: 1920,
    level: 19,
    isPro: true,
    createdAt: new Date(2022, 7, 22).toISOString(),
    stats: { followers: 378, following: 89, posts: 0, battles: 0 },
  }
];

// Posts mockados com imagens reais
export const mockPosts: Post[] = [
  {
    id: 'post1',
    userId: 'user1',
    author: mockUsers[0],
    content: 'Ontem encontrei um unicórnio no meu quintal. Ele me ensinou a falar com plantas e agora meu jardim está mais bonito que nunca! 🦄🌿',
    imageURL: generatePostImage(),
    likes: 245,
    comments: 32,
    shares: 18,
    views: 1250,
    truthRating: 2.3,
    believability: 3.8,
    creativity: 4.7,
    reactionCounts: { like: 245, love: 89, laugh: 156, surprised: 45, dislike: 12 },
    judgementCounts: { truth: 23, lie: 178, notSure: 44 },
    createdAt: dateToString(new Date(Date.now() - 3600000)), // 1 hora atrás
    tags: ['unicornio', 'jardim', 'fantasia'],
    isGenerated: false,
  },
  {
    id: 'post2',
    userId: 'user2',
    author: mockUsers[1],
    content: 'Acabei de ganhar na loteria pela quinta vez esse mês. O segredo? Sempre escolho os números que meu hamster indica! 🐹💰',
    imageURL: generatePostImage(),
    likes: 432,
    comments: 67,
    shares: 29,
    views: 2340,
    truthRating: 1.2,
    believability: 2.1,
    creativity: 4.2,
    reactionCounts: { like: 432, love: 123, laugh: 298, surprised: 167, dislike: 34 },
    judgementCounts: { truth: 12, lie: 289, notSure: 66 },
    createdAt: dateToString(new Date(Date.now() - 7200000)), // 2 horas atrás
    tags: ['loteria', 'hamster', 'sorte'],
    isGenerated: false,
  },
  {
    id: 'post3',
    userId: 'user3',
    author: mockUsers[2],
    content: 'Descobri um portal para outra dimensão no meu guarda-roupa. Visitei o mundo dos doces e voltei com 10kg a mais! 🍰🌈',
    imageURL: generatePostImage(),
    likes: 678,
    comments: 89,
    shares: 45,
    views: 3450,
    truthRating: 1.8,
    believability: 3.2,
    creativity: 4.9,
    reactionCounts: { like: 678, love: 234, laugh: 445, surprised: 223, dislike: 29 },
    judgementCounts: { truth: 34, lie: 334, notSure: 121 },
    createdAt: dateToString(new Date(Date.now() - 10800000)), // 3 horas atrás
    tags: ['portal', 'doces', 'dimensao'],
    isGenerated: false,
  },
  {
    id: 'post4',
    userId: 'user4',
    author: mockUsers[3],
    content: 'Meu gato aprendeu a falar e agora trabalha como consultor de investimentos. Ele já multiplicou minha poupança por 10! 📈🐱',
    imageURL: generatePostImage(),
    likes: 890,
    comments: 156,
    shares: 67,
    views: 4567,
    truthRating: 1.5,
    believability: 2.8,
    creativity: 4.6,
    reactionCounts: { like: 890, love: 345, laugh: 567, surprised: 278, dislike: 45 },
    judgementCounts: { truth: 56, lie: 445, notSure: 189 },
    createdAt: dateToString(new Date(Date.now() - 14400000)), // 4 horas atrás
    tags: ['gato', 'investimentos', 'dinheiro'],
    isGenerated: false,
  },
  {
    id: 'post5',
    userId: 'user5',
    author: mockUsers[4],
    content: 'Aprendi a voar assistindo vídeos no YouTube. Agora economizo no transporte e chego sempre no horário! ✈️🦅',
    imageURL: generatePostImage(),
    likes: 543,
    comments: 98,
    shares: 38,
    views: 2890,
    truthRating: 1.1,
    believability: 1.9,
    creativity: 4.3,
    reactionCounts: { like: 543, love: 178, laugh: 389, surprised: 234, dislike: 67 },
    judgementCounts: { truth: 23, lie: 367, notSure: 98 },
    createdAt: dateToString(new Date(Date.now() - 18000000)), // 5 horas atrás
    tags: ['voar', 'youtube', 'transporte'],
    isGenerated: false,
  },
  {
    id: 'post6',
    userId: 'user6',
    author: mockUsers[5],
    content: 'Descobri a fórmula da juventude eterna tomando café com açúcar mascavo. Tenho 90 anos mas pareço ter 25! ☕✨',
    imageURL: generatePostImage(),
    likes: 1234,
    comments: 234,
    shares: 89,
    views: 5678,
    truthRating: 1.7,
    believability: 3.1,
    creativity: 4.4,
    reactionCounts: { like: 1234, love: 456, laugh: 789, surprised: 345, dislike: 78 },
    judgementCounts: { truth: 89, lie: 567, notSure: 234 },
    createdAt: dateToString(new Date(Date.now() - 21600000)), // 6 horas atrás
    tags: ['juventude', 'cafe', 'segredo'],
    isGenerated: false,
  },
  {
    id: 'post7',
    userId: 'user7',
    author: mockUsers[6],
    content: 'Meu cachorro se formou em medicina e agora atende os pets do bairro. Ele é especialista em miau-terapia! 🐕‍⚕️💊',
    imageURL: generatePostImage(),
    likes: 987,
    comments: 167,
    shares: 78,
    views: 4321,
    truthRating: 1.4,
    believability: 2.6,
    creativity: 4.8,
    reactionCounts: { like: 987, love: 321, laugh: 654, surprised: 432, dislike: 54 },
    judgementCounts: { truth: 45, lie: 489, notSure: 154 },
    createdAt: dateToString(new Date(Date.now() - 25200000)), // 7 horas atrás
    tags: ['cachorro', 'medicina', 'pets'],
    isGenerated: false,
  },
  {
    id: 'post8',
    userId: 'user8',
    author: mockUsers[7],
    content: 'Inventei uma máquina do tempo com um micro-ondas velho. Já visitei o futuro e sei quem ganha a Copa de 2026! ⏰🏆',
    imageURL: generatePostImage(),
    likes: 1567,
    comments: 289,
    shares: 123,
    views: 6789,
    truthRating: 1.3,
    believability: 2.4,
    creativity: 4.7,
    reactionCounts: { like: 1567, love: 543, laugh: 876, surprised: 543, dislike: 98 },
    judgementCounts: { truth: 67, lie: 678, notSure: 222 },
    createdAt: dateToString(new Date(Date.now() - 28800000)), // 8 horas atrás
    tags: ['tempo', 'futuro', 'copa'],
    isGenerated: false,
  }
];

// Battles mockados com avatares reais
export const mockBattles: Battle[] = [
  {
    id: 'battle1',
    challenger: mockUsers[0],
    challengerId: 'user1',
    opponent: mockUsers[1],
    opponentId: 'user2',
    status: 'active',
    theme: 'Viagem mais absurda',
    expiresAt: new Date(Date.now() + 86400000).toISOString(), // 24 horas
    challengerPost: {
      ...mockPosts[0],
      id: 'battle1_post1',
      content: 'Viajei para o centro da Terra de ônibus. A passagem custou R$15 e ainda ganhei um lanche!',
    },
    opponentPost: {
      ...mockPosts[1],
      id: 'battle1_post2',
      content: 'Fui para Marte de bicicleta. Levei apenas 3 horas e gastei só com o lanche do caminho!',
    },
    votes: { challenger: 78, opponent: 92 },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'battle2',
    challenger: mockUsers[2],
    challengerId: 'user3',
    opponent: mockUsers[3],
    opponentId: 'user4',
    status: 'voting',
    theme: 'Superpoder mais inútil',
    expiresAt: new Date(Date.now() + 7200000).toISOString(), // 2 horas
    challengerPost: {
      ...mockPosts[2],
      id: 'battle2_post1',
      content: 'Posso fazer qualquer comida ficar com gosto de jiló, mas só quando ninguém está olhando.',
    },
    opponentPost: {
      ...mockPosts[3],
      id: 'battle2_post2',
      content: 'Consigo ler mentes, mas apenas de formigas e elas só pensam em açúcar.',
    },
    votes: { challenger: 234, opponent: 189 },
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

// Resto do código permanece o mesmo...
export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg1',
    userId: 'user1',
    displayName: mockUsers[0].displayName,
    photoURL: mockUsers[0].photoURL,
    text: 'Gente, acabei de postar sobre o unicórnio no meu quintal! Alguém mais já viu um?',
    createdAt: dateToString(new Date(Date.now() - 300000)), // 5 minutos atrás
    isPro: true,
  },
  {
    id: 'msg2',
    userId: 'user2',
    displayName: mockUsers[1].displayName,
    photoURL: mockUsers[1].photoURL,
    text: 'Unicórnio? Eu tenho um dragão de estimação que faz café! ☕🐉',
    createdAt: dateToString(new Date(Date.now() - 240000)), // 4 minutos atrás
    isPro: false,
  },
  {
    id: 'msg3',
    userId: 'user3',
    displayName: mockUsers[2].displayName,
    photoURL: mockUsers[2].photoURL,
    text: 'Vocês não vão acreditar, mas meu papagaio fala 5 idiomas e dá aulas de mandarim!',
    createdAt: dateToString(new Date(Date.now() - 180000)), // 3 minutos atrás
    isPro: true,
  },
  {
    id: 'msg4',
    userId: 'user4',
    displayName: mockUsers[3].displayName,
    photoURL: mockUsers[3].photoURL,
    text: 'Alguém aí quer participar da batalha de mentiras do dia? O tema é "Viagem mais absurda"!',
    createdAt: dateToString(new Date(Date.now() - 120000)), // 2 minutos atrás
    isPro: true,
  },
  {
    id: 'msg5',
    userId: 'user5',
    displayName: mockUsers[4].displayName,
    photoURL: mockUsers[4].photoURL,
    text: 'Eu topo! Já viajei pro futuro numa geladeira modificada 🚀',
    createdAt: dateToString(new Date(Date.now() - 60000)), // 1 minuto atrás
    isPro: false,
  },
];

export const mockChallenges: Challenge[] = [
  {
    id: 'challenge1',
    name: 'Mestre das Histórias',
    description: 'Crie 10 posts com mais de 100 reações cada',
    points: 500,
    progress: 7,
    target: 10,
    completed: false,
    expiresAt: new Date(Date.now() + 604800000).toISOString(), // 7 dias
  },
  {
    id: 'challenge2',
    name: 'Batalha Épica',
    description: 'Vença 5 batalhas de mentiras consecutivas',
    points: 1000,
    progress: 3,
    target: 5,
    completed: false,
    expiresAt: new Date(Date.now() + 259200000).toISOString(), // 3 dias
  },
];

export const mockAchievements: Achievement[] = [
  {
    id: 'ach1',
    name: 'Primeira Mentira',
    description: 'Publique sua primeira mentira',
    icon: '🎭',
    points: 50,
    unlockedAt: dateToString(new Date(2023, 8, 15)),
  },
  {
    id: 'ach2',
    name: 'Mentiroso Popular',
    description: 'Alcance 100 seguidores',
    icon: '⭐',
    points: 200,
    unlockedAt: dateToString(new Date(2023, 9, 20)),
  },
];

export const mockStoryments: Storyment[] = [
  {
    id: 'story1',
    text: 'Hoje acordei e descobri que posso falar com os pássaros!',
    author: mockUsers[0].displayName,
    authorId: 'user1',
    authorAvatar: mockUsers[0].photoURL,
    createdAt: dateToString(new Date(Date.now() - 600000)), // 10 minutos atrás
    isPro: true,
  },
  {
    id: 'story2',
    text: 'Meu café da manhã veio do futuro. O pão ainda nem foi inventado!',
    author: mockUsers[1].displayName,
    authorId: 'user2',
    authorAvatar: mockUsers[1].photoURL,
    createdAt: dateToString(new Date(Date.now() - 1200000)), // 20 minutos atrás
    isPro: false,
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif1',
    userId: 'user1',
    type: 'like',
    message: 'João Silva curtiu sua mentira',
    relatedPostId: 'post1',
    relatedUserId: 'user2',
    read: false,
    createdAt: dateToString(new Date(Date.now() - 300000)), // 5 minutos atrás
  },
  {
    id: 'notif2',
    userId: 'user1',
    type: 'follow',
    message: 'Maria Santos começou a seguir você',
    relatedUserId: 'user3',
    read: false,
    createdAt: dateToString(new Date(Date.now() - 600000)), // 10 minutos atrás
  },
];

// Função para obter posts de um usuário
export const getUserPosts = (userId: string): Post[] => {
  return mockPosts.filter(post => post.userId === userId);
};

// Função para obter um usuário pelo ID
export const getUserById = (userId: string): User | undefined => {
  return mockUsers.find(user => user.id === userId);
};

// Função para obter posts com uma tag específica
export const getPostsByTag = (tag: string): Post[] => {
  return mockPosts.filter(post => post.tags.includes(tag.toLowerCase()));
};

// Função para obter posts em alta (trending)
export const getTrendingPosts = (): Post[] => {
  return [...mockPosts].sort((a, b) => b.likes - a.likes).slice(0, 5);
};

// Função para obter usuários top
export const getTopUsers = (): User[] => {
  return [...mockUsers].sort((a, b) => b.points - a.points).slice(0, 10);
};