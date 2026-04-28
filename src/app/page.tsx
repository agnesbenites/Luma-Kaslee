import { auth } from "@/auth";
import LandingPage from "@/LandingPage";

export default async function HomePage() {
  const session = await auth();
  const role = (session?.user as any)?.role;

  let dashboardUrl = null;
  if (session) {
    if (role === "ESCOLA") dashboardUrl = "/dashboard/escola/visao-geral";
    else if (role === "PROFESSOR") dashboardUrl = "/dashboard/professor/agenda";
    else if (role === "ALUNO") dashboardUrl = "/dashboard/aluno";
    else dashboardUrl = "/dashboard/pais";
  }

  return <LandingPage dashboardUrl={dashboardUrl} />;
}
