import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const professorId = (session?.user as any)?.id;
  if (!session || (session.user as any).role !== "professor")
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const turmas = await prisma.turma.findMany({
    where: { professorId },
    select: { id: true, nome: true, serie: true },
    orderBy: { nome: "asc" },
  });

  return NextResponse.json({ turmas });
}