'use client';

import React, { useState, useEffect } from 'react';

interface BannerAnimationProps {
  className?: string;
}

const BannerAnimation: React.FC<BannerAnimationProps> = ({ className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <div 
        className={`
          bg-gradient-to-r from-purple-600 to-pink-500 
          p-6 transform transition-all duration-700 ease-out
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
        `}
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-20 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative">
          <h2 className="text-2xl font-bold text-white mb-2">
            Bem-vindo ao Mentei App!
          </h2>
          <p className="text-purple-100 max-w-lg">
            Compartilhe suas melhores histórias inventadas, vote nas mais criativas, 
            e tenha diversão garantida com as mentiras mais épicas da internet.
          </p>
          
          <div className="mt-4 flex space-x-3">
            <button className="bg-white text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-md font-medium transition-colors">
              Começar
            </button>
            <button className="bg-transparent border border-white text-white hover:bg-white/10 px-4 py-2 rounded-md font-medium transition-colors">
              Saiba mais
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerAnimation;