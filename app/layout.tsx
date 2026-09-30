import type { Metadata } from "next";
import { DM_Sans, Lora } from "next/font/google";
import "./globals.css";
const sans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });
const serif = Lora({ variable: "--font-lora", subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Mi jornada — Justicia cercana",
  description:
    "Una jornada en el juzgado de paz. Escucha, registra y acompaña a tu comunidad, incluso sin conexión.",
};
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${sans.variable} ${serif.variable} h-full antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
