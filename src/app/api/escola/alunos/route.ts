import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { hash } from "bcryptjs";
import { enviarCredenciaisAluno } from "@/lib/email";

function gerarSenhaAleatoria(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let senha = "";
  for (let i = 0; i < 8; i++) {
    senha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return senha;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ESCOLA") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const escolaId = (session.user as any).id;
  const { nome, email, turmaId } = await req.json();

  if (!nome || !email || !turmaId) {
    return NextResponse.json({ error: "Nome, e-mail e turma são obrigatórios." }, { status: 400 });
  }

  const turma = await prisma.turma.findFirst({ where: { id: turmaId, escolaId } });
  if (!turma) return NextResponse.json({ error: "Turma não encontrada." }, { status: 404 });

  const existe = await prisma.aluno.findUnique({ where: { email } });
  if (existe) return NextResponse.json({ error: "Este e-mail já está cadastrado." }, { status: 409 });

  const senhaTemp = gerarSenhaAleatoria();
  const senhaHash = await hash(senhaTemp, 10);

  const aluno = await prisma.aluno.create({
    data: { nome, email, senhaHash, turmaId },
  });

  const escola = await prisma.escola.findUnique({ where: { id: escolaId } });

  try {
    await enviarCredenciaisAluno({
      nome,
      email,
      senha: senhaTemp,
      nomeEscola: escola?.nome ?? "sua escola",
    });
  } catch (err) {
    console.error("Erro ao enviar e-mail:", err);
  }

  return NextResponse.json({ id: aluno.id, nome: aluno.nome, senhaTemp }, { status: 201 });
}
