import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import NovaChatUI from "@/components/aluno/NovaChatUI";

export default async function NovaPage({
  searchParams,
}: {
  searchParams: { sessaoId?: string };
}) {
  const session = await auth();
  const alunoId = (session?.user as any)?.id as string | undefined;

  if (!session || !alunoId) redirect("/login");

  const aluno = await prisma.aluno.findUnique({
    where: { id: alunoId },
    include: { turma: true },
  });

  if (!aluno) redirect("/login");

  const interacoes = await prisma.interacao.findMany({
    where: { alunoId },
    orderBy: { criadoEm: "desc" },
    take: 5,
    include: {
      sessao: {
        select: { id: true, titulo: true, metodo: true },
      },
    },
  });

  const sessaoId = searchParams?.sessaoId || interacoes[0]?.sessaoId || undefined;

  return (
    <div
      className="min-h-screen px-4 py-8"
      style={{ background: "linear-gradient(135deg, #0D0720 0%, #1A0D40 60%, #2D1B69 100%)" }}
    >
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/aluno"
              className="flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium transition-all hover:bg-white/5"
              style={{ borderColor: "#3D2B7A", color: "#A78BFA" }}
            >
              ← Voltar
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-sm"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #C4B5FD)" }}
                >
                  ✦
                </div>
                <h1 className="text-2xl font-bold text-white">Nova</h1>
              </div>
              <p className="mt-0.5 text-sm" style={{ color: "#C4B5FD" }}>
                Olá, {session.user?.name?.split(" ")[0]}! Vamos revisar?
              </p>
            </div>
          </div>

          <div
            className="rounded-2xl border px-4 py-2 text-sm font-medium"
            style={{
              background: "rgba(196,181,253,0.08)",
              borderColor: "rgba(196,181,253,0.2)",
              color: "#C4B5FD",
            }}
          >
            {aluno.turma?.nome} · {aluno.turma?.serie}
          </div>
        </div>

        {/* Seletor de sessão */}
        {interacoes.length > 0 && (
          <div className="mb-6">
            <p
              className="mb-3 text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#6D4FA0" }}
            >
              Revisar com base em qual sessão?
            </p>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/dashboard/aluno/nova"
                className="rounded-2xl border px-4 py-2 text-sm font-medium transition-all hover:bg-white/5"
                style={{
                  background: !searchParams?.sessaoId ? "rgba(196,181,253,0.12)" : "transparent",
                  borderColor: !searchParams?.sessaoId ? "rgba(196,181,253,0.3)" : "#3D2B7A",
                  color: !searchParams?.sessaoId ? "#C4B5FD" : "#7C5CBF",
                }}
              >
                🔀 Todas as sessões
              </Link>

              {interacoes.map((i) => (
                <Link
                  key={i.sessaoId}
                  href={`/dashboard/aluno/nova?sessaoId=${i.sessaoId}`}
                  className="rounded-2xl border px-4 py-2 text-sm font-medium transition-all hover:bg-white/5"
                  style={{
                    background: searchParams?.sessaoId === i.sessaoId ? "rgba(196,181,253,0.12)" : "transparent",
                    borderColor: searchParams?.sessaoId === i.sessaoId ? "rgba(196,181,253,0.3)" : "#3D2B7A",
                    color: searchParams?.sessaoId === i.sessaoId ? "#C4B5FD" : "#7C5CBF",
                  }}
                >
                  {i.sessao.titulo}
                </Link>
              ))}
            </div>
          </div>
        )}

        <NovaChatUI sessaoId={sessaoId} />

        <p className="mt-6 text-center text-xs" style={{ color: "#3D2B7A" }}>
          Nova usa revisão espaçada, retrieval practice, interleaving e técnica de Feynman · Kaslee 2026
        </p>
      </div>
    </div>
  );
}