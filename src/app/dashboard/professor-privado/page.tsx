import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ProfessorPrivadoHome() {
  const session = await auth();
  if (!session || (session.user as any).role !== "PROFESSOR_PRIVADO") redirect("/login");
  redirect("/dashboard/professor-privado/alunos");
}
