import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { hash } from "bcryptjs";
import { enviarCredenciaisAlunoPrivado } from "@/lib/email";

function gerarSenhaAleatoria(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let senha = "";
  for (let i = 0; i < 8; i++) {
    senha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return senha;
}

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).role !== "PROFESSOR_PRIVADO") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const professorId = (session.user as any).id;
  const alunos = await prisma.alunoPrivado.findMany({
    where: { professorId },
    orderBy: { nome: "asc" },
  });
  return NextResponse.json(alunos);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "PROFESSOR_PRIVADO") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const professorId = (session.user as any).id;
  const { nome, email } = await req.json();

  if (!nome || !email) {
    return NextResponse.json({ error: "Nome e e-mail são obrigatórios." }, { status: 400 });
  }

  const professor = await prisma.professorPrivado.findUnique({ where: { id: professorId } });
  if (!professor) return NextResponse.json({ error: "Professor não encontrado." }, { status: 404 });

  // Verifica limite do plano
  const totalAlunos = await prisma.alunoPrivado.count({ where: { professorId } });
  const limites: Record<string, number> = { STARTER: 35, PRO: 80, ILIMITADO: 999999 };
  const limite = limites[professor.plano] ?? 35;

  if (totalAlunos >= limite && professor.plano === "ILIMITADO" === false) {
    return NextResponse.json({
      error: `Limite do plano ${professor.plano} atingido (${limite} alunos). Faça upgrade para adicionar mais.`,
      limitAtingido: true,
    }, { status: 402 });
  }

  const existe = await prisma.alunoPrivado.findUnique({ where: { email } });
  if (existe) return NextResponse.json({ error: "Este e-mail já está cadastrado." }, { status: 409 });

  const senhaTemp = gerarSenhaAleatoria();
  const senhaHash = await hash(senhaTemp, 10);

  const aluno = await prisma.alunoPrivado.create({
    data: { nome, email, senhaHash, professorId },
  });

  try {
    await enviarCredenciaisAlunoPrivado({
      nome,
      email,
      senha: senhaTemp,
      nomeProfessor: professor.nome,
    });
  } catch (err) {
    console.error("Erro ao enviar e-mail:", err);
  }

  return NextResponse.json({ id: aluno.id, nome: aluno.nome, senhaTemp }, { status: 201 });
}
