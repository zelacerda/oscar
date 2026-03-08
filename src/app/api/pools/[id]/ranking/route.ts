import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

const TIER_POINTS: Record<string, number> = {
  GOLD: 10,
  SILVER: 5,
  BRONZE: 3,
  BASE: 1,
};

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  const userId = session!.user.id;

  const pool = await prisma.pool.findUnique({
    where: { id },
    select: { adminId: true, lockDate: true },
  });

  if (!pool) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const member = await prisma.poolMember.findFirst({
    where: { poolId: id, userId },
  });

  if (!member && pool.adminId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Fetch all results (categories that have a winner)
  const results = await prisma.result.findMany({
    select: { categoryId: true, winnerNomineeId: true },
  });

  const resultMap = new Map(results.map((r) => [r.categoryId, r.winnerNomineeId]));

  // Fetch all members with their bets
  const members = await prisma.poolMember.findMany({
    where: { poolId: id },
    include: {
      user: { select: { id: true, name: true, image: true } },
      bets: {
        include: {
          category: { select: { tier: true } },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // Calculate scores
  const ranking = members
    .map((m) => {
      let score = 0;
      let hits = 0;

      for (const bet of m.bets) {
        const winner = resultMap.get(bet.categoryId);
        if (winner && winner === bet.nomineeId) {
          const points = TIER_POINTS[bet.category.tier] ?? 1;
          score += points;
          hits++;
        }
      }

      return {
        userId: m.user.id,
        name: m.user.name,
        image: m.user.image,
        score,
        hits,
      };
    })
    .sort((a, b) => b.score - a.score || b.hits - a.hits)
    .map((entry, index) => ({ position: index + 1, ...entry }));

  return NextResponse.json(ranking);
}
