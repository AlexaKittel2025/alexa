'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface AuthCheckProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Componente que verifica se o usuário está autenticado
 * Pode redirecionar para outra página ou mostrar conteúdo alternativo
 */
export default function AuthCheck({ 
  children, 
  fallback, 
  redirectTo = '/login' 
}: AuthCheckProps) {
  const { status } = useSession();
  const router = useRouter();
  
  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';
  
  useEffect(() => {
    // Se não estiver carregando e não estiver autenticado, redirecionar
    if (!isLoading && !isAuthenticated && redirectTo) {
      router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(window.location.href)}`);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);
  
  // Se estiver carregando, não mostrar nada ainda
  if (isLoading) {
    return null;
  }
  
  // Se estiver autenticado, mostrar o conteúdo principal
  if (isAuthenticated) {
    return <>{children}</>;
  }
  
  // Se não estiver autenticado e tiver um fallback, mostrar o fallback
  if (fallback) {
    return <>{fallback}</>;
  }
  
  // Caso contrário, não mostrar nada enquanto redireciona
  return null;
}