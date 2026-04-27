"use client";

import { useState, useEffect } from "react";
import { Loader2, FileText, Users, Share2, CheckCircle, AlertCircle, Search, ChevronDown, ChevronUp } from "lucide-react";

type Aluno = {
  id: string;
  nome: string;
  turma: string;
  serie: string;
  status: "APROVADO" | "RECUPERACAO" | "PENDENTE";
  mediaGeral: number;
  faltas: number;
  conselho: string | null;
  compartilhadoPais: boolean;
};

type Turma = {
  id: string;
  nome: string;
  serie: string;
  alunos: Aluno[];
};

export default function BoletinsPage() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [expandido, setExpandido] = useState<string | null>(null);
  const [compartilhando, setCompartilhando] = useState<string | null>(null);
  const [filtroStatus, setFiltroStatus] = useState("TODOS");

  useEffect(() => {
    fetch("/api/escola/boletins")
      .then((r) => r.json())
      .then(setTurmas)
      .finally(() => setCarregando(false));
  }, []);

  async function compartilharComPais(alunoId: string) {
    setCompartilhando(alunoId);
    try {
      await fetch(`/api/escola/boletins/${alunoId}/compartilhar`, { method: "POST" });
      setTurmas((turmas) => turmas.map((t) => ({
        ...t,
        alunos: t.alunos.map((a) => a.id === alunoId ? { ...a, compartilhadoPais: true } : a),
      })));
    } finally {
      setCompartilhando(null);
    }
  }

  const statusConfig = {
    APROVADO: { label: "Aprovado", color: "text-green-600", bg: "bg-green-50", border: "border-green-100" },
    RECUPERACAO: { label: "Recuperação", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
    PENDENTE: { label: "Pendente", color: "text-gray-500", bg: "bg-gray-50", border: "border-gray-100" },
  };

  const todasTurmasFiltradas = turmas.map((turma) => ({
    ...turma,
    alunos: turma.alunos.filter((a) => {
      const buscaOk = a.nome.toLowerCase().includes(busca.toLowerCase());
      const statusOk = filtroStatus === "TODOS" || a.status === filtroStatus;
      return buscaOk && statusOk;
    }),
  })).filter((t) => t.alunos.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-[#2D1B69]">Boletins e Relatórios</h2>
          <p className="text-sm text-gray-500">Resultados por aluno, conselho de classe e compartilhamento com pais</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-[200px]">
          <input type="text" value={busca} onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar aluno..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-purple-200 outline-none" />
          <Search className="absolute left-3 top-3 text-gray-300" size={16} />
        </div>
        <div className="flex gap-2">
          {["TODOS", "APROVADO", "RECUPERACAO", "PENDENTE"].map((s) => (
            <button key={s} onClick={() => setFiltroStatus(s)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                filtroStatus === s ? "bg-[#2D1B69] text-white" : "bg-white border border-gray-100 text-gray-500 hover:border-purple-200"
              }`}>
              {s === "TODOS" ? "Todos" : s === "APROVADO" ? "Aprovados" : s === "RECUPERACAO" ? "Recuperação" : "Pendentes"}
            </button>
          ))}
        </div>
      </div>

      {carregando ? (
        <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-[#2D1B69]" /></div>
      ) : todasTurmasFiltradas.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-purple-100 p-16 text-center">
          <FileText size={40} className="mx-auto text-purple-200 mb-4" />
          <p className="font-bold text-gray-700">Nenhum boletim encontrado</p>
          <p className="text-sm text-gray-400 mt-1">Os boletins aparecem após o fechamento do semestre pelo professor.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {todasTurmasFiltradas.map((turma) => (
            <div key={turma.id} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden">
              <button onClick={() => setExpandido(expandido === turma.id ? null : turma.id)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-xl text-[#2D1B69]"><Users size={16} /></div>
                  <div className="text-left">
                    <p className="font-bold text-gray-800">{turma.nome}</p>
                    <p className="text-xs text-gray-400">{turma.serie} · {turma.alunos.length} alunos</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold">
                      {turma.alunos.filter((a) => a.status === "APROVADO").length} aprovados
                    </span>
                    <span className="text-[10px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-bold">
                      {turma.alunos.filter((a) => a.status === "RECUPERACAO").length} recuperação
                    </span>
                  </div>
                  {expandido === turma.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </div>
              </button>

              {expandido === turma.id && (
                <div className="border-t border-gray-50">
                  <div className="divide-y divide-gray-50">
                    {turma.alunos.map((aluno) => {
                      const cfg = statusConfig[aluno.status];
                      return (
                        <div key={aluno.id} className="px-6 py-4 flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-[#2D1B69] font-bold text-xs shrink-0">
                            {aluno.nome.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-gray-800">{aluno.nome}</p>
                            {aluno.conselho && (
                              <p className="text-xs text-gray-400 mt-0.5 truncate">"{aluno.conselho}"</p>
                            )}
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                              {cfg.label}
                            </span>
                            {aluno.compartilhadoPais ? (
                              <div className="flex items-center gap-1 text-green-500">
                                <CheckCircle size={14} />
                                <span className="text-[10px] font-bold">Enviado</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => compartilharComPais(aluno.id)}
                                disabled={compartilhando === aluno.id || aluno.status === "PENDENTE"}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2D1B69] text-white rounded-xl text-[10px] font-bold hover:opacity-90 disabled:opacity-40 transition-all"
                              >
                                {compartilhando === aluno.id ? <Loader2 size={10} className="animate-spin" /> : <Share2 size={10} />}
                                Compartilhar com pais
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}