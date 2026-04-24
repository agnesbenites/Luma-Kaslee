import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const senha = await bcrypt.hash("123456", 10);

  console.log("🚀 Iniciando Seed Kaslee...");

  // 1. Escola (Agora com email e senhaHash para login)
  const escola = await prisma.escola.upsert({
    where: { cnpj: "00.000.000/0001-00" },
    update: {
      email: "diretoria@escola.com",
      senhaHash: senha,
    },
    create: {
      nome: "Escola Kaslee",
      email: "diretoria@escola.com", // Login da escola
      senhaHash: senha,
      cnpj: "00.000.000/0001-00",
      cidade: "São Paulo",
      estado: "SP",
    },
  });

  // 2. Professor
  const professor = await prisma.professor.upsert({
    where: { email: "professor@kaslee.com" },
    update: {},
    create: {
      nome: "Agnes Professora",
      email: "professor@kaslee.com",
      senhaHash: senha,
    },
  });

  // 3. Turma
  const turma = await prisma.turma.upsert({
    where: { id: "turma-seed-01" },
    update: {},
    create: {
      id: "turma-seed-01",
      nome: "9º A",
      serie: "9º ano",
      turno: "Manhã",
      escolaId: escola.id,
      professorId: professor.id,
    },
  });

  // 4. Alunos (Adicionando campos de consentimento e responsáveis)
  const dadosAlunos = [
    { nome: "Ana Souza", email: "ana@kaslee.com", tipo: "analitico", foco: 0.87, sinal: "neutro", consentimento: true },
    { nome: "Bruno Lima", email: "bruno@kaslee.com", tipo: "narrativo", foco: 0.52, sinal: "atencao", consentimento: false },
    { nome: "Carla Dias", email: "carla@kaslee.com", tipo: "misto", foco: 0.71, sinal: "neutro", consentimento: true },
    { nome: "Diego Mota", email: "diego@kaslee.com", tipo: "analitico", foco: 0.34, sinal: "alerta", consentimento: false },
  ];

  const alunos = [];
  for (const a of dadosAlunos) {
    const aluno = await prisma.aluno.upsert({
      where: { email: a.email },
      update: {
        consentimentoLgpd: a.consentimento,
      },
      create: {
        nome: a.nome,
        email: a.email,
        senhaHash: senha,
        turmaId: turma.id,
        consentimentoLgpd: a.consentimento,
        responsavelNome: `Pai/Mãe de ${a.nome}`,
        responsavelEmail: `responsavel.${a.email}`,
      },
    });
    alunos.push({ ...aluno, tipo: a.tipo, foco: a.foco, sinal: a.sinal });
  }

  // 5. Sessão
  const sessao = await prisma.sessao.upsert({
    where: { id: "sessao-seed-01" },
    update: {},
    create: {
      id: "sessao-seed-01",
      titulo: "O que é justiça?",
      ancora: "Leitura do capítulo 3 do livro didático.",
      status: "ativa",
      turmaId: turma.id,
    },
  });

  // 6. Perfis cognitivos
  for (const aluno of alunos) {
    await prisma.perfilCognitivo.upsert({
      where: { alunoId: aluno.id },
      update: {},
      create: {
        alunoId: aluno.id,
        tipoRaciocinio: aluno.tipo,
        indiceFoco: aluno.foco,
        alertaAtivo: aluno.sinal === "alerta",
      },
    });
  }

  console.log("✅ Seed completo!");
  console.log("-----------------------------------------");
  console.log("🏫 ESCOLA: diretoria@escola.com / 123456");
  console.log("👩‍🏫 PROFESSOR: professor@kaslee.com / 123456");
  console.log("-----------------------------------------");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });