import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const poolId = searchParams.get("poolId");

  const members = await prisma.poolMember.findMany({
    where: poolId ? { poolId } : undefined,
    include: { user: { select: { id: true, name: true, email: true } }, pool: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(members);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const member = await prisma.poolMember.create({
    data: {
      poolId: body.poolId,
      userId: body.userId,
    },
  });
  return NextResponse.json(member, { status: 201 });
}
