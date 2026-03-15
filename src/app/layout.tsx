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
            <header className="sticky top-0 z-50 grid grid-cols-3 items-center border-b border-oscar-border-gold bg-oscar-charcoal px-6 py-3">
              <Link href="/" className="justify-self-start">
                <svg viewBox="0 0 53 58" width={26} height={28} aria-hidden="true">
                  <defs>
                    <linearGradient id="oscar-gold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D4AF37" />
                      <stop offset="100%" stopColor="#B8960C" />
                    </linearGradient>
                  </defs>
                  <path d="M26.5008 0C17.6402 19.3895 8.82658 38.6651 0 58H16.8565L19.0279 53.0847C19.7712 53.0847 20.4707 53.0659 21.167 53.0847C21.5361 53.0987 21.792 53.0175 21.9669 52.6818C22.0476 52.5203 22.173 52.3833 22.3293 52.286C22.4856 52.1888 22.6667 52.135 22.8526 52.1307C23.2962 52.102 23.7379 52.0499 24.1756 51.9745C25.0257 51.8184 25.2702 51.5061 25.2993 50.6708C25.3366 49.6527 25.1584 48.6581 24.9755 47.6651C24.7585 46.4846 24.5447 45.298 24.7245 44.0988C24.8427 43.3181 24.7148 42.5842 24.5075 41.8348C24.3321 41.2039 24.2087 40.5607 24.1383 39.9111C23.9954 38.6173 24.1053 37.3092 24.4622 36.0544L24.1804 35.9498C23.6784 35.7624 23.3368 35.4548 23.2218 34.9162C23.089 34.2916 22.8785 33.6858 22.7571 33.0628C22.5952 32.2384 22.3992 31.4155 22.4996 30.5645C22.5676 29.9884 22.7911 29.5168 23.3675 29.267C23.6914 29.128 24.0153 29.0297 24.3391 28.8766C24.6324 28.7444 24.905 28.5731 25.1487 28.3676C25.4726 28.0663 25.6102 27.6634 25.3932 27.245C25.0694 26.6345 25.0435 25.9958 25.0694 25.3307C25.0748 24.9807 25.2207 24.6463 25.4765 24.3979C25.7322 24.1495 26.078 24.0065 26.4409 23.9988C26.8021 23.9868 27.155 24.1046 27.4312 24.3293C27.7074 24.5541 27.8871 24.8698 27.9355 25.2151C28.006 25.8694 27.9092 26.5304 27.6537 27.1404C27.3849 27.7556 27.508 28.2333 28.0877 28.5925C28.4228 28.7791 28.7765 28.9329 29.1434 29.0515C30.136 29.4106 30.5101 29.8916 30.5085 30.9002C30.5085 32.3945 30.081 33.8185 29.6486 35.2347C29.5774 35.4689 29.2957 35.6594 29.0771 35.8311C28.9184 35.9273 28.7467 36.0019 28.567 36.0529C28.6722 36.7009 28.805 37.3239 28.8714 37.9515C29 39.3339 28.8477 40.7272 28.4229 42.0534C28.2274 42.7194 28.1723 43.4165 28.2609 44.1035C28.3298 44.7738 28.3298 45.449 28.2609 46.1193C28.1913 46.8422 27.9841 47.5526 27.8999 48.2756C27.7995 49.1281 27.7379 49.9931 27.7136 50.8441C27.6991 51.5264 27.9322 51.7809 28.635 51.9371C28.9752 52.0087 29.3216 52.05 29.6697 52.0604C30.2802 52.0901 30.8275 52.2165 31.1157 52.8099C31.2355 53.0566 31.4509 53.08 31.6986 53.0769C32.4354 53.0769 33.1722 53.0769 33.9526 53.0769C34.6991 54.7585 35.4229 56.3855 36.137 57.9953H53C44.1686 38.6745 35.363 19.3974 26.5008 0Z" fill="url(#oscar-gold)" />
                </svg>
              </Link>
              <span className="justify-self-center gold-shimmer-text font-futura text-xl font-bold tracking-tight whitespace-nowrap">
                Bolão do Oscar 2026
              </span>
              <div className="justify-self-end">
                <UserMenu />
              </div>
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
