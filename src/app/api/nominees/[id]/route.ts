import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  const nominee = await prisma.nominee.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!nominee) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(nominee);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  const body = await request.json();
  const nominee = await prisma.nominee.update({
    where: { id },
    data: {
      name: body.name,
      movie: body.movie,
      year: body.year,
      categoryId: body.categoryId,
    },
  });
  return NextResponse.json(nominee);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  await prisma.nominee.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
