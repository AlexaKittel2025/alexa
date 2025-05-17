'use client';

import Link from 'next/link';
import { FaHome, FaSearch, FaPlus, FaHeart, FaUser } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="flex justify-around items-center h-12">
        <Link href="/" className="p-3">
          {pathname === '/' ? (
            <FaHome className="w-6 h-6 text-gray-900" />
          ) : (
            <FaHome className="w-6 h-6 text-gray-700" />
          )}
        </Link>
        
        <Link href="/search" className="p-3">
          <FaSearch className="w-6 h-6 text-gray-700" />
        </Link>
        
        <Link href="/nova-mentira" className="p-3">
          <FaPlus className="w-6 h-6 text-gray-700" />
        </Link>
        
        <Link href="/notificacoes" className="p-3">
          <FaHeart className="w-6 h-6 text-gray-700" />
        </Link>
        
        <Link href="/meu-perfil" className="p-3">
          {pathname === '/meu-perfil' ? (
            <FaUser className="w-6 h-6 text-gray-900" />
          ) : (
            <FaUser className="w-6 h-6 text-gray-700" />
          )}
        </Link>
      </div>
    </nav>
  );
}
