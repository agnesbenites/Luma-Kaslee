import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

 export async function GET(
   req: NextRequest,
   { params }: { params: Promise<{ token: string }> }
 ) {
   const { token } = await params;

   const convite = await prisma.convite.findUnique({
     where: { token },
     include: { escola: { select: { nome: true } } },
   });

   if (!convite || convite.usado || convite.expiraEm < new Date()) {
     return NextResponse.json({ error: "Convite inválido ou expirado." }, { status: 404 });
   }

   return NextResponse.json({
     tipo: convite.tipo,
     escolaNome: convite.escola.nome,
     email: convite.email,
   });
}