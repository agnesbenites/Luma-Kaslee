import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { signOut } from "@/auth";
import ProfessorSidebarClient from "@/components/professor/ProfessorSidebarClient";

export default async function ProfessorLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || (session.user as any).role !== "PROFESSOR") redirect("/login");

  const professorId = (session.user as any).id;
  const professor = await prisma.professor.findUnique({ where: { id: professorId } });
  if (!professor) redirect("/login");

  return (
    <div className="flex min-h-screen bg-[#F4F1FB]">
      <ProfessorSidebarClient />
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-gray-200 bg-white/50 backdrop-blur-md flex items-center px-8 sticky top-0 z-10">
          <p className="text-sm text-gray-500 font-medium">
            Olá, {professor.nome.split(" ")[0]} · Ambiente do Professor
          </p>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
