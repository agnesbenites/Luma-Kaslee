import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProfessorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  const professorId = session.user.id;

  try {
    const professor = await prisma.professor.findUnique({
      where: { id: professorId },
    });
    if (!professor) redirect("/login");
  } catch (error) {
    console.error("Erro ao verificar professor:", error);
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/dashboard/professor" className="flex items-center gap-2">
              <div className="text-xl font-bold text-[#2D1B69]">Luma</div>
            </Link>

            <div className="flex items-center gap-4">
              <nav className="flex space-x-6">
                <Link href="/dashboard/professor/agenda" className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md">
                  Agenda
                </Link>
                <Link href="/dashboard/professor/turmas" className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md">
                  Turmas
                </Link>
                <Link href="/dashboard/professor/atividades" className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md">
                  Atividades
                </Link>
                <Link href="/dashboard/professor/grade" className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md">
                  Grade
                </Link>
              </nav>

              <Link href="/api/auth/signout" className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md">
                Sair
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}