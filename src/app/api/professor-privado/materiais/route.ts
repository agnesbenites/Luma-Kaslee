import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).role !== "PROFESSOR_PRIVADO") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const professorId = (session.user as any).id;
  const materiais = await prisma.materialPrivado.findMany({
    where: { professorId },
    orderBy: { criadoEm: "desc" },
  });
  return NextResponse.json(materiais);
}
