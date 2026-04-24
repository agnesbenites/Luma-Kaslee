import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CalendarioAlunoPage from "@/components/aluno/CalendarioAlunoPage";

export default async function PaginaCalendario() {
  const session = await auth();
  const alunoId = (session?.user as any)?.id as string | undefined;

  if (!session || !alunoId) redirect("/login");

  const aluno = await prisma.aluno.findUnique({
    where: { id: alunoId },
    include: { turma: true },
  });

  if (!aluno) redirect("/login");

  const [atividades, grade] = await Promise.all([
    prisma.atividadeAgendada.findMany({
      where: { turmaId: aluno.turmaId },
      orderBy: { data: "asc" },
      include: {
        sessao: { select: { id: true, titulo: true, ancora: true, status: true } },
      },
    }),
    prisma.gradeHoraria.findMany({
      where: { turmaId: aluno.turmaId },
      orderBy: [{ diaSemana: "asc" }, { horaInicio: "asc" }],
      include: {
        sessao: { select: { id: true, titulo: true, ancora: true, status: true } },
      },
    }),
  ]);

  return (
    <CalendarioAlunoPage
      aluno={{ nome: aluno.nome, turma: aluno.turma.nome, serie: aluno.turma.serie }}
      atividades={atividades.map((a) => ({
        id: a.id,
        titulo: a.titulo,
        descricao: a.descricao ?? null,
        data: a.data.toISOString(),
        status: a.status,
        sessao: a.sessao ?? null,
      }))}
      grade={grade.map((g) => ({
        id: g.id,
        diaSemana: g.diaSemana,
        horaInicio: g.horaInicio,
        horaFim: g.horaFim,
        componente: g.componente,
        sessao: g.sessao ?? null,
      }))}
    />
  );
}