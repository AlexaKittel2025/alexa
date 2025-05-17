'use client';

import { useState, useEffect } from 'react';
import { FaThumbsUp, FaLaugh, FaTrophy, FaHeart } from 'react-icons/fa';

interface Reaction {
  id: string;
  type: 'quaseAcreditei' | 'hahaha' | 'mentiraEpica';
  userName: string;
  userPhoto: string;
  postId: string;
  timestamp: Date;
  isMine?: boolean;
}

interface LiveReactionsProps {
  userId?: string;
}

export default function LiveReactions({ userId }: LiveReactionsProps) {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [visibleReactions, setVisibleReactions] = useState<Reaction[]>([]);

  useEffect(() => {
    // Em um app real, esse seria um listener em tempo real do Firebase
    // Aqui usamos uma simulação com timer para demonstração
    
    // Lista inicial de reações
    const mockReactions: Reaction[] = [
      {
        id: '1',
        type: 'quaseAcreditei',
        userName: 'Carlos Silva',
        userPhoto: 'https://randomuser.me/api/portraits/men/43.jpg',
        postId: 'post1',
        timestamp: new Date(Date.now() - 15000)
      },
      {
        id: '2',
        type: 'hahaha',
        userName: 'Ana Costa',
        userPhoto: 'https://randomuser.me/api/portraits/women/33.jpg',
        postId: 'post2',
        timestamp: new Date(Date.now() - 30000)
      },
      {
        id: '3',
        type: 'mentiraEpica',
        userName: 'Pedro Santos',
        userPhoto: 'https://randomuser.me/api/portraits/men/55.jpg',
        postId: 'post3',
        timestamp: new Date(Date.now() - 45000)
      }
    ];
    
    setReactions(mockReactions);
    setVisibleReactions(mockReactions);
    
    // Simular reações entrando ao vivo
    const interval = setInterval(() => {
      const newReaction: Reaction = {
        id: `reaction-${Date.now()}`,
        type: getRandomReactionType(),
        userName: getRandomName(),
        userPhoto: getRandomAvatar(),
        postId: `post${Math.floor(Math.random() * 10) + 1}`,
        timestamp: new Date(),
        isMine: Math.random() < 0.2 // 20% de chance de ser uma reação às minhas postagens
      };
      
      setReactions(prev => [newReaction, ...prev].slice(0, 50)); // Manter até 50 reações
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Atualizar as reações visíveis sempre que a lista principal mudar
  useEffect(() => {
    setVisibleReactions(reactions.slice(0, 7)); // Mostrar apenas as 7 mais recentes
  }, [reactions]);
  
  const getRandomReactionType = (): 'quaseAcreditei' | 'hahaha' | 'mentiraEpica' => {
    const types = ['quaseAcreditei', 'hahaha', 'mentiraEpica'];
    return types[Math.floor(Math.random() * types.length)] as any;
  };
  
  const getRandomName = (): string => {
    const names = [
      'Maria Oliveira', 'João Silva', 'Ana Santos', 'Carlos Ferreira',
      'Juliana Costa', 'Roberto Almeida', 'Fernanda Lima', 'Ricardo Souza',
      'Patricia Mendes', 'Fernando Gomes', 'Camila Rodrigues', 'Bruno Martins'
    ];
    return names[Math.floor(Math.random() * names.length)];
  };
  
  const getRandomAvatar = (): string => {
    const gender = Math.random() > 0.5 ? 'men' : 'women';
    const number = Math.floor(Math.random() * 99) + 1;
    return `https://randomuser.me/api/portraits/${gender}/${number}.jpg`;
  };
  
  const getReactionIcon = (type: string) => {
    switch (type) {
      case 'quaseAcreditei':
        return <FaThumbsUp className="text-blue-500" />;
      case 'hahaha':
        return <FaLaugh className="text-yellow-500" />;
      case 'mentiraEpica':
        return <FaTrophy className="text-purple-500" />;
      default:
        return <FaHeart className="text-red-500" />;
    }
  };
  
  const getReactionText = (type: string): string => {
    switch (type) {
      case 'quaseAcreditei':
        return 'quase acreditou na sua mentira';
      case 'hahaha':
        return 'achou sua mentira engraçada';
      case 'mentiraEpica':
        return 'achou sua mentira épica';
      default:
        return 'reagiu à sua mentira';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-purple-600 text-white p-4 flex items-center">
        <FaHeart className="mr-2" />
        <h2 className="text-lg font-semibold">Reações em Tempo Real</h2>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {visibleReactions.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {visibleReactions.map((reaction) => (
              <li 
                key={reaction.id} 
                className={`p-3 transition-colors ${
                  reaction.isMine ? 'bg-purple-50' : ''
                }`}
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                    <img 
                      src={reaction.userPhoto} 
                      alt={reaction.userName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">
                      <span className="font-medium">{reaction.userName}</span>
                      {reaction.isMine ? (
                        <span> {getReactionText(reaction.type)}</span>
                      ) : (
                        <span> reagiu a uma mentira</span>
                      )}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(reaction.timestamp)}
                    </span>
                  </div>
                  
                  <div className="ml-2 flex-shrink-0">
                    {getReactionIcon(reaction.type)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-4 text-center text-gray-500">
            Nenhuma reação recente.
          </p>
        )}
      </div>
      
      <div className="bg-gray-50 p-3 border-t text-center">
        <p className="text-xs text-gray-500">
          As reações são atualizadas em tempo real.
        </p>
      </div>
    </div>
  );
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Agora mesmo';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'} atrás`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hora' : 'horas'} atrás`;
  } else {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }
} 