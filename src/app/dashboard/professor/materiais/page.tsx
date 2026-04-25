"use client";

import { useState, useEffect, useRef } from "react";
import {
  Upload, FileText, FileImage, Presentation,
  Trash2, Eye, Plus, X, Loader2, BookOpen
} from "lucide-react";

type Material = {
  id: string;
  titulo: string;
  tipo: string;
  fileUrl: string;
  fileMime: string;
  fileTamanho: number;
  componente: string | null;
  serie: string | null;
  criadoEm: string;
};

const SERIES = ["6º ano", "7º ano", "8º ano", "9º ano", "1º EM", "2º EM", "3º EM"];
const COMPONENTES = [
  "Matemática", "Português", "Ciências", "História", "Geografia",
  "Física", "Química", "Biologia", "Inglês", "Artes", "Educação Física",
];

function iconeDoTipo(tipo: string) {
  if (tipo === "IMAGEM") return <FileImage size={20} />;
  if (tipo === "PPTX") return <Presentation size={20} />;
  return <FileText size={20} />;
}

function formatarTamanho(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ProfessorMateriaisPage() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // Form
  const [titulo, setTitulo] = useState("");
  const [componente, setComponente] = useState("");
  const [serie, setSerie] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function carregarMateriais() {
    setCarregando(true);
    try {
      const res = await fetch("/api/materiais");
      const data = await res.json();
      setMateriais(data);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregarMateriais(); }, []);

  function abrirModal() {
    setTitulo("");
    setComponente("");
    setSerie("");
    setArquivo(null);
    setErro("");
    setModalAberto(true);
  }

  async function handleUpload() {
    if (!arquivo || !titulo.trim()) {
      setErro("Preencha o título e selecione um arquivo.");
      return;
    }
    setEnviando(true);
    setErro("");
    try {
      const form = new FormData();
      form.append("file", arquivo);
      form.append("titulo", titulo);
      if (componente) form.append("componente", componente);
      if (serie) form.append("serie", serie);

      const res = await fetch("/api/materiais/upload", { method: "POST", body: form });
      if (!res.ok) {
        const data = await res.json();
        setErro(data.error || "Erro ao enviar arquivo.");
        return;
      }
      setModalAberto(false);
      setSucesso("Material enviado com sucesso!");
      setTimeout(() => setSucesso(""), 3000);
      carregarMateriais();
    } finally {
      setEnviando(false);
    }
  }

  async function handleExcluir(id: string) {
    if (!confirm("Excluir este material?")) return;
    await fetch(`/api/materiais/${id}`, { method: "DELETE" });
    carregarMateriais();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-[#2D1B69]">Meus Materiais</h2>
          <p className="text-sm text-gray-500">Apostilas, planos de aula e slides disponibilizados aos alunos</p>
        </div>
        <button
          onClick={abrirModal}
          className="flex items-center gap-2 px-4 py-2 bg-[#2D1B69] text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all"
        >
          <Plus size={16} /> Novo Material
        </button>
      </div>

      {/* Feedback */}
      {sucesso && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-2xl font-medium">
          ✓ {sucesso}
        </div>
      )}

      {/* Lista */}
      {carregando ? (
        <div className="flex justify-center py-16">
          <Loader2 size={28} className="animate-spin text-[#2D1B69]" />
        </div>
      ) : materiais.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-purple-100 p-16 text-center">
          <BookOpen size={40} className="mx-auto text-purple-200 mb-4" />
          <p className="font-bold text-gray-700">Nenhum material ainda</p>
          <p className="text-sm text-gray-400 mt-1">Clique em "Novo Material" para fazer o primeiro upload.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-50">
            {materiais.map((m) => (
              <div key={m.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-purple-50 rounded-xl text-[#2D1B69]">
                  {iconeDoTipo(m.tipo)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800 truncate">{m.titulo}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold uppercase">{m.tipo}</span>
                    {m.componente && <span className="text-[10px] text-gray-400">{m.componente}</span>}
                    {m.serie && <span className="text-[10px] text-gray-400">· {m.serie}</span>}
                    {m.fileTamanho && <span className="text-[10px] text-gray-300">· {formatarTamanho(m.fileTamanho)}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={m.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-[#2D1B69] hover:bg-purple-50 rounded-xl transition-all"
                    title="Visualizar"
                  >
                    <Eye size={16} />
                  </a>
                  <button
                    onClick={() => handleExcluir(m.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Upload */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-8 space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#2D1B69]">Novo Material</h3>
              <button onClick={() => setModalAberto(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {/* Área de drop */}
            <div
              onClick={() => inputRef.current?.click()}
              className="border-2 border-dashed border-purple-200 rounded-2xl p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all"
            >
              {arquivo ? (
                <div>
                  <p className="font-semibold text-[#2D1B69] text-sm">{arquivo.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatarTamanho(arquivo.size)}</p>
                </div>
              ) : (
                <div>
                  <Upload size={28} className="mx-auto text-purple-300 mb-2" />
                  <p className="text-sm text-gray-500">Clique para selecionar</p>
                  <p className="text-xs text-gray-300 mt-1">PDF, DOCX, PPTX, JPG, PNG · máx. 50MB</p>
                </div>
              )}
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept=".pdf,.docx,.pptx,.jpg,.jpeg,.png"
                onChange={(e) => setArquivo(e.target.files?.[0] ?? null)}
              />
            </div>

            {/* Título */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Título *</label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Apostila de Química — 2º EM"
                className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-100 focus:ring-2 focus:ring-purple-200 outline-none"
              />
            </div>

            {/* Componente + Série */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Componente</label>
                <select
                  value={componente}
                  onChange={(e) => setComponente(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-100 focus:ring-2 focus:ring-purple-200 outline-none"
                >
                  <option value="">Selecionar</option>
                  {COMPONENTES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Série</label>
                <select
                  value={serie}
                  onChange={(e) => setSerie(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-100 focus:ring-2 focus:ring-purple-200 outline-none"
                >
                  <option value="">Selecionar</option>
                  {SERIES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {erro && <p className="text-red-500 text-sm">{erro}</p>}

            <button
              onClick={handleUpload}
              disabled={enviando}
              className="w-full py-3 bg-[#2D1B69] text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {enviando ? <><Loader2 size={16} className="animate-spin" /> Enviando...</> : <><Upload size={16} /> Enviar Material</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}