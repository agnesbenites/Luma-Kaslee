import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookOpen, CheckCircle, Clock } from "lucide-react";

export default async function MinhasSessoesPage() {
  const session = await auth();
  const alunoId = session!.user.id;

  const interacoes = await prisma.interacao.findMany({
    where: { alunoId },
    include: { sessao: { include: { turma: true } } },
    orderBy: { criadoEm: "desc" },
    distinct: ["sessaoId"],
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Minhas Sessões</h1>
        <p className="text-gray-400 text-sm mt-1">
          {interacoes.length} sessão{interacoes.length !== 1 ? "ões" : ""} realizada{interacoes.length !== 1 ? "s" : ""}
        </p>
      </div>

      {interacoes.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
          <p>Você ainda não participou de nenhuma sessão.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-purple-50 shadow-sm overflow-hidden">
          <ul>
            {interacoes.map((i) => (
              <li
                key={i.sessaoId}
                className="px-6 py-4 border-b border-gray-50 last:border-0 flex items-center justify-between hover:bg-purple-50/20 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="inline-flex p-2.5 rounded-xl bg-purple-50 text-purple-500 mt-0.5">
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{i.sessao.titulo}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {i.sessao.turma.nome} · {new Date(i.criadoEm).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs text-green-500">
                  <CheckCircle size={13} />
                  Concluída
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}