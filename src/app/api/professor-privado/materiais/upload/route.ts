import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

const TIPOS_PERMITIDOS: Record<string, string> = {
  "application/pdf": "PDF",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PPTX",
  "image/jpeg": "IMAGEM",
  "image/png": "IMAGEM",
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "PROFESSOR_PRIVADO") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const professorId = (session.user as any).id;
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const titulo = formData.get("titulo") as string;
  const componente = formData.get("componente") as string | null;

  if (!file || !titulo) return NextResponse.json({ error: "Arquivo e título obrigatórios." }, { status: 400 });

  const tipo = TIPOS_PERMITIDOS[file.type];
  if (!tipo) return NextResponse.json({ error: "Tipo não suportado." }, { status: 400 });
  if (file.size > 50 * 1024 * 1024) return NextResponse.json({ error: "Arquivo maior que 50MB." }, { status: 400 });

  const ext = file.name.split(".").pop();
  const filePath = `privado/${professorId}/${Date.now()}.${ext}`;
  const bytes = await file.arrayBuffer();

  const { error: uploadError } = await supabaseAdmin.storage
    .from("luma-materiais").upload(filePath, bytes, { contentType: file.type });
  if (uploadError) return NextResponse.json({ error: "Erro no upload." }, { status: 500 });

  const { data: urlData } = supabaseAdmin.storage.from("luma-materiais").getPublicUrl(filePath);

  const material = await prisma.materialPrivado.create({
    data: { titulo, tipo, fileUrl: urlData.publicUrl, filePath, fileMime: file.type, fileTamanho: file.size, componente: componente || null, professorId },
  });

  return NextResponse.json(material, { status: 201 });
}
