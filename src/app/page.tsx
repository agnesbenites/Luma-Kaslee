import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // Se não estiver logado, manda para a SUA tela roxa, NÃO para a do NextAuth
  if (!session) {
    redirect("/login");
  }

  // Se estiver logado, redireciona conforme o cargo (Role)
  const role = (session.user as any)?.role;

  if (role === "ESCOLA") {
    redirect("/dashboard/escola/visao-geral");
  } else if (role === "PROFESSOR") {
    redirect("/dashboard/professor/agenda");
  } else {
    // Caso seja aluno ou família
    redirect("/dashboard");
  }

  // Caso o redirecionamento falhe por algum motivo
  return (
    <main className="p-8">
      <h1>Carregando seu painel...</h1>
    </main>
  );
}