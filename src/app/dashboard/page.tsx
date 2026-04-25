import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();
  if (!session) redirect("/login");

  const role = (session.user as any)?.role;
  if (role === "ESCOLA") redirect("/dashboard/escola/visao-geral");
  if (role === "PROFESSOR") redirect("/dashboard/professor/agenda");
  redirect("/dashboard/aluno");
}