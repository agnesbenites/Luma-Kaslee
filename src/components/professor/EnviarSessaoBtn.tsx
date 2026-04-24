"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function EnviarSessaoBtn({
  alunoId,
  alunoNome,
  turmaId,
}: {
  alunoId: string;
  alunoNome: string;
  turmaId: string;
}) {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <button
        onClick={() => setAberto(true)}
        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
      >
        <Send size={12} />
        Enviar sessão
      </button>

      {aberto && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="font-bold text-gray-800 mb-1">Enviar sessão para</h3>
            <p className="text-sm text-purple-500 mb-6">{alunoNome}</p>

            {/* Aqui vai a lista de sessões da biblioteca — implementamos na próxima etapa */}
            <div className="text-center py-8 text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl mb-6">
              Biblioteca de sessões em construção 🚧
            </div>

            <button
              onClick={() => setAberto(false)}
              className="w-full py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}