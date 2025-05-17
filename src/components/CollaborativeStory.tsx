import React, { useState, useEffect } from 'react';
import { BookOpenIcon, PlusCircleIcon, UserGroupIcon, ChevronDownIcon, ClockIcon } from '@heroicons/react/outline';
import { User } from '../types';

interface CollaborativeStoryProps {
  currentUser: User;
}

// Interface para partes da história
interface StoryPart {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  userInfo: {
    name: string;
    photoURL: string;
  };
}

// Interface para histórias colaborativas
interface Story {
  id: string;
  title: string;
  theme: string;
  parts: StoryPart[];
  contributors: string[];
  isComplete: boolean;
  createdAt: string;
  updatedAt: string;
  maxParts: number;
}

// Mock de histórias colaborativas
const MOCK_STORIES: Story[] = [
  {
    id: 'story1',
    title: 'A Expedição Perdida',
    theme: 'aventura',
    parts: [
      {
        id: 'part1',
        userId: 'user1',
        content: 'Ontem liderei uma expedição para descobrir o lendário Yeti da Mata Atlântica. Nosso grupo de cientistas renomados estava equipado com os mais avançados sensores de criaturas místicas.',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        userInfo: {
          name: 'João Mentiroso',
          photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        }
      },
      {
        id: 'part2',
        userId: 'user2',
        content: 'Após três horas de caminhada, encontramos pegadas do tamanho de pneus de trator. Seguimos as pegadas e descobrimos uma caverna secreta iluminada por cristais fosforescentes.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        userInfo: {
          name: 'Maria Inventora',
          photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        }
      }
    ],
    contributors: ['user1', 'user2'],
    isComplete: false,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    maxParts: 5
  },
  {
    id: 'story2',
    title: 'O Restaurante Interdimensional',
    theme: 'comida',
    parts: [
      {
        id: 'part1',
        userId: 'user3',
        content: 'Descobri um restaurante secreto que só aparece nas noites de lua cheia. Dizem que o chef é um viajante do tempo que traz ingredientes de diferentes épocas.',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        userInfo: {
          name: 'Carlos Fabuloso',
          photoURL: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        }
      },
      {
        id: 'part2',
        userId: 'user4',
        content: 'Quando visitei o local, o cardápio mudava de idioma a cada 5 minutos. Pedi um prato chamado "Enigma Temporal" que, segundo o garçom, continha um ingrediente que ainda não foi descoberto pela humanidade.',
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        userInfo: {
          name: 'Ana Inventiva',
          photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        }
      },
      {
        id: 'part3',
        userId: 'user5',
        content: 'A comida chegou flutuando até minha mesa. O prato principal era uma sobremesa que mudava de sabor conforme minhas memórias. Comecei comendo um sorvete de chocolate, mas terminou com gosto da torta de maçã da minha avó.',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        userInfo: {
          name: 'Pedro Criativo',
          photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        }
      },
      {
        id: 'part4',
        userId: 'user1',
        content: 'Quando pedi a conta, o garçom me disse que eu já havia pago em uma linha temporal alternativa. Como prova, me mostrou um recibo com minha assinatura datado de 2047!',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        userInfo: {
          name: 'João Mentiroso',
          photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        }
      }
    ],
    contributors: ['user3', 'user4', 'user5', 'user1'],
    isComplete: false,
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    maxParts: 5
  },
  {
    id: 'story3',
    title: 'O Videogame que Prevê o Futuro',
    theme: 'tecnologia',
    parts: [
      {
        id: 'part1',
        userId: 'user2',
        content: 'Comprei um videogame usado em um brechó misterioso. Quando comecei a jogar, percebi que os cenários do jogo eram idênticos aos lugares que eu visitaria no dia seguinte.',
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        userInfo: {
          name: 'Maria Inventora',
          photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        }
      }
    ],
    contributors: ['user2'],
    isComplete: false,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    maxParts: 6
  }
];

const CollaborativeStory: React.FC<CollaborativeStoryProps> = ({ currentUser }) => {
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);
  const [activeStoryId, setActiveStoryId] = useState<string>(MOCK_STORIES[0].id);
  const [expandedStories, setExpandedStories] = useState<Record<string, boolean>>({});
  const [newStoryPart, setNewStoryPart] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const activeStory = stories.find(story => story.id === activeStoryId) || stories[0];
  
  // Verificar se o usuário já contribuiu para a história ativa
  const hasUserContributed = (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    return story ? story.contributors.includes(currentUser.id) : false;
  };
  
  // Verificar se a história está completa (atingiu o número máximo de partes)
  const isStoryComplete = (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    return story ? story.parts.length >= story.maxParts : false;
  };
  
  const canUserContribute = (storyId: string) => {
    // O usuário pode contribuir se:
    // 1. Não tiver sido o último a contribuir
    // 2. A história não estiver completa
    const story = stories.find(s => s.id === storyId);
    if (!story || story.isComplete) return false;
    
    if (story.parts.length === 0) return true;
    
    const lastPart = story.parts[story.parts.length - 1];
    return lastPart.userId !== currentUser.id && story.parts.length < story.maxParts;
  };
  
  const toggleStoryExpansion = (storyId: string) => {
    setExpandedStories(prev => ({
      ...prev,
      [storyId]: !prev[storyId]
    }));
  };
  
  const handleStoryPartSubmit = () => {
    if (!newStoryPart.trim() || isSubmitting || !canUserContribute(activeStoryId)) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simular envio
    setTimeout(() => {
      // Criar nova parte da história
      const newPart: StoryPart = {
        id: `part-${Date.now()}`,
        userId: currentUser.id,
        content: newStoryPart,
        createdAt: new Date().toISOString(),
        userInfo: {
          name: currentUser.displayName || '',
          photoURL: currentUser.photoURL || ''
        }
      };
      
      // Atualizar a história
      setStories(prevStories => 
        prevStories.map(story => {
          if (story.id === activeStoryId) {
            const updatedStory = {
              ...story,
              parts: [...story.parts, newPart],
              contributors: story.contributors.includes(currentUser.id) 
                ? story.contributors 
                : [...story.contributors, currentUser.id],
              updatedAt: new Date().toISOString(),
              isComplete: story.parts.length + 1 >= story.maxParts
            };
            return updatedStory;
          }
          return story;
        })
      );
      
      setNewStoryPart('');
      setIsSubmitting(false);
      
      // Expandir a história que acabou de ser atualizada
      setExpandedStories(prev => ({
        ...prev,
        [activeStoryId]: true
      }));
    }, 1000);
  };
  
  const formatDate = (date: string) => {
    const formattedDate = new Date(date).toLocaleDateString('pt-BR');
    return formattedDate;
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
        <h2 className="text-xl font-bold flex items-center">
          <BookOpenIcon className="w-6 h-6 mr-2" />
          Histórias Colaborativas
        </h2>
        <p className="text-sm mt-1 text-indigo-100">
          Participe criando ou continuando histórias mentirosas com outros usuários!
        </p>
      </div>
      
      {/* Lista de Histórias */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-3 dark:text-white">Histórias Disponíveis</h3>
        
        <div className="space-y-4">
          {stories.map(story => (
            <div 
              key={story.id} 
              className={`border rounded-lg overflow-hidden ${activeStoryId === story.id ? 'border-indigo-500 dark:border-indigo-400' : 'border-gray-200 dark:border-gray-700'}`}
            >
              <div 
                className={`p-4 cursor-pointer ${
                  activeStoryId === story.id 
                    ? 'bg-indigo-50 dark:bg-indigo-900/20' 
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveStoryId(story.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium dark:text-white">{story.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Tema: #{story.theme} • {story.parts.length}/{story.maxParts} partes
                    </p>
                  </div>
                  <button
                    className="text-indigo-600 dark:text-indigo-400 p-1 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStoryExpansion(story.id);
                    }}
                  >
                    <ChevronDownIcon className={`w-5 h-5 transition-transform ${expandedStories[story.id] ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <UserGroupIcon className="w-4 h-4 mr-1" />
                  <span>{story.contributors.length} contribuidores</span>
                  <span className="mx-2">•</span>
                  <ClockIcon className="w-4 h-4 mr-1" />
                  <span>Atualizado: {formatDate(story.updatedAt)}</span>
                </div>
                
                {expandedStories[story.id] && (
                  <div className="mt-4 space-y-3">
                    {story.parts.map((part, index) => (
                      <div key={part.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                        <div className="flex items-start mb-2">
                          <img 
                            src={part.userInfo.photoURL} 
                            alt={part.userInfo.name} 
                            className="w-8 h-8 rounded-full mr-2" 
                          />
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium text-sm dark:text-white">{part.userInfo.name}</span>
                              <span className="mx-1 text-gray-500 dark:text-gray-400">•</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">Parte {index + 1}</span>
                            </div>
                            <p className="text-sm mt-1 text-gray-800 dark:text-gray-200">{part.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Área de Contribuição */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-3 dark:text-white">Contribuir para "{activeStory.title}"</h3>
        
        {/* Status da História */}
        <div className="mb-4">
          {isStoryComplete(activeStoryId) ? (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg text-yellow-800 dark:text-yellow-200">
              Esta história está completa! Não é possível adicionar mais partes.
            </div>
          ) : hasUserContributed(activeStoryId) && !canUserContribute(activeStoryId) ? (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-blue-800 dark:text-blue-200">
              Você já contribuiu para esta história recentemente. Aguarde a contribuição de outros usuários.
            </div>
          ) : (
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-green-800 dark:text-green-200">
              Você pode adicionar a próxima parte desta história!
            </div>
          )}
        </div>
        
        {/* Formulário de Contribuição */}
        {canUserContribute(activeStoryId) ? (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sua contribuição:
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
                placeholder="Continue a história com sua mentira..."
                value={newStoryPart}
                onChange={(e) => setNewStoryPart(e.target.value)}
                maxLength={300}
              />
              <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                {newStoryPart.length}/300 caracteres
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                onClick={handleStoryPartSubmit}
                disabled={!newStoryPart.trim() || isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : (
                  <span className="flex items-center">
                    <PlusCircleIcon className="w-5 h-5 mr-1" />
                    Adicionar Parte
                  </span>
                )}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default CollaborativeStory; 