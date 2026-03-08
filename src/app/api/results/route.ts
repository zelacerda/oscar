import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");

  const results = await prisma.result.findMany({
    where: year ? { year: parseInt(year) } : undefined,
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
      year: body.year,
      categoryId: body.categoryId,
      winnerNomineeId: body.winnerNomineeId,
    },
  });
  return NextResponse.json(result, { status: 201 });
}
