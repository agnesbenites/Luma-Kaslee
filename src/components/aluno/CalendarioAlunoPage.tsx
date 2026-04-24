"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Sparkles, Clock, ChevronLeft, ChevronRight, X } from "lucide-react";

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const CORES_STATUS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  PLANEJADA:  { bg: "rgba(196,181,253,0.12)", border: "rgba(196,181,253,0.3)", text: "#C4B5FD", dot: "#A78BFA" },
  PROVA:      { bg: "rgba(249,115,22,0.12)",  border: "rgba(249,115,22,0.3)",  text: "#FB923C", dot: "#F97316" },
  ENTREGA:    { bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.3)",  text: "#34D399", dot: "#10B981" },
  REVISAO:    { bg: "rgba(245,166,35,0.12)",  border: "rgba(245,166,35,0.3)",  text: "#FBB83F", dot: "#F5A623" },
  default:    { bg: "rgba(196,181,253,0.08)", border: "rgba(196,181,253,0.15)", text: "#A78BFA", dot: "#7C3AED" },
};

const CORES_COMPONENTE: Record<string, string> = {
  Matemática: "#A78BFA", Português: "#F472B6", Ciências: "#34D399",
  História: "#FBB83F", Geografia: "#60A5FA", default: "#C4B5FD",
};

type Feriado = { date: string; name: string; type: string };

type Atividade = {
  id: string;
  titulo: string;
  descricao: string | null;
  data: string;
  status: string;
  sessao: { id: string; titulo: string; ancora: string; status: string } | null;
};

type GradeItem = {
  id: string;
  diaSemana: number;
  horaInicio: string;
  horaFim: string;
  componente: string;
  sessao: { id: string; titulo: string; ancora: string; status: string } | null;
};

type Props = {
  aluno: { nome: string; turma: string; serie: string };
  atividades: Atividade[];
  grade: GradeItem[];
};

function inicioDoDia(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function sameDay(a: Date, b: Date) {
  return inicioDoDia(a).getTime() === inicioDoDia(b).getTime();
}

function toLocalDate(isoString: string) {
  const [year, month, day] = isoString.split("T")[0].split("-").map(Number);
  return new Date(year, month - 1, day);
}

export default function CalendarioAlunoPage({ aluno, atividades, grade }: Props) {
  const hoje = new Date();
  const [mes, setMes] = useState(hoje.getMonth());
  const [ano, setAno] = useState(hoje.getFullYear());
  const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [feriados, setFeriados] = useState<Feriado[]>([]);
  const [loadingFeriados, setLoadingFeriados] = useState(true);

  useEffect(() => {
    async function buscarFeriados() {
      try {
        setLoadingFeriados(true);
        const res = await fetch(`https://brasilapi.com.br/api/feriados/v1/${ano}`);
        const data = await res.json();
        setFeriados(data || []);
      } catch {
        setFeriados([]);
      } finally {
        setLoadingFeriados(false);
      }
    }
    buscarFeriados();
  }, [ano]);

  const feriadosDoDia = (dia: Date) =>
    feriados.filter((f) => sameDay(toLocalDate(f.date), dia));

  const diasDoMes = useMemo(() => {
    const primeiro = new Date(ano, mes, 1);
    const ultimo = new Date(ano, mes + 1, 0);
    const diasAntes = primeiro.getDay();
    const dias: (Date | null)[] = [];
    for (let i = 0; i < diasAntes; i++) dias.push(null);
    for (let d = 1; d <= ultimo.getDate(); d++) dias.push(new Date(ano, mes, d));
    const semanas = Math.ceil(dias.length / 7);
    while (dias.length < semanas * 7) dias.push(null);
    return dias;
  }, [mes, ano]);

  function atividadesDoDia(dia: Date) {
    return atividades.filter((a) => sameDay(toLocalDate(a.data), dia));
  }

  function gradeDoDia(dia: Date) {
    const diaN = dia.getDay() === 0 ? 7 : dia.getDay();
    return grade.filter((g) => g.diaSemana === diaN);
  }

  function abrirDia(dia: Date) {
    setDiaSelecionado(dia);
    setDrawer(true);
  }

  function mesAnterior() {
    if (mes === 0) { setMes(11); setAno(a => a - 1); }
    else setMes(m => m - 1);
  }

  function proximoMes() {
    if (mes === 11) { setMes(0); setAno(a => a + 1); }
    else setMes(m => m + 1);
  }

  const itensDrawer = diaSelecionado ? {
    atividades: atividadesDoDia(diaSelecionado),
    grade: gradeDoDia(diaSelecionado),
    feriados: feriadosDoDia(diaSelecionado),
  } : { atividades: [], grade: [], feriados: [] };

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: "linear-gradient(135deg, #0D0720 0%, #1A0D40 60%, #2D1B69 100%)" }}>
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Calendário</h1>
            <p className="text-sm mt-0.5" style={{ color: "#C4B5FD" }}>
              {aluno.turma} · {aluno.serie}
            </p>
          </div>
          <Link
            href="/dashboard/aluno"
            className="rounded-2xl border px-4 py-2 text-sm font-medium transition-all hover:bg-white/5"
            style={{ borderColor: "#3D2B7A", color: "#A78BFA" }}
          >
            ← Voltar
          </Link>
        </div>

        {/* Navegação do mês */}
        <div className="mb-6 flex items-center justify-between">
          <button onClick={mesAnterior} className="p-2 rounded-xl hover:bg-white/5 transition-colors" style={{ color: "#A78BFA" }}>
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-lg font-bold text-white">
            {MESES[mes]} {ano}
          </h2>
          <button onClick={proximoMes} className="p-2 rounded-xl hover:bg-white/5 transition-colors" style={{ color: "#A78BFA" }}>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Legenda */}
        <div className="mb-4 flex flex-wrap gap-3">
          {[["PLANEJADA", "Atividade"], ["PROVA", "Prova"], ["ENTREGA", "Entrega"], ["REVISAO", "Revisão"]].map(([status, label]) => {
            const cor = CORES_STATUS[status];
            return (
              <div key={status} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: cor.dot }} />
                <span className="text-xs" style={{ color: "#9CA3AF" }}>{label}</span>
              </div>
            );
          })}
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white/30" />
            <span className="text-xs" style={{ color: "#9CA3AF" }}>Aula</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: "#F87171" }} />
            <span className="text-xs" style={{ color: "#9CA3AF" }}>Feriado</span>
          </div>
        </div>

        {/* Grid do calendário */}
        <div className="rounded-3xl overflow-hidden border" style={{ borderColor: "#3D2B7A", background: "#1A0D40" }}>
          <div className="grid grid-cols-7 border-b" style={{ borderColor: "#3D2B7A" }}>
            {DIAS_SEMANA.map((d) => (
              <div key={d} className="py-3 text-center text-xs font-semibold" style={{ color: "#6D4FA0" }}>
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {diasDoMes.map((dia, idx) => {
              if (!dia) return (
                <div key={`vazio-${idx}`} className="min-h-[80px] border-b border-r" style={{ borderColor: "#2D1B50" }} />
              );

              const isHoje = sameDay(dia, hoje);
              const isSelecionado = diaSelecionado ? sameDay(dia, diaSelecionado) : false;
              const atsDia = atividadesDoDia(dia);
              const gradeDia = gradeDoDia(dia);
              const feriadosDia = feriadosDoDia(dia);
              const isFeriado = feriadosDia.length > 0;
              const isDomingo = dia.getDay() === 0;

              return (
                <button
                  key={dia.toISOString()}
                  onClick={() => abrirDia(dia)}
                  className="min-h-[80px] p-2 border-b border-r text-left transition-all hover:bg-white/5 flex flex-col"
                  style={{
                    borderColor: "#2D1B50",
                    background: isSelecionado
                      ? "rgba(196,181,253,0.1)"
                      : isHoje
                      ? "rgba(124,58,237,0.15)"
                      : isFeriado
                      ? "rgba(248,113,113,0.05)"
                      : "transparent",
                  }}
                >
                  <span
                    className="text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full mb-1"
                    style={{
                      background: isHoje ? "#7C3AED" : "transparent",
                      color: isHoje ? "white" : isFeriado || isDomingo ? "#F87171" : isSelecionado ? "#C4B5FD" : "#E9D5FF",
                    }}
                  >
                    {dia.getDate()}
                  </span>

                  <div className="flex flex-col gap-0.5 flex-1">
                    {/* Feriado */}
                    {isFeriado && (
                      <div className="text-[9px] truncate font-medium" style={{ color: "#F87171" }}>
                        🎉 {feriadosDia[0].name}
                      </div>
                    )}

                    {/* Grade */}
                    {gradeDia.slice(0, 1).map((g) => (
                      <div key={g.id} className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: CORES_COMPONENTE[g.componente] || CORES_COMPONENTE.default }} />
                        <span className="text-[10px] truncate" style={{ color: "#9CA3AF" }}>{g.componente}</span>
                      </div>
                    ))}

                    {/* Atividades */}
                    {atsDia.slice(0, 1).map((a) => {
                      const cor = CORES_STATUS[a.status] || CORES_STATUS.default;
                      return (
                        <div
                          key={a.id}
                          className="rounded px-1 py-0.5 text-[10px] font-medium truncate"
                          style={{ background: cor.bg, color: cor.text }}
                        >
                          {a.titulo}
                        </div>
                      );
                    })}

                    {(atsDia.length + gradeDia.length) > 2 && (
                      <span className="text-[10px]" style={{ color: "#6D4FA0" }}>
                        +{atsDia.length + gradeDia.length - 2} mais
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Próximas atividades */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "#6D4FA0" }}>
            Próximas atividades
          </h3>
          <div className="flex flex-col gap-3">
            {atividades
              .filter((a) => toLocalDate(a.data) >= inicioDoDia(hoje))
              .slice(0, 5)
              .map((a) => {
                const cor = CORES_STATUS[a.status] || CORES_STATUS.default;
                const data = toLocalDate(a.data);
                return (
                  <div
                    key={a.id}
                    className="flex items-start gap-4 rounded-2xl border p-4"
                    style={{ background: cor.bg, borderColor: cor.border }}
                  >
                    <div className="text-center flex-shrink-0">
                      <p className="text-xs font-medium" style={{ color: cor.text }}>{MESES[data.getMonth()].slice(0, 3)}</p>
                      <p className="text-2xl font-bold text-white leading-none">{data.getDate()}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white">{a.titulo}</p>
                      {a.descricao && <p className="text-sm mt-0.5 truncate" style={{ color: "#9CA3AF" }}>{a.descricao}</p>}
                      {a.sessao && (
                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                          <span className="text-xs flex items-center gap-1" style={{ color: cor.text }}>
                            <BookOpen size={11} />
                            {a.sessao.titulo}
                          </span>
                          <Link
                            href={`/dashboard/aluno/nova?sessaoId=${a.sessao.id}`}
                            className="text-xs flex items-center gap-1 rounded-lg px-2 py-1 transition-all hover:opacity-80"
                            style={{ background: "rgba(196,181,253,0.15)", color: "#C4B5FD" }}
                          >
                            <Sparkles size={10} />
                            Revisar com Nova
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            {atividades.filter((a) => toLocalDate(a.data) >= inicioDoDia(hoje)).length === 0 && (
              <p className="text-sm text-center py-8" style={{ color: "#6D4FA0" }}>Nenhuma atividade programada.</p>
            )}
          </div>
        </div>

        {/* Próximos feriados */}
        {!loadingFeriados && feriados.filter((f) => toLocalDate(f.date) >= inicioDoDia(hoje)).length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "#6D4FA0" }}>
              Próximos feriados
            </h3>
            <div className="flex flex-col gap-2">
              {feriados
                .filter((f) => toLocalDate(f.date) >= inicioDoDia(hoje))
                .slice(0, 5)
                .map((f) => {
                  const data = toLocalDate(f.date);
                  return (
                    <div
                      key={f.date}
                      className="flex items-center gap-4 rounded-2xl border p-4"
                      style={{ background: "rgba(248,113,113,0.06)", borderColor: "rgba(248,113,113,0.2)" }}
                    >
                      <div className="text-center flex-shrink-0">
                        <p className="text-xs font-medium" style={{ color: "#F87171" }}>{MESES[data.getMonth()].slice(0, 3)}</p>
                        <p className="text-2xl font-bold text-white leading-none">{data.getDate()}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-white">{f.name}</p>
                        <p className="text-xs mt-0.5 capitalize" style={{ color: "#9CA3AF" }}>{f.type}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* Drawer */}
      {drawer && diaSelecionado && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDrawer(false)} />
          <div
            className="relative w-full max-w-sm h-full overflow-y-auto flex flex-col"
            style={{ background: "#1A0D40", borderLeft: "1px solid #3D2B7A" }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: "#3D2B7A" }}>
              <div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#6D4FA0" }}>
                  {DIAS_SEMANA[diaSelecionado.getDay()]}
                </p>
                <h3 className="text-xl font-bold text-white">
                  {diaSelecionado.getDate()} de {MESES[diaSelecionado.getMonth()]}
                </h3>
              </div>
              <button onClick={() => setDrawer(false)} className="p-2 rounded-xl hover:bg-white/5 transition-colors" style={{ color: "#A78BFA" }}>
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 px-6 py-5 flex flex-col gap-6">
              {/* Feriado no drawer */}
              {itensDrawer.feriados.length > 0 && (
                <div
                  className="rounded-2xl p-4"
                  style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)" }}
                >
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#F87171" }}>🎉 Feriado</p>
                  {itensDrawer.feriados.map((f) => (
                    <div key={f.date}>
                      <p className="font-semibold text-white">{f.name}</p>
                      <p className="text-xs mt-0.5 capitalize" style={{ color: "#9CA3AF" }}>{f.type}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Grade */}
              {itensDrawer.grade.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#6D4FA0" }}>Aulas</p>
                  <div className="flex flex-col gap-2">
                    {itensDrawer.grade.map((g) => {
                      const cor = CORES_COMPONENTE[g.componente] || CORES_COMPONENTE.default;
                      return (
                        <div key={g.id} className="flex items-start gap-3 rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid #3D2B7A" }}>
                          <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: cor }} />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white">{g.componente}</p>
                            <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "#9CA3AF" }}>
                              <Clock size={11} />{g.horaInicio} – {g.horaFim}
                            </p>
                            {g.sessao && (
                              <>
                                <p className="text-xs mt-1.5 font-medium" style={{ color: "#C4B5FD" }}>{g.sessao.titulo}</p>
                                <p className="text-xs italic mt-0.5" style={{ color: "#9CA3AF" }}>"{g.sessao.ancora}"</p>
                                <Link
                                  href={`/dashboard/aluno/nova?sessaoId=${g.sessao.id}`}
                                  className="mt-2 inline-flex items-center gap-1.5 text-xs rounded-lg px-3 py-1.5 transition-all hover:opacity-80"
                                  style={{ background: "rgba(196,181,253,0.15)", color: "#C4B5FD" }}
                                >
                                  <Sparkles size={11} />Revisar com Nova
                                </Link>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Atividades */}
              {itensDrawer.atividades.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#6D4FA0" }}>Atividades</p>
                  <div className="flex flex-col gap-2">
                    {itensDrawer.atividades.map((a) => {
                      const cor = CORES_STATUS[a.status] || CORES_STATUS.default;
                      return (
                        <div key={a.id} className="rounded-2xl p-4" style={{ background: cor.bg, border: `1px solid ${cor.border}` }}>
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-white">{a.titulo}</p>
                            <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full" style={{ background: cor.bg, color: cor.text, border: `1px solid ${cor.border}` }}>
                              {a.status}
                            </span>
                          </div>
                          {a.descricao && <p className="text-sm mt-1" style={{ color: "#9CA3AF" }}>{a.descricao}</p>}
                          {a.sessao && (
                            <div className="mt-3 flex flex-col gap-1.5">
                              <p className="text-xs flex items-center gap-1" style={{ color: cor.text }}>
                                <BookOpen size={11} />{a.sessao.titulo}
                              </p>
                              <p className="text-xs italic" style={{ color: "#9CA3AF" }}>"{a.sessao.ancora}"</p>
                              <Link
                                href={`/dashboard/aluno/nova?sessaoId=${a.sessao.id}`}
                                className="mt-1 inline-flex items-center gap-1.5 text-xs rounded-lg px-3 py-1.5 w-fit transition-all hover:opacity-80"
                                style={{ background: "rgba(196,181,253,0.15)", color: "#C4B5FD" }}
                              >
                                <Sparkles size={11} />Revisar com Nova
                              </Link>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {itensDrawer.atividades.length === 0 && itensDrawer.grade.length === 0 && itensDrawer.feriados.length === 0 && (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-sm text-center" style={{ color: "#6D4FA0" }}>Nenhuma aula ou atividade neste dia.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}