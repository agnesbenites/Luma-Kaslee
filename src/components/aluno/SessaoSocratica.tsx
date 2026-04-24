"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, BookOpen } from "lucide-react";

const MAX_TURNOS = 5;

type Mensagem = { role: "user" | "assistant"; content: string };

export default function SessaoSocratica({
  sessaoId,
  titulo,
  ancora,
  material,
  alunoNome,
}: {
  sessaoId: string;
  titulo: string;
  ancora: string;
  material: string;
  alunoNome: string;
}) {
  const [fase, setFase] = useState<"ancora" | "loop" | "fim">("ancora");
  const [texto, setTexto] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [turno, setTurno] = useState(1);
  const [historico, setHistorico] = useState<Mensagem[]>([]);
  const [perguntaAtual, setPerguntaAtual] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inicioEscrita = useRef<number>(0);

  useEffect(() => {
    if (fase === "loop") textareaRef.current?.focus();
  }, [fase, perguntaAtual]);

  async function handleEnviar() {
    if (!texto.trim() || carregando) return;

    const tempoEscrita = Date.now() - inicioEscrita.current;
    setCarregando(true);

    const novoHistorico: Mensagem[] = [
      ...historico,
      { role: "user", content: texto },
    ];

    const res = await fetch("/api/socratico", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessaoId,
        respostaAluno: texto,
        turno,
        historico,
        material,
        tempoEscrita,
      }),
    });

    const data = await res.json();
    const novoPergunta = data.pergunta;

    setHistorico([...novoHistorico, { role: "assistant", content: novoPergunta }]);
    setPerguntaAtual(novoPergunta);
    setTexto("");
    setCarregando(false);

    if (turno >= MAX_TURNOS) {
      setFase("fim");
    } else {
      setTurno((t) => t + 1);
    }
  }

  function handleFocoTexto() {
    inicioEscrita.current = Date.now();
  }

  // Tela de âncora
  if (fase === "ancora") {
    return (
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="text-[#F5A623]" size={20} />
            <span className="text-lg font-bold text-[#2D1B69]">Luma</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">{titulo}</h1>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-purple-100 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={18} className="text-purple-400" />
            <span className="text-sm font-semibold text-gray-700">Âncora da aula</span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{ancora}</p>
        </div>

        <p className="text-center text-xs text-gray-400 mb-6">
          Faça a leitura ou atividade acima antes de continuar. Sem pressa. 📖
        </p>

        <button
          onClick={() => {
            setFase("loop");
            setPerguntaAtual(`${alunoNome.split(" ")[0]}, depois de fazer a âncora, o que passou pela sua cabeça? Escreva com suas próprias palavras.`);
            inicioEscrita.current = Date.now();
          }}
          className="w-full py-3 rounded-2xl bg-[#2D1B69] text-white font-semibold text-sm hover:bg-[#3d2b89] transition-colors flex items-center justify-center gap-2"
        >
          <Sparkles size={16} />
          Já fiz a âncora, quero começar
        </button>
      </div>
    );
  }

  // Tela de fim
  if (fase === "fim") {
    return (
      <div className="w-full max-w-lg text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Sparkles className="text-[#F5A623]" size={20} />
          <span className="text-lg font-bold text-[#2D1B69]">Luma</span>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-purple-100 shadow-sm">
          <p className="text-3xl mb-4">✨</p>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Sessão concluída!</h2>
          <p className="text-gray-400 text-sm mb-6">
            Seu raciocínio foi registrado. O professor vai ver seu progresso em breve.
          </p>
          <a
            href="/dashboard/aluno"
            className="inline-block px-6 py-2.5 rounded-xl bg-[#2D1B69] text-white text-sm font-semibold hover:bg-[#3d2b89] transition-colors"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    );
  }

  // Loop socrático
  return (
    <div className="w-full max-w-lg">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Sparkles className="text-[#F5A623]" size={18} />
          <span className="font-bold text-[#2D1B69]">Luma</span>
        </div>
        <span className="text-xs text-gray-400">
          {turno}/{MAX_TURNOS} turnos
        </span>
      </div>

      {/* Barra de progresso */}
      <div className="w-full h-1 bg-gray-100 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-[#2D1B69] rounded-full transition-all duration-500"
          style={{ width: `${((turno - 1) / MAX_TURNOS) * 100}%` }}
        />
      </div>

      {/* Pergunta da Luma */}
      <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm mb-6">
        <p className="text-gray-800 text-sm leading-relaxed">{perguntaAtual}</p>
      </div>

      {/* Input do aluno */}
      <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
        <textarea
          ref={textareaRef}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onFocus={handleFocoTexto}
          placeholder="Escreva com suas próprias palavras..."
          rows={5}
          className="w-full px-6 py-5 text-sm text-gray-700 resize-none focus:outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.metaKey) handleEnviar();
          }}
        />
        <div className="px-4 pb-4 flex justify-end">
          <button
            onClick={handleEnviar}
            disabled={!texto.trim() || carregando}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2D1B69] text-white text-sm font-semibold disabled:opacity-40 hover:bg-[#3d2b89] transition-colors"
          >
            {carregando ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Pensando...
              </span>
            ) : (
              <>
                <Send size={14} />
                Enviar
              </>
            )}
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-gray-300 mt-4">
        ⌘ + Enter para enviar
      </p>
    </div>
  );
}