"use client";

import { useRouter } from "next/navigation";

export function EscolaMetricasCards() {
  const router = useRouter();

  const metricas = [
    { 
      title: "Total Alunos", 
      value: "1.240", 
      change: "+12%", 
      onClick: () => {} 
    },
    { 
      title: "Professores Ativos", 
      value: "48", 
      change: "On-line", 
      onClick: () => {} 
    },
    { 
      title: "Consentimentos Pendentes", 
      value: "142", 
      change: "Ação Necessária", 
      onClick: () => router.push("/dashboard/escola/consentimentos"),
      highlight: true 
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metricas.map((m) => (
        <div 
          key={m.title} 
          onClick={m.onClick}
          className={`p-6 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${
            m.highlight 
            ? "border-yellow-400 bg-yellow-50/30" 
            : "border-gray-100 bg-white"
          }`}
        >
          <p className="text-sm text-gray-500 font-medium">{m.title}</p>
          <h3 className="text-3xl font-bold text-gray-800 mt-2">{m.value}</h3>
          <p className={`text-xs mt-1 font-semibold ${m.highlight ? "text-yellow-600" : "text-green-500"}`}>
            {m.change}
          </p>
        </div>
      ))}
    </div>
  );
}