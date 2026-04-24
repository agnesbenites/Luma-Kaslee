/*
  Warnings:

  - You are about to drop the column `pergunta` on the `Interacao` table. All the data in the column will be lost.
  - You are about to drop the column `resposta` on the `Interacao` table. All the data in the column will be lost.
  - You are about to drop the column `tempoMs` on the `Interacao` table. All the data in the column will be lost.
  - You are about to drop the column `turno` on the `Interacao` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[alunoId,sessaoId]` on the table `Interacao` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Interacao" DROP COLUMN "pergunta",
DROP COLUMN "resposta",
DROP COLUMN "tempoMs",
DROP COLUMN "turno",
ADD COLUMN     "historico" TEXT,
ADD COLUMN     "resumo" TEXT;

-- AlterTable
ALTER TABLE "Sessao" ADD COLUMN     "metodo" TEXT NOT NULL DEFAULT 'SOCRATICO',
ADD COLUMN     "metodoJustificativa" TEXT,
ALTER COLUMN "status" SET DEFAULT 'RASCUNHO';

-- CreateTable
CREATE TABLE "ProgressoHabilidade" (
    "id" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "habilidadeId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NAO_INICIADA',
    "evidencias" INTEGER NOT NULL DEFAULT 0,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgressoHabilidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AtividadeAgendada" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "data" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PLANEJADA',
    "turmaId" TEXT NOT NULL,
    "professorId" TEXT NOT NULL,
    "sessaoId" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AtividadeAgendada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GradeHoraria" (
    "id" TEXT NOT NULL,
    "turmaId" TEXT NOT NULL,
    "diaSemana" INTEGER NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFim" TEXT NOT NULL,
    "componente" TEXT NOT NULL,
    "fixo" BOOLEAN NOT NULL DEFAULT true,
    "sessaoId" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GradeHoraria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProgressoHabilidade_alunoId_habilidadeId_key" ON "ProgressoHabilidade"("alunoId", "habilidadeId");

-- CreateIndex
CREATE UNIQUE INDEX "Interacao_alunoId_sessaoId_key" ON "Interacao"("alunoId", "sessaoId");

-- AddForeignKey
ALTER TABLE "ProgressoHabilidade" ADD CONSTRAINT "ProgressoHabilidade_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressoHabilidade" ADD CONSTRAINT "ProgressoHabilidade_habilidadeId_fkey" FOREIGN KEY ("habilidadeId") REFERENCES "HabilidadeBNCC"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtividadeAgendada" ADD CONSTRAINT "AtividadeAgendada_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "Turma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtividadeAgendada" ADD CONSTRAINT "AtividadeAgendada_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtividadeAgendada" ADD CONSTRAINT "AtividadeAgendada_sessaoId_fkey" FOREIGN KEY ("sessaoId") REFERENCES "Sessao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeHoraria" ADD CONSTRAINT "GradeHoraria_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "Turma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeHoraria" ADD CONSTRAINT "GradeHoraria_sessaoId_fkey" FOREIGN KEY ("sessaoId") REFERENCES "Sessao"("id") ON DELETE SET NULL ON UPDATE CASCADE;
