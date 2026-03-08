import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const poolMemberId = searchParams.get("poolMemberId");

  const bets = await prisma.bet.findMany({
    where: poolMemberId ? { poolMemberId } : undefined,
    include: {
      category: { select: { id: true, name: true } },
      nominee: { select: { id: true, name: true, movie: true } },
      poolMember: { include: { user: { select: { id: true, name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(bets);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const bet = await prisma.bet.create({
    data: {
      poolMemberId: body.poolMemberId,
      categoryId: body.categoryId,
      nomineeId: body.nomineeId,
    },
  });
  return NextResponse.json(bet, { status: 201 });
}
