import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Users, BookOpen, Zap, AlertTriangle, CheckCircle, Minus } from "lucide-react";
import EnviarSessaoBtn from "@/components/professor/EnviarSessaoBtn";

export default async function TurmaPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const professorId = session!.user.id;
  const { id } = await params;

  const turma = await prisma.turma.findFirst({
    where: { id, professorId },
    include: {
      escola: true,
      alunos: {
        include: {
          perfilCognitivo: true,
          respostas: {
            orderBy: { criadoEm: "desc" },
            take: 1,
          },
        },
        orderBy: { nome: "asc" },
      },
      sessoes: {
        orderBy: { criadoEm: "desc" },
        take: 5,
      },
    },
  });

  if (!turma) notFound();

  return (
    <div>
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">{turma.nome}</h1>
        <p className="text-gray-400 text-sm mt-1">
          {turma.serie} · {turma.turno ?? "—"} · {turma.escola.nome}
        </p>
        <div className="flex gap-6 mt-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users size={16} className="text-purple-400" />
            {turma.alunos.length} alunos
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <BookOpen size={16} className="text-purple-400" />
            {turma.sessoes.length} sessões recentes
          </div>
        </div>
      </div>

      {/* Tabela de alunos */}
      <div className="bg-white rounded-2xl border border-purple-50 shadow-sm mb-8 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-gray-700">Alunos</h2>
        </div>

        {turma.alunos.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Users size={32} className="mx-auto mb-2 opacity-30" />
            <p>Nenhum aluno nesta turma ainda.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 uppercase border-b border-gray-50">
                <th className="px-6 py-3 text-left">Aluno</th>
                <th className="px-6 py-3 text-left">Raciocínio</th>
                <th className="px-6 py-3 text-left">Foco</th>
                <th className="px-6 py-3 text-left">Sinal</th>
                <th className="px-6 py-3 text-left">Ação</th>
              </tr>
            </thead>
            <tbody>
              {turma.alunos.map((aluno) => {
                const perfil = aluno.perfilCognitivo;
                const sinal = aluno.respostas[0]?.sinalEmocional ?? "neutro";

                return (
                  <tr key={aluno.id} className="border-b border-gray-50 last:border-0 hover:bg-purple-50/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{aluno.nome}</td>

                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-600 capitalize">
                        {perfil?.tipoRaciocinio ?? "—"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {perfil?.indiceFoco != null ? (
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-400 rounded-full"
                              style={{ width: `${Math.round(perfil.indiceFoco * 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400">
                            {Math.round(perfil.indiceFoco * 100)}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {sinal === "alerta" && (
                        <span className="flex items-center gap-1 text-xs text-red-500">
                          <AlertTriangle size={13} /> Alerta
                        </span>
                      )}
                      {sinal === "atencao" && (
                        <span className="flex items-center gap-1 text-xs text-yellow-500">
                          <Zap size={13} /> Atenção
                        </span>
                      )}
                      {sinal === "neutro" && (
                        <span className="flex items-center gap-1 text-xs text-green-500">
                          <CheckCircle size={13} /> Neutro
                        </span>
                      )}
                      {!sinal && (
                        <span className="text-xs text-gray-300 flex items-center gap-1">
                          <Minus size={13} /> —
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <EnviarSessaoBtn alunoId={aluno.id} alunoNome={aluno.nome} turmaId={turma.id} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Últimas sessões */}
      <div className="bg-white rounded-2xl border border-purple-50 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-700">Últimas sessões</h2>
        </div>
        {turma.sessoes.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <BookOpen size={32} className="mx-auto mb-2 opacity-30" />
            <p>Nenhuma sessão criada ainda.</p>
          </div>
        ) : (
          <ul>
            {turma.sessoes.map((s) => (
              <li key={s.id} className="px-6 py-4 border-b border-gray-50 last:border-0 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{s.titulo}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.ancora}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                  s.status === "ativa"
                    ? "bg-green-50 text-green-600"
                    : s.status === "encerrada"
                    ? "bg-gray-100 text-gray-400"
                    : "bg-yellow-50 text-yellow-600"
                }`}>
                  {s.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}