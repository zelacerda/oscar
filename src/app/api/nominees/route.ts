import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId");

  const nominees = await prisma.nominee.findMany({
    where: categoryId ? { categoryId } : undefined,
    include: { category: { select: { id: true, name: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(nominees);
}

export async function POST(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const body = await request.json();
  const nominee = await prisma.nominee.create({
    data: {
      name: body.name,
      movie: body.movie,
      year: body.year,
      categoryId: body.categoryId,
    },
  });
  return NextResponse.json(nominee, { status: 201 });
}
