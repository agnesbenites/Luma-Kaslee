import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ESCOLA") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const { id } = await params;
  const alunos = await prisma.aluno.findMany({
    where: { turmaId: id },
    select: { id: true, nome: true, email: true },
    orderBy: { nome: "asc" },
  });
  return NextResponse.json(alunos);
}
