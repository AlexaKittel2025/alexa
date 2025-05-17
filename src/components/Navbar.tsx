'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaHome, FaUser, FaTrophy, FaComments, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

export default function Navbar() {
  // Temporariamente removendo autenticação
  const user = null; // Simulando usuário não logado
  const loading = false;
  
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Feche o menu quando a rota mudar
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg md:relative md:bottom-auto md:border-t-0 md:border-b md:shadow-sm z-10">
      <div className="container mx-auto md:px-4">
        <div className="flex justify-around md:justify-center md:space-x-8 py-2">
          {/* Botões de navegação */}
          <Link
            href="/"
            className={`text-center flex flex-col items-center px-1 ${
              pathname === '/' ? 'text-purple-700' : 'text-gray-600 hover:text-purple-700'
            }`}
          >
            <FaHome className="text-xl mb-1" />
            <span className="text-xs">Início</span>
          </Link>

          <Link
            href="/ranking"
            className={`text-center flex flex-col items-center px-1 ${
              pathname === '/ranking' ? 'text-purple-700' : 'text-gray-600 hover:text-purple-700'
            }`}
          >
            <FaTrophy className="text-xl mb-1" />
            <span className="text-xs">Ranking</span>
          </Link>

          <Link
            href="/chat"
            className={`text-center flex flex-col items-center px-1 ${
              pathname === '/chat' ? 'text-purple-700' : 'text-gray-600 hover:text-purple-700'
            }`}
          >
            <FaComments className="text-xl mb-1" />
            <span className="text-xs">Chat</span>
          </Link>

          {user ? (
            <Link
              href="/perfil"
              className={`text-center flex flex-col items-center px-1 ${
                pathname === '/perfil' ? 'text-purple-700' : 'text-gray-600 hover:text-purple-700'
              }`}
            >
              <FaUser className="text-xl mb-1" />
              <span className="text-xs">Perfil</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className={`text-center flex flex-col items-center px-1 ${
                pathname === '/login' ? 'text-purple-700' : 'text-gray-600 hover:text-purple-700'
              }`}
            >
              <FaSignInAlt className="text-xl mb-1" />
              <span className="text-xs">Entrar</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
} 