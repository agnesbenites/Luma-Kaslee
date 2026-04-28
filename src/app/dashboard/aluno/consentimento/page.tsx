"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function ConsentimentoPage() {
  const router = useRouter();
  const [aceitou, setAceitou] = useState(false);
  const [salvando, setSalvando] = useState(false);

  async function handleConfirmar() {
    setSalvando(true);
    try {
      await fetch("/api/aluno/consentimento", { method: "POST" });
      router.push("/dashboard/aluno");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #1a0f3d 0%, #2D1B69 60%, #3d1f5c 100%)" }}>
      <div className="w-full max-w-lg bg-white rounded-[2rem] p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-50 rounded-2xl text-[#2D1B69]">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="font-bold text-[#2D1B69] text-xl">Termo de Uso</h2>
            <p className="text-xs text-gray-400">Leia com atenção antes de continuar</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-5 text-sm text-gray-600 space-y-3 max-h-64 overflow-y-auto leading-relaxed">
          <p><strong>O que é a Luma?</strong> A Luma é uma inteligência artificial educacional que te ajuda a pensar, não a dar respostas prontas.</p>
          <p><strong>O que ela faz com seus dados?</strong> Suas respostas são usadas apenas para fins pedagógicos. Não vendemos seus dados. Não compartilhamos com terceiros.</p>
          <p><strong>O que ela não faz?</strong> A Luma não responde perguntas fora do contexto escolar. Conteúdos inadequados são bloqueados automaticamente.</p>
          <p><strong>Seus direitos (LGPD):</strong> Você pode solicitar a exclusão dos seus dados a qualquer momento pelo e-mail privacidade@kaslee.com.br</p>
          <p><strong>Uso seguro:</strong> A plataforma é monitorada para garantir um ambiente seguro para todos os estudantes.</p>
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={aceitou} onChange={(e) => setAceitou(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#2D1B69]" />
          <span className="text-sm text-gray-600">
            Li e concordo com os termos de uso e a política de privacidade da Luma. Entendo que meu uso será monitorado para fins de segurança.
          </span>
        </label>

        <button onClick={handleConfirmar} disabled={!aceitou || salvando}
          className="w-full py-3 bg-[#2D1B69] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-40 transition-all">
          {salvando ? <><Loader2 size={16} className="animate-spin" /> Salvando...</> : "Confirmar e acessar a Luma →"}
        </button>
      </div>
    </div>
  );
}
