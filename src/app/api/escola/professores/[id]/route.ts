import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ESCOLA") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const escolaId = (session.user as any).id;
  const { id: professorId } = await params;

  // Verifica se o professor pertence a essa escola
  const professor = await prisma.professor.findFirst({
    where: {
      id: professorId,
      turmas: { some: { escolaId } },
    },
  });

  if (!professor) {
    return NextResponse.json({ error: "Professor não encontrado." }, { status: 404 });
  }

  // Exclui tudo relacionado ao professor nessa escola
  await prisma.$transaction([
    // Remove grade horária das turmas dessa escola
    prisma.gradeHoraria.deleteMany({
      where: { turma: { professorId, escolaId } },
    }),
    // Remove atividades agendadas
    prisma.atividadeAgendada.deleteMany({
      where: { professorId, turma: { escolaId } },
    }),
    // Desvincula turmas (não exclui a turma, só remove o vínculo)
    prisma.turma.updateMany({
      where: { professorId, escolaId },
      data: { professorId: "" }, // será tratado no frontend
    }),
    // Exclui o professor
    prisma.professor.delete({
      where: { id: professorId },
    }),
  ]);

  return NextResponse.json({ ok: true });
}