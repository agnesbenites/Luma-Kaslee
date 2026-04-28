import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const LIMITE_MINUTOS_DIA = 60;

export async function verificarTempoNova(alunoId: string): Promise<{
  permitido: boolean;
  minutosUsados: number;
  minutosRestantes: number;
}> {
  const hoje = new Date().toISOString().split("T")[0];
  const chave = `nova:tempo:${alunoId}:${hoje}`;

  const minutosUsados = (await redis.get<number>(chave)) ?? 0;
  const minutosRestantes = Math.max(0, LIMITE_MINUTOS_DIA - minutosUsados);

  return {
    permitido: minutosUsados < LIMITE_MINUTOS_DIA,
    minutosUsados,
    minutosRestantes,
  };
}

export async function registrarTempoNova(alunoId: string, minutos: number) {
  const hoje = new Date().toISOString().split("T")[0];
  const chave = `nova:tempo:${alunoId}:${hoje}`;

  await redis.incrby(chave, minutos);
  await redis.expire(chave, 60 * 60 * 48);
}

export async function tempoRestanteNova(alunoId: string): Promise<number> {
  const { minutosRestantes } = await verificarTempoNova(alunoId);
  return minutosRestantes;
}
