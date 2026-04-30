"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, BookOpen, BarChart2, Calendar, ClipboardList, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const menuItems = [
  { name: "Agenda", href: "/dashboard/professor/agenda", icon: Calendar },
  { name: "Turmas", href: "/dashboard/professor/turmas", icon: Users },
  { name: "Materiais", href: "/dashboard/professor/materiais", icon: BookOpen },
  { name: "Atividades", href: "/dashboard/professor/atividades", icon: ClipboardList },
  { name: "Relatórios", href: "/dashboard/professor/relatorios", icon: BarChart2 },
  { name: "Perfil", href: "/dashboard/professor/perfil", icon: LayoutDashboard },
];

export default function ProfessorSidebarClient() {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-[#1a0f3d] text-[#C4B8F0] flex flex-col h-screen sticky top-0 border-r border-[#4A3880]">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-[#F5C542]">✦ Luma</h1>
        <p className="text-[10px] text-[#4A3880] uppercase tracking-widest mt-1">Painel do Professor</p>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive ? "bg-[#F5C542] text-[#2D1B69]" : "hover:bg-[#2D1B69] hover:text-[#F4F1FB]"
              }`}>
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-[#4A3880]">
        <button onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
          <LogOut size={20} />
          Sair da Plataforma
        </button>
      </div>
    </aside>
  );
}
