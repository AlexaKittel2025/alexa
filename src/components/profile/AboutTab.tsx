;

;
import { HeartIcon } from '@heroicons/react/outline';
import React from 'react';
import { User } from '../../types';;;import { getUserLevel, getUserScore } from '@/utils/getUserLevel';

interface AboutTabProps {
  user: User;
}

const AboutTab: React.FC<AboutTabProps> = ({ user }) => {
  // Função para formatar data
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      
      return dateString;
    }
  };

  // Determinar localização
  const getLocationString = () => {
    if (typeof user.location === 'object' && user.location) {
      return `${user.location.city || ''}, ${user.location.state || ''}`.replace(/^,\s*|\s*,$/g, '');
    } else if (user.city && user.state) {
      return `${user.city}, ${user.state}`;
    } else if (user.city || user.state) {
      return user.city || user.state;
    }
    return null;
  };

  const relationshipStatus = user.relationship ? (
    <div className="flex items-center space-x-2 mb-4">
      <HeartIcon className="h-5 w-5 text-gray-500" />
      <span className="text-gray-700 dark:text-gray-300">{user.relationship}</span>
    </div>
  ) : null;

  const location = getLocationString();
  const locationInfo = location ? (
    <div className="flex items-center space-x-2 mb-4">
      <LocationMarkerIcon className="h-5 w-5 text-gray-500" />
      <span className="text-gray-700 dark:text-gray-300">{location}</span>
    </div>
  ) : null;

  const work = user.work ? (
    <div className="flex items-center space-x-2 mb-4">
      <BriefcaseIcon className="h-5 w-5 text-gray-500" />
      <span className="text-gray-700 dark:text-gray-300">{user.work}</span>
      {user.company && <span className="text-gray-500">na {user.company}</span>}
    </div>
  ) : null;

  const education = user.education ? (
    <div className="flex items-center space-x-2 mb-4">
      <AcademicCapIcon className="h-5 w-5 text-gray-500" />
      <span className="text-gray-700 dark:text-gray-300">{user.education}</span>
    </div>
  ) : null;

  const website = user.website ? (
    <div className="flex items-center space-x-2 mb-4">
      <LinkIcon className="h-5 w-5 text-gray-500" />
      <a 
        href={user.website.startsWith('http') ? user.website : `https://${user.website}`} 
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        {user.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
      </a>
    </div>
  ) : null;

  const joinDate = user.createdAt ? (
    <div className="flex items-center space-x-2 mb-4">
      <CalendarIcon className="h-5 w-5 text-gray-500" />
      <span className="text-gray-700 dark:text-gray-300">
        Ingressou em {formatDate(user.createdAt)}
      </span>
    </div>
  ) : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Sobre</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Biografia</h3>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
          {user.bio || "Este usuário ainda não adicionou uma biografia."}
        </p>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Informações Pessoais</h3>
        
        <div className="flex items-center space-x-2 mb-4">
          <UserIcon className="h-5 w-5 text-gray-500" />
          <span className="text-gray-700 dark:text-gray-300">{user.displayName}</span>
          <span className="text-sm text-gray-500">@{user.username}</span>
        </div>
        
        {relationshipStatus}
        {locationInfo}
        {work}
        {education}
        {website}
        {joinDate}
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Estatísticas</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="text-2xl font-bold text-primary">{user.postCount || 0}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Posts</div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="text-2xl font-bold text-primary">{user.stats?.battles || 0}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Batalhas</div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="text-2xl font-bold text-primary">{user.followers || 0}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Seguidores</div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="text-2xl font-bold text-primary">{user.following || 0}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Seguindo</div>
          </div>
        </div>
        
        <div className="mt-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">Nível</span>
            <span className="text-sm font-medium text-primary">
              {getUserLevel(user)}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${Math.min(((getUserLevel(user) || 0) % 5) / 5 * 100, 100)}%` }}
            ></div>
          </div>
          <div className="mt-1 text-xs text-right text-gray-500 dark:text-gray-400">
            {getUserScore(user)} pontos
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutTab; 