import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth.config";

// Adicionar logs para diagnosticar problemas
console.log('Inicializando módulo de autenticação com novas configurações...');

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 