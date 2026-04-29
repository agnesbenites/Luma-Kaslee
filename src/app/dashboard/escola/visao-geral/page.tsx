import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EscolaMetricasCards } from "@/components/escola/EscolaMetricasCards";
import { EscolaEngajamentoChart } from "@/components/escola/EscolaEngajamentoChart";
import GerarConvite from "@/components/escola/GerarConvite";
import OnboardingEscola from "@/components/escola/OnboardingEscola";

export default async function VisaoGeralEscola() {
  const session = await auth();
  if (!session || (session.user as any).role !== "ESCOLA") redirect("/login");

  const escolaId = (session.user as any).id;

  const [totalTurmas, totalProfessores, totalAlunos] = await Promise.all([
    prisma.turma.count({ where: { escolaId } }),
    prisma.professor.count({ where: { turmas: { some: { escolaId } } } }),
    prisma.aluno.count({ where: { turma: { escolaId } } }),
  ]);

  const onboardingCompleto = totalTurmas > 0 && totalProfessores > 0 && totalAlunos > 0;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Panorama Institucional</h2>

      {/* Onboarding — só aparece enquanto não completou os 3 passos */}
      {!onboardingCompleto && (
        <OnboardingEscola
          temTurma={totalTurmas > 0}
          temProfessor={totalProfessores > 0}
          temAluno={totalAlunos > 0}
        />
      )}

      <EscolaMetricasCards />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-medium mb-4">Adesão ao ECA Digital (Consentimentos)</h3>
          <EscolaEngajamentoChart type="consentimento" />
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-medium mb-4">Uso da Plataforma por Turma</h3>
          <EscolaEngajamentoChart type="uso" />
        </div>
      </div>

      <GerarConvite />
    </div>
  );
}
