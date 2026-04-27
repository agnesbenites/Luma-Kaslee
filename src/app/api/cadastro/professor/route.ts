import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { nome, email, senha, area, bio } = await req.json();
    if (!nome || !email || !senha) {
      return NextResponse.json({ error: "Nome, email e senha são obrigatórios." }, { status: 400 });
    }
    const existe = await prisma.professorPrivado.findUnique({ where: { email } });
    if (existe) return NextResponse.json({ error: "Este e-mail já está cadastrado." }, { status: 409 });

    const senhaHash = await hash(senha, 10);
    const trialExpiraEm = new Date();
    trialExpiraEm.setDate(trialExpiraEm.getDate() + 30);

    const professor = await prisma.professorPrivado.create({
      data: { nome, email, senhaHash, area: area || null, bio: bio || null, planoStatus: "TRIAL", trialExpiraEm },
    });

    return NextResponse.json({ id: professor.id, nome: professor.nome }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
