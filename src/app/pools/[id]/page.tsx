import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import LockButton from "./lock-button";

type Props = { params: Promise<{ id: string }> };

export default async function PoolPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const userId = session.user.id;

  const pool = await prisma.pool.findUnique({
    where: { id },
    include: {
      admin: { select: { id: true, name: true } },
      members: {
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!pool) redirect("/");

  const isMember = pool.members.some((m) => m.userId === userId);
  const isAdmin = pool.adminId === userId;

  if (!isMember && !isAdmin) redirect("/");

  const globalSettings = await prisma.globalSettings.findUnique({
    where: { id: "singleton" },
  });

  const isLocked = pool.isLocked || (globalSettings?.globalLock ?? false);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link href="/" className="text-sm text-oscar-gold-light hover:underline">
          ← Voltar
        </Link>
      </div>

      <div className="gala-card mb-6 p-6">
        <h1 className="gold-gradient-text text-2xl font-bold">{pool.name}</h1>
        <p className="mt-1 text-sm text-oscar-text-secondary">
          Criado por {pool.admin.name}
          {" "}&middot;{" "}
          {isLocked ? "Apostas encerradas" : "Apostas abertas"}
        </p>

        <div className="mt-6 flex items-center gap-3">
          {!isLocked && (
            <Link href={`/pools/${id}/bet`} className="admin-btn-primary">
              Editar Palpite
            </Link>
          )}
          {isLocked && (
            <Link href={`/pools/${id}/ranking`} className="admin-btn-primary">
              Ver Ranking
            </Link>
          )}
          {isAdmin && (
            <LockButton poolId={id} isLocked={isLocked} />
          )}
        </div>
      </div>

      <div className="gala-card p-6">
        <h2 className="gold-text mb-4 text-base font-bold">
          Participantes ({pool.members.length})
        </h2>
        <ul className="divide-y divide-oscar-border">
          {pool.members.map((m) => (
            <li key={m.id} className="flex items-center gap-3 py-3">
              {m.user.image ? (
                <Image
                  src={m.user.image}
                  alt={m.user.name ?? ""}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-oscar-gold text-xs font-bold text-white">
                  {(m.user.name ?? "?")[0].toUpperCase()}
                </div>
              )}
              <span className="text-sm font-medium text-oscar-text-primary">
                {m.user.name}
                {m.userId === userId && (
                  <span className="ml-2 text-xs text-oscar-text-muted">(você)</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
