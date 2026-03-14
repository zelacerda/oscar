import { auth, signOut } from "@/lib/auth";
import UserMenuDropdown from "./user-menu-dropdown";

export default async function UserMenu() {
  const session = await auth();

  if (!session?.user) return null;

  const isAdmin = session.user.role === "ADMIN";

  return (
    <UserMenuDropdown
      name={session.user.name ?? null}
      email={session.user.email ?? null}
      image={session.user.image ?? null}
      isAdmin={isAdmin}
      signOutAction={async () => {
        "use server";
        await signOut({ redirectTo: "/login" });
      }}
    />
  );
}
