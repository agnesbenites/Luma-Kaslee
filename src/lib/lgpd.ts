import { prisma } from "@/lib/prisma";

export async function verificarConsentimento(alunoId: string): Promise<boolean> {
  const aluno = await prisma.aluno.findUnique({
    where: { id: alunoId },
    select: { consentimentoLgpd: true },
  });
  return aluno?.consentimentoLgpd ?? false;
}
