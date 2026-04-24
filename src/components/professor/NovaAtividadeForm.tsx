"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Save,
  Loader2,
  CheckCircle,
  Brain,
} from "lucide-react";

type Turma = { id: string; nome: string; serie: string };

type Metodo =
  | "SOCRATICO"
  | "SCAFFOLDING"
  | "PBL"
  | "REFLEXIVO"
  | "DEBATE";

const METODOS: Record<Metodo, { label: string; descricao: string }> = {
  SOCRATICO: {
    label: "Socrático",
    descricao:
      "A Luma nunca dá a resposta pronta; conduz o aluno por perguntas até a descoberta.",
  },
  SCAFFOLDING: {
    label: "Scaffolding",
    descricao:
      "A Luma oferece apoio gradual e vai retirando a ajuda conforme o aluno avança.",
  },
  PBL: {
    label: "Aprendizagem por Problema",
    descricao:
      "A Luma organiza a sessão em torno de um problema concreto e desafia as hipóteses do aluno.",
  },
  REFLEXIVO: {
    label: "Diálogo Reflexivo",
    descricao:
      "A Luma acolhe, organiza o pensamento do aluno e ajuda a verbalizar o que ele já sabe.",
  },
  DEBATE: {
    label: "Debate Estruturado",
    descricao:
      "A Luma provoca contrapontos e exige justificativas mais consistentes do aluno.",
  },
};

export default function NovaAtividadeForm({
  turmas,
}: {
  turmas: Turma[];
  professorId: string;
}) {
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [ancora, setAncora] = useState("");
  const [turmaId, setTurmaId] = useState(turmas[0]?.id ?? "");
  const [material, setMaterial] = useState("");

  const [metodo, setMetodo] = useState<Metodo>("SOCRATICO");
  const [metodoJustificativa, setMetodoJustificativa] = useState("");
  const [mostrarEscolhaManual, setMostrarEscolhaManual] = useState(false);
  const [sugerindoMetodo, setSugerindoMetodo] = useState(false);

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const turmaSelecionada = turmas.find((t) => t.id === turmaId);

  async function sugerirMetodo() {
    if (!titulo || !ancora) {
      setErro("Preencha título e âncora antes de pedir a sugestão da Luma.");
      return;
    }

    setErro("");
    setSugerindoMetodo(true);

    try {
      const res = await fetch("/api/sessoes/sugerir-metodo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo,
          ancora,
          serie: turmaSelecionada?.serie,
        }),
      });

      if (!res.ok) {
        setErro("Não foi possível gerar a sugestão da Luma.");
        return;
      }

      const data = await res.json();
      setMetodo((data.metodo as Metodo) ?? "SOCRATICO");
      setMetodoJustificativa(
        data.justificativa ?? "Método sugerido automaticamente pela Luma."
      );
      setMostrarEscolhaManual(false);
    } catch {
      setErro("Erro ao pedir sugestão da Luma.");
    } finally {
      setSugerindoMetodo(false);
    }
  }

  async function handleSalvar(status: "RASCUNHO" | "ABERTA") {
    if (!titulo || !ancora || !turmaId) {
      setErro("Preencha título, âncora e turma.");
      return;
    }

    setSalvando(true);
    setErro("");

    try {
      const res = await fetch("/api/sessoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo,
          ancora,
          turmaId,
          material,
          status,
          metodo,
          metodoJustificativa,
        }),
      });

      if (!res.ok) {
        setErro("Erro ao salvar. Tente novamente.");
        setSalvando(false);
        return;
      }

      router.push("/dashboard/professor/atividades");
      router.refresh();
    } catch {
      setErro("Erro ao salvar. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-purple-50 shadow-sm p-8 space-y-6">
      {/* Turma */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">
          Turma
        </label>
        <select
          value={turmaId}
          onChange={(e) => setTurmaId(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
        >
          {turmas.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nome} — {t.serie}
            </option>
          ))}
        </select>
      </div>

      {/* Título */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">
          Título da atividade
        </label>
        <input
          type="text"
          placeholder="Ex: O que é justiça?"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
      </div>

      {/* Âncora */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">
          Âncora analógica
          <span className="text-xs text-gray-400 font-normal ml-2">
            — o ponto de partida offline
          </span>
        </label>
        <input
          type="text"
          placeholder="Ex: Leitura do capítulo 3, observar a imagem da pág. 42..."
          value={ancora}
          onChange={(e) => setAncora(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
      </div>

      {/* Método */}
      <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Brain size={16} className="text-purple-600" />
          <h3 className="text-sm font-semibold text-gray-800">
            Método pedagógico
          </h3>
        </div>

        <div className="flex gap-3 mb-4">
          <button
            type="button"
            onClick={sugerirMetodo}
            disabled={sugerindoMetodo}
            className="px-4 py-2 rounded-xl bg-white border border-purple-200 text-sm text-purple-700 hover:bg-purple-50 transition-colors flex items-center gap-2 disabled:opacity-60"
          >
            {sugerindoMetodo ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Sparkles size={14} />
            )}
            Pedir sugestão da Luma
          </button>

          <button
            type="button"
            onClick={() => setMostrarEscolhaManual((prev) => !prev)}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Escolher manualmente
          </button>
        </div>

        {!!metodoJustificativa && !mostrarEscolhaManual && (
          <div className="bg-white border border-purple-100 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle size={14} className="text-green-500" />
              <p className="text-sm font-medium text-gray-800">
                Sugestão da Luma: {METODOS[metodo].label}
              </p>
            </div>
            <p className="text-sm text-gray-600">{metodoJustificativa}</p>
          </div>
        )}

        {mostrarEscolhaManual && (
          <div className="space-y-2">
            {(Object.keys(METODOS) as Metodo[]).map((m) => (
              <label
                key={m}
                className={`block rounded-xl border p-3 cursor-pointer transition-colors ${
                  metodo === m
                    ? "border-purple-300 bg-white"
                    : "border-gray-200 bg-white hover:border-purple-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="metodo"
                    checked={metodo === m}
                    onChange={() => setMetodo(m)}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {METODOS[m].label}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {METODOS[m].descricao}
                    </p>
                  </div>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Material */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">
          Material de apoio
          <span className="text-xs text-gray-400 font-normal ml-2">
            — opcional
          </span>
        </label>
        <textarea
          placeholder="Cole aqui um texto, trecho do livro, URL ou qualquer conteúdo que a IA deve usar para gerar as perguntas..."
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          rows={5}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
        />
        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
          <Sparkles size={11} />
          A Luma vai usar esse material para personalizar a sessão.
        </p>
      </div>

      {erro && <p className="text-xs text-red-500">{erro}</p>}

      {/* Botões */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => handleSalvar("RASCUNHO")}
          disabled={salvando}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Salvar rascunho
        </button>

        <button
          onClick={() => handleSalvar("ABERTA")}
          disabled={salvando}
          className="flex-1 py-2.5 rounded-xl bg-[#2D1B69] text-white text-sm font-semibold hover:bg-[#3d2b89] transition-colors flex items-center justify-center gap-2"
        >
          <Save size={15} />
          {salvando ? "Salvando..." : "Publicar atividade"}
        </button>
      </div>
    </div>
  );
}