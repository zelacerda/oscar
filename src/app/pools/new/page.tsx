import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import CreatePoolForm from "./create-pool-form";

const TIER_POINTS: Record<string, number> = {
  GOLD: 10,
  SILVER: 5,
  BRONZE: 3,
  BASE: 1,
};

const TIER_ORDER = ["GOLD", "SILVER", "BRONZE", "BASE"] as const;
const TIER_LABEL: Record<string, string> = {
  GOLD: "Ouro",
  SILVER: "Prata",
  BRONZE: "Bronze",
  BASE: "Base",
};

export default async function NewPoolPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const categories = await prisma.category.findMany({
    include: { nominees: { select: { id: true } } },
    orderBy: { name: "asc" },
  });

  const categoriesByTier = TIER_ORDER.map((tier) => ({
    tier,
    label: TIER_LABEL[tier],
    defaultPoints: TIER_POINTS[tier],
    categories: categories
      .filter((c) => c.tier === tier && c.nominees.length > 0)
      .map((c) => ({ id: c.id, name: c.name, tier: c.tier })),
  })).filter((g) => g.categories.length > 0);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link href="/" className="text-sm text-oscar-gold-light hover:underline">
          ← Voltar
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="admin-heading text-2xl">Criar Novo Bolão</h1>
        <p className="mt-1 text-sm text-oscar-text-secondary">
          Escolha as categorias e defina os pesos de cada uma.
        </p>
      </div>

      <CreatePoolForm categoriesByTier={categoriesByTier} />
    </main>
  );
}
