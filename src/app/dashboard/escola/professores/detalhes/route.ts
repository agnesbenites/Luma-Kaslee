import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).role !== "ESCOLA") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const escolaId = (session.user as any).id;

  const professores = await prisma.professor.findMany({
    where: { turmas: { some: { escolaId } } },
    include: {
      turmas: {
        where: { escolaId },
        include: {
          gradeHoraria: true,
        },
      },
    },
    orderBy: { nome: "asc" },
  });

  const resultado = professores.map((prof) => {
    const grade = prof.turmas.flatMap((t) =>
      t.gradeHoraria.map((g) => ({
        diaSemana: g.diaSemana,
        horaInicio: g.horaInicio,
        horaFim: g.horaFim,
        componente: g.componente,
        serie: t.serie,
      }))
    );

    const materias = [...new Set(grade.map((g) => g.componente).filter(Boolean))];
    const anos = [...new Set(prof.turmas.map((t) => t.serie).filter(Boolean))];

    return {
      id: prof.id,
      nome: prof.nome,
      email: prof.email,
      materias,
      anos,
      grade,
      criadoEm: prof.criadoEm,
    };
  });

  return NextResponse.json(resultado);
}