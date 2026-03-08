import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import RankingTable from "./ranking-table";

type Props = { params: Promise<{ id: string }> };

export default async function RankingPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const userId = session.user.id;

  const pool = await prisma.pool.findUnique({
    where: { id },
    select: { id: true, name: true, lockDate: true, adminId: true },
  });

  if (!pool) redirect("/");

  const now = new Date();
  const isLocked = pool.lockDate ? now >= pool.lockDate : false;
  if (!isLocked) redirect(`/pools/${id}`);

  const member = await prisma.poolMember.findFirst({
    where: { poolId: id, userId },
  });

  if (!member && pool.adminId !== userId) redirect("/");

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link href={`/pools/${id}`} className="text-sm text-oscar-text-secondary hover:underline">
          ← Voltar para o bolão
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="admin-heading text-2xl">Ranking</h1>
        <p className="mt-1 text-sm text-oscar-text-secondary">{pool.name}</p>
      </div>

      <RankingTable poolId={id} currentUserId={userId} />
    </main>
  );
}
