import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./providers";
import Link from "next/link";
import Image from "next/image";
import UserMenu from "@/components/user-menu";
import { auth } from "@/lib/auth";
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
  title: "Bolão do Oscar",
  description: "Bolões do Oscar entre amigos",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {isLoggedIn && (
            <header className="flex items-center justify-between border-b border-oscar-border-gold bg-oscar-charcoal px-6 py-3">
              <Link href="/" className="flex items-center gap-2 gold-shimmer-text font-futura text-lg font-bold tracking-tight">
                <Image src="/favicon.ico" alt="" width={20} height={20} className="inline-block" />
                Bolão do Oscar
              </Link>
              <UserMenu />
            </header>
          )}
          {children}
          {isLoggedIn && (
            <footer className="py-4 text-center text-xs text-oscar-gold/40">
              V. 2026 — Por{" "}
              <a href="https://github.com/zelacerda" target="_blank" rel="noopener noreferrer" className="underline hover:text-oscar-gold/60">zelacerda</a>
              {" "}+{" "}
              <a href="https://claude.com/product/claude-code" target="_blank" rel="noopener noreferrer" className="underline hover:text-oscar-gold/60">Claude Code</a>
              {" "}— 100%{" "}
              <a href="https://github.com/zelacerda/oscar" target="_blank" rel="noopener noreferrer" className="underline hover:text-oscar-gold/60">Open Source</a>
            </footer>
          )}
        </Providers>
      </body>
    </html>
  );
}
