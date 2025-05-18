;

;
import { BadgeCheckIcon, BellIcon, CalendarIcon, FireIcon, HashtagIcon, XIcon } from '@heroicons/react/outline';
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockPosts, mockChallenges } from '../services/mockData';
import { Post as PostType, ReactionType, JudgementType, User } from '../types';
import Post from '../components/Post';
import CreatePost from '../components/CreatePost';
import CreatePostModal from '../components/CreatePostModal';
import Stories from '../components/Stories';
import RankingCard from '../components/RankingCard';
import ProPaymentModal from '../components/ProPaymentModal';
import FloatingChat from '../components/FloatingChat';
import { generateRandomLie, getCurrentUserProStatus } from '../services/userService';;;
import { useNavigate, Link } from 'react-router-dom';
import UserProfileLink from '../components/UserProfileLink';

const HomePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showProModal, setShowProModal] = useState(false);
  const [showProPaymentModal, setShowProPaymentModal] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showMoreSuggestionsModal, setShowMoreSuggestionsModal] = useState(false);
  const [showAllConversationsModal, setShowAllConversationsModal] = useState(false);
  const [showAllChallengesModal, setShowAllChallengesModal] = useState(false);
  const [allSuggestedFriends, setAllSuggestedFriends] = useState<User[]>([]);
  const [activeChallenge, setActiveChallenge] = useState(mockChallenges[0]);
  const [challengePostContent, setChallengePostContent] = useState('');
  const [isSubmittingChallenge, setIsSubmittingChallenge] = useState(false);
  const [hasSubmittedChallenge, setHasSubmittedChallenge] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [challengeSubmissions, setChallengeSubmissions] = useState<{
    id: string;
    userId: string;
    username: string;
    displayName: string;
    photoURL: string;
    content: string;
    votes: number;
    hasVoted: boolean;
  }[]>([
    {
      id: 'sub1',
      userId: 'user2',
      username: 'carlositaum',
      displayName: 'Carlos Mendes',
      photoURL: 'https://randomuser.me/api/portraits/men/32.jpg',
      content: 'Durante uma caminhada noturna, vi um fantasma que me pediu para completar uma tarefa que ele não conseguiu em vida.',
      votes: 12,
      hasVoted: false
    },
    {
      id: 'sub2',
      userId: 'user3',
      username: 'anabeatrizz',
      displayName: 'Ana Beatriz',
      photoURL: 'https://randomuser.me/api/portraits/women/44.jpg',
      content: 'Meu celular ligou sozinho às 3h33 da manhã e enviou uma mensagem em código que ninguém consegue decifrar.',
      votes: 8,
      hasVoted: false
    },
    {
      id: 'sub3',
      userId: 'user4',
      username: 'rodrigolima',
      displayName: 'Rodrigo Lima',
      photoURL: 'https://randomuser.me/api/portraits/men/62.jpg',
      content: 'Meu cachorro começou a latir para um canto vazio da sala. Quando tirei uma foto, apareceu uma criança com olhos completamente pretos.',
      votes: 15,
      hasVoted: true
    }
  ]);
  
  const [trendingTopics, setTrendingTopics] = useState<{ tag: string, count: number }[]>([]);
  const [suggestedFriends, setSuggestedFriends] = useState<User[]>([]);

  const [visiblePosts, setVisiblePosts] = useState<number>(5); // Número de posts visíveis inicialmente

  const [followingSuggestions, setFollowingSuggestions] = useState<{ [userId: string]: boolean }>({});
  const [hoveredSuggestion, setHoveredSuggestion] = useState<string | null>(null);

  const [selectedChatUser, setSelectedChatUser] = useState<User | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);

  const [userConversations, setUserConversations] = useState<{
    id: string;
    user: User;
    lastMessage: string;
    timestamp: string;
    unread: number;
  }[]>([]); // Lista de conversas do usuário

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Em uma aplicação real, aqui seria feita uma chamada à API
        setPosts(mockPosts);
        
        // Verificar se o usuário é PRO
        if (currentUser) {
          const proStatus = await getCurrentUserProStatus(currentUser.id);
          setIsPro(proStatus);
        }
      } catch (error) {
        
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [currentUser]);

  useEffect(() => {
    // Trending Topics dinâmico
    const tagCount: Record<string, number> = {};
    posts.forEach(post => {
      post.tags?.forEach(tag => {
        if (tag) {
          tagCount[tag] = (tagCount[tag] || 0) + 1;
        }
      });
    });
    const tagArray = Object.entries(tagCount).map(([tag, count]) => ({ tag, count }));
    setTrendingTopics(tagArray.sort((a, b) => b.count - a.count).slice(0, 10));

    // Sugestões de amigos dinâmicas
    const allUsers: Record<string, User> = {};
    posts.forEach(post => {
      if (post.userId !== currentUser?.id) {
        allUsers[post.userId] = {
          id: post.userId,
          username: (post as any).username || 'usuario',
          displayName: (post as any).displayName || 'Usuário',
          photoURL: (post as any).photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg',
          email: '',
          points: 0,
          level: 1,
          isPro: false,
          createdAt: '',
          achievements: []
        };
      }
    });
    
    // Adicionar mais sugestões de amigos para o modal
    const moreSuggestions: User[] = [
      ...Object.values(allUsers),
      {
        id: 'user10',
        username: 'mariasilva',
        displayName: 'Maria Silva',
        photoURL: 'https://randomuser.me/api/portraits/women/22.jpg',
        email: 'maria@exemplo.com',
        points: 250,
        level: 3,
        isPro: true,
        createdAt: new Date().toISOString(),
        achievements: []
      },
      {
        id: 'user11',
        username: 'joaopaulo',
        displayName: 'João Paulo',
        photoURL: 'https://randomuser.me/api/portraits/men/23.jpg',
        email: 'joao@exemplo.com',
        points: 180,
        level: 2,
        isPro: false,
        createdAt: new Date().toISOString(),
        achievements: []
      },
      {
        id: 'user12',
        username: 'lucianaferreira',
        displayName: 'Luciana Ferreira',
        photoURL: 'https://randomuser.me/api/portraits/women/24.jpg',
        email: 'luciana@exemplo.com',
        points: 320,
        level: 4,
        isPro: true,
        createdAt: new Date().toISOString(),
        achievements: []
      },
      {
        id: 'user13',
        username: 'felipemartins',
        displayName: 'Felipe Martins',
        photoURL: 'https://randomuser.me/api/portraits/men/25.jpg',
        email: 'felipe@exemplo.com',
        points: 150,
        level: 2,
        isPro: false,
        createdAt: new Date().toISOString(),
        achievements: []
      },
      {
        id: 'user14',
        username: 'julianaalmeida',
        displayName: 'Juliana Almeida',
        photoURL: 'https://randomuser.me/api/portraits/women/26.jpg',
        email: 'juliana@exemplo.com',
        points: 270,
        level: 3,
        isPro: false,
        createdAt: new Date().toISOString(),
        achievements: []
      },
      {
        id: 'user15',
        username: 'pedrosousa',
        displayName: 'Pedro Sousa',
        photoURL: 'https://randomuser.me/api/portraits/men/27.jpg',
        email: 'pedro@exemplo.com',
        points: 190,
        level: 2,
        isPro: false,
        createdAt: new Date().toISOString(),
        achievements: []
      },
      {
        id: 'user16',
        username: 'fernandacosta',
        displayName: 'Fernanda Costa',
        photoURL: 'https://randomuser.me/api/portraits/women/28.jpg',
        email: 'fernanda@exemplo.com',
        points: 350,
        level: 4,
        isPro: true,
        createdAt: new Date().toISOString(),
        achievements: []
      }
    ];
    
    // Lista completa de sugestões (para o modal)
    setAllSuggestedFriends(moreSuggestions);
    
    // Lista reduzida de sugestões (para o card na página inicial)
    setSuggestedFriends(moreSuggestions.slice(0, 4));
    
    // Popular as conversas do usuário com exemplos
    const exampleConversations = [
      {
        id: 'conv1',
        user: moreSuggestions[0],
        lastMessage: 'Olá, como vai? Viu minha última mentira?',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutos atrás
        unread: 2
      },
      {
        id: 'conv2',
        user: moreSuggestions[1],
        lastMessage: 'Gostei do seu desafio semanal! Muito criativo!',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutos atrás
        unread: 0
      },
      {
        id: 'conv3',
        user: moreSuggestions[2],
        lastMessage: 'Consegui te enganar com aquela história do fantasma? 👻',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 horas atrás
        unread: 1
      },
      {
        id: 'conv4',
        user: moreSuggestions[3],
        lastMessage: 'Vamos criar um grupo para o próximo desafio?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 horas atrás
        unread: 0
      },
      {
        id: 'conv5',
        user: moreSuggestions[4],
        lastMessage: 'Obrigada por me seguir! Acabei de postar uma nova mentira.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 dia atrás
        unread: 0
      },
      {
        id: 'conv6',
        user: moreSuggestions[5],
        lastMessage: 'E aí, já pensou em assinar o plano PRO?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 dias atrás
        unread: 0
      }
    ];
    
    setUserConversations(exampleConversations);
    
  }, [posts, currentUser]);

  const handleCreatePost = (content: string, imageURL?: string, tags?: string[]) => {
    if (!currentUser) return;
    
    const newPost: PostType = {
      id: `post-${Date.now()}`,
      userId: currentUser.id,
      content,
      createdAt: new Date().toISOString(),
      imageURL: imageURL,
      tags: tags || [],
      reactions: {
        quaseAcreditei: 0,
        hahaha: 0,
        mentiraEpica: 0
      },
      judgements: {
        crivel: 0,
        inventiva: 0,
        totalmentePirada: 0
      },
      userReactions: {},
      userJudgements: {},
      commentCount: 0
    };
    
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const handleRandomPostGeneration = async () => {
    if (!currentUser) return;
    
    if (!isPro) {
      setShowProModal(true);
      return;
    }
    
    try {
      // Usa o serviço para gerar uma mentira aleatória
      const randomContent = await generateRandomLie(currentUser.id);
      
      if (randomContent) {
        const newPost: PostType = {
          id: `generated-${Date.now()}`,
          userId: currentUser.id,
          content: randomContent,
          tags: ['gerada', 'mentiraAutomatica'],
          reactions: {
            quaseAcreditei: 0,
            hahaha: 0,
            mentiraEpica: 0
          },
          userReactions: {},
          judgements: {
            crivel: 0,
            inventiva: 0,
            totalmentePirada: 0
          },
          userJudgements: {},
          createdAt: new Date().toISOString(),
          isGenerated: true
        };
  
        setPosts([newPost, ...posts]);
      }
    } catch (error) {
      
      setShowProModal(true);
    }
  };

  const handleReaction = (postId: string, reactionType: 'quaseAcreditei' | 'hahaha' | 'mentiraEpica') => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          // Criar cópia segura dos objetos com valores padrão para garantir que todas as propriedades existam
          const updatedReactions = { 
            quaseAcreditei: 0, 
            hahaha: 0, 
            mentiraEpica: 0,
            ...(post.reactions || {}) 
          };
          const updatedUserReactions = { ...(post.userReactions || {}) };
          
          // Alternar a reação
          const userId = currentUser?.id || 'anon';
          const hasReacted = updatedUserReactions[userId] === reactionType;
          
          if (hasReacted) {
            // Remover a reação
            updatedReactions[reactionType] = Math.max(0, updatedReactions[reactionType] - 1);
            delete updatedUserReactions[userId];
          } else {
            // Adicionar/alterar a reação
            const prevReaction = updatedUserReactions[userId];
            
            if (prevReaction && prevReaction !== reactionType) {
              updatedReactions[prevReaction] = Math.max(0, updatedReactions[prevReaction] - 1);
            }
            
            updatedReactions[reactionType] = updatedReactions[reactionType] + 1;
            updatedUserReactions[userId] = reactionType;
          }
          
          return {
            ...post,
            reactions: updatedReactions,
            userReactions: updatedUserReactions
          };
        }
        return post;
      })
    );
  };
  
  const handleJudgement = (postId: string, judgementType: 'crivel' | 'inventiva' | 'totalmentePirada') => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          // Criar cópia segura dos objetos com valores padrão para garantir que todas as propriedades existam
          const updatedJudgements = { 
            crivel: 0, 
            inventiva: 0, 
            totalmentePirada: 0,
            ...(post.judgements || {}) 
          };
          const updatedUserJudgements = { ...(post.userJudgements || {}) };
          
          // Alternar o julgamento
          const userId = currentUser?.id || 'anon';
          const currentJudgement = updatedUserJudgements[userId];
          
          if (currentJudgement === judgementType) {
            // Remover o julgamento se for o mesmo
            updatedJudgements[judgementType] = Math.max(0, updatedJudgements[judgementType] - 1);
            delete updatedUserJudgements[userId];
          } else {
            // Alterar o julgamento
            if (currentJudgement) {
              // Remover o julgamento anterior
              updatedJudgements[currentJudgement] = Math.max(0, updatedJudgements[currentJudgement] - 1);
            }
            
            // Adicionar o novo julgamento
            updatedJudgements[judgementType] = updatedJudgements[judgementType] + 1;
            updatedUserJudgements[userId] = judgementType;
          }
          
          return {
            ...post,
            judgements: updatedJudgements,
            userJudgements: updatedUserJudgements
          };
        }
        return post;
      })
    );
  };
  
  const handleReport = (postId: string, reason: string) => {
    
    // Em uma aplicação real, aqui seria feita uma chamada à API
    alert(`Denúncia recebida: ${reason}`);
  };

  const handleOpenProPayment = () => {
    setShowProModal(false);
    setShowProPaymentModal(true);
  };

  const handleSubmitChallenge = () => {
    if (!challengePostContent.trim() || !activeChallenge) {
      return;
    }
    setIsSubmittingChallenge(true);
    const newSubmission = {
      id: `sub-${Date.now()}`,
      userId: currentUser?.id || 'anon',
      username: currentUser?.username || 'usuario',
      displayName: currentUser?.displayName || 'Usuário',
      photoURL: currentUser?.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg',
      content: challengePostContent,
      votes: 0,
      hasVoted: false
    };
    setChallengeSubmissions(prev => [newSubmission, ...prev]);
    handleCreatePost(challengePostContent, undefined, [activeChallenge.category, 'desafiosemanal']);
    // Atualizar número de participantes do desafio
    if (activeChallenge && !activeChallenge.participants.includes(currentUser?.id)) {
      activeChallenge.participants.push(currentUser?.id);
    }
    setTimeout(() => {
      setIsSubmittingChallenge(false);
      setHasSubmittedChallenge(true);
      setChallengePostContent('');
      const toastElement = document.createElement("div");
      toastElement.className = "fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium z-50";
      toastElement.textContent = "Sua mentira foi enviada para o desafio semanal!";
      toastElement.style.opacity = "0";
      toastElement.style.transition = "opacity 0.3s ease-in-out";
      toastElement.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastElement);
      setTimeout(() => { toastElement.style.opacity = "1"; }, 100);
      setTimeout(() => {
        toastElement.style.opacity = "0";
        setTimeout(() => {
          if (document.body.contains(toastElement)) {
            document.body.removeChild(toastElement);
          }
          setShowChallengeModal(false);
        }, 300);
      }, 2000);
    }, 1500);
  };

  const handleChallengeVote = (submissionId: string) => {
    setChallengeSubmissions(prev => {
      // Descobrir se o usuário já votou em outra submissão
      const userId = currentUser?.id || 'anon';
      let previousVotedId: string | null = null;
      prev.forEach(sub => {
        if (sub.hasVoted && sub.userId !== userId) {
          previousVotedId = sub.id;
        }
      });
      return prev.map(submission => {
        if (submission.id === submissionId) {
          // Se já votou, remove o voto
          if (submission.hasVoted) {
            return { ...submission, votes: submission.votes - 1, hasVoted: false };
          } else {
            return { ...submission, votes: submission.votes + 1, hasVoted: true };
          }
        } else if (submission.hasVoted) {
          // Remover voto anterior se for outro
          return { ...submission, votes: submission.votes - 1, hasVoted: false };
        }
        return submission;
      });
    });
    // Feedback visual para o usuário
    const toastElement = document.createElement("div");
    toastElement.className = "fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium z-50";
    toastElement.textContent = "Seu voto foi registrado!";
    toastElement.style.opacity = "0";
    toastElement.style.transition = "opacity 0.3s ease-in-out";
    toastElement.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastElement);
    setTimeout(() => { toastElement.style.opacity = "1"; }, 100);
    setTimeout(() => {
      toastElement.style.opacity = "0";
      setTimeout(() => {
        if (document.body.contains(toastElement)) {
          document.body.removeChild(toastElement);
        }
      }, 300);
    }, 1500);
  };

  const handleToggleSavePost = (postId: string) => {
    if (savedPosts.includes(postId)) {
      // Remove da lista de salvos
      setSavedPosts(prev => prev.filter(id => id !== postId));
    } else {
      // Adiciona à lista de salvos
      setSavedPosts(prev => [...prev, postId]);
    }
    
    // Feedback visual para o usuário
    const toastElement = document.createElement("div");
    toastElement.className = "fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium z-50";
    toastElement.textContent = savedPosts.includes(postId) ? "Mentira removida dos salvos" : "Mentira salva para ver depois";
    toastElement.style.opacity = "0";
    toastElement.style.transition = "opacity 0.3s ease-in-out";
    toastElement.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastElement);
    
    setTimeout(() => {
      toastElement.style.opacity = "1";
    }, 100);
    
    setTimeout(() => {
      toastElement.style.opacity = "0";
      setTimeout(() => {
        if (document.body.contains(toastElement)) {
          document.body.removeChild(toastElement);
        }
      }, 300);
    }, 1500);
  };
  
  const handleFollowUser = (userId: string) => {
    setFollowingSuggestions(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
    // Feedback visual para o usuário
    const toastElement = document.createElement("div");
    toastElement.className = "fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium z-50";
    toastElement.textContent = followingSuggestions[userId] ? "Você deixou de seguir!" : "Usuário seguido com sucesso!";
    toastElement.style.opacity = "0";
    toastElement.style.transition = "opacity 0.3s ease-in-out";
    toastElement.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastElement);
    setTimeout(() => { toastElement.style.opacity = "1"; }, 100);
    setTimeout(() => {
      toastElement.style.opacity = "0";
      setTimeout(() => {
        if (document.body.contains(toastElement)) {
          document.body.removeChild(toastElement);
        }
      }, 300);
    }, 1500);
  };
  
  const handleClearNotifications = () => {
    setUnreadNotifications(0);
    setShowNotifications(false);
    
    // Feedback visual para o usuário
    const toastElement = document.createElement("div");
    toastElement.className = "fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium z-50";
    toastElement.textContent = "Todas as notificações foram lidas";
    toastElement.style.opacity = "0";
    toastElement.style.transition = "opacity 0.3s ease-in-out";
    toastElement.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastElement);
    
    setTimeout(() => {
      toastElement.style.opacity = "1";
    }, 100);
    
    setTimeout(() => {
      toastElement.style.opacity = "0";
      setTimeout(() => {
        if (document.body.contains(toastElement)) {
          document.body.removeChild(toastElement);
        }
      }, 300);
    }, 1500);
  };

  const loadMorePosts = () => {
    // Incrementa o número de posts visíveis
    setVisiblePosts(prev => prev + 5);
  };

  // Função para navegar para o perfil do usuário
  const navigateToUserProfile = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  // Função para abrir o chat flutuante com um usuário
  const openChatWithUser = (user: User) => {
    setSelectedChatUser(user);
    setShowChatModal(true);
  };

  // Função para excluir uma conversa
  const handleDeleteConversation = (conversationId: string) => {
    setUserConversations(prevConversations => 
      prevConversations.filter(conv => conv.id !== conversationId)
    );
    
    // Feedback visual para o usuário
    const toastElement = document.createElement("div");
    toastElement.className = "fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium z-50";
    toastElement.textContent = "Conversa excluída com sucesso";
    toastElement.style.opacity = "0";
    toastElement.style.transition = "opacity 0.3s ease-in-out";
    toastElement.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastElement);
    
    setTimeout(() => {
      toastElement.style.opacity = "1";
    }, 100);
    
    setTimeout(() => {
      toastElement.style.opacity = "0";
      setTimeout(() => {
        if (document.body.contains(toastElement)) {
          document.body.removeChild(toastElement);
        }
      }, 300);
    }, 1500);
  };

  // Função para formatar o horário das mensagens
  const formatTime = (timestamp: string) => {
    const messageDate = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - messageDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays >= 7) {
      // Se for mais de uma semana, mostra a data
      return messageDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    } else if (diffDays >= 1) {
      // Se for mais de um dia, mostra quantos dias atrás
      return `${diffDays} ${diffDays === 1 ? 'dia' : 'dias'} atrás`;
    } else {
      // Se for hoje, mostra a hora
      return messageDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
  };

  const handlePostCreatedFromModal = (post: PostType) => {
    setPosts(prevPosts => [post, ...prevPosts]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6" role="main">
      <div className="flex flex-col lg:flex-row gap-6 pt-12">
        {/* Coluna principal com o feed */}
        <div className="lg:w-2/3">
          {/* Component de Stories */}
          <Stories />
          
          {currentUser && (
            <div className="mt-5">
              <CreatePost 
                onSubmit={handleCreatePost} 
                onGeneratePost={handleRandomPostGeneration}
                isPro={isPro} 
                onOpenModal={() => setShowCreatePostModal(true)}
              />
            </div>
          )}
          
          <div className="space-y-6">
            {posts.slice(0, visiblePosts).map((post) => (
              <Post
                key={post.id}
                post={post}
                onJudgement={handleJudgement}
                onReport={handleReport}
                isSaved={savedPosts.includes(post.id)}
                onToggleSave={handleToggleSavePost}
                navigate={navigate}
              />
            ))}
            
            {/* Botão "Ver mais" */}
            {visiblePosts < posts.length && (
              <div className="flex justify-center my-6">
                <button 
                  onClick={loadMorePosts}
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-6 py-3 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                >
                  Ver mais publicações
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Coluna lateral com widgets */}
        <div className="lg:w-1/3 space-y-6">
          <RankingCard />
          
          {/* Desafio Semanal */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Desafio da Semana</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-3">Conte uma mentira sobre uma experiência sobrenatural</p>
            <button 
              className="w-full bg-secondary hover:bg-opacity-90 text-white py-2 px-4 rounded-lg"
              onClick={() => setShowChallengeModal(true)}
            >
              Participar
            </button>
          </div>
          
          {/* Card de Desafios Postados */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="bg-primary bg-opacity-10 dark:bg-opacity-20 p-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Desafios Postados
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Vote nas melhores histórias sobrenaturais
              </p>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {challengeSubmissions.map((submission) => (
                <div key={submission.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-start gap-3 mb-2">
                    <UserProfileLink userId={submission.userId}>
                      <img 
                        src={submission.photoURL} 
                        alt={submission.displayName}
                        className="w-10 h-10 rounded-full object-cover cursor-pointer" 
                      />
                    </UserProfileLink>
                    <div>
                      <UserProfileLink userId={submission.userId} className="hover:underline">
                        <h3 className="font-medium text-gray-900 dark:text-white cursor-pointer">
                          {submission.displayName}
                        </h3>
                      </UserProfileLink>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        @{submission.username}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
                    {submission.content}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {submission.votes} {submission.votes === 1 ? 'voto' : 'votos'}
                    </span>
                    
                    <button 
                      onClick={() => handleChallengeVote(submission.id)}
                      className={`flex items-center gap-1 py-1 px-3 rounded-full text-sm ${
                        submission.hasVoted 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {submission.hasVoted ? 'Votado' : 'Votar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-center">
              <button 
                className="text-primary hover:underline text-sm font-medium"
                onClick={() => setShowAllChallengesModal(true)}
              >
                Ver todos
              </button>
            </div>
          </div>
          
          {/* Trending Topics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex items-center mb-3">
              <FireIcon className="h-5 w-5 text-primary mr-2" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Trending</h2>
            </div>
            
            <div className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 p-2 rounded-md transition-colors">
                  <div className="flex items-center">
                    <HashtagIcon className="h-4 w-4 text-primary mr-2" />
                    <span className="text-gray-800 dark:text-gray-200 font-medium">
                      {topic.tag}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {topic.count} posts
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-center">
              <button className="text-primary hover:underline text-sm font-medium">
                Ver mais tendências
              </button>
            </div>
          </div>
          
          {/* Sugestões de Amigos */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Sugestões para seguir</h2>
            
            <div className="space-y-4">
              {suggestedFriends.map((friend) => {
                const isFollowing = followingSuggestions[friend.id];
                const isHovered = hoveredSuggestion === friend.id;
                let buttonText = 'Seguir';
                if (isFollowing) {
                  buttonText = isHovered ? 'Deixar de seguir' : 'Seguindo';
                }
                return (
                  <div key={friend.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <UserProfileLink userId={friend.id}>
                        <img 
                          src={friend.photoURL} 
                          alt={friend.displayName} 
                          className="w-10 h-10 rounded-full object-cover cursor-pointer"
                        />
                      </UserProfileLink>
                      <div>
                        <UserProfileLink userId={friend.id} className="hover:underline">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                            {friend.displayName}
                          </h3>
                        </UserProfileLink>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleFollowUser(friend.id)}
                      onMouseEnter={() => setHoveredSuggestion(friend.id)}
                      onMouseLeave={() => setHoveredSuggestion(null)}
                      className={`flex items-center gap-1 py-1 px-3 rounded-full text-xs transition-all ${isFollowing ? (isHovered ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200') : 'bg-primary text-white hover:bg-opacity-90'}`}
                    >
                      <UserAddIcon className="h-3 w-3" />
                      <span>{buttonText}</span>
                    </button>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-center">
              <button 
                className="text-primary hover:underline text-sm font-medium"
                onClick={() => setShowMoreSuggestionsModal(true)}
              >
                Ver mais sugestões
              </button>
            </div>
          </div>
          
          {/* Chat Rápido */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Chat Rápido</h2>
              <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <DotsHorizontalIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-2">
              {suggestedFriends.map((friend) => (
                <div 
                  key={friend.id}
                  className="flex items-center w-full p-2 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg transition-colors"
                >
                  <div 
                    className="relative cursor-pointer"
                    onClick={() => openChatWithUser(friend)}
                  >
                    <UserProfileLink userId={friend.id} onClick={(e) => openChatWithUser(friend)}>
                      <img 
                        src={friend.photoURL} 
                        alt={friend.displayName} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    </UserProfileLink>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                  </div>
                  <UserProfileLink userId={friend.id} className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer" onClick={(e) => openChatWithUser(friend)}>
                    {friend.displayName}
                  </UserProfileLink>
                </div>
              ))}
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-center">
              <Link to="/chat" className="text-primary hover:underline text-sm font-medium">
                Ver todas as conversas
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal para criar um novo post */}
      {showCreatePostModal && (
        <CreatePostModal
          isOpen={showCreatePostModal}
          onClose={() => setShowCreatePostModal(false)}
          onPostCreated={handlePostCreatedFromModal}
        />
      )}
      
      {/* Modal de usuários não-PRO */}
      {showProModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recurso Exclusivo PRO</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              O gerador de mentiras aleatórias é um recurso exclusivo para usuários PRO.
            </p>
            
            <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Benefícios PRO:</h4>
              <ul className="list-disc pl-5 text-purple-700 dark:text-purple-300 space-y-1">
                <li>Gerador de mentiras criativas</li>
                <li>Até 10 posts patrocinados por mês</li>
                <li>Modo batalha sem limites</li>
                <li>Estatísticas avançadas de mentiras</li>
                <li>Remoção de anúncios</li>
              </ul>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                onClick={() => setShowProModal(false)}
              >
                Fechar
              </button>
              <button 
                className="px-4 py-2 bg-secondary hover:bg-opacity-90 text-white rounded"
                onClick={handleOpenProPayment}
              >
                Virar PRO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Desafio Semanal */}
      {showChallengeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            {/* Cabeçalho do Modal */}
            <div className="bg-primary text-white p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Desafio Semanal</h3>
              <button 
                onClick={() => setShowChallengeModal(false)}
                className="text-white hover:text-gray-200"
                aria-label="Fechar modal"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            
            {/* Corpo do Modal */}
            <div className="p-6">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {activeChallenge.title}
              </h4>
              
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                <CalendarIcon className="w-4 h-4 mr-1" />
                <span>
                  {new Date(activeChallenge.startDate).toLocaleDateString('pt-BR')} - {new Date(activeChallenge.endDate).toLocaleDateString('pt-BR')}
                </span>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {activeChallenge.description}
              </p>
              
              <div className="mb-4 p-3 bg-primary bg-opacity-10 dark:bg-opacity-20 rounded-lg">
                <div className="flex items-start mb-1">
                  <BadgeCheckIcon className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                      Bônus de participação:
                    </p>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside ml-1 mt-1">
                      <li>+{activeChallenge.reward} pontos de experiência</li>
                      <li>Destaque na seção Tendências</li>
                      <li>Chance de conquistar o troféu "Desafiante Semanal"</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Área de Submissão */}
              {hasSubmittedChallenge ? (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                  <div className="flex items-center justify-center mb-2 text-green-600 dark:text-green-400">
                    <BadgeCheckIcon className="w-6 h-6 mr-2" />
                    <span className="font-medium">Participação Confirmada!</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Você já enviou sua mentira para este desafio. Obrigado por participar!
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Sua Mentira para o Desafio:
                    </label>
                    <textarea
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={4}
                      placeholder="Escreva sua mentira sobrenatural aqui..."
                      value={challengePostContent}
                      onChange={(e) => setChallengePostContent(e.target.value)}
                      maxLength={300}
                    />
                    <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {challengePostContent.length}/300 caracteres
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg disabled:opacity-50"
                      onClick={handleSubmitChallenge}
                      disabled={!challengePostContent.trim() || isSubmittingChallenge}
                    >
                      {isSubmittingChallenge ? 'Enviando...' : 'Enviar Mentira'}
                    </button>
                  </div>
                </>
              )}
              
              {/* Estatísticas */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Participantes: {activeChallenge.participants.length}</span>
                  <span>Categoria: #{activeChallenge.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ProPaymentModal 
        isOpen={showProPaymentModal} 
        onClose={() => setShowProPaymentModal(false)} 
      />

      {/* Modal de chat flutuante */}
      {showChatModal && selectedChatUser && (
        <FloatingChat 
          isOpen={showChatModal} 
          onClose={() => setShowChatModal(false)}
          user={selectedChatUser}
          customMode="floating"
        />
      )}

      {/* Modal de Mais Sugestões para Seguir */}
      {showMoreSuggestionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            {/* Cabeçalho do Modal */}
            <div className="bg-primary text-white p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Sugestões para seguir</h3>
              <button 
                onClick={() => setShowMoreSuggestionsModal(false)}
                className="text-white hover:text-gray-200"
                aria-label="Fechar modal"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            
            {/* Corpo do Modal */}
            <div className="p-6">
              <div className="space-y-4">
                {allSuggestedFriends.map((friend) => {
                  const isFollowing = followingSuggestions[friend.id];
                  const isHovered = hoveredSuggestion === friend.id;
                  let buttonText = 'Seguir';
                  if (isFollowing) {
                    buttonText = isHovered ? 'Deixar de seguir' : 'Seguindo';
                  }
                  
                  return (
                    <div key={friend.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <UserProfileLink userId={friend.id}>
                          <img 
                            src={friend.photoURL} 
                            alt={friend.displayName} 
                            className="w-12 h-12 rounded-full object-cover cursor-pointer"
                          />
                        </UserProfileLink>
                        <div>
                          <UserProfileLink userId={friend.id} className="hover:underline">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                              {friend.displayName}
                            </h3>
                          </UserProfileLink>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            @{friend.username || 'usuario'}
                          </p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleFollowUser(friend.id)}
                        onMouseEnter={() => setHoveredSuggestion(friend.id)}
                        onMouseLeave={() => setHoveredSuggestion(null)}
                        className={`flex items-center gap-1 py-1 px-3 rounded-full text-xs transition-all ${isFollowing ? (isHovered ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200') : 'bg-primary text-white hover:bg-opacity-90'}`}
                      >
                        <UserAddIcon className="h-3 w-3" />
                        <span>{buttonText}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
              
              {allSuggestedFriends.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    Nenhuma sugestão disponível no momento.
                  </p>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => setShowMoreSuggestionsModal(false)}
                className="w-full py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Todas as Conversas */}
      {showAllConversationsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            {/* Cabeçalho do Modal */}
            <div className="bg-primary text-white p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Minhas Conversas</h3>
              <button 
                onClick={() => setShowAllConversationsModal(false)}
                className="text-white hover:text-gray-200"
                aria-label="Fechar modal"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            
            {/* Corpo do Modal */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {userConversations.map((conversation) => (
                <div 
                  key={conversation.id} 
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div 
                      className="flex items-start space-x-3 cursor-pointer"
                      onClick={() => {
                        setSelectedChatUser(conversation.user);
                        setShowChatModal(true);
                        setShowAllConversationsModal(false);
                      }}
                    >
                      <div className="relative">
                        <UserProfileLink userId={conversation.user.id}>
                          <img 
                            src={conversation.user.photoURL} 
                            alt={conversation.user.displayName} 
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        </UserProfileLink>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                        
                        {conversation.unread > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <UserProfileLink userId={conversation.user.id} className="hover:underline">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate pr-2">
                              {conversation.user.displayName}
                            </h3>
                          </UserProfileLink>
                          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {formatTime(conversation.timestamp)}
                          </span>
                        </div>
                        
                        <p className={`text-sm ${conversation.unread > 0 ? 'font-medium text-gray-800 dark:text-gray-200' : 'text-gray-600 dark:text-gray-400'} line-clamp-1`}>
                          {conversation.lastMessage}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-2">
                      <button 
                        onClick={() => {
                          setSelectedChatUser(conversation.user);
                          setShowChatModal(true);
                          setShowAllConversationsModal(false);
                        }}
                        className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                        aria-label="Abrir conversa"
                      >
                        <ChatAlt2Icon className="h-5 w-5" />
                      </button>
                      
                      <button 
                        onClick={() => handleDeleteConversation(conversation.id)}
                        className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                        aria-label="Excluir conversa"
                      >
                        <XIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {userConversations.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    Você ainda não tem conversas.
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Comece a conversar com outros usuários!
                  </p>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => setShowAllConversationsModal(false)}
                className="w-full py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Todos os Desafios */}
      {showAllChallengesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            {/* Cabeçalho do Modal */}
            <div className="bg-primary text-white p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Respostas do Desafio Atual</h3>
              <button 
                onClick={() => setShowAllChallengesModal(false)}
                className="text-white hover:text-gray-200"
                aria-label="Fechar modal"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            
            {/* Corpo do Modal */}
            <div className="p-4">
              <div className="mb-4">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {activeChallenge.title}
                </h4>
                
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  <span>
                    {new Date(activeChallenge.startDate).toLocaleDateString('pt-BR')} - {new Date(activeChallenge.endDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {activeChallenge.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <span>Participantes: {activeChallenge.participants.length}</span>
                  <span>Categoria: #{activeChallenge.category}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  Todas as respostas deste desafio
                </h5>
                
                <div className="space-y-6">
                  {challengeSubmissions.map((submission) => (
                    <div key={submission.id} className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                      <div className="flex items-start gap-3 mb-3">
                        <UserProfileLink userId={submission.userId}>
                          <img 
                            src={submission.photoURL} 
                            alt={submission.displayName}
                            className="w-10 h-10 rounded-full object-cover cursor-pointer" 
                          />
                        </UserProfileLink>
                        <div>
                          <UserProfileLink userId={submission.userId} className="hover:underline">
                            <h3 className="font-medium text-gray-900 dark:text-white cursor-pointer">
                              {submission.displayName}
                            </h3>
                          </UserProfileLink>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            @{submission.username}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        {submission.content}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {submission.votes} {submission.votes === 1 ? 'voto' : 'votos'}
                        </span>
                        
                        <button 
                          onClick={() => handleChallengeVote(submission.id)}
                          className={`flex items-center gap-1 py-1.5 px-4 rounded-full text-sm ${
                            submission.hasVoted 
                              ? 'bg-primary text-white' 
                              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200'
                          }`}
                        >
                          {submission.hasVoted ? 'Votado' : 'Votar'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {challengeSubmissions.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      Ainda não há respostas para o desafio desta semana.
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                      Seja o primeiro a participar!
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <button 
                onClick={() => {
                  setShowAllChallengesModal(false);
                  setShowChallengeModal(true);
                }}
                className="py-2 px-4 bg-secondary text-white rounded-lg hover:bg-opacity-90"
              >
                Participar deste desafio
              </button>
              
              <button 
                onClick={() => setShowAllChallengesModal(false)}
                className="py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-opacity-90"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage; 