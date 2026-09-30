import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/lib/context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mi jornada — Justicia Cercana | Juzgado de Paz Rural",
  description:
    "Prototipo web interactivo e inmersivo para jueza de paz rural en tableta de 10 pulgadas con funcionamiento offline y sincronización",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-stone-950 text-stone-100">
        <TooltipProvider>
          <AppProvider>{children}</AppProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
