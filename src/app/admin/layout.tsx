"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const entities = [
  { name: "Users", href: "/admin/users" },
  { name: "Pools", href: "/admin/pools" },
  { name: "Pool Members", href: "/admin/pool-members" },
  { name: "Categories", href: "/admin/categories" },
  { name: "Nominees", href: "/admin/nominees" },
  { name: "Bets", href: "/admin/bets" },
  { name: "Results", href: "/admin/results" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-56 bg-gray-900 text-white p-4">
        <h1 className="text-xl font-bold mb-6">Oscar Admin</h1>
        <nav className="space-y-1">
          {entities.map((entity) => (
            <Link
              key={entity.href}
              href={entity.href}
              className={`block px-3 py-2 rounded text-sm ${
                pathname.startsWith(entity.href)
                  ? "bg-gray-700 font-medium"
                  : "hover:bg-gray-800"
              }`}
            >
              {entity.name}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
