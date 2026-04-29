import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();
  if (!session) redirect("/login");

  const role = (session.user as any)?.role;

  if (role === "ESCOLA") redirect("/dashboard/escola/visao-geral");
  if (role === "PROFESSOR") redirect("/dashboard/professor/agenda");
  if (role === "PROFESSOR_PRIVADO") redirect("/dashboard/professor-privado");
  if (role === "ALUNO" || role === "ALUNO_PRIVADO") redirect("/dashboard/aluno");
  if (role === "FAMILIA") redirect("/dashboard/pais");

  redirect("/login");
}
