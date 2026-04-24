import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { titulo, ancora, turmaId, material, status } = await req.json();

  const novaSessao = await prisma.sessao.create({
    data: {
      titulo,
      ancora,
      turmaId,
      status: status ?? "rascunho",
      ...(material ? { material: { create: {
        titulo,
        tipo: "texto",
        conteudo: material,
        professorId: session.user.id,
      }}} : {}),
    },
  });

  return NextResponse.json(novaSessao);
}