'use client';

import Link from 'next/link';
import { FaInstagram, FaTwitter, FaFacebook, FaGithub, FaDiscord } from 'react-icons/fa';

export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-12 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center text-gray-900 dark:text-white">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
                Mentei
              </span>
              <span className="text-pink-500 dark:text-pink-400 ml-1">App</span>
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              A rede social onde você pode compartilhar suas melhores histórias inventadas
              e se divertir com as mentiras dos outros usuários.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors">
                <FaDiscord size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
              Navegação
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                  Página Inicial
                </Link>
              </li>
              <li>
                <Link href="/ranking" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                  Ranking
                </Link>
              </li>
              <li>
                <Link href="/batalhas" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                  Batalhas
                </Link>
              </li>
              <li>
                <Link href="/explorar/tags" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                  Explorar Tags
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
              Recursos
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/plano-pro" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                  Plano Pro
                </Link>
              </li>
              <li>
                <Link href="/nova-mentira" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                  Criar Mentira
                </Link>
              </li>
              <li>
                <Link href="/chat" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                  Chat Global
                </Link>
              </li>
              <li>
                <Link href="/historicas" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                  Mentiras Históricas
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
              Informações
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/sobre" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/termos" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                  Contato
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            &copy; {year} Mentei App. Todos os direitos reservados.
          </p>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/termos" className="text-gray-500 dark:text-gray-400 text-sm hover:text-gray-700 dark:hover:text-gray-300">
              Termos
            </Link>
            <Link href="/privacidade" className="text-gray-500 dark:text-gray-400 text-sm hover:text-gray-700 dark:hover:text-gray-300">
              Privacidade
            </Link>
            <Link href="/cookies" className="text-gray-500 dark:text-gray-400 text-sm hover:text-gray-700 dark:hover:text-gray-300">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}