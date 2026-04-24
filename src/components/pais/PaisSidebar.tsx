"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, UserCircle, BarChart3, 
  ShieldCheck, LogOut, Clock, Heart, ChevronRight 
} from "lucide-react";

export function PaisSidebar() {
  const pathname = usePathname() || "";
  const router = useRouter();

  const handleLogout = () => {
    // Redireciona para a sua página de login comum que já existe
    router.push("/login"); 
  };

  const menuItems = [
    { name: "Portal da Família", href: "/dashboard/pais", icon: LayoutDashboard },
    { name: "Perfil do Aluno", href: "/dashboard/pais/perfil", icon: UserCircle },
    { name: "Desempenho & Notas", href: "/dashboard/pais/desempenho", icon: BarChart3 },
    { name: "Tempo e Foco IA", href: "/dashboard/pais/ia-foco", icon: Clock },
    { name: "Central Legal", href: "/dashboard/escola/legal", icon: ShieldCheck },
  ];

  return (
    <aside className="w-80 bg-white border-r border-purple-50 flex flex-col h-screen sticky top-0 z-30 shadow-[4px_0_24px_rgba(45,27,105,0.02)]">
      <div className="p-10">
        <h1 className="text-2xl font-black text-[#2D1B69] italic flex items-center gap-2">
          ✦ Kaslee <span className="text-[9px] bg-[#F5C542] text-[#2D1B69] px-2 py-1 rounded-lg not-italic tracking-tighter font-black shadow-sm">FAMÍLIA</span>
        </h1>
      </div>

      <nav className="flex-1 px-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center justify-between px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                isActive ? "bg-[#2D1B69] text-white shadow-xl translate-x-1" : "text-gray-400 hover:bg-purple-50 hover:text-[#2D1B69]"
              }`}
            >
              <div className="flex items-center gap-4">
                <item.icon size={20} className={isActive ? "text-[#F5C542]" : ""} />
                {item.name}
              </div>
              {isActive && <ChevronRight size={14} />}
            </Link>
          );
        })}
      </nav>

      <div className="p-8 space-y-6">
        <div className="bg-[#2D1B69] p-6 rounded-[2.5rem] text-white relative overflow-hidden">
          <Heart className="absolute -right-4 -bottom-4 text-white/10" size={100} />
          <p className="text-[10px] font-black text-purple-300 uppercase mb-2">Insight da Luma</p>
          <p className="text-xs font-semibold leading-relaxed">Ana manteve o foco por 42 min hoje.</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-3 px-6 py-4 w-full text-sm font-black text-red-400 hover:bg-red-50 rounded-2xl transition-all">
          <LogOut size={20} /> Sair do Portal
        </button>
      </div>
    </aside>
  );
}