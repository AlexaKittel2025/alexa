'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';

interface InstagramLayoutProps {
  children: ReactNode;
}

export default function InstagramLayout({ children }: InstagramLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - Desktop */}
      <Sidebar />
      
      {/* Header - Mobile */}
      <Header />
      
      {/* Main Content */}
      <main className="md:pl-[72px] lg:pl-[244px] xl:pl-[275px]">
        <div className="mx-auto max-w-[935px] pt-[60px] md:pt-0">
          {children}
        </div>
      </main>
      
      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}