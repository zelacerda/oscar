import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function GET(_request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const results = await prisma.result.findMany({
    include: {
      category: { select: { id: true, name: true, tier: true } },
      winnerNominee: { select: { id: true, name: true, movie: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(results);
}

export async function POST(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const body = await request.json();

  const nominee = await prisma.nominee.findUnique({
    where: { id: body.winnerNomineeId },
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

  const result = await prisma.result.create({
    data: {
      categoryId: body.categoryId,
      winnerNomineeId: body.winnerNomineeId,
    },
  });
  return NextResponse.json(result, { status: 201 });
}
