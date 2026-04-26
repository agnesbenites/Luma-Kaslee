"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, UserCheck, AlertCircle } from "lucide-react";

type ConviteInfo = {
  tipo: "PROFESSOR" | "FAMILIA";
  escolaNome: string;
  email?: string;
};

export default function CadastroConvitePage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [convite, setConvite] = useState<ConviteInfo | null>(null);
  const [tokenInvalido, setTokenInvalido] = useState(false);
  const [carregandoToken, setCarregandoToken] = useState(true);

  const [form, setForm] = useState({ nome: "", email: "", senha: "", confirmarSenha: "" });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    async function validarToken() {
      try {
        const res = await fetch(`/api/cadastro/convite/${token}`);
        if (!res.ok) { setTokenInvalido(true); return; }
        const data = await res.json();
        setConvite(data);
        if (data.email) setForm((f) => ({ ...f, email: data.email }));
      } catch {
        setTokenInvalido(true);
      } finally {
        setCarregandoToken(false);
      }
    }
    validarToken();
  }, [token]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (form.senha !== form.confirmarSenha) { setErro("As senhas não coincidem."); return; }
    if (form.senha.length < 6) { setErro("A senha deve ter pelo menos 6 caracteres."); return; }

    setCarregando(true);
    try {
      const res = await fetch("/api/cadastro/convite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nome: form.nome, email: form.email, senha: form.senha }),
      });

      const data = await res.json();
      if (!res.ok) { setErro(data.error || "Erro ao criar conta."); return; }

      router.push("/login?cadastro=convite");
    } catch {
      setErro("Erro inesperado. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  if (carregandoToken) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #1a0f3d 0%, #2D1B69 60%, #3d1f5c 100%)" }}>
        <Loader2 size={32} className="animate-spin" style={{ color: "#F5C542" }} />
      </div>
    );
  }

  if (tokenInvalido) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "linear-gradient(135deg, #1a0f3d 0%, #2D1B69 60%, #3d1f5c 100%)" }}>
        <div className="text-center space-y-4">
          <AlertCircle size={48} className="mx-auto text-red-400" />
          <h2 className="text-xl font-bold text-white">Convite inválido ou expirado</h2>
          <p style={{ color: "#C4B8F0" }} className="text-sm">Este link de convite não é mais válido.</p>
          <Link href="/login" className="inline-block px-6 py-2 rounded-xl font-bold text-sm"
            style={{ background: "#F5C542", color: "#2D1B69" }}>
            Ir para o login
          </Link>
        </div>
      </div>
    );
  }

  const isProfessor = convite?.tipo === "PROFESSOR";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(135deg, #1a0f3d 0%, #2D1B69 60%, #3d1f5c 100%)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold" style={{ color: "#F5C542" }}>✦ Luma</h1>
          <p className="mt-2 text-sm" style={{ color: "#C4B8F0" }}>
            Você foi convidado por <strong style={{ color: "#F5C542" }}>{convite?.escolaNome}</strong>
          </p>
        </div>

        <div className="rounded-2xl p-8 space-y-5"
          style={{ background: "rgba(61, 43, 121, 0.6)", border: "1px solid #4A3880", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl" style={{ background: "rgba(245,197,66,0.15)" }}>
              <UserCheck size={20} style={{ color: "#F5C542" }} />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg">
                Criar conta de {isProfessor ? "professor" : "familiar"}
              </h2>
              <p className="text-xs" style={{ color: "#C4B8F0" }}>
                {isProfessor ? "Acesse o painel da sua turma" : "Acompanhe o progresso do seu filho"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: "#C4B8F0" }}>Nome completo *</label>
              <input name="nome" type="text" required value={form.nome} onChange={handleChange}
                placeholder="Seu nome completo"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-yellow-400/30"
                style={{ background: "rgba(45,27,105,0.8)", border: "1px solid #4A3880", color: "#F4F1FB" }} />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: "#C4B8F0" }}>E-mail *</label>
              <input name="email" type="email" required value={form.email} onChange={handleChange}
                placeholder="seu@email.com"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-yellow-400/30"
                style={{ background: "rgba(45,27,105,0.8)", border: "1px solid #4A3880", color: "#F4F1FB" }} />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: "#C4B8F0" }}>Senha *</label>
              <div className="relative">
                <input name="senha" type={mostrarSenha ? "text" : "password"} required
                  value={form.senha} onChange={handleChange} placeholder="Mínimo 6 caracteres"
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-yellow-400/30"
                  style={{ background: "rgba(45,27,105,0.8)", border: "1px solid #4A3880", color: "#F4F1FB" }} />
                <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#C4B8F0" }}>
                  {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: "#C4B8F0" }}>Confirmar senha *</label>
              <input name="confirmarSenha" type="password" required
                value={form.confirmarSenha} onChange={handleChange} placeholder="Repita a senha"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-yellow-400/30"
                style={{ background: "rgba(45,27,105,0.8)", border: "1px solid #4A3880", color: "#F4F1FB" }} />
            </div>

            {erro && <p className="text-xs text-center text-red-400">{erro}</p>}

            <button type="submit" disabled={carregando}
              className="w-full h-11 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "#F5C542", color: "#2D1B69" }}>
              {carregando ? <><Loader2 size={16} className="animate-spin" /> Criando conta...</> : "Criar minha conta"}
            </button>
          </form>

          <p className="text-center text-xs" style={{ color: "#C4B8F0" }}>
            Já tem conta?{" "}
            <Link href="/login" className="font-bold hover:underline" style={{ color: "#F5C542" }}>Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}