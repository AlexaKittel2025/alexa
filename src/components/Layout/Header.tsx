'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaHome, FaSearch, FaHeart, FaPlus, FaComment } from 'react-icons/fa';
import { FaHome as FaHomeSolid } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 md:hidden">
      <div className="px-4">
        <div className="flex items-center justify-between h-[60px]">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-2xl font-bold">
              Mentei
            </h1>
          </Link>

          {/* Navigation Icons */}
          <nav className="flex items-center gap-6">
            <Link href="/nova-mentira" className="p-1">
              <FaPlus className="w-6 h-6 text-gray-900" />
            </Link>
            
            <Link href="/notificacoes" className="p-1 relative">
              <FaHeart className="w-6 h-6 text-gray-900" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>
            
            <Link href="/chat" className="p-1">
              <FaComment className="w-6 h-6 text-gray-900" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
