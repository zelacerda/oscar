import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const pools = await prisma.pool.findMany({
    include: { admin: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(pools);
}

export async function POST(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const body = await request.json();
  const pool = await prisma.pool.create({
    data: {
      name: body.name,
      year: body.year,
      lockDate: new Date(body.lockDate),
      adminId: body.adminId,
    },
  });
  return NextResponse.json(pool, { status: 201 });
}
