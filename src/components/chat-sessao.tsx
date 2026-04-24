"use client";

import { useState } from "react";

type Mensagem = {
  role: "aluno" | "luma";
  content: string;
};

export function ChatSessao({ sessaoId }: { sessaoId: string }) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [input, setInput] = useState("");
  const [resumo, setResumo] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [encerrando, setEncerrando] = useState(false);
  const [erro, setErro] = useState("");

  async function enviarMensagem() {
    if (!input.trim() || carregando || encerrando) return;

    setErro("");
    const mensagensAnteriores = [...mensagens];
    const novasMensagens: Mensagem[] = [
      ...mensagens,
      { role: "aluno", content: input.trim() },
    ];

    setMensagens(novasMensagens);
    setInput("");
    setCarregando(true);

    try {
      const res = await fetch("/api/sessao/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessaoId,
          mensagens: novasMensagens,
          encerrar: false,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao enviar mensagem");
      }

      setMensagens([
        ...novasMensagens,
        { role: "luma", content: data.resposta },
      ]);
    } catch (e: any) {
      setErro(e.message || "Erro inesperado");
      setMensagens(mensagensAnteriores);
    } finally {
      setCarregando(false);
    }
  }

  async function iniciarSessao() {
    if (mensagens.length > 0 || carregando || encerrando) return;

    setErro("");
    setCarregando(true);

    try {
      const res = await fetch("/api/sessao/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessaoId,
          mensagens: [],
          encerrar: false,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao iniciar sessão");
      }

      setMensagens([{ role: "luma", content: data.resposta }]);
    } catch (e: any) {
      setErro(e.message || "Erro inesperado");
    } finally {
      setCarregando(false);
    }
  }

  async function finalizarSessao() {
    if (mensagens.length === 0 || carregando || encerrando) return;

    setErro("");
    setEncerrando(true);

    try {
      const res = await fetch("/api/sessao/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessaoId,
          mensagens,
          encerrar: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao finalizar sessão");
      }

      setResumo(data.resumo || "");
    } catch (e: any) {
      setErro(e.message || "Erro inesperado");
    } finally {
      setEncerrando(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={iniciarSessao}
          disabled={carregando || encerrando || mensagens.length > 0}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Iniciar sessão
        </button>

        <button
          onClick={finalizarSessao}
          disabled={carregando || encerrando || mensagens.length === 0}
          className="rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {encerrando ? "Finalizando..." : "Finalizar sessão"}
        </button>
      </div>

      <div className="space-y-3 rounded border p-4">
        {mensagens.length === 0 && (
          <p className="text-sm text-gray-500">A conversa ainda não começou.</p>
        )}

        {mensagens.map((msg, index) => (
          <div
            key={index}
            className={`rounded p-3 ${
              msg.role === "aluno"
                ? "bg-blue-50 text-blue-900"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            <p className="mb-1 text-xs font-semibold uppercase">
              {msg.role === "aluno" ? "Aluno" : "Luma"}
            </p>
            <p className="whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escreva sua resposta..."
          className="min-h-[100px] flex-1 rounded border p-3"
          disabled={carregando || encerrando}
        />
        <button
          onClick={enviarMensagem}
          disabled={!input.trim() || carregando || encerrando}
          className="rounded bg-purple-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {carregando ? "Enviando..." : "Enviar"}
        </button>
      </div>

      {erro && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {erro}
        </div>
      )}

      {resumo && (
        <div className="rounded border border-green-200 bg-green-50 p-4">
          <p className="mb-2 text-sm font-semibold text-green-800">
            Resumo da sessão
          </p>
          <p className="whitespace-pre-wrap text-sm text-green-900">{resumo}</p>
        </div>
      )}
    </div>
  );
}