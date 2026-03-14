import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import BetForm from "./bet-form";

type Props = { params: Promise<{ id: string }> };

const TIER_ORDER = ["GOLD", "SILVER", "BRONZE", "BASE"] as const;
const TIER_LABEL: Record<string, string> = {
  GOLD: "Ouro",
  SILVER: "Prata",
  BRONZE: "Bronze",
  BASE: "Base",
};

export default async function BetPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const userId = session.user.id;

  const pool = await prisma.pool.findUnique({
    where: { id },
    select: { id: true, name: true, isLocked: true },
  });

  if (!pool) redirect("/");

  const globalSettings = await prisma.globalSettings.findUnique({
    where: { id: "singleton" },
  });

  if (pool.isLocked || globalSettings?.globalLock) redirect(`/pools/${id}`);

  const member = await prisma.poolMember.findFirst({
    where: { poolId: id, userId },
  });

  if (!member) redirect("/");

  const [poolCategories, existingBets] = await Promise.all([
    prisma.poolCategory.findMany({
      where: { poolId: id },
      include: {
        category: {
          include: { nominees: { orderBy: { name: "asc" } } },
        },
      },
    }),
    prisma.bet.findMany({
      where: { poolMemberId: member.id },
      select: { categoryId: true, nomineeId: true },
    }),
  ]);

  // Group by pool-specific tier, using custom points from PoolCategory
  const categoriesByTier = TIER_ORDER.map((tier) => {
    const pcs = poolCategories.filter(
      (pc) => pc.tier === tier && pc.category.nominees.length > 0,
    );
    const cats = pcs.map((pc) => pc.category);

    const firstPoints = pcs.length > 0 ? pcs[0].points : 0;

    return {
      tier,
      label: TIER_LABEL[tier],
      points: firstPoints,
      categories: cats,
    };
  }).filter((g) => g.categories.length > 0);

  const initialBets: Record<string, string> = {};
  for (const bet of existingBets) {
    initialBets[bet.categoryId] = bet.nomineeId;
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link href={`/pools/${id}`} className="text-sm text-oscar-text-secondary hover:underline">
          ← Voltar para o bolão
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="admin-heading text-2xl">Editar Palpites</h1>
        <p className="mt-1 text-sm text-oscar-text-secondary">{pool.name}</p>
        <p className="mt-3 text-sm text-oscar-text-secondary">
          Você pode alterar seus palpites livremente enquanto o bolão estiver aberto para edição.
          As categorias possuem pontuações diferentes, definidas pelo administrador do bolão — fique
          de olho nos pontos de cada tier!
        </p>
      </div>

      <BetForm poolId={id} categoriesByTier={categoriesByTier} initialBets={initialBets} />
    </main>
  );
}
