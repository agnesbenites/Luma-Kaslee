"use client";

import React from "react";
import { PaisSidebar } from "@/components/pais/PaisSidebar";

/**
 * Layout Principal do Ambiente dos Pais
 * Responsável por manter a Sidebar fixa e o conteúdo dinâmico
 */
function LayoutDosPais({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#FDFCFE]">
      {/* Sidebar - Componente Lateral */}
      <PaisSidebar />

      {/* Área Principal de Conteúdo */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header Superior de Contexto */}
        <header className="h-20 border-b border-purple-50 bg-white/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Acompanhamento em Tempo Real
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-[#2D1B69]">Responsável Legal</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Identidade Validada</p>
            </div>
            <div className="w-10 h-10 bg-[#2D1B69] rounded-2xl flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-purple-200">
              RL
            </div>
          </div>
        </header>

        {/* Scroll do Conteúdo das Páginas */}
        <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
          {children}
        </div>
      </main>
    </div>
  );
}

export default LayoutDosPais;