import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "PROFESSOR") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await req.json();

    const statusValidos = ["ABERTA", "ENCERRADA", "RASCUNHO"];
    if (!statusValidos.includes(status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    }

    const dados: any = { status };

    // Registra timestamp de encerramento
    if (status === "ENCERRADA") {
      dados.encerradaEm = new Date();
    }

    const sessao = await prisma.sessao.update({
      where: { id },
      data: dados,
      select: { id: true, status: true, titulo: true },
    });

    return NextResponse.json(sessao);
  } catch (error) {
    console.error("[professor/sessao/status]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}