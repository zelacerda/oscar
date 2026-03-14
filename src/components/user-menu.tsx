import { auth, signOut } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";

export default async function UserMenu() {
  const session = await auth();

  if (!session?.user) return null;

  const isAdmin = session.user.role === "ADMIN";

  return (
    <div className="flex items-center gap-3">
      {session.user.image && (
        <Image
          src={session.user.image}
          alt={session.user.name ?? ""}
          width={32}
          height={32}
          className="rounded-full"
        />
      )}
      <span className="text-sm font-medium text-oscar-text-primary">
        {session.user.name?.split(" ")[0]}
      </span>
      {isAdmin && (
        <Link
          href="/admin"
          className="admin-btn-secondary text-xs"
        >
          Admin
        </Link>
      )}
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <button type="submit" className="admin-btn-secondary text-xs">
          Sair
        </button>
      </form>
    </div>
  );
}
