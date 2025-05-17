'use client';

import { PropsWithChildren } from 'react';
import HeaderSimple from './HeaderSimple';
import Footer from './Footer';
import Link from 'next/link';
import { FaFire, FaChartLine, FaClock, FaHashtag, FaTrophy, FaUsers } from 'react-icons/fa';

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <HeaderSimple />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar - Menu lateral (visível apenas em telas médias e grandes) */}
            <aside className="hidden md:block lg:col-span-3">
              <div className="sticky top-24 space-y-6">
                {/* Menu de navegação principal */}
                <div className="card overflow-hidden">
                  <h3 className="font-bold text-lg mb-4 px-1 flex items-center text-gray-900 dark:text-white">
                    <span className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center mr-2">
                      <FaFire className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                    </span>
                    Navegação
                  </h3>
                  
                  <nav>
                    <div className="space-y-1 -mx-2">
                      <Link href="/" className="flex items-center nav-link-active">
                        <FaClock className="mr-3 text-purple-500 dark:text-purple-400" />
                        <span>Início</span>
                      </Link>
                      
                      <Link href="/?filter=top" className="flex items-center nav-link">
                        <FaTrophy className="mr-3 text-gray-500 dark:text-gray-400" />
                        <span>Populares</span>
                      </Link>
                      
                      <Link href="/?filter=trending" className="flex items-center nav-link">
                        <FaChartLine className="mr-3 text-gray-500 dark:text-gray-400" />
                        <span>Em Alta</span>
                      </Link>
                      
                      <Link href="/explorar/tags" className="flex items-center nav-link">
                        <FaHashtag className="mr-3 text-gray-500 dark:text-gray-400" />
                        <span>Explorar Tags</span>
                      </Link>
                    </div>
                  </nav>
                </div>
                
                {/* Ranking de usuários */}
                <div className="card overflow-hidden">
                  <h3 className="font-bold text-lg mb-4 px-1 flex items-center text-gray-900 dark:text-white">
                    <span className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center mr-2">
                      <FaUsers className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                    </span>
                    Top Mentirosos
                  </h3>
                  
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((index) => (
                      <div key={index} className="flex items-center">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                            {index}
                          </div>
                        </div>
                        
                        <div className="ml-3 flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">
                            Usuário {index}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {(1000 - index * 100)} pontos
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <Link href="/ranking" className="btn-outline text-sm w-full">
                        Ver ranking completo
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Login required */}
                <div className="card bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <h3 className="font-bold text-xl mb-3">Participe agora!</h3>
                  <p className="text-white/90 mb-4">
                    Faça login para compartilhar suas próprias mentiras
                    e interagir com outros usuários.
                  </p>
                  
                  <div className="flex flex-col space-y-2">
                    <Link href="/login" className="btn bg-white/10 hover:bg-white/20 text-white border border-white/30">
                      Fazer login
                    </Link>
                    <Link href="/cadastro" className="btn bg-white text-purple-600 hover:bg-white/90">
                      Criar conta
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
            
            {/* Conteúdo principal */}
            <div className="lg:col-span-9">
              <div className="mb-6">
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}