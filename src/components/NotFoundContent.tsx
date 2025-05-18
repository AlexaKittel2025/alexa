;

;
import { ArrowLeftIcon } from '@heroicons/react/outline';
import React from 'react';
import { Link } from 'react-router-dom';interface NotFoundContentProps {
  title?: string;
  message?: string;
  backLink?: string;
  backText?: string;
}

const NotFoundContent: React.FC<NotFoundContentProps> = ({
  title = 'Página não encontrada',
  message = 'A página que você está procurando não existe ou foi movida.',
  backLink = '/',
  backText = 'Voltar para a Página Inicial'
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[50vh]">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
        {title}
      </h1>
      
      <p className="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-md">
        {message}
      </p>
      
      <Link 
        to={backLink}
        className="inline-flex items-center px-5 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        {backText}
      </Link>
    </div>
  );
};

export default NotFoundContent; 