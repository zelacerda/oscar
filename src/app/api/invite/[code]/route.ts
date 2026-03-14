import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ code: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { code } = await params;

  const pool = await prisma.pool.findUnique({
    where: { inviteCode: code },
    select: {
      id: true,
      name: true,
      description: true,
      admin: { select: { name: true } },
      _count: { select: { members: true } },
    },
  });

  if (!pool) {
    return NextResponse.json({ error: "Convite não encontrado" }, { status: 404 });
  }

  return NextResponse.json(pool);
}
