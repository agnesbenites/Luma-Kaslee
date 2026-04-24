import { defineConfig, env } from "@prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx ts-node prisma/seed.ts", // Adicione o npx aqui
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});