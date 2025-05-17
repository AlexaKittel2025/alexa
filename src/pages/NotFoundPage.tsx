import React from 'react';
import { useLocation } from 'react-router-dom';
import NotFoundContent from '../components/NotFoundContent';

const NotFoundPage: React.FC = () => {
  const location = useLocation();
  const isUserProfilePath = location.pathname.startsWith('/profile/');
  const username = isUserProfilePath ? location.pathname.split('/').pop() : '';

  if (isUserProfilePath) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <NotFoundContent 
            title="Usuário não encontrado"
            message={`O usuário @${username} não existe ou não está disponível.`}
            backLink="/"
            backText="Voltar para a Página Inicial"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <NotFoundContent />
      </div>
    </div>
  );
};

export default NotFoundPage; 