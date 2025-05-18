'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaHome, FaHeart, FaPlus, FaComment } from 'react-icons/fa';
import { FaHome as FaHomeSolid } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import MessageIndicator from './MessageIndicator';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 md:hidden transition-colors">
      <div className="px-4">
        <div className="flex items-center justify-between h-[60px]">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
              Mentei
            </h1>
          </Link>

          {/* Navigation Icons */}
          <nav className="flex items-center gap-6">
            <Link href="/" className="p-1 hover:scale-110 transition-transform">
              <FaHome className="w-6 h-6 text-gray-900 dark:text-gray-100" />
            </Link>
            
            <Link href="/notificacoes" className="p-1 relative hover:scale-110 transition-transform">
              <FaHeart className="w-6 h-6 text-gray-900 dark:text-gray-100" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </Link>
            
            <Link href="/chat" className="p-1 relative hover:scale-110 transition-transform">
              <FaComment className="w-6 h-6 text-gray-900 dark:text-gray-100" />
              <MessageIndicator />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
