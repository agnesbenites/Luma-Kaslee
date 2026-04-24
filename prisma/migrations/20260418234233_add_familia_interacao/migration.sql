/*
  Warnings:

  - You are about to drop the column `areaAffinidade` on the `PerfilCognitivo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cnpj]` on the table `Escola` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Escola" ADD COLUMN     "cnpj" TEXT;

-- AlterTable
ALTER TABLE "PerfilCognitivo" DROP COLUMN "areaAffinidade",
ADD COLUMN     "areaAfinidade" TEXT;

-- CreateTable
CREATE TABLE "Familia" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "turmaId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Familia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interacao" (
    "id" TEXT NOT NULL,
    "pergunta" TEXT NOT NULL,
    "resposta" TEXT,
    "turno" INTEGER NOT NULL,
    "tempoMs" INTEGER,
    "alunoId" TEXT NOT NULL,
    "sessaoId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Familia_email_key" ON "Familia"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Escola_cnpj_key" ON "Escola"("cnpj");

-- AddForeignKey
ALTER TABLE "Familia" ADD CONSTRAINT "Familia_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Familia" ADD CONSTRAINT "Familia_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "Turma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interacao" ADD CONSTRAINT "Interacao_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interacao" ADD CONSTRAINT "Interacao_sessaoId_fkey" FOREIGN KEY ("sessaoId") REFERENCES "Sessao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
