import { EscolaMetricasCards } from "@/components/escola/EscolaMetricasCards";
import { EscolaEngajamentoChart } from "@/components/escola/EscolaEngajamentoChart";

export default function VisaoGeralEscola() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Panorama Institucional</h2>
      
      {/* Cards com dados agregados - LGPD Friendly */}
      <EscolaMetricasCards />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-medium mb-4">Adesão ao ECA Digital (Consentimentos)</h3>
          {/* Gráfico de quantos pais já assinaram no app */}
          <EscolaEngajamentoChart type="consentimento" />
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-medium mb-4">Uso da Plataforma por Turma</h3>
          <EscolaEngajamentoChart type="uso" />
        </div>
      </div>
    </div>
  );
}