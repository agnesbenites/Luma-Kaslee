import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { nome, email, senha, cnpj, cidade, estado } = await req.json();

    if (!nome || !email || !senha) {
      return NextResponse.json({ error: "Nome, email e senha são obrigatórios." }, { status: 400 });
    }

    const existe = await prisma.escola.findUnique({ where: { email } });
    if (existe) {
      return NextResponse.json({ error: "Este e-mail já está cadastrado." }, { status: 409 });
    }

    const senhaHash = await hash(senha, 10);
    const escola = await prisma.escola.create({
      data: { nome, email, senhaHash, cnpj: cnpj || null, cidade: cidade || null, estado: estado || null },
    });

    return NextResponse.json({ id: escola.id, nome: escola.nome }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
