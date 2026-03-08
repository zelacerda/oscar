import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  const body = await request.json();

  const existing = await prisma.result.findUnique({
    where: { id },
    select: { categoryId: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Resultado não encontrado" }, { status: 404 });
  }

  const nominee = await prisma.nominee.findUnique({
    where: { id: body.winnerNomineeId },
    select: { categoryId: true },
  });
  if (!nominee) {
    return NextResponse.json({ error: "Indicado não encontrado" }, { status: 400 });
  }
  if (nominee.categoryId !== existing.categoryId) {
    return NextResponse.json(
      { error: "Esse indicado não pertence a essa categoria" },
      { status: 400 }
    );
  }

  const result = await prisma.result.update({
    where: { id },
    data: {
      winnerNomineeId: body.winnerNomineeId,
    },
  });
  return NextResponse.json(result);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  await prisma.result.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
