import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookOpen, Users, Sun } from "lucide-react";

export default async function TurmasPage() {
  const session = await auth();
  const professorId = session!.user.id;

  const turmas = await prisma.turma.findMany({
    where: { professorId },
    include: {
      escola: true,
      _count: { select: { alunos: true } },
    },
    orderBy: { nome: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Turmas</h1>
          <p className="text-gray-400 text-sm mt-1">
            {turmas.length} turma{turmas.length !== 1 ? "s" : ""} encontrada{turmas.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#2D1B69] text-white hover:bg-[#3d2b89] transition-colors">
          + Nova Turma
        </button>
      </div>

      {turmas.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
          <p>Nenhuma turma cadastrada ainda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {turmas.map((turma) => (
            <a
              key={turma.id}
              href={`/dashboard/professor/turmas/${turma.id}`}
              className="block"
            >
              <div className="bg-white rounded-2xl p-6 border border-purple-50 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="inline-flex p-3 rounded-xl bg-purple-50 text-purple-500">
                    <BookOpen size={20} />
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                    {turma.turno ?? "—"}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-gray-800">{turma.nome}</h2>
                <p className="text-sm text-gray-400 mb-4">{turma.serie} · {turma.escola.nome}</p>

                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Users size={14} />
                  <span>{turma._count.alunos} aluno{turma._count.alunos !== 1 ? "s" : ""}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}