"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type DashboardStats = {
  label: string;
  icon: string;
  href: string;
  count: number | null;
};

const dashboardItems: Omit<DashboardStats, "count">[] = [
  { label: "Galera", icon: "👥", href: "/admin/users" },
  { label: "Bolões", icon: "🎲", href: "/admin/pools" },
  { label: "Categorias", icon: "🏆", href: "/admin/categories" },
  { label: "Apostas", icon: "🎯", href: "/admin/bets" },
  { label: "Resultados", icon: "⭐", href: "/admin/results" },
];

const apiMap: Record<string, string> = {
  "Galera": "/api/users",
  "Bolões": "/api/pools",
  "Categorias": "/api/categories",
  "Apostas": "/api/bets",
  "Resultados": "/api/results",
};

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats[]>(
    dashboardItems.map((item) => ({ ...item, count: null }))
  );

  useEffect(() => {
    dashboardItems.forEach((item, index) => {
      fetch(apiMap[item.label])
        .then((res) => res.json())
        .then((data: unknown[]) => {
          setStats((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], count: data.length };
            return next;
          });
        })
        .catch(() => {
          setStats((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], count: 0 };
            return next;
          });
        });
    });
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h2 className="admin-heading text-3xl mb-2">Painel de Controle</h2>
        <p className="text-oscar-text-secondary">
          Bem-vindo ao admin do Oscar! Aqui você gerencia tudo do bolão.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className="admin-card p-5 hover:border-oscar-gold/30 transition-all hover:shadow-md cursor-pointer group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs font-medium text-oscar-text-muted uppercase tracking-wide">
                  {item.label}
                </span>
              </div>
              <div className="text-3xl font-bold text-oscar-charcoal">
                {item.count === null ? (
                  <span className="inline-block w-10 h-8 bg-oscar-border rounded animate-pulse" />
                ) : (
                  item.count
                )}
              </div>
              <p className="text-xs text-oscar-text-muted mt-1">
                registros cadastrados
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
