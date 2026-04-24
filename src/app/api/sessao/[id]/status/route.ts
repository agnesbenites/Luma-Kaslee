import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // 👈 await obrigatório no Next.js 15

    if (!id) {
      return NextResponse.json(
        { status: "nao_encontrada", titulo: "" },
        { status: 400 }
      );
    }

    const sessao = await prisma.sessao.findUnique({
      where: { id },
      select: { status: true, titulo: true },
    });

    if (!sessao) {
      return NextResponse.json(
        { status: "nao_encontrada", titulo: "" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: sessao.status,
      titulo: sessao.titulo ?? "",
    });
  } catch (error) {
    console.error("[status/route.ts]", error);
    return NextResponse.json(
      { status: "erro", titulo: "" },
      { status: 500 }
    );
  }
}