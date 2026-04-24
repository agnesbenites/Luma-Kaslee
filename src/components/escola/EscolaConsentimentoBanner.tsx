export function EscolaConsentimentoBanner({ pendentes }: { pendentes: number }) {
  return (
    <div className={`p-4 rounded-lg border ${pendentes > 0 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{pendentes > 0 ? '⚠️' : '✅'}</span>
        <div>
          <h4 className={`font-bold ${pendentes > 0 ? 'text-amber-800' : 'text-green-800'}`}>
            {pendentes > 0 ? `${pendentes} Alunos sem consentimento` : '100% de conformidade com a LGPD'}
          </h4>
          <p className="text-sm text-gray-600">
            {pendentes > 0 
              ? "Existem alunos processando dados sem a assinatura digital dos responsáveis via App."
              : "Todos os dados estão sendo tratados com base legal confirmada."}
          </p>
        </div>
      </div>
    </div>
  );
}