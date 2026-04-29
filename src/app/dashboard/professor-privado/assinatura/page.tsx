import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AssinaturaPage() {
  const session = await auth();
  if (!session || (session.user as any).role !== "PROFESSOR_PRIVADO") redirect("/login");

  const professorId = (session.user as any).id;
  const professor = await prisma.professorPrivado.findUnique({ where: { id: professorId } });
  if (!professor) redirect("/login");

  const statusConfig: Record<string, { label: string; cor: string; bg: string }> = {
    TRIAL: { label: "Trial gratuito", cor: "text-yellow-700", bg: "bg-yellow-50" },
    ATIVO: { label: "Ativo", cor: "text-green-700", bg: "bg-green-50" },
    CANCELADO: { label: "Cancelado", cor: "text-red-700", bg: "bg-red-50" },
    INADIMPLENTE: { label: "Pagamento pendente", cor: "text-orange-700", bg: "bg-orange-50" },
  };

  const cfg = statusConfig[professor.planoStatus] ?? statusConfig.TRIAL;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-[#2D1B69]">Minha Assinatura</h2>
        <p className="text-sm text-gray-500">Gerencie seu plano e pagamento</p>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Plano atual</p>
            <p className="text-2xl font-bold text-[#2D1B69]">{professor.plano}</p>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${cfg.bg} ${cfg.cor}`}>
            {cfg.label}
          </span>
        </div>

        {professor.trialExpiraEm && professor.planoStatus === "TRIAL" && (
          <div className="bg-yellow-50 rounded-2xl p-4">
            <p className="text-sm text-yellow-700">
              Trial expira em <strong>{new Date(professor.trialExpiraEm).toLocaleDateString("pt-BR")}</strong>.
              Escolha um plano para não perder o acesso.
            </p>
          </div>
        )}

        <div className="pt-2 border-t border-gray-50 flex gap-3">
          <Link href="/planos"
            className="flex-1 py-2.5 bg-[#2D1B69] text-white rounded-xl font-bold text-sm text-center hover:opacity-90">
            {professor.planoStatus === "ATIVO" ? "Mudar plano" : "Assinar agora"}
          </Link>
          {professor.planoStatus === "ATIVO" && (
            <Link href="/api/stripe/portal"
              className="flex-1 py-2.5 border border-gray-200 text-gray-500 rounded-xl font-bold text-sm text-center hover:bg-gray-50">
              Gerenciar pagamento
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
