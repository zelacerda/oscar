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
  const { session, error } = await requireAuth();
  if (error) return error;

  const body: {
    name: string;
    categories: { categoryId: string; points: number }[];
  } = await request.json();

  if (!body.name || !body.categories?.length) {
    return NextResponse.json(
      { error: "Name and at least one category are required" },
      { status: 400 }
    );
  }

  const userId = session!.user.id!;

  const pool = await prisma.pool.create({
    data: {
      name: body.name,
      adminId: userId,
      categories: {
        create: body.categories.map((c) => ({
          categoryId: c.categoryId,
          points: c.points,
        })),
      },
      members: {
        create: { userId },
      },
    },
    include: {
      categories: true,
      members: true,
    },
  });

  return NextResponse.json(pool, { status: 201 });
}
