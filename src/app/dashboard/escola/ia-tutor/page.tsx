"use client";

import { useState, useEffect } from "react";
import { Loader2, Shield, AlertTriangle, CheckCircle, Clock, Settings, Activity, Bell } from "lucide-react";

type LogRisco = {
  id: string;
  alunoAnonimo: string;
  turma: string;
  tipo: string;
  descricao: string;
  ocorreuEm: string;
  resolvido: boolean;
};

type Manutencao = {
  id: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  status: "PROGRAMADA" | "EM_ANDAMENTO" | "CONCLUIDA";
};

export default function IATutorPage() {
  const [dados, setDados] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState("status");

  useEffect(() => {
    fetch("/api/escola/ia-status")
      .then((r) => r.json())
      .then(setDados)
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) return <div className="flex justify-center py-20"><Loader2 size={28} className="animate-spin text-[#2D1B69]" /></div>;

  const abas = [
    { id: "status", label: "Status & Disponibilidade", icon: <Activity size={14} /> },
    { id: "seguranca", label: "Logs de Segurança", icon: <Shield size={14} /> },
    { id: "manutencao", label: "Manutenção", icon: <Settings size={14} /> },
  ];

  const statusIA = dados?.online ? "online" : "offline";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-[#2D1B69]">IA Luma — Painel de Controle</h2>
          <p className="text-sm text-gray-500">Status, segurança e manutenção programada</p>
        </div>
        {/* Badge de status */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm ${
          statusIA === "online" ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
        }`}>
          <div className={`w-2 h-2 rounded-full ${statusIA === "online" ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
          {statusIA === "online" ? "Luma Online" : "Luma Offline"}
        </div>
      </div>

      {/* Alerta de riscos não resolvidos */}
      {dados?.riscosNaoResolvidos > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl px-5 py-4 flex items-center gap-4">
          <Bell size={20} className="text-orange-500 shrink-0" />
          <div>
            <p className="font-bold text-orange-700 text-sm">
              {dados.riscosNaoResolvidos} alerta{dados.riscosNaoResolvidos > 1 ? "s" : ""} de segurança pendente{dados.riscosNaoResolvidos > 1 ? "s" : ""}
            </p>
            <p className="text-xs text-orange-500 mt-0.5">
              Foram detectadas interações fora dos temas escolares que requerem sua atenção.
            </p>
          </div>
          <button onClick={() => setAbaAtiva("seguranca")}
            className="ml-auto px-3 py-1.5 bg-orange-500 text-white rounded-xl text-xs font-bold hover:opacity-90 shrink-0">
            Ver logs
          </button>
        </div>
      )}

      {/* Abas */}
      <div className="flex gap-2 flex-wrap">
        {abas.map((aba) => (
          <button key={aba.id} onClick={() => setAbaAtiva(aba.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              abaAtiva === aba.id ? "bg-[#2D1B69] text-white" : "bg-white border border-gray-100 text-gray-500 hover:border-purple-200"
            }`}>
            {aba.icon}{aba.label}
          </button>
        ))}
      </div>

      {/* Status & Disponibilidade */}
      {abaAtiva === "status" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Uptime", valor: dados?.uptime ?? "—", icon: <Activity size={18} />, cor: "#34D399" },
              { label: "Latência média", valor: dados?.latencia ? `${dados.latencia}ms` : "—", icon: <Clock size={18} />, cor: "#8B5CF6" },
              { label: "Sessões hoje", valor: dados?.sessoesHoje ?? "—", icon: <CheckCircle size={18} />, cor: "#2D1B69" },
              { label: "Alertas ativos", valor: dados?.riscosNaoResolvidos ?? 0, icon: <AlertTriangle size={18} />, cor: "#F5C542" },
            ].map(({ label, valor, icon, cor }) => (
              <div key={label} className="bg-white rounded-[1.5rem] border border-gray-100 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl" style={{ background: `${cor}18`, color: cor }}>{icon}</div>
                  <p className="text-xs text-gray-400">{label}</p>
                </div>
                <p className="text-2xl font-bold text-gray-800">{valor}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-[2rem] border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4">Configurações de segurança da IA</h3>
            <div className="space-y-3">
              {[
                { label: "Bloqueio de conteúdo sexual ou explícito", ativo: true },
                { label: "Bloqueio de conteúdo violento ou perturbador", ativo: true },
                { label: "Restrição a temas escolares (BNCC)", ativo: true },
                { label: "Detecção de isolamento social", ativo: true },
                { label: "Alerta automático à escola em caso de risco", ativo: true },
                { label: "Anonimização nos logs internos", ativo: true },
              ].map(({ label, ativo }) => (
                <div key={label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-600">{label}</span>
                  <div className={`flex items-center gap-1.5 text-xs font-bold ${ativo ? "text-green-600" : "text-red-400"}`}>
                    {ativo ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                    {ativo ? "Ativo" : "Inativo"}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-300 mt-4">
              Para solicitar informações adicionais sobre um incidente (modelo do dispositivo, horário exato, etc.), entre em contato formal com a Kaslee.
            </p>
          </div>
        </div>
      )}

      {/* Logs de Segurança */}
      {abaAtiva === "seguranca" && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-100 rounded-2xl px-5 py-3 text-xs text-amber-700">
            <strong>Política de privacidade:</strong> Os logs abaixo não identificam o aluno individualmente. 
            Para informações detalhadas (dispositivo, horário preciso, histórico completo), é necessária solicitação formal à Kaslee.
          </div>

          <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Logs de interações com risco detectado</h3>
              <span className="text-xs text-gray-400">{dados?.logs?.length ?? 0} registros</span>
            </div>

            {!dados?.logs || dados.logs.length === 0 ? (
              <div className="p-16 text-center">
                <Shield size={40} className="mx-auto text-green-200 mb-4" />
                <p className="font-bold text-gray-700">Nenhum alerta de segurança</p>
                <p className="text-sm text-gray-400 mt-1">Todas as interações estão dentro dos parâmetros seguros.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {dados.logs.map((log: LogRisco) => (
                  <div key={log.id} className="px-6 py-4 flex items-start gap-4">
                    <div className={`p-2 rounded-xl shrink-0 ${log.resolvido ? "bg-gray-50 text-gray-300" : "bg-orange-50 text-orange-500"}`}>
                      <AlertTriangle size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-gray-700">{log.tipo}</span>
                        <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">{log.turma}</span>
                        <span className="text-[10px] text-gray-300">{log.alunoAnonimo}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{log.descricao}</p>
                      <p className="text-[10px] text-gray-300 mt-1">
                        {new Date(log.ocorreuEm).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                      log.resolvido ? "bg-gray-50 text-gray-400" : "bg-orange-50 text-orange-600"
                    }`}>
                      {log.resolvido ? "Resolvido" : "Pendente"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manutenção */}
      {abaAtiva === "manutencao" && (
        <div className="space-y-4">
          <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <h3 className="font-bold text-gray-800">Manutenções programadas pela Kaslee</h3>
              <p className="text-xs text-gray-400 mt-0.5">Janelas de indisponibilidade planejadas</p>
            </div>

            {!dados?.manutencoes || dados.manutencoes.length === 0 ? (
              <div className="p-16 text-center">
                <CheckCircle size={40} className="mx-auto text-green-200 mb-4" />
                <p className="font-bold text-gray-700">Nenhuma manutenção programada</p>
                <p className="text-sm text-gray-400 mt-1">A plataforma está disponível normalmente.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {dados.manutencoes.map((m: Manutencao) => {
                  const statusCfg = {
                    PROGRAMADA: { label: "Programada", bg: "bg-blue-50", color: "text-blue-600" },
                    EM_ANDAMENTO: { label: "Em andamento", bg: "bg-orange-50", color: "text-orange-600" },
                    CONCLUIDA: { label: "Concluída", bg: "bg-green-50", color: "text-green-600" },
                  }[m.status];

                  return (
                    <div key={m.id} className="px-6 py-4 flex items-start gap-4">
                      <div className="p-2 bg-blue-50 rounded-xl text-blue-500 shrink-0"><Settings size={16} /></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm text-gray-800">{m.descricao}</p>
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusCfg.bg} ${statusCfg.color}`}>
                            {statusCfg.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                          <span>Início: {new Date(m.dataInicio).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                          <span>·</span>
                          <span>Fim: {new Date(m.dataFim).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-purple-50 border border-purple-100 rounded-2xl px-5 py-4 text-xs text-purple-700">
            As manutenções são programadas pela equipe Kaslee e comunicadas com antecedência mínima de 48h. 
            Durante a manutenção, a plataforma ficará indisponível para alunos e professores.
          </div>
        </div>
      )}
    </div>
  );
}