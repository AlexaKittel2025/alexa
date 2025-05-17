import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { comparePasswords } from "@/app/api/shared/auth-utils";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Buscar usuário pelo email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        // Verificar se o usuário existe e se a senha está correta
        if (!user || !(await comparePasswords(credentials.password, user.password_hash))) {
          return null;
        }

        // Retornar objeto do usuário sem a senha
        return {
          id: user.id,
          email: user.email,
          name: user.display_name,
          image: user.image || null,
          username: user.username
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Ao fazer login, adicionar dados adicionais ao token
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      // Adicionar dados adicionais à sessão
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 horas
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  secret: process.env.JWT_SECRET,
  debug: process.env.NODE_ENV === "development",
};