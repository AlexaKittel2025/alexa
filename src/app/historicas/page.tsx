'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaThumbsUp, FaComment, FaShare, FaExclamationTriangle, FaCrown, FaMedal, FaTrophy } from 'react-icons/fa';
import MainLayout from '@/components/Layout/MainLayout';

interface HistoricLie {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  tags: string[];
  rank: number;
}

export default function MentirasHistoricas() {
  const [filtroTempo, setFiltroTempo] = useState<'sempre' | 'ano' | 'mes' | 'semana'>('sempre');
  const [filtroCategorias, setFiltroCategorias] = useState<string[]>([]);

  // Dados mockados para mentiras históricas
  const mentirasHistoricas: HistoricLie[] = [
    {
      id: 'mentira_historia_1',
      user: {
        id: 'user123',
        name: 'Rodrigo Faro',
        avatar: 'https://i.pravatar.cc/150?img=3'
      },
      content: 'Ontem encontrei um ET no meu quintal. Ele veio me pedir uma xícara de açúcar e falou que os alienígenas estão entre nós há anos, mas só se manifestam para pessoas com aura dourada como a minha. Antes de ir embora, ele me ensinou a receita secreta do pão de queijo perfeito!',
      likes: 15472,
      comments: 5289,
      shares: 4321,
      createdAt: '2023-06-15T14:23:00Z',
      tags: ['extraterrestres', 'culinaria', 'segredos'],
      rank: 1
    },
    {
      id: 'mentira_historia_2',
      user: {
        id: 'user456',
        name: 'Marina Silva',
        avatar: 'https://i.pravatar.cc/150?img=5'
      },
      content: 'Acabei de inventar um dispositivo que transforma pensamentos em texto! Estou digitando esta mensagem apenas com o poder da mente. A tecnologia ainda está em fase de testes, mas já recebi propostas milionárias de várias empresas de tecnologia. Logo todos vão poder ter um!',
      likes: 12354,
      comments: 3721,
      shares: 2989,
      createdAt: '2023-09-23T18:42:00Z',
      tags: ['tecnologia', 'invenções', 'futuro'],
      rank: 2
    },
    {
      id: 'mentira_historia_3',
      user: {
        id: 'user789',
        name: 'Carlos Drummond',
        avatar: 'https://i.pravatar.cc/150?img=12'
      },
      content: 'Eu tenho um tio que trabalha na Nintendo e ele me contou que o próximo Super Mario vai se passar no Brasil! O Mario vai trocar o encanamento por caipirinha, andar de havaianas, e o Bowser vai virar um jacaré do pantanal. Vai ter fase no Cristo Redentor e tudo mais! Meu tio me mostrou os desenhos ontem.',
      likes: 10987,
      comments: 3456,
      shares: 2873,
      createdAt: '2023-11-12T21:15:00Z',
      tags: ['games', 'brasil', 'nintendo'],
      rank: 3
    },
    {
      id: 'mentira_historia_4',
      user: {
        id: 'user101',
        name: 'Luciana Gimenez',
        avatar: 'https://i.pravatar.cc/150?img=9'
      },
      content: 'Estava nadando no mar de Copacabana quando fui levada por uma onda gigante. Achei que ia me afogar, mas fui salva por um cardume de golfinhos que me carregaram até a praia. Um deles até falou comigo em português claro: "Cuidado com as ondas, querida!". Ninguém acredita, mas tenho um vídeo... que infelizmente perdi quando meu celular caiu na água.',
      likes: 9876,
      comments: 2935,
      shares: 2154,
      createdAt: '2024-01-07T16:28:00Z',
      tags: ['animais', 'praia', 'milagre'],
      rank: 4
    },
    {
      id: 'mentira_historia_5',
      user: {
        id: 'user112',
        name: 'Fernando Pessoa',
        avatar: 'https://i.pravatar.cc/150?img=11'
      },
      content: 'Descobri que tenho um superpoder: consigo sentir o gosto de qualquer comida apenas olhando para ela em fotos! Acabei de provar (com a mente) um prato de sushi do Japão através de uma foto no Instagram. O wasabi estava muito forte. Estou pensando em usar esse poder para me tornar crítico gastronômico internacional sem sair de casa.',
      likes: 8543,
      comments: 2167,
      shares: 1896,
      createdAt: '2024-02-19T11:45:00Z',
      tags: ['superpoderes', 'gastronomia', 'sensorial'],
      rank: 5
    }
  ];

  // Função para renderizar o ícone de classificação
  const renderRankIcon = (rank: number) => {
    switch(rank) {
      case 1:
        return <FaTrophy className="text-yellow-500" size={24} />;
      case 2:
        return <FaMedal className="text-gray-400" size={24} />;
      case 3:
        return <FaMedal className="text-amber-700" size={24} />;
      default:
        return <span className="font-bold text-xl">{rank}</span>;
    }
  };

  return (
    <MainLayout>
      <div className="w-full max-w-4xl mx-auto py-6 px-4">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
            <FaCrown className="inline-block mr-2 text-yellow-500" />
            Hall da Fama das Mentiras
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-center max-w-xl">
            Aqui estão as mentiras mais criativas, engraçadas e populares de todos os tempos. O verdadeiro Olimpo da imaginação!
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div>
              <h3 className="text-lg font-medium mb-2">Período:</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFiltroTempo('sempre')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filtroTempo === 'sempre' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  De todos os tempos
                </button>
                <button
                  onClick={() => setFiltroTempo('ano')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filtroTempo === 'ano' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Este ano
                </button>
                <button
                  onClick={() => setFiltroTempo('mes')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filtroTempo === 'mes' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Este mês
                </button>
                <button
                  onClick={() => setFiltroTempo('semana')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filtroTempo === 'semana' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Esta semana
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de mentiras históricas */}
        <div className="space-y-6">
          {mentirasHistoricas.map((mentira) => (
            <div key={mentira.id} className="mentira-card flex">
              <div className="flex-shrink-0 p-4 flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-l-xl min-w-16">
                {renderRankIcon(mentira.rank)}
                <span className="text-xs font-semibold uppercase mt-1">
                  {mentira.rank === 1 ? 'Ouro' : mentira.rank === 2 ? 'Prata' : mentira.rank === 3 ? 'Bronze' : `Top ${mentira.rank}`}
                </span>
              </div>
            
              <div className="flex-1">
                <div className="mentira-card-header flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={mentira.user.avatar}
                      alt={mentira.user.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <Link href={`/perfil/${mentira.user.id}`} className="font-semibold hover:underline">
                        {mentira.user.name}
                      </Link>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(mentira.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mentira-card-body">
                  <p className="text-lg">{mentira.content}</p>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {mentira.tags.map(tag => (
                      <Link href={`/tag/${tag}`} key={tag} className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800">
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
                
                <div className="mentira-card-footer flex justify-between">
                  <div className="flex space-x-6">
                    <span className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
                      <FaThumbsUp />
                      <span>{mentira.likes.toLocaleString('pt-BR')}</span>
                    </span>
                    <Link href={`/mentira/${mentira.id}`} className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
                      <FaComment />
                      <span>{mentira.comments.toLocaleString('pt-BR')}</span>
                    </Link>
                    <span className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
                      <FaShare />
                      <span>{mentira.shares.toLocaleString('pt-BR')}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
} 