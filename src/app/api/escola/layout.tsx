"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, GraduationCap, BookOpen, ShieldCheck } from "lucide-react";

const NAV = [
  { href: "/dashboard/escola/visao-geral", label: "Visão Geral", icon: LayoutDashboard },
  { href: "/dashboard/escola/turmas",      label: "Turmas",      icon: BookOpen },
  { href: "/dashboard/escola/professores", label: "Professores", icon: GraduationCap },
  { href: "/dashboard/escola/alunos",      label: "Alunos",      icon: Users },
  { href: "/dashboard/escola/consentimentos", label: "Consentimentos", icon: ShieldCheck },
];

export default function EscolaLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen" style={{ background: "#F7F6F2" }}>
      {/* Sidebar */}
      <aside
        className="flex w-64 shrink-0 flex-col border-r px-4 py-8"
        style={{ background: "#FFFFFF", borderColor: "#E5E2DC" }}
      >
        <div className="mb-10 px-2">
          <div className="flex items-center gap-2">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white text-sm font-bold"
              style={{ background: "linear-gradient(135deg, #01696f, #0c4e54)" }}
            >
              K
            </div>
            <div>
              <p className="font-bold text-[#28251d] text-sm">Kaslee</p>
              <p className="text-xs text-[#7a7974]">Painel da Escola</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const ativo = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all"
                style={{
                  background: ativo ? "#01696f15" : "transparent",
                  color: ativo ? "#01696f" : "#7a7974",
                  fontWeight: ativo ? 600 : 400,
                }}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-2 pt-8">
          <div
            className="rounded-2xl border p-4 text-xs"
            style={{ background: "#F3F0EC", borderColor: "#DCD9D5", color: "#7a7974" }}
          >
            <p className="font-semibold text-[#28251d] mb-1">🔒 LGPD ativa</p>
            <p>Dados exibidos são sempre agregados. Diálogos individuais são protegidos.</p>
          </div>
        </div>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 overflow-auto px-8 py-8">
        {children}
      </main>
    </div>
  );
}