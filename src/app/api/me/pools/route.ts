import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  const userId = session!.user.id;

  const [adminPools, memberPools] = await Promise.all([
    prisma.pool.findMany({
      where: { adminId: userId },
      select: {
        id: true,
        name: true,
        inviteCode: true,
        isLocked: true,
        _count: { select: { members: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.poolMember.findMany({
      where: {
        userId,
        pool: { adminId: { not: userId } },
      },
      select: {
        pool: {
          select: {
            id: true,
            name: true,
            isLocked: true,
            admin: { select: { name: true } },
            _count: { select: { members: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return NextResponse.json({
    adminPools,
    memberPools: memberPools.map((m) => m.pool),
  });
}
