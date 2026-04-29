import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user as any).role !== "PROFESSOR_PRIVADO") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const professorId = (session.user as any).id;
  const { id } = await params;

  const aluno = await prisma.alunoPrivado.findFirst({ where: { id, professorId } });
  if (!aluno) return NextResponse.json({ error: "Aluno não encontrado." }, { status: 404 });

  await prisma.alunoPrivado.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
