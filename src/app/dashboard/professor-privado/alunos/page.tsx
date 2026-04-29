"use client";

import { useState, useEffect } from "react";
import { Loader2, UserPlus, Trash2, AlertTriangle, X } from "lucide-react";

type Aluno = { id: string; nome: string; email: string; criadoEm: string };

export default function AlunosPrivadoPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "" });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [confirmarExclusao, setConfirmarExclusao] = useState<string | null>(null);
  const [credenciais, setCredenciais] = useState<{ email: string; senha: string } | null>(null);

  async function carregar() {
    setCarregando(true);
    fetch("/api/professor-privado/alunos")
      .then((r) => r.json())
      .then(setAlunos)
      .finally(() => setCarregando(false));
  }

  useEffect(() => { carregar(); }, []);

  async function handleCadastrar() {
    if (!form.nome || !form.email) { setErro("Preencha todos os campos."); return; }
    setSalvando(true);
    setErro("");
    try {
      const res = await fetch("/api/professor-privado/alunos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setErro(data.error || "Erro ao cadastrar."); return; }
      setCredenciais({ email: form.email, senha: data.senhaTemp });
      carregar();
    } finally {
      setSalvando(false);
    }
  }

  async function handleExcluir(id: string) {
    await fetch(`/api/professor-privado/alunos/${id}`, { method: "DELETE" });
    setAlunos((a) => a.filter((al) => al.id !== id));
    setConfirmarExclusao(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-[#2D1B69]">Meus Alunos</h2>
          <p className="text-sm text-gray-500">{alunos.length} aluno{alunos.length !== 1 ? "s" : ""} cadastrados</p>
        </div>
        <button onClick={() => { setModalAberto(true); setForm({ nome: "", email: "" }); setErro(""); setCredenciais(null); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#2D1B69] text-white rounded-xl text-sm font-bold hover:opacity-90">
          <UserPlus size={16} /> Novo Aluno
        </button>
      </div>

      {sucesso && <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-2xl">✓ {sucesso}</div>}

      {carregando ? (
        <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-[#2D1B69]" /></div>
      ) : alunos.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-purple-100 p-16 text-center">
          <p className="font-bold text-gray-700">Nenhum aluno ainda</p>
          <p className="text-sm text-gray-400 mt-1">Clique em "Novo Aluno" para cadastrar.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-50">
            {alunos.map((aluno) => (
              <div key={aluno.id} className="flex items-center gap-4 px-6 py-4">
                <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-[#2D1B69] font-bold text-sm shrink-0">
                  {aluno.nome.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800">{aluno.nome}</p>
                  <p className="text-xs text-gray-400">{aluno.email}</p>
                </div>
                <p className="text-xs text-gray-300 shrink-0">
                  {new Date(aluno.criadoEm).toLocaleDateString("pt-BR")}
                </p>
                <button onClick={() => setConfirmarExclusao(aluno.id)}
                  className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmação exclusão */}
      {confirmarExclusao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl p-8 space-y-4 text-center">
            <AlertTriangle size={32} className="mx-auto text-red-500" />
            <h3 className="font-bold text-gray-800">Excluir aluno?</h3>
            <p className="text-sm text-gray-500">Esta ação é permanente e não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmarExclusao(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-500">Cancelar</button>
              <button onClick={() => handleExcluir(confirmarExclusao)}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold">Excluir</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal cadastro */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-8 space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#2D1B69]">Novo Aluno</h3>
              <button onClick={() => setModalAberto(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
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
                {erro && <p className="text-red-500 text-sm">{erro}</p>}
                <button onClick={handleCadastrar} disabled={salvando}
                  className="w-full py-3 bg-[#2D1B69] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50">
                  {salvando ? <><Loader2 size={16} className="animate-spin" /> Cadastrando...</> : "Cadastrar e enviar acesso"}
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
                  <p className="font-bold text-green-700">✓ Aluno cadastrado!</p>
                  <p className="text-xs text-green-600 mt-1">Credenciais enviadas por e-mail.</p>
                </div>
                <div className="bg-purple-50 rounded-2xl p-4 space-y-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Credenciais geradas</p>
                  <p className="text-sm text-gray-600">{credenciais.email}</p>
                  <p className="text-2xl font-bold tracking-widest text-[#2D1B69] font-mono">{credenciais.senha}</p>
                </div>
                <button onClick={() => { setModalAberto(false); setCredenciais(null); }}
                  className="w-full py-2.5 border border-gray-100 text-gray-500 rounded-xl font-bold text-sm">
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
