import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRECOS: Record<string, string> = {
  STARTER: process.env.STRIPE_PRICE_STARTER!,
  PRO: process.env.STRIPE_PRICE_PRO!,
  ILIMITADO: process.env.STRIPE_PRICE_ILIMITADO!,
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { plano } = await req.json();
  const priceId = PRECOS[plano];
  if (!priceId) return NextResponse.json({ error: "Plano inválido." }, { status: 400 });

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    locale: "pt-BR",
    currency: "brl",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/dashboard/professor-privado?plano=ativo`,
    cancel_url: `${baseUrl}/planos?cancelado=true`,
    metadata: {
      userId: (session.user as any).id,
      plano,
      tipo: "PROFESSOR_PRIVADO",
    },
  });

  return NextResponse.json({ url: checkout.url });
}
