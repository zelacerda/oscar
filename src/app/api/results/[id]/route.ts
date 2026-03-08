import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const result = await prisma.result.update({
    where: { id },
    data: {
      winnerNomineeId: body.winnerNomineeId,
    },
  });
  return NextResponse.json(result);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  await prisma.result.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
