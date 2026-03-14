"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const entities = [
  { name: "Galera", icon: "👥", href: "/admin/users", api: "/api/users" },
  { name: "Bolões", icon: "🎲", href: "/admin/pools", api: "/api/pools" },
  { name: "Membros", icon: "🤝", href: "/admin/pool-members", api: "/api/pool-members" },
  { name: "Categorias", icon: "🏆", href: "/admin/categories", api: "/api/categories" },
  { name: "Apostas", icon: "🎯", href: "/admin/bets", api: "/api/bets" },
  { name: "Resultados", icon: "⭐", href: "/admin/results", api: "/api/results" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [counts, setCounts] = useState<Record<string, number | null>>({});

  useEffect(() => {
    entities.forEach((entity) => {
      fetch(entity.api)
        .then((res) => res.json())
        .then((data: unknown[]) => {
          setCounts((prev) => ({ ...prev, [entity.api]: data.length }));
        })
        .catch(() => {});
    });
  }, []);

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 bg-oscar-charcoal flex flex-col">
        <div className="p-5 border-b border-oscar-dark-accent">
          <Link href="/admin" className="block">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏆</span>
              <div>
                <h1 className="text-lg font-bold text-oscar-gold">
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
            const count = counts[entity.api];
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
                <span className="flex-1">{entity.name}</span>
                {count != null && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-oscar-gold/25 text-oscar-gold"
                        : "bg-oscar-dark-accent text-oscar-text-on-dark/50"
                    }`}
                  >
                    {count}
                  </span>
                )}
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

      <main className="flex-1 bg-oscar-black p-8">
        {children}
      </main>
    </div>
  );
}
