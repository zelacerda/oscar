"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Nominee = { id: string; name: string; movie: string };
type Category = { id: string; name: string; nominees: Nominee[] };
type TierGroup = { tier: string; label: string; points: number; categories: Category[] };

type Props = {
  poolId: string;
  categoriesByTier: TierGroup[];
  initialBets: Record<string, string>;
};

const TIER_BADGE_CLASS: Record<string, string> = {
  GOLD: "bg-yellow-900/40 text-oscar-gold-light border border-oscar-gold/30",
  SILVER: "bg-gray-800/50 text-gray-300 border border-gray-600/30",
  BRONZE: "bg-orange-900/40 text-orange-300 border border-orange-600/30",
  BASE: "bg-slate-800/50 text-slate-300 border border-slate-600/30",
};

export default function BetForm({ poolId, categoriesByTier, initialBets }: Props) {
  const [bets, setBets] = useState<Record<string, string>>(initialBets);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const router = useRouter();

  const totalCategories = useMemo(
    () => categoriesByTier.reduce((sum, g) => sum + g.categories.length, 0),
    [categoriesByTier],
  );

  const filledCount = useMemo(
    () => categoriesByTier.reduce((sum, g) => sum + g.categories.filter((c) => bets[c.id]).length, 0),
    [categoriesByTier, bets],
  );

  const isFirstTime = Object.keys(initialBets).length === 0;

  const isSaveDisabled = saving || (isFirstTime && filledCount < totalCategories);

  function handleSelect(categoryId: string, nomineeId: string) {
    setBets((prev) => ({ ...prev, [categoryId]: nomineeId }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");

    const payload = Object.entries(bets).map(([categoryId, nomineeId]) => ({
      categoryId,
      nomineeId,
    }));

    try {
      const res = await fetch(`/api/pools/${poolId}/bets`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erro ao salvar");
      setStatus("success");
      router.push(`/pools/${poolId}`);
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="sticky top-0 z-10 mb-6 flex items-center justify-between rounded-md border border-oscar-border-gold bg-oscar-surface-elevated px-4 py-3 shadow-sm">
        <span className="text-sm text-oscar-text-secondary">
          {filledCount} / {totalCategories} categorias preenchidas
        </span>
        <button type="submit" className="admin-btn-primary disabled:cursor-not-allowed disabled:opacity-40" disabled={isSaveDisabled}>
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </div>

      {categoriesByTier.map(({ tier, label, points, categories }) => (
        <section key={tier} className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <h2 className="admin-heading text-base">{label}</h2>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${TIER_BADGE_CLASS[tier]}`}
            >
              {points} pt{points !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="space-y-4">
            {categories.map((cat) => (
              <div key={cat.id} className="gala-card p-4">
                <p className="mb-3 text-sm font-semibold text-oscar-text-primary">{cat.name}</p>
                <div className="space-y-2">
                  {cat.nominees.map((nom) => (
                    <label
                      key={nom.id}
                      className="flex cursor-pointer items-start gap-3 rounded-md px-3 py-2 hover:bg-oscar-gold-subtle"
                    >
                      <input
                        type="radio"
                        name={cat.id}
                        value={nom.id}
                        checked={bets[cat.id] === nom.id}
                        onChange={() => handleSelect(cat.id, nom.id)}
                        className="mt-0.5 accent-oscar-gold"
                      />
                      <span className="text-sm text-oscar-text-primary">
                        {nom.movie ? (
                          <>
                            {nom.movie}
                            <span className="ml-1 text-xs text-oscar-text-secondary">({nom.name})</span>
                          </>
                        ) : (
                          nom.name
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {status === "error" && (
        <div className="mb-4 rounded-md bg-oscar-danger-light px-4 py-3 text-sm text-oscar-danger">
          Erro ao salvar palpites. Tente novamente.
        </div>
      )}
    </form>
  );
}
