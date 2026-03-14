"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

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

const TIERS = ["GOLD", "SILVER", "BRONZE", "BASE"] as const;
const TIER_LABEL: Record<string, string> = {
  GOLD: "Ouro",
  SILVER: "Prata",
  BRONZE: "Bronze",
  BASE: "Base",
};
const TIER_BADGE_CLASS: Record<string, string> = {
  GOLD: "bg-yellow-900/40 text-oscar-gold-light border border-oscar-gold/30",
  SILVER: "bg-gray-800/50 text-gray-300 border border-gray-600/30",
  BRONZE: "bg-orange-900/40 text-orange-300 border border-orange-600/30",
  BASE: "bg-slate-800/50 text-slate-300 border border-slate-600/30",
};
const TIER_DROP_HIGHLIGHT: Record<string, string> = {
  GOLD: "ring-2 ring-oscar-gold/50 bg-yellow-900/20",
  SILVER: "ring-2 ring-gray-400/50 bg-gray-800/20",
  BRONZE: "ring-2 ring-orange-400/50 bg-orange-900/20",
  BASE: "ring-2 ring-slate-400/50 bg-slate-800/20",
};

// Draggable category item
function DraggableCategory({
  cat,
  isSelected,
  onToggle,
  onMove,
  currentTier,
}: {
  cat: CategoryInfo;
  isSelected: boolean;
  onToggle: () => void;
  onMove: (direction: "up" | "down") => void;
  currentTier: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: cat.id,
    data: { tier: currentTier },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const tierIndex = TIERS.indexOf(currentTier as typeof TIERS[number]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 rounded-md border px-3 py-2 transition ${
        isDragging
          ? "z-50 border-oscar-gold bg-oscar-surface-elevated opacity-50"
          : "border-oscar-border bg-oscar-charcoal"
      }`}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggle}
        className="accent-oscar-gold"
      />
      <span
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-oscar-text-muted hover:text-oscar-text-primary"
        title="Arrastar"
      >
        ⠿
      </span>
      <span className="flex-1 text-sm text-oscar-text-primary">{cat.name}</span>
      {/* Arrow buttons for mobile */}
      <div className="flex gap-0.5">
        <button
          type="button"
          disabled={tierIndex === 0}
          onClick={() => onMove("up")}
          className="rounded px-1.5 py-0.5 text-xs text-oscar-text-muted hover:bg-oscar-gold-subtle hover:text-oscar-text-primary disabled:opacity-20"
          title={tierIndex > 0 ? `Mover para ${TIER_LABEL[TIERS[tierIndex - 1]]}` : ""}
        >
          ▲
        </button>
        <button
          type="button"
          disabled={tierIndex === TIERS.length - 1}
          onClick={() => onMove("down")}
          className="rounded px-1.5 py-0.5 text-xs text-oscar-text-muted hover:bg-oscar-gold-subtle hover:text-oscar-text-primary disabled:opacity-20"
          title={tierIndex < TIERS.length - 1 ? `Mover para ${TIER_LABEL[TIERS[tierIndex + 1]]}` : ""}
        >
          ▼
        </button>
      </div>
    </div>
  );
}

// Droppable tier box
function TierBox({
  tier,
  children,
  isOver,
}: {
  tier: string;
  children: React.ReactNode;
  isOver: boolean;
}) {
  const { setNodeRef } = useDroppable({ id: `tier-${tier}`, data: { tier } });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[60px] rounded-lg border border-dashed border-oscar-border p-2 transition ${
        isOver ? TIER_DROP_HIGHLIGHT[tier] : ""
      }`}
    >
      {children}
    </div>
  );
}

export default function CreatePoolForm({ categoriesByTier }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  // Category → tier assignment (mutable by drag)
  const [categoryTier, setCategoryTier] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    for (const group of categoriesByTier) {
      for (const cat of group.categories) {
        map[cat.id] = group.tier;
      }
    }
    return map;
  });

  // Selected state (checkboxes)
  const [selected, setSelected] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    for (const group of categoriesByTier) {
      for (const cat of group.categories) {
        map[cat.id] = true;
      }
    }
    return map;
  });

  // Points per tier
  const [tierPoints, setTierPoints] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    for (const group of categoriesByTier) {
      map[group.tier] = group.defaultPoints;
    }
    return map;
  });

  // All categories flat list
  const allCategories = categoriesByTier.flatMap((g) => g.categories);
  const catMap = new Map(allCategories.map((c) => [c.id, c]));

  const selectedCount = Object.values(selected).filter(Boolean).length;

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor),
  );

  // Track which tier is being hovered
  const [overTier, setOverTier] = useState<string | null>(null);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragOver = useCallback((event: { over: { data?: { current?: { tier?: string } }; id?: string | number } | null }) => {
    if (!event.over) {
      setOverTier(null);
      return;
    }
    // Check if over a tier droppable
    const overData = event.over.data?.current;
    if (overData?.tier) {
      setOverTier(overData.tier);
    } else {
      // Over another category — find its tier
      const overId = event.over.id as string;
      setOverTier(categoryTier[overId] ?? null);
    }
  }, [categoryTier]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveId(null);
    setOverTier(null);

    const { active, over } = event;
    if (!over) return;

    const draggedId = active.id as string;

    // Determine target tier
    let targetTier: string | null = null;
    const overData = over.data?.current as { tier?: string } | undefined;
    if (overData?.tier) {
      targetTier = overData.tier;
    } else {
      // Dropped on another category
      targetTier = categoryTier[over.id as string] ?? null;
    }

    if (targetTier && targetTier !== categoryTier[draggedId]) {
      setCategoryTier((prev) => ({ ...prev, [draggedId]: targetTier }));
    }
  }, [categoryTier]);

  function moveCategory(catId: string, direction: "up" | "down") {
    const currentTier = categoryTier[catId];
    const currentIndex = TIERS.indexOf(currentTier as typeof TIERS[number]);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= TIERS.length) return;
    setCategoryTier((prev) => ({ ...prev, [catId]: TIERS[newIndex] }));
  }

  function toggleCategory(id: string) {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleAllInTier(tier: string) {
    const catsInTier = allCategories.filter((c) => categoryTier[c.id] === tier);
    const allSelected = catsInTier.every((c) => selected[c.id]);
    setSelected((prev) => {
      const next = { ...prev };
      for (const cat of catsInTier) {
        next[cat.id] = !allSelected;
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

    const categories = allCategories
      .filter((c) => selected[c.id])
      .map((c) => ({
        categoryId: c.id,
        tier: categoryTier[c.id],
        points: tierPoints[categoryTier[c.id]] ?? 1,
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

  const activeCat = activeId ? catMap.get(activeId) : null;

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

      <p className="mb-4 text-xs text-oscar-text-secondary">
        Arraste categorias entre os tiers ou use as setas ▲▼ para reorganizar.
      </p>

      {/* Tier boxes with drag and drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {TIERS.map((tier) => {
          const catsInTier = allCategories.filter((c) => categoryTier[c.id] === tier);
          const allTierSelected = catsInTier.length > 0 && catsInTier.every((c) => selected[c.id]);

          return (
            <section key={tier} className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="admin-heading text-base">{TIER_LABEL[tier]}</h2>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${TIER_BADGE_CLASS[tier]}`}
                  >
                    {catsInTier.length} categoria{catsInTier.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-oscar-text-secondary">
                    Pontos:
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={tierPoints[tier] ?? 1}
                      onChange={(e) =>
                        setTierPoints((prev) => ({
                          ...prev,
                          [tier]: Number(e.target.value) || 1,
                        }))
                      }
                      className="w-14 rounded border border-oscar-border bg-oscar-charcoal px-2 py-1 text-center text-xs text-oscar-text-primary focus:border-oscar-gold focus:outline-none"
                    />
                  </label>
                  {catsInTier.length > 0 && (
                    <button
                      type="button"
                      onClick={() => toggleAllInTier(tier)}
                      className="text-xs text-oscar-gold-light hover:underline"
                    >
                      {allTierSelected ? "Desmarcar" : "Marcar todas"}
                    </button>
                  )}
                </div>
              </div>

              <TierBox tier={tier} isOver={overTier === tier && activeId !== null}>
                {catsInTier.length === 0 ? (
                  <p className="py-2 text-center text-xs text-oscar-text-muted">
                    Arraste categorias aqui
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {catsInTier.map((cat) => (
                      <DraggableCategory
                        key={cat.id}
                        cat={cat}
                        isSelected={selected[cat.id] ?? false}
                        onToggle={() => toggleCategory(cat.id)}
                        onMove={(dir) => moveCategory(cat.id, dir)}
                        currentTier={tier}
                      />
                    ))}
                  </div>
                )}
              </TierBox>
            </section>
          );
        })}

        <DragOverlay>
          {activeCat ? (
            <div className="rounded-md border border-oscar-gold bg-oscar-surface-elevated px-3 py-2 shadow-lg">
              <span className="text-sm font-medium text-oscar-text-primary">{activeCat.name}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

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
