'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="relative inline-flex">
          <div className="w-12 h-12 bg-purple-600 rounded-full"></div>
          <div className="w-12 h-12 bg-purple-600 rounded-full absolute top-0 left-0 animate-ping"></div>
          <div className="w-12 h-12 bg-purple-600 rounded-full absolute top-0 left-0 animate-pulse"></div>
        </div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
      </div>
    </div>
  );
}