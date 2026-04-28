"use client";

import { useState, useEffect } from "react";
import { X, Loader2, UserPlus, Copy, Check } from "lucide-react";

type Turma = { id: string; nome: string; serie: string };

export default function CadastrarAluno({ onSuccess }: { onSuccess?: () => void }) {
  const [aberto, setAberto] = useState(false);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [form, setForm] = useState({ nome: "", email: "", turmaId: "" });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [credenciais, setCredenciais] = useState<{ email: string; senha: string } | null>(null);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (aberto) {
      fetch("/api/escola/turmas")
        .then((r) => r.json())
        .then(setTurmas);
    }
  }, [aberto]);

  async function handleSalvar() {
    if (!form.nome || !form.email || !form.turmaId) {
      setErro("Preencha todos os campos.");
      return;
    }
    setSalvando(true);
    setErro("");
    try {
      const res = await fetch("/api/escola/alunos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setErro(data.error || "Erro ao cadastrar."); return; }
      setCredenciais({ email: form.email, senha: data.senhaTemp });
      onSuccess?.();
    } finally {
      setSalvando(false);
    }
  }

  function copiar() {
    if (!credenciais) return;
    navigator.clipboard.writeText(`E-mail: ${credenciais.email}\nSenha: ${credenciais.senha}`);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  function fechar() {
    setAberto(false);
    setForm({ nome: "", email: "", turmaId: "" });
    setCredenciais(null);
    setErro("");
  }

  return (
    <>
      <button onClick={() => setAberto(true)}
        className="flex items-center gap-2 px-4 py-2 bg-[#2D1B69] text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all">
        <UserPlus size={16} /> Cadastrar Aluno
      </button>

      {aberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-8 space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#2D1B69]">Cadastrar Aluno</h3>
              <button onClick={fechar} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            {!credenciais ? (
              <>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Nome completo *</label>
                  <input type="text" value={form.nome} onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                    placeholder="Nome do aluno"
                    className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-100 focus:ring-2 focus:ring-purple-200 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">E-mail *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="email@aluno.com"
                    className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-100 focus:ring-2 focus:ring-purple-200 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Turma *</label>
                  <select value={form.turmaId} onChange={(e) => setForm((f) => ({ ...f, turmaId: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-100 focus:ring-2 focus:ring-purple-200 outline-none">
                    <option value="">Selecionar turma</option>
                    {turmas.map((t) => <option key={t.id} value={t.id}>{t.nome} — {t.serie}</option>)}
                  </select>
                </div>
                {erro && <p className="text-red-500 text-sm">{erro}</p>}
                <button onClick={handleSalvar} disabled={salvando}
                  className="w-full py-3 bg-[#2D1B69] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50">
                  {salvando ? <><Loader2 size={16} className="animate-spin" /> Cadastrando...</> : "Cadastrar e enviar acesso"}
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
                  <p className="font-bold text-green-700 mb-1">✓ Aluno cadastrado!</p>
                  <p className="text-xs text-green-600">As credenciais foram enviadas para o e-mail do aluno.</p>
                </div>
                <div className="bg-purple-50 rounded-2xl p-4 space-y-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Credenciais geradas</p>
                  <div>
                    <p className="text-xs text-gray-400">E-mail</p>
                    <p className="font-semibold text-sm text-[#2D1B69]">{credenciais.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Senha temporária</p>
                    <p className="font-bold text-xl tracking-widest text-[#2D1B69] font-mono">{credenciais.senha}</p>
                  </div>
                  <button onClick={copiar}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#2D1B69] hover:opacity-70">
                    {copiado ? <><Check size={13} /> Copiado!</> : <><Copy size={13} /> Copiar credenciais</>}
                  </button>
                </div>
                <p className="text-xs text-gray-400 text-center">O aluno deve trocar a senha no primeiro acesso.</p>
                <button onClick={fechar}
                  className="w-full py-2.5 border border-gray-100 text-gray-500 rounded-xl font-bold text-sm hover:bg-gray-50">
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
