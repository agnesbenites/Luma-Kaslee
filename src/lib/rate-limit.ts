import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 15 mensagens por minuto por aluno
export const rateLimitChat = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(15, "1 m"),
  analytics: true,
});

// 100 requisições por minuto para APIs gerais
export const rateLimitGeral = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"),
  analytics: true,
});

// 60 minutos de Nova por dia por aluno
export const rateLimitNova = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(60, "24 h"),
  analytics: true,
});
