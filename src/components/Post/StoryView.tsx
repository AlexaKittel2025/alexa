'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaForward, FaBackward, FaTimes, FaShareAlt, FaHeart } from 'react-icons/fa';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Story {
  id: string;
  content: string;
  imageUrl: string | null;
  videoUrl: string | null;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
  createdAt: Date;
  expiresAt: Date;
  likes: number;
}

interface StoryViewProps {
  initialStoryId?: string;
  onClose?: () => void;
}

export default function StoryView({ initialStoryId, onClose }: StoryViewProps) {
  const [stories, setStories] = useState<Story[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        // Buscar histórias da API
        const response = await fetch('/api/stories');
        
        if (!response.ok) {
          throw new Error('Erro ao buscar histórias');
        }
        
        const data = await response.json();
        
        if (data.stories.length === 0) {
          setError('Nenhuma história disponível');
          setIsLoading(false);
          return;
        }
        
        setStories(data.stories);
        
        // Se um ID inicial foi fornecido, configurar o índice atual
        if (initialStoryId) {
          const storyIndex = data.stories.findIndex((story: Story) => story.id === initialStoryId);
          if (storyIndex >= 0) {
            setCurrentIndex(storyIndex);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        
        setError('Não foi possível carregar as histórias');
        setIsLoading(false);
      }
    };

    fetchStories();
  }, [initialStoryId]);

  useEffect(() => {
    // Iniciar o temporizador quando as histórias são carregadas
    if (stories.length > 0 && !isLoading) {
      startProgress();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [stories, currentIndex, isLoading]);

  const startProgress = () => {
    // Limpar qualquer intervalo existente
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setProgress(0);
    
    // Criar novo intervalo para atualizar o progresso
    const duration = 5000; // 5 segundos por história
    const step = 100 / (duration / 100); // Incremento para atualização a cada 100ms
    
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          goToNextStory();
          return 0;
        }
        return prev + step;
      });
    }, 100);
  };

  const goToNextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setLiked(false);
    } else {
      // Se for a última história, fechar o visualizador
      handleClose();
    }
  };

  const goToPrevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setLiked(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.push('/');
    }
  };

  const toggleLike = async () => {
    if (!stories[currentIndex]) return;
    
    setLiked(prev => !prev);
    
    try {
      // Enviar like para a API
      await fetch(`/api/stories/${stories[currentIndex].id}/like`, {
        method: 'POST',
      });
    } catch (error) {
      
    }
  };
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error || stories.length === 0) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 text-white p-4">
        <p className="text-center mb-4">{error || 'Não há histórias disponíveis no momento.'}</p>
        <button 
          onClick={handleClose}
          className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
        >
          Voltar
        </button>
      </div>
    );
  }
  
  const currentStory = stories[currentIndex];
  const timeAgo = formatDistanceToNow(currentStory.createdAt, { addSuffix: true, locale: ptBR });

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between text-white bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center overflow-hidden">
            {currentStory.author?.image ? (
              <img 
                src={currentStory.author.image} 
                alt={currentStory.author.name || 'Usuário'} 
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUser />
            )}
          </div>
          <div>
            <Link href={`/perfil/${currentStory.author?.id}`} className="font-semibold hover:underline">
              {currentStory.author?.name || 'Usuário anônimo'}
            </Link>
            <p className="text-xs opacity-80">{timeAgo}</p>
          </div>
        </div>
        <button 
          onClick={handleClose}
          className="text-white p-2 rounded-full hover:bg-white/20"
        >
          <FaTimes />
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 flex space-x-1 p-2 z-10">
        {stories.map((_, index) => (
          <div key={index} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
            {index === currentIndex && (
              <div 
                className="h-full bg-white transition-all duration-100 ease-linear" 
                style={{ width: `${progress}%` }} 
              />
            )}
            {index < currentIndex && (
              <div className="h-full bg-white w-full" />
            )}
          </div>
        ))}
      </div>
      
      {/* Story content */}
      <div className="flex-1 flex items-center justify-center">
        {currentStory.imageUrl ? (
          <img
            src={currentStory.imageUrl}
            alt="História"
            className="max-h-full max-w-full object-contain"
          />
        ) : currentStory.videoUrl ? (
          <video
            src={currentStory.videoUrl}
            autoPlay
            playsInline
            muted
            loop
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="p-6 max-w-lg bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-white">
            <p className="text-xl">{currentStory.content}</p>
          </div>
        )}
      </div>
      
      {/* Navigation controls - invisible buttons on left/right sides */}
      <button
        className="absolute top-0 bottom-0 left-0 w-1/3 h-full opacity-0"
        onClick={goToPrevStory}
        disabled={currentIndex === 0}
      />
      <button
        className="absolute top-0 bottom-0 right-0 w-1/3 h-full opacity-0"
        onClick={goToNextStory}
      />
      
      {/* Footer */}
      <div className="px-4 py-3 flex items-center justify-between text-white bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 right-0 z-10">
        <div>
          <span className="text-sm">
            {currentIndex + 1}/{stories.length}
          </span>
        </div>
        
        <div className="flex space-x-4">
          <button 
            onClick={toggleLike}
            className={`p-2 rounded-full ${liked ? 'text-red-500' : 'text-white'} hover:bg-white/20`}
          >
            <FaHeart />
          </button>
          <button 
            className="p-2 rounded-full text-white hover:bg-white/20"
          >
            <FaShareAlt />
          </button>
        </div>
      </div>
      
      {/* Navigation indicators */}
      {currentIndex > 0 && (
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white">
          <button
            onClick={goToPrevStory}
            className="p-2 rounded-full bg-black/30 hover:bg-black/50"
          >
            <FaBackward />
          </button>
        </div>
      )}
      
      {currentIndex < stories.length - 1 && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white">
          <button
            onClick={goToNextStory}
            className="p-2 rounded-full bg-black/30 hover:bg-black/50"
          >
            <FaForward />
          </button>
        </div>
      )}
    </div>
  );
} 