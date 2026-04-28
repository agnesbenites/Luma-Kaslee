import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { verificarTempoNova } from "@/lib/nova-timer";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const alunoId = (session.user as any).id;
  const { minutosUsados, minutosRestantes, permitido } = await verificarTempoNova(alunoId);

  return NextResponse.json({ minutosUsados, minutosRestantes, permitido, limiteDiario: 60 });
}
