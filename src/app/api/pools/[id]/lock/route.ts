import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(_request: NextRequest, { params }: Params) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  const userId = session!.user.id;

  const pool = await prisma.pool.findUnique({
    where: { id },
    select: { adminId: true, isLocked: true },
  });

  if (!pool) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (pool.adminId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // If trying to unlock, check globalLock first
  if (pool.isLocked) {
    const globalSettings = await prisma.globalSettings.findUnique({
      where: { id: "singleton" },
    });
    if (globalSettings?.globalLock) {
      return NextResponse.json(
        { error: "Votações encerradas globalmente pelo administrador do sistema" },
        { status: 403 }
      );
    }
  }

  const updated = await prisma.pool.update({
    where: { id },
    data: { isLocked: !pool.isLocked },
    select: { id: true, isLocked: true },
  });

  return NextResponse.json(updated);
}
