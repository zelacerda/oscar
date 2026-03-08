"use client";

import { useState } from "react";
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
  GOLD: "bg-yellow-100 text-yellow-800",
  SILVER: "bg-gray-100 text-gray-700",
  BRONZE: "bg-orange-100 text-orange-800",
  BASE: "bg-slate-100 text-slate-700",
};

export default function BetForm({ poolId, categoriesByTier, initialBets }: Props) {
  const [bets, setBets] = useState<Record<string, string>>(initialBets);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const router = useRouter();

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
      router.refresh();
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
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
              <div key={cat.id} className="admin-card p-4">
                <p className="mb-3 text-sm font-semibold text-oscar-text-primary">{cat.name}</p>
                <div className="space-y-2">
                  {cat.nominees.map((nom) => (
                    <label
                      key={nom.id}
                      className="flex cursor-pointer items-start gap-3 rounded-md px-3 py-2 hover:bg-gray-50"
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
                        {nom.name}
                        {nom.movie && (
                          <span className="ml-1 text-xs text-oscar-text-muted">({nom.movie})</span>
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

      {status === "success" && (
        <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800">
          Palpites salvos com sucesso!
        </div>
      )}

      {status === "error" && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
          Erro ao salvar palpites. Tente novamente.
        </div>
      )}

      <div className="flex justify-end">
        <button type="submit" className="admin-btn-primary" disabled={saving}>
          {saving ? "Salvando..." : "Salvar Palpites"}
        </button>
      </div>
    </form>
  );
}
