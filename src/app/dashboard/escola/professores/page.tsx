"use client";

import { useState, useEffect } from "react";
import { Loader2, ChevronDown, ChevronUp, GraduationCap, Clock, BookOpen, Trash2, AlertTriangle } from "lucide-react";

const DIAS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

type AulaGrade = {
  diaSemana: number;
  horaInicio: string;
  horaFim: string;
  componente: string;
  serie: string;
};

type Professor = {
  id: string;
  nome: string;
  email: string;
  materias: string[];
  anos: string[];
  grade: AulaGrade[];
  criadoEm: string;
};

export default function EscolaProfessoresPage() {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [expandido, setExpandido] = useState<string | null>(null);
  const [confirmarExclusao, setConfirmarExclusao] = useState<string | null>(null);
  const [excluindo, setExcluindo] = useState<string | null>(null);

  async function carregarProfessores() {
    setCarregando(true);
    fetch("/api/escola/professores/detalhes")
      .then((r) => r.json())
      .then(setProfessores)
      .finally(() => setCarregando(false));
  }

  useEffect(() => { carregarProfessores(); }, []);

  async function handleExcluir(id: string) {
    setExcluindo(id);
    try {
      const res = await fetch(`/api/escola/professores/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProfessores((p) => p.filter((prof) => prof.id !== id));
        setConfirmarExclusao(null);
        setExpandido(null);
      }
    } finally {
      setExcluindo(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-[#2D1B69]">Professores</h2>
          <p className="text-sm text-gray-500">Grade horária, matérias e turmas de cada professor</p>
        </div>
        <span className="text-sm text-gray-400">{professores.length} professor{professores.length !== 1 ? "es" : ""}</span>
      </div>

      {carregando ? (
        <div className="flex justify-center py-16">
          <Loader2 size={28} className="animate-spin text-[#2D1B69]" />
        </div>
      ) : professores.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-purple-100 p-16 text-center">
          <GraduationCap size={40} className="mx-auto text-purple-200 mb-4" />
          <p className="font-bold text-gray-700">Nenhum professor cadastrado ainda</p>
          <p className="text-sm text-gray-400 mt-1">Gere um convite na visão geral para convidar professores.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {professores.map((prof) => (
            <div key={prof.id} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="flex items-center px-6 py-4">
                <button
                  onClick={() => setExpandido(expandido === prof.id ? null : prof.id)}
                  className="flex-1 flex items-center justify-between hover:opacity-80 transition-opacity"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-[#2D1B69] font-bold text-sm">
                      {prof.nome.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">{prof.nome}</p>
                      <p className="text-xs text-gray-400">{prof.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex gap-2">
                      {prof.materias.slice(0, 3).map((m) => (
                        <span key={m} className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">{m}</span>
                      ))}
                      {prof.materias.length > 3 && (
                        <span className="text-[10px] text-gray-400">+{prof.materias.length - 3}</span>
                      )}
                    </div>
                    {expandido === prof.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </button>

                {/* Botão excluir */}
                <button
                  onClick={() => setConfirmarExclusao(prof.id)}
                  className="ml-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  title="Remover professor"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Confirmação de exclusão */}
              {confirmarExclusao === prof.id && (
                <div className="mx-6 mb-4 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-4">
                  <AlertTriangle size={18} className="text-red-500 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-red-700">Excluir {prof.nome}?</p>
                    <p className="text-xs text-red-500 mt-0.5">Todos os dados deste professor serão removidos permanentemente.</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setConfirmarExclusao(null)}
                      className="px-3 py-1.5 text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleExcluir(prof.id)}
                      disabled={excluindo === prof.id}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 disabled:opacity-50 transition-all flex items-center gap-1.5"
                    >
                      {excluindo === prof.id ? <Loader2 size={12} className="animate-spin" /> : null}
                      Confirmar exclusão
                    </button>
                  </div>
                </div>
              )}

              {/* Detalhes expandidos */}
              {expandido === prof.id && (
                <div className="px-6 pb-6 space-y-5 border-t border-gray-50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen size={14} className="text-[#2D1B69]" />
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Matérias</span>
                      </div>
                      {prof.materias.length === 0 ? (
                        <p className="text-xs text-gray-300">Não informado</p>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {prof.materias.map((m) => (
                            <span key={m} className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-xl font-medium">{m}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <GraduationCap size={14} className="text-[#2D1B69]" />
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Séries</span>
                      </div>
                      {prof.anos.length === 0 ? (
                        <p className="text-xs text-gray-300">Não informado</p>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {prof.anos.map((a) => (
                            <span key={a} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-xl font-medium">{a}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Grade Horária */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock size={14} className="text-[#2D1B69]" />
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Grade Horária</span>
                    </div>
                    {prof.grade.length === 0 ? (
                      <p className="text-xs text-gray-300">Grade não preenchida ainda</p>
                    ) : (
                      <div className="space-y-2">
                        {DIAS.map((dia, idx) => {
                          const aulas = prof.grade.filter((g) => g.diaSemana === idx);
                          if (aulas.length === 0) return null;
                          return (
                            <div key={dia} className="flex gap-3 items-start">
                              <span className="text-xs font-bold text-gray-400 w-16 pt-1 shrink-0">{dia}</span>
                              <div className="flex flex-wrap gap-2">
                                {aulas.map((aula, i) => (
                                  <div key={i} className="flex items-center gap-1.5 bg-purple-50 rounded-xl px-3 py-1.5">
                                    <span className="text-xs font-bold text-[#2D1B69]">{aula.componente}</span>
                                    <span className="text-[10px] text-gray-400">{aula.serie}</span>
                                    <span className="text-[10px] text-gray-300">{aula.horaInicio}–{aula.horaFim}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] text-gray-300">
                    Cadastrado em {new Date(prof.criadoEm).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}