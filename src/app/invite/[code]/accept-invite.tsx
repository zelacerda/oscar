"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AcceptInvite({ code }: { code: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [accepting, setAccepting] = useState(true);

  useEffect(() => {
    async function accept() {
      try {
        const res = await fetch(`/api/invite/${code}/accept`, { method: "POST" });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Erro ao aceitar convite");
          setAccepting(false);
          return;
        }

        router.replace(`/pools/${data.poolId}`);
      } catch {
        setError("Erro ao aceitar convite. Tente novamente.");
        setAccepting(false);
      }
    }

    accept();
  }, [code, router]);

  if (error) {
    return (
      <div className="rounded-md bg-oscar-danger-light px-4 py-3 text-sm text-oscar-danger">
        {error}
      </div>
    );
  }

  return (
    <p className="text-sm text-oscar-text-secondary">
      {accepting ? "Entrando no bolão..." : "Redirecionando..."}
    </p>
  );
}
