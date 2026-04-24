import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

    const { nome, cnpj, cidade, estado } = await req.json();
    if (!nome) return NextResponse.json({ error: "Nome obrigatório." }, { status: 400 });

    const escola = await prisma.escola.create({
      data: { nome, cnpj, cidade, estado },
    });

    return NextResponse.json(escola, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}

export async function GET() {
  const escolas = await prisma.escola.findMany({
    include: { turmas: true },
    orderBy: { criadoEm: "desc" },
  });
  return NextResponse.json(escolas);
}