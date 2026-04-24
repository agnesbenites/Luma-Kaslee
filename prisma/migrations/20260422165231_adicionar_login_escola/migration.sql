/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Escola` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Escola` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senhaHash` to the `Escola` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Aluno" ADD COLUMN     "consentimentoLgpd" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "responsavelEmail" TEXT,
ADD COLUMN     "responsavelNome" TEXT;

-- AlterTable
ALTER TABLE "Escola" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "senhaHash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Escola_email_key" ON "Escola"("email");
