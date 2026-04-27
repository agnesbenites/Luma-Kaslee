import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).role !== "ESCOLA") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  return NextResponse.json({
    online: true,
    uptime: "99.8%",
    latencia: 320,
    sessoesHoje: 0,
    riscosNaoResolvidos: 0,
    logs: [],
    manutencoes: [],
  });
}
