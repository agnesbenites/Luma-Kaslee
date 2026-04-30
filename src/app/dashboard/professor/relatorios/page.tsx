import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ConselhoClasse from "./ConselhoClasse";

export default async function RelatoriosPage() {
  const session = await auth();
  if (!session || (session.user as any).role !== "PROFESSOR") redirect("/login");

  const professorId = (session.user as any).id;

  const turmas = await prisma.turma.findMany({
    where: { professorId },
    include: {
      alunos: {
        include: {
          respostas: {
            orderBy: { criadoEm: "desc" },
            take: 20,
            select: {
              id: true,
              pergunta: true,
              texto: true,
              tempoEscrita: true,
              turno: true,
              sinalEmocional: true,
              alinhamentoBNCC: true,
              criadoEm: true,
              sessao: { select: { titulo: true, ancora: true } },
            },
          },
          interacoes: {
            orderBy: { criadoEm: "desc" },
            take: 5,
            select: { resumo: true, criadoEm: true },
          },
        },
      },
      sessoes: {
        orderBy: { criadoEm: "desc" },
        take: 10,
        select: {
          id: true,
          titulo: true,
          status: true,
          criadoEm: true,
          _count: { select: { respostas: true } },
        },
      },
    },
  });

  // Busca pareceres já salvos
  const pareceres = await (prisma as any).parecer?.findMany({
    where: { turma: { professorId } },
  }).catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#2D1B69]">Relatórios & Conselho de Classe</h2>
        <p className="text-sm text-gray-500">Pareceres gerados por IA e editáveis por você</p>
      </div>
      <ConselhoClasse turmas={turmas} pareceresSalvos={pareceres ?? []} />
    </div>
  );
}
