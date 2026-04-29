import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).role !== "PROFESSOR_PRIVADO") {
    return NextResponse.redirect("/login");
  }

  const professorId = (session.user as any).id;
  const professor = await prisma.professorPrivado.findUnique({ where: { id: professorId } });

  if (!professor?.stripeCustomerId) {
    return NextResponse.redirect("/planos");
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: professor.stripeCustomerId,
    return_url: `${process.env.NEXTAUTH_URL}/dashboard/professor-privado/assinatura`,
  });

  return NextResponse.redirect(portalSession.url);
}
