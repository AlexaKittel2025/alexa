'use client';

import InstagramPost from '@/components/Post/InstagramPost';
import { useState } from 'react';

// Mock data - substituir por dados reais da API
const mockPosts = [
  {
    id: '1',
    user: {
      id: '1',
      name: 'João Silva',
      username: 'joaosilva',
      avatar: '/images/avatar-placeholder.jpg'
    },
    content: 'Acabei de chegar em casa e meu cachorro já tinha arrumado toda a casa. Até a cama estava feita! 🐕✨',
    image: '/images/post-placeholder.jpg',
    likes: 1234,
    comments: 56,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
    likedByMe: false,
    saved: false
  },
  {
    id: '2',
    user: {
      id: '2',
      name: 'Maria Santos',
      username: 'mariasantos',
      avatar: '/images/avatar-placeholder.jpg'
    },
    content: 'Fui ao supermercado e encontrei um unicórnio no corredor de cereais. Ele estava escolhendo sucrilhos 🦄🥣',
    likes: 789,
    comments: 23,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 horas atrás
    likedByMe: true,
    saved: true
  },
  {
    id: '3',
    user: {
      id: '3',
      name: 'Pedro Costa',
      username: 'pedrocosta',
      avatar: '/images/avatar-placeholder.jpg'
    },
    content: 'Ontem à noite vi meu vizinho voando pela janela. Descobri que ele é o Super-Homem! 🦸‍♂️',
    image: '/images/post-placeholder.jpg',
    likes: 456,
    comments: 12,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
    likedByMe: false,
    saved: false
  }
];

export default function HomePage() {
  const [posts] = useState(mockPosts);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[470px] py-8 px-4">
        {/* Stories - Futuro componente */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex gap-4 overflow-x-auto">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 p-0.5">
                  <div className="w-full h-full bg-white rounded-full p-0.5">
                    <div className="w-full h-full rounded-full bg-gray-200"></div>
                  </div>
                </div>
                <p className="text-xs text-center mt-1">Story {i}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feed de posts */}
        <div>
          {posts.map((post) => (
            <InstagramPost key={post.id} post={post} />
          ))}
        </div>
      </div>

      {/* Sidebar direita - Sugestões (apenas desktop) */}
      <aside className="hidden xl:block w-[320px] py-8 ml-8">
        <div className="fixed w-[320px]">
          {/* Perfil do usuário atual */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gray-200"></div>
              <div>
                <p className="font-semibold text-sm">meuusuario</p>
                <p className="text-sm text-gray-500">Meu Nome</p>
              </div>
            </div>
            <button className="text-blue-500 text-xs font-semibold">Mudar</button>
          </div>

          {/* Sugestões */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-500">Sugestões para você</p>
              <button className="text-xs font-semibold">Ver tudo</button>
            </div>
            
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                    <div>
                      <p className="text-sm font-semibold">usuario{i}</p>
                      <p className="text-xs text-gray-500">Seguido por amigo</p>
                    </div>
                  </div>
                  <button className="text-blue-500 text-xs font-semibold">Seguir</button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-8 text-xs text-gray-400">
            <nav className="mb-4">
              <a href="#" className="hover:underline">Sobre</a> • 
              <a href="#" className="hover:underline">Ajuda</a> • 
              <a href="#" className="hover:underline">Imprensa</a> • 
              <a href="#" className="hover:underline">API</a> • 
              <a href="#" className="hover:underline">Carreiras</a> • 
              <a href="#" className="hover:underline">Privacidade</a> • 
              <a href="#" className="hover:underline">Termos</a> • 
              <a href="#" className="hover:underline">Localizações</a> • 
              <a href="#" className="hover:underline">Idioma</a>
            </nav>
            <p>© 2024 MENTEI</p>
          </footer>
        </div>
      </aside>
    </div>
  );
}
