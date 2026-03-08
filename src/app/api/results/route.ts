import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
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
  const body = await request.json();
  const result = await prisma.result.create({
    data: {
      year: body.year,
      categoryId: body.categoryId,
      winnerNomineeId: body.winnerNomineeId,
    },
  });
  return NextResponse.json(result, { status: 201 });
}
