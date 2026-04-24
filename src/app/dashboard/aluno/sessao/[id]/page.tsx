"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Sparkles, Send, Clock, Lock } from "lucide-react";
import Link from "next/link";

type Mensagem = {
  role: "luma" | "aluno";
  content: string;
};

type StatusSessao = "rascunho" | "ativa" | "encerrada" | null;

export default function SessaoPage() {
  const { id } = useParams<{ id: string }>();
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [input, setInput] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [sessaoIniciada, setSessaoIniciada] = useState(false);
  const [statusSessao, setStatusSessao] = useState<StatusSessao>(null);
  const [tituloSessao, setTituloSessao] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Verifica status da sessão ao carregar
  useEffect(() => {
    const verificarSessao = async () => {
      const res = await fetch(`/api/sessao/${id}/status`);
      const data = await res.json();
      setStatusSessao(data.status);
      setTituloSessao(data.titulo);
      if (data.status === "ativa") setSessaoIniciada(true);
    };
    verificarSessao();
  }, [id]);

  // Inicia o chat socrático (só se ativa)
  useEffect(() => {
    if (!sessaoIniciada || statusSessao !== "ativa") return;

    const iniciar = async () => {
      setCarregando(true);
      try {
        const res = await fetch("/api/sessao/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessaoId: id, mensagens: [] }),
        });
        const data = await res.json();
        setMensagens([{ role: "luma", content: data.resposta }]);
      } catch (err) {
        console.error(err);
      } finally {
        setCarregando(false);
      }
    };

    iniciar();
  }, [id, sessaoIniciada, statusSessao]);

  // Scroll automático
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, carregando]);

  const enviar = async () => {
    if (!input.trim() || carregando || statusSessao !== "ativa") return;

    const novasMensagens: Mensagem[] = [
      ...mensagens,
      { role: "aluno", content: input },
    ];
    setMensagens(novasMensagens);
    setInput("");
    setCarregando(true);

    try {
      const res = await fetch("/api/sessao/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessaoId: id, mensagens: novasMensagens }),
      });
      const data = await res.json();
      setMensagens([...novasMensagens, { role: "luma", content: data.resposta }]);
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  // Estado: carregando status
  if (statusSessao === null) {
    return (
      <div className="min-h-screen bg-[#FAF9FF] flex items-center justify-center">
        <div className="flex gap-1">
          <span className="w-3 h-3 bg-purple-300 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-3 h-3 bg-purple-300 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-3 h-3 bg-purple-300 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    );
  }

  // Estado: sessão em rascunho
  if (statusSessao === "rascunho") {
    return (
      <div className="min-h-screen bg-[#FAF9FF] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-12 text-center border border-purple-100">
          <div className="w-20 h-20 bg-yellow-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Clock size={36} className="text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Sessão em Preparação</h2>
          <p className="text-gray-500 mb-8">
            Seu professor ainda não iniciou esta sessão. Aguarde!
          </p>
          <Link
            href="/dashboard/aluno"
            className="bg-[#2D1B69] hover:bg-[#3d2a85] text-white px-8 py-3 rounded-xl font-medium inline-flex items-center gap-2 transition-colors"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  // Estado: sessão encerrada
  if (statusSessao === "encerrada") {
    return (
      <div className="min-h-screen bg-[#FAF9FF] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-12 text-center border border-purple-100">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock size={36} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Sessão Encerrada</h2>
          <p className="text-gray-500 mb-8">
            Esta sessão foi encerrada pelo professor. Consulte o resumo no seu perfil.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/dashboard/aluno/perfil"
              className="bg-[#2D1B69] hover:bg-[#3d2a85] text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Ver Resumo
            </Link>
            <Link
              href="/dashboard/aluno"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Voltar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Estado: sessão ativa — chat socrático
  return (
    <div className="w-full max-w-2xl flex flex-col h-[85vh] bg-white rounded-3xl shadow-xl border border-purple-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-purple-50 flex items-center gap-3 bg-[#2D1B69]">
        <div className="w-8 h-8 rounded-full bg-[#F5A623] flex items-center justify-center">
          <Sparkles size={16} className="text-white" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm">Luma</p>
          <p className="text-white/50 text-xs">{tituloSessao || "Tutora socrática"}</p>
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-[#FAF9FF]">
        {mensagens.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "aluno" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                m.role === "aluno"
                  ? "bg-[#2D1B69] text-white rounded-br-sm"
                  : "bg-white text-gray-700 border border-purple-100 shadow-sm rounded-bl-sm"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {carregando && (
          <div className="flex justify-start">
            <div className="bg-white border border-purple-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
              <span className="w-2 h-2 bg-purple-300 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 bg-purple-300 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 bg-purple-300 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-purple-50 bg-white flex gap-3 items-end">
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              enviar();
            }
          }}
          placeholder="Escreva sua resposta..."
          className="flex-1 resize-none rounded-xl border border-purple-100 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-200 bg-[#FAF9FF]"
        />
        <button
          onClick={enviar}
          disabled={carregando || !input.trim()}
          className="w-10 h-10 rounded-xl bg-[#2D1B69] text-white flex items-center justify-center hover:bg-[#3d2a85] transition-colors disabled:opacity-40"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}