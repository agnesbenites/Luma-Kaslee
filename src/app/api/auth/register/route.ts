import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { nome, email, senha, role, turmaId, alunoId } = await req.json();

    if (!nome || !email || !senha || !role) {
      return NextResponse.json({ error: "Campos obrigatórios faltando." }, { status: 400 });
    }

    const senhaHash = await bcrypt.hash(senha, 12);

    if (role === "PROFESSOR") {
      const existe = await prisma.professor.findUnique({ where: { email } });
      if (existe) return NextResponse.json({ error: "Email já cadastrado." }, { status: 409 });

      const professor = await prisma.professor.create({
        data: { nome, email, senhaHash },
      });
      return NextResponse.json({ id: professor.id, role: "PROFESSOR" }, { status: 201 });
    }

    if (role === "ALUNO") {
      if (!turmaId) return NextResponse.json({ error: "turmaId obrigatório para aluno." }, { status: 400 });

      const existe = await prisma.aluno.findUnique({ where: { email } });
      if (existe) return NextResponse.json({ error: "Email já cadastrado." }, { status: 409 });

      const aluno = await prisma.aluno.create({
        data: { nome, email, senhaHash, turmaId },
      });
      return NextResponse.json({ id: aluno.id, role: "ALUNO" }, { status: 201 });
    }

    if (role === "FAMILIA") {
      if (!alunoId || !turmaId) return NextResponse.json({ error: "alunoId e turmaId obrigatórios para família." }, { status: 400 });

      const existe = await prisma.familia.findUnique({ where: { email } });
      if (existe) return NextResponse.json({ error: "Email já cadastrado." }, { status: 409 });

      const familia = await prisma.familia.create({
        data: { nome, email, senhaHash, alunoId, turmaId },
      });
      return NextResponse.json({ id: familia.id, role: "FAMILIA" }, { status: 201 });
    }

    return NextResponse.json({ error: "Role inválido." }, { status: 400 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}