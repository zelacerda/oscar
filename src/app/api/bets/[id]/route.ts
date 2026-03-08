import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const bet = await prisma.bet.update({
    where: { id },
    data: {
      nomineeId: body.nomineeId,
    },
  });
  return NextResponse.json(bet);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  await prisma.bet.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
