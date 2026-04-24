"use client";

import { useEffect, useMemo, useState } from "react";

type AgendaItem = {
  id: string;
  titulo: string;
  descricao?: string | null;
  data: string;
  status: string;
  turma: {
    id: string;
    nome: string;
    serie: string;
  };
  sessao?: {
    id: string;
    titulo: string;
    status: string;
  } | null;
};

function formatarData(data: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(data));
}

function inicioDoDia(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function CalendarioAgenda() {
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [criando, setCriando] = useState(false);
  const [turmas, setTurmas] = useState<{ id: string; nome: string }[]>([]);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [turmaId, setTurmaId] = useState("");

  async function carregarAgenda() {
    try {
      setErro("");
      setLoading(true);

      const res = await fetch("/api/professor/agenda");
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Erro ao carregar agenda");
      }

      setAgenda(result.agenda || []);
    } catch (e: any) {
      setErro(e.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  async function carregarTurmas() {
    try {
      const res = await fetch("/api/professor/turmas");
      const result = await res.json();
      setTurmas(result.turmas || []);
    } catch {
      setTurmas([
        { id: "turma-1", nome: "6º ano A" },
        { id: "turma-2", nome: "6º ano B" },
        { id: "turma-3", nome: "7º ano A" },
      ]);
    }
  }

  useEffect(() => {
    carregarAgenda();
    carregarTurmas();
  }, []);

  async function criarAtividade(e: React.FormEvent) {
    e.preventDefault();

    if (!titulo || !data || !turmaId) {
      setErro("Preencha título, data e turma.");
      return;
    }

    try {
      setErro("");
      setCriando(true);

      const res = await fetch("/api/professor/agenda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, descricao, data, turmaId }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Erro ao criar atividade");
      }

      setTitulo("");
      setDescricao("");
      setData("");
      setTurmaId("");
      await carregarAgenda();
    } catch (e: any) {
      setErro(e.message || "Erro inesperado");
    } finally {
      setCriando(false);
    }
  }

  const hoje = inicioDoDia(new Date());

  const { atrasadas, hojeItems, proximas, concluidas } = useMemo(() => {
    const atrasadas: AgendaItem[] = [];
    const hojeItems: AgendaItem[] = [];
    const proximas: AgendaItem[] = [];
    const concluidas: AgendaItem[] = [];

    for (const item of agenda) {
      if (item.status === "CONCLUIDA") {
        concluidas.push(item);
        continue;
      }

      const dataItem = inicioDoDia(new Date(item.data));
      if (dataItem.getTime() < hoje.getTime()) {
        atrasadas.push(item);
      } else if (dataItem.getTime() === hoje.getTime()) {
        hojeItems.push(item);
      } else {
        proximas.push(item);
      }
    }

    return { atrasadas, hojeItems, proximas, concluidas };
  }, [agenda, hoje]);

  function CardLista({
    titulo,
    itens,
    corBg,
    corTexto,
  }: {
    titulo: string;
    itens: AgendaItem[];
    corBg: string;
    corTexto: string;
  }) {
    return (
      <div
        className="rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border"
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          border: `1px solid ${corBg}20`,
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: corBg }} />
            <h2 className="text-xl font-bold" style={{ color: "#2D1B69" }}>
              {titulo}
            </h2>
          </div>
          <span
            className="px-3 py-1 rounded-full text-sm font-semibold"
            style={{ background: `${corBg}20`, color: corTexto }}
          >
            {itens.length}
          </span>
        </div>

        {itens.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-2xl" style={{ color: `${corBg}AA` }}>
                📅
              </span>
            </div>
            <p className="text-sm" style={{ color: "#8B7EC8" }}>
              Nenhuma atividade aqui
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {itens.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="group hover:bg-white/50 p-4 rounded-xl border transition-all cursor-pointer"
                style={{ borderColor: `${corBg}10` }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-3 h-3 rounded-full mt-1"
                    style={{ backgroundColor: corBg }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 group-hover:text-[#2D1B69] truncate">
                      {item.titulo}
                    </h3>
                    <p className="text-sm" style={{ color: "#8B7EC8" }}>
                      {item.turma.nome} • {item.turma.serie}
                    </p>
                    {item.descricao && (
                      <p className="text-sm mt-1 line-clamp-2" style={{ color: "#6B5AC8" }}>
                        {item.descricao}
                      </p>
                    )}
                    <p className="text-xs mt-2" style={{ color: "#A89FF8" }}>
                      {formatarData(item.data)}
                    </p>
                    {item.sessao && (
                      <p className="text-xs mt-1 px-2 py-1 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full inline-block">
                        <span style={{ color: "#7C67F0" }}>Sessão:</span> {item.sessao.titulo}
                      </p>
                    )}
                  </div>
                  <span
                    className="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                    style={{ background: `${corBg}15`, color: corTexto }}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
            {itens.length > 3 && (
              <div className="text-center py-4">
                <button type="button" className="text-sm underline" style={{ color: "#7C67F0" }}>
                  +{itens.length - 3} mais
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#F5C542]" />
            <p className="mt-4 text-lg" style={{ color: "#2D1B69" }}>
              Carregando agenda...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-3 h-3 bg-gradient-to-r from-[#F5C542] to-[#F5A623] rounded-full animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2D1B69] via-[#4A3E8C] to-[#3D1F5C] bg-clip-text text-transparent">
              Agenda Pedagógica
            </h1>
          </div>
          <p className="text-lg" style={{ color: "#8B7EC8" }}>
            Organize suas atividades e sessões com facilidade
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 mb-12 shadow-2xl border border-purple-100/50">
          <h2 className="text-2xl font-bold mb-6" style={{ color: "#2D1B69" }}>
            📅 Nova Atividade
          </h2>

          <form onSubmit={criarAtividade} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold mb-2 block" style={{ color: "#2D1B69" }}>
                Título *
              </label>
              <input
                type="text"
                placeholder="Ex: Discussão sobre frações"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 focus:border-[#F5C542] focus:outline-none transition-all"
                style={{
                  background: "rgba(255, 255, 255, 0.8)",
                  borderColor: "#E5DFFC",
                }}
                disabled={criando}
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block" style={{ color: "#2D1B69" }}>
                Data e Hora *
              </label>
              <input
                type="datetime-local"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 focus:border-[#F5C542] focus:outline-none transition-all"
                style={{
                  background: "rgba(255, 255, 255, 0.8)",
                  borderColor: "#E5DFFC",
                }}
                disabled={criando}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold mb-2 block" style={{ color: "#2D1B69" }}>
                Turma *
              </label>
              <select
                value={turmaId}
                onChange={(e) => setTurmaId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 focus:border-[#F5C542] focus:outline-none transition-all appearance-none"
                style={{
                  background: "rgba(255, 255, 255, 0.8)",
                  borderColor: "#E5DFFC",
                }}
                disabled={criando}
                required
              >
                <option value="">Selecione uma turma</option>
                {turmas.map((turma) => (
                  <option key={turma.id} value={turma.id}>
                    {turma.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold mb-2 block" style={{ color: "#2D1B69" }}>
                Descrição (opcional)
              </label>
              <textarea
                placeholder="Detalhes da atividade..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 focus:border-[#F5C542] focus:outline-none transition-all resize-vertical"
                style={{
                  background: "rgba(255, 255, 255, 0.8)",
                  borderColor: "#E5DFFC",
                }}
                disabled={criando}
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={criando || !titulo || !data || !turmaId}
                className="w-full h-14 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #F5C542 0%, #F5A623 100%)",
                  color: "#2D1B69",
                  border: "none",
                }}
              >
                {criando ? (
                  <>
                    <div className="w-6 h-6 border-2 border-[#2D1B69] border-t-transparent rounded-full animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    Criar Atividade
                  </>
                )}
              </button>
            </div>
          </form>

          {erro && (
            <div
              className="mt-6 p-4 rounded-2xl border-2"
              style={{
                borderColor: "#E95CA040",
                background: "rgba(233, 92, 160, 0.1)",
                backdropFilter: "blur(10px)",
              }}
            >
              <p className="text-sm text-center" style={{ color: "#E95CA0" }}>
                {erro}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CardLista titulo="Atrasadas" itens={atrasadas} corBg="#E95CA0" corTexto="#E95CA0" />
          <CardLista titulo="Hoje" itens={hojeItems} corBg="#F5A623" corTexto="#F5A623" />
          <CardLista titulo="Próximas" itens={proximas} corBg="#4A90E2" corTexto="#4A90E2" />
          <CardLista titulo="Concluídas" itens={concluidas} corBg="#10B981" corTexto="#10B981" />
        </div>
      </div>
    </div>
  );
}