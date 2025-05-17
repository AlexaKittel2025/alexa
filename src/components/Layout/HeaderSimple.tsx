'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaSearch, FaSignInAlt, FaUserPlus, FaBars, FaTimes, FaMoon, FaSun } from 'react-icons/fa';
import ThemeToggleSimple from '../ThemeToggleSimple';

export default function HeaderSimple() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
                Mentei
              </span>
              <span className="text-pink-500 dark:text-pink-400 ml-1 text-xl">App</span>
            </Link>
          </div>
          
          {/* Barra de pesquisa (desktop) */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <form className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar histórias..."
                className="form-input pl-10 py-2 pr-4 rounded-full w-full"
              />
            </form>
          </div>
          
          {/* Menu de navegação (desktop) */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link 
              href="/login" 
              className="nav-link flex items-center"
            >
              <FaSignInAlt className="mr-2" />
              <span>Entrar</span>
            </Link>
            
            <Link 
              href="/cadastro" 
              className="btn-gradient flex items-center text-sm"
            >
              <FaUserPlus className="mr-2" />
              <span>Cadastrar</span>
            </Link>
            
            <ThemeToggleSimple />
          </nav>
          
          {/* Menu mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">{isMenuOpen ? 'Fechar menu' : 'Abrir menu'}</span>
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" aria-hidden="true" />
              ) : (
                <FaBars className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-lg border-t dark:border-gray-700">
          <div className="px-4 py-3 space-y-3">
            {/* Barra de pesquisa mobile */}
            <form className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar histórias..."
                className="form-input pl-10 py-2 pr-4 rounded-full w-full"
              />
            </form>
            
            {/* Links de navegação */}
            <Link href="/login" className="flex items-center py-2 text-gray-700 dark:text-gray-200">
              <FaSignInAlt className="mr-3 text-purple-500 dark:text-purple-400" />
              <span>Entrar</span>
            </Link>
            
            <Link href="/cadastro" className="flex items-center py-2 text-gray-700 dark:text-gray-200">
              <FaUserPlus className="mr-3 text-purple-500 dark:text-purple-400" />
              <span>Cadastrar</span>
            </Link>
            
            {/* Controle de tema */}
            <div className="flex items-center justify-between py-2 border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
              <span className="text-gray-700 dark:text-gray-200">Alternar tema</span>
              <ThemeToggleSimple />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}