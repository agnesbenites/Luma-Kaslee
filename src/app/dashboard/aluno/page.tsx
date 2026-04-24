import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";
import CalendarioAluno from "@/components/aluno/CalendarioAlunoPage";

export default async function AlunoDashboard() {
  const session = await auth();
  const alunoId = (session?.user as any)?.id as string | undefined;

  if (!session || !alunoId) return null;

  const aluno = await prisma.aluno.findUnique({
    where: { id: alunoId },
    include: { turma: true },
  });

  if (!aluno) return null;

  const sessoes = await prisma.sessao.findMany({
    where: {
      turmaId: aluno.turmaId,
      status: "ABERTA",
    },
    orderBy: { criadoEm: "desc" },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f4ff] via-[#f3edff] to-[#fff7df] px-4 py-12">
      {/* Header */}
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <Sparkles className="text-[#F5A623]" size={22} />
          <span className="text-2xl font-bold text-[#2D1B69]">Luma</span>
        </div>

        <h1 className="mt-4 text-xl font-bold text-[#2D1B69]">
          Olá, {session.user?.name?.split(" ")[0]}! 👋
        </h1>

        <p className="mt-1 text-sm text-[#8B7EC8]">
          {aluno.turma.nome} · {sessoes.length} sessão
          {sessoes.length !== 1 ? "ões" : ""} ativa{sessoes.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Banner da Nova */}
        <Link href="/dashboard/aluno/nova">
          <div
            className="mb-8 flex cursor-pointer items-center gap-4 rounded-3xl border px-6 py-5 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
            style={{
              background: "linear-gradient(135deg, #0D0720 0%, #1A0D40 80%, #2D1B69 100%)",
              borderColor: "#3D2B7A",
            }}
          >
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl"
              style={{ background: "linear-gradient(135deg, #7C3AED, #C4B5FD)" }}
            >
              ✦
            </div>

            <div className="flex-1">
              <p className="font-bold text-white">Revisar com a Nova</p>
              <p className="mt-0.5 text-sm" style={{ color: "#C4B5FD" }}>
                Revisão espaçada · Retrieval practice · Feynman · Mix de temas
              </p>
            </div>

            <div
              className="rounded-2xl border px-4 py-2 text-sm font-semibold"
              style={{
                background: "rgba(196,181,253,0.12)",
                borderColor: "rgba(196,181,253,0.2)",
                color: "#C4B5FD",
              }}
            >
              Revisar agora →
            </div>
          </div>
        </Link>

        {/* Sessões ativas */}
        {sessoes.length === 0 ? (
          <div className="py-16 text-center text-[#8B7EC8]">
            <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
            <p>Nenhuma sessão ativa no momento.</p>
            <p className="mt-1 text-sm">Seu professor vai publicar em breve!</p>
          </div>
        ) : (
          <div className="mb-12 space-y-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#8B7EC8]">
              Sessões ativas
            </p>

            {sessoes.map((s) => (
              <Link key={s.id} href={`/dashboard/aluno/sessao/${s.id}`}>
                <div className="cursor-pointer rounded-2xl border border-purple-100 bg-white/85 p-6 shadow-sm backdrop-blur-xl transition-all hover:border-purple-300 hover:shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 inline-flex rounded-xl bg-purple-50 p-3 text-purple-500">
                      <BookOpen size={20} />
                    </div>

                    <div>
                      <p className="font-semibold text-[#2D1B69]">{s.titulo}</p>
                      <p className="mt-1 text-sm text-[#8B7EC8]">{s.ancora}</p>
                      <p className="mt-2 flex items-center gap-1 text-xs text-purple-400">
                        <Sparkles size={11} />
                        Sessão socrática com a Luma
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Calendário */}
        <CalendarioAluno />
      </div>
    </div>
  );
}