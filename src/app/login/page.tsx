"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, LogIn } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState("ESCOLA"); // Começa como escola para facilitar seu teste
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro("");

    console.log("🔐 Tentando login como:", role, email);

    try {
      const result = await signIn("credentials", {
        email,
        senha,
        redirect: false,
      });

      if (result?.error) {
        setErro("Email ou senha incorretos.");
        setCarregando(false);
        return;
      }

      // LOGIN SUCESSO: Forçamos o redirecionamento manual
      if (role === "ESCOLA") {
        window.location.href = "/dashboard/escola/visao-geral";
      } else {
        window.location.href = "/dashboard/professor/agenda";
      }
    } catch (error) {
      setErro("Ocorreu um erro inesperado.");
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #1a0f3d 0%, #2D1B69 60%, #3d1f5c 100%)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold" style={{ color: "#F5C542" }}>✦ Luma</h1>
          <p className="mt-2 text-sm" style={{ color: "#C4B8F0" }}>A Luma não tem opinião. Ela te ajuda a ter a sua.</p>
        </div>

        <div className="rounded-2xl p-8" style={{ background: "rgba(61, 43, 121, 0.6)", border: "1px solid #4A3880", backdropFilter: "blur(12px)" }}>
          <div className="flex rounded-xl overflow-hidden mb-6" style={{ border: "1px solid #4A3880" }}>
            {["ESCOLA", "PROFESSOR", "ALUNO", "FAMILIA"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className="flex-1 py-2 text-[10px] font-medium transition-all"
                style={{
                  background: role === r ? "#F5C542" : "transparent",
                  color: role === r ? "#2D1B69" : "#C4B8F0",
                }}
              >
                {r.charAt(0) + r.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ background: "rgba(45, 27, 105, 0.8)", border: "1px solid #4A3880", color: "#F4F1FB" }}
            />
            <div className="relative">
              <Input
                type={mostrarSenha ? "text" : "password"}
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                style={{ background: "rgba(45, 27, 105, 0.8)", border: "1px solid #4A3880", color: "#F4F1FB" }}
              />
              <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#C4B8F0" }}>
                {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {erro && <p className="text-xs text-center text-red-400">{erro}</p>}

            <Button type="submit" disabled={carregando} className="w-full h-11" style={{ background: "#F5C542", color: "#2D1B69" }}>
              {carregando ? "Entrando..." : `Entrar como ${role.toLowerCase()}`}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}