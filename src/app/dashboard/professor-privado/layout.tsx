import { ProfessorPrivadoSidebar } from "@/components/professor-privado/ProfessorPrivadoSidebar";

export default function ProfessorPrivadoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F4F1FB]">
      <ProfessorPrivadoSidebar />
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-gray-200 bg-white/50 backdrop-blur-md flex items-center px-8 sticky top-0 z-10">
          <p className="text-sm text-gray-500 font-medium">Ambiente do Professor · Reforço & Cursos Livres</p>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
