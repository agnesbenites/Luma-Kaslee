import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();
  if (!session || (session.user as any).role !== "ALUNO") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const alunoId = (session.user as any).id;
  await prisma.aluno.update({
    where: { id: alunoId },
    data: { consentimentoLgpd: true },
  });

  return NextResponse.json({ ok: true });
}
