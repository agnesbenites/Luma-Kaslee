"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";

export default function LoginPais() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // No seu MVP, você pode simular o login ou usar o NextAuth
    // Redirecionamos para o consentimento antes do dashboard
    router.push("/dashboard/pais/consentimento");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Lado Esquerdo: Branding e Impacto */}
      <div className="hidden lg:flex bg-[#2D1B69] p-16 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-[#F5C542] italic tracking-tighter mb-4">
            ✦ Kaslee
          </h1>
          <h2 className="text-5xl font-extrabold text-white leading-tight">
            O futuro do seu filho <br /> começa com <span className="text-purple-300">foco.</span>
          </h2>
        </div>

        <div className="relative z-10 bg-white/10 backdrop-blur-lg p-8 rounded-[2.5rem] border border-white/20">
          <p className="text-purple-100 text-lg italic leading-relaxed">
            "Acompanhe o desenvolvimento cognitivo, a frequência e o desempenho acadêmico em tempo real, com a segurança que sua família merece."
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center">
              <Heart size={20} className="text-white fill-current" />
            </div>
            <span className="text-white font-bold">Portal da Família</span>
          </div>
        </div>
      </div>

      {/* Lado Direito: Formulário de Login */}
      <div className="flex items-center justify-center p-8 md:p-16 bg-[#FDFCFE]">
        <div className="w-full max-w-md space-y-10">
          <div>
            <h3 className="text-3xl font-black text-[#2D1B69] mb-2">Bem-vindo(a)</h3>
            <p className="text-gray-500 font-medium">Acesse o acompanhamento escolar do seu filho.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">E-mail do Responsável</label>
              <div className="relative">
                <input 
                  type="email" 
                  required
                  placeholder="exemplo@email.com"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-purple-100 focus:border-[#2D1B69] transition-all outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="absolute left-4 top-4 text-gray-300" size={20} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Senha</label>
              <div className="relative">
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-purple-100 focus:border-[#2D1B69] transition-all outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="absolute left-4 top-4 text-gray-300" size={20} />
              </div>
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-xs font-bold text-purple-600 hover:underline">Esqueceu a senha?</button>
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-[#2D1B69] text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-purple-900/20"
            >
              Entrar no Portal <ArrowRight size={20} />
            </button>
          </form>

          <div className="pt-10 border-t border-gray-100 flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-tighter">
              <ShieldCheck size={14} /> Ambiente Seguro & Criptografado
            </div>
            <p className="text-[11px] text-gray-400 max-w-[280px]">
              O acesso aos dados do menor é restrito aos responsáveis legais, em conformidade com o Art. 14 da LGPD.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}