import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  const userId = session!.user.id;

  const pool = await prisma.pool.findUnique({
    where: { id },
    select: { adminId: true },
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

  // Fetch custom points for this pool's categories
  const poolCategories = await prisma.poolCategory.findMany({
    where: { poolId: id },
    select: { categoryId: true, points: true },
  });

  const pointsMap = new Map(poolCategories.map((pc) => [pc.categoryId, pc.points]));

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
      bets: true,
    },
    orderBy: { createdAt: "asc" },
  });

  // Calculate scores using custom pool points
  const ranking = members
    .map((m) => {
      let score = 0;
      let hits = 0;

      for (const bet of m.bets) {
        const winner = resultMap.get(bet.categoryId);
        if (winner && winner === bet.nomineeId) {
          const points = pointsMap.get(bet.categoryId) ?? 1;
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
