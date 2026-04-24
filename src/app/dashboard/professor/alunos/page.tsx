import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Users, AlertTriangle, Zap, CheckCircle } from "lucide-react";

export default async function AlunosPage() {
  const session = await auth();
  const professorId = session!.user.id;

  const alunos = await prisma.aluno.findMany({
    where: { turma: { professorId } },
    include: {
      turma: true,
      perfilCognitivo: true,
      respostas: {
        orderBy: { criadoEm: "desc" },
        take: 1,
      },
    },
    orderBy: { nome: "asc" },
  });

  const alertas = alunos.filter(
    (a) => a.respostas[0]?.sinalEmocional === "alerta"
  ).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Alunos</h1>
          <p className="text-gray-400 text-sm mt-1">
            {alunos.length} aluno{alunos.length !== 1 ? "s" : ""} no total
            {alertas > 0 && (
              <span className="ml-2 text-red-500 font-medium">
                · {alertas} em alerta
              </span>
            )}
          </p>
        </div>
      </div>

      {alunos.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Users size={40} className="mx-auto mb-3 opacity-30" />
          <p>Nenhum aluno cadastrado ainda.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-purple-50 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 uppercase border-b border-gray-50">
                <th className="px-6 py-3 text-left">Aluno</th>
                <th className="px-6 py-3 text-left">Turma</th>
                <th className="px-6 py-3 text-left">Raciocínio</th>
                <th className="px-6 py-3 text-left">Foco</th>
                <th className="px-6 py-3 text-left">Área</th>
                <th className="px-6 py-3 text-left">Sinal</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map((aluno) => {
                const perfil = aluno.perfilCognitivo;
                const sinal = aluno.respostas[0]?.sinalEmocional ?? "neutro";

                return (
                  <tr
                    key={aluno.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-purple-50/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-800">{aluno.nome}</p>
                      <p className="text-xs text-gray-400">{aluno.email}</p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-600">
                        {aluno.turma.nome}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-600 capitalize">
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
                      <span className="text-xs text-gray-600 capitalize">
                        {perfil?.areaAfinidade ?? "—"}
                      </span>
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
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}