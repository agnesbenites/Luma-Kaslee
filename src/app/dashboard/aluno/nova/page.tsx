import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import NovaClient from "./NovaClient";

export default async function NovaPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const alunoId = (session.user as any).id;

  // Verifica consentimento LGPD
  const aluno = await prisma.aluno.findUnique({
    where: { id: alunoId },
    select: { consentimentoLgpd: true, nome: true },
  });

  if (!aluno?.consentimentoLgpd) {
    redirect("/dashboard/aluno/consentimento");
  }

  return <NovaClient />;
}
