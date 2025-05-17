'use client';

import { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { FaCalendarAlt, FaClock, FaFire, FaTrophy, FaSpaceShuttle, FaGift, FaCrown, FaUserFriends } from 'react-icons/fa';

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  icon: React.ReactNode;
  color: string;
  rewards: string[];
  isActive: boolean;
}

export default function EventosPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Evento atual (simulado)
  const currentDate = new Date();
  
  // Eventos futuros e passados
  const eventos: Event[] = [
    {
      id: 'semana-alien',
      title: 'Semana do Alien',
      description: 'Poste as mentiras mais absurdas sobre encontros com ETs e ganhe recompensas extras! Garanta que sua história seja a mais impossível.',
      startDate: new Date(currentDate.getTime() - 1000 * 60 * 60 * 24 * 2), // 2 dias atrás
      endDate: new Date(currentDate.getTime() + 1000 * 60 * 60 * 24 * 5), // 5 dias no futuro
      icon: <FaSpaceShuttle className="text-green-500" />,
      color: 'green',
      rewards: ['Emblema exclusivo "Amigo dos ETs"', 'Duplo de pontos nas reações', 'Destaque especial no feed'],
      isActive: true
    },
    {
      id: 'torneio-master',
      title: 'Torneio Mentiroso Master',
      description: 'Um torneio especial com fase de grupos e eliminatórias. Os vencedores ganham emblemas exclusivos e seus perfis terão efeitos visuais especiais por 30 dias.',
      startDate: new Date(currentDate.getTime() + 1000 * 60 * 60 * 24 * 10), // 10 dias no futuro
      endDate: new Date(currentDate.getTime() + 1000 * 60 * 60 * 24 * 17), // 17 dias no futuro
      icon: <FaTrophy className="text-yellow-500" />,
      color: 'yellow',
      rewards: ['Coroa animada no perfil (30 dias)', '1000 moedas para o vencedor', 'Título "Mentiroso Master"'],
      isActive: false
    },
    {
      id: 'dia-verdade',
      title: 'Dia da Mentira Proibida',
      description: 'Neste dia especial, os usuários devem postar apenas verdades. A comunidade vota para decidir se o post é realmente verdadeiro ou se é uma mentira disfarçada.',
      startDate: new Date(currentDate.getTime() + 1000 * 60 * 60 * 24 * 20), // 20 dias no futuro
      endDate: new Date(currentDate.getTime() + 1000 * 60 * 60 * 24 * 21), // 21 dias no futuro
      icon: <FaClock className="text-purple-500" />,
      color: 'purple',
      rewards: ['Emblema "Detetive da Verdade"', 'Pontos extras por acertar', 'Destaque no ranking especial'],
      isActive: false
    },
    {
      id: 'campeonato-fanfic',
      title: 'Campeonato Nacional de Fanfic',
      description: 'Um evento de uma semana para premiar as mentiras mais elaboradas e criativas. Jurados convidados ajudarão a escolher os vencedores.',
      startDate: new Date(currentDate.getTime() + 1000 * 60 * 60 * 24 * 30), // 30 dias no futuro
      endDate: new Date(currentDate.getTime() + 1000 * 60 * 60 * 24 * 37), // 37 dias no futuro
      icon: <FaCrown className="text-indigo-500" />,
      color: 'indigo',
      rewards: ['Prêmios em dinheiro real', 'Badge exclusivo permanente', 'Destaque na home por 1 mês'],
      isActive: false
    },
    {
      id: 'evento-passado',
      title: 'Festival de Histórias de Ex',
      description: 'Evento dedicado às mentiras mais criativas sobre relacionamentos passados. Quanto mais absurda, melhor!',
      startDate: new Date(currentDate.getTime() - 1000 * 60 * 60 * 24 * 30), // 30 dias atrás
      endDate: new Date(currentDate.getTime() - 1000 * 60 * 60 * 24 * 23), // 23 dias atrás
      icon: <FaUserFriends className="text-red-500" />,
      color: 'red',
      rewards: ['Emblema "Coração Partido"', 'Efeito de lágrimas no perfil', '500 moedas para os melhores'],
      isActive: false
    }
  ];
  
  const getStatusColor = (event: Event) => {
    if (event.isActive) return 'bg-green-500';
    
    const now = new Date();
    if (event.endDate < now) return 'bg-gray-400'; // Passado
    if (event.startDate > now) return 'bg-blue-500'; // Futuro
    
    return 'bg-gray-400';
  };
  
  const getStatusText = (event: Event) => {
    if (event.isActive) return 'ATIVO';
    
    const now = new Date();
    if (event.endDate < now) return 'ENCERRADO';
    if (event.startDate > now) return 'EM BREVE';
    
    return 'INATIVO';
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  const getDaysRemaining = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6">
          <FaCalendarAlt className="text-purple-600 text-2xl mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">Calendário de Eventos</h1>
        </div>
        
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6 rounded-r-lg">
          <h2 className="font-bold text-purple-800 mb-1">Sobre os eventos especiais</h2>
          <p className="text-gray-700">
            Eventos temáticos onde você pode ganhar recompensas exclusivas, moedas extras e emblemas especiais!
            Participe e destaque-se com suas mentiras mais criativas.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Lista de Eventos */}
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FaFire className="text-orange-500 mr-2" />
              Eventos Programados
            </h2>
            
            <div className="space-y-4">
              {eventos.map((evento) => (
                <div 
                  key={evento.id}
                  onClick={() => handleEventClick(evento)}
                  className={`p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow ${
                    selectedEvent?.id === evento.id ? 'border-' + evento.color + '-500 bg-' + evento.color + '-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-full bg-${evento.color}-100 flex items-center justify-center mr-3`}>
                        {evento.icon}
                      </div>
                      <h3 className="font-semibold text-gray-800">{evento.title}</h3>
                    </div>
                    
                    <div className="flex items-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(evento)}`}>
                        {getStatusText(evento)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <FaCalendarAlt className="mr-1" />
                    <span>
                      {formatDate(evento.startDate)} - {formatDate(evento.endDate)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {evento.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            {/* Detalhes do evento selecionado */}
            {selectedEvent ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
                <div className={`bg-${selectedEvent.color}-500 text-white p-4`}>
                  <h3 className="text-lg font-semibold flex items-center">
                    {selectedEvent.icon}
                    <span className="ml-2">{selectedEvent.title}</span>
                  </h3>
                  
                  <div className="flex items-center mt-2 text-sm">
                    <FaCalendarAlt className="mr-1" />
                    <span>
                      {formatDate(selectedEvent.startDate)} - {formatDate(selectedEvent.endDate)}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="text-gray-700 mb-4">
                    {selectedEvent.description}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-800 mb-2">Recompensas:</h4>
                    <ul className="space-y-1">
                      {selectedEvent.rewards.map((reward, index) => (
                        <li key={index} className="flex items-start">
                          <FaGift className={`text-${selectedEvent.color}-500 mt-1 mr-2 flex-shrink-0`} />
                          <span className="text-gray-600">{reward}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {selectedEvent.isActive ? (
                    <div className="bg-green-50 text-green-700 p-3 rounded-lg">
                      <p className="font-medium">Este evento está ativo!</p>
                      <p className="text-sm">Termina em {getDaysRemaining(selectedEvent.endDate)} dias</p>
                    </div>
                  ) : selectedEvent.startDate > new Date() ? (
                    <div className="bg-blue-50 text-blue-700 p-3 rounded-lg">
                      <p className="font-medium">Este evento começará em breve!</p>
                      <p className="text-sm">Começa em {getDaysRemaining(selectedEvent.startDate)} dias</p>
                    </div>
                  ) : (
                    <div className="bg-gray-100 text-gray-700 p-3 rounded-lg">
                      <p className="font-medium">Este evento já foi encerrado</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <FaCalendarAlt className="text-gray-400 text-5xl mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Selecione um evento</h3>
                <p className="text-gray-500 text-sm">
                  Clique em um dos eventos ao lado para ver mais detalhes e informações sobre recompensas.
                </p>
              </div>
            )}
            
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-semibold text-gray-800 mb-3">Próximo evento:</h3>
              
              {eventos.filter(e => e.startDate > new Date()).sort((a, b) => a.startDate.getTime() - b.startDate.getTime())[0] ? (
                <div>
                  <div className="flex items-center">
                    <div className={`h-10 w-10 rounded-full bg-${eventos.filter(e => e.startDate > new Date()).sort((a, b) => a.startDate.getTime() - b.startDate.getTime())[0].color}-100 flex items-center justify-center mr-3`}>
                      {eventos.filter(e => e.startDate > new Date()).sort((a, b) => a.startDate.getTime() - b.startDate.getTime())[0].icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{eventos.filter(e => e.startDate > new Date()).sort((a, b) => a.startDate.getTime() - b.startDate.getTime())[0].title}</h4>
                      <p className="text-sm text-gray-500">
                        Começa em {getDaysRemaining(eventos.filter(e => e.startDate > new Date()).sort((a, b) => a.startDate.getTime() - b.startDate.getTime())[0].startDate)} dias
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center">Nenhum evento programado</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 