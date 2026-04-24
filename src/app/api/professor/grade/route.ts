import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET — listar grade da turma
export async function GET(req: Request) {
  const session = await auth();
  const professorId = (session?.user as any)?.id;
  if (!session || (session.user as any).role !== "professor")
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const turmaId = searchParams.get("turmaId");
  if (!turmaId)
    return NextResponse.json({ error: "turmaId obrigatório" }, { status: 400 });

  const grade = await prisma.gradeHoraria.findMany({
    where: { turmaId },
    orderBy: [{ diaSemana: "asc" }, { horaInicio: "asc" }],
    include: { sessao: { select: { id: true, titulo: true, ancora: true, status: true } } },
  });

  return NextResponse.json({ grade });
}

// POST — criar entrada na grade
export async function POST(req: Request) {
  const session = await auth();
  if (!session || (session.user as any).role !== "professor")
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await req.json();
  const { turmaId, diaSemana, horaInicio, horaFim, componente, fixo, sessaoId } = body;

  if (!turmaId || !diaSemana || !horaInicio || !horaFim || !componente)
    return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });

  const entrada = await prisma.gradeHoraria.create({
    data: { turmaId, diaSemana, horaInicio, horaFim, componente, fixo: fixo ?? true, sessaoId: sessaoId ?? null },
  });

  return NextResponse.json({ entrada });
}

// DELETE — remover entrada
export async function DELETE(req: Request) {
  const session = await auth();
  if (!session || (session.user as any).role !== "professor")
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });

  await prisma.gradeHoraria.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}