import { generateRealPersonAvatar } from '@/utils/avatarUtils';

export interface ChatMessage {
  id: string;
  userId: string;
  displayName: string;
  photoURL: string;
  text: string;
  createdAt: Date;
  isPro: boolean;
}

export class ChatApiService {
  // Dados de demonstração com avatares reais
  private static demoMessages: ChatMessage[] = [
    {
      id: 'msg1',
      userId: 'user1',
      displayName: 'Rafael Silva',
      photoURL: generateRealPersonAvatar('men'),
      text: 'Gente, acredita que fui abduzido ontem?',
      createdAt: new Date(Date.now() - 3600000 * 3),
      isPro: true
    },
    {
      id: 'msg2',
      userId: 'user2',
      displayName: 'Carla Mendes',
      photoURL: generateRealPersonAvatar('women'),
      text: 'Que mentira mais sem graça, todo mundo sabe que aliens não abduzem mais desde 2010',
      createdAt: new Date(Date.now() - 3600000 * 2),
      isPro: false
    },
    {
      id: 'msg3',
      userId: 'user3',
      displayName: 'Pedro Santos',
      photoURL: generateRealPersonAvatar('men'),
      text: 'Mas eu vi também! Eles tinham uma nave em forma de banana 🍌',
      createdAt: new Date(Date.now() - 3600000),
      isPro: false
    },
    {
      id: 'msg4',
      userId: 'user4',
      displayName: 'Amanda Costa',
      photoURL: generateRealPersonAvatar('women'),
      text: 'Vocês não sabem mentir direito. Um alien me deu a fórmula para ganhar na loteria.',
      createdAt: new Date(Date.now() - 1800000),
      isPro: true
    },
    {
      id: 'msg5',
      userId: 'user4',
      displayName: 'Amanda Costa',
      photoURL: generateRealPersonAvatar('women'),
      text: 'Tô vendendo essa fórmula por apenas R$999,99. Quem quiser me manda DM!',
      createdAt: new Date(Date.now() - 900000),
      isPro: true
    },
    {
      id: 'msg6',
      userId: 'user5',
      displayName: 'Felipe Martins',
      photoURL: generateRealPersonAvatar('men'),
      text: 'Alguém mais viu o pessoal que mora no centro da Terra? 🌍',
      createdAt: new Date(Date.now() - 450000),
      isPro: false
    },
    {
      id: 'msg7',
      userId: 'user6',
      displayName: 'Juliana Souza',
      photoURL: generateRealPersonAvatar('women'),
      text: 'Gente, sou nova aqui! Como funciona o ranking de mentiras?',
      createdAt: new Date(Date.now() - 300000),
      isPro: false
    },
    {
      id: 'msg8',
      userId: 'user1',
      displayName: 'Rafael Silva',
      photoURL: generateRealPersonAvatar('men'),
      text: '@Juliana Souza: Quanto mais reações sua mentira tem, mais você sobe no ranking! 🚀',
      createdAt: new Date(Date.now() - 180000),
      isPro: true
    },
    {
      id: 'msg9',
      userId: 'user7',
      displayName: 'Bruno Costa',
      photoURL: generateRealPersonAvatar('men'),
      text: 'Acabei de postar minha mentira sobre viagem no tempo! Vão lá conferir 😄',
      createdAt: new Date(Date.now() - 60000),
      isPro: false
    },
    {
      id: 'msg10',
      userId: 'user8',
      displayName: 'Larissa Oliveira',
      photoURL: generateRealPersonAvatar('women'),
      text: 'Boa sorte Bruno! Votei na sua história 👍',
      createdAt: new Date(Date.now() - 30000),
      isPro: true
    }
  ];

  // Obter mensagens de chat
  static async getMessages(limit?: number, before?: Date): Promise<ChatMessage[]> {
    let messages = [...this.demoMessages];
    
    // Filtrar por data se fornecido
    if (before) {
      messages = messages.filter(msg => msg.createdAt < before);
    }
    
    // Ordenar por data decrescente
    messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    // Limitar quantidade de mensagens
    if (limit) {
      messages = messages.slice(0, limit);
    }
    
    return messages;
  }
  
  // Adicionar nova mensagem
  static async addMessage(
    userId: string,
    text: string,
    userInfo: { displayName: string; photoURL: string; isPro: boolean }
  ): Promise<ChatMessage> {
    const newMessage: ChatMessage = {
      id: `msg${Date.now()}`,
      userId,
      displayName: userInfo.displayName,
      photoURL: userInfo.photoURL,
      text,
      createdAt: new Date(),
      isPro: userInfo.isPro
    };
    
    // Em produção, isso seria salvo em um banco de dados
    this.demoMessages.push(newMessage);
    
    return newMessage;
  }
}