"use client";

import { useState } from "react";
import { Loader2, Sparkles, Save, ChevronDown, ChevronUp, CheckCircle, AlertCircle, XCircle, User } from "lucide-react";

type Resposta = {
  id: string;
  pergunta: string;
  texto: string;
  tempoEscrita: number;
  turno: number;
  sinalEmocional: string | null;
  alinhamentoBNCC: number | null;
  criadoEm: string;
  sessao: { titulo: string; ancora: string };
};

type Aluno = {
  id: string;
  nome: string;
  email: string;
  respostas: Resposta[];
  interacoes: { resumo: string | null; criadoEm: string }[];
};

type Turma = {
  id: string;
  nome: string;
  serie: string;
  alunos: Aluno[];
  sessoes: { id: string; titulo: string; status: string; criadoEm: string; _count: { respostas: number } }[];
};

type Parecer = {
  alunoId: string;
  texto: string;
  status: "APROVADO" | "RECUPERACAO" | "REPROVADO";
  salvo: boolean;
};

const STATUS_CONFIG = {
  APROVADO: { label: "Aprovado", icon: <CheckCircle size={14} />, cor: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
  RECUPERACAO: { label: "Recuperação", icon: <AlertCircle size={14} />, cor: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  REPROVADO: { label: "Reprovado", icon: <XCircle size={14} />, cor: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
};

export default function ConselhoClasse({ turmas, pareceresSalvos }: { turmas: Turma[]; pareceresSalvos: any[] }) {
  const [turmaSelecionada, setTurmaSelecionada] = useState<Turma | null>(turmas[0] ?? null);
  const [alunoExpandido, setAlunoExpandido] = useState<string | null>(null);
  const [pareceres, setPareceres] = useState<Record<string, Parecer>>(() => {
    const inicial: Record<string, Parecer> = {};
    pareceresSalvos.forEach((p: any) => {
      inicial[p.alunoId] = { alunoId: p.alunoId, texto: p.texto, status: p.status, salvo: true };
    });
    return inicial;
  });
  const [gerando, setGerando] = useState<string | null>(null);
  const [salvando, setSalvando] = useState<string | null>(null);

  async function gerarParecer(aluno: Aluno) {
    setGerando(aluno.id);
    try {
      const res = await fetch("/api/professor/parecer/gerar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alunoId: aluno.id }),
      });
      const data = await res.json();
      setPareceres((p) => ({
        ...p,
        [aluno.id]: {
          alunoId: aluno.id,
          texto: data.parecer,
          status: data.statusSugerido ?? "APROVADO",
          salvo: false,
        },
      }));
    } catch {
      alert("Erro ao gerar parecer.");
    } finally {
      setGerando(null);
    }
  }

  async function salvarParecer(alunoId: string, turmaId: string) {
    const parecer = pareceres[alunoId];
    if (!parecer) return;
    setSalvando(alunoId);
    try {
      await fetch("/api/professor/parecer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alunoId, turmaId, texto: parecer.texto, status: parecer.status }),
      });
      setPareceres((p) => ({ ...p, [alunoId]: { ...p[alunoId], salvo: true } }));
    } catch {
      alert("Erro ao salvar.");
    } finally {
      setSalvando(null);
    }
  }

  function atualizarParecer(alunoId: string, campo: "texto" | "status", valor: string) {
    setPareceres((p) => ({ ...p, [alunoId]: { ...p[alunoId], [campo]: valor, salvo: false } }));
  }

  if (turmas.length === 0) {
    return (
      <div className="bg-white rounded-[2rem] border border-purple-100 p-16 text-center">
        <p className="font-bold text-gray-700">Nenhuma turma encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Seletor de turma */}
      <div className="flex gap-2 flex-wrap">
        {turmas.map((t) => (
          <button key={t.id} onClick={() => setTurmaSelecionada(t)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              turmaSelecionada?.id === t.id ? "bg-[#2D1B69] text-white" : "bg-white border border-gray-100 text-gray-500 hover:border-purple-200"
            }`}>
            {t.nome} · {t.serie}
          </button>
        ))}
      </div>

      {turmaSelecionada && (
        <div className="space-y-3">
          {/* Resumo da turma */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Alunos", valor: turmaSelecionada.alunos.length },
              { label: "Sessões", valor: turmaSelecionada.sessoes.length },
              { label: "Pareceres salvos", valor: Object.values(pareceres).filter((p) => p.salvo).length },
            ].map(({ label, valor }) => (
              <div key={label} className="bg-white rounded-[1.5rem] border border-gray-100 p-4 text-center">
                <p className="text-2xl font-bold text-[#2D1B69]">{valor}</p>
                <p className="text-xs text-gray-400 mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Lista de alunos */}
          <div className="space-y-3">
            {turmaSelecionada.alunos.map((aluno) => {
              const parecer = pareceres[aluno.id];
              const totalRespostas = aluno.respostas.length;
              const tempoMedio = totalRespostas > 0
                ? Math.round(aluno.respostas.reduce((acc, r) => acc + r.tempoEscrita, 0) / totalRespostas / 1000)
                : 0;
              const alertas = aluno.respostas.filter((r) => r.sinalEmocional === "alerta").length;

              return (
                <div key={aluno.id} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden">
                  {/* Header do aluno */}
                  <div className="flex items-center px-6 py-4">
                    <button onClick={() => setAlunoExpandido(alunoExpandido === aluno.id ? null : aluno.id)}
                      className="flex-1 flex items-center justify-between hover:opacity-80 transition-opacity">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-[#2D1B69] font-bold text-sm">
                          {aluno.nome.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-sm text-gray-800">{aluno.nome}</p>
                          <div className="flex gap-3 mt-0.5">
                            <span className="text-[10px] text-gray-400">{totalRespostas} respostas</span>
                            {tempoMedio > 0 && <span className="text-[10px] text-gray-400">{tempoMedio}s médio</span>}
                            {alertas > 0 && <span className="text-[10px] text-red-400">⚠ {alertas} alertas</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {parecer?.salvo && (
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${STATUS_CONFIG[parecer.status].bg} ${STATUS_CONFIG[parecer.status].cor} ${STATUS_CONFIG[parecer.status].border}`}>
                            {STATUS_CONFIG[parecer.status].icon}
                            {STATUS_CONFIG[parecer.status].label}
                          </span>
                        )}
                        {alunoExpandido === aluno.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                      </div>
                    </button>
                  </div>

                  {/* Detalhes expandidos */}
                  {alunoExpandido === aluno.id && (
                    <div className="px-6 pb-6 border-t border-gray-50 pt-4 space-y-5">
                      {/* Histórico de respostas */}
                      {aluno.respostas.length > 0 && (
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Últimas respostas</p>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {aluno.respostas.slice(0, 5).map((r) => (
                              <div key={r.id} className="bg-gray-50 rounded-2xl p-3">
                                <p className="text-[10px] text-gray-400 mb-1">{r.sessao.titulo} · {Math.round(r.tempoEscrita / 1000)}s</p>
                                <p className="text-xs text-gray-600 italic">"{r.texto.substring(0, 120)}{r.texto.length > 120 ? "..." : ""}"</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Área do parecer */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Parecer do conselho</p>
                          <button onClick={() => gerarParecer(aluno)} disabled={gerando === aluno.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#2D1B69] rounded-xl hover:opacity-90 disabled:opacity-50">
                            {gerando === aluno.id ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                            {parecer ? "Regenerar com IA" : "Gerar com IA"}
                          </button>
                        </div>

                        {parecer ? (
                          <div className="space-y-3">
                            <textarea
                              value={parecer.texto}
                              onChange={(e) => atualizarParecer(aluno.id, "texto", e.target.value)}
                              rows={5}
                              className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm border border-gray-100 focus:ring-2 focus:ring-purple-200 outline-none resize-none leading-relaxed"
                              placeholder="Escreva ou edite o parecer do aluno..."
                            />

                            {/* Status */}
                            <div className="flex gap-2">
                              {(["APROVADO", "RECUPERACAO", "REPROVADO"] as const).map((s) => (
                                <button key={s} onClick={() => atualizarParecer(aluno.id, "status", s)}
                                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                                    parecer.status === s
                                      ? `${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].cor} ${STATUS_CONFIG[s].border}`
                                      : "bg-gray-50 text-gray-400 border-gray-100 hover:border-gray-200"
                                  }`}>
                                  {STATUS_CONFIG[s].icon}
                                  {STATUS_CONFIG[s].label}
                                </button>
                              ))}
                            </div>

                            <button onClick={() => salvarParecer(aluno.id, turmaSelecionada.id)}
                              disabled={salvando === aluno.id || parecer.salvo}
                              className="w-full py-2.5 bg-[#2D1B69] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50">
                              {salvando === aluno.id ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                              {parecer.salvo ? "✓ Salvo" : "Salvar parecer"}
                            </button>
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded-2xl p-8 text-center">
                            <Sparkles size={24} className="mx-auto text-purple-200 mb-2" />
                            <p className="text-sm text-gray-400">Clique em "Gerar com IA" para criar um parecer baseado nas sessões do aluno.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
