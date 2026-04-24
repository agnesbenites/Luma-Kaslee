"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Link2, Clock } from "lucide-react";

const DIAS = ["", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const CORES: Record<string, string> = {
  Matemática: "#7C67F0",
  Português: "#E95CA0",
  Ciências: "#10B981",
  História: "#F5A623",
  Geografia: "#4A90E2",
  default: "#8B7EC8",
};

type GradeItem = {
  id: string;
  diaSemana: number;
  horaInicio: string;
  horaFim: string;
  componente: string;
  fixo: boolean;
  sessao?: { id: string; titulo: string; ancora: string; status: string } | null;
};

type Sessao = {
  id: string;
  titulo: string;
  ancora: string;
  status: string;
};

type Turma = {
  id: string;
  nome: string;
  serie: string;
};

export default function GradeProfessor({ professorId }: { professorId: string }) {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState("");
  const [grade, setGrade] = useState<GradeItem[]>([]);
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    diaSemana: "1",
    horaInicio: "08:00",
    horaFim: "09:00",
    componente: "",
    fixo: true,
    sessaoId: "",
  });

  // Carrega turmas do professor
  useEffect(() => {
    fetch("/api/professor/turmas")
      .then((r) => r.json())
      .then((d) => {
        setTurmas(d.turmas || []);
        if (d.turmas?.length > 0) setTurmaSelecionada(d.turmas[0].id);
      });
  }, []);

  // Carrega grade e sessões quando turma muda
  useEffect(() => {
    if (!turmaSelecionada) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/professor/grade?turmaId=${turmaSelecionada}`).then((r) => r.json()),
      fetch(`/api/professor/sessoes?turmaId=${turmaSelecionada}`).then((r) => r.json()),
    ])
      .then(([gradeData, sessoesData]) => {
        setGrade(gradeData.grade || []);
        setSessoes(sessoesData.sessoes || []);
      })
      .catch(() => setErro("Erro ao carregar grade"))
      .finally(() => setLoading(false));
  }, [turmaSelecionada]);

  async function adicionarEntrada() {
    if (!form.componente || !turmaSelecionada) return;
    const res = await fetch("/api/professor/grade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turmaId: turmaSelecionada,
        diaSemana: Number(form.diaSemana),
        horaInicio: form.horaInicio,
        horaFim: form.horaFim,
        componente: form.componente,
        fixo: form.fixo,
        sessaoId: form.sessaoId || null,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setGrade((prev) => [...prev, data.entrada]);
      setShowForm(false);
      setForm({ diaSemana: "1", horaInicio: "08:00", horaFim: "09:00", componente: "", fixo: true, sessaoId: "" });
    }
  }

  async function removerEntrada(id: string) {
    await fetch(`/api/professor/grade?id=${id}`, { method: "DELETE" });
    setGrade((prev) => prev.filter((g) => g.id !== id));
  }

  async function vincularSessao(gradeId: string, sessaoId: string) {
    const res = await fetch("/api/professor/grade", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: gradeId, sessaoId: sessaoId || null }),
    });
    const data = await res.json();
    if (res.ok) {
      setGrade((prev) => prev.map((g) => (g.id === gradeId ? { ...g, sessao: data.entrada.sessao } : g)));
    }
  }

  const gradeAgrupada = DIAS.reduce((acc, _, i) => {
    if (i === 0) return acc;
    acc[i] = grade.filter((g) => g.diaSemana === i);
    return acc;
  }, {} as Record<number, GradeItem[]>);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2D1B69]">Grade Horária</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gerencie os horários e vincule sessões às aulas</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#2D1B69] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#3d2a8a] transition-colors"
        >
          <Plus size={16} />
          Novo horário
        </button>
      </div>

      {/* Seletor de turma */}
      <div className="flex gap-2 flex-wrap">
        {turmas.map((t) => (
          <button
            key={t.id}
            onClick={() => setTurmaSelecionada(t.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
              ${turmaSelecionada === t.id ? "bg-[#2D1B69] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {t.nome} · {t.serie}
          </button>
        ))}
      </div>

      {erro && <p className="text-sm text-red-400">{erro}</p>}
      {loading && <p className="text-sm text-gray-400">Carregando...</p>}

      {/* Formulário novo horário */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-[#2D1B69] mb-4">Novo horário</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Dia da semana</label>
              <select
                value={form.diaSemana}
                onChange={(e) => setForm((f) => ({ ...f, diaSemana: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                {DIAS.slice(1).map((d, i) => (
                  <option key={i + 1} value={i + 1}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Início</label>
              <input
                type="time"
                value={form.horaInicio}
                onChange={(e) => setForm((f) => ({ ...f, horaInicio: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Fim</label>
              <input
                type="time"
                value={form.horaFim}
                onChange={(e) => setForm((f) => ({ ...f, horaFim: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Componente</label>
              <input
                type="text"
                placeholder="Ex: Matemática"
                value={form.componente}
                onChange={(e) => setForm((f) => ({ ...f, componente: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Sessão vinculada</label>
              <select
                value={form.sessaoId}
                onChange={(e) => setForm((f) => ({ ...f, sessaoId: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Nenhuma</option>
                {sessoes.map((s) => (
                  <option key={s.id} value={s.id}>{s.titulo}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-gray-600 pb-2">
                <input
                  type="checkbox"
                  checked={form.fixo}
                  onChange={(e) => setForm((f) => ({ ...f, fixo: e.target.checked }))}
                  className="rounded"
                />
                Horário fixo
              </label>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={adicionarEntrada}
              className="bg-[#2D1B69] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#3d2a8a]"
            >
              Salvar
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-200"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Grade por dia */}
      {!loading && (
        <div className="flex flex-col gap-4">
          {Object.entries(gradeAgrupada).map(([dia, itens]) => (
            itens.length > 0 && (
              <div key={dia} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                  <span className="text-sm font-semibold text-[#2D1B69]">{DIAS[Number(dia)]}</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {itens.map((item) => {
                    const cor = CORES[item.componente] || CORES.default;
                    return (
                      <div key={item.id} className="flex items-center gap-4 px-5 py-3">
                        <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: cor }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-800">{item.componente}</span>
                            {item.fixo && (
                              <span className="text-[10px] bg-purple-50 text-purple-500 px-2 py-0.5 rounded-full">fixo</span>
                            )}
                          </div>
                          <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <Clock size={11} />
                            {item.horaInicio} – {item.horaFim}
                          </span>
                          {item.sessao && (
                            <span className="text-xs text-purple-600 mt-0.5 block">
                              📎 {item.sessao.titulo} — <span className="italic text-gray-400">{item.sessao.ancora}</span>
                            </span>
                          )}
                        </div>

                        {/* Vincular sessão inline */}
                        <select
                          value={item.sessao?.id || ""}
                          onChange={(e) => vincularSessao(item.id, e.target.value)}
                          className="text-xs border rounded-lg px-2 py-1.5 text-gray-600 max-w-[160px]"
                        >
                          <option value="">Sem sessão</option>
                          {sessoes.map((s) => (
                            <option key={s.id} value={s.id}>{s.titulo}</option>
                          ))}
                        </select>

                        <button
                          onClick={() => removerEntrada(item.id)}
                          className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          ))}

          {grade.length === 0 && !loading && (
            <p className="text-sm text-gray-400 text-center py-12">
              Nenhum horário cadastrado para esta turma ainda.
            </p>
          )}
        </div>
      )}
    </div>
  );
}