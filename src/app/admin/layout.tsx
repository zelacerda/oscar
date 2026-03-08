"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const entities = [
  { name: "Galera", icon: "👥", href: "/admin/users" },
  { name: "Bolões", icon: "🎲", href: "/admin/pools" },
  { name: "Membros", icon: "🤝", href: "/admin/pool-members" },
  { name: "Categorias", icon: "🏆", href: "/admin/categories" },
  { name: "Indicados", icon: "🎬", href: "/admin/nominees" },
  { name: "Apostas", icon: "🎯", href: "/admin/bets" },
  { name: "Resultados", icon: "⭐", href: "/admin/results" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 bg-oscar-charcoal flex flex-col">
        <div className="p-5 border-b border-oscar-dark-accent">
          <Link href="/admin" className="block">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏆</span>
              <div>
                <h1 className="text-lg font-bold text-oscar-gold" style={{ fontFamily: "Georgia, serif" }}>
                  Oscar Admin
                </h1>
                <p className="text-xs text-oscar-text-on-dark/60">
                  Painel de controle
                </p>
              </div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {entities.map((entity) => {
            const isActive = pathname.startsWith(entity.href);
            return (
              <Link
                key={entity.href}
                href={entity.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-oscar-gold/15 text-oscar-gold font-semibold"
                    : "text-oscar-text-on-dark/70 hover:bg-oscar-dark-accent hover:text-oscar-text-on-dark"
                }`}
              >
                <span className="text-base">{entity.icon}</span>
                {entity.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-oscar-dark-accent">
          <p className="text-xs text-oscar-text-on-dark/40 text-center">
            Oscar 2026
          </p>
        </div>
      </aside>

      <main className="flex-1 bg-oscar-surface p-8">
        {children}
      </main>
    </div>
  );
}
