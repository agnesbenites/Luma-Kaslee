import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.senha) return null;
        const escola = await prisma.escola.findUnique({ 
          where: { email: credentials.email as string } 
        });
        if (escola && await compare(credentials.senha as string, escola.senhaHash)) {
          return { id: escola.id, name: escola.nome, email: escola.email, role: "ESCOLA" };
        }
        return null;
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
  if (user) {
    token.id = (user as any).id;
    token.role = (user as any).role;
    // Registra sessão respeitando o limite por role
    const { registrarSessao } = await import("@/lib/session-limit");
    await registrarSessao(
      (user as any).id,
      (user as any).role,
      token.jti ?? (user as any).id,
    );
  }
  return token;
},
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
});