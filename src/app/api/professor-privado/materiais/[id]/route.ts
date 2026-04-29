import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || (session.user as any).role !== "PROFESSOR_PRIVADO") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const professorId = (session.user as any).id;
  const { id } = await params;

  const material = await prisma.materialPrivado.findFirst({ where: { id, professorId } });
  if (!material) return NextResponse.json({ error: "Material não encontrado." }, { status: 404 });

  if (material.filePath) {
    await supabaseAdmin.storage.from("luma-materiais").remove([material.filePath]);
  }
  await prisma.materialPrivado.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
