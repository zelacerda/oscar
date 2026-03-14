"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CategoryInfo = { id: string; name: string; tier: string };
type TierGroup = {
  tier: string;
  label: string;
  defaultPoints: number;
  categories: CategoryInfo[];
};

type Props = {
  categoriesByTier: TierGroup[];
};

const TIER_BADGE_CLASS: Record<string, string> = {
  GOLD: "bg-yellow-900/40 text-oscar-gold-light border border-oscar-gold/30",
  SILVER: "bg-gray-800/50 text-gray-300 border border-gray-600/30",
  BRONZE: "bg-orange-900/40 text-orange-300 border border-orange-600/30",
  BASE: "bg-slate-800/50 text-slate-300 border border-slate-600/30",
};

export default function CreatePoolForm({ categoriesByTier }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Initialize: all categories selected with default points
  const [selected, setSelected] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    for (const group of categoriesByTier) {
      for (const cat of group.categories) {
        map[cat.id] = true;
      }
    }
    return map;
  });

  const [points, setPoints] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    for (const group of categoriesByTier) {
      for (const cat of group.categories) {
        map[cat.id] = group.defaultPoints;
      }
    }
    return map;
  });

  const selectedCount = Object.values(selected).filter(Boolean).length;

  function toggleCategory(id: string) {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleAllInTier(tier: TierGroup) {
    const allSelected = tier.categories.every((c) => selected[c.id]);
    setSelected((prev) => {
      const next = { ...prev };
      for (const cat of tier.categories) {
        next[cat.id] = !allSelected;
      }
      return next;
    });
  }

  function setTierPoints(tier: TierGroup, value: number) {
    setPoints((prev) => {
      const next = { ...prev };
      for (const cat of tier.categories) {
        next[cat.id] = value;
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nome do bolão é obrigatório");
      return;
    }
    if (selectedCount === 0) {
      setError("Selecione pelo menos uma categoria");
      return;
    }

    setSaving(true);
    setError("");

    const categories = Object.entries(selected)
      .filter(([, isSelected]) => isSelected)
      .map(([categoryId]) => ({
        categoryId,
        points: points[categoryId],
      }));

    try {
      const res = await fetch("/api/pools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), categories }),
      });

      if (!res.ok) throw new Error("Erro ao criar bolão");

      const pool = await res.json();
      router.push(`/pools/${pool.id}`);
    } catch {
      setError("Erro ao criar bolão. Tente novamente.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Nome do bolão */}
      <div className="gala-card mb-6 p-4">
        <label className="mb-2 block text-sm font-semibold text-oscar-text-primary">
          Nome do bolão
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Bolão da Família"
          className="w-full rounded-md border border-oscar-border bg-oscar-charcoal px-3 py-2 text-sm text-oscar-text-primary placeholder:text-oscar-text-muted focus:border-oscar-gold focus:outline-none"
        />
      </div>

      {/* Categorias por tier */}
      {categoriesByTier.map((group) => {
        const allSelected = group.categories.every((c) => selected[c.id]);
        const currentTierPoints = points[group.categories[0]?.id] ?? group.defaultPoints;

        return (
          <section key={group.tier} className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="admin-heading text-base">{group.label}</h2>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${TIER_BADGE_CLASS[group.tier]}`}
                >
                  {group.categories.length} categoria{group.categories.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs text-oscar-text-secondary">
                  Pontos:
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={currentTierPoints}
                    onChange={(e) => setTierPoints(group, Number(e.target.value) || 1)}
                    className="w-14 rounded border border-oscar-border bg-oscar-charcoal px-2 py-1 text-center text-xs text-oscar-text-primary focus:border-oscar-gold focus:outline-none"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => toggleAllInTier(group)}
                  className="text-xs text-oscar-gold-light hover:underline"
                >
                  {allSelected ? "Desmarcar todas" : "Marcar todas"}
                </button>
              </div>
            </div>

            <div className="gala-card divide-y divide-oscar-border">
              {group.categories.map((cat) => (
                <label
                  key={cat.id}
                  className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-oscar-gold-subtle"
                >
                  <input
                    type="checkbox"
                    checked={selected[cat.id] ?? false}
                    onChange={() => toggleCategory(cat.id)}
                    className="accent-oscar-gold"
                  />
                  <span className="text-sm text-oscar-text-primary">{cat.name}</span>
                </label>
              ))}
            </div>
          </section>
        );
      })}

      {error && (
        <div className="mb-4 rounded-md bg-oscar-danger-light px-4 py-3 text-sm text-oscar-danger">
          {error}
        </div>
      )}

      <div className="sticky bottom-4 flex items-center justify-between rounded-md border border-oscar-border-gold bg-oscar-surface-elevated px-4 py-3 shadow-sm">
        <span className="text-sm text-oscar-text-secondary">
          {selectedCount} categoria{selectedCount !== 1 ? "s" : ""} selecionada{selectedCount !== 1 ? "s" : ""}
        </span>
        <button
          type="submit"
          disabled={saving || !name.trim() || selectedCount === 0}
          className="admin-btn-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? "Criando..." : "Criar Bolão"}
        </button>
      </div>
    </form>
  );
}
