"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface ChartProps {
  type?: "consentimento" | "uso";
}

const dadosConsentimento = [
  { name: "1º Ano", total: 95 },
  { name: "2º Ano", total: 88 },
  { name: "3º Ano", total: 75 },
  { name: "4º Ano", total: 92 },
  { name: "5º Ano", total: 80 },
];

const dadosUso = [
  { name: "Seg", total: 400 },
  { name: "Ter", total: 300 },
  { name: "Qua", total: 500 },
  { name: "Qui", total: 280 },
  { name: "Sex", total: 590 },
];

export function EscolaEngajamentoChart({ type = "uso" }: ChartProps) {
  const data = type === "consentimento" ? dadosConsentimento : dadosUso;
  const color = type === "consentimento" ? "#F5C542" : "#A78BFA";

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: "#FFF", borderRadius: "8px", border: "1px solid #E5E7EB" }}
          />
          <Bar dataKey="total" fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}