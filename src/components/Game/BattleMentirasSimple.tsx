'use client';

import { useState, useEffect } from 'react';
import { FaCrown, FaTrophy, FaFire, FaDice, FaHistory, FaSwords, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function BattleMentirasSimple() {
  const [currentBattle, setCurrentBattle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
          Arena de Batalhas
        </h2>
        <div className="flex justify-center items-center py-12">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text flex items-center justify-center">
          <FaTrophy className="text-yellow-500 mr-3" /> 
          Arena de Batalhas
        </h2>
        
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4 text-lg">
            Testando batalhas - componente simplificado
          </p>
        </div>
      </div>
    </div>
  );
}