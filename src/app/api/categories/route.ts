import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function GET(_request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const excludeWithResults = _request.nextUrl.searchParams.get("excludeWithResults") === "true";
  const includeId = _request.nextUrl.searchParams.get("includeId");

  const where = excludeWithResults
    ? {
        OR: [
          { result: null },
          ...(includeId ? [{ id: includeId }] : []),
        ],
      }
    : undefined;

  const categories = await prisma.category.findMany({
    where,
    orderBy: { name: "asc" },
  });
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const body = await request.json();
  const category = await prisma.category.create({
    data: {
      name: body.name,
      tier: body.tier,
    },
  });
  return NextResponse.json(category, { status: 201 });
}
