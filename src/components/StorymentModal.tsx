import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  XIcon,
  ChatIcon,
  ShareIcon,
  EyeIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  HeartIcon
} from '@heroicons/react/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/solid';
import { User, Storyment } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { mockUsers } from '../services/mockData';
import { toggleFollowUser } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

// Componente para a barra de progresso dos stories
const ProgressBar: React.FC<{
  progress: number;
  isSmooth?: boolean;
  isActive: boolean;
}> = ({ progress, isSmooth = true, isActive }) => (
  <div className="absolute top-0 left-0 right-0 h-2 bg-gray-300 bg-opacity-30 z-40">
    <div 
      className={`h-full bg-white ${isActive ? 'transition-width' : ''}`}
      style={{ 
        width: `${progress}%`, 
        transition: isSmooth && isActive ? 'width 50ms linear' : 'none'
      }}
    />
  </div>
);

// Componente para o grupo de barras de progresso
const ProgressGroup: React.FC<{
  stories: Storyment[];
  currentIndex: number;
  currentProgress: number;
}> = ({ stories, currentIndex, currentProgress }) => (
  <div className="absolute top-0 left-0 right-0 flex space-x-1 p-2">
    {stories.map((_, index) => (
      <div key={index} className="h-1 bg-gray-300 bg-opacity-30 flex-grow rounded-full overflow-hidden">
        {index < currentIndex ? (
          <div className="h-full bg-white w-full" />
        ) : index === currentIndex ? (
          <div 
            className="h-full bg-white transition-width" 
            style={{ width: `${currentProgress}%` }}
          />
        ) : (
          <div className="h-full bg-white w-0" />
        )}
      </div>
    ))}
  </div>
);

// Componente para a animação de curtida
const LikeAnimation: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center animate-fade-out pointer-events-none z-30">
    <div className="bg-black bg-opacity-50 px-4 py-2 rounded-full flex items-center animate-pulse-once">
      <HeartIconSolid className="h-6 w-6 text-red-500 mr-2" />
      <span className="text-white font-semibold">Amei</span>
    </div>
  </div>
);

// Componente para os controles de navegação
const NavigationControls: React.FC<{
  onPrev?: () => void;
  onNext: () => void;
  pauseProgress: () => void;
  continueProgress: () => void;
}> = ({ onPrev, onNext, pauseProgress, continueProgress }) => (
  <>
    {/* Área de toque esquerda (sem sobrepor rodapé) */}
    <div
      className="absolute top-0 bottom-20 left-0 w-1/3 z-10"
      onTouchStart={pauseProgress}
      onMouseDown={pauseProgress}
      onTouchEnd={continueProgress}
      onMouseUp={continueProgress}
      onClick={onPrev}
    />

    {/* Área de toque direita (sem sobrepor rodapé) */}
    <div
      className="absolute top-0 bottom-20 right-0 w-1/3 z-10"
      onTouchStart={pauseProgress}
      onMouseDown={pauseProgress}
      onTouchEnd={continueProgress}
      onMouseUp={continueProgress}
      onClick={onNext}
    />

    {/* Botão visível para voltar */}
    <div className="absolute top-1/2 left-2 transform -translate-y-1/2 z-20">
      {onPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="bg-black bg-opacity-40 hover:bg-opacity-60 rounded-full p-2"
          onMouseEnter={pauseProgress}
          onMouseLeave={continueProgress}
        >
          <ArrowLeftIcon className="h-5 w-5 text-white" />
        </button>
      )}
    </div>

    {/* Botão visível para avançar */}
    <div className="absolute top-1/2 right-2 transform -translate-y-1/2 z-20">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="bg-black bg-opacity-40 hover:bg-opacity-60 rounded-full p-2"
        onMouseEnter={pauseProgress}
        onMouseLeave={continueProgress}
      >
        <ArrowRightIcon className="h-5 w-5 text-white" />
      </button>
    </div>
  </>
);

// Componente para o cabeçalho com informações do usuário
const StoryHeader: React.FC<{
  user: User | null;
  createdAt: string | Date;
  expiresAt: string | Date;
}> = ({ user, createdAt, expiresAt }) => {
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  };

  const getTimeElapsed = () => {
    const now = new Date();
    const created = typeof createdAt === 'string' 
      ? new Date(createdAt) 
      : createdAt;
    
    const diffMs = now.getTime() - created.getTime();
    
    if (diffMs < 60000) {
      return 'Agora mesmo';
    } else if (diffMs < 3600000) {
      const mins = Math.floor(diffMs / 60000);
      return `${mins} ${mins === 1 ? 'minuto' : 'minutos'} atrás`;
    } else if (diffMs < 86400000) {
      const hours = Math.floor(diffMs / 3600000);
      return `${hours} ${hours === 1 ? 'hora' : 'horas'} atrás`;
    } else {
      const days = Math.floor(diffMs / 86400000);
      return `${days} ${days === 1 ? 'dia' : 'dias'} atrás`;
    }
  };

  return (
    <div className="flex items-center p-4 pt-6">
      <div className="flex items-center">
        {user?.photoURL && (
          <Link to={`/profile/${user.username}`} title={user.displayName}>
            <img 
              src={user.photoURL}
              alt={user.displayName}
              className="w-9 h-9 rounded-full mr-2 border-2 border-white cursor-pointer hover:opacity-80 transition"
            />
          </Link>
        )}
        <div>
          <Link to={`/profile/${user?.username}`} title={user?.displayName}>
            <h3 className="font-bold hover:underline cursor-pointer">{user?.displayName || 'Usuário'}</h3>
          </Link>
          <p className="text-xs opacity-80">{getTimeElapsed()}</p>
        </div>
      </div>
    </div>
  );
};

// Componente para mostrar quem visualizou ou curtiu o story
const ViewersModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  title: string;
  type: 'view' | 'like';
}> = ({ isOpen, onClose, users, title, type }) => {
  const { currentUser } = useAuth();
  const [followStates, setFollowStates] = useState<{[userId: string]: boolean}>({});
  const [loadingFollow, setLoadingFollow] = useState<{[userId: string]: boolean}>({});
  
  useEffect(() => {
    // Inicializar estado de seguir para cada usuário
    const initialStates: {[userId: string]: boolean} = {};
    users.forEach(user => {
      initialStates[user.id] = false; // Sempre começa como não seguindo
    });
    setFollowStates(initialStates);
  }, [users]);
  
  const handleFollowClick = async (userId: string) => {
    if (!currentUser || loadingFollow[userId]) return;
    
    try {
      setLoadingFollow(prev => ({ ...prev, [userId]: true }));
      
      const result = await toggleFollowUser(currentUser.id, userId);
      
      if (result.success) {
        setFollowStates(prev => ({
          ...prev,
          [userId]: result.isFollowing
        }));
      }
    } catch (error) {
      console.error('Erro ao seguir/deixar de seguir:', error);
    } finally {
      setLoadingFollow(prev => ({ ...prev, [userId]: false }));
    }
  };
  
  console.log("ViewersModal renderizado", { isOpen, users, title, type });
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 bg-primary bg-opacity-10 p-3 rounded-md">
          <h3 className="text-lg font-semibold text-primary flex items-center">
            {type === 'view' ? (
              <EyeIcon className="h-5 w-5 mr-2" />
            ) : (
              <HeartIconSolid className="h-5 w-5 mr-2 text-red-500" />
            )}
            {title}
          </h3>
          <button
            className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        
        {users.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            Ninguém {type === 'view' ? 'visualizou' : 'curtiu'} este story ainda.
          </div>
        ) : (
          <div>
            <div className="mb-2 px-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {users.length} {users.length === 1 ? 'pessoa' : 'pessoas'}
              </p>
            </div>
            <div className="max-h-[60vh] overflow-y-auto pr-1 space-y-1">
              {users.map(user => (
                <div 
                  key={user.id} 
                  className="flex items-center p-3 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <Link to={`/profile/${user.username}`} className="relative">
                    <img
                      src={user.photoURL || 'https://via.placeholder.com/40'}
                      alt={user.displayName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary cursor-pointer hover:opacity-80 transition"
                    />
                    {user.isPro && (
                      <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-xs rounded-full w-5 h-5 flex items-center justify-center border border-white">
                        ⭐
                      </div>
                    )}
                  </Link>
                  <Link to={`/profile/${user.username}`} className="ml-3 flex-grow">
                    <div className="flex items-center">
                      <p className="font-medium">{user.displayName}</p>
                      {type === 'like' && (
                        <HeartIconSolid className="h-4 w-4 text-red-500 ml-1" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      @{user.username}
                      <span className="mx-1">•</span>
                      Nível {user.level}
                    </p>
                  </Link>
                  <div className="ml-auto">
                    {currentUser && currentUser.id !== user.id && (
                      <button 
                        onClick={() => handleFollowClick(user.id)}
                        className={`text-xs font-medium px-2 py-1 rounded-full transition-all ${
                          followStates[user.id] 
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200' 
                            : 'bg-primary text-white'
                        }`}
                        disabled={loadingFollow[user.id]}
                      >
                        {loadingFollow[user.id] 
                          ? '...' 
                          : followStates[user.id] 
                            ? 'Seguindo' 
                            : 'Seguir'
                        }
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface StoryFooterProps {
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
  views: number;
  onLike: (e?: React.MouseEvent) => void;
  onViewersClick: (e?: React.MouseEvent) => void;
  onLikersClick: (e?: React.MouseEvent) => void;
  pauseProgress: () => void;
  continueProgress: () => void;
  showCommentInput: boolean;
  comment: string;
  setComment: (value: string) => void;
  submitComment: () => void;
  setShowCommentInput: (value: boolean) => void;
}

const StoryFooter: React.FC<StoryFooterProps> = ({
  isLiked,
  likeCount,
  commentCount,
  views,
  onLike,
  onViewersClick,
  onLikersClick,
  pauseProgress,
  continueProgress,
  showCommentInput,
  comment,
  setComment,
  submitComment,
  setShowCommentInput
}) => (
  <div className="p-3 bg-black bg-opacity-20">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        {/* Curtir */}
        <div className="flex items-center">
          <button 
            onClick={onLike}
            className="flex items-center gap-1 p-1.5 rounded-full hover:bg-black hover:bg-opacity-20"
            onMouseEnter={pauseProgress}
            onMouseLeave={continueProgress}
          >
            {isLiked ? (
              <HeartIconSolid className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5" />
            )}
            {likeCount > 0 && (
              <span
                className={`text-xs font-medium ${isLiked ? 'text-red-500' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onLikersClick(e);
                }}
              >
                {likeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Visualizações */}
      <div className="flex items-center space-x-1">
        <button
          className="flex items-center" 
          onClick={(e) => {
            e.stopPropagation();
            onViewersClick(e);
          }}
          onMouseEnter={pauseProgress}
          onMouseLeave={continueProgress}
        >
          <EyeIcon className="h-4 w-4" />
          <span className="text-xs ml-1">{views}</span>
        </button>
      </div>
    </div>
  </div>
);

interface StoryModalProps {
  stories: Storyment[];
  initialStoryIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  storyDuration?: number; // Duração em milissegundos (padrão: 5000)
  setStoriesByUser: React.Dispatch<React.SetStateAction<Record<string, Storyment[]>>>;
  storiesByUser: Record<string, Storyment[]>;
}

const StorymentModal: React.FC<StoryModalProps> = ({ 
  stories, 
  initialStoryIndex = 0,
  isOpen, 
  onClose, 
  currentUser,
  storyDuration = 5000,
  setStoriesByUser,
  storiesByUser
}) => {
  // Estados do gerenciamento de stories
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [storiesForUser, setStoriesForUser] = useState<Storyment[]>(stories);
  
  // Estados de usuário e carregamento
  const [users, setUsers] = useState<Record<string, User | null>>({});
  const [loading, setLoading] = useState(true);
  
  // Estados de interação
  const [comment, setComment] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  
  // Estados de contadores
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  
  // Estados para modais de visualização e curtidas
  const [showViewersModal, setShowViewersModal] = useState(false);
  const [showLikersModal, setShowLikersModal] = useState(false);
  const [viewerUsers, setViewerUsers] = useState<User[]>([]);
  const [likerUsers, setLikerUsers] = useState<User[]>([]);
  
  // Refs para controle
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement | null>(null);

  // Story atual
  const currentStory = storiesForUser[currentStoryIndex];

  // Calcular o passo de progresso
  const progressStep = (100 * 50) / storyDuration; // 50ms é o intervalo do timer

  // Atualizar storiesForUser quando stories muda
  useEffect(() => {
    setStoriesForUser(stories);
    setCurrentStoryIndex(initialStoryIndex);
  }, [stories, initialStoryIndex]);
  
  // Efeito para carregar dados dos usuários
  useEffect(() => {
    if (!isOpen) return;
    
    const loadUsers = async () => {
      setLoading(true);
      
      // Reunir todos os IDs de usuários dos stories
      const userIds = Array.from(new Set(stories.filter(story => story && story.userId).map(story => story.userId)));
      
      // Em um cenário real, faríamos uma chamada API para obter os usuários em batch
      const usersData: Record<string, User> = {};
      
      // Mock dos dados de usuário (em um cenário real, seriam obtidos da API)
      const mockUsers = [
        {
          id: '1',
          username: 'joaosilva',
          displayName: 'João Silva',
          email: 'joao@exemplo.com',
          photoURL: 'https://randomuser.me/api/portraits/men/1.jpg',
          points: 750,
          level: 5,
          isPro: false,
          createdAt: new Date().toISOString(),
          achievements: []
        },
        {
          id: '2',
          username: 'mariasantos',
          displayName: 'Maria Santos',
          email: 'maria@exemplo.com',
          photoURL: 'https://randomuser.me/api/portraits/women/2.jpg',
          points: 1500,
          level: 10,
          isPro: true,
          createdAt: new Date().toISOString(),
          achievements: []
        },
        {
          id: '3',
          username: 'analucia',
          displayName: 'Ana Lucia',
          email: 'ana@exemplo.com',
          photoURL: 'https://randomuser.me/api/portraits/women/3.jpg',
          points: 950,
          level: 8,
          isPro: false,
          createdAt: new Date().toISOString(),
          achievements: []
        }
      ];
      
      // Mapear os usuários mock para os IDs
      userIds.forEach(id => {
        const mockUser = mockUsers.find(user => user.id === id) || mockUsers[0];
        usersData[id] = { ...mockUser };
      });
      
      setUsers(usersData);
      setLoading(false);
    };
    
    loadUsers();
  }, [isOpen, stories]);

  // Efeito para resetar todos os estados quando o modal é fechado
  useEffect(() => {
    if (!isOpen) {
      // Quando o modal é fechado, resetar todos os estados para garantir que possa ser reaberto
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
      // Não resetamos os outros estados aqui para evitar mudanças visuais durante o fechamento
    }
  }, [isOpen]);

  // Funções para controlar o progresso
  const pauseProgress = useCallback(() => {
    setIsPaused(true);
  }, []);
  
  const continueProgress = useCallback(() => {
    setIsPaused(false);
  }, []);

  // Funções para navegação entre stories
  const handleNextStory = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
    
    setTimeout(() => {
      // Verifica se há mais stories do usuário atual
      if (currentStoryIndex < storiesForUser.length - 1) {
        // Ainda existem stories para este usuário, avançar para o próximo
        setCurrentStoryIndex(prev => prev + 1);
        setProgress(0);
      } else {
        // Não há mais stories para este usuário, verificar se há outros usuários com stories
        const userIds = Object.keys(storiesByUser);
        
        // Verificar se o story atual existe antes de acessar suas propriedades
        if (!currentStory) {
          setIsTransitioning(false);
          onClose();
          return;
        }
        
        const currentUserIndex = userIds.findIndex(id => id === currentStory.userId);
        const nextUserId = userIds[currentUserIndex + 1];
        
        if (nextUserId && storiesByUser[nextUserId]?.length > 0) {
          // Há outro usuário com stories, mudar para os stories desse usuário
          const nextStories = storiesByUser[nextUserId];
          setStoriesForUser(nextStories);
          setCurrentStoryIndex(0);
          setProgress(0);
        } else {
          // Não há mais usuários com stories, fechar o modal
          onClose();
        }
      }
      setIsTransitioning(false);
    }, 200);
  }, [currentStoryIndex, storiesForUser, currentStory, storiesByUser, onClose, isTransitioning]);
  
  const handlePrevStory = useCallback(() => {
    if (isTransitioning || currentStoryIndex === 0) return;
    setIsTransitioning(true);
    setProgress(0);
    setTimeout(() => {
      setCurrentStoryIndex(prevIndex => prevIndex - 1);
      setProgress(0);
      setIsTransitioning(false);
    }, 200);
  }, [currentStoryIndex, isTransitioning]);

  // Resetar o estado ao abrir o modal ou mudar o story
  useEffect(() => {
    if (!isOpen) return;

    setProgress(0);
    setIsPaused(false);
    setIsTransitioning(false);

    // Atualize os estados do story atual aqui
    if (currentStory) {
      setIsLiked(currentStory.likedBy?.includes(currentUser.id) || false);
      setLikeCount(currentStory.likes || 0);
      setCommentCount(currentStory.comments?.length || 0);
      setComment('');
      setShowCommentInput(false);
    }

    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }

    progressInterval.current = setInterval(() => {
      if (!isPaused && !isTransitioning) {
        setProgress(prev => {
          const next = prev + progressStep;
          if (next >= 100) {
            // Quando o progresso chega a 100%, avança para o próximo story
            handleNextStory();
            return 100; // Mantém em 100% durante a transição
          }
          return next;
        });
      }
    }, 50);

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
    };
  }, [isOpen, currentStoryIndex, storyDuration, isPaused, isTransitioning, handleNextStory, currentUser.id, currentStory, progressStep]);

  // Funções para interações
  const handleLike = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentStory) return;
    
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount(prev => newLikedState ? prev + 1 : Math.max(0, prev - 1));

    // Atualizar storiesByUser globalmente
    setStoriesByUser(prev => {
      const userStories = prev[currentStory.userId] || [];
      const updatedStories = userStories.map(story => {
        if (story.id === currentStory.id) {
          const alreadyLiked = story.likedBy?.includes(currentUser.id);
          let newLikedBy = story.likedBy || [];
          let newLikes = story.likes || 0;
          if (newLikedState && !alreadyLiked) {
            newLikedBy = [...newLikedBy, currentUser.id];
            newLikes++;
          } else if (!newLikedState && alreadyLiked) {
            newLikedBy = newLikedBy.filter(id => id !== currentUser.id);
            newLikes = Math.max(0, newLikes - 1);
          }
          return {
            ...story,
            likedBy: newLikedBy,
            likes: newLikes
          };
        }
        return story;
      });
      return {
        ...prev,
        [currentStory.userId]: updatedStories
      };
    });

    if (newLikedState) {
      setShowLikeAnimation(true);
      setTimeout(() => {
        setShowLikeAnimation(false);
      }, 1500);
      
      // Adicionar o usuário atual à lista de pessoas que curtiram
      if (currentUser) {
        const updatedLikers = [...likerUsers];
        // Verificar se o usuário já está na lista
        if (!updatedLikers.some(user => user.id === currentUser.id)) {
          updatedLikers.unshift({...currentUser});
          setLikerUsers(updatedLikers);
        }
      }
      
      // Feedback visual adicional
      const heartElement = document.createElement("div");
      heartElement.className = "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl z-50";
      heartElement.textContent = "❤️";
      heartElement.style.animation = "heartBeat 1.5s forwards";
      document.body.appendChild(heartElement);
      
      // Estilos para animação
      const style = document.createElement("style");
      style.textContent = `
        @keyframes heartBeat {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          15% { transform: translate(-50%, -50%) scale(1.4); opacity: 1; }
          30% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          45% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
          60% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
      
      // Remover elementos após a animação
      setTimeout(() => {
        if (document.body.contains(heartElement)) {
          document.body.removeChild(heartElement);
        }
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      }, 1500);
    }
    
    // Em um cenário real: likeStory(currentStory.id, currentUser.id, newLikedState);
    console.log(`${newLikedState ? 'Curtiu' : 'Descurtiu'} o story ${currentStory.id}`);
  }, [isLiked, currentStory, currentUser, likerUsers, setStoriesByUser]);

  const handleComment = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (!currentStory) return;
    if (!showCommentInput) {
      pauseProgress();
      setShowCommentInput(true);
    } else {
      setShowCommentInput(false);
      continueProgress();
    }
  }, [pauseProgress, continueProgress, currentStory, showCommentInput]);

  const submitComment = useCallback(() => {
    if (!comment.trim() || !currentStory) return;
    setCommentCount(prev => prev + 1);
    // Atualizar storiesByUser globalmente
    setStoriesByUser(prev => {
      const userStories = prev[currentStory.userId] || [];
      const updatedStories = userStories.map(story => {
        if (story.id === currentStory.id) {
          return {
            ...story,
            comments: [
              ...(story.comments || []),
              {
                id: `${currentUser.id}-${Date.now()}`,
                postId: '', // stories não têm postId, mas o tipo exige
                userId: currentUser.id,
                content: comment,
                createdAt: new Date().toISOString()
              }
            ]
          };
        }
        return story;
      });
      return {
        ...prev,
        [currentStory.userId]: updatedStories
      };
    });
    setComment('');
    setShowCommentInput(false);
    continueProgress();
    
    // Exibir confirmação ao usuário
    const commentElement = document.createElement("div");
    commentElement.className = "fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium z-50 animate-fade-out";
    commentElement.textContent = "Comentário enviado!";
    commentElement.style.opacity = "0";
    commentElement.style.transition = "opacity 0.3s ease-in-out";
    document.body.appendChild(commentElement);
    
    // Exibir e esconder a confirmação
    setTimeout(() => {
      commentElement.style.opacity = "1";
    }, 100);
    
    setTimeout(() => {
      commentElement.style.opacity = "0";
      setTimeout(() => {
        if (document.body.contains(commentElement)) {
          document.body.removeChild(commentElement);
        }
      }, 300);
    }, 2000);
  }, [comment, continueProgress, currentStory, currentUser, setStoriesByUser]);

  // Função para mostrar quem visualizou
  const handleViewersClick = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentStory) return;
    
    console.log("handleViewersClick chamado");
    pauseProgress();
    
    // Em um cenário real, carregaríamos esse dado da API
    // Mocking mais usuários para visualização para um exemplo mais completo
    const mockViewers: User[] = [
      {
        id: 'v1',
        username: 'carlos_santos',
        displayName: 'Carlos Santos',
        photoURL: 'https://randomuser.me/api/portraits/men/22.jpg',
        email: 'carlos@exemplo.com',
        points: 325,
        level: 4,
        isPro: false,
        createdAt: new Date().toISOString(),
        achievements: []
      },
      {
        id: 'v2',
        username: 'paula_costa',
        displayName: 'Paula Costa',
        photoURL: 'https://randomuser.me/api/portraits/women/33.jpg',
        email: 'paula@exemplo.com',
        points: 825,
        level: 7,
        isPro: true,
        createdAt: new Date().toISOString(),
        achievements: []
      },
      {
        id: 'v3',
        username: 'roberto_lima',
        displayName: 'Roberto Lima',
        photoURL: 'https://randomuser.me/api/portraits/men/28.jpg',
        email: 'roberto@exemplo.com',
        points: 630,
        level: 6,
        isPro: false,
        createdAt: new Date().toISOString(),
        achievements: []
      },
      {
        id: 'v4',
        username: 'camila_ferreira',
        displayName: 'Camila Ferreira',
        photoURL: 'https://randomuser.me/api/portraits/women/15.jpg',
        email: 'camila@exemplo.com',
        points: 920,
        level: 8,
        isPro: true,
        createdAt: new Date().toISOString(),
        achievements: []
      }
    ];
    
    setViewerUsers(mockViewers);
    setShowViewersModal(true);
  }, [pauseProgress, currentStory]);

  // Função para mostrar quem curtiu
  const handleLikersClick = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentStory) return;
    
    console.log("handleLikersClick chamado", e?.type);
    pauseProgress();
    
    // Em um cenário real, carregaríamos esse dado da API
    // Mocking alguns usuários para curtidas
    const mockLikers: User[] = [
      {
        id: 'l1',
        username: 'rafael_gomes',
        displayName: 'Rafael Gomes',
        photoURL: 'https://randomuser.me/api/portraits/men/44.jpg',
        email: 'rafael@exemplo.com',
        points: 510,
        level: 5,
        isPro: false,
        createdAt: new Date().toISOString(),
        achievements: []
      }
    ];
    
    // Adicionar o usuário atual se ele curtiu
    if (isLiked) {
      mockLikers.unshift({
        ...currentUser,
        id: currentUser.id
      });
    }
    
    setLikerUsers(mockLikers);
    setShowLikersModal(true);
  }, [pauseProgress, isLiked, currentUser, currentStory]);

  // Não renderizar nada se o modal estiver fechado ou não houver stories
  if (!isOpen || stories.length === 0) return null;

  // Verificar se o story atual existe
  if (!currentStory) return null;

  const storyUser = users[currentStory.userId] || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div 
        className="relative max-w-lg w-full mx-auto h-full md:h-[85vh] md:rounded-lg md:overflow-hidden transition-all duration-300 md:shadow-xl"
        style={{ 
          backgroundColor: currentStory.backgroundColor || '#000',
          color: currentStory.textColor || '#fff',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão de fechar */}
        <div className="absolute top-2 right-2 z-50">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 flex items-center justify-center transition-all"
            style={{ width: '36px', height: '36px' }}
          >
            <XIcon className="h-5 w-5 text-white" />
          </button>
        </div>
        
        {/* Barras de progresso para múltiplos stories */}
        <ProgressGroup 
          stories={stories}
          currentIndex={currentStoryIndex}
          currentProgress={progress}
        />
        
        {/* Botões de navegação */}
        <NavigationControls 
          onPrev={currentStoryIndex > 0 ? handlePrevStory : undefined}
          onNext={handleNextStory}
          pauseProgress={pauseProgress}
          continueProgress={continueProgress}
        />
        
        {/* Cabeçalho com info do usuário */}
        <StoryHeader 
          user={storyUser}
          createdAt={currentStory.createdAt}
          expiresAt={currentStory.expiresAt}
        />
        
        {/* Conteúdo principal */}
        <div 
          className="flex flex-col items-center justify-center h-[calc(100%-140px)]"
          onMouseDown={pauseProgress}
          onMouseUp={continueProgress}
          onTouchStart={pauseProgress}
          onTouchEnd={continueProgress}
        >
          {currentStory.imageURL ? (
            <img 
              ref={mediaRef as React.RefObject<HTMLImageElement>}
              src={currentStory.imageURL}
              alt={`Story de ${storyUser?.displayName || 'usuário'}`}
            />
          ) : (
            <p className="text-xl sm:text-2xl md:text-3xl font-medium text-center px-6 break-words">
              {currentStory.content}
            </p>
          )}
          
          {/* Animação de curtida */}
          {showLikeAnimation && <LikeAnimation />}
        </div>
        
        {/* Rodapé com ações */}
        <StoryFooter 
          isLiked={isLiked}
          likeCount={likeCount}
          commentCount={commentCount}
          views={currentStory.views || 0}
          onLike={handleLike}
          onViewersClick={handleViewersClick}
          onLikersClick={handleLikersClick}
          pauseProgress={pauseProgress}
          continueProgress={continueProgress}
          showCommentInput={showCommentInput}
          comment={comment}
          setComment={setComment}
          submitComment={submitComment}
          setShowCommentInput={setShowCommentInput}
        />
        
        {/* Modal de visualizações */}
        <ViewersModal 
          isOpen={showViewersModal}
          onClose={() => {
            setShowViewersModal(false);
            continueProgress();
          }}
          users={viewerUsers}
          title={`${currentStory.views || 0} visualizações`}
          type="view"
        />
        
        {/* Modal de curtidas */}
        <ViewersModal 
          isOpen={showLikersModal}
          onClose={() => {
            setShowLikersModal(false);
            continueProgress();
          }}
          users={likerUsers}
          title={`${likeCount} ${likeCount === 1 ? 'pessoa curtiu' : 'pessoas curtiram'}`}
          type="like"
        />
      </div>
    </div>
  );
};

export default StorymentModal;