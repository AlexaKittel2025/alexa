import React from 'react';
import PostgreStatus from '@/components/PostgreStatus';
import Link from 'next/link';

export const metadata = {
  title: 'Dashboard - Mentei',
  description: 'Painel de controle do aplicativo Mentei'
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <PostgreStatus />
          
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h2 className="text-lg font-bold mb-3">Banco de Dados</h2>
            <div className="space-y-2">
              <Link 
                href="/api/users" 
                target="_blank"
                className="block p-3 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors"
              >
                <div className="font-medium">API de Usuários</div>
                <div className="text-sm text-gray-600">/api/users</div>
              </Link>
              
              <Link 
                href="/api/posts" 
                target="_blank"
                className="block p-3 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors"
              >
                <div className="font-medium">API de Posts</div>
                <div className="text-sm text-gray-600">/api/posts</div>
              </Link>
              
              <Link 
                href="/api/db-test" 
                target="_blank"
                className="block p-3 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors"
              >
                <div className="font-medium">Teste de Conexão</div>
                <div className="text-sm text-gray-600">/api/db-test</div>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-bold mb-3">Comandos do Banco de Dados</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <h3 className="font-medium text-purple-800 mb-1">Criar Migrações</h3>
                <div className="bg-gray-900 text-gray-200 p-2 rounded text-sm font-mono">
                  npm run db:generate
                </div>
                <p className="text-sm mt-1 text-gray-600">
                  Gera arquivos de migração com base no schema em src/lib/db/schema.ts
                </p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <h3 className="font-medium text-purple-800 mb-1">Aplicar Migrações</h3>
                <div className="bg-gray-900 text-gray-200 p-2 rounded text-sm font-mono">
                  npm run db:migrate
                </div>
                <p className="text-sm mt-1 text-gray-600">
                  Aplica as migrações no banco de dados
                </p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <h3 className="font-medium text-purple-800 mb-1">Studio do Drizzle</h3>
                <div className="bg-gray-900 text-gray-200 p-2 rounded text-sm font-mono">
                  npm run db:studio
                </div>
                <p className="text-sm mt-1 text-gray-600">
                  Abre o Drizzle Studio para visualizar e editar os dados do banco
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-bold mb-3">Schema do Banco de Dados</h2>
            <p className="mb-3 text-sm text-gray-600">
              O aplicativo usa PostgreSQL com Drizzle ORM. Veja as principais tabelas:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><strong>users</strong> - Dados dos usuários</li>
              <li><strong>posts</strong> - Histórias falsas compartilhadas</li>
              <li><strong>reactions</strong> - Reações dos usuários às histórias</li>
              <li><strong>comments</strong> - Comentários nas histórias</li>
              <li><strong>chat_messages</strong> - Mensagens do chat global</li>
              <li><strong>badges</strong> - Emblemas e conquistas</li>
              <li><strong>user_badges</strong> - Emblemas conquistados pelos usuários</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 