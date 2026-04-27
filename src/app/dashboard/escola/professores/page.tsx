"use client";

import { useState, useEffect } from "react";
import { Loader2, ChevronDown, ChevronUp, GraduationCap, Clock, BookOpen, Trash2, AlertTriangle, UserPlus, Link2, Copy, Check, X } from "lucide-react";

const DIAS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

type AulaGrade = { diaSemana: number; horaInicio: string; horaFim: string; componente: string; serie: string };
type Professor = { id: string; nome: string; email: string; materias: string[]; anos: string[]; grade: AulaGrade[]; criadoEm: string };

export default function EscolaProfessoresPage() {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [expandido, setExpandido] = useState<string | null>(null);
  const [confirmarExclusao, setConfirmarExclusao] = useState<string | null>(null);
  const [excluindo, setExcluindo] = useState<string | null>(null);
  const [modalConvite, setModalConvite] = useState(false);
  const [emailConvite, setEmailConvite] = useState("");
  const [gerando, setGerando] = useState(false);
  const [linkGerado, setLinkGerado] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [erroConvite, setErroConvite] = useState("");

  async function carregarProfessores() {
    setCarregando(true);
    fetch("/api/escola/professores/detalhes")
      .then((r) => r.json())
      .then(setProfessores)
      .finally(() => setCarregando(false));
  }

  useEffect(() => { carregarProfessores(); }, []);

  async function handleExcluir(id: string) {
    setExcluindo(id);
    try {
      const res = await fetch(`/api/escola/professores/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProfessores((p) => p.filter((prof) => prof.id !== id));
        setConfirmarExclusao(null);
        setExpandido(null);
      }
    } finally {
      setExcluindo(null);
    }
  }

  async function handleGerarConvite() {
    setGerando(true);
    setErroConvite("");
    setLinkGerado("");
    try {
      const res = await fetch("/api/convites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: "PROFESSOR", email: emailConvite || null }),
      });
      const data = await res.json();
      if (!res.ok) { setErroConvite(data.error || "Erro ao gerar convite."); return; }
      setLinkGerado(data.link);
    } finally {
      setGerando(false);
    }
  }

  function copiarLink() {
    navigator.clipboard.writeText(linkGerado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  function fecharModal() {
    setModalConvite(false);
    setEmailConvite("");
    setLinkGerado("");
    setErroConvite("");
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-[#2D1B69]">Professores</h2>
          <p className="text-sm text-gray-500">Grade horária, matérias e turmas de cada professor</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">{professores.length} professor{professores.length !== 1 ? "es" : ""}</span>
          <button
            onClick={() => setModalConvite(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#2D1B69] text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all"
          >
            <UserPlus size={16} /> Convidar Professor
          </button>
        </div>
      </div>

      {carregando ? (
        <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-[#2D1B69]" /></div>
      ) : professores.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-purple-100 p-16 text-center">
          <GraduationCap size={40} className="mx-auto text-purple-200 mb-4" />
          <p className="font-bold text-gray-700">Nenhum professor cadastrado ainda</p>
          <p className="text-sm text-gray-400 mt-1">Clique em "Convidar Professor" para enviar um link de cadastro.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {professores.map((prof) => (
            <div key={prof.id} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden">
              <div className="flex items-center px-6 py-4">
                <button onClick={() => setExpandido(expandido === prof.id ? null : prof.id)}
                  className="flex-1 flex items-center justify-between hover:opacity-80 transition-opacity">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-[#2D1B69] font-bold text-sm">
                      {prof.nome.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">{prof.nome}</p>
                      <p className="text-xs text-gray-400">{prof.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex gap-2">
                      {prof.materias.slice(0, 3).map((m) => (
                        <span key={m} className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">{m}</span>
                      ))}
                      {prof.materias.length > 3 && <span className="text-[10px] text-gray-400">+{prof.materias.length - 3}</span>}
                    </div>
                    {expandido === prof.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </button>
                <button onClick={() => setConfirmarExclusao(prof.id)}
                  className="ml-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                  <Trash2 size={16} />
                </button>
              </div>

              {confirmarExclusao === prof.id && (
                <div className="mx-6 mb-4 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-4">
                  <AlertTriangle size={18} className="text-red-500 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-red-700">Excluir {prof.nome}?</p>
                    <p className="text-xs text-red-500 mt-0.5">Todos os dados deste professor serão removidos permanentemente.</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => setConfirmarExclusao(null)}
                      className="px-3 py-1.5 text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
                      Cancelar
                    </button>
                    <button onClick={() => handleExcluir(prof.id)} disabled={excluindo === prof.id}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 disabled:opacity-50 flex items-center gap-1.5">
                      {excluindo === prof.id && <Loader2 size={12} className="animate-spin" />}
                      Confirmar exclusão
                    </button>
                  </div>
                </div>
              )}

              {expandido === prof.id && (
                <div className="px-6 pb-6 space-y-5 border-t border-gray-50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen size={14} className="text-[#2D1B69]" />
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Matérias</span>
                      </div>
                      {prof.materias.length === 0 ? <p className="text-xs text-gray-300">Não informado</p> : (
                        <div className="flex flex-wrap gap-1.5">
                          {prof.materias.map((m) => <span key={m} className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-xl font-medium">{m}</span>)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <GraduationCap size={14} className="text-[#2D1B69]" />
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Séries</span>
                      </div>
                      {prof.anos.length === 0 ? <p className="text-xs text-gray-300">Não informado</p> : (
                        <div className="flex flex-wrap gap-1.5">
                          {prof.anos.map((a) => <span key={a} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-xl font-medium">{a}</span>)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock size={14} className="text-[#2D1B69]" />
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Grade Horária</span>
                    </div>
                    {prof.grade.length === 0 ? <p className="text-xs text-gray-300">Grade não preenchida ainda</p> : (
                      <div className="space-y-2">
                        {DIAS.map((dia, idx) => {
                          const aulas = prof.grade.filter((g) => g.diaSemana === idx);
                          if (aulas.length === 0) return null;
                          return (
                            <div key={dia} className="flex gap-3 items-start">
                              <span className="text-xs font-bold text-gray-400 w-16 pt-1 shrink-0">{dia}</span>
                              <div className="flex flex-wrap gap-2">
                                {aulas.map((aula, i) => (
                                  <div key={i} className="flex items-center gap-1.5 bg-purple-50 rounded-xl px-3 py-1.5">
                                    <span className="text-xs font-bold text-[#2D1B69]">{aula.componente}</span>
                                    <span className="text-[10px] text-gray-400">{aula.serie}</span>
                                    <span className="text-[10px] text-gray-300">{aula.horaInicio}–{aula.horaFim}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-300">Cadastrado em {new Date(prof.criadoEm).toLocaleDateString("pt-BR")}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal Convidar Professor */}
      {modalConvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-8 space-y-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-xl text-[#2D1B69]"><Link2 size={18} /></div>
                <div>
                  <h3 className="text-lg font-bold text-[#2D1B69]">Convidar Professor</h3>
                  <p className="text-xs text-gray-400">Gere um link e envie para o professor</p>
                </div>
              </div>
              <button onClick={fecharModal} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                E-mail do professor (opcional)
              </label>
              <input
                type="email"
                value={emailConvite}
                onChange={(e) => setEmailConvite(e.target.value)}
                placeholder="professor@escola.com.br"
                className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-100 focus:ring-2 focus:ring-purple-200 outline-none"
              />
              <p className="text-[10px] text-gray-400 mt-1">Se informado, o e-mail será pré-preenchido no cadastro.</p>
            </div>

            {erroConvite && <p className="text-red-500 text-sm">{erroConvite}</p>}

            {!linkGerado ? (
              <button onClick={handleGerarConvite} disabled={gerando}
                className="w-full py-3 bg-[#2D1B69] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50">
                {gerando ? <><Loader2 size={16} className="animate-spin" /> Gerando...</> : <><Link2 size={16} /> Gerar link de convite</>}
              </button>
            ) : (
              <div className="space-y-3">
                <div className="bg-purple-50 rounded-2xl p-4 space-y-3">
                  <p className="text-xs font-bold text-purple-700">Link gerado com sucesso! Válido por 7 dias.</p>
                  <div className="flex items-center gap-2">
                    <input readOnly value={linkGerado}
                      className="flex-1 px-3 py-2 bg-white border border-purple-100 rounded-xl text-xs text-gray-600 outline-none truncate" />
                    <button onClick={copiarLink}
                      className="p-2 bg-[#2D1B69] text-white rounded-xl hover:opacity-90 shrink-0">
                      {copiado ? <Check size={15} /> : <Copy size={15} />}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400">Copie e envie este link por e-mail ou WhatsApp. Uso único.</p>
                </div>
                <button onClick={fecharModal}
                  className="w-full py-2.5 border border-gray-100 text-gray-500 rounded-xl font-bold text-sm hover:bg-gray-50">
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
