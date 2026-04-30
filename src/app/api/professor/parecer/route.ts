import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "PROFESSOR") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { alunoId, turmaId, texto, status } = await req.json();

  // Upsert — cria ou atualiza
  await (prisma as any).parecer.upsert({
    where: { alunoId },
    create: { alunoId, turmaId, texto, status },
    update: { texto, status },
  });

  return NextResponse.json({ ok: true });
}
