import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  message,
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        <div className={`absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full`}></div>
        <div className={`absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin`}></div>
      </div>
      {message && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{message}</p>
      )}
    </div>
  );
};

// Componente de página de carregamento
export const LoadingPage: React.FC<{ message?: string }> = ({ message = 'Carregando...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="large" message={message} />
    </div>
  );
};

// Componente de overlay de carregamento
export const LoadingOverlay: React.FC<{ isLoading: boolean; message?: string }> = ({ isLoading, message }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <LoadingSpinner size="medium" message={message} />
      </div>
    </div>
  );
};

export default LoadingSpinner;