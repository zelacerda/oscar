import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import CopyInviteButton from "@/components/copy-invite-button";
import ShareInviteButton from "@/components/share-invite-button";

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
        description: true,
        inviteCode: true,
        isLocked: true,
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
            isLocked: true,
            admin: { select: { name: true } },
            _count: { select: { members: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const memberPools = memberPoolRows.map((m) => m.pool);
  const hasNoPools = adminPools.length === 0 && memberPools.length === 0;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Boas-vindas */}
      <div className="mb-8">
        <h1 className="admin-heading text-2xl">
          Olá, {session.user.name?.split(" ")[0] ?? "usuário"}!
        </h1>
        <p className="mt-1 text-sm text-oscar-text-secondary">
          Bem-vindo ao Oscar — seu bolão do Oscar entre amigos.
        </p>
      </div>

      {/* Estado vazio */}
      {hasNoPools && (
        <div className="gala-card p-8 text-center">
          <p className="text-oscar-text-secondary">
            Você ainda não participa de nenhum bolão. Bora começar?
          </p>
          <Link href="/pools/new" className="admin-btn-primary mt-4 inline-block">
            Criar Novo Bolão
          </Link>
        </div>
      )}

      {/* Meus Bolões (como membro) */}
      {memberPools.length > 0 && (
        <section className="mb-8">
          <h2 className="admin-heading mb-4 text-lg">Meus Bolões</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {memberPools.map((pool) => (
              <Link
                key={pool.id}
                href={`/pools/${pool.id}`}
                className="gala-card block p-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-oscar-text-primary">{pool.name}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${pool.isLocked ? "bg-red-900/40 text-red-300" : "bg-green-900/40 text-green-300"}`}>
                    {pool.isLocked ? "Encerrado" : "Aberto"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-oscar-text-secondary">
                  {pool._count.members} participante{pool._count.members !== 1 ? "s" : ""}
                  {pool.admin.name && <> &middot; por {pool.admin.name}</>}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bolões que Administro */}
      {adminPools.length > 0 && (
        <section className="mb-8">
          <h2 className="admin-heading mb-4 text-lg">Bolões que Administro</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {adminPools.map((pool) => (
              <div key={pool.id} className="gala-card p-4">
                <Link
                  href={`/pools/${pool.id}`}
                  className="block transition-opacity hover:opacity-80"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-oscar-text-primary">{pool.name}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${pool.isLocked ? "bg-red-900/40 text-red-300" : "bg-green-900/40 text-green-300"}`}>
                      {pool.isLocked ? "Encerrado" : "Aberto"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-oscar-text-secondary">
                    {pool._count.members} participante{pool._count.members !== 1 ? "s" : ""}
                  </p>
                </Link>
                <div className="mt-3 flex items-center gap-2">
                  <CopyInviteButton inviteCode={pool.inviteCode} />
                  <ShareInviteButton
                    inviteCode={pool.inviteCode}
                    poolName={pool.name}
                    poolDescription={pool.description}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Como funciona */}
      <section className="mt-10 mb-8">
          <h2 className="admin-heading mb-4 text-lg">Como funciona</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { step: "1", title: "Crie um bolão", desc: "ou entre em um com o código de convite" },
              { step: "2", title: "Chame a galera", desc: "compartilhe o link e monte o grupo" },
              { step: "3", title: "Faça seus palpites", desc: "escolha os vencedores de cada categoria" },
              { step: "4", title: "Acompanhe o ranking", desc: "veja quem manja mais de cinema" },
            ].map((item) => (
              <div key={item.step} className="gala-card flex items-start gap-3 p-4">
                <span className="gold-gradient-text text-xl font-bold leading-none">{item.step}</span>
                <div>
                  <p className="text-sm font-semibold text-oscar-text-primary">{item.title}</p>
                  <p className="text-xs text-oscar-text-secondary">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
      </section>

      {/* CTA Criar Novo Bolão */}
      {!hasNoPools && (
        <div className="text-center">
          <Link href="/pools/new" className="admin-btn-primary inline-block">
            Criar Novo Bolão
          </Link>
        </div>
      )}

      {/* Aviso sobre apostas */}
      <p className="mt-6 text-center text-xs text-oscar-text-secondary">
        Este bolão é apenas por diversão e não envolve dinheiro. Se o seu grupo de
        amigos quiser fazer uma vaquinha por fora, fique à vontade — use o site
        pra controlar quem acertou mais!
      </p>
    </main>
  );
}
