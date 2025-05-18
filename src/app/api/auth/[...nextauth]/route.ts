import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth.config";

// Adicionar logs para diagnosticar problemas

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 