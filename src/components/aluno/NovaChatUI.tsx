"use client";

import { useEffect, useRef, useState } from "react";

type Mensagem = {
  role: "aluno" | "nova";
  content: string;
};

type Modo = "REVISAO" | "MEMORIA" | "MIX" | "FEYNMAN" | null;

const MODOS = [
  { id: "REVISAO", emoji: "🔁", label: "Revisão", desc: "Foca nos seus pontos fracos" },
  { id: "MEMORIA", emoji: "🧠", label: "Memória", desc: "Lembra sem ver o material" },
  { id: "MIX", emoji: "🔀", label: "Mix", desc: "Mistura temas para testar conexões" },
  { id: "FEYNMAN", emoji: "🧪", label: "Feynman", desc: "Explica como para uma criança" },
];

function renderHTML(content: string) {
  return content
    .replace(/\*\*(.*?)\*\*/g, "<strong style='color:#C4B5FD'>$1</strong>")
    .replace(/\n/g, "<br/>")
    .replace(/```([\s\S]*?)```/g, "<pre style='background:rgba(0,0,0,0.3);padding:12px;border-radius:12px;font-size:12px;font-family:monospace;margin-top:8px;overflow-x:auto;color:#DDD6FE'>$1</pre>");
}

export default function NovaChatUI({ sessaoId }: { sessaoId?: string }) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [input, setInput] = useState("");
  const [modo, setModo] = useState<Modo>(null);
  const [carregando, setCarregando] = useState(false);
  const [iniciando, setIniciando] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function iniciarConversa() {
    setIniciando(true);
    setCarregando(true);
    try {
      const res = await fetch("/api/nova/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagens: [], modo: null, sessaoId: sessaoId || null }),
      });
      const data = await res.json();
      setMensagens([{ role: "nova", content: data.resposta || "Oi! Sou a Nova. Escolhe um modo para começar." }]);
    } catch {
      setMensagens([{ role: "nova", content: "Oi! Sou a Nova. Escolhe um modo acima para começar." }]);
    } finally {
      setCarregando(false);
      setIniciando(false);
    }
  }

  async function enviar(texto?: string) {
    const conteudo = texto ?? input.trim();
    if (!conteudo || carregando) return;

    const novasMensagens: Mensagem[] = [
      ...mensagens,
      { role: "aluno", content: conteudo },
    ];
    setMensagens(novasMensagens);
    setInput("");
    setCarregando(true);

    try {
      const res = await fetch("/api/nova/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagens: novasMensagens, modo, sessaoId: sessaoId || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro");
      setMensagens((prev) => [...prev, { role: "nova", content: data.resposta }]);
    } catch {
      setMensagens((prev) => [...prev, { role: "nova", content: "Ops — tive um problema. Tenta de novo?" }]);
    } finally {
      setCarregando(false);
    }
  }

  function selecionarModo(id: Modo) {
    setModo(id);
    const label = MODOS.find((m) => m.id === id)?.label || "";
    enviar(`Quero usar o modo ${label}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  }

  useEffect(() => { iniciarConversa(); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [mensagens, carregando]);

  return (
    <div
      className="flex h-[calc(100vh-200px)] min-h-[600px] flex-col overflow-hidden rounded-3xl border shadow-2xl"
      style={{ background: "#1E1040", borderColor: "#3D2B7A" }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4"
        style={{ background: "#2D1B69", borderBottom: "1px solid #3D2B7A" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-2xl text-xl"
            style={{ background: "linear-gradient(135deg, #7C3AED, #C4B5FD)" }}
          >
            ✦
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Nova</h2>
            <p className="text-xs font-medium" style={{ color: "#C4B5FD" }}>
              Parceira de revisão científica
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {modo && (
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: "rgba(196,181,253,0.15)", color: "#C4B5FD", border: "1px solid rgba(196,181,253,0.2)" }}
            >
              {MODOS.find((m) => m.id === modo)?.emoji} {MODOS.find((m) => m.id === modo)?.label}
            </span>
          )}
          <button
            type="button"
            onClick={() => { setMensagens([]); setModo(null); iniciarConversa(); }}
            className="rounded-2xl px-3 py-1 text-xs font-semibold transition-all hover:bg-white/10"
            style={{ color: "#A78BFA", border: "1px solid #3D2B7A" }}
          >
            Reiniciar
          </button>
        </div>
      </header>

      {/* Seletor de modo */}
      <div
        className="grid grid-cols-4 gap-2 px-4 py-3"
        style={{ background: "#251558", borderBottom: "1px solid #3D2B7A" }}
      >
        {MODOS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => selecionarModo(m.id as Modo)}
            className="flex flex-col items-center gap-1 rounded-2xl px-2 py-3 text-center transition-all hover:-translate-y-0.5"
            style={{
              background: modo === m.id ? "rgba(196,181,253,0.15)" : "rgba(255,255,255,0.04)",
              border: modo === m.id ? "1px solid rgba(196,181,253,0.4)" : "1px solid #3D2B7A",
            }}
          >
            <span className="text-lg">{m.emoji}</span>
            <span
              className="text-[11px] font-semibold"
              style={{ color: modo === m.id ? "#C4B5FD" : "#9CA3AF" }}
            >
              {m.label}
            </span>
          </button>
        ))}
      </div>

      {/* Mensagens */}
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-6">
        {iniciando ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div
                className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"
                style={{ borderColor: "#A78BFA" }}
              />
              <p className="text-sm font-medium" style={{ color: "#C4B5FD" }}>
                Nova carregando seu histórico...
              </p>
            </div>
          </div>
        ) : (
          mensagens.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === "aluno" ? "flex-row-reverse" : "flex-row"}`}
            >
              {msg.role === "nova" && (
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl text-sm"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #C4B5FD)" }}
                >
                  ✦
                </div>
              )}

              <div
                className="max-w-[78%] rounded-3xl px-4 py-3 text-sm leading-7"
                style={
                  msg.role === "nova"
                    ? { background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)", color: "#EDE9FE" }
                    : { background: "rgba(196,181,253,0.15)", border: "1px solid rgba(196,181,253,0.2)", color: "#F5F3FF" }
                }
              >
                <div dangerouslySetInnerHTML={{ __html: renderHTML(msg.content) }} />
              </div>

              {msg.role === "aluno" && (
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl text-xs font-bold"
                  style={{ background: "rgba(255,255,255,0.08)", color: "#A78BFA" }}
                >
                  eu
                </div>
              )}
            </div>
          ))
        )}

        {carregando && !iniciando && (
          <div className="flex gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl text-sm"
              style={{ background: "linear-gradient(135deg, #7C3AED, #C4B5FD)" }}
            >
              ✦
            </div>
            <div
              className="flex items-center gap-2 rounded-3xl px-4 py-3"
              style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)" }}
            >
              <span className="h-2 w-2 animate-bounce rounded-full bg-[#A78BFA]" style={{ animationDelay: "0ms" }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-[#A78BFA]" style={{ animationDelay: "150ms" }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-[#A78BFA]" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="px-4 py-4"
        style={{ background: "#2D1B69", borderTop: "1px solid #3D2B7A" }}
      >
        <div
          className="flex items-end gap-3 rounded-2xl border px-4 py-3"
          style={{ background: "#1E1040", borderColor: "#4C3690" }}
        >
          <textarea
            rows={1}
            placeholder="Responda ou pergunte para a Nova..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={carregando || iniciando}
            className="flex-1 resize-none bg-transparent text-sm leading-6 outline-none placeholder:text-purple-400/50"
            style={{ color: "#EDE9FE", maxHeight: "120px" }}
          />
          <button
            type="button"
            onClick={() => enviar()}
            disabled={!input.trim() || carregando || iniciando}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all hover:scale-105 disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #7C3AED, #A78BFA)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22 11 13 2 9l20-7z" />
            </svg>
          </button>
        </div>
        <p className="mt-2 text-center text-[11px]" style={{ color: "#6D4FA0" }}>
          Enter para enviar · Shift+Enter para quebrar linha
        </p>
      </div>
    </div>
  );
}