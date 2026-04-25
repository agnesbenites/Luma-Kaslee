import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).role !== "ESCOLA") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const escolaId = (session.user as any).id;
  const professores = await prisma.professor.findMany({
    where: { turmas: { some: { escolaId } } },
    select: { id: true, nome: true, email: true, criadoEm: true },
  });
  return NextResponse.json(professores);
}
