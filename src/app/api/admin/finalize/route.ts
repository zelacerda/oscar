import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  const userId = session!.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [totalCategories, totalResults, settings] = await Promise.all([
    prisma.category.count(),
    prisma.result.count(),
    prisma.globalSettings.findUnique({ where: { id: "singleton" } }),
  ]);

  return NextResponse.json({
    isFinalized: settings?.isFinalized ?? false,
    canFinalize: totalCategories > 0 && totalResults === totalCategories,
  });
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const userId = session!.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body: { isFinalized: boolean } = await request.json();

  // When finalizing, check all categories have results
  if (body.isFinalized) {
    const [totalCategories, totalResults] = await Promise.all([
      prisma.category.count(),
      prisma.result.count(),
    ]);

    if (totalCategories === 0 || totalResults !== totalCategories) {
      return NextResponse.json(
        { error: "Nem todas as categorias possuem resultado" },
        { status: 400 }
      );
    }
  }

  const settings = await prisma.globalSettings.upsert({
    where: { id: "singleton" },
    update: { isFinalized: body.isFinalized },
    create: { id: "singleton", isFinalized: body.isFinalized },
  });

  const [totalCategories, totalResults] = await Promise.all([
    prisma.category.count(),
    prisma.result.count(),
  ]);

  return NextResponse.json({
    isFinalized: settings.isFinalized,
    canFinalize: totalCategories > 0 && totalResults === totalCategories,
  });
}
