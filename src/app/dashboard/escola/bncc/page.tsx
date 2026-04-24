"use client";

import { useState } from "react";
import { 
  Database, RefreshCcw, Search, CheckCircle, 
  FileText, Brain, ShieldCheck, Info 
} from "lucide-react";

export default function PaginaBNCC() {
  const [sincronizando, setSincronizando] = useState(false);

  const simularSincronizacao = () => {
    setSincronizando(true);
    setTimeout(() => setSincronizando(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 animate-in fade-in duration-700">
      {/* Header com Status do RAG */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-[#2D1B69] tracking-tight">Base Curricular Inteligente</h1>
          <p className="text-gray-500 mt-2 flex items-center gap-2">
            <ShieldCheck size={16} className="text-green-500" /> 
            Sincronizado via RAG com a base oficial do MEC (BNCC 2026)
          </p>
        </div>
        <button 
          onClick={simularSincronizacao}
          disabled={sincronizando}
          className="flex items-center gap-3 px-6 py-3 bg-[#2D1B69] text-white rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-200 disabled:opacity-50"
        >
          <RefreshCcw size={18} className={sincronizando ? "animate-spin" : ""} />
          {sincronizando ? "Sincronizando..." : "Atualizar Base BNCC"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Card de Status da IA */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-purple-100 shadow-sm">
            <div className="p-4 bg-purple-50 rounded-2xl w-fit mb-6 text-[#2D1B69]">
              <Brain size={32} />
            </div>
            <h3 className="font-black text-[#2D1B69] text-xl mb-3">Luma Intelligence</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              A Luma não utiliza apenas IA genérica. Ela utiliza <strong>Retrieval-Augmented Generation</strong> para garantir que cada pergunta em sala de aula esteja ancorada em uma habilidade oficial.
            </p>
            <div className="mt-6 pt-6 border-t border-gray-50 space-y-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-400 uppercase">Versão da Base:</span>
                <span className="text-[#2D1B69]">v4.0.2 (Abril/26)</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-400 uppercase">Habilidades Mapeadas:</span>
                <span className="text-[#2D1B69]">1.452</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-900 text-white p-8 rounded-[2.5rem] shadow-xl">
            <h4 className="font-bold flex items-center gap-2 mb-4">
              <Info size={18} /> Nota de Compliance
            </h4>
            <p className="text-xs opacity-80 leading-relaxed italic">
              "A automação via RAG impede a criação de conteúdos fora da diretriz curricular da escola, servindo como auditor digital preventivo."
            </p>
          </div>
        </div>

        {/* Simulador de Busca Curricular */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
          <div className="relative mb-8">
            <input 
              type="text" 
              placeholder="Pesquisar tema (Ex: Imperialismo, Equações, Células)..." 
              className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-[1.5rem] text-lg focus:ring-4 focus:ring-purple-100 transition-all font-medium"
            />
            <Search className="absolute left-5 top-5 text-gray-300" size={24} />
          </div>

          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Sugestões de Habilidades Ativas</h4>
          
          <div className="space-y-4">
            {[
              { id: "EF09HI10", materia: "História", desc: "Identificar as causas e as consequências da crise de 1929 e seus impactos no Brasil." },
              { id: "EM13MAT301", materia: "Matemática", desc: "Interpretar e construir modelos para resolver problemas que envolvam variáveis socioeconômicas." },
              { id: "EF07CI01", materia: "Ciências", desc: "Discutir a aplicação, ao longo da história, das máquinas simples e o funcionamento de motores térmicos." }
            ].map((hab) => (
              <div key={hab.id} className="group p-6 border border-gray-50 bg-white rounded-2xl hover:border-purple-200 hover:shadow-md transition-all flex items-start gap-4 cursor-pointer">
                <div className="bg-gray-50 group-hover:bg-purple-50 p-3 rounded-xl text-[#2D1B69] font-black text-xs transition-colors">
                  {hab.id}
                </div>
                <div>
                  <p className="text-[10px] font-black text-purple-600 uppercase mb-1">{hab.materia}</p>
                  <p className="text-sm text-gray-700 font-medium leading-snug">{hab.desc}</p>
                </div>
                <CheckCircle size={18} className="ml-auto text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}