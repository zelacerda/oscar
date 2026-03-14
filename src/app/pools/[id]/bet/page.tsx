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
const TIER_POINTS: Record<string, number> = {
  GOLD: 10,
  SILVER: 5,
  BRONZE: 3,
  BASE: 1,
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

  if (pool.isLocked) redirect(`/pools/${id}`);

  const member = await prisma.poolMember.findFirst({
    where: { poolId: id, userId },
  });

  if (!member) redirect("/");

  const [categories, existingBets] = await Promise.all([
    prisma.category.findMany({
      include: {
        nominees: { orderBy: { name: "asc" } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.bet.findMany({
      where: { poolMemberId: member.id },
      select: { categoryId: true, nomineeId: true },
    }),
  ]);

  const categoriesByTier = TIER_ORDER.map((tier) => ({
    tier,
    label: TIER_LABEL[tier],
    points: TIER_POINTS[tier],
    categories: categories.filter((c) => c.tier === tier && c.nominees.length > 0),
  })).filter((g) => g.categories.length > 0);

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
      </div>

      <BetForm poolId={id} categoriesByTier={categoriesByTier} initialBets={initialBets} />
    </main>
  );
}
