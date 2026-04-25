"use client";

import { useState, useEffect } from "react";
import { FileText, FileImage, Presentation, Eye, BookOpen, Loader2, Search } from "lucide-react";

type Material = {
  id: string;
  titulo: string;
  tipo: string;
  fileUrl: string;
  fileTamanho: number;
  componente: string | null;
  serie: string | null;
  criadoEm: string;
  professor?: { nome: string };
};

function iconeDoTipo(tipo: string) {
  if (tipo === "IMAGEM") return <FileImage size={18} />;
  if (tipo === "PPTX") return <Presentation size={18} />;
  return <FileText size={18} />;
}

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AlunoMateriaisPage() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("TODOS");

  useEffect(() => {
    fetch("/api/materiais")
      .then((r) => r.json())
      .then((data) => setMateriais(data))
      .finally(() => setCarregando(false));
  }, []);

  const filtrados = materiais.filter((m) => {
    const buscaOk = m.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      (m.componente ?? "").toLowerCase().includes(busca.toLowerCase());
    const tipoOk = filtroTipo === "TODOS" || m.tipo === filtroTipo;
    return buscaOk && tipoOk;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#2D1B69]">Materiais de Aula</h2>
        <p className="text-sm text-gray-500">Apostilas, slides e documentos disponibilizados pelo seu professor</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por título ou componente..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-purple-200 outline-none"
          />
          <Search className="absolute left-3 top-3 text-gray-300" size={16} />
        </div>
        <div className="flex gap-2">
          {["TODOS", "PDF", "DOCX", "PPTX", "IMAGEM"].map((tipo) => (
            <button
              key={tipo}
              onClick={() => setFiltroTipo(tipo)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                filtroTipo === tipo
                  ? "bg-[#2D1B69] text-white"
                  : "bg-white border border-gray-100 text-gray-500 hover:border-purple-200"
              }`}
            >
              {tipo}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo */}
      {carregando ? (
        <div className="flex justify-center py-16">
          <Loader2 size={28} className="animate-spin text-[#2D1B69]" />
        </div>
      ) : filtrados.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-purple-100 p-16 text-center">
          <BookOpen size={40} className="mx-auto text-purple-200 mb-4" />
          <p className="font-bold text-gray-700">Nenhum material encontrado</p>
          <p className="text-sm text-gray-400 mt-1">
            {materiais.length === 0
              ? "Seu professor ainda não enviou materiais."
              : "Tente ajustar os filtros de busca."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtrados.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-[1.5rem] border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-md hover:border-purple-100 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="p-2.5 bg-purple-50 rounded-xl text-[#2D1B69]">
                  {iconeDoTipo(m.tipo)}
                </div>
                <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold uppercase">
                  {m.tipo}
                </span>
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-sm text-gray-800 leading-snug">{m.titulo}</h3>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {m.componente && (
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{m.componente}</span>
                  )}
                  {m.serie && (
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{m.serie}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <span className="text-[10px] text-gray-300">{formatarData(m.criadoEm)}</span>
                <a
                  href={m.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-bold text-[#2D1B69] hover:opacity-70 transition-opacity"
                >
                  <Eye size={13} /> Abrir
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}