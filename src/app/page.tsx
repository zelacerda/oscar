import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import CopyInviteButton from "@/components/copy-invite-button";

export default async function HomePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = session.user.id;

  const [adminPools, memberPoolRows] = await Promise.all([
    prisma.pool.findMany({
      where: { adminId: userId },
      select: {
        id: true,
        name: true,
        year: true,
        inviteCode: true,
        lockDate: true,
        _count: { select: { members: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.poolMember.findMany({
      where: {
        userId,
        pool: { adminId: { not: userId } },
      },
      select: {
        pool: {
          select: {
            id: true,
            name: true,
            year: true,
            lockDate: true,
            admin: { select: { name: true } },
            _count: { select: { members: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const memberPools = memberPoolRows.map((m) => m.pool);
  const isAdmin = session.user.role === "ADMIN";
  const hasNoPools = adminPools.length === 0 && memberPools.length === 0;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Boas-vindas */}
      <div className="mb-8">
        <h1 className="admin-heading text-2xl">
          Ola, {session.user.name?.split(" ")[0] ?? "usuario"}!
        </h1>
        <p className="mt-1 text-sm text-oscar-text-secondary">
          Bem-vindo ao Oscar — seu bolao do Oscar entre amigos.
        </p>
      </div>

      {/* Atalho Admin */}
      {isAdmin && (
        <Link
          href="/admin"
          className="admin-btn-secondary mb-8 inline-flex items-center gap-2 text-sm"
        >
          Painel de Administracao
        </Link>
      )}

      {/* Estado vazio */}
      {hasNoPools && (
        <div className="admin-card p-8 text-center">
          <p className="text-oscar-text-secondary">
            Voce ainda nao participa de nenhum bolao.
          </p>
          <Link href="/pools/new" className="admin-btn-primary mt-4 inline-block">
            Criar Novo Bolao
          </Link>
        </div>
      )}

      {/* Meus Boloes (como membro) */}
      {memberPools.length > 0 && (
        <section className="mb-8">
          <h2 className="admin-heading mb-4 text-lg">Meus Boloes</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {memberPools.map((pool) => (
              <Link
                key={pool.id}
                href={`/pools/${pool.id}`}
                className="admin-card block p-4 transition-shadow hover:shadow-md"
              >
                <h3 className="font-semibold text-oscar-text-primary">{pool.name}</h3>
                <p className="mt-1 text-xs text-oscar-text-muted">
                  {pool.year} &middot; {pool._count.members} participante{pool._count.members !== 1 ? "s" : ""}
                  {pool.admin.name && ` &middot; por ${pool.admin.name}`}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Boloes que Administro */}
      {adminPools.length > 0 && (
        <section className="mb-8">
          <h2 className="admin-heading mb-4 text-lg">Boloes que Administro</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {adminPools.map((pool) => (
              <div key={pool.id} className="admin-card p-4">
                <Link
                  href={`/pools/${pool.id}`}
                  className="block transition-opacity hover:opacity-80"
                >
                  <h3 className="font-semibold text-oscar-text-primary">{pool.name}</h3>
                  <p className="mt-1 text-xs text-oscar-text-muted">
                    {pool.year} &middot; {pool._count.members} participante{pool._count.members !== 1 ? "s" : ""}
                  </p>
                </Link>
                <div className="mt-3">
                  <CopyInviteButton inviteCode={pool.inviteCode} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Criar Novo Bolao */}
      {!hasNoPools && (
        <div className="text-center">
          <Link href="/pools/new" className="admin-btn-primary inline-block">
            Criar Novo Bolao
          </Link>
        </div>
      )}
    </main>
  );
}
