"use client";

import { useState } from "react";
import { Link2, Copy, Check, Loader2, Users, GraduationCap } from "lucide-react";

type Convite = {
  token: string;
  tipo: string;
  link: string;
  expiraEm: string;
};

export default function GerarConvite() {
  const [tipo, setTipo] = useState<"PROFESSOR" | "FAMILIA">("PROFESSOR");
  const [email, setEmail] = useState("");
  const [gerando, setGerando] = useState(false);
  const [convite, setConvite] = useState<Convite | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [erro, setErro] = useState("");

  async function handleGerar() {
    setGerando(true);
    setErro("");
    setConvite(null);
    try {
      const res = await fetch("/api/convites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, email: email || null }),
      });
      const data = await res.json();
      if (!res.ok) { setErro(data.error || "Erro ao gerar convite."); return; }
      setConvite(data);
    } catch {
      setErro("Erro inesperado.");
    } finally {
      setGerando(false);
    }
  }

  function copiarLink() {
    if (!convite) return;
    navigator.clipboard.writeText(convite.link);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div className="bg-white rounded-[2rem] border border-purple-100 p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-50 rounded-xl text-[#2D1B69]">
          <Link2 size={20} />
        </div>
        <div>
          <h3 className="font-bold text-gray-800">Gerar Convite</h3>
          <p className="text-xs text-gray-400">Envie o link para professores ou famílias</p>
        </div>
      </div>

      {/* Tipo */}
      <div className="flex gap-2">
        <button
          onClick={() => setTipo("PROFESSOR")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
            tipo === "PROFESSOR" ? "bg-[#2D1B69] text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
          }`}
        >
          <GraduationCap size={15} /> Professor
        </button>
        <button
          onClick={() => setTipo("FAMILIA")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
            tipo === "FAMILIA" ? "bg-[#2D1B69] text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
          }`}
        >
          <Users size={15} /> Família
        </button>
      </div>

      {/* Email opcional */}
      <div>
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
          E-mail (opcional)
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Pré-preencher o e-mail do convidado"
          className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-100 focus:ring-2 focus:ring-purple-200 outline-none"
        />
      </div>

      <button
        onClick={handleGerar}
        disabled={gerando}
        className="w-full py-2.5 bg-[#2D1B69] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all"
      >
        {gerando ? <><Loader2 size={15} className="animate-spin" /> Gerando...</> : <><Link2 size={15} /> Gerar link de convite</>}
      </button>

      {erro && <p className="text-red-500 text-xs text-center">{erro}</p>}

      {/* Link gerado */}
      {convite && (
        <div className="bg-purple-50 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
              Link gerado — {convite.tipo === "PROFESSOR" ? "Professor" : "Família"}
            </span>
            <span className="text-[10px] text-gray-400">
              Expira em {new Date(convite.expiraEm).toLocaleDateString("pt-BR")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={convite.link}
              className="flex-1 px-3 py-2 bg-white border border-purple-100 rounded-xl text-xs text-gray-600 outline-none truncate"
            />
            <button
              onClick={copiarLink}
              className="p-2 bg-[#2D1B69] text-white rounded-xl hover:opacity-90 transition-all shrink-0"
              title="Copiar link"
            >
              {copiado ? <Check size={15} /> : <Copy size={15} />}
            </button>
          </div>
          <p className="text-[10px] text-gray-400">
            Compartilhe este link. Ele é válido por 7 dias e pode ser usado uma única vez.
          </p>
        </div>
      )}
    </div>
  );
}