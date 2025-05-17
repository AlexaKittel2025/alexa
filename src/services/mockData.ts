import { User, Post, Battle, ChatMessage, Challenge, Achievement, Storyment, Notification } from '../types';

// Função para converter Date em string no formato ISO
const dateToString = (date: Date): string => {
  return date.toISOString();
};

// Usuários mockados
export const mockUsers: User[] = [
  {
    id: 'user1',
    username: 'contador_mentiras',
    displayName: 'Contador de Mentiras',
    email: 'contador@mentei.com',
    photoURL: 'https://randomuser.me/api/portraits/men/32.jpg',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80',
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
    photoURL: 'https://randomuser.me/api/portraits/women/44.jpg',
    coverImage: 'https://images.unsplash.com/photo-1502472584811-0a2f2feb8968?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80',
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
    photoURL: 'https://randomuser.me/api/portraits/men/67.jpg',
    coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80',
    bio: 'Uma mentira por dia não faz mal a ninguém. Siga para doses diárias de criatividade!',
    points: 1850,
    level: 18,
    isPro: true,
    createdAt: new Date(2022, 11, 10).toISOString(),
    stats: { followers: 295, following: 76, posts: 0, battles: 0 },
  },
  {
    id: 'user4',
    username: 'inventordesermoes',
    displayName: 'Inventor de Sermões',
    email: 'sermoes@mentei.com',
    photoURL: 'https://randomuser.me/api/portraits/women/22.jpg',
    coverImage: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80',
    points: 520,
    level: 6,
    isPro: false,
    createdAt: new Date(2023, 3, 5).toISOString(),
    stats: { followers: 43, following: 61, posts: 0, battles: 0 },
  },
  {
    id: 'user5',
    username: 'criativo_demais',
    displayName: 'Criativo Demais',
    email: 'criativo@mentei.com',
    photoURL: 'https://randomuser.me/api/portraits/women/57.jpg',
    coverImage: 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80',
    bio: 'Mestre em inventar histórias que nunca aconteceram, mas poderiam ter acontecido.',
    points: 980,
    level: 10,
    isPro: true,
    createdAt: new Date(2023, 2, 18).toISOString(),
    stats: { followers: 110, following: 95, posts: 0, battles: 0 },
  }
];

// Posts mockados
export const mockPosts: Post[] = [
  {
    id: '1',
    userId: 'user1',
    content: 'Ontem encontrei um pinguim perdido na praia de Copacabana. Ajudei ele a pegar o metrô de volta pro zoológico.',
    tags: ['animais', 'praia', 'zoologico'],
    reactions: {
      quaseAcreditei: 24,
      hahaha: 45,
      mentiraEpica: 12
    },
    userReactions: {
      'user2': 'hahaha',
      'user3': 'quaseAcreditei'
    },
    judgements: {
      crivel: 8,
      inventiva: 30,
      totalmentePirada: 15
    },
    userJudgements: {},
    createdAt: new Date(2023, 6, 15).toISOString(),
    isGenerated: false,
    commentCount: 5
  },
  {
    id: '2',
    userId: 'user2',
    content: 'Meu cachorro aprendeu a usar o microondas e agora toda madrugada ele esquenta um pedaço de pizza quando acha que ninguém está vendo.',
    tags: ['animais', 'pets', 'habilidades'],
    reactions: {
      quaseAcreditei: 35,
      hahaha: 67,
      mentiraEpica: 18
    },
    userReactions: {},
    judgements: {
      crivel: 20,
      inventiva: 40,
      totalmentePirada: 10
    },
    userJudgements: {},
    createdAt: new Date(2023, 6, 17).toISOString(),
    isGenerated: false,
    commentCount: 12
  },
  {
    id: '3',
    userId: 'user3',
    content: 'Descobri que meu vizinho é um espião aposentado da KGB. Ele me contou quando estávamos no elevador e caiu a luz.',
    imageUrl: 'https://images.unsplash.com/photo-1569430044526-a975f88f59a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    imageURL: 'https://images.unsplash.com/photo-1569430044526-a975f88f59a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    tags: ['vizinhos', 'segredos', 'espionagem'],
    reactions: {
      quaseAcreditei: 42,
      hahaha: 29,
      mentiraEpica: 33
    },
    userReactions: {},
    judgements: {
      crivel: 33,
      inventiva: 25,
      totalmentePirada: 20
    },
    userJudgements: {},
    createdAt: new Date(2023, 6, 18).toISOString(),
    isGenerated: false,
    commentCount: 8
  },
  {
    id: '4',
    userId: 'user4',
    content: 'Minha planta carnívora começou a latir para visitas. Acho que ela conviveu tempo demais com meu cachorro.',
    tags: ['plantas', 'pets', 'estranho'],
    reactions: {
      quaseAcreditei: 15,
      hahaha: 56,
      mentiraEpica: 27
    },
    userReactions: {},
    judgements: {
      crivel: 10,
      inventiva: 48,
      totalmentePirada: 25
    },
    userJudgements: {},
    createdAt: new Date(2023, 6, 19).toISOString(),
    isGenerated: true,
    commentCount: 3
  },
  {
    id: '5',
    userId: 'user1',
    content: 'Estou aprendendo a falar com golfinhos. Já consigo pedir direções e perguntar onde tem um bom restaurante de frutos do mar.',
    imageUrl: 'https://images.unsplash.com/photo-1548258869-87a45ab5237f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    imageURL: 'https://images.unsplash.com/photo-1548258869-87a45ab5237f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    tags: ['animais', 'habilidades', 'oceano'],
    reactions: {
      quaseAcreditei: 18,
      hahaha: 72,
      mentiraEpica: 35
    },
    userReactions: {},
    judgements: {
      crivel: 12,
      inventiva: 53,
      totalmentePirada: 22
    },
    userJudgements: {},
    createdAt: new Date(2023, 6, 20).toISOString(),
    isGenerated: false,
    commentCount: 15
  },
  {
    id: '6',
    userId: 'user2',
    content: 'Fui promovido a CEO da empresa ontem. Meu primeiro ato foi decretar que todas as sextas-feiras são dias de pijama no trabalho e que reuniões só podem durar 15 minutos, caso contrário todos ganham sorvete de graça.',
    tags: ['trabalho'],
    reactions: {
      quaseAcreditei: 45,
      hahaha: 89,
      mentiraEpica: 32
    },
    userReactions: {},
    judgements: {
      crivel: 20,
      inventiva: 56,
      totalmentePirada: 15
    },
    userJudgements: {},
    createdAt: dateToString(new Date(2023, 6, 20)),
    isGenerated: false
  },
  {
    id: '7',
    userId: 'user3',
    content: 'Fiz um bolo que ficou tão bonito que quando postei a foto no Instagram, o Gordon Ramsay comentou pedindo a receita. Ele disse que vai incluir no cardápio do novo restaurante dele e vai chamar de "Bolo do Usuário Mentiroso".',
    tags: ['comida', 'famoso'],
    reactions: {
      quaseAcreditei: 67,
      hahaha: 41,
      mentiraEpica: 23
    },
    userReactions: {},
    judgements: {
      crivel: 45,
      inventiva: 28,
      totalmentePirada: 12
    },
    userJudgements: {},
    createdAt: dateToString(new Date(2023, 6, 21)),
    isGenerated: false
  },
  {
    id: '8',
    userId: 'user4',
    content: 'Meu gato descobriu como abrir a porta da geladeira e agora toda noite ele organiza os alimentos por cor. Encontrei todos os legumes verdes em uma prateleira e os vermelhos em outra. Acho que ele tem TOC.',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    imageURL: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    tags: ['pets', 'animais', 'comportamento'],
    reactions: {
      quaseAcreditei: 89,
      hahaha: 105,
      mentiraEpica: 47
    },
    userReactions: {},
    judgements: {
      crivel: 35,
      inventiva: 87,
      totalmentePirada: 42
    },
    userJudgements: {},
    createdAt: dateToString(new Date()),
    isGenerated: false
  },
  {
    id: '9',
    userId: 'user1',
    content: 'Ontem à noite vi uma nave espacial pousando no quintal do vizinho. Quando fui ver mais de perto, os extraterrestres me convidaram para jantar e pediram dicas de turismo em São Paulo. Eles acharam o trânsito muito tranquilo comparado com o de Marte.',
    tags: ['extraterrestre', 'alien', 'espacial'],
    reactions: {
      quaseAcreditei: 32,
      hahaha: 156,
      mentiraEpica: 83
    },
    userReactions: {},
    judgements: {
      crivel: 12,
      inventiva: 92,
      totalmentePirada: 78
    },
    userJudgements: {},
    createdAt: dateToString(new Date()),
    isGenerated: false
  },
  {
    id: '10',
    userId: 'user2',
    content: 'Treinei meu papagaio para atender o telefone. Ele não só atende como já anota recados. Ontem ele anotou uma ligação importante do trabalho e até corrigiu um erro de português do meu chefe.',
    tags: ['animais', 'pets', 'habilidades', 'trabalho'],
    reactions: {
      quaseAcreditei: 78,
      hahaha: 92,
      mentiraEpica: 45
    },
    userReactions: {},
    judgements: {
      crivel: 23,
      inventiva: 67,
      totalmentePirada: 39
    },
    userJudgements: {},
    createdAt: dateToString(new Date()),
    isGenerated: false
  },
  {
    id: '11',
    userId: 'user3',
    content: 'Meu filho de 3 anos consertou nossa smart TV ontem. Quando perguntei como ele sabia fazer isso, ele disse que viu um tutorial no YouTube. O problema é que não temos internet há 2 semanas.',
    imageUrl: 'https://images.unsplash.com/photo-1611254759663-1c53f594c035?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    imageURL: 'https://images.unsplash.com/photo-1611254759663-1c53f594c035?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    tags: ['criança', 'tecnologia', 'estranho'],
    reactions: {
      quaseAcreditei: 115,
      hahaha: 67,
      mentiraEpica: 42
    },
    userReactions: {},
    judgements: {
      crivel: 28,
      inventiva: 75,
      totalmentePirada: 63
    },
    userJudgements: {},
    createdAt: dateToString(new Date()),
    isGenerated: false
  },
  {
    id: '12',
    userId: 'user4',
    content: 'Plantei um pé de tomate no meu jardim há 3 meses e hoje colhi um abacaxi dele. Os cientistas da universidade local estão vindo amanhã para estudar o fenômeno.',
    tags: ['plantas', 'ciencia', 'estranho'],
    reactions: {
      quaseAcreditei: 28,
      hahaha: 147,
      mentiraEpica: 95
    },
    userReactions: {},
    judgements: {
      crivel: 5,
      inventiva: 83,
      totalmentePirada: 112
    },
    userJudgements: {},
    createdAt: dateToString(new Date()),
    isGenerated: false
  }
];

// Storyments mockados
export const mockStoryments: Storyment[] = [
  {
    id: 'story1',
    userId: 'user1',
    content: 'Acabei de contar a maior mentira da minha vida e meus pais acreditaram! 😂',
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
  },
  {
    id: 'story2',
    userId: 'user2',
    content: 'Inventei uma história tão boa que até eu acreditei...',
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 horas atrás
  },
  {
    id: 'story3',
    userId: 'user3',
    content: 'Nova mentira sendo trabalhada... vai ser épica, aguardem!',
    createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutos atrás
  }
];

// Notificações mockadas
export const mockNotifications: Notification[] = [
  {
    id: 'notif1',
    userId: 'user1',
    type: 'reaction',
    content: 'Usuário reagiu com "Quase Acreditei" na sua mentira',
    is_read: false,
    createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutos atrás
    related_id: '1',
    sender_id: 'user2'
  },
  {
    id: 'notif2',
    userId: 'user1',
    type: 'comment',
    content: 'Usuário comentou na sua mentira: "Isso é hilário! Como você inventou isso?"',
    is_read: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
    related_id: '1',
    sender_id: 'user3'
  },
  {
    id: 'notif3',
    userId: 'user1',
    type: 'follow',
    content: 'Usuário começou a seguir você',
    is_read: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
    sender_id: 'user4',
    related_id: null
  }
];

// Batalhas mockadas
export const mockBattles: Battle[] = [
  {
    id: 'battle1',
    title: 'Férias Desastrosas',
    status: 'active',
    start_date: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    participants: [],
  },
  {
    id: 'battle2',
    title: 'Encontros Sobrenaturais',
    status: 'active',
    start_date: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    participants: [],
  }
];

// Mensagens de chat globais
export const mockGlobalMessages: ChatMessage[] = [
  {
    id: 'msg1',
    senderId: 'user1',
    receiverId: 'global',
    content: 'E aí, pessoal! Acabei de contar uma mentira tão boa que minha mãe acreditou que eu fui aceito em Harvard. 😂',
    createdAt: dateToString(new Date(2023, 6, 20, 10, 15)),
    timestamp: dateToString(new Date(2023, 6, 20, 10, 15)),
    isRead: true,
    roomId: 'global'
  },
  {
    id: 'msg2',
    senderId: 'user3',
    receiverId: 'global',
    content: 'Amei sua última mentira sobre o unicórnio no shopping! Como você inventa essas coisas? 🦄',
    createdAt: dateToString(new Date(2023, 6, 20, 10, 17)),
    timestamp: dateToString(new Date(2023, 6, 20, 10, 17)),
    isRead: true,
    roomId: 'global'
  },
  {
    id: 'msg3',
    senderId: 'user2',
    receiverId: 'global',
    content: 'Alguém tem alguma dica para criar uma mentira sobre viagem? Quero fazer meus amigos acreditarem que fui para o Japão.',
    createdAt: dateToString(new Date(2023, 6, 20, 10, 20)),
    timestamp: dateToString(new Date(2023, 6, 20, 10, 20)),
    isRead: true,
    roomId: 'global'
  },
  {
    id: 'msg4',
    senderId: 'user5',
    receiverId: 'global',
    content: 'Diga que aprendeu a fazer sushi com um mestre japonês e poste fotos de sushi que você "fez", mas comprou pronto! 🍣',
    createdAt: dateToString(new Date(2023, 6, 20, 10, 22)),
    timestamp: dateToString(new Date(2023, 6, 20, 10, 22)),
    isRead: true,
    roomId: 'global'
  },
  {
    id: 'msg5',
    senderId: 'user4',
    receiverId: 'global',
    content: 'Estou pensando em criar uma mentira sobre ter conhecido um famoso. Quem vocês acham que seria mais plausível?',
    createdAt: dateToString(new Date(2023, 6, 20, 10, 25)),
    timestamp: dateToString(new Date(2023, 6, 20, 10, 25)),
    isRead: true,
    roomId: 'global'
  },
  {
    id: 'msg6',
    senderId: 'user1',
    receiverId: 'global',
    content: 'Escolha alguém que esteja em turnê na sua cidade, assim é mais crível!',
    createdAt: dateToString(new Date(2023, 6, 20, 10, 27)),
    timestamp: dateToString(new Date(2023, 6, 20, 10, 27)),
    isRead: true,
    roomId: 'global'
  }
];

// Chats privados
export const mockPrivateChats: { [chatId: string]: ChatMessage[] } = {
  'chat-user1-user3': [
    {
      id: 'priv1',
      senderId: 'user1',
      receiverId: 'user3',
      content: 'Ei, rainha! Aquela sua mentira sobre o Gordon Ramsay foi épica! 👨‍🍳',
      createdAt: dateToString(new Date(2023, 6, 19, 15, 30)),
      timestamp: dateToString(new Date(2023, 6, 19, 15, 30)),
      isRead: true,
      roomId: 'chat-user1-user3'
    },
    {
      id: 'priv2',
      senderId: 'user3',
      receiverId: 'user1',
      content: 'Valeu! Eu me inspirei naquele programa de culinária que assisti ontem. A cara dele de decepção é impagável!',
      createdAt: dateToString(new Date(2023, 6, 19, 15, 35)),
      timestamp: dateToString(new Date(2023, 6, 19, 15, 35)),
      isRead: true,
      roomId: 'chat-user1-user3'
    },
    {
      id: 'priv3',
      senderId: 'user1',
      receiverId: 'user3',
      content: 'Quer participar da batalha de mentiras comigo? Podemos criar uma dupla imbatível!',
      createdAt: dateToString(new Date(2023, 6, 19, 15, 40)),
      timestamp: dateToString(new Date(2023, 6, 19, 15, 40)),
      isRead: true,
      roomId: 'chat-user1-user3'
    },
    {
      id: 'priv4',
      senderId: 'user3',
      receiverId: 'user1',
      content: 'Claro! Vamos dominar essa batalha com nossas mentiras! 💪',
      createdAt: dateToString(new Date(2023, 6, 19, 15, 42)),
      timestamp: dateToString(new Date(2023, 6, 19, 15, 42)),
      isRead: true,
      roomId: 'chat-user1-user3'
    }
  ],
  'chat-user1-user2': [
    {
      id: 'priv5',
      senderId: 'user1',
      receiverId: 'user2',
      content: 'Cara, preciso de ideias para mentiras sobre tecnologia. Você é bom nisso!',
      createdAt: dateToString(new Date(2023, 6, 18, 20, 10)),
      timestamp: dateToString(new Date(2023, 6, 18, 20, 10)),
      isRead: true,
      roomId: 'chat-user1-user2'
    },
    {
      id: 'priv6',
      senderId: 'user2',
      receiverId: 'user1',
      content: 'Que tal dizer que hackeou a NASA com um Raspberry Pi? Ou que criou um app que foi comprado pelo Google?',
      createdAt: dateToString(new Date(2023, 6, 18, 20, 15)),
      timestamp: dateToString(new Date(2023, 6, 18, 20, 15)),
      isRead: true,
      roomId: 'chat-user1-user2'
    },
    {
      id: 'priv7',
      senderId: 'user1',
      receiverId: 'user2',
      content: 'A do app é boa! Vou elaborar isso, valeu!',
      createdAt: dateToString(new Date(2023, 6, 18, 20, 20)),
      timestamp: dateToString(new Date(2023, 6, 18, 20, 20)),
      isRead: true,
      roomId: 'chat-user1-user2'
    }
  ],
  'chat-user2-user5': [
    {
      id: 'priv8',
      senderId: 'user2',
      receiverId: 'user5',
      content: 'Vi que você é PRO. Vale a pena assinar?',
      createdAt: dateToString(new Date(2023, 6, 17, 12, 0)),
      timestamp: dateToString(new Date(2023, 6, 17, 12, 0)),
      isRead: true,
      roomId: 'chat-user2-user5'
    },
    {
      id: 'priv9',
      senderId: 'user5',
      receiverId: 'user2',
      content: 'Com certeza! O gerador de mentiras é incrível, salva muito tempo quando estou sem ideias!',
      createdAt: dateToString(new Date(2023, 6, 17, 12, 5)),
      timestamp: dateToString(new Date(2023, 6, 17, 12, 5)),
      isRead: true,
      roomId: 'chat-user2-user5'
    }
  ]
};

// Desafios
export const mockChallenges: Challenge[] = [
  {
    id: 'challenge1',
    title: 'Dia Mais Bizarro',
    description: 'Crie uma mentira sobre o dia mais bizarro da sua vida. Quanto mais absurdo, melhor!',
    category: 'criatividade',
    reward: 100,
    startDate: dateToString(new Date(Date.now() - 86400000 * 3)),
    endDate: dateToString(new Date(Date.now() + 86400000 * 4)),
    participants: ['user2', 'user3', 'user5']
  },
  {
    id: 'challenge2',
    title: 'Inventor Fingido',
    description: 'Invente uma história sobre como você criou um objeto ou tecnologia do cotidiano.',
    category: 'tecnologia',
    reward: 150,
    startDate: dateToString(new Date(Date.now() - 86400000 * 5)),
    endDate: dateToString(new Date(Date.now() + 86400000 * 2)),
    participants: ['user1', 'user4', 'user2']
  },
  {
    id: 'challenge3',
    title: 'Refeição Impossível',
    description: 'Conte uma mentira sobre a refeição mais inacreditável que você já preparou ou comeu.',
    category: 'comida',
    reward: 120,
    startDate: dateToString(new Date(Date.now())),
    endDate: dateToString(new Date(Date.now() + 86400000 * 7)),
    participants: []
  }
];

// Conquistas
export const mockAchievements: Achievement[] = [
  {
    id: 'ach1',
    title: 'Primeiro Post',
    description: 'Publicou sua primeira mentira',
    icon: '🏆',
    points: 10,
    earnedAt: '2023-01-15'
  },
  {
    id: 'ach2',
    title: 'Mentiroso Profissional',
    description: 'Publicou 10 mentiras',
    icon: '👑',
    points: 20,
    earnedAt: '2023-02-22'
  },
  {
    id: 'ach3',
    title: 'Viral',
    description: 'Teve uma mentira com mais de 50 reações',
    icon: '🚀',
    points: 30,
    earnedAt: '2023-03-05'
  },
  {
    id: 'ach4',
    title: 'Mestre das Tags',
    description: 'Usou todas as tags disponíveis',
    icon: '🏷️' ,
    points: 25,
    earnedAt: '2023-04-12'
  },
  {
    id: 'ach5',
    title: 'Mentiroso Local',
    description: 'Mais mentiras populares em sua cidade',
    icon: '📍',
    points: 35,
    earnedAt: '2023-06-22'
  },
  {
    id: 'ach6',
    title: 'Dedicação Total',
    description: 'Postou mentiras por 30 dias consecutivos',
    icon: '📚',
    points: 50,
    earnedAt: '2023-05-08'
  },
  {
    id: 'ach7',
    title: 'Assinante Premium',
    description: 'Assinante PRO por 6 meses',
    icon: '💎',
    points: 40,
    earnedAt: '2022-08-15'
  }
];

// Gerador de mentiras aleatórias
export const mentirasMalucas = [
  "Acordei esta manhã falando fluentemente mandarim. Minha família está preocupada, mas consegui um emprego como tradutor na embaixada chinesa.",
  "Meu carro quebrou ontem, mas um unicórnio apareceu e me levou para o trabalho. Agora ele está estacionado no meu quintal comendo as rosas da minha vizinha.",
  "Na semana passada, fui selecionado para ser o primeiro turista em Marte, mas recusei porque a Wi-Fi de lá é muito ruim.",
  "Treinei meu peixinho dourado para buscar o jornal todas as manhãs. O problema é que ele demora 3 horas para voltar e o jornal chega encharcado.",
  "Inventei um spray que transforma brócolis em chocolate. Estou negociando com grandes empresas, mas ninguém acredita na minha invenção revolucionária.",
  "Ontem à noite, consegui tirar uma selfie com o Pé Grande. Ele pediu para eu não postar porque está escondido da ex-esposa que quer pensão alimentícia.",
  "Ganhei na loteria, mas um esquilo roubou meu bilhete premiado para forrar o ninho dele. Agora estou montando uma equipe de resgate para recuperá-lo.",
  "Descobri que posso conversar com plantas. Meu cacto me contou que está planejando dominar o mundo começando pelo meu apartamento.",
  "Minha avó de 95 anos acabou de ganhar um campeonato de skate radical. Ela usou a bengala para fazer manobras que nem o Tony Hawk consegue fazer.",
  "Estou vendendo minha coleção de nuvens raras. Tenho uma em formato de girafa que é avaliada em 1 milhão de dólares.",
  "Meu gato aprendeu a usar o microondas. Hoje de manhã ele preparou um café da manhã completo para mim, com direito a ovos mexidos.",
  "Fui abduzido por alienígenas ontem, mas eles me devolveram porque eu não parava de contar piadas ruins. Um deles até pediu para ser desbloqueado do meu Instagram.",
  "Entrei para o Livro dos Recordes por conseguir equilibrar 50 colheres no nariz enquanto recitava o alfabeto de trás para frente em japonês.",
  "Meu vizinho é um super-herói disfarçado. Ontem vi ele saindo de casa com uma capa, mas ele falou que era só uma toalha que ele esqueceu de tirar depois do banho.",
  "Inventei um creme dental que faz os dentes mudarem de cor conforme o humor. Ontem estava tão bravo que meus dentes ficaram vermelhos o dia todo."
];

// TAGS disponíveis
export const TAGS = [
  'alien', 'ex', 'vidarica', 'politico', 'trabalho', 
  'familia', 'pet', 'amigos', 'escola', 'tecnologia',
  'viagem', 'famoso', 'esporte', 'comida', 'festa'
]; 