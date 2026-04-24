"use client";

const STATUS_LABEL: Record<string, string> = {
  ATIVO:    "✓ Ativo",
  PENDENTE: "⏳ Pendente",
  REVOGADO: "✕ Revogado",
};

const STATUS_COR: Record<string, string> = {
  ATIVO:    "#437a22",
  PENDENTE: "#964219",
  REVOGADO: "#a12c7b",
};

type Aluno = {
  id: string;
  nome: string;
  turmaNome: string;
  serie: string;
  consentimento: string;
  consentimentoEm: string | null;
};

export default function EscolaAlunosTabela({ alunos }: { alunos: Aluno[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border shadow-sm" style={{ borderColor: "#E5E2DC" }}>
      <table className="w-full text-sm">
        <thead style={{ background: "#F7F6F2" }}>
          <tr>
            {["Nome", "Turma", "Série", "Consentimento", "Data"].map((h) => (
              <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-[#7a7974]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {alunos.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-5 py-10 text-center text-[#bab9b4]">
                Nenhum aluno cadastrado.
              </td>
            </tr>
          ) : (
            alunos.map((a, i) => (
              <tr
                key={a.id}
                style={{ background: i % 2 === 0 ? "#FFFFFF" : "#FAFAF8", borderTop: "1px solid #F0EDE9" }}
              >
                <td className="px-5 py-4 font-semibold text-[#28251d]">{a.nome}</td>
                <td className="px-5 py-4 text-[#7a7974]">{a.turmaNome}</td>
                <td className="px-5 py-4 text-[#7a7974]">{a.serie}</td>
                <td className="px-5 py-4">
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      background: `${STATUS_COR[a.consentimento] || "#7a7974"}15`,
                      color: STATUS_COR[a.consentimento] || "#7a7974",
                    }}
                  >
                    {STATUS_LABEL[a.consentimento] || a.consentimento}
                  </span>
                </td>
                <td className="px-5 py-4 text-[#7a7974]">
                  {a.consentimentoEm
                    ? new Date(a.consentimentoEm).toLocaleDateString("pt-BR")
                    : "—"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}