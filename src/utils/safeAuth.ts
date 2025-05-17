/**
 * Utilitário de autenticação segura usando NextAuth
 * 
 * Este arquivo fornece uma camada de compatibilidade para substituir
 * o hook useAuthState do React Firebase Hooks, integrando com NextAuth.
 */

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// Adaptador para o hook useAuthState do Firebase
export function useAuthState(auth: any) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(status === 'loading');
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    setLoading(status === 'loading');
    
    if (status === 'authenticated' && session?.user) {
      // Adaptar o formato do usuário para ser compatível com o formato do Firebase
      setUser({
        uid: session.user.id,
        email: session.user.email,
        displayName: session.user.name,
        photoURL: session.user.image,
        getIdToken: async () => session.user.id
      });
    } else {
      setUser(null);
    }
  }, [session, status]);
  
  return [user, loading];
}

// Função para acessar autenticação sem necessidade de hooks
export const safeAuth = {
  async getCurrentUser() {
    try {
      // Esta implementação deve ser usada apenas no lado do servidor
      return null;
    } catch (error) {
      console.error('Erro ao acessar usuário atual:', error);
      return null;
    }
  }
}; 