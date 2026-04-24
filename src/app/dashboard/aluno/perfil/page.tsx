import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Brain, Target, Sparkles, BookOpen, CheckCircle, Clock } from "lucide-react";

export default async function PerfilAlunoPage() {
  const session = await auth();
  const alunoId = session!.user.id as string;

  const aluno = await prisma.aluno.findUnique({
    where: { id: alunoId },
    include: {
      perfilCognitivo: true,
      turma: true,
      _count: { select: { respostas: true, interacoes: true } },
      interacoes: {
        include: { sessao: true },
        orderBy: { criadoEm: "desc" },
      },
    },
  });

  const perfil = aluno?.perfilCognitivo;
  const interacoes = aluno?.interacoes ?? [];

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Meu Perfil</h1>
        <p className="text-gray-400 text-sm mt-1">
          Seu perfil cognitivo construído pela Luma ao longo das sessões.
        </p>
      </div>

      {/* Info básica */}
      <div className="bg-white rounded-2xl p-6 border border-purple-50 shadow-sm mb-6 flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl">
          {session!.user.name?.[0]}
        </div>
        <div>
          <p className="font-bold text-gray-800">{session!.user.name}</p>
          <p className="text-sm text-gray-400">{aluno?.turma.nome} · {aluno?.turma.serie}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          { label: "Respostas escritas", value: aluno?._count.respostas ?? 0, icon: Target },
          { label: "Interações com a Luma", value: aluno?._count.interacoes ?? 0, icon: Sparkles },
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

      {/* Perfil cognitivo */}
      <div className="bg-white rounded-2xl p-6 border border-purple-50 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-6">
          <Brain size={18} className="text-purple-500" />
          <h2 className="font-semibold text-gray-700">Perfil Cognitivo</h2>
        </div>

        {!perfil ? (
          <div className="text-center py-8 text-gray-400">
            <Sparkles size={28} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Seu perfil será construído conforme você participa das sessões.</p>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <p className="text-xs text-gray-400 mb-1">Tipo de raciocínio</p>
              <span className="text-sm px-3 py-1.5 rounded-full bg-purple-50 text-purple-600 font-medium capitalize">
                {perfil.tipoRaciocinio ?? "Em construção"}
              </span>
            </div>

            {perfil.indiceFoco != null && (
              <div>
                <div className="flex justify-between mb-1.5">
                  <p className="text-xs text-gray-400">Índice de foco</p>
                  <p className="text-xs font-medium text-purple-600">
                    {Math.round(perfil.indiceFoco * 100)}%
                  </p>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2D1B69] rounded-full transition-all"
                    style={{ width: `${Math.round(perfil.indiceFoco * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {perfil.areaAfinidade && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Área de afinidade</p>
                <span className="text-sm px-3 py-1.5 rounded-full bg-yellow-50 text-yellow-600 font-medium capitalize">
                  {perfil.areaAfinidade}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Resumos das sessões */}
      <div className="bg-white rounded-2xl p-6 border border-purple-50 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen size={18} className="text-purple-500" />
          <h2 className="font-semibold text-gray-700">Minhas Sessões</h2>
        </div>

        {interacoes.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <BookOpen size={28} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Você ainda não participou de nenhuma sessão.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {interacoes.map((interacao) => (
              <div
                key={interacao.id}
                className="border border-gray-100 rounded-xl p-4"
              >
                {/* Cabeçalho da sessão */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      {interacao.sessao.titulo}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(interacao.criadoEm).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Badge de status */}
                  {interacao.resumo ? (
                    <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <CheckCircle size={11} />
                      Concluída
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                      <Clock size={11} />
                      Em andamento
                    </span>
                  )}
                </div>

                {/* Resumo ou placeholder */}
                {interacao.resumo ? (
                  <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg">
                    {interacao.resumo}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 italic bg-gray-50 p-3 rounded-lg">
                    O resumo será gerado quando a sessão for encerrada pelo professor.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}