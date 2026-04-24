import { EscolaSidebar } from "@/components/escola/EscolaSidebar";

export default function EscolaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F4F1FB]">
      {/* Sidebar Fixa na Esquerda */}
      <EscolaSidebar />

      {/* Conteúdo da Página na Direita */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-gray-200 bg-white/50 backdrop-blur-md flex items-center px-8 sticky top-0 z-10">
          <p className="text-sm text-gray-500 font-medium">Ambiente Administrativo Escola</p>
        </header>
        
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}