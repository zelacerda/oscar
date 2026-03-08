import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");

  const categories = await prisma.category.findMany({
    where: year ? { year: parseInt(year) } : undefined,
    orderBy: { name: "asc" },
  });
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const category = await prisma.category.create({
    data: {
      name: body.name,
      tier: body.tier,
      year: body.year,
    },
  });
  return NextResponse.json(category, { status: 201 });
}
