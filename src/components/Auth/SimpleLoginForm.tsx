'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';

export default function SimpleLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Verificar credenciais mock simples
    if (email === 'teste@mentei.com' && password === 'teste123') {
      // Salvar usuário no sessionStorage
      sessionStorage.setItem('currentUser', JSON.stringify({
        id: 'user-1',
        name: 'Usuário Teste',
        email: 'teste@mentei.com',
        isPro: true
      }));
      
      // Redirecionar
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 500);
      
      return;
    }

    if (email === 'demo@mentei.com' && password === 'Demo123!') {
      // Salvar usuário no sessionStorage
      sessionStorage.setItem('currentUser', JSON.stringify({
        id: 'user-2',
        name: 'Demo User',
        email: 'demo@mentei.com',
        isPro: false
      }));
      
      // Redirecionar
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 500);
      
      return;
    }

    // Credenciais inválidas
    setError('Email ou senha incorretos');
    setLoading(false);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="seu@email.com"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Senha
        </label>
        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="••••••••"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 flex items-center justify-center"
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin mr-2" />
            Entrando...
          </>
        ) : (
          'Entrar'
        )}
      </button>

      <div className="text-center text-sm text-gray-600">
        Não tem conta? <a href="/cadastro" className="text-purple-600 hover:underline">Cadastre-se</a>
      </div>
    </form>
  );
}