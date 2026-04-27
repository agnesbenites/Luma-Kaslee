"use client";

import { useState, useEffect } from "react";
import { Loader2, TrendingUp, Users, Clock, Brain, BookOpen, MessageSquare } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

const CORES = ["#2D1B69", "#8B5CF6", "#F5C542", "#34D399", "#F87171", "#60A5FA"];

export default function EngajamentoPage() {
  const [dados, setDados] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);
  const [abaSelecionada, setAbaSelecionada] = useState("visao-geral");

  useEffect(() => {
    fetch("/api/escola/engajamento")
      .then((r) => r.json())
      .then(setDados)
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) return <div className="flex justify-center py-20"><Loader2 size={28} className="animate-spin text-[#2D1B69]" /></div>;

  const abas = [
    { id: "visao-geral", label: "Visão Geral" },
    { id: "alunos", label: "Alunos" },
    { id: "professores", label: "Professores" },
    { id: "perguntas", label: "Perguntas" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#2D1B69]">Engajamento Real</h2>
        <p className="text-sm text-gray-500">Dados de uso, produtividade e adaptabilidade da plataforma</p>
      </div>

      {/* Abas */}
      <div className="flex gap-2 flex-wrap">
        {abas.map((aba) => (
          <button key={aba.id} onClick={() => setAbaSelecionada(aba.id)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              abaSelecionada === aba.id ? "bg-[#2D1B69] text-white" : "bg-white border border-gray-100 text-gray-500 hover:border-purple-200"
            }`}>
            {aba.label}
          </button>
        ))}
      </div>

      {abaSelecionada === "visao-geral" && (
        <div className="space-y-6">
          {/* Cards de métricas */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Users size={20} />, label: "Sessões realizadas", valor: dados?.totalSessoes ?? "—", cor: "#2D1B69" },
              { icon: <Clock size={20} />, label: "Tempo médio de resposta", valor: dados?.tempoMedioResposta ? `${dados.tempoMedioResposta}min` : "—", cor: "#8B5CF6" },
              { icon: <Brain size={20} />, label: "Índice de foco médio", valor: dados?.indiceFocoMedio ? `${dados.indiceFocoMedio}%` : "—", cor: "#F5C542" },
              { icon: <TrendingUp size={20} />, label: "Adaptabilidade média", valor: dados?.adaptabilidade ? `${dados.adaptabilidade}%` : "—", cor: "#34D399" },
            ].map(({ icon, label, valor, cor }) => (
              <div key={label} className="bg-white rounded-[1.5rem] border border-gray-100 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl" style={{ background: `${cor}18`, color: cor }}>{icon}</div>
                  <p className="text-xs text-gray-400 font-medium">{label}</p>
                </div>
                <p className="text-2xl font-bold text-gray-800">{valor}</p>
              </div>
            ))}
          </div>

          {/* Gráfico sessões por turma */}
          <div className="bg-white rounded-[2rem] border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4">Sessões realizadas por turma</h3>
            {dados?.sessoesPorTurma?.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={dados.sessoesPorTurma}>
                  <XAxis dataKey="turma" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="sessoes" fill="#2D1B69" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-40 text-gray-300 text-sm">Sem dados ainda</div>
            )}
          </div>

          {/* Gráfico concentração ao longo do tempo */}
          <div className="bg-white rounded-[2rem] border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-1">Nível de concentração e produtividade</h3>
            <p className="text-xs text-gray-400 mb-4">Evolução mensal média dos alunos</p>
            {dados?.evolucaoFoco?.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={dados.evolucaoFoco}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="foco" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: "#8B5CF6" }} />
                  <Line type="monotone" dataKey="produtividade" stroke="#F5C542" strokeWidth={2} dot={{ fill: "#F5C542" }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-40 text-gray-300 text-sm">Sem dados ainda</div>
            )}
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#8B5CF6]" /><span className="text-xs text-gray-400">Foco</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#F5C542]" /><span className="text-xs text-gray-400">Produtividade</span></div>
            </div>
          </div>
        </div>
      )}

      {abaSelecionada === "alunos" && (
        <div className="space-y-4">
          <div className="bg-white rounded-[2rem] border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4">Adaptabilidade ao uso do app por aluno</h3>
            {dados?.adaptabilidadePorAluno?.length > 0 ? (
              <div className="space-y-3">
                {dados.adaptabilidadePorAluno.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-24 text-xs text-gray-500 truncate shrink-0">{item.nome}</div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-[#2D1B69]" style={{ width: `${item.adaptabilidade}%` }} />
                    </div>
                    <span className="text-xs font-bold text-gray-600 w-10 text-right">{item.adaptabilidade}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-gray-300 text-sm">Sem dados ainda</div>
            )}
          </div>

          <div className="bg-white rounded-[2rem] border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4">Tempo médio de resposta por aluno</h3>
            {dados?.tempoPorAluno?.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={dados.tempoPorAluno} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 11 }} unit="min" />
                  <YAxis type="category" dataKey="nome" tick={{ fontSize: 10 }} width={80} />
                  <Tooltip />
                  <Bar dataKey="tempo" fill="#8B5CF6" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-40 text-gray-300 text-sm">Sem dados ainda</div>
            )}
          </div>
        </div>
      )}

      {abaSelecionada === "professores" && (
        <div className="space-y-4">
          <div className="bg-white rounded-[2rem] border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4">Uso da plataforma por professor</h3>
            {dados?.usoPorProfessor?.length > 0 ? (
              <div className="space-y-4">
                {dados.usoPorProfessor.map((prof: any, i: number) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-[#2D1B69] font-bold text-xs">
                          {prof.nome.charAt(0)}
                        </div>
                        <span className="font-semibold text-sm text-gray-800">{prof.nome}</span>
                      </div>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-bold">
                        {prof.sessoes} sessões
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-white rounded-xl p-2">
                        <p className="text-lg font-bold text-[#2D1B69]">{prof.alunos}</p>
                        <p className="text-[10px] text-gray-400">Alunos ativos</p>
                      </div>
                      <div className="bg-white rounded-xl p-2">
                        <p className="text-lg font-bold text-[#8B5CF6]">{prof.tempoMedio}min</p>
                        <p className="text-[10px] text-gray-400">Tempo médio/sessão</p>
                      </div>
                      <div className="bg-white rounded-xl p-2">
                        <p className="text-lg font-bold text-[#34D399]">{prof.engajamento}%</p>
                        <p className="text-[10px] text-gray-400">Engajamento</p>
                      </div>
                    </div>
                    {prof.metodosUsados?.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-400 mb-1.5">Métodos usados para solucionar perguntas:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {prof.metodosUsados.map((m: string) => (
                            <span key={m} className="text-[10px] bg-white border border-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{m}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-gray-300 text-sm">Sem dados ainda</div>
            )}
          </div>
        </div>
      )}

      {abaSelecionada === "perguntas" && (
        <div className="space-y-4">
          <div className="bg-white rounded-[2rem] border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare size={18} className="text-[#2D1B69]" />
              <h3 className="font-bold text-gray-800">Perguntas mais feitas por matéria</h3>
            </div>
            {dados?.perguntasPorMateria?.length > 0 ? (
              <div className="space-y-4">
                {dados.perguntasPorMateria.map((item: any, i: number) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-700">{item.materia}</span>
                      <span className="text-xs text-gray-400">{item.total} perguntas</span>
                    </div>
                    <div className="space-y-1.5">
                      {item.topPerguntas?.map((p: string, j: number) => (
                        <div key={j} className="flex items-start gap-2 bg-gray-50 rounded-xl px-3 py-2">
                          <span className="text-[10px] font-bold text-purple-400 mt-0.5">{j + 1}</span>
                          <span className="text-xs text-gray-600">{p}</span>
                        </div>
                      ))}
                    </div>
                    {item.comoFoiSolucionado && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[10px] text-gray-400">Solução predominante:</span>
                        <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold">{item.comoFoiSolucionado}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-gray-300 text-sm">Sem dados ainda</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}