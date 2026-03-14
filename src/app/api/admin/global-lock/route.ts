import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

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

  const body: { globalLock: boolean } = await request.json();

  const settings = await prisma.globalSettings.upsert({
    where: { id: "singleton" },
    update: { globalLock: body.globalLock },
    create: { id: "singleton", globalLock: body.globalLock },
  });

  // When activating global lock, also lock all pools
  if (body.globalLock) {
    await prisma.pool.updateMany({
      data: { isLocked: true },
    });
  }

  return NextResponse.json(settings);
}

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const settings = await prisma.globalSettings.findUnique({
    where: { id: "singleton" },
  });

  return NextResponse.json({ globalLock: settings?.globalLock ?? false });
}
