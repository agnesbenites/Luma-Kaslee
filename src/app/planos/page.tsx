import { Suspense } from "react";
import PlanosConteudo from "./PlanosConteudo";

export default function PlanosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1a0f3d 0%, #2D1B69 60%, #3d1f5c 100%)" }}><div className="text-white">Carregando...</div></div>}>
      <PlanosConteudo />
    </Suspense>
  );
}
