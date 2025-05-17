'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    if (!email || !password) {
      setAuthError('Preencha todos os campos');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Autenticar com NextAuth
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl: '/'
      });
      
      if (result?.error) {
        setAuthError('Credenciais inválidas');
        console.error('Erro no login:', result.error);
        return;
      }
      
      // Redirecionar para a página inicial em caso de sucesso
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setAuthError('Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        Entrar na sua conta
      </h2>
      
      {authError && (
        <div className="mb-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
          {authError}
        </div>
      )}
      
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label htmlFor="email" className="form-label">
            E-mail
          </label>
          <div className="relative rounded-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input pl-10"
              placeholder="seu@email.com"
            />
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="form-label">
              Senha
            </label>
            <Link href="/recuperar-senha" className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300">
              Esqueceu a senha?
            </Link>
          </div>
          <div className="relative rounded-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input pl-10"
              placeholder="Sua senha"
            />
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-gradient w-full flex justify-center py-2 px-4"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                <span>Entrando...</span>
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              Ou continue com
            </span>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            className="btn-outline"
            onClick={() => setAuthError('Provedores sociais em desenvolvimento')}
          >
            Google
          </button>
          <button
            className="btn-outline"
            onClick={() => setAuthError('Provedores sociais em desenvolvimento')}
          >
            Facebook
          </button>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Não tem uma conta?{' '}
          <Link href="/cadastro" className="font-medium text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}