'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { FaEnvelope, FaLock, FaUser, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    if (!name || !email || !password || !confirmPassword) {
      setAuthError('Preencha todos os campos');
      return;
    }
    
    if (password !== confirmPassword) {
      setAuthError('As senhas não coincidem');
      return;
    }
    
    if (password.length < 6) {
      setAuthError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    try {
      setIsRegistering(true);
      
      // Registrar usuário através da API
      const response = await fetch('/api/users/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: name.toLowerCase().replace(/\s+/g, '_'),
          displayName: name,
          email,
          password,
        }),
      });
      
      // Obter e verificar o conteúdo da resposta
      const responseText = await response.text();
      console.log('Resposta bruta da API:', responseText);
      
      let data;
      try {
        // Tentar analisar a resposta como JSON
        data = JSON.parse(responseText);
      } catch (parseError: any) {
        console.error('Erro ao analisar resposta JSON:', parseError);
        
        // Verificar se a resposta parece ser HTML (erro de servidor)
        if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html>')) {
          setAuthError('Erro no servidor: A API retornou HTML em vez de JSON. Verifique se o servidor está em execução corretamente.');
          setIsRegistering(false);
          return;
        }
        
        setAuthError(`Erro na resposta do servidor: ${parseError.message}`);
        setIsRegistering(false);
        return;
      }

      if (!response.ok) {
        console.error('Erro na resposta da API:', data);
        setAuthError(data.details || data.error || 'Erro ao criar conta. Tente novamente.');
        setIsRegistering(false);
        return;
      }

      console.log('Registro bem-sucedido!', data);
      
      // Fazer login automaticamente após o registro bem-sucedido
      const signInResult = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      
      if (signInResult?.error) {
        throw new Error('Erro ao fazer login após o registro: ' + signInResult.error);
      }
      
      // Redirecionar para a página inicial
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Erro ao registrar:', error);
      setAuthError(`Erro de conexão: ${error instanceof Error ? error.message : 'Não foi possível conectar ao servidor'}`);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        Criar uma conta
      </h2>
      
      {authError && (
        <div className="mb-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
          {authError}
        </div>
      )}
      
      <form onSubmit={handleRegister} className="space-y-6">
        <div>
          <label htmlFor="name" className="form-label">
            Nome
          </label>
          <div className="relative rounded-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-input pl-10"
              placeholder="Seu nome"
            />
          </div>
        </div>
        
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
          <label htmlFor="password" className="form-label">
            Senha
          </label>
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
              minLength={6}
              className="form-input pl-10"
              placeholder="Crie uma senha forte"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Mínimo de 6 caracteres
          </p>
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="form-label">
            Confirmar senha
          </label>
          <div className="relative rounded-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="form-input pl-10"
              placeholder="Confirme sua senha"
            />
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isRegistering}
            className="btn-gradient w-full flex justify-center py-2 px-4"
          >
            {isRegistering ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                <span>Criando conta...</span>
              </>
            ) : (
              'Criar conta'
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Ao se cadastrar, você concorda com nossos{' '}
          <Link href="/termos" className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300">
            Termos de Uso
          </Link>{' '}
          e{' '}
          <Link href="/privacidade" className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300">
            Política de Privacidade
          </Link>
        </p>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Já tem uma conta?{' '}
          <Link href="/login" className="font-medium text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300">
            Entre aqui
          </Link>
        </p>
      </div>
    </div>
  );
}