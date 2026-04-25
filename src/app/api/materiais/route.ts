import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const role = (session.user as any).role;
  const userId = (session.user as any).id;

  // Professor vê só os seus
  if (role === "PROFESSOR") {
    const materiais = await prisma.material.findMany({
      where: { professorId: userId },
      orderBy: { criadoEm: "desc" },
    });
    return NextResponse.json(materiais);
  }

  // Aluno vê materiais dos professores de suas turmas
  if (role === "ALUNO") {
    const aluno = await prisma.aluno.findUnique({
      where: { id: userId },
      include: { turma: { include: { professor: { include: { materiais: true } } } } },
    });
    return NextResponse.json(aluno?.turma.professor.materiais ?? []);
  }

  // Escola vê tudo
  if (role === "ESCOLA") {
    const materiais = await prisma.material.findMany({
      include: { professor: { select: { nome: true } } },
      orderBy: { criadoEm: "desc" },
    });
    return NextResponse.json(materiais);
  }

  return NextResponse.json([]);
}