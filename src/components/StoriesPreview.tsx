import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Storyment } from '../types';
import ProBadge from './ProBadge';
import StorymentModal from './StorymentModal';

interface StoriesPreviewProps {
  currentUser: User;
}

const StoriesPreview: React.FC<StoriesPreviewProps> = ({ currentUser }) => {
  const [selectedStoryment, setSelectedStoryment] = useState<Storyment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number>(0);
  const [currentUserStoriesIndex, setCurrentUserStoriesIndex] = useState<number>(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [storiesByUser, setStoriesByUser] = useState<Record<string, Storyment[]>>({});
  
  // Em uma aplicação real, você faria uma requisição para obter os storyments ativos
  // Aqui apenas simulamos alguns usuários com storyments
  const usersWithStories = [
    {
      id: '1',
      username: 'joao',
      displayName: 'João Silva',
      avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      isPro: true,
      hasUnviewedStories: true,
      stories: [
        {
          id: '1-story-1',
          content: 'Esta é a primeira mensagem de João Silva em um storyment.',
          backgroundColor: '#3498db',
          textColor: '#ffffff'
        },
        {
          id: '1-story-2',
          content: 'Esta é a segunda mensagem de João Silva em um storyment.',
          backgroundColor: '#2980b9',
          textColor: '#ffffff'
        }
      ]
    },
    {
      id: '2',
      username: 'maria',
      displayName: 'Maria Santos',
      avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
      isPro: false,
      hasUnviewedStories: true,
      stories: [
        {
          id: '2-story-1',
          content: 'Esta é uma mensagem de Maria Santos em um storyment.',
          backgroundColor: '#e74c3c',
          textColor: '#ffffff'
        }
      ]
    },
    {
      id: '3',
      username: 'pedro',
      displayName: 'Pedro Oliveira',
      avatarUrl: 'https://randomuser.me/api/portraits/men/67.jpg',
      isPro: false,
      hasUnviewedStories: false,
      stories: [
        {
          id: '3-story-1',
          content: 'Esta é uma mensagem de Pedro Oliveira em um storyment.',
          backgroundColor: '#f39c12',
          textColor: '#ffffff'
        }
      ]
    }
  ];
  
  // Adicionar o usuário atual à lista se ele ainda não estiver
  const myStories = [
    {
      id: 'my-story-1',
      content: 'Meu primeiro storyment!',
      backgroundColor: '#9b59b6',
      textColor: '#ffffff'
    }
  ];
  
  // Verificar se o usuário atual já tem um storyment
  const currentUserHasStory = usersWithStories.some(user => user.id === currentUser.id);
  
  // Converter os dados de usersWithStories para o formato Storyment[]
  const getAllStories = (): Storyment[] => {
    const allStories: Storyment[] = [];
    
    usersWithStories.forEach(user => {
      user.stories.forEach(story => {
        allStories.push({
          id: story.id,
          userId: user.id,
          content: story.content,
          backgroundColor: story.backgroundColor,
          textColor: story.textColor,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          views: Math.floor(Math.random() * 100)
        });
      });
    });
    
    return allStories;
  };
  
  // Obter todas as stories de um usuário específico
  const getUserStories = (userIndex: number): Storyment[] => {
    const user = usersWithStories[userIndex];
    return user.stories.map(story => ({
      id: story.id,
      userId: user.id,
      content: story.content,
      backgroundColor: story.backgroundColor,
      textColor: story.textColor,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      views: Math.floor(Math.random() * 100)
    }));
  };
  
  const handleOpenStory = (userIndex: number) => {
    setCurrentStoryIndex(userIndex);
    setCurrentUserStoriesIndex(0); // Iniciar pela primeira story do usuário
    setIsModalOpen(true);
  };
  
  const handleNextStory = () => {
    // Função agora é tratada dentro do StorymentModal
    console.log('Próxima história');
  };
  
  const handlePrevStory = () => {
    // Função agora é tratada dentro do StorymentModal  
    console.log('História anterior');
  };
  
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateStory = (content: string) => {
    // Implementação para criar um novo storyment
    console.log('Criando novo storyment:', content);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Storyments</h2>
        <Link to="/storyments" className="text-primary dark:text-primary-light hover:underline text-sm">
          Ver Todos
        </Link>
      </div>
      
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {/* Item do próprio usuário para criar storyment */}
        <div 
          className="flex flex-col items-center cursor-pointer"
          onClick={handleOpenCreateModal}
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white">
                <a href={`/profile/${currentUser.username || currentUser.id}`} title={currentUser.displayName}>
                  <img 
                    src={currentUser.photoURL || 'https://via.placeholder.com/150'} 
                    alt={currentUser.displayName} 
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition"
                  />
                </a>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
              <span className="text-xs">+</span>
            </div>
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 max-w-[70px] truncate text-center">
            Você
          </span>
        </div>
        
        {/* Lista de usuários com storyments */}
        {usersWithStories.map((user, index) => (
          <div 
            key={user.id} 
            className="flex flex-col items-center cursor-pointer"
            onClick={() => handleOpenStory(index)}
          >
            <div className="relative">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                user.hasUnviewedStories 
                  ? 'bg-gradient-to-r from-primary to-secondary' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}>
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white dark:border-gray-800">
                  <a href={`/profile/${user.username || user.id}`} title={user.displayName}>
                    <img 
                      src={user.avatarUrl} 
                      alt={user.displayName} 
                      className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition"
                    />
                  </a>
                </div>
              </div>
              
              {user.isPro && (
                <div className="absolute -bottom-1 -right-1">
                  <ProBadge size="sm" />
                </div>
              )}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 max-w-[70px] truncate text-center">
              {user.id === currentUser.id ? 'Você' : user.displayName}
            </span>
          </div>
        ))}
      </div>
      
      {/* Modal de Storyment */}
      {isModalOpen && (
        <StorymentModal
          stories={getUserStories(currentStoryIndex)}
          initialStoryIndex={currentUserStoriesIndex}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
          currentUser={currentUser}
          storyDuration={5000}
          setStoriesByUser={setStoriesByUser}
          storiesByUser={storiesByUser}
        />
      )}
      
      {/* Modal para criar storyment - Simulação simplificada */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-xl font-bold mb-4">Criar Storyment</h3>
            <textarea 
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              rows={4}
              placeholder="O que você quer compartilhar hoje?"
            ></textarea>
            <div className="flex justify-end space-x-3 mt-4">
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleCreateStory("Meu novo storyment criado agora!")}
                className="px-4 py-2 bg-primary text-white rounded-md"
              >
                Publicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoriesPreview; 