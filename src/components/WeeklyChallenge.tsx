;

;
import { BadgeCheckIcon, CalendarIcon, ClockIcon } from '@heroicons/react/outline';
import React, { useState, useEffect } from 'react';import { Post as PostType, User, Challenge } from '../types';

interface WeeklyChallengeProps {
  currentUser: User;
  onPostSubmit?: (post: Omit<PostType, 'id' | 'createdAt'>) => void;
}

// Desafios Semanais Mockados
const WEEKLY_CHALLENGES: Challenge[] = [
  {
    id: 'challenge1',
    title: 'O Dia Mais Estranho',
    description: 'Crie uma mentira sobre o dia mais bizarro da sua vida. Quanto mais absurdo, melhor!',
    category: 'criatividade',
    reward: 50,
    startDate: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 dias atrás
    endDate: new Date(Date.now() + 86400000 * 4).toISOString(),   // 4 dias no futuro
    participants: ['user2', 'user3', 'user5']
  },
  {
    id: 'challenge2',
    title: 'Falsos Inventores',
    description: 'Invente uma história sobre como você criou um objeto ou tecnologia do cotidiano.',
    category: 'tecnologia',
    reward: 75,
    startDate: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 dias atrás
    endDate: new Date(Date.now() + 86400000 * 2).toISOString(),   // 2 dias no futuro
    participants: ['user1', 'user4', 'user2']
  },
  {
    id: 'challenge3',
    title: 'Banquete Impossível',
    description: 'Conte uma mentira sobre a refeição mais inacreditável que você já preparou ou comeu.',
    category: 'comida',
    reward: 100,
    startDate: new Date(Date.now()).toISOString(),                // Hoje
    endDate: new Date(Date.now() + 86400000 * 7).toISOString(),   // 7 dias no futuro
    participants: []
  },
];

const WeeklyChallenge: React.FC<WeeklyChallengeProps> = ({ currentUser, onPostSubmit }) => {
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [newPostContent, setNewPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    // Seleciona o desafio da semana atual
    const activeChallenge = WEEKLY_CHALLENGES.find(challenge => {
      const now = new Date();
      return new Date(challenge.startDate) <= now && new Date(challenge.endDate) >= now;
    }) || WEEKLY_CHALLENGES[0];
    
    setActiveChallenge(activeChallenge);
    setChallengeIndex(WEEKLY_CHALLENGES.indexOf(activeChallenge));
  }, []);

  useEffect(() => {
    if (activeChallenge) {
      // Verifica se o usuário já participou deste desafio
      const userParticipated = activeChallenge.participants.includes(currentUser.id);
      setHasSubmitted(userParticipated);
      
      // Atualiza o tempo restante
      const updateRemainingTime = () => {
        const now = new Date();
        const endTime = new Date(activeChallenge.endDate);
        const timeLeft = endTime.getTime() - now.getTime();
        
        if (timeLeft <= 0) {
          setTimeRemaining('Encerrado');
          return;
        }
        
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        
        setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
      };
      
      updateRemainingTime();
      const timer = setInterval(updateRemainingTime, 60000);
      
      return () => clearInterval(timer);
    }
  }, [activeChallenge, currentUser.id]);

  const handleNext = () => {
    setChallengeIndex((challengeIndex + 1) % WEEKLY_CHALLENGES.length);
    setActiveChallenge(WEEKLY_CHALLENGES[(challengeIndex + 1) % WEEKLY_CHALLENGES.length]);
    setNewPostContent('');
    setHasSubmitted(false);
  };

  const handlePrevious = () => {
    setChallengeIndex((challengeIndex - 1 + WEEKLY_CHALLENGES.length) % WEEKLY_CHALLENGES.length);
    setActiveChallenge(WEEKLY_CHALLENGES[(challengeIndex - 1 + WEEKLY_CHALLENGES.length) % WEEKLY_CHALLENGES.length]);
    setNewPostContent('');
    setHasSubmitted(false);
  };

  const handleSubmit = () => {
    if (!newPostContent.trim() || !activeChallenge) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Criar nova mentira com base no desafio
    const newPost: Omit<PostType, 'id' | 'createdAt'> = {
      userId: currentUser.id,
      content: newPostContent,
      tags: [activeChallenge.category, 'desafiosemanal'],
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
      userJudgements: {}
    };
    
    if (onPostSubmit) {
      onPostSubmit(newPost);
    }
    
    // Simular processamento
    setTimeout(() => {
      // Adicionar usuário à lista de participantes
      if (activeChallenge) {
        activeChallenge.participants.push(currentUser.id);
      }
      
      setIsSubmitting(false);
      setHasSubmitted(true);
      setNewPostContent('');
      
      // Mostrar alerta de sucesso
      alert('Sua mentira foi enviada para o desafio semanal!');
    }, 1500);
  };

  if (!activeChallenge) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
        <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Cabeçalho do Desafio */}
      <div className="bg-primary text-white p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Desafio Semanal</h3>
          <div className="flex items-center text-sm">
            <ClockIcon className="w-4 h-4 mr-1" />
            {timeRemaining}
          </div>
        </div>
      </div>
      
      {/* Corpo do Desafio */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevious}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            ← Anterior
          </button>
          <h4 className="text-xl font-bold text-center dark:text-white">
            {activeChallenge.title}
          </h4>
          <button
            onClick={handleNext}
            className="text-primary hover:text-primary-dark"
          >
            Próximo →
          </button>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <CalendarIcon className="w-4 h-4 mr-1" />
          <span>
            {formatDate(new Date(activeChallenge.startDate))} - {formatDate(new Date(activeChallenge.endDate))}
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
                <li>+50 pontos de experiência</li>
                <li>Chance de conquistar o troféu "Desafiante Semanal"</li>
                <li>Destaque na seção Tendências</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Área de Submissão */}
        {hasSubmitted ? (
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
                placeholder={`Escreva sua mentira sobre ${activeChallenge.title.toLowerCase()}...`}
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                maxLength={300}
              />
              <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                {newPostContent.length}/300 caracteres
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg disabled:opacity-50"
                onClick={handleSubmit}
                disabled={!newPostContent.trim() || isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Mentira'}
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
  );
};

export default WeeklyChallenge; 