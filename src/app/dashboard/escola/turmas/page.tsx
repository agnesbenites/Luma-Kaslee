"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Trash2, ChevronDown, ChevronUp, Users, AlertTriangle, X, Save } from "lucide-react";

const SERIES = ["6º ano", "7º ano", "8º ano", "9º ano", "1º EM", "2º EM", "3º EM"];
const TURNOS = ["Manhã", "Tarde", "Noite", "Integral"];

type Professor = { id: string; nome: string; email: string };
type Aluno = { id: string; nome: string; email: string };
type Turma = {
  id: string;
  nome: string;
  serie: string;
  turno: string | null;
  professor: { id: string; nome: string } | null;
  _count: { alunos: number };
  alunos?: Aluno[];
};

export default function TurmasPage() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [expandido, setExpandido] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [confirmarExclusao, setConfirmarExclusao] = useState<string | null>(null);
  const [excluindo, setExcluindo] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [form, setForm] = useState({ nome: "", serie: "", turno: "", professorId: "" });

  async function carregar() {
    setCarregando(true);
    try {
      const [turmasRes, profsRes] = await Promise.all([
        fetch("/api/escola/turmas"),
        fetch("/api/escola/professores"),
      ]);
      const [turmasData, profsData] = await Promise.all([turmasRes.json(), profsRes.json()]);
      setTurmas(turmasData);
      setProfessores(profsData);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  async function handleCriar() {
    if (!form.nome || !form.serie) { setErro("Nome e série são obrigatórios."); return; }
    setSalvando(true);
    setErro("");
    try {
      const res = await fetch("/api/escola/turmas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setErro(data.error || "Erro ao criar turma."); return; }
      setModalAberto(false);
      setSucesso("Turma criada com sucesso!");
      setTimeout(() => setSucesso(""), 3000);
      carregar();
    } finally {
      setSalvando(false);
    }
  }

  async function handleExcluir(id: string) {
    setExcluindo(id);
    try {
      await fetch(`/api/escola/turmas/${id}`, { method: "DELETE" });
      setTurmas((t) => t.filter((turma) => turma.id !== id));
      setConfirmarExclusao(null);
      setExpandido(null);
    } finally {
      setExcluindo(null);
    }
  }

  async function carregarAlunos(turmaId: string) {
    const res = await fetch(`/api/escola/turmas/${turmaId}/alunos`);
    const alunos = await res.json();
    setTurmas((t) => t.map((turma) => turma.id === turmaId ? { ...turma, alunos } : turma));
  }

  function toggleExpandir(id: string) {
    if (expandido === id) { setExpandido(null); return; }
    setExpandido(id);
    const turma = turmas.find((t) => t.id === id);
    if (turma && !turma.alunos) carregarAlunos(id);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-[#2D1B69]">Turmas</h2>
          <p className="text-sm text-gray-500">Gerencie as turmas, professores e alunos</p>
        </div>
        <button onClick={() => { setForm({ nome: "", serie: "", turno: "", professorId: "" }); setErro(""); setModalAberto(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#2D1B69] text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all">
          <Plus size={16} /> Nova Turma
        </button>
      </div>

      {sucesso && <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-2xl">✓ {sucesso}</div>}

      {carregando ? (
        <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-[#2D1B69]" /></div>
      ) : turmas.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-purple-100 p-16 text-center">
          <Users size={40} className="mx-auto text-purple-200 mb-4" />
          <p className="font-bold text-gray-700">Nenhuma turma criada ainda</p>
          <p className="text-sm text-gray-400 mt-1">Clique em "Nova Turma" para começar.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {turmas.map((turma) => (
            <div key={turma.id} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden">
              <div className="flex items-center px-6 py-4">
                <button onClick={() => toggleExpandir(turma.id)}
                  className="flex-1 flex items-center justify-between hover:opacity-80 transition-opacity">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-[#2D1B69] font-bold text-sm">
                      {turma.serie.replace("º", "").replace(" EM", "").trim()}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">{turma.nome}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">{turma.serie}</span>
                        {turma.turno && <span className="text-xs text-gray-300">· {turma.turno}</span>}
                        {turma.professor && <span className="text-xs text-gray-300">· {turma.professor.nome}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full font-bold">
                      {turma._count.alunos} aluno{turma._count.alunos !== 1 ? "s" : ""}
                    </span>
                    {expandido === turma.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </button>
                <button onClick={() => setConfirmarExclusao(turma.id)}
                  className="ml-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                  <Trash2 size={16} />
                </button>
              </div>

              {confirmarExclusao === turma.id && (
                <div className="mx-6 mb-4 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-4">
                  <AlertTriangle size={18} className="text-red-500 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-red-700">Excluir turma "{turma.nome}"?</p>
                    <p className="text-xs text-red-500 mt-0.5">Todos os dados desta turma serão removidos permanentemente.</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => setConfirmarExclusao(null)}
                      className="px-3 py-1.5 text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
                      Cancelar
                    </button>
                    <button onClick={() => handleExcluir(turma.id)} disabled={excluindo === turma.id}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 disabled:opacity-50 flex items-center gap-1.5">
                      {excluindo === turma.id && <Loader2 size={12} className="animate-spin" />}
                      Confirmar
                    </button>
                  </div>
                </div>
              )}

              {expandido === turma.id && (
                <div className="px-6 pb-6 border-t border-gray-50 pt-4 space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Série</p>
                      <p className="text-gray-700">{turma.serie}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Turno</p>
                      <p className="text-gray-700">{turma.turno || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Professor</p>
                      <p className="text-gray-700">{turma.professor?.nome || "—"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Alunos</p>
                    {!turma.alunos ? (
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <Loader2 size={12} className="animate-spin" /> Carregando...
                      </div>
                    ) : turma.alunos.length === 0 ? (
                      <p className="text-xs text-gray-300">Nenhum aluno nesta turma ainda.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {turma.alunos.map((aluno) => (
                          <div key={aluno.id} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-1.5">
                            <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-[#2D1B69] text-[10px] font-bold">
                              {aluno.nome.charAt(0)}
                            </div>
                            <span className="text-xs text-gray-600">{aluno.nome}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-8 space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#2D1B69]">Nova Turma</h3>
              <button onClick={() => setModalAberto(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Nome da turma *</label>
              <input type="text" value={form.nome} onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                placeholder="Ex: Turma A, 9B, 1EM-Manhã"
                className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-100 focus:ring-2 focus:ring-purple-200 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Série *</label>
                <select value={form.serie} onChange={(e) => setForm((f) => ({ ...f, serie: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-100 focus:ring-2 focus:ring-purple-200 outline-none">
                  <option value="">Selecionar</option>
                  {SERIES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Turno</label>
                <select value={form.turno} onChange={(e) => setForm((f) => ({ ...f, turno: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-100 focus:ring-2 focus:ring-purple-200 outline-none">
                  <option value="">Selecionar</option>
                  {TURNOS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Professor responsável</label>
              <select value={form.professorId} onChange={(e) => setForm((f) => ({ ...f, professorId: e.target.value }))}
                className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-100 focus:ring-2 focus:ring-purple-200 outline-none">
                <option value="">Selecionar (opcional)</option>
                {professores.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </div>
            {erro && <p className="text-red-500 text-sm">{erro}</p>}
            <button onClick={handleCriar} disabled={salvando}
              className="w-full py-3 bg-[#2D1B69] text-white rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
              {salvando ? <><Loader2 size={16} className="animate-spin" /> Criando...</> : <><Save size={16} /> Criar Turma</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
