"use client";

import React from "react";
import { 
  GraduationCap, Clock, Activity, ShieldCheck, 
  Brain, FileText, CheckCircle2, TrendingUp 
} from "lucide-react";

export default function DashboardPaisPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-purple-50 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-[#2D1B69]">Ana Silva</h1>
          <p className="text-gray-500 font-medium">9º Ano A • Escola Kaslee Digital</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black bg-green-100 text-green-700 px-3 py-1 rounded-full uppercase">Conformidade Ativa</span>
        </div>
      </header>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <Clock className="text-purple-600 mb-2" size={20} />
          <p className="text-[10px] font-black text-gray-400 uppercase">Tempo de IA</p>
          <h3 className="text-2xl font-black text-gray-800">2h 45m</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <Activity className="text-blue-600 mb-2" size={20} />
          <p className="text-[10px] font-black text-gray-400 uppercase">Nível de Foco</p>
          <h3 className="text-2xl font-black text-gray-800">88%</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <TrendingUp className="text-green-600 mb-2" size={20} />
          <p className="text-[10px] font-black text-gray-400 uppercase">Evolução</p>
          <h3 className="text-2xl font-black text-gray-800">+12%</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <ShieldCheck className="text-orange-500 mb-2" size={20} />
          <p className="text-[10px] font-black text-gray-400 uppercase">Frequência</p>
          <h3 className="text-2xl font-black text-gray-800">97%</h3>
        </div>
      </div>

      {/* Boletim Simplificado para Teste */}
      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
        <h3 className="font-black text-[#2D1B69] text-xl">Boletim Escolar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["Matemática", "Português", "História", "Ciências"].map((materia) => (
            <div key={materia} className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl">
              <span className="font-bold text-gray-700">{materia}</span>
              <span className="text-xl font-black text-[#2D1B69]">9.0</span>
            </div>
          ))}
        </div>
      </div>

      {/* Alerta de Metodologia */}
      <div className="bg-[#2D1B69] text-white p-10 rounded-[3rem] flex items-center gap-6">
        <Brain size={40} className="text-[#F5C542]" />
        <div>
          <h4 className="font-black text-lg">Adaptação Socrática</h4>
          <p className="text-sm opacity-70">Ana está demonstrando alta capacidade de raciocínio lógico e autonomia nos desafios semanais.</p>
        </div>
      </div>
    </div>
  );
}