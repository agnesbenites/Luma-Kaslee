import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Luma — Aprendizado Socrático",
  description: "A Luma não tem opinião. Ela te ajuda a ter a sua.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={geist.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}