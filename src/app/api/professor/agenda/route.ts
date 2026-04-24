import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const professorId = (session.user as any).id as string;

    const agenda = await prisma.atividadeAgendada.findMany({
      where: { professorId },
      include: {
        turma: true,
        sessao: true,
      },
      orderBy: {
        data: "asc",
      },
    });

    return NextResponse.json({ agenda });
  } catch (error) {
    console.error("[GET /api/professor/agenda]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const professorId = (session.user as any).id as string;
    const body = await req.json();

    const { titulo, descricao, data, turmaId, sessaoId } = body;

    if (!titulo || !data || !turmaId) {
      return NextResponse.json(
        { error: "titulo, data e turmaId são obrigatórios" },
        { status: 400 }
      );
    }

    const turma = await prisma.turma.findFirst({
      where: {
        id: turmaId,
        professorId,
      },
    });

    if (!turma) {
      return NextResponse.json(
        { error: "Turma não encontrada ou sem permissão" },
        { status: 404 }
      );
    }

    if (sessaoId) {
      const sessao = await prisma.sessao.findFirst({
        where: {
          id: sessaoId,
          turmaId,
        },
      });

      if (!sessao) {
        return NextResponse.json(
          { error: "Sessão não encontrada para essa turma" },
          { status: 404 }
        );
      }
    }

    const atividade = await prisma.atividadeAgendada.create({
      data: {
        titulo,
        descricao: descricao || null,
        data: new Date(data),
        turmaId,
        professorId,
        sessaoId: sessaoId || null,
        status: "PLANEJADA",
      },
      include: {
        turma: true,
        sessao: true,
      },
    });

    return NextResponse.json({ atividade }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/professor/agenda]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}