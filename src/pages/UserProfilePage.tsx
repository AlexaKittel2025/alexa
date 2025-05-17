import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockUsers, mockPosts } from '../services/mockData';
import { User, Post as PostType } from '../types';
import Post from '../components/Post';
import { 
  UserIcon, 
  CalendarIcon,
  ChatAlt2Icon,
  BellIcon,
  ShareIcon,
  XIcon,
  EmojiHappyIcon,
  PhotographIcon,
  PaperAirplaneIcon,
  BellOff as BellSlashIcon,
  UserAddIcon,
  UserRemoveIcon,
  FlagIcon,
  DotsHorizontalIcon,
  LocationMarkerIcon,
  PencilIcon,
  CameraIcon,
  BanIcon
} from '@heroicons/react/outline';
import { toggleFollowUser, checkIfFollowing, updateUserInfo } from '../services/userService';
import { getPostsByUserId } from '../services/postService';

// Componente de Chat Flutuante
const FloatingChat: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  user: User;
}> = ({ isOpen, onClose, user }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{id: string; text: string; sender: 'user' | 'me'; timestamp: Date}[]>([
    {
      id: '1',
      text: `Olá! Estou disponível para conversar.`,
      sender: 'user',
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Adicionar mensagem do usuário atual
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: message,
      sender: 'me',
      timestamp: new Date()
    }]);
    
    setMessage('');
    
    // Simular resposta após um pequeno delay
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: 'Obrigado pela sua mensagem! Vou responder em breve.',
        sender: 'user',
        timestamp: new Date()
      }]);
    }, 1000);
  };
  
  // Rolar para o final quando novas mensagens são adicionadas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed bottom-4 right-4 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50 flex flex-col h-[60vh] max-h-[500px]">
      {/* Cabeçalho do chat */}
      <div className="bg-primary p-3 text-white flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img 
            src={user.photoURL || "https://via.placeholder.com/40"} 
            alt={user.displayName}
            className="w-8 h-8 rounded-full object-cover" 
          />
          <div>
            <h3 className="font-medium text-sm">{user.displayName}</h3>
            <p className="text-xs opacity-80">@{user.username}</p>
          </div>
        </div>
        <button 
          className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full"
          onClick={onClose}
        >
          <XIcon className="h-5 w-5" />
        </button>
      </div>
      
      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[75%] rounded-lg p-2 px-3 ${
                msg.sender === 'me' 
                  ? 'bg-primary text-white rounded-br-none' 
                  : 'bg-gray-100 dark:bg-gray-700 rounded-bl-none'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <span className="text-xs opacity-70 block text-right mt-1">
                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Área de input */}
      <div className="p-3 border-t dark:border-gray-700 flex items-center gap-2">
        <button className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full">
          <EmojiHappyIcon className="h-5 w-5" />
        </button>
        <button className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full">
          <PhotographIcon className="h-5 w-5" />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 py-2 px-3 bg-gray-100 dark:bg-gray-700 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button 
          onClick={handleSendMessage}
          className="p-2 bg-primary text-white rounded-full hover:bg-opacity-90"
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

// Modal de opções
const OptionsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onBlock: () => void;
  onReport: () => void;
  onShare: () => void;
  user: User;
}> = ({ isOpen, onClose, onBlock, onReport, onShare, user }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 max-w-xs w-full">
        <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700">
          <button 
            onClick={() => { onShare(); onClose(); }}
            className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
          >
            <ShareIcon className="h-5 w-5 text-gray-500" />
            <span>Compartilhar perfil</span>
          </button>
          
          <button 
            onClick={() => { onBlock(); onClose(); }}
            className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <BanIcon className="h-5 w-5 text-gray-500" />
            <span>Bloquear usuário</span>
          </button>
          
          <button 
            onClick={() => { onReport(); onClose(); }}
            className="flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-lg"
          >
            <FlagIcon className="h-5 w-5 text-red-500" />
            <span>Denunciar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente para o modal de seguidores/seguindo
const UserListModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  title: string;
  currentUserId?: string;
  followingIds?: string[];
  onToggleFollow?: (userId: string, isFollowing: boolean) => void;
}> = ({ isOpen, onClose, users, title, currentUserId, followingIds = [], onToggleFollow }) => {
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);
  const [localFollowing, setLocalFollowing] = useState<string[]>(followingIds);

  useEffect(() => {
    setLocalFollowing(followingIds);
  }, [followingIds]);

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5 max-w-md w-full max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label="Fechar modal"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-grow">
          {users.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              {title === "Seguidores" 
                ? "Este usuário ainda não tem seguidores." 
                : "Este usuário ainda não segue ninguém."}
            </p>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map(user => {
                if (user.id === currentUserId) return null; // Não mostrar botão para si mesmo
                const isFollowing = localFollowing.includes(user.id);
                const isHovered = hoveredUserId === user.id;
                let buttonText = 'Seguir';
                if (isFollowing) {
                  buttonText = isHovered ? 'Deixar de seguir' : 'Seguindo';
                }
                return (
                  <li key={user.id} className="py-4">
                    <Link 
                      to={`/profile/${user.username}`}
                      onClick={onClose}
                      className="flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
                    >
                      <img 
                        src={user.photoURL || "https://via.placeholder.com/40"} 
                        alt={user.displayName}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600" 
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {user.displayName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          @{user.username}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={e => {
                          e.preventDefault();
                          const newIsFollowing = !isFollowing;
                          setLocalFollowing(prev => newIsFollowing ? [...prev, user.id] : prev.filter(id => id !== user.id));
                          if (onToggleFollow) onToggleFollow(user.id, newIsFollowing);
                        }}
                        onMouseEnter={() => setHoveredUserId(user.id)}
                        onMouseLeave={() => setHoveredUserId(null)}
                        className={`px-3 py-1 text-sm rounded-full transition-all ${isFollowing ? (isHovered ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200') : 'bg-primary text-white hover:bg-opacity-90'}`}
                      >
                        {buttonText}
                      </button>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente do Modal de Edição de Perfil
const ProfileEditModal = ({
  isOpen,
  onClose,
  user,
  onSave
}: {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (userData: Partial<User>) => void;
}) => {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState<string>('');
  
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setBio(user.bio || '');
      
      // Tratar location que pode ser string ou objeto
      let locationText = '';
      if (user.location) {
        if (typeof user.location === 'string') {
          locationText = user.location;
        } else {
          const locationObj = user.location as {city: string; state: string};
          locationText = `${locationObj.city || ''}, ${locationObj.state || ''}`.trim();
          // Remover vírgula se só tiver cidade ou estado
          locationText = locationText.replace(/^,\s*/, '').replace(/,\s*$/, '');
        }
      }
      setLocation(locationText);
    }
  }, [user]);
  
  if (!isOpen) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Processar localização
    let locationObj = null;
    if (location) {
      const parts = location.split(',').map(part => part.trim());
      if (parts.length === 2) {
        locationObj = {
          city: parts[0],
          state: parts[1]
        };
      } else {
        locationObj = {
          city: location,
          state: ''
        };
    }
    }
    
    onSave({
      displayName,
      bio,
      location: locationObj
    });
    
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Editar Perfil</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          
          <div className="border-b mb-6">
            <div className="px-4 py-2 font-medium border-b-2 border-blue-500 text-blue-500 inline-block">
              Informações Pessoais
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome de Exibição
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Seu nome"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                    placeholder="Conte um pouco sobre você"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Localização
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Sua cidade/país"
                  />
                </div>
              </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Componente de UserProfilePage
const UserProfilePage: React.FC = () => {
  const { username, userId } = useParams<{ username?: string; userId?: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);
  const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false);
  const [showFloatingChat, setShowFloatingChat] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [isHoveredFollow, setIsHoveredFollow] = useState(false);
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);

  // Fetch user data
  const fetchUserData = async () => {
    setIsLoading(true);
    let userData = null;

    try {
      // Find user by username or userId
      if (username) {
        userData = mockUsers.find(u => u.username === username);
      } else if (userId) {
        userData = mockUsers.find(u => u.id === userId);
      }

      if (!userData) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      setUser(userData);
      
      // Verificar se o perfil pertence ao usuário atual
      const isCurrentUser = currentUser && currentUser.id === userData.id;
      setIsCurrentUserProfile(isCurrentUser);

      // Verificar status de seguimento
      if (currentUser && !isCurrentUser) {
        const isFollowingUser = await checkIfFollowing(currentUser.id, userData.id);
        setIsFollowing(isFollowingUser);
      }

      // Obter contagens de seguidores/seguindo
      setFollowersCount(userData.followers || 0);
      setFollowingCount(userData.following || 0);

      // Definir a imagem de capa
      if (userData.coverImage) {
        setCoverImage(userData.coverImage);
      }

      // Fetch user posts
      const userPosts = mockPosts.filter(post => post.userId === userData.id);
      setPosts(userPosts);
      
      // Simular seguidores e seguindo
      const mockFollowers = mockUsers
        .filter(u => u.id !== userData.id)
        .slice(0, userData.followers || 0);
        
      const mockFollowing = mockUsers
        .filter(u => u.id !== userData.id)
        .slice(0, userData.following || 0);
        
      setFollowers(mockFollowers);
      setFollowing(mockFollowing);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle profile update
  const handleProfileUpdate = async (userData: Partial<User>) => {
    if (!user || !currentUser) return;
    
    try {
      // Atualizar o usuário
      const updatedUser = await updateUserInfo(user.id, userData);
      setUser(prevUser => ({
        ...prevUser!,
        ...updatedUser
      }));
      
      // Atualizar imagem de capa se fornecida
      if (userData.coverImage) {
        setCoverImage(userData.coverImage);
      }
      
      // Recarregar dados do usuário
      fetchUserData();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    }
  };

  const handleReaction = (postId: string, reactionType: 'quaseAcreditei' | 'hahaha' | 'mentiraEpica') => {
    console.log(`Reação ${reactionType} no post ${postId}`);
  };
  
  useEffect(() => {
    if (username || userId) {
      fetchUserData();
    } else {
      setNotFound(true);
      setIsLoading(false);
    }
  }, [username, userId, currentUser]);
  
  const handleJudgement = (postId: string, judgementType: 'crivel' | 'inventiva' | 'totalmentePirada') => {
    console.log(`Julgamento ${judgementType} no post ${postId}`);
  };

  const handleReport = (postId: string, reason: string) => {
    console.log(`Post ${postId} reportado: ${reason}`);
    // Em uma aplicação real, aqui seria feita uma chamada à API
    alert(`Denúncia recebida: ${reason}`);
  };

  const handleFollowClick = async () => {
    if (!currentUser || !user || isLoadingFollow) return;

    setIsHoveredFollow(false); // Sempre resetar hover ao clicar

    // Atualização otimista
    const optimisticIsFollowing = !isFollowing;
    setIsFollowing(optimisticIsFollowing);
    setFollowersCount(prev => optimisticIsFollowing ? prev + 1 : Math.max(0, prev - 1));

    try {
      setIsLoadingFollow(true);
      const result = await toggleFollowUser(currentUser.id, user.id);
      // Se a resposta da API for diferente do otimista, corrige
      if (result.success && result.isFollowing !== optimisticIsFollowing) {
        setIsFollowing(result.isFollowing);
        setFollowersCount(prev => result.isFollowing ? prev + 1 : Math.max(0, prev - 1));
      }
      // Feedback visual para o usuário
      const actionText = result.isFollowing ? 'Você seguiu' : 'Você deixou de seguir';
      const toastElement = document.createElement("div");
      toastElement.className = "fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium z-50";
      toastElement.textContent = `${actionText} ${user.displayName}`;
      toastElement.style.opacity = "0";
      toastElement.style.transition = "opacity 0.3s ease-in-out";
      document.body.appendChild(toastElement);
      setTimeout(() => { toastElement.style.opacity = "1"; }, 100);
      setTimeout(() => {
        toastElement.style.opacity = "0";
        setTimeout(() => {
          if (document.body.contains(toastElement)) {
            document.body.removeChild(toastElement);
          }
        }, 300);
      }, 2000);
    } catch (error) {
      // Se der erro, reverte o estado
      setIsFollowing(!optimisticIsFollowing);
      setFollowersCount(prev => !optimisticIsFollowing ? prev + 1 : Math.max(0, prev - 1));
      console.error('Erro ao seguir/deixar de seguir:', error);
    } finally {
      setIsLoadingFollow(false);
    }
  };

  // Função para compartilhar perfil
  const handleShareProfile = () => {
    if (!user) return;
    
    // Copiar URL do perfil para a área de transferência
    const profileUrl = window.location.href;
    
    navigator.clipboard.writeText(profileUrl)
      .then(() => {
        alert(`Link do perfil de ${user.displayName} copiado para a área de transferência!`);
      })
      .catch(err => {
        console.error('Erro ao copiar link:', err);
        alert('Não foi possível copiar o link. Por favor, copie manualmente a URL.');
      });
  };
  
  // Função para bloquear usuário
  const handleBlockUser = () => {
    if (!user) return;
    
    // Aqui você implementaria a lógica real de bloqueio
    console.log(`Bloqueando usuário ${user.username}`);
    
    // Mostrar confirmação
    alert(`Usuário ${user.displayName} foi bloqueado. Você não verá mais conteúdo deste usuário.`);
    
    // Redirecionar para a página inicial
    navigate('/');
  };
  
  // Função para denunciar usuário
  const handleReportUser = () => {
    if (!user) return;
    
    // Aqui você implementaria um modal de denúncia mais sofisticado
    const reason = prompt(`Por que você está denunciando ${user.displayName}?`);
    
    if (reason) {
      console.log(`Denúncia contra ${user.username}: ${reason}`);
      alert('Sua denúncia foi enviada. Obrigado por ajudar a manter a comunidade segura!');
    }
  };
  
  // Função para alternar notificações
  const handleToggleNotifications = () => {
    setIsNotificationsEnabled(!isNotificationsEnabled);
    
    // Exibir confirmação
    alert(`Notificações ${isNotificationsEnabled ? 'desativadas' : 'ativadas'} para ${user?.displayName}`);
  };

  // Adicionar a função handleToggleSavePost
  const handleToggleSavePost = (postId: string) => {
    setSavedPosts(prevSavedPosts => {
      if (prevSavedPosts.includes(postId)) {
        return prevSavedPosts.filter(id => id !== postId);
      } else {
        return [...prevSavedPosts, postId];
      }
    });
    
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (notFound || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Usuário não encontrado</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            O usuário @{username} não existe ou não está disponível.
          </p>
          <Link 
            to="/" 
            className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
          >
            Voltar para a Página Inicial
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Cabeçalho com capa */}
      <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg relative">
        {/* Imagem de capa personalizada, se disponível */}
        {coverImage ? (
          <img
            src={coverImage}
            alt="Capa do perfil"
            className="w-full h-full object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white text-opacity-50 text-sm">
              Sem imagem de capa
            </span>
          </div>
        )}
        
        {/* Botões de ação */}
        <div className="absolute bottom-4 right-4 flex space-x-2">
          {isCurrentUserProfile ? (
            <button
              onClick={() => navigate('/settings/profile')}
              className="flex items-center space-x-1 bg-gray-700 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:bg-gray-600 transition"
            >
              <PencilIcon className="h-4 w-4" />
              <span>Editar Perfil</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleFollowClick}
                disabled={isLoadingFollow}
                onMouseEnter={() => setIsHoveredFollow(true)}
                onMouseLeave={() => setIsHoveredFollow(false)}
                className={`flex items-center gap-1 py-1.5 px-3 rounded-full text-sm font-medium transition-all ${
                  isFollowing
                    ? (isHoveredFollow ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200')
                    : 'bg-primary text-white hover:bg-opacity-90'
                }`}
              >
                {isLoadingFollow ? (
                  <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    <UserAddIcon className="h-4 w-4" />
                    <span>{isFollowing ? (isHoveredFollow ? 'Deixar de seguir' : 'Seguindo') : 'Seguir'}</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setShowFloatingChat(true)}
                className="px-3 py-1.5 rounded-full bg-gray-200 text-black hover:bg-gray-300 text-sm font-medium transition"
              >
                Mensagem
              </button>
            </>
          )}
        </div>
        
        {/* Foto de perfil (sobrepondo a capa) */}
        <div className="absolute -bottom-14 left-6">
          <img 
            src={user?.photoURL || "https://via.placeholder.com/150"} 
            alt={`Avatar de ${user?.displayName}`}
            className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md" 
          />
          
          {user?.isPro && (
            <div className="absolute bottom-0 right-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900">
                PRO
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Perfil do usuário - fora do card */}
      <div className="bg-white dark:bg-gray-800 px-6 py-4 rounded-b-lg shadow-md">
        {/* Layout com foto e informações lado a lado */}
        <div className="flex items-start mt-0">
          {/* Espaço reservado para foto de perfil */}
          <div className="w-28 h-28 invisible"></div>
          
          {/* Nome e username posicionados ao lado da foto */}
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.displayName}</h1>
            <p className="text-gray-500 dark:text-gray-400">@{user?.username}</p>
          </div>
        </div>
        
        {/* Bio e informações adicionais na posição original, mas com menos espaço */}
        <div className="-mt-10 ml-0">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {user?.bio || "Este usuário ainda não adicionou uma bio."}
          </p>
          
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
            {user?.location && (
              <div className="flex items-center gap-1">
                <LocationMarkerIcon className="h-3 w-3" />
                {typeof user.location === 'string' ? (
                  <span>{user.location}</span>
                ) : (
                  <span>
                    {(user.location as {city: string; state: string}).city}
                    {(user.location as {city: string; state: string}).city && 
                     (user.location as {city: string; state: string}).state && ', '}
                    {(user.location as {city: string; state: string}).state}
                  </span>
                )}
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              <span>Entrou em {user?.createdAt && new Date(user.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
          
        {/* Contadores */}
        <div className="flex space-x-6 mt-3 ml-2">
          <button 
            onClick={() => setShowFollowersModal(true)}
            className="flex flex-col items-center hover:opacity-80 transition-opacity"
          >
            <span className="text-base font-bold text-gray-900 dark:text-white">{followersCount}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Seguidores</span>
          </button>
          
          <button 
            onClick={() => setShowFollowingModal(true)}
            className="flex flex-col items-center hover:opacity-80 transition-opacity"
          >
            <span className="text-base font-bold text-gray-900 dark:text-white">{followingCount}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Seguindo</span>
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-base font-bold text-gray-900 dark:text-white">{posts.length}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Mentiras</span>
          </div>
        </div>
      </div>
      
      <h2 className="text-base font-bold text-gray-900 dark:text-white mt-4 mb-3">Mentiras de {user?.displayName}</h2>
      
      <div className="space-y-3">
        {posts.length > 0 ? (
          posts.map(post => (
            <Post 
              key={post.id} 
              post={post} 
              onJudgement={handleJudgement}
              onReport={handleReport}
              isSaved={savedPosts.includes(post.id)}
              onToggleSave={handleToggleSavePost}
              navigate={navigate}
            />
          ))
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 text-center">
            <div className="flex justify-center mb-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                <UserIcon className="h-6 w-6 text-gray-400" />
              </div>
            </div>
            <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">Nenhuma mentira publicada</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Este usuário ainda não publicou nenhuma mentira.</p>
          </div>
        )}
      </div>
      
      {/* Modais */}
      <FloatingChat 
        isOpen={showFloatingChat} 
        onClose={() => setShowFloatingChat(false)}
        user={user as User}
      />
      
      <OptionsModal
        isOpen={showOptionsModal}
        onClose={() => setShowOptionsModal(false)}
        onBlock={handleBlockUser}
        onReport={handleReportUser}
        onShare={handleShareProfile}
        user={user}
      />
      
      <UserListModal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        users={followers}
        title="Seguidores"
        currentUserId={currentUser?.id}
        followingIds={following.map(u => u.id)}
      />
      
      <UserListModal
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        users={following}
        title="Seguindo"
        currentUserId={currentUser?.id}
        followingIds={following.map(u => u.id)}
      />

      {/* Modal de edição de perfil */}
      <ProfileEditModal 
        isOpen={showEditProfileModal} 
        onClose={() => setShowEditProfileModal(false)} 
        user={user} 
        onSave={handleProfileUpdate} 
      />
    </div>
  );
};

export default UserProfilePage; 