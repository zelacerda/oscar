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

  const pool = await prisma.pool.findUnique({ where: { id }, select: { adminId: true } });

  if (!member && pool?.adminId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!pool) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const members = await prisma.poolMember.findMany({
    where: { poolId: id },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(members);
}
