"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface UserMenuDropdownProps {
  name: string | null;
  email: string | null;
  image: string | null;
  isAdmin: boolean;
  signOutAction: () => Promise<void>;
}

export default function UserMenuDropdown({
  name,
  email,
  image,
  isAdmin,
  signOutAction,
}: UserMenuDropdownProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-oscar-border-gold focus:outline-none focus:ring-2 focus:ring-oscar-gold/50"
        aria-label="Menu do usuário"
      >
        {image ? (
          <Image
            src={image}
            alt={name ?? ""}
            width={32}
            height={32}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-xs font-bold text-oscar-gold">{initials}</span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg border border-oscar-border-gold bg-oscar-charcoal shadow-lg">
          <div className="border-b border-oscar-border-gold/40 px-4 py-3">
            <p className="text-sm font-medium text-oscar-text-primary truncate">
              {name}
            </p>
            {email && (
              <p className="text-xs text-oscar-text-secondary truncate">
                {email}
              </p>
            )}
          </div>

          <div className="py-1">
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm text-oscar-text-primary hover:bg-oscar-gold/10 transition-colors"
              >
                Admin
              </Link>
            )}
            <form action={signOutAction}>
              <button
                type="submit"
                className="w-full px-4 py-2 text-left text-sm text-oscar-text-primary hover:bg-oscar-gold/10 transition-colors"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
