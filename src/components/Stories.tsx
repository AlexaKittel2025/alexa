import { PlusIcon } from '@heroicons/react/outline';
import React, { useState } from 'react';
import StorymentModal from './StorymentModal';
import { User, Storyment } from '@/types';
import { generateRealPersonAvatar } from '@/utils/avatarUtils';

// Componente para o círculo de adicionar story
const AddStoryCircle: React.FC<{
  onClick: () => void;
}> = ({ onClick }) => (
  <div 
    className="flex flex-col items-center cursor-pointer"
    onClick={onClick}
  >
    <div className="w-16 h-16 rounded-full bg-gray-200 p-[2px] relative">
      <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center border-2 border-white">
        <PlusIcon className="w-8 h-8 text-primary" />
      </div>
      <div className="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-white">
        <PlusIcon className="w-4 h-4 text-white" />
      </div>
    </div>
    <span className="mt-1 text-xs text-center font-medium">
      Criar
    </span>
  </div>
);

// Componente para os círculos de stories na UI
const StoryCircle: React.FC<{
  user: {
    id: string;
    display_name: string;
    photo_url: string;
  };
  hasUnseenStories: boolean;
  onClick: () => void;
  isCurrentUser?: boolean;
}> = ({ user, hasUnseenStories, onClick, isCurrentUser }) => (
  <div 
    className={`flex flex-col items-center cursor-pointer ${isCurrentUser ? 'border-2 border-primary' : ''}`}
    onClick={onClick}
  >
    <div 
      className={`w-16 h-16 rounded-full ${hasUnseenStories ? 'bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-[2px]' : 'bg-gray-200 p-[2px]'}`}
    >
      <img 
        src={user.photo_url} 
        alt={user.display_name}
        className="w-full h-full object-cover rounded-full border-2 border-white cursor-pointer hover:opacity-80 transition"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      />
    </div>
    <span className="mt-1 text-xs text-center font-medium">
      {user.display_name.split(' ')[0]}
    </span>
  </div>
);

// Componente principal para os stories
const Stories: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Usuário atual mockado (aquele que está logado)
  const currentUser: User = {
    id: 'current-user',
    username: 'usuarioatual',
    displayName: 'Usuário Atual',
    email: 'usuario@exemplo.com',
    photoURL: generateRealPersonAvatar(),
    points: 120,
    level: 5,
    isPro: false,
    createdAt: new Date().toISOString(),
    bio: null,
    coverImage: null,
    city: null,
    state: null
  };
  
  // Mock de usuários
  const users = [
    {
      id: '1',
      username: 'joaosilva',
      display_name: 'João Silva',
      photo_url: generateRealPersonAvatar('men'),
    },
    {
      id: '2',
      username: 'mariasantos',
      display_name: 'Maria Santos',
      photo_url: generateRealPersonAvatar('women'),
    },
    {
      id: '3',
      username: 'analucia',
      display_name: 'Ana Lucia',
      photo_url: generateRealPersonAvatar('women'),
    },
    {
      id: 'user5',
      username: 'mariasilva',
      display_name: 'Maria Silva',
      photo_url: generateRealPersonAvatar('women'),
    },
    {
      id: 'user6',
      username: 'joaocarlos',
      display_name: 'João Carlos',
      photo_url: generateRealPersonAvatar('men'),
    },
    {
      id: 'user7',
      username: 'julianacosta',
      display_name: 'Juliana Costa',
      photo_url: generateRealPersonAvatar('women'),
    }
  ];
  
  // Mock de stories por usuário
  const [storiesByUser, setStoriesByUser] = useState<Record<string, Storyment[]>>({
    '1': [
      {
        id: '1-1',
        userId: '1',
        content: 'Meu primeiro story!',
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
        expiresAt: new Date(Date.now() + 82800000).toISOString() // 24 horas após criação
      },
      {
        id: '1-2',
        userId: '1',
        content: '',
        imageURL: 'https://images.unsplash.com/photo-1576161787924-01bb08dad4a4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutos atrás
        expiresAt: new Date(Date.now() + 84600000).toISOString() // 24 horas após criação
      }
    ],
    '2': [
      {
        id: '2-1',
        userId: '2',
        content: '',
        imageURL: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 horas atrás
        expiresAt: new Date(Date.now() + 79200000).toISOString() // 24 horas após criação
      }
    ],
    '3': [
      {
        id: '3-1',
        userId: '3',
        content: 'Oi, pessoal! 👋',
        createdAt: new Date(Date.now() - 300000).toISOString(), // 5 minutos atrás
        expiresAt: new Date(Date.now() + 86100000).toISOString() // 24 horas após criação
      },
      {
        id: '3-2',
        userId: '3',
        content: 'Estou muito animada para compartilhar isso com vocês!',
        createdAt: new Date(Date.now() - 180000).toISOString(), // 3 minutos atrás
        expiresAt: new Date(Date.now() + 86220000).toISOString() // 24 horas após criação
      },
      {
        id: '3-3',
        userId: '3',
        content: '',
        createdAt: new Date().toISOString(), // agora
        expiresAt: new Date(Date.now() + 86400000).toISOString() // 24 horas após criação
      }
    ],
    'current-user': [
      {
        id: 'current-1',
        userId: 'current-user',
        content: 'Meu primeiro story!',
        createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutos atrás
        expiresAt: new Date(Date.now() + 84600000).toISOString() // 24 horas após criação
      }
    ],
    'user5': [
      {
        id: 'user5-1',
        userId: 'user5',
        content: 'Acabei de entrar no Mentei! 😊',
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
        expiresAt: new Date(Date.now() + 82800000).toISOString() // 24 horas após criação
      }
    ],
    'user6': [
      {
        id: 'user6-1',
        userId: 'user6',
        content: '',
        imageURL: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        createdAt: new Date(Date.now() - 5400000).toISOString(), // 1.5 horas atrás
        expiresAt: new Date(Date.now() + 81000000).toISOString() // 24 horas após criação
      }
    ],
    'user7': [
      {
        id: 'user7-1',
        userId: 'user7',
        content: 'Quem mais está aproveitando o dia?',
        createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutos atrás
        expiresAt: new Date(Date.now() + 84600000).toISOString() // 24 horas após criação
      },
      {
        id: 'user7-2',
        userId: 'user7',
        content: '',
        imageURL: 'https://images.unsplash.com/photo-1523438097201-512ae7d59c44?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        createdAt: new Date(Date.now() - 600000).toISOString(), // 10 minutos atrás
        expiresAt: new Date(Date.now() + 85800000).toISOString() // 24 horas após criação
      }
    ]
  });
  
  // Função para abrir o modal de stories para um usuário específico
  const openStoriesForUser = (userIndex: number) => {
    setSelectedUserIndex(userIndex);
    setIsModalOpen(true);
  };

  // Função para abrir stories por ID do usuário
  const openStoriesForUserById = (userId: string) => {
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      openStoriesForUser(userIndex);
    }
  };

  React.useEffect(() => {
    // Adicionar evento personalizado para abrir stories de usuários
    const handleOpenUserStories = (event: Event) => {
      const customEvent = event as CustomEvent<{userId: string}>;
      if (customEvent.detail && customEvent.detail.userId) {
        openStoriesForUserById(customEvent.detail.userId);
      }
    };

    document.addEventListener('open-user-stories', handleOpenUserStories);

    // Limpar o evento ao desmontar o componente
    return () => {
      document.removeEventListener('open-user-stories', handleOpenUserStories);
    };
  }, []);

  // Função para abrir o modal de criação de stories
  const openCreateStoryModal = () => {
    setIsCreateModalOpen(true);
  };

  // Função para abrir os meus stories
  const openMyStories = () => {
    // Verificar se o usuário atual tem stories
    if (storiesByUser['current-user'] && storiesByUser['current-user'].length > 0) {
      // Mostrar os stories
      setIsModalOpen(true);
      // Usar um índice especial para o usuário atual
      setSelectedUserIndex(-1);
    } else {
      // Se não tiver stories, abrir modal de criação
      openCreateStoryModal();
    }
  };
  
  // Função para criar um novo story
  const createStory = (content: string, imageURL?: string) => {
    const newStory: Storyment = {
      id: `current-${Date.now()}`,
      userId: 'current-user',
      content,
      imageURL,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString() // 24 horas após criação
    };
    setStoriesByUser(prev => ({
      ...prev,
      ['current-user']: [newStory, ...(prev['current-user'] || [])]
    }));
    setIsCreateModalOpen(false);
    alert('Story criado com sucesso!');
  };
  
  // Todos os stories para o modal
  const allStories = users.flatMap(user => storiesByUser[user.id] || []);
  
  // Stories apenas do usuário selecionado
  const getSelectedUserStories = () => {
    // Caso especial para o usuário atual
    if (selectedUserIndex === -1) {
      return storiesByUser['current-user'] || [];
    }
    
    const userId = users[selectedUserIndex]?.id;
    if (!userId) return [];
    return storiesByUser[userId] || [];
  };
  
  // Obter stories do usuário selecionado
  const selectedUserStories = getSelectedUserStories();
  
  // Componente para o modal de criação de story
  const CreateStoryModal = () => {
    const [content, setContent] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [backgroundColor, setBackgroundColor] = useState('#000000');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      createStory(content, imageURL);
    };

    if (!isCreateModalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
        <div 
          className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-bold mb-4">Criar Novo Story</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Texto do Story</label>
              <textarea 
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="O que você quer compartilhar?"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">URL da Imagem (opcional)</label>
              <input 
                type="text"
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                value={imageURL}
                onChange={(e) => setImageURL(e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Cor de Fundo</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-10 h-10 border-0"
                />
                <span className="text-gray-700 dark:text-gray-300">{backgroundColor}</span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCreateModalOpen(false);
                }}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                onClick={(e) => e.stopPropagation()}
                className="px-4 py-2 bg-primary text-white rounded-lg"
              >
                Criar Story
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  return (
    <div className="stories-container">
      <div className="flex space-x-4 overflow-x-auto py-2 px-4">
        {/* Opção para adicionar novo story */}
        <AddStoryCircle onClick={openCreateStoryModal} />
        
        {/* Meu story (usuário atual) */}
        <StoryCircle
          user={{
            id: currentUser.id,
            display_name: "Seu story",
            photo_url: currentUser.photoURL || ''
          }}
          hasUnseenStories={storiesByUser['current-user']?.length > 0}
          onClick={openMyStories}
          isCurrentUser
        />
        
        {/* Stories de outros usuários */}
        {users.map((user, index) => (
          <StoryCircle 
            key={user.id}
            user={user}
            hasUnseenStories={true} // Em um cenário real, verificaríamos quais stories o usuário já viu
            onClick={() => openStoriesForUser(index)}
          />
        ))}
      </div>
      
      {/* Modal de Stories */}
      <StorymentModal 
        stories={selectedUserStories}
        isOpen={isModalOpen && selectedUserStories.length > 0}
        onClose={() => setIsModalOpen(false)}
        currentUser={currentUser}
        storyDuration={5000} // 5 segundos por story
        setStoriesByUser={setStoriesByUser}
        storiesByUser={storiesByUser}
      />
      
      {/* Modal de criação de Story */}
      <CreateStoryModal />
    </div>
  );
};

export default Stories; 