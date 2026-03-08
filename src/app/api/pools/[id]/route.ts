import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  const pool = await prisma.pool.findUnique({
    where: { id },
    include: {
      admin: { select: { id: true, name: true } },
      members: { include: { user: { select: { id: true, name: true } } } },
    },
  });
  if (!pool) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(pool);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  const body = await request.json();
  const pool = await prisma.pool.update({
    where: { id },
    data: {
      name: body.name,
      lockDate: body.lockDate ? new Date(body.lockDate) : undefined,
      adminId: body.adminId,
    },
  });
  return NextResponse.json(pool);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  await prisma.pool.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
