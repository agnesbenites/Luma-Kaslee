import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LandingPage from "@/LandingPage";

export default async function HomePage() {
  const session = await auth();

  if (!session) return <LandingPage />;

  const role = (session.user as any)?.role;
  if (role === "ESCOLA") redirect("/dashboard/escola/visao-geral");
  else if (role === "PROFESSOR") redirect("/dashboard/professor/agenda");
  else redirect("/dashboard");
}