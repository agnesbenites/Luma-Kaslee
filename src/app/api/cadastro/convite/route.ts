  import { NextRequest, NextResponse } from "next/server";
  import { prisma } from "@/lib/prisma";
  import { hash } from "bcryptjs";
 
  export async function POST(req: NextRequest) {
    try {
      const { token, nome, email, senha } = await req.json();
 
      const convite = await prisma.convite.findUnique({
        where: { token },
        include: { escola: true },
      });
 
      if (!convite || convite.usado || convite.expiraEm < new Date()) {
        return NextResponse.json({ error: "Convite inválido ou expirado." }, { status: 400 });
      }
 
      const senhaHash = await hash(senha, 10);
 
      if (convite.tipo === "PROFESSOR") {
        const existe = await prisma.professor.findUnique({ where: { email } });
        if (existe) return NextResponse.json({ error: "E-mail já cadastrado." }, { status: 409 });
 
        await prisma.professor.create({
          data: { nome, email, senhaHash },
        });
      }
 
        // Marcar convite como usado
      await prisma.convite.update({ where: { token }, data: { usado: true } });
 
      return NextResponse.json({ ok: true }, { status: 201 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Erro interno." }, { status: 500 });
    }
 }