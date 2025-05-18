import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TestPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/users', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Erro ao buscar usuários: ${response.status}`);
        }

        const data = await response.json();
        
        setUsers(data.users || []);
      } catch (err: any) {
        
        setError(err.message || 'Erro ao carregar usuários');
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Página de Teste
        </h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Status de Autenticação
          </h2>
          {user ? (
            <div className="bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100 p-4 rounded-md">
              <p><strong>Logado como:</strong> {user.displayName} ({user.email})</p>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>ID:</strong> {user.id}</p>
            </div>
          ) : (
            <div className="bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100 p-4 rounded-md">
              <p>Não autenticado</p>
              <p className="mt-2">
                <Link to="/login" className="underline">Fazer login</Link>
                {' ou '}
                <Link to="/register" className="underline">criar conta</Link>
              </p>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Usuários Registrados
          </h2>
          
          {loading ? (
            <p className="text-gray-600 dark:text-gray-400">Carregando usuários...</p>
          ) : error ? (
            <div className="bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100 p-4 rounded-md">
              <p>{error}</p>
            </div>
          ) : users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">ID</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Username</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Nome</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{user.id}</td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{user.username}</td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{user.displayName}</td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">Nenhum usuário encontrado</p>
          )}
        </div>
        
        <div className="mt-6 flex space-x-4">
          <Link 
            to="/" 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Voltar para Home
          </Link>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          >
            Atualizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestPage; 