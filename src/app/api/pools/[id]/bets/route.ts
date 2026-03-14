import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  const userId = session!.user.id;

  const member = await prisma.poolMember.findFirst({
    where: { poolId: id, userId },
  });

  if (!member) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const bets = await prisma.bet.findMany({
    where: { poolMemberId: member.id },
    include: {
      category: { select: { id: true, name: true, tier: true } },
      nominee: { select: { id: true, name: true, movie: true } },
    },
    orderBy: { category: { name: "asc" } },
  });

  return NextResponse.json(bets);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  const userId = session!.user.id;

  const [pool, globalSettings] = await Promise.all([
    prisma.pool.findUnique({ where: { id }, select: { isLocked: true } }),
    prisma.globalSettings.findUnique({ where: { id: "singleton" } }),
  ]);
  if (!pool) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (pool.isLocked || globalSettings?.globalLock) {
    return NextResponse.json({ error: "Forbidden: betting is closed" }, { status: 403 });
  }

  const member = await prisma.poolMember.findFirst({
    where: { poolId: id, userId },
  });

  if (!member) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Body: Array of { categoryId, nomineeId }
  const body: { categoryId: string; nomineeId: string }[] = await request.json();

  // Upsert each bet
  const results = await Promise.all(
    body.map(({ categoryId, nomineeId }) =>
      prisma.bet.upsert({
        where: {
          poolMemberId_categoryId: {
            poolMemberId: member.id,
            categoryId,
          },
        },
        update: { nomineeId },
        create: { poolMemberId: member.id, categoryId, nomineeId },
      })
    )
  );

  return NextResponse.json(results);
}
