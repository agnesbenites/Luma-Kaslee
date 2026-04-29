"use client";

import Link from "next/link";
import { CheckCircle, Circle, ArrowRight, Users, GraduationCap, UserPlus } from "lucide-react";

type Props = {
  temTurma: boolean;
  temProfessor: boolean;
  temAluno: boolean;
};

export default function OnboardingEscola({ temTurma, temProfessor, temAluno }: Props) {
  const passos = [
    {
      numero: 1,
      titulo: "Crie sua primeira turma",
      desc: "Organize seus alunos por série e turno.",
      feito: temTurma,
      href: "/dashboard/escola/turmas",
      icon: <Users size={18} />,
      acao: "Criar turma",
      disabled: false,
    },
    {
      numero: 2,
      titulo: "Convide um professor",
      desc: "Gere um link de convite e envie para o professor.",
      feito: temProfessor,
      href: "/dashboard/escola/professores",
      icon: <GraduationCap size={18} />,
      acao: "Convidar professor",
      disabled: !temTurma,
    },
    {
      numero: 3,
      titulo: "Cadastre o primeiro aluno",
      desc: "O aluno recebe as credenciais por e-mail automaticamente.",
      feito: temAluno,
      href: "/dashboard/escola/turmas",
      icon: <UserPlus size={18} />,
      acao: "Cadastrar aluno",
      disabled: !temTurma || !temProfessor,
    },
  ];

  const concluidos = passos.filter((p) => p.feito).length;

  return (
    <div className="bg-white rounded-[2rem] border-2 border-purple-100 p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-[#2D1B69] text-lg">Configure sua escola</h3>
          <p className="text-sm text-gray-400 mt-0.5">{concluidos} de 3 passos concluídos</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#2D1B69] rounded-full transition-all"
              style={{ width: `${(concluidos / 3) * 100}%` }} />
          </div>
          <span className="text-xs font-bold text-[#2D1B69]">{Math.round((concluidos / 3) * 100)}%</span>
        </div>
      </div>

      <div className="space-y-3">
        {passos.map((passo, i) => (
          <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
            passo.feito ? "bg-green-50 border-green-100"
            : passo.disabled ? "bg-gray-50 border-gray-100 opacity-50"
            : "bg-purple-50 border-purple-100"
          }`}>
            <div className={`shrink-0 ${passo.feito ? "text-green-500" : "text-[#2D1B69]"}`}>
              {passo.feito ? <CheckCircle size={22} /> : <Circle size={22} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400">PASSO {passo.numero}</span>
                {passo.feito && (
                  <span className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold">Concluído</span>
                )}
              </div>
              <p className={`font-bold text-sm mt-0.5 ${passo.feito ? "text-green-700" : "text-gray-800"}`}>{passo.titulo}</p>
              <p className="text-xs text-gray-400 mt-0.5">{passo.desc}</p>
            </div>
            {!passo.feito && !passo.disabled && (
              <Link href={passo.href}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#2D1B69] text-white rounded-xl text-xs font-bold hover:opacity-90 shrink-0">
                {passo.icon}{passo.acao}<ArrowRight size={12} />
              </Link>
            )}
          </div>
        ))}
      </div>

      <p className="text-[10px] text-gray-300 text-center">
        Este guia desaparece automaticamente quando os 3 passos forem concluídos.
      </p>
    </div>
  );
}
