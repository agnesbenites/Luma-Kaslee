"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, CheckCircle2, Scale } from "lucide-react";

export default function ConsentimentoPaisPage() {
  const [aceitou, setAceitou] = useState(false);
  const router = useRouter();

  const handleConfirmar = () => {
    if (aceitou) {
      router.push("/dashboard/pais");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1FB] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-purple-100 animate-in fade-in zoom-in duration-500">
        
        <div className="p-10 bg-[#2D1B69] text-white">
          <ShieldCheck size={48} className="text-[#F5C542] mb-4" />
          <h1 className="text-3xl font-black italic tracking-tight">Autorização Parental</h1>
          <p className="text-sm opacity-80 mt-2 font-medium">
            Confirmação de identidade e responsabilidade legal.
          </p>
        </div>

        <div className="p-10 space-y-8">
          {/* Alerta de Responsabilidade Legal */}
          <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex gap-4 items-start">
            <Scale className="text-amber-600 shrink-0" size={24} />
            <div>
              <h4 className="text-amber-900 font-bold text-sm">Declaração de Responsabilidade</h4>
              <p className="text-amber-800 text-xs mt-1 leading-relaxed">
                Ao prosseguir, você declara, sob as penas da lei, ser o <strong>responsável legal</strong> pelo aluno(a) vinculado a esta conta.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 max-h-72 overflow-y-auto text-sm text-gray-600 leading-relaxed scrollbar-thin">
            <h4 className="font-bold text-[#2D1B69] mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-500" /> 
              Termos e Validação de Dados
            </h4>
            <ul className="space-y-4">
              <li className="p-3 bg-white rounded-xl border border-gray-100">
                <strong>1. Validação Documental Prévia:</strong> O usuário declara que todos os meios de prova necessários para confirmar sua condição de responsável legal (RG, Certidão de Nascimento, Termo de Guarda ou correlatos) <strong>já foram entregues previamente à instituição de ensino</strong>, sendo esta a base legal para a concessão deste acesso digital.
              </li>
              <li>
                <strong>2. Privacidade e LGPD:</strong> Autorizo o tratamento de dados pedagógicos do menor exclusivamente para fins de personalização de ensino, conforme o Art. 14 da LGPD.
              </li>
              <li>
                <strong>3. Metodologia IA:</strong> Compreendo que a Luma utiliza o Método Socrático, priorizando o desenvolvimento cognitivo e o foco de longo prazo em vez de respostas imediatas.
              </li>
              <li>
                <strong>4. Supervisão:</strong> Estou ciente de que o sistema possui filtros contra conteúdos inadequados e que o acesso do aluno é monitorado pelo professor.
              </li>
            </ul>
          </div>

          <label className="flex items-center gap-4 cursor-pointer group bg-purple-50/50 p-4 rounded-2xl border border-transparent hover:border-purple-200 transition-all">
            <input 
              type="checkbox" 
              checked={aceitou}
              onChange={() => setAceitou(!aceitou)}
              className="w-6 h-6 rounded-lg border-gray-300 text-[#2D1B69] focus:ring-[#2D1B69] transition-all cursor-pointer"
            />
            <span className="text-sm font-bold text-gray-700 group-hover:text-[#2D1B69]">
              Confirmo minha responsabilidade legal e aceito os termos.
            </span>
          </label>

          <button 
            onClick={handleConfirmar}
            disabled={!aceitou}
            className="w-full py-5 bg-[#2D1B69] text-white rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-purple-900/20 disabled:opacity-20 disabled:grayscale cursor-pointer"
          >
            Assinar e Acessar Portal <ArrowRight size={20} />
          </button>

          <p className="text-center text-[10px] text-gray-400 uppercase font-bold tracking-widest">
            Acesso Restrito • Validação de Perfil via Secretaria Escolar
          </p>
        </div>
      </div>
    </div>
  );
}