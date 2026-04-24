import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).role !== "ESCOLA") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const escolaId = (session.user as any).id;

  // Busca dados agregados
  const totalTurmas = await prisma.turma.count({ where: { escolaId } });
  
  const totalAlunos = await prisma.aluno.count({
    where: { turma: { escolaId } }
  });

  const consentidos = await prisma.aluno.count({
    where: { 
      turma: { escolaId },
      consentimentoLgpd: true 
    }
  });

  return NextResponse.json({
    totalAlunos,
    totalTurmas,
    taxaConsentimento: totalAlunos > 0 ? Math.round((consentidos / totalAlunos) * 100) : 0,
    pendentes: totalAlunos - consentidos
  });
}