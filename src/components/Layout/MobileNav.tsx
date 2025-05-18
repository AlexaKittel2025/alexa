'use client';

import Link from 'next/link';
import { FaHome, FaCompass, FaPlus, FaHeart, FaUser } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 md:hidden transition-colors">
      <div className="flex justify-around items-center h-12">
        <Link href="/" className="p-3 transition-transform hover:scale-110">
          {pathname === '/' ? (
            <FaHome className="w-6 h-6 text-gray-900 dark:text-white animate-pulse" />
          ) : (
            <FaHome className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          )}
        </Link>
        
        <Link href="/explorar" className="p-3 transition-transform hover:scale-110">
          <FaCompass className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </Link>
        
        <Link href="/nova-mentira" className="p-3 transition-transform hover:scale-110">
          <FaPlus className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </Link>
        
        <Link href="/notificacoes" className="p-3 transition-transform hover:scale-110">
          <FaHeart className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </Link>
        
        <Link href="/meu-perfil" className="p-3 transition-transform hover:scale-110">
          {pathname === '/meu-perfil' ? (
            <FaUser className="w-6 h-6 text-gray-900 dark:text-white animate-pulse" />
          ) : (
            <FaUser className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          )}
        </Link>
      </div>
    </nav>
  );
}
