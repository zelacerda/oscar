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
  const [globalLock, setGlobalLock] = useState<boolean | null>(null);
  const [lockLoading, setLockLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/global-lock")
      .then((res) => res.json())
      .then((data: { globalLock: boolean }) => setGlobalLock(data.globalLock))
      .catch(() => setGlobalLock(false));

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

      {/* Global Lock */}
      <div className="gala-card mb-8 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-oscar-text-primary">
              Controle Global de Votações
            </h3>
            <p className="mt-1 text-xs text-oscar-text-secondary">
              {globalLock === null
                ? "Carregando..."
                : globalLock
                  ? "Todas as votações estão encerradas. Nenhum bolão pode receber apostas."
                  : "Votações abertas. Cada dono de bolão controla seu próprio bolão."}
            </p>
          </div>
          <button
            disabled={globalLock === null || lockLoading}
            onClick={async () => {
              setLockLoading(true);
              try {
                const res = await fetch("/api/admin/global-lock", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ globalLock: !globalLock }),
                });
                if (res.ok) {
                  const data = await res.json();
                  setGlobalLock(data.globalLock);
                }
              } finally {
                setLockLoading(false);
              }
            }}
            className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition ${
              globalLock
                ? "bg-green-700 text-white hover:bg-green-600"
                : "bg-oscar-danger text-white hover:bg-red-700"
            } disabled:opacity-50`}
          >
            {lockLoading
              ? "..."
              : globalLock
                ? "Reabrir Votações"
                : "Encerrar Todas"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className="gala-card p-5 cursor-pointer group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs font-medium text-oscar-text-secondary uppercase tracking-wide">
                  {item.label}
                </span>
              </div>
              <div className="text-3xl font-bold text-oscar-gold-light">
                {item.count === null ? (
                  <span className="inline-block w-10 h-8 bg-oscar-border rounded animate-pulse" />
                ) : (
                  item.count
                )}
              </div>
              <p className="text-xs text-oscar-text-secondary mt-1">
                registros cadastrados
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
