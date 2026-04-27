"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, GraduationCap } from "lucide-react";

const AREAS = [
  { id: "TODAS", label: "Todas as áreas", desc: "Matemática, Português, Ciências, História..." },
  { id: "EXATAS", label: "Exatas", desc: "Matemática, Física, Química, Biologia" },
  { id: "HUMANAS", label: "Humanas", desc: "História, Geografia, Filosofia, Sociologia" },
  { id: "LINGUAS", label: "Línguas", desc: "Português, Inglês, Literatura, Redação" },
];

export default function CadastroProfessorPrivadoPage() {
  const router = useRouter();
  const [form, setForm] = useState({ nome: "", email: "", senha: "", confirmarSenha: "", area: "", bio: "" });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    if (form.senha !== form.confirmarSenha) { setErro("As senhas não coincidem."); return; }
    if (form.senha.length < 6) { setErro("A senha deve ter pelo menos 6 caracteres."); return; }
    if (!form.area) { setErro("Selecione sua área de atuação."); return; }
    setCarregando(true);
    try {
      const res = await fetch("/api/cadastro/professor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: form.nome, email: form.email, senha: form.senha, area: form.area, bio: form.bio }),
      });
      const data = await res.json();
      if (!res.ok) { setErro(data.error || "Erro ao criar conta."); return; }
      router.push("/planos?novo=professor");
    } catch {
      setErro("Erro inesperado. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(135deg, #1a0f3d 0%, #2D1B69 60%, #3d1f5c 100%)" }}>
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold" style={{ color: "#F5C542" }}>✦ Luma</h1>
          <p className="mt-2 text-sm" style={{ color: "#C4B8F0" }}>Cadastro de Professor — Reforço & Cursos Livres</p>
        </div>

        <div className="rounded-2xl p-8 space-y-5"
          style={{ background: "rgba(61,43,121,0.6)", border: "1px solid #4A3880", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl" style={{ background: "rgba(245,197,66,0.15)" }}>
              <GraduationCap size={20} style={{ color: "#F5C542" }} />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg">Criar conta de professor</h2>
              <p className="text-xs" style={{ color: "#C4B8F0" }}>30 dias grátis · sem cartão de crédito</p>
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

            {/* Área de atuação */}
            <div>
              <label className="text-xs font-semibold block mb-2" style={{ color: "#C4B8F0" }}>Área de atuação *</label>
              <div className="grid grid-cols-2 gap-2">
                {AREAS.map((area) => (
                  <button key={area.id} type="button" onClick={() => setForm((f) => ({ ...f, area: area.id }))}
                    className="p-3 rounded-xl text-left transition-all"
                    style={{
                      background: form.area === area.id ? "rgba(245,197,66,0.2)" : "rgba(45,27,105,0.5)",
                      border: form.area === area.id ? "1px solid #F5C542" : "1px solid #4A3880",
                    }}>
                    <p className="text-xs font-bold" style={{ color: form.area === area.id ? "#F5C542" : "#C4B8F0" }}>{area.label}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "rgba(196,184,240,0.6)" }}>{area.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: "#C4B8F0" }}>Bio (opcional)</label>
              <textarea name="bio" value={form.bio} onChange={handleChange}
                placeholder="Conte um pouco sobre sua experiência..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-yellow-400/30 resize-none"
                style={{ background: "rgba(45,27,105,0.8)", border: "1px solid #4A3880", color: "#F4F1FB" }} />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: "#C4B8F0" }}>Senha *</label>
              <div className="relative">
                <input name="senha" type={mostrarSenha ? "text" : "password"} required value={form.senha} onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
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
              <input name="confirmarSenha" type="password" required value={form.confirmarSenha} onChange={handleChange}
                placeholder="Repita a senha"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-yellow-400/30"
                style={{ background: "rgba(45,27,105,0.8)", border: "1px solid #4A3880", color: "#F4F1FB" }} />
            </div>

            {erro && <p className="text-xs text-center text-red-400">{erro}</p>}

            <button type="submit" disabled={carregando}
              className="w-full h-11 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "#F5C542", color: "#2D1B69" }}>
              {carregando ? <><Loader2 size={16} className="animate-spin" /> Criando conta...</> : "Criar conta grátis →"}
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
