import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Mentei<span className="text-primary">!</span></h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              A melhor rede social para compartilhar mentiras criativas e se divertir com amigos.
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Mentei! - Todos os direitos reservados
            </p>
          </div>
          
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
                  Página Inicial
                </Link>
              </li>
              <li>
                <Link to="/battles" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
                  Batalhas
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
                  Chat Global
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/profile" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
                  Meu Perfil
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
                  Configurações
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
                  Assinar PRO
                </a>
              </li>
            </ul>
          </div>
          
          <div className="w-full md:w-1/4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Sobre</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
                  Contato
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 