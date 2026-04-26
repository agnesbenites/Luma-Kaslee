import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { hash } from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

    const { nome, email, senha, cnpj, cidade, estado } = await req.json();
    if (!nome || !email || !senha) {
      return NextResponse.json({ error: "Nome, email e senha são obrigatórios." }, { status: 400 });
    }

    const senhaHash = await hash(senha, 10);
    const escola = await prisma.escola.create({
      data: { nome, email, senhaHash, cnpj, cidade, estado },
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
