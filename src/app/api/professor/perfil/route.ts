import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { compare, hash } from "bcryptjs";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).role !== "PROFESSOR") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const professorId = (session.user as any).id;

  const professor = await prisma.professor.findUnique({
    where: { id: professorId },
    include: {
      turmas: { select: { id: true, nome: true, serie: true } },
    },
  });

  if (!professor) {
    return NextResponse.json({ error: "Professor não encontrado" }, { status: 404 });
  }

  // Busca a grade horária do professor via turmas
  const grade = await prisma.gradeHoraria.findMany({
    where: { turma: { professorId } },
    include: { turma: { select: { nome: true, serie: true } } },
  });

  // Extrai matérias e anos únicos da grade
  const materias = [...new Set(grade.map((g) => g.componente).filter(Boolean))];
  const anos = [...new Set(grade.map((g) => g.turma.serie).filter(Boolean))];

  return NextResponse.json({
    id: professor.id,
    nome: professor.nome,
    email: professor.email,
    materias,
    anos,
    grade: grade.map((g) => ({
      id: g.id,
      diaSemana: g.diaSemana,
      horaInicio: g.horaInicio,
      horaFim: g.horaFim,
      componente: g.componente,
      serie: g.turma.serie,
    })),
  });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "PROFESSOR") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const professorId = (session.user as any).id;
  const { nome, senhaAtual, novaSenha, grade } = await req.json();

  const professor = await prisma.professor.findUnique({ where: { id: professorId } });
  if (!professor) return NextResponse.json({ error: "Professor não encontrado" }, { status: 404 });

  // Atualiza dados básicos
  const updateData: any = {};
  if (nome) updateData.nome = nome;

  // Atualiza senha se fornecida
  if (novaSenha) {
    if (!senhaAtual) {
      return NextResponse.json({ error: "Informe a senha atual para alterá-la." }, { status: 400 });
    }
    const senhaOk = await compare(senhaAtual, professor.senhaHash);
    if (!senhaOk) {
      return NextResponse.json({ error: "Senha atual incorreta." }, { status: 400 });
    }
    if (novaSenha.length < 6) {
      return NextResponse.json({ error: "A nova senha deve ter pelo menos 6 caracteres." }, { status: 400 });
    }
    updateData.senhaHash = await hash(novaSenha, 10);
  }

  await prisma.professor.update({ where: { id: professorId }, data: updateData });

  // Atualiza grade horária se fornecida
  if (grade && Array.isArray(grade)) {
    // Busca a primeira turma do professor para vincular a grade
    const turma = await prisma.turma.findFirst({ where: { professorId } });

    if (turma) {
      // Remove grade antiga e recria
      await prisma.gradeHoraria.deleteMany({ where: { turma: { professorId } } });

      if (grade.length > 0) {
        await prisma.gradeHoraria.createMany({
          data: grade.map((g: any) => ({
            turmaId: turma.id,
            diaSemana: Number(g.diaSemana),
            horaInicio: g.horaInicio,
            horaFim: g.horaFim,
            componente: g.componente,
            fixo: true,
          })),
        });
      }
    }
  }

  return NextResponse.json({ ok: true });
}