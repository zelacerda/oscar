import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

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
  const { error } = await requireAuth();
  if (error) return error;

  const body = await request.json();

  const nominee = await prisma.nominee.findUnique({
    where: { id: body.nomineeId },
    select: { categoryId: true },
  });
  if (!nominee) {
    return NextResponse.json({ error: "Indicado não encontrado" }, { status: 400 });
  }
  if (nominee.categoryId !== body.categoryId) {
    return NextResponse.json(
      { error: "Esse indicado não pertence a essa categoria" },
      { status: 400 }
    );
  }

  const bet = await prisma.bet.create({
    data: {
      poolMemberId: body.poolMemberId,
      categoryId: body.categoryId,
      nomineeId: body.nomineeId,
    },
  });
  return NextResponse.json(bet, { status: 201 });
}
