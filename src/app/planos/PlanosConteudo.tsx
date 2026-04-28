"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, Loader2, Zap, Star, Infinity } from "lucide-react";

const PLANOS = [
  {
    id: "STARTER",
    nome: "Starter",
    preco: "R$ 49,90",
    periodo: "/mês",
    icon: <Zap size={22} />,
    cor: "#8B5CF6",
    destaque: false,
    limite: "até 35 alunos",
    excedente: "R$ 2,00/aluno extra",
    itens: [
      "Até 35 alunos simultâneos",
      "IA socrática em todas as aulas",
      "Upload de materiais próprios",
      "Relatório pós-sessão",
      "R$ 2,00 por aluno excedente/mês",
      "Suporte por e-mail",
      "30 dias grátis para testar",
    ],
  },
  {
    id: "PRO",
    nome: "Pro",
    preco: "R$ 89,90",
    periodo: "/mês",
    icon: <Star size={22} />,
    cor: "#F5C542",
    destaque: true,
    limite: "até 80 alunos",
    excedente: null,
    itens: [
      "Até 80 alunos simultâneos",
      "IA socrática em todas as aulas",
      "Upload ilimitado de materiais",
      "Relatório pós-sessão com IA",
      "Trilha de desenvolvimento docente",
      "Suporte prioritário",
      "30 dias grátis para testar",
    ],
  },
  {
    id: "ILIMITADO",
    nome: "Ilimitado",
    preco: "R$ 149,90",
    periodo: "/mês",
    icon: <Infinity size={22} />,
    cor: "#34D399",
    destaque: false,
    limite: "alunos ilimitados",
    excedente: null,
    itens: [
      "Alunos ilimitados",
      "IA socrática em todas as aulas",
      "Upload ilimitado de materiais",
      "Relatório pós-sessão com IA",
      "Trilha de desenvolvimento docente",
      "Suporte VIP + onboarding",
      "30 dias grátis para testar",
    ],
  },
];

export default function PlanosConteudo() {
  const searchParams = useSearchParams();
  const isNovo = searchParams.get("novo") === "professor";
  const [carregando, setCarregando] = useState<string | null>(null);

  async function handleAssinar(planoId: string) {
    setCarregando(planoId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plano: planoId, tipo: "PROFESSOR_PRIVADO" }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setCarregando(null);
    }
  }

  return (
    <div className="min-h-screen px-4 py-16"
      style={{ background: "linear-gradient(135deg, #1a0f3d 0%, #2D1B69 60%, #3d1f5c 100%)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold" style={{ color: "#F5C542" }}>✦ Luma</h1>
          {isNovo ? (
            <>
              <h2 className="text-3xl font-bold text-white mt-4">Conta criada! Escolha seu plano.</h2>
              <p className="mt-2" style={{ color: "#C4B8F0" }}>Você tem 30 dias grátis. Escolha o plano para continuar após o trial.</p>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-white mt-4">Planos para Professores</h2>
              <p className="mt-2" style={{ color: "#C4B8F0" }}>Escolha o plano ideal para o seu volume de alunos.</p>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANOS.map((plano) => (
            <div key={plano.id} className="rounded-2xl p-7 flex flex-col"
              style={{
                background: plano.destaque ? "rgba(245,197,66,0.1)" : "rgba(61,43,121,0.6)",
                border: plano.destaque ? "2px solid #F5C542" : "1px solid #4A3880",
                backdropFilter: "blur(12px)",
                position: "relative",
              }}>
              {plano.destaque && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                  style={{ background: "#F5C542", color: "#2D1B69" }}>
                  Mais popular
                </div>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl" style={{ background: `${plano.cor}20`, color: plano.cor }}>{plano.icon}</div>
                <div>
                  <h3 className="font-bold text-white text-lg">{plano.nome}</h3>
                  <p className="text-xs" style={{ color: "#C4B8F0" }}>{plano.limite}</p>
                </div>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">{plano.preco}</span>
                <span style={{ color: "#C4B8F0" }}>{plano.periodo}</span>
                {plano.excedente && <p className="text-xs mt-1" style={{ color: "#C4B8F0" }}>+ {plano.excedente}</p>}
              </div>
              <ul className="space-y-2.5 flex-1 mb-6">
                {plano.itens.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm" style={{ color: "#C4B8F0" }}>
                    <Check size={14} className="mt-0.5 shrink-0" style={{ color: plano.cor }} />
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleAssinar(plano.id)} disabled={carregando === plano.id}
                className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
                style={{
                  background: plano.destaque ? "#F5C542" : "rgba(255,255,255,0.1)",
                  color: plano.destaque ? "#2D1B69" : "#fff",
                  border: plano.destaque ? "none" : "1px solid rgba(255,255,255,0.2)",
                }}>
                {carregando === plano.id ? <><Loader2 size={16} className="animate-spin" /> Aguarde...</> : "Assinar agora →"}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-bold text-white text-center mb-2">Planos para Escolas</h3>
          <p className="text-center text-sm mb-8" style={{ color: "#C4B8F0" }}>
            Cobrado por aluno/ano — quanto mais alunos, menor o custo por cabeça.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {[
              { nome: "Por Área", preco: "R$ 18", unidade: "/aluno/ano", areas: "Exatas, Humanas ou Línguas" },
              { nome: "Completo", preco: "R$ 32", unidade: "/aluno/ano", areas: "BNCC completa + IA para todos os professores" },
            ].map((p) => (
              <div key={p.nome} className="rounded-2xl p-6"
                style={{ background: "rgba(61,43,121,0.6)", border: "1px solid #4A3880", backdropFilter: "blur(12px)" }}>
                <h4 className="font-bold text-white text-lg mb-1">{p.nome}</h4>
                <p className="text-xs mb-4" style={{ color: "#C4B8F0" }}>{p.areas}</p>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-white">{p.preco}</span>
                  <span className="text-sm" style={{ color: "#C4B8F0" }}>{p.unidade}</span>
                </div>
                <Link href="/contato"
                  className="block w-full py-2.5 rounded-xl font-bold text-sm text-center transition-all hover:opacity-90"
                  style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}>
                  Falar com comercial →
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-xs mt-4" style={{ color: "#4A3880" }}>
            Redes com 200+ escolas: contrato anual negociado. Entre em contato.
          </p>
        </div>

        <p className="text-center text-xs mt-10" style={{ color: "#4A3880" }}>
          Cancele quando quiser · Sem fidelidade · Dados protegidos pela LGPD
        </p>
      </div>
    </div>
  );
}
