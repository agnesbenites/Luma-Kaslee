import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookOpen, Users, Layout, TrendingUp, Clock, Sparkles, CalendarDays } from "lucide-react";
import Link from "next/link";

const DIAS = ["", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export default async function ProfessorPage() {
  const session = await auth();
  const professorId = session!.user.id as string;

  const [turmas, sessoes, alunos, proximaAula] = await Promise.all([
    prisma.turma.count({ where: { professorId } }),
    prisma.sessao.count({ where: { turma: { professorId } } }),
    prisma.aluno.count({ where: { turma: { professorId } } }),
    prisma.gradeHoraria.findFirst({
      where: {
        turma: { professorId },
        diaSemana: {
          gte: new Date().getDay() === 0 ? 7 : new Date().getDay(),
        },
      },
      orderBy: [{ diaSemana: "asc" }, { horaInicio: "asc" }],
      include: {
        turma: { select: { nome: true, serie: true } },
        sessao: { select: { id: true, titulo: true, ancora: true, status: true } },
      },
    }),
  ]);

  const cards = [
    { label: "Turmas ativas", value: turmas, icon: BookOpen },
    { label: "Alunos", value: alunos, icon: Users },
    { label: "Sessões criadas", value: sessoes, icon: Layout },
    { label: "Relatórios", value: "Em breve", icon: TrendingUp },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Saudação */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Olá, {session!.user.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-gray-400">Aqui está o resumo da sua semana.</p>
      </div>

      {/* Próxima aula */}
      {proximaAula ? (
        <div className="rounded-2xl bg-gradient-to-r from-[#2D1B69] to-[#7C67F0] p-6 text-white shadow-md">
          <p className="text-xs uppercase tracking-widest text-white/60 mb-3">Próxima aula</p>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex flex-col gap-1">
              <p className="text-xl font-bold">{proximaAula.componente}</p>
              <p className="text-sm text-white/70">
                {proximaAula.turma.nome} · {proximaAula.turma.serie}
              </p>
              {proximaAula.sessao ? (
                <>
                  <p className="text-sm text-white/90 mt-1 font-medium">
                    📎 {proximaAula.sessao.titulo}
                  </p>
                  <p className="text-xs text-white/60 italic">
                    "{proximaAula.sessao.ancora}"
                  </p>
                </>
              ) : (
                <Link
                  href="/dashboard/professor/grade"
                  className="mt-2 inline-flex items-center gap-1.5 text-xs bg-white/20 hover:bg-white/30 transition-colors px-3 py-1.5 rounded-lg w-fit"
                >
                  <Sparkles size={12} />
                  Vincular sessão a esta aula
                </Link>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-lg font-semibold">{DIAS[proximaAula.diaSemana]}</p>
              <p className="text-sm text-white/70 flex items-center gap-1 justify-end mt-0.5">
                <Clock size={13} />
                {proximaAula.horaInicio} – {proximaAula.horaFim}
              </p>
              {proximaAula.sessao && (
                <Link
                  href={`/dashboard/professor/sessao/${proximaAula.sessao.id}`}
                  className="mt-3 inline-block text-xs bg-white/20 hover:bg-white/30 transition-colors px-3 py-1.5 rounded-lg"
                >
                  Abrir sessão →
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-purple-200 bg-purple-50/50 p-6 text-center">
          <CalendarDays className="mx-auto text-purple-300 mb-2" size={28} />
          <p className="text-sm text-purple-400 font-medium">Nenhuma aula na grade desta semana</p>
          <Link
            href="/dashboard/professor/grade"
            className="mt-3 inline-block text-xs bg-[#2D1B69] text-white px-4 py-2 rounded-lg hover:bg-[#3d2a8a] transition-colors"
          >
            Configurar grade →
          </Link>
        </div>
      )}

      {/* Cards resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50">
            <div className="inline-flex p-3 rounded-xl bg-purple-50 text-purple-500 mb-4">
              <Icon size={22} />
            </div>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}