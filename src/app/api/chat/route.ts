import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

// GET - Obter mensagens de chat
export async function GET(req: Request) {
  try {
    // Dados de demonstração para mensagens de chat
    const demoMessages = [
      {
        id: 'msg1',
        userId: 'user1',
        displayName: 'Rafael Silva',
        photoURL: 'https://randomuser.me/api/portraits/men/32.jpg',
        text: 'Gente, acredita que fui abduzido ontem?',
        createdAt: new Date(Date.now() - 3600000 * 3),
        isPro: true
      },
      {
        id: 'msg2',
        userId: 'user2',
        displayName: 'Carla Mendes',
        photoURL: 'https://randomuser.me/api/portraits/women/44.jpg',
        text: 'Que mentira mais sem graça, todo mundo sabe que aliens não abduzem mais desde 2010',
        createdAt: new Date(Date.now() - 3600000 * 2),
        isPro: false
      },
      {
        id: 'msg3',
        userId: 'user3',
        displayName: 'Pedro Santos',
        photoURL: 'https://randomuser.me/api/portraits/men/67.jpg',
        text: 'Mas eu vi também! Eles tinham uma nave em forma de banana 🍌',
        createdAt: new Date(Date.now() - 3600000),
        isPro: false
      },
      {
        id: 'msg4',
        userId: 'user4',
        displayName: 'Amanda Costa',
        photoURL: 'https://randomuser.me/api/portraits/women/12.jpg',
        text: 'Vocês não sabem mentir direito. Um alien me deu a fórmula para ganhar na loteria.',
        createdAt: new Date(Date.now() - 1800000),
        isPro: true
      },
      {
        id: 'msg5',
        userId: 'user4',
        displayName: 'Amanda Costa',
        photoURL: 'https://randomuser.me/api/portraits/women/12.jpg',
        text: 'Tô vendendo essa fórmula por apenas R$999,99. Quem quiser me manda DM!',
        createdAt: new Date(Date.now() - 1790000),
        isPro: true
      }
    ];
    
    return NextResponse.json({ messages: demoMessages });
  } catch (error) {
    console.error('Erro ao obter mensagens de chat:', error);
    return NextResponse.json(
      { error: 'Falha ao carregar mensagens de chat' },
      { status: 500 }
    );
  }
}

// POST - Enviar nova mensagem
export async function POST(req: Request) {
  try {
    // Verificar token de autenticação
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const user = await verifyToken(token);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }
    
    // Validar o corpo da requisição
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Formato de dados inválido' },
        { status: 400 }
      );
    }
    
    const { text } = body;
    
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return NextResponse.json(
        { error: 'Conteúdo da mensagem é obrigatório' },
        { status: 400 }
      );
    }
    
    // Verificar tamanho máximo da mensagem
    if (text.length > 500) {
      return NextResponse.json(
        { error: 'Mensagem muito longa. Máximo de 500 caracteres.' },
        { status: 400 }
      );
    }
    
    // No ambiente real, salvaríamos no banco de dados
    // Aqui estamos apenas simulando o retorno
    const newMessage = {
      id: `msg_${Date.now()}`,
      userId: user.id,
      displayName: user.display_name,
      photoURL: user.photo_url || null,
      text: text.trim(),
      createdAt: new Date(),
      isPro: false
    };
    
    return NextResponse.json(newMessage);
  } catch (error) {
    console.error('Erro ao enviar mensagem de chat:', error);
    return NextResponse.json(
      { error: 'Erro ao enviar mensagem' },
      { status: 500 }
    );
  }
} 