"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  BookOpen,
  Users,
  ClipboardList,
  BarChart2,
  LogOut,
  Sparkles,
  CalendarDays,
} from "lucide-react";

const nav = [
  { href: "/dashboard/professor", label: "Início", icon: Sparkles },
  { href: "/dashboard/professor/turmas", label: "Turmas", icon: BookOpen },
  { href: "/dashboard/professor/alunos", label: "Alunos", icon: Users },
  { href: "/dashboard/professor/atividades", label: "Atividades", icon: ClipboardList },
  { href: "/dashboard/professor/grade", label: "Grade", icon: CalendarDays },
  { href: "/dashboard/professor/relatorios", label: "Relatórios", icon: BarChart2 },
];

export default function Sidebar({ user }: { user: { name?: string | null } }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#2D1B69] text-white flex flex-col">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Sparkles className="text-[#F5A623]" size={20} />
          <span className="text-xl font-bold text-[#F5A623]">Luma</span>
        </div>
        <p className="text-xs text-white/50 mt-1">por Kaslee</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-[#F5A623] text-[#2D1B69] font-semibold"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <p className="text-sm text-white/70 truncate mb-3">{user.name}</p>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  );
}