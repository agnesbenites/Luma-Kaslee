import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcryptjs";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).role !== "PROFESSOR_PRIVADO") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const professorId = (session.user as any).id;
  const professor = await prisma.professorPrivado.findUnique({
    where: { id: professorId },
    select: { id: true, nome: true, email: true, area: true, bio: true, plano: true, planoStatus: true },
  });
  return NextResponse.json(professor);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "PROFESSOR_PRIVADO") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const professorId = (session.user as any).id;
  const { nome, area, bio, senhaAtual, novaSenha } = await req.json();

  const professor = await prisma.professorPrivado.findUnique({ where: { id: professorId } });
  if (!professor) return NextResponse.json({ error: "Professor não encontrado." }, { status: 404 });

  const updateData: any = {};
  if (nome) updateData.nome = nome;
  if (area) updateData.area = area;
  if (bio !== undefined) updateData.bio = bio;

  if (novaSenha) {
    if (!senhaAtual) return NextResponse.json({ error: "Informe a senha atual." }, { status: 400 });
    const ok = await compare(senhaAtual, professor.senhaHash);
    if (!ok) return NextResponse.json({ error: "Senha atual incorreta." }, { status: 400 });
    if (novaSenha.length < 6) return NextResponse.json({ error: "Nova senha muito curta." }, { status: 400 });
    updateData.senhaHash = await hash(novaSenha, 10);
  }

  await prisma.professorPrivado.update({ where: { id: professorId }, data: updateData });
  return NextResponse.json({ ok: true });
}
