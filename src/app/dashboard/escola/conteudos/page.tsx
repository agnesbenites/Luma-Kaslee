"use client";

import { RefreshCcw, Database, CheckCircle, Search } from "lucide-react";

export default function ConteudoBNCCPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-[#2D1B69]">Sincronização Curricular</h2>
          <p className="text-sm text-gray-500">Base Nacional Comum Curricular via RAG (IA Intelligence)</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#2D1B69] text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all">
          <RefreshCcw size={16} /> Sincronizar com MEC
        </button>
      </div>

      {/* Card de Status da IA */}
      <div className="bg-white p-6 rounded-[2rem] border border-purple-100 shadow-sm flex items-center gap-6">
        <div className="p-4 bg-purple-50 rounded-2xl text-[#2D1B69]">
          <Database size={32} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-800">Base de Conhecimento Luma</h3>
            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase">Ativa e Atualizada</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            A Luma está consultando a <strong>Versão 4.0 da BNCC</strong>. Todas as atividades geradas em sala de aula são validadas contra esta base em tempo real.
          </p>
        </div>
      </div>

      {/* Busca de Habilidades */}
      <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold">Consultar Competências (RAG Search)</h3>
          <div className="relative w-64">
             <input type="text" placeholder="Ex: Fotossíntese..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-purple-200" />
             <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-4">
            <div className="bg-white p-2 rounded-lg shadow-sm text-xs font-bold text-[#2D1B69]">EF06CI07</div>
            <div>
              <p className="text-sm font-semibold">Ciências - 6º Ano</p>
              <p className="text-xs text-gray-500 italic">"Justificar o papel da luz solar como fonte primária de energia na produção de alimentos..."</p>
            </div>
            <CheckCircle size={18} className="ml-auto text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
}