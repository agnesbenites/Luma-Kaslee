"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  UserCircle, 
  BarChart3, 
  ShieldCheck, 
  LogOut, 
  Clock, 
  Heart,
  ChevronRight
} from "lucide-react";

const menuItems = [
  { name: "Portal da Família", href: "/dashboard/pais", icon: LayoutDashboard },
  { name: "Perfil do Aluno", href: "/dashboard/pais/perfil", icon: UserCircle },
  { name: "Desempenho & Notas", href: "/dashboard/pais/desempenho", icon: BarChart3 },
  { name: "Tempo e Foco IA", href: "/dashboard/pais/ia-foco", icon: Clock },
  { name: "Central Legal", href: "/dashboard/escola/legal", icon: ShieldCheck },
];

export function PaisSidebar() {
  const pathname = usePathname() || ""; // Fallback para evitar erro de string

  return (
    <aside className="w-80 bg-white border-r border-purple-50 flex flex-col h-screen sticky top-0 z-30 shadow-[4px_0_24px_rgba(45,27,105,0.02)]">
      {/* Logo Branding */}
      <div className="p-10">
        <h1 className="text-2xl font-black text-[#2D1B69] italic flex items-center gap-2">
          ✦ Kaslee 
          <span className="text-[9px] bg-[#F5C542] text-[#2D1B69] px-2 py-1 rounded-lg not-italic tracking-tighter font-black shadow-sm">
            FAMÍLIA
          </span>
        </h1>
      </div>

      {/* Menu de Navegação */}
      <nav className="flex-1 px-6 space-y-2">
        {menuItems.map((item) => {
          // Lógica de Ativo: Verifica se o pathname começa com o href (útil para sub-rotas)
          const isActive = pathname === item.href || (item.href !== "/dashboard/pais" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center justify-between px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                isActive 
                  ? "bg-[#2D1B69] text-white shadow-xl shadow-purple-900/20 translate-x-1" 
                  : "text-gray-400 hover:bg-purple-50 hover:text-[#2D1B69]"
              }`}
            >
              <div className="flex items-center gap-4">
                <item.icon size={20} className={isActive ? "text-[#F5C542]" : "group-hover:text-[#2D1B69]"} />
                {item.name}
              </div>
              {isActive && <ChevronRight size={14} className="text-purple-300" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer da Sidebar com Insight */}
      <div className="p-8 space-y-6">
        <div className="bg-gradient-to-br from-[#2D1B69] to-[#4c2f9d] p-6 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group border border-white/10">
          <Heart 
            className="absolute -right-4 -bottom-4 text-white/10 group-hover:scale-125 group-hover:text-white/20 transition-all duration-500" 
            size={100} 
          />
          <div className="relative z-10">
            <p className="text-[10px] font-black text-purple-300 uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Insight da Luma
            </p>
            <p className="text-xs leading-relaxed font-semibold">
              Ana manteve o foco por <span className="text-[#F5C542]">42 minutos</span> seguidos hoje. Parabéns!
            </p>
          </div>
        </div>
        
        <button 
          className="flex items-center gap-3 px-6 py-4 w-full text-sm font-black text-red-400 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100"
        >
          <LogOut size={20} /> 
          Sair do Portal
        </button>
      </div>
    </aside>
  );
}