import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session || (session.user as any).role !== "PROFESSOR") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const professorId = (session.user as any).id;

  const material = await prisma.material.findUnique({
    where: { id: params.id },
  });

  if (!material || material.professorId !== professorId) {
    return NextResponse.json({ error: "Material não encontrado" }, { status: 404 });
  }

  // Remove do Supabase Storage
  if (material.filePath) {
    await supabaseAdmin.storage
      .from("luma-materiais")
      .remove([material.filePath]);
  }

  // Remove do banco
  await prisma.material.delete({ where: { id: params.id } });

  return NextResponse.json({ ok: true });
}