import { prisma } from "@/lib/prisma";

const LIMITES: Record<string, number> = {
  ESCOLA: 5,
  PROFESSOR: 3,
  PROFESSOR_PRIVADO: 2,
  ALUNO: 1,
  FAMILIA: 2,
};

export async function verificarLimiteSessoes(userId: string, role: string): Promise<boolean> {
  const limite = LIMITES[role] ?? 1;

  // Remove sessões expiradas
  await prisma.userSession.deleteMany({
    where: { userId, expiraEm: { lt: new Date() } },
  });

  const sessoes = await prisma.userSession.count({ where: { userId } });
  return sessoes < limite;
}

export async function registrarSessao(userId: string, role: string, token: string, deviceInfo?: string) {
  const limite = LIMITES[role] ?? 1;

  // Remove sessões expiradas
  await prisma.userSession.deleteMany({
    where: { userId, expiraEm: { lt: new Date() } },
  });

  const sessoes = await prisma.userSession.count({ where: { userId } });

  // Se atingiu o limite, remove a mais antiga
  if (sessoes >= limite) {
    const maisAntiga = await prisma.userSession.findFirst({
      where: { userId },
      orderBy: { criadoEm: "asc" },
    });
    if (maisAntiga) {
      await prisma.userSession.delete({ where: { id: maisAntiga.id } });
    }
  }

  const expiraEm = new Date();
  expiraEm.setDate(expiraEm.getDate() + 30);

  await prisma.userSession.create({
    data: { userId, userRole: role, token, deviceInfo, expiraEm },
  });
}

export async function removerSessao(token: string) {
  await prisma.userSession.deleteMany({ where: { token } });
}
