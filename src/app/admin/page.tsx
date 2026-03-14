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
  const [finalize, setFinalize] = useState<{ isFinalized: boolean; canFinalize: boolean } | null>(null);
  const [finalizeLoading, setFinalizeLoading] = useState(false);
  const [showFinalizeConfirm, setShowFinalizeConfirm] = useState(false);

  useEffect(() => {
    fetch("/api/admin/global-lock")
      .then((res) => res.json())
      .then((data: { globalLock: boolean }) => setGlobalLock(data.globalLock))
      .catch(() => setGlobalLock(false));

    fetch("/api/admin/finalize")
      .then((res) => res.json())
      .then((data: { isFinalized: boolean; canFinalize: boolean }) => setFinalize(data))
      .catch(() => setFinalize({ isFinalized: false, canFinalize: false }));

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

      {/* Finalize Pools */}
      {finalize && (finalize.canFinalize || finalize.isFinalized) && (
        <div className="gala-card mb-8 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-oscar-text-primary">
                Finalizar Bolões
              </h3>
              <p className="mt-1 text-xs text-oscar-text-secondary">
                {finalize.isFinalized
                  ? "Os bolões foram finalizados! Os vencedores já estão declarados."
                  : "Todos os resultados foram registrados. Você pode declarar os vencedores dos bolões."}
              </p>
            </div>
            <button
              disabled={finalizeLoading}
              onClick={() => setShowFinalizeConfirm(true)}
              className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${
                finalize.isFinalized
                  ? "bg-green-700 text-white hover:bg-green-600"
                  : "bg-oscar-gold text-oscar-dark hover:bg-oscar-gold-light"
              }`}
            >
              {finalizeLoading ? "..." : finalize.isFinalized ? "Reabrir Bolões" : "Declarar Vencedores"}
            </button>
          </div>

          {/* Confirmation dialog */}
          {showFinalizeConfirm && (
            <div className="mt-4 rounded-md border border-oscar-gold/30 bg-oscar-gold/10 p-4">
              <p className="text-sm text-oscar-text-primary font-medium mb-3">
                {finalize.isFinalized
                  ? "Reabrir os bolões?"
                  : "Declarar os vencedores?"}
              </p>
              <p className="text-xs text-oscar-text-secondary mb-4">
                {finalize.isFinalized
                  ? "Isso irá impactar os resultados de todos os bolões. Os vencedores deixarão de ser exibidos como finais."
                  : "Isso irá impactar os resultados de todos os bolões. Os vencedores serão declarados oficialmente."}
              </p>
              <div className="flex gap-3">
                <button
                  disabled={finalizeLoading}
                  onClick={async () => {
                    setFinalizeLoading(true);
                    try {
                      const res = await fetch("/api/admin/finalize", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ isFinalized: !finalize.isFinalized }),
                      });
                      if (res.ok) {
                        const data = await res.json();
                        setFinalize(data);
                      }
                    } finally {
                      setFinalizeLoading(false);
                      setShowFinalizeConfirm(false);
                    }
                  }}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${
                    finalize.isFinalized
                      ? "bg-green-700 text-white hover:bg-green-600"
                      : "bg-oscar-gold text-oscar-dark hover:bg-oscar-gold-light"
                  }`}
                >
                  {finalizeLoading
                    ? "..."
                    : finalize.isFinalized
                      ? "Confirmar Reabertura"
                      : "Confirmar Finalização"}
                </button>
                <button
                  onClick={() => setShowFinalizeConfirm(false)}
                  className="rounded-md border border-oscar-border px-4 py-2 text-sm font-medium text-oscar-text-secondary hover:text-oscar-text-primary transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

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
