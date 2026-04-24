import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"; // Caso queira manter
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  // Isso aqui faz o NextAuth usar a SUA tela, e não essa preta da imagem
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.senha) return null;

        const email = credentials.email;
        const senhaDigitada = credentials.senha;

        // Busca a Escola (ou outros tipos) no banco do Supabase
        const escola = await prisma.escola.findUnique({ where: { email } });
        
        if (escola && await compare(senhaDigitada, escola.senhaHash)) {
          return { 
            id: escola.id, 
            name: escola.nome, 
            email: escola.email, 
            role: "ESCOLA" 
          };
        }

        // Adicione aqui a busca de Professor/Aluno se necessário, 
        // seguindo o mesmo modelo da escola acima.

        return null;
      },
    }),
    // Se não tiver as chaves do Google ainda, pode comentar as linhas abaixo
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
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
};