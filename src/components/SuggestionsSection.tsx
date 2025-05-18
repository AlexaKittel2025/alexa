import React from 'react';
import Link from 'next/link';
import { FaUserPlus, FaStar, FaTrophy } from 'react-icons/fa';

export default function SuggestionsSection() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bem-vindo ao Mentei!</h3>
      
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
        A rede social onde você compartilha suas mentiras mais criativas e compete com outros usuários!
      </p>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <FaUserPlus className="text-purple-600 dark:text-purple-400 mt-1" />
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Siga outros mentirosos</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Conecte-se com pessoas criativas
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <FaStar className="text-yellow-500 dark:text-yellow-400 mt-1" />
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Ganhe pontos</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Suas mentiras criativas valem pontos
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <FaTrophy className="text-purple-600 dark:text-purple-400 mt-1" />
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Suba no ranking</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Torne-se o mentiroso mais criativo
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex flex-col gap-3">
        <Link 
          href="/nova-mentira"
          className="block w-full text-center bg-purple-600 text-white py-2.5 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
        >
          Criar primeira mentira
        </Link>
        
        <Link 
          href="/explorar"
          className="block w-full text-center bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-2.5 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
        >
          Explorar mentiras
        </Link>
      </div>
    </div>
  );
}