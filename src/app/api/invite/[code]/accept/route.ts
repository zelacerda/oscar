import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

type Params = { params: Promise<{ code: string }> };

export async function POST(_request: NextRequest, { params }: Params) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { code } = await params;
  const userId = session!.user.id!;

  const pool = await prisma.pool.findUnique({
    where: { inviteCode: code },
    select: { id: true },
  });

  if (!pool) {
    return NextResponse.json({ error: "Convite não encontrado" }, { status: 404 });
  }

  // Idempotent: if already a member, just return success
  const existing = await prisma.poolMember.findUnique({
    where: { poolId_userId: { poolId: pool.id, userId } },
  });

  if (!existing) {
    await prisma.poolMember.create({
      data: { poolId: pool.id, userId },
    });
  }

  return NextResponse.json({ poolId: pool.id });
}
