import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ControleSessao from "./ControleSessao";
import Link from "next/link";
import { ArrowLeft, Users, FileText, Sparkles, Brain } from "lucide-react";

const METODOS: Record<string, string> = {
  SOCRATICO: "Socrático",
  SCAFFOLDING: "Scaffolding",
  PBL: "Aprendizagem por Problema",
  REFLEXIVO: "Diálogo Reflexivo",
  DEBATE: "Debate Estruturado",
};

export default async function GestaoSessaoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session || (session.user as any).role !== "PROFESSOR") {
    redirect("/login");
  }

  const { id } = await params;

  const sessao = await prisma.sessao.findUnique({
    where: { id },
    include: {
      turma: {
        include: {
          alunos: true,
        },
      },
      interacoes: {
        include: {
          aluno: true,
        },
        orderBy: {
          criadoEm: "desc",
        },
      },
    },
  });

  if (!sessao) {
    redirect("/dashboard/professor");
  }

  const alunosQueParticiparam = sessao.interacoes.map((i) => i.alunoId);
  const alunosFaltantes = sessao.turma.alunos.filter(
    (a) => !alunosQueParticiparam.includes(a.id)
  );

  const metodoKey = (sessao.metodo || "SOCRATICO").toUpperCase();
  const metodoLabel = METODOS[metodoKey] || "Socrático";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/dashboard/professor"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{sessao.titulo}</h1>
          <p className="text-gray-500 text-sm">Turma: {sessao.turma.nome}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Coluna Esquerda */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-4">Controle de Sessão</h2>
            <ControleSessao sessaoId={sessao.id} statusAtual={sessao.status as any} />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-2">Âncora</h2>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {sessao.ancora}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Brain size={18} className="text-purple-600" />
              <h2 className="font-semibold text-gray-800">Método pedagógico</h2>
            </div>

            <div className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 font-medium mb-3">
              <Sparkles size={14} className="text-[#F5A623]" />
              {metodoLabel}
            </div>

            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg leading-relaxed">
              {sessao.metodoJustificativa ||
                "A Luma ainda não registrou uma justificativa para este método."}
            </p>
          </div>
        </div>

        {/* Coluna Direita */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <FileText size={18} className="text-purple-600" />
                Resumos dos Alunos
              </h2>
              <span className="text-sm text-gray-500">
                {sessao.interacoes.length} / {sessao.turma.alunos.length} participaram
              </span>
            </div>

            {sessao.interacoes.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <Users size={32} className="mx-auto mb-3 opacity-30" />
                <p>Nenhum aluno participou ainda.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessao.interacoes.map((interacao) => (
                  <div
                    key={interacao.id}
                    className="border border-gray-100 rounded-xl p-4"
                  >
                    <p className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-xs font-bold">
                        {interacao.aluno.nome?.[0]}
                      </span>
                      {interacao.aluno.nome}
                    </p>

                    <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg">
                      {interacao.resumo ||
                        "Resumo ainda não gerado (a sessão não foi encerrada)."}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {alunosFaltantes.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Users size={18} className="text-gray-500" />
                <h2 className="font-semibold text-gray-800">
                  Alunos que ainda não participaram
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {alunosFaltantes.map((aluno) => (
                  <span
                    key={aluno.id}
                    className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-600"
                  >
                    {aluno.nome}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}