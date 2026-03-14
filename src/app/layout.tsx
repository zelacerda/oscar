import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./providers";
import Link from "next/link";
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
              <Link href="/" className="gold-gradient-text font-futura text-lg font-bold tracking-tight">Bolão do Oscar</Link>
              <UserMenu />
            </header>
          )}
          {children}
        </Providers>
      </body>
    </html>
  );
}
