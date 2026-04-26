import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).role !== "ESCOLA") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const escolaId = (session.user as any).id;
  const turmas = await prisma.turma.findMany({
    where: { escolaId },
    include: {
      professor: { select: { id: true, nome: true } },
      _count: { select: { alunos: true } },
    },
    orderBy: { nome: "asc" },
  });
  return NextResponse.json(turmas);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ESCOLA") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const escolaId = (session.user as any).id;
  const { nome, serie, turno, professorId } = await req.json();
  if (!nome || !serie) {
    return NextResponse.json({ error: "Nome e série são obrigatórios." }, { status: 400 });
  }
  let profId = professorId;
  if (!profId) {
    const prof = await prisma.professor.findFirst({ where: { turmas: { some: { escolaId } } } });
    if (!prof) return NextResponse.json({ error: "Cadastre pelo menos um professor antes de criar turmas." }, { status: 400 });
    profId = prof.id;
  }
  const turma = await prisma.turma.create({
    data: { nome, serie, turno: turno || null, escolaId, professorId: profId },
    include: { professor: { select: { id: true, nome: true } }, _count: { select: { alunos: true } } },
  });
  return NextResponse.json(turma, { status: 201 });
}
