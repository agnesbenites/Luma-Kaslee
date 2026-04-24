"use client";

import { ShieldCheck, FileWarning, CheckCircle, Share2, ExternalLink, Lock } from "lucide-react";
import Link from "next/link";

const pendencias = [
  { id: 1, aluno: "Ana Silva", turma: "9º Ano A", responsavel: "Maria Silva", status: "Pendente" },
  { id: 2, aluno: "Bruno Costa", turma: "9º Ano A", responsavel: "João Costa", status: "Enviado" },
];

export default function ConsentimentosPage() {
  
  const copiarLink = () => {
    // Aqui gera o link que a escola enviará para os pais
    const linkParaPais = `${window.location.origin}/dashboard/escola/legal`;
    navigator.clipboard.writeText(linkParaPais);
    alert("Link da Central Legal copiado para a área de transferência!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">ECA & Conformidade Digital</h2>
          <p className="text-sm text-gray-500">Gestão de autorizações e transparência jurídica</p>
        </div>
        <button 
          onClick={copiarLink}
          className="flex items-center gap-2 px-4 py-2 bg-[#F5C542] text-[#2D1B69] rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-sm"
        >
          <Share2 size={16} /> Compartilhar Link com Pais
        </button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 border-l-4 border-yellow-400">
          <p className="text-sm text-gray-500 font-medium">Pendentes de Assinatura</p>
          <h3 className="text-3xl font-bold text-gray-800 mt-1">142</h3>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 border-l-4 border-green-500">
          <p className="text-sm text-gray-500 font-medium">Termos Assinados</p>
          <h3 className="text-3xl font-bold text-gray-800 mt-1">1.098</h3>
        </div>
        <div className="p-6 bg-[#2D1B69] rounded-2xl shadow-sm text-white">
          <p className="text-sm opacity-80 font-medium">Índice de Conformidade</p>
          <h3 className="text-3xl font-bold mt-1">88.5%</h3>
        </div>
      </div>

      {/* Seção de Documentação Estilo App */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-purple-50 rounded-xl text-[#2D1B69]">
              <Lock size={24} />
            </div>
            <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">AUDITADO</span>
          </div>
          <div className="mt-4">
            <h4 className="font-bold text-gray-800">Termos de Uso e IA</h4>
            <p className="text-xs text-gray-500 mt-1">Regras de utilização da Luma e responsabilidades da escola.</p>
          </div>
          <Link 
            href="/dashboard/escola/legal" 
            className="mt-4 flex items-center gap-2 text-sm font-bold text-[#2D1B69] hover:underline"
          >
            Visualizar documento completo <ExternalLink size={14} />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <ShieldCheck size={24} />
            </div>
            <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">LGPD COMPLIANT</span>
          </div>
          <div className="mt-4">
            <h4 className="font-bold text-gray-800">Privacidade de Menores</h4>
            <p className="text-xs text-gray-500 mt-1">Como protegemos os dados dos alunos seguindo o ECA Digital.</p>
          </div>
          <Link 
            href="/dashboard/escola/legal" 
            className="mt-4 flex items-center gap-2 text-sm font-bold text-[#2D1B69] hover:underline"
          >
            Visualizar política de privacidade <ExternalLink size={14} />
          </Link>
        </div>
      </div>

      {/* Lista de Alunos Pendentes */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-gray-800">Aguardando Consentimento Parental</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-[10px] uppercase font-bold text-gray-400 tracking-widest">
              <tr>
                <th className="px-6 py-4">Aluno</th>
                <th className="px-6 py-4">Turma</th>
                <th className="px-6 py-4">Responsável</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pendencias.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-700">{item.aluno}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.turma}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.responsavel}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="px-3 py-1 bg-[#2D1B69] text-white text-[11px] font-bold rounded-lg hover:bg-[#1a0f3d]">
                      Reenviar Termo
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}