'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaCamera, FaEdit, FaSave, FaTimes, FaUser, FaEnvelope, FaLink, FaMapMarkerAlt } from 'react-icons/fa';
import { generateRealPersonAvatar } from '@/utils/avatarUtils';

export default function MeuPerfilPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeSection, setActiveSection] = useState<'posts' | 'followers' | 'following' | 'points' | null>('posts');
  const [isInitialized, setIsInitialized] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showLevelModal, setShowLevelModal] = useState(false);
  
  // Refs para os inputs de arquivo
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  // Estado do perfil
  const [profile, setProfile] = useState({
    id: 'user-1',
    name: 'Usuário Teste',
    username: 'teste',
    email: 'teste@mentei.com',
    bio: 'Contador de histórias incríveis e mentiras divertidas',
    avatar: generateRealPersonAvatar('men'),
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1500&q=80',
    website: 'mentei.app/teste',
    location: 'São Paulo, Brasil',
    level: 15,
    points: 2500,
    isPro: true,
    followers: 1842,
    following: 637,
    posts: 89
  });
  
  // Dados iniciais dos seguidores e seguindo
  const initialFollowers = [
    { id: '1', name: 'João Silva', username: 'joaosilva', avatar: generateRealPersonAvatar('men'), isFollowing: false },
    { id: '2', name: 'Maria Santos', username: 'mariasantos', avatar: generateRealPersonAvatar('women'), isFollowing: true },
    { id: '3', name: 'Pedro Costa', username: 'pedrocosta', avatar: generateRealPersonAvatar('men'), isFollowing: false },
    { id: '4', name: 'Ana Oliveira', username: 'anaoliveira', avatar: generateRealPersonAvatar('women'), isFollowing: true },
    { id: '5', name: 'Carlos Rodrigues', username: 'carlosrodrigues', avatar: generateRealPersonAvatar('men'), isFollowing: false }
  ];

  const initialFollowing = [
    { id: '6', name: 'Juliana Pereira', username: 'jupereira', avatar: generateRealPersonAvatar('women'), isFollowing: true },
    { id: '7', name: 'Roberto Alves', username: 'robertoalves', avatar: generateRealPersonAvatar('men'), isFollowing: true },
    { id: '8', name: 'Fernanda Lima', username: 'fernandalima', avatar: generateRealPersonAvatar('women'), isFollowing: true }
  ];

  // Estado de edição temporário
  const [editingProfile, setEditingProfile] = useState(profile);
  
  // Estado para gerenciar seguidores/seguindo
  const [followers, setFollowers] = useState(initialFollowers);
  const [following, setFollowing] = useState(initialFollowing);

  // Dados mock para as seções
  const mockPosts = [
    {
      id: '1',
      content: 'Acabei de voltar de Marte! O Elon Musk me convidou pessoalmente para testar o novo foguete.',
      likes: 234,
      comments: 45,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      image: 'https://picsum.photos/400/300?random=1'
    },
    {
      id: '2',
      content: 'Meu gato acabou de aprender a falar francês. Agora ele só me responde em "Bonjour!"',
      likes: 567,
      comments: 89,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      content: 'Descobri que sou descendente direto de Leonardo da Vinci. Por isso meus desenhos são tão bons!',
      likes: 890,
      comments: 123,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      image: 'https://picsum.photos/400/300?random=2'
    }
  ];


  const mockPointsHistory = [
    { id: '1', description: 'Vitória em batalha', points: 100, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    { id: '2', description: 'Post com mais de 100 curtidas', points: 50, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { id: '3', description: 'Comentário destacado', points: 25, date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    { id: '4', description: 'Login diário', points: 10, date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
    { id: '5', description: 'Primeira mentira do dia', points: 20, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) }
  ];
  
  useEffect(() => {
    // Carregar dados do localStorage
    const savedProfile = localStorage.getItem('userProfile');
    const savedFollowers = localStorage.getItem('userFollowers');
    const savedFollowing = localStorage.getItem('userFollowing');
    
    if (savedProfile) {
      try {
        const profileData = JSON.parse(savedProfile);
        setProfile(profileData);
        setEditingProfile(profileData);
      } catch (e) {
        console.error('Erro ao carregar perfil:', e);
      }
    } else {
      // Se não houver dados salvos, salva o perfil inicial
      localStorage.setItem('userProfile', JSON.stringify(profile));
    }
    
    if (savedFollowers) {
      try {
        const followersData = JSON.parse(savedFollowers);
        setFollowers(followersData);
      } catch (e) {
        console.error('Erro ao carregar seguidores:', e);
      }
    } else {
      // Se não houver dados salvos, salva os seguidores iniciais
      localStorage.setItem('userFollowers', JSON.stringify(initialFollowers));
    }
    
    if (savedFollowing) {
      try {
        const followingData = JSON.parse(savedFollowing);
        setFollowing(followingData);
      } catch (e) {
        console.error('Erro ao carregar seguindo:', e);
      }
    } else {
      // Se não houver dados salvos, salva os seguindo iniciais
      localStorage.setItem('userFollowing', JSON.stringify(initialFollowing));
    }
    
    // Marca como inicializado após carregar os dados
    setIsInitialized(true);
  }, []);

  // Salvar followers sempre que mudar (após inicialização)
  useEffect(() => {
    if (isInitialized && followers.length > 0) {
      localStorage.setItem('userFollowers', JSON.stringify(followers));
    }
  }, [followers, isInitialized]);

  // Salvar following sempre que mudar (após inicialização)
  useEffect(() => {
    if (isInitialized && following.length >= 0) { // >= 0 porque pode ficar vazio
      localStorage.setItem('userFollowing', JSON.stringify(following));
    }
  }, [following, isInitialized]);

  // Salvar perfil sempre que mudar (após inicialização)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('userProfile', JSON.stringify(profile));
    }
  }, [profile, isInitialized]);
  
  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualizar perfil
      setProfile(editingProfile);
      
      // Salvar no localStorage
      const updatedUser = {
        ...editingProfile,
        id: profile.id
      };
      localStorage.setItem('userProfile', JSON.stringify(updatedUser));
      
      setMessage('Perfil atualizado com sucesso!');
      setIsEditing(false);
      setCoverPreview(null);
      setAvatarPreview(null);
      
      // Disparar evento para atualizar a sidebar
      window.dispatchEvent(new Event('profileUpdated'));
    } catch (error) {
      setMessage('Erro ao salvar o perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    setEditingProfile(profile);
    setIsEditing(false);
    setMessage('');
    setCoverPreview(null);
    setAvatarPreview(null);
  };
  
  const handleImageChange = (type: 'avatar' | 'cover') => {
    if (type === 'avatar' && avatarInputRef.current) {
      avatarInputRef.current.click();
    } else if (type === 'cover' && coverInputRef.current) {
      coverInputRef.current.click();
    }
  };

  // Handler para upload de avatar
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        setMessage('Por favor, selecione apenas arquivos de imagem.');
        return;
      }
      
      // Validar tamanho do arquivo (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setMessage('O arquivo deve ter no máximo 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        setEditingProfile(prev => ({
          ...prev,
          avatar: result
        }));
        setMessage('Imagem de perfil carregada. Clique em Salvar para confirmar.');
      };
      reader.onerror = () => {
        setMessage('Erro ao carregar a imagem. Tente novamente.');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler para upload de capa
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        setMessage('Por favor, selecione apenas arquivos de imagem.');
        return;
      }
      
      // Validar tamanho do arquivo (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setMessage('O arquivo deve ter no máximo 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCoverPreview(result);
        setEditingProfile(prev => ({
          ...prev,
          coverImage: result
        }));
        setMessage('Imagem de capa carregada. Clique em Salvar para confirmar.');
      };
      reader.onerror = () => {
        setMessage('Erro ao carregar a imagem. Tente novamente.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSectionToggle = (section: 'posts' | 'followers' | 'following' | 'points') => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  const handleFollowToggle = (userId: string, list: 'followers' | 'following') => {
    if (list === 'followers') {
      // Encontra o usuário atual para verificar o estado
      const currentUser = followers.find(f => f.id === userId);
      if (!currentUser) return;
      
      const wasFollowing = currentUser.isFollowing;
      const isNowFollowing = !wasFollowing;
      
      setFollowers(prev => prev.map(follower => {
        if (follower.id === userId) {
          return { ...follower, isFollowing: isNowFollowing };
        }
        return follower;
      }));
      
      // Se começou a seguir, adiciona à lista de seguindo
      if (isNowFollowing) {
        const userToFollow = { ...currentUser, isFollowing: true };
        setFollowing(prev => {
          if (!prev.find(u => u.id === userId)) {
            return [...prev, userToFollow];
          }
          return prev;
        });
        
        // Atualiza contadores
        setProfile(prev => ({ ...prev, following: prev.following + 1 }));
        setEditingProfile(prev => ({ ...prev, following: prev.following + 1 }));
        
        // Mensagem de feedback
        setMessage(`Agora você está seguindo ${currentUser.name}`);
        setTimeout(() => setMessage(''), 3000);
      } else {
        // Se deixou de seguir, remove da lista de seguindo
        setFollowing(prev => prev.filter(u => u.id !== userId));
        
        // Atualiza contadores
        setProfile(prev => ({ ...prev, following: prev.following - 1 }));
        setEditingProfile(prev => ({ ...prev, following: prev.following - 1 }));
        
        // Mensagem de feedback
        setMessage(`Você deixou de seguir ${currentUser.name}`);
        setTimeout(() => setMessage(''), 3000);
      }
    } else if (list === 'following') {
      // Encontra o usuário para o feedback
      const userToUnfollow = following.find(u => u.id === userId);
      
      // Remove da lista de seguindo
      setFollowing(prev => prev.filter(user => user.id !== userId));
      
      // Atualiza o status na lista de seguidores, se existir
      setFollowers(prev => prev.map(follower => {
        if (follower.id === userId) {
          return { ...follower, isFollowing: false };
        }
        return follower;
      }));
      
      // Atualiza contadores
      setProfile(prev => ({ ...prev, following: prev.following - 1 }));
      setEditingProfile(prev => ({ ...prev, following: prev.following - 1 }));
      
      // Mensagem de feedback
      if (userToUnfollow) {
        setMessage(`Você deixou de seguir ${userToUnfollow.name}`);
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header com imagem de capa */}
        <div className="relative mb-8">
          <div className="h-48 md:h-64 rounded-lg overflow-hidden relative">
            <img 
              src={isEditing ? editingProfile.coverImage : profile.coverImage}
              alt="Capa do perfil"
              className="w-full h-full object-cover"
            />
            {isEditing && (
              <button
                onClick={() => handleImageChange('cover')}
                className="absolute bottom-4 right-4 bg-white text-gray-800 px-4 py-2 rounded-full shadow-lg hover:shadow-xl hover:ring-2 hover:ring-purple-500 transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                title="Alterar imagem de capa"
                aria-label="Alterar imagem de capa"
              >
                <FaCamera className="w-4 h-4" />
                <span className="text-sm font-medium">Alterar capa</span>
              </button>
            )}
            
            {/* Botões de editar/salvar/cancelar */}
            <div className="absolute top-4 right-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-lg"
                >
                  <FaEdit /> Editar Perfil
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 shadow-lg"
                    disabled={loading}
                  >
                    <FaTimes /> Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg"
                    disabled={loading}
                  >
                    <FaSave /> Salvar
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Avatar */}
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-200">
                <img 
                  src={isEditing ? editingProfile.avatar : profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <button
                  onClick={() => handleImageChange('avatar')}
                  className="absolute bottom-0 right-0 bg-white text-gray-800 p-2 rounded-full shadow-lg hover:shadow-xl hover:ring-2 hover:ring-purple-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  title="Alterar foto de perfil"
                  aria-label="Alterar foto de perfil"
                >
                  <FaCamera className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          
        </div>
        
        {/* Informações do perfil */}
        <div className="mt-20">
          {message && (
            <div className={`mb-4 p-3 rounded-lg ${
              message.includes('sucesso') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coluna esquerda */}
            <div className="space-y-4">
              {/* Nome */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FaUser /> Nome
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editingProfile.name}
                    onChange={(e) => setEditingProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-gray-100">{profile.name}</p>
                )}
              </div>
              
              {/* Username */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  @ Username
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editingProfile.username}
                    onChange={(e) => setEditingProfile(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-gray-100">@{profile.username}</p>
                )}
              </div>
              
              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FaEnvelope /> Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editingProfile.email}
                    onChange={(e) => setEditingProfile(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-gray-100">{profile.email}</p>
                )}
              </div>
            </div>
            
            {/* Coluna direita */}
            <div className="space-y-4">
              {/* Bio */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={editingProfile.bio}
                    onChange={(e) => setEditingProfile(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-gray-100">{profile.bio}</p>
                )}
              </div>
              
              {/* Website */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FaLink /> Website
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editingProfile.website}
                    onChange={(e) => setEditingProfile(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-blue-600 dark:text-blue-400">{profile.website}</p>
                )}
              </div>
              
              {/* Localização */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FaMapMarkerAlt /> Localização
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editingProfile.location}
                    onChange={(e) => setEditingProfile(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-gray-100">{profile.location}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Estatísticas */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => handleSectionToggle('posts')}
              className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                activeSection === 'posts' ? 'ring-2 ring-purple-500' : ''
              }`}
            >
              <p className="text-2xl font-bold text-purple-600">{profile.posts}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Publicações</p>
            </button>
            <button
              onClick={() => handleSectionToggle('followers')}
              className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                activeSection === 'followers' ? 'ring-2 ring-purple-500' : ''
              }`}
            >
              <p className="text-2xl font-bold text-purple-600">{profile.followers.toLocaleString()}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Seguidores</p>
            </button>
            <button
              onClick={() => handleSectionToggle('following')}
              className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                activeSection === 'following' ? 'ring-2 ring-purple-500' : ''
              }`}
            >
              <p className="text-2xl font-bold text-purple-600">{profile.following}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Seguindo</p>
            </button>
            <button
              onClick={() => handleSectionToggle('points')}
              className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                activeSection === 'points' ? 'ring-2 ring-purple-500' : ''
              }`}
            >
              <p className="text-2xl font-bold text-purple-600">{profile.points.toLocaleString()}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pontos</p>
            </button>
          </div>
          
          {/* Status PRO */}
          {profile.isPro && (
            <button
              onClick={() => setShowLevelModal(true)}
              className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-4 text-center hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <p className="font-bold text-lg">Usuário PRO</p>
              <p>Nível {profile.level} - Continue mentindo para subir de nível!</p>
            </button>
          )}
        </div>

        {/* Seções dinâmicas */}
        {activeSection && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {activeSection === 'posts' && 'Publicações'}
                {activeSection === 'followers' && 'Seguidores'}
                {activeSection === 'following' && 'Seguindo'}
                {activeSection === 'points' && 'Histórico de Pontos'}
              </h3>
            </div>
            
            <div className="p-4">
              {/* Posts Section */}
              {activeSection === 'posts' && (
                <div className="space-y-6">
                  {mockPosts.map(post => (
                    <div key={post.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <p className="text-gray-900 dark:text-white mb-2">{post.content}</p>
                      {post.image && (
                        <img src={post.image} alt="Post" className="w-full h-64 object-cover rounded-lg mb-2" />
                      )}
                      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex gap-4">
                          <span>❤️ {post.likes} curtidas</span>
                          <span>💬 {post.comments} comentários</span>
                        </div>
                        <span>{post.createdAt.toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Followers Section */}
              {activeSection === 'followers' && (
                <div className="space-y-4">
                  {followers.map(follower => (
                    <div key={follower.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <img 
                          src={follower.avatar} 
                          alt={follower.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{follower.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">@{follower.username}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleFollowToggle(follower.id, 'followers')}
                        className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                          follower.isFollowing
                            ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                            : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                      >
                        {follower.isFollowing ? 'Seguindo' : 'Seguir'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Following Section */}
              {activeSection === 'following' && (
                <div className="space-y-4">
                  {following.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">@{user.username}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleFollowToggle(user.id, 'following')}
                        className="px-5 py-2 bg-gray-200 text-gray-900 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
                      >
                        Deixar de seguir
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Points Section */}
              {activeSection === 'points' && (
                <div className="space-y-4">
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-6">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      Total: {profile.points.toLocaleString()} pontos
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Continue ativo para ganhar mais pontos!
                    </p>
                  </div>
                  
                  {mockPointsHistory.map(item => (
                    <div key={item.id} className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{item.description}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.date.toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                        +{item.points}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Modal de Status do Nível */}
        {showLevelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 relative">
              <button
                onClick={() => setShowLevelModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FaTimes className="w-6 h-6" />
              </button>
              
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Status do Nível</h2>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                  <p className="text-3xl font-bold">Nível {profile.level}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progresso</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{profile.points % 500}/500 XP</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                      style={{ width: `${(profile.points % 500) / 5}%` }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{profile.points}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pontos totais</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">{Math.floor(profile.points / 500)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Níveis conquistados</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Benefícios do Nível {profile.level}:</h3>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Badge exclusivo de nível {profile.level}
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {profile.level * 10}% mais pontos em batalhas
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Destaque especial nos rankings
                    </li>
                    {profile.level >= 10 && (
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Acesso a eventos exclusivos
                      </li>
                    )}
                  </ul>
                </div>
                
                {profile.level < 20 && (
                  <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    <p>Faltam <span className="font-bold text-purple-600 dark:text-purple-400">{500 - (profile.points % 500)}</span> pontos para o próximo nível!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Inputs de arquivo escondidos */}
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          className="hidden"
        />
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={handleCoverUpload}
          className="hidden"
        />
    </div>
  );
}