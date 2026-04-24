import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { titulo, ancora, serie } = await req.json();

  if (!titulo || !ancora) {
    return NextResponse.json({ error: "Título e âncora obrigatórios" }, { status: 400 });
  }

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content: `Você é um especialista em pedagogia. Analise o tema e a âncora fornecidos e sugira o método pedagógico mais eficaz para uma sessão com a IA tutora Luma.

Métodos disponíveis:
- SOCRATICO: Ideal para conceitos abstratos, filosofia, definições, ética. A Luma nunca dá respostas, só faz perguntas que provocam descoberta.
- SCAFFOLDING: Ideal para processos complexos, matemática, ciências, biologia. A Luma dá suporte gradual e vai retirando conforme o aluno avança.
- PBL: Ideal para problemas reais, casos práticos, situações do cotidiano. A Luma apresenta um problema e desafia cada solução proposta.
- REFLEXIVO: Ideal para interpretação de texto, arte, emoções, alunos com bloqueio. A Luma acolhe e faz o aluno verbalizar o que já sabe.
- DEBATE: Ideal para temas sem resposta única, história, sociologia, política. A Luma assume posição contrária e força argumentação.

Responda APENAS em JSON válido neste formato:
{"metodo": "SOCRATICO", "justificativa": "explicação curta em 1 frase para o professor"}`,
      },
      {
        role: "user",
        content: `Tema: "${titulo}"\nÂncora: "${ancora}"\nSérie: "${serie ?? "não informada"}"`,
      },
    ],
  });

  try {
    const content = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ metodo: "SOCRATICO", justificativa: "Método padrão aplicado." });
  }
}