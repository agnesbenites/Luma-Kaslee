import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BarChart2, BookOpen, Users, TrendingUp, AlertTriangle } from "lucide-react";

export default async function RelatoriosPage() {
  const session = await auth();
  const professorId = session!.user.id;

  const [turmas, totalAlunos, sessoes, alertas] = await Promise.all([
    prisma.turma.count({ where: { professorId } }),
    prisma.aluno.count({ where: { turma: { professorId } } }),
    prisma.sessao.findMany({
      where: { turma: { professorId } },
      include: {
        turma: true,
        _count: { select: { respostas: true } },
        respostas: {
          select: { sinalEmocional: true, tempoEscrita: true },
        },
      },
      orderBy: { criadoEm: "desc" },
    }),
    prisma.resposta.count({
      where: {
        sinalEmocional: "alerta",
        sessao: { turma: { professorId } },
      },
    }),
  ]);

  const totalRespostas = sessoes.reduce((acc, s) => acc + s._count.respostas, 0);
  const tempoMedio = sessoes
    .flatMap((s) => s.respostas.map((r) => r.tempoEscrita))
    .reduce((acc, t, _, arr) => acc + t / arr.length, 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Relatórios</h1>
        <p className="text-gray-400 text-sm mt-1">
          Visão geral do desempenho e engajamento das suas turmas.
        </p>
      </div>

      {/* Cards de métricas gerais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Turmas", value: turmas, icon: BookOpen },
          { label: "Alunos", value: totalAlunos, icon: Users },
          { label: "Respostas coletadas", value: totalRespostas, icon: TrendingUp },
          { label: "Alertas ativos", value: alertas, icon: AlertTriangle },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm">
            <div className="inline-flex p-2.5 rounded-xl bg-purple-50 text-purple-500 mb-3">
              <Icon size={18} />
            </div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Tempo médio de escrita */}
      {tempoMedio > 0 && (
        <div className="bg-white rounded-2xl border border-purple-50 shadow-sm p-6 mb-8">
          <h2 className="font-semibold text-gray-700 mb-1">Tempo médio de escrita</h2>
          <p className="text-gray-400 text-xs mb-4">Por resposta, em todas as sessões</p>
          <p className="text-4xl font-bold text-purple-600">
            {Math.round(tempoMedio / 1000)}s
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Tempo médio que os alunos levam para escrever cada resposta.
          </p>
        </div>
      )}

      {/* Relatório por sessão */}
      <div className="bg-white rounded-2xl border border-purple-50 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-700">Relatório por sessão</h2>
        </div>

        {sessoes.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <BarChart2 size={32} className="mx-auto mb-2 opacity-30" />
            <p>Nenhuma sessão realizada ainda.</p>
          </div>
        ) : (
          <ul>
            {sessoes.map((s) => {
              const alertasSessao = s.respostas.filter(
                (r) => r.sinalEmocional === "alerta"
              ).length;
              const tempoMedioSessao =
                s.respostas.length > 0
                  ? s.respostas.reduce((acc, r) => acc + r.tempoEscrita, 0) /
                    s.respostas.length
                  : 0;

              return (
                <li
                  key={s.id}
                  className="px-6 py-5 border-b border-gray-50 last:border-0 hover:bg-purple-50/20 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{s.titulo}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {s.turma.nome} · {s._count.respostas} resposta{s._count.respostas !== 1 ? "s" : ""}
                      </p>
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
                  </div>

                  {/* Mini métricas da sessão */}
                  <div className="flex gap-6 mt-3">
                    <div>
                      <p className="text-xs text-gray-400">Tempo médio</p>
                      <p className="text-sm font-semibold text-gray-700">
                        {tempoMedioSessao > 0
                          ? `${Math.round(tempoMedioSessao / 1000)}s`
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Alertas</p>
                      <p className={`text-sm font-semibold ${alertasSessao > 0 ? "text-red-500" : "text-gray-700"}`}>
                        {alertasSessao > 0 ? `⚠ ${alertasSessao}` : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Engajamento</p>
                      <p className="text-sm font-semibold text-gray-700">
                        {s._count.respostas > 0 ? "✓ Com dados" : "Sem dados"}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}