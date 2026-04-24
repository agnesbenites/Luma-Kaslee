"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Square, Loader2 } from "lucide-react";

export default function ControleSessao({ 
  sessaoId, 
  statusAtual 
}: { 
  sessaoId: string; 
  statusAtual: "RASCUNHO" | "ABERTA" | "ENCERRADA" 
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const alterarStatus = async (novoStatus: string) => {
    setLoading(true);
    await fetch(`/api/professor/sessao/${sessaoId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: novoStatus }),
    });
    
    // Se estiver encerrando, a gente precisaria disparar a rotina que gera os resumos de quem ficou sem.
    // Por enquanto, só muda o status e recarrega a tela
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      {/* Badge de Status */}
      <div className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
        <span className="text-sm text-gray-500">Status atual:</span>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
          statusAtual === 'ABERTA' ? 'bg-green-100 text-green-700' :
          statusAtual === 'ENCERRADA' ? 'bg-gray-200 text-gray-700' :
          'bg-yellow-100 text-yellow-700'
        }`}>
          {statusAtual}
        </span>
      </div>

      {/* Botões */}
      {statusAtual !== 'ABERTA' && (
        <button
          onClick={() => alterarStatus('ABERTA')}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg transition-colors disabled:opacity-50 font-medium"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
          {statusAtual === 'RASCUNHO' ? 'Iniciar Sessão' : 'Reabrir Sessão'}
        </button>
      )}

      {statusAtual === 'ABERTA' && (
        <button
          onClick={() => alterarStatus('ENCERRADA')}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg transition-colors disabled:opacity-50 font-medium"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Square size={18} fill="currentColor" />}
          Encerrar Sessão
        </button>
      )}
      
      {statusAtual === 'ABERTA' && (
        <p className="text-xs text-gray-500 text-center">
          Alunos podem acessar a sessão agora. Ao encerrar, os resumos serão consolidados.
        </p>
      )}
    </div>
  );
}