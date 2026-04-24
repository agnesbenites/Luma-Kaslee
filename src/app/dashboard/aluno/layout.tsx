import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SidebarAluno from "@/components/aluno/Sidebar";

export default async function AlunoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session || (session.user as any).role !== "aluno") redirect("/login");

  return (
    <div className="flex h-screen bg-[#FAF9FF]">
      <SidebarAluno user={session.user} />
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}