import { redirect } from "next/navigation";

export default function EscolaPage() {
  // Como esta é a página raiz da pasta 'escola', 
  // ela apenas redireciona para a subpasta principal 'visao-geral'.
  redirect("/dashboard/escola/visao-geral");
  
  return null;
}