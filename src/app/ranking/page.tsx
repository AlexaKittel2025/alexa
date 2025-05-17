'use client';

import React, { useState } from 'react';
import { FaTrophy, FaMapMarkerAlt, FaUsers, FaChartLine } from 'react-icons/fa';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import UserRanking from '@/components/Ranking/UserRanking';
import LocalRanking from '@/components/Ranking/LocalRanking';

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState('global');

  return (
    <div className="space-y-8">
      <div className="card bg-gradient-to-r from-purple-600 to-pink-500 text-white">
        <div className="px-6 py-8 relative">
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white flex items-center">
              <FaTrophy className="mr-3" />
              Ranking de Mentirosos
            </h1>
            <p className="text-purple-100 max-w-xl mb-2">
              Confira os maiores mentirosos da plataforma e veja se você consegue chegar ao topo!
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('global')}
            className={`flex items-center px-6 py-4 ${
              activeTab === 'global'
                ? 'border-b-2 border-purple-600 font-semibold text-purple-600 dark:text-purple-400'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <FaUsers className="mr-2" />
            Ranking Global
          </button>
          <button
            onClick={() => setActiveTab('local')}
            className={`flex items-center px-6 py-4 ${
              activeTab === 'local'
                ? 'border-b-2 border-purple-600 font-semibold text-purple-600 dark:text-purple-400'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <FaMapMarkerAlt className="mr-2" />
            Ranking Local
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`flex items-center px-6 py-4 ${
              activeTab === 'trending'
                ? 'border-b-2 border-purple-600 font-semibold text-purple-600 dark:text-purple-400'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <FaChartLine className="mr-2" />
            Em Alta
          </button>
        </div>
      </div>
      
      <div>
        {activeTab === 'global' && <UserRanking />}
        {activeTab === 'local' && <LocalRanking />}
        {activeTab === 'trending' && (
          <div className="card p-8 flex flex-col items-center justify-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Em breve!</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              O ranking de mentirosos em alta estará disponível em breve.
            </p>
            <LoadingSpinner size="lg" color="primary" />
          </div>
        )}
      </div>
    </div>
  );
}