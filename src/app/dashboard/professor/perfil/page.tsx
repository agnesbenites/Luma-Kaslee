"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, Plus, Trash2, User, BookOpen, Clock } from "lucide-react";

const DIAS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const MATERIAS = [
  "Matemática", "Português", "Ciências", "História", "Geografia",
  "Física", "Química", "Biologia", "Inglês", "Artes", "Educação Física",
  "Filosofia", "Sociologia", "Redação",
];
const ANOS = [
  "6º ano", "7º ano", "8º ano", "9º ano",
  "1º EM", "2º EM", "3º EM",
];
const HORARIOS = [
  "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30", "20:00", "20:30", "21:00",
];

type AulaGrade = {
  id?: string;
  diaSemana: number;
  horaInicio: string;
  horaFim: string;
  componente: string;
  serie: string;
};

type Perfil = {
  nome: string;
  email: string;
  materias: string[];
  anos: string[];
  grade: AulaGrade[];
};

export default function ProfessorPerfilPage() {
  const [perfil, setPerfil] = useState<Perfil>({
    nome: "",
    email: "",
    materias: [],
    anos: [],
    grade: [],
  });
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState("");
  const [erro, setErro] = useState("");

  // Carregar perfil atual
  useEffect(() => {
    fetch("/api/professor/perfil")
      .then((r) => r.json())
      .then((data) => {
        setPerfil({
          nome: data.nome || "",
          email: data.email || "",
          materias: data.materias || [],
          anos: data.anos || [],
          grade: data.grade || [],
        });
      })
      .finally(() => setCarregando(false));
  }, []);

  function toggleMateria(m: string) {
    setPerfil((p) => ({
      ...p,
      materias: p.materias.includes(m)
        ? p.materias.filter((x) => x !== m)
        : [...p.materias, m],
    }));
  }

  function toggleAno(a: string) {
    setPerfil((p) => ({
      ...p,
      anos: p.anos.includes(a)
        ? p.anos.filter((x) => x !== a)
        : [...p.anos, a],
    }));
  }

  function adicionarAula() {
    setPerfil((p) => ({
      ...p,
      grade: [
        ...p.grade,
        { diaSemana: 0, horaInicio: "08:00", horaFim: "09:00", componente: "", serie: "" },
      ],
    }));
  }

  function atualizarAula(index: number, campo: keyof AulaGrade, valor: string | number) {
    setPerfil((p) => {
      const grade = [...p.grade];
      grade[index] = { ...grade[index], [campo]: valor };
      return { ...p, grade };
    });
  }

  function removerAula(index: number) {
    setPerfil((p) => ({ ...p, grade: p.grade.filter((_, i) => i !== index) }));
  }

  async function handleSalvar() {
    setSalvando(true);
    setErro("");
    setSucesso("");
    try {
      const res = await fetch("/api/professor/perfil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: perfil.nome,
          materias: perfil.materias,
          anos: perfil.anos,
          grade: perfil.grade,
          ...(novaSenha ? { senhaAtual, novaSenha } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setErro(data.error || "Erro ao salvar."); return; }
      setSucesso("Perfil atualizado com sucesso!");
      setSenhaAtual("");
      setNovaSenha("");
      setTimeout(() => setSucesso(""), 3000);
    } catch {
      setErro("Erro inesperado.");
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={28} className="animate-spin text-[#2D1B69]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-[#2D1B69]">Meu Perfil</h2>
          <p className="text-sm text-gray-500">Suas informações, matérias e grade horária</p>
        </div>
        <button
          onClick={handleSalvar}
          disabled={salvando}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#2D1B69] text-white rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-all"
        >
          {salvando ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          Salvar alterações
        </button>
      </div>

      {sucesso && <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-2xl">✓ {sucesso}</div>}
      {erro && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-2xl">{erro}</div>}

      {/* Dados Pessoais */}
      <div className="bg-white rounded-[2rem] border border-gray-100 p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-50 rounded-xl text-[#2D1B69]"><User size={18} /></div>
          <h3 className="font-bold text-gray-800">Dados Pessoais</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Nome</label>
            <input
              type="text"
              value={perfil.nome}
              onChange={(e) => setPerfil((p) => ({ ...p, nome: e.target.value }))}
              className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-100 focus:ring-2 focus:ring-purple-200 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">E-mail</label>
            <input
              type="email"
              value={perfil.email}
              disabled
              className="w-full px-4 py-2.5 bg-gray-100 rounded-xl text-sm border border-gray-100 text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Alterar senha */}
        <div className="pt-2 border-t border-gray-50">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Alterar senha (opcional)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Senha atual</label>
              <input
                type="password"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                placeholder="••••••"
                className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-100 focus:ring-2 focus:ring-purple-200 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Nova senha</label>
              <input
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-100 focus:ring-2 focus:ring-purple-200 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Matérias */}
      <div className="bg-white rounded-[2rem] border border-gray-100 p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-50 rounded-xl text-[#2D1B69]"><BookOpen size={18} /></div>
          <h3 className="font-bold text-gray-800">Matérias que leciona</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {MATERIAS.map((m) => (
            <button
              key={m}
              onClick={() => toggleMateria(m)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                perfil.materias.includes(m)
                  ? "bg-[#2D1B69] text-white"
                  : "bg-gray-50 text-gray-500 border border-gray-100 hover:border-purple-200"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Anos */}
      <div className="bg-white rounded-[2rem] border border-gray-100 p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-50 rounded-xl text-[#2D1B69]"><BookOpen size={18} /></div>
          <h3 className="font-bold text-gray-800">Anos / Séries que leciona</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {ANOS.map((a) => (
            <button
              key={a}
              onClick={() => toggleAno(a)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                perfil.anos.includes(a)
                  ? "bg-[#2D1B69] text-white"
                  : "bg-gray-50 text-gray-500 border border-gray-100 hover:border-purple-200"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Grade Horária */}
      <div className="bg-white rounded-[2rem] border border-gray-100 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-xl text-[#2D1B69]"><Clock size={18} /></div>
            <div>
              <h3 className="font-bold text-gray-800">Grade Horária</h3>
              <p className="text-xs text-gray-400">Suas aulas semanais</p>
            </div>
          </div>
          <button
            onClick={adicionarAula}
            className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 text-[#2D1B69] rounded-xl text-xs font-bold hover:bg-purple-100 transition-all"
          >
            <Plus size={14} /> Adicionar aula
          </button>
        </div>

        {perfil.grade.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            Nenhuma aula adicionada ainda. Clique em "Adicionar aula".
          </div>
        ) : (
          <div className="space-y-3">
            {perfil.grade.map((aula, i) => (
              <div key={i} className="grid grid-cols-2 sm:grid-cols-5 gap-2 items-center bg-gray-50 rounded-2xl p-3">
                <select
                  value={aula.diaSemana}
                  onChange={(e) => atualizarAula(i, "diaSemana", Number(e.target.value))}
                  className="px-3 py-2 bg-white rounded-xl text-xs border border-gray-100 focus:ring-2 focus:ring-purple-200 outline-none"
                >
                  {DIAS.map((d, idx) => <option key={d} value={idx}>{d}</option>)}
                </select>

                <div className="flex gap-1 items-center">
                  <select
                    value={aula.horaInicio}
                    onChange={(e) => atualizarAula(i, "horaInicio", e.target.value)}
                    className="flex-1 px-2 py-2 bg-white rounded-xl text-xs border border-gray-100 focus:ring-2 focus:ring-purple-200 outline-none"
                  >
                    {HORARIOS.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                  <span className="text-gray-300 text-xs">→</span>
                  <select
                    value={aula.horaFim}
                    onChange={(e) => atualizarAula(i, "horaFim", e.target.value)}
                    className="flex-1 px-2 py-2 bg-white rounded-xl text-xs border border-gray-100 focus:ring-2 focus:ring-purple-200 outline-none"
                  >
                    {HORARIOS.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>

                <select
                  value={aula.componente}
                  onChange={(e) => atualizarAula(i, "componente", e.target.value)}
                  className="px-3 py-2 bg-white rounded-xl text-xs border border-gray-100 focus:ring-2 focus:ring-purple-200 outline-none"
                >
                  <option value="">Matéria</option>
                  {MATERIAS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>

                <select
                  value={aula.serie}
                  onChange={(e) => atualizarAula(i, "serie", e.target.value)}
                  className="px-3 py-2 bg-white rounded-xl text-xs border border-gray-100 focus:ring-2 focus:ring-purple-200 outline-none"
                >
                  <option value="">Turma/Ano</option>
                  {ANOS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>

                <button
                  onClick={() => removerAula(i)}
                  className="flex items-center justify-center p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}