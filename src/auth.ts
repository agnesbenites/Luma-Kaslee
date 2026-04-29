import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
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

        const email = credentials.email as string;
        const senha = credentials.senha as string;

        // ── Escola ────────────────────────────────────────────────────────
        const escola = await prisma.escola.findUnique({ where: { email } });
        if (escola && await compare(senha, escola.senhaHash)) {
          return { id: escola.id, name: escola.nome, email: escola.email, role: "ESCOLA" };
        }

        // ── Professor vinculado à escola ──────────────────────────────────
        const professor = await prisma.professor.findUnique({ where: { email } });
        if (professor && await compare(senha, professor.senhaHash)) {
          return { id: professor.id, name: professor.nome, email: professor.email, role: "PROFESSOR" };
        }

        // ── Professor privado ─────────────────────────────────────────────
        const profPrivado = await prisma.professorPrivado.findUnique({ where: { email } });
        if (profPrivado && await compare(senha, profPrivado.senhaHash)) {
          // Bloqueia se plano cancelado ou inadimplente (após trial)
          const trialExpirado = profPrivado.trialExpiraEm && profPrivado.trialExpiraEm < new Date();
          const planoInativo = ["CANCELADO", "INADIMPLENTE"].includes(profPrivado.planoStatus);
          if (trialExpirado && planoInativo) {
            throw new Error("Seu plano está inativo. Acesse /planos para reativar.");
          }
          return {
            id: profPrivado.id,
            name: profPrivado.nome,
            email: profPrivado.email,
            role: "PROFESSOR_PRIVADO",
          };
        }

        // ── Aluno ─────────────────────────────────────────────────────────
        const aluno = await prisma.aluno.findUnique({ where: { email } });
        if (aluno && await compare(senha, aluno.senhaHash)) {
          return { id: aluno.id, name: aluno.nome, email: aluno.email, role: "ALUNO" };
        }

        // ── Aluno privado ─────────────────────────────────────────────────
        const alunoPrivado = await prisma.alunoPrivado.findUnique({ where: { email } });
        if (alunoPrivado && await compare(senha, alunoPrivado.senhaHash)) {
          return { id: alunoPrivado.id, name: alunoPrivado.nome, email: alunoPrivado.email, role: "ALUNO_PRIVADO" };
        }

        // ── Família ───────────────────────────────────────────────────────
        const familia = await prisma.familia.findUnique({ where: { email } });
        if (familia && await compare(senha, familia.senhaHash)) {
          return { id: familia.id, name: familia.nome, email: familia.email, role: "FAMILIA" };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
        try {
          const { registrarSessao } = await import("@/lib/session-limit");
          await registrarSessao(
            (user as any).id,
            (user as any).role,
            token.jti ?? (user as any).id,
          );
        } catch (err) {
          console.error("Erro ao registrar sessão:", err);
        }
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
