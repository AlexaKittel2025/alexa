'use client';

import { PropsWithChildren } from 'react';
import HeaderSimple from './HeaderSimple';
import Footer from './Footer';

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <HeaderSimple />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Conteúdo principal sem sidebar */}
          <div className="w-full">
            {children}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}