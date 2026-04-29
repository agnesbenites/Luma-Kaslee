import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import GerarConvitePrivado from "@/components/professor-privado/GerarConvitePrivado";

export default async function VisaoGeralProfPrivado() {
  const session = await auth();
  if (!session || (session.user as any).role !== "PROFESSOR_PRIVADO") redirect("/login");

  const professorId = (session.user as any).id;
  const professor = await prisma.professorPrivado.findUnique({
    where: { id: professorId },
    include: { _count: { select: { alunos: true, materiais: true } } },
  });

  if (!professor) redirect("/login");

  const limites: Record<string, number> = { STARTER: 35, PRO: 80, ILIMITADO: 999999 };
  const limite = limites[professor.plano] ?? 35;
  const totalAlunos = professor._count.alunos;
  const trialExpirado = professor.trialExpiraEm && professor.trialExpiraEm < new Date();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#2D1B69]">Olá, {professor.nome.split(" ")[0]}!</h2>
        <p className="text-sm text-gray-500">Bem-vindo ao seu painel de professor particular.</p>
      </div>

      {/* Alerta de trial */}
      {professor.planoStatus === "TRIAL" && professor.trialExpiraEm && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-4 flex items-center justify-between">
          <div>
            <p className="font-bold text-yellow-700 text-sm">
              Trial gratuito — expira em {new Date(professor.trialExpiraEm).toLocaleDateString("pt-BR")}
            </p>
            <p className="text-xs text-yellow-600 mt-0.5">Escolha um plano para continuar após o período gratuito.</p>
          </div>
          <a href="/planos" className="px-4 py-2 bg-yellow-500 text-white rounded-xl text-sm font-bold hover:opacity-90">
            Ver planos →
          </a>
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Alunos ativos", valor: totalAlunos, sub: `de ${limite === 999999 ? "∞" : limite}` },
          { label: "Materiais", valor: professor._count.materiais, sub: "enviados" },
          { label: "Plano", valor: professor.plano, sub: professor.planoStatus },
          { label: "Área", valor: professor.area ?? "Todas", sub: "de atuação" },
        ].map(({ label, valor, sub }) => (
          <div key={label} className="bg-white rounded-[1.5rem] border border-gray-100 p-5">
            <p className="text-xs text-gray-400 mb-2">{label}</p>
            <p className="text-2xl font-bold text-[#2D1B69]">{valor}</p>
            <p className="text-xs text-gray-300 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Barra de uso de alunos */}
      {limite !== 999999 && (
        <div className="bg-white rounded-[2rem] border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800">Uso do plano</h3>
            <span className="text-sm text-gray-400">{totalAlunos}/{limite} alunos</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min((totalAlunos / limite) * 100, 100)}%`,
                background: totalAlunos >= limite ? "#F87171" : "#2D1B69",
              }}
            />
          </div>
          {totalAlunos >= limite && (
            <p className="text-xs text-red-500 mt-2">
              Limite atingido.{" "}
              <a href="/planos" className="font-bold underline">Faça upgrade</a>{" "}
              para adicionar mais alunos.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
