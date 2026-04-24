import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || (session.user as any).role !== "PROFESSOR") {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const professorId = (session.user as any).id as string;

    const {
      titulo,
      ancora,
      turmaId,
      material,
      status,
      metodo,
      metodoJustificativa,
    } = await req.json();

    if (!titulo || !ancora || !turmaId) {
      return NextResponse.json(
        { error: "titulo, ancora e turmaId são obrigatórios." },
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
        { error: "Turma não encontrada ou sem permissão." },
        { status: 403 }
      );
    }

    let materialId: string | null = null;

    if (material?.trim()) {
      const novoMaterial = await prisma.material.create({
        data: {
          titulo: `Material - ${titulo}`,
          tipo: "texto",
          conteudo: material.trim(),
          serie: turma.serie,
          professorId,
        },
      });

      materialId = novoMaterial.id;
    }

    const statusFinal =
      status === "ABERTA" || status === "RASCUNHO" ? status : "RASCUNHO";

    const metodoFinal =
      metodo && ["SOCRATICO", "SCAFFOLDING", "PBL", "REFLEXIVO", "DEBATE"].includes(metodo)
        ? metodo
        : "SOCRATICO";

    const sessao = await prisma.sessao.create({
      data: {
        titulo: titulo.trim(),
        ancora: ancora.trim(),
        turmaId,
        materialId,
        status: statusFinal,
        metodo: metodoFinal,
        metodoJustificativa: metodoJustificativa?.trim() || null,
      },
      include: {
        turma: true,
        material: true,
      },
    });

    return NextResponse.json(sessao, { status: 201 });
  } catch (error) {
    console.error("[POST /api/sessoes]", error);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const role = (session.user as any).role;
    const userId = (session.user as any).id as string;

    const { searchParams } = new URL(req.url);
    const turmaId = searchParams.get("turmaId");

    if (role === "PROFESSOR") {
      const sessoes = await prisma.sessao.findMany({
        where: {
          ...(turmaId ? { turmaId } : {}),
          turma: {
            professorId: userId,
          },
        },
        include: {
          material: true,
          turma: true,
          _count: { select: { respostas: true, interacoes: true } },
        },
        orderBy: { criadoEm: "desc" },
      });

      return NextResponse.json(sessoes);
    }

    if (role === "ALUNO") {
      const aluno = await prisma.aluno.findUnique({
        where: { id: userId },
      });

      if (!aluno) {
        return NextResponse.json({ error: "Aluno não encontrado." }, { status: 404 });
      }

      const sessoes = await prisma.sessao.findMany({
        where: {
          turmaId: aluno.turmaId,
          ...(turmaId ? { turmaId } : {}),
        },
        include: {
          material: true,
          turma: true,
          _count: { select: { respostas: true, interacoes: true } },
        },
        orderBy: { criadoEm: "desc" },
      });

      return NextResponse.json(sessoes);
    }

    return NextResponse.json({ error: "Perfil sem acesso." }, { status: 403 });
  } catch (error) {
    console.error("[GET /api/sessoes]", error);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}