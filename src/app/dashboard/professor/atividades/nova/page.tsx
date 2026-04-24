import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import NovaAtividadeForm from "@/components/professor/NovaAtividadeForm";

export default async function NovaAtividadePage() {
  const session = await auth();
  const professorId = session!.user.id;

  const turmas = await prisma.turma.findMany({
    where: { professorId },
    orderBy: { nome: "asc" },
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Nova Atividade</h1>
        <p className="text-gray-400 text-sm mt-1">
          Crie uma sessão socrática para sua turma.
        </p>
      </div>

      <NovaAtividadeForm turmas={turmas} professorId={professorId} />
    </div>
  );
}