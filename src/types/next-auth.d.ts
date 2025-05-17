import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Extensão da interface User do NextAuth para incluir
   * campos adicionais específicos da nossa aplicação
   */
  interface User {
    id: string;
    username: string;
    isPro?: boolean;
    score?: number;
  }

  /**
   * Extensão da interface Session do NextAuth para incluir
   * campos adicionais no objeto user
   */
  interface Session {
    user: {
      id: string;
      username: string;
      isPro?: boolean;
      score?: number;
    } & DefaultSession['user'];
  }
}