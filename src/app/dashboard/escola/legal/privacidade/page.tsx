"use client";

import { ShieldCheck, Lock, UserCheck } from "lucide-react";

export default function PrivacidadePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4 border-b border-gray-200 pb-6">
        <div className="p-3 bg-green-600 rounded-xl text-white">
          <ShieldCheck size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Política de Privacidade e Proteção de Dados</h1>
          <p className="text-sm text-gray-500">Conformidade: LGPD (Art. 14) e Marco Civil da Internet</p>
        </div>
      </div>

      <section className="space-y-8">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm flex flex-col items-center text-center">
            <Lock className="text-[#2D1B69] mb-2" />
            <h3 className="font-bold text-sm">Dados Protegidos</h3>
            <p className="text-xs text-gray-500">Criptografia de ponta a ponta em todos os logs.</p>
          </div>
          <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm flex flex-col items-center text-center">
            <UserCheck className="text-[#2D1B69] mb-2" />
            <h3 className="font-bold text-sm">Melhor Interesse</h3>
            <p className="text-xs text-gray-500">Tratamento focado no desenvolvimento do menor.</p>
          </div>
          <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm flex flex-col items-center text-center">
            <ShieldCheck className="text-[#2D1B69] mb-2" />
            <h3 className="font-bold text-sm">Sem Ads</h3>
            <p className="text-xs text-gray-500">Zero comercialização de dados para terceiros.</p>
          </div>
        </div>

        <div className="prose prose-purple max-w-none text-gray-700 space-y-6">
          <h2 className="text-xl font-bold text-[#2D1B69]">1. Tratamento de Dados de Menores</h2>
          <p>
            O tratamento de dados de crianças e adolescentes pela plataforma Kaslee ocorre para a finalidade exclusiva de personalização do ensino e emissão de boletins pedagógicos, em estrita observância ao <strong>Artigo 14 da Lei 13.709/2018 (LGPD)</strong>.
          </p>

          <h2 className="text-xl font-bold text-[#2D1B69]">2. Vedação à Comercialização e Profiling Comercial</h2>
          <p>
            É terminantemente proibida a venda, cessão ou compartilhamento de dados dos usuários para fins de publicidade infantil, marketing ou criação de perfis comerciais. Os dados servem apenas para o aprimoramento pedagógico dentro do ecossistema da Escola.
          </p>

          <h2 className="text-xl font-bold text-[#2D1B69]">3. Segurança de Dados e Logs de IA</h2>
          <p>
            As interações com a IA Luma são monitoradas para garantir a segurança emocional do aluno. Estes logs são armazenados em ambiente seguro e são acessíveis apenas por pessoal autorizado da Escola e pela equipe técnica da Kaslee em caso de auditoria de segurança.
          </p>

          <h2 className="text-xl font-bold text-[#2D1B69]">4. Direitos dos Titulares (Pais e Responsáveis)</h2>
          <p>
            Os responsáveis legais podem, a qualquer momento, solicitar o acesso, a correção ou a exclusão definitiva dos dados de seus filhos, cientes de que a exclusão de certos dados pode limitar as funcionalidades de personalização da IA Luma.
          </p>
        </div>
      </section>
    </div>
  );
}