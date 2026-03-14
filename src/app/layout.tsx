import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./providers";
import UserMenu from "@/components/user-menu";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oscar",
  description: "Bolões do Oscar entre amigos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <header className="flex items-center justify-between border-b border-oscar-border-gold bg-oscar-charcoal px-6 py-3">
            <span className="gold-gradient-text text-lg font-bold tracking-tight">Bolão do Oscar 2026</span>
            <UserMenu />
          </header>
          {children}
        </Providers>
      </body>
    </html>
  );
}
