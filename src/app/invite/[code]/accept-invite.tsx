"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AcceptInvite({ code }: { code: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [accepting, setAccepting] = useState(false);

  async function handleAccept() {
    setAccepting(true);
    setError("");

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

  return (
    <div>
      <button
        onClick={handleAccept}
        disabled={accepting}
        className="admin-btn-primary w-full py-3 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {accepting ? "Entrando..." : "Entrar no Bolão"}
      </button>
      {error && (
        <div className="mt-3 rounded-md bg-oscar-danger-light px-4 py-3 text-sm text-oscar-danger">
          {error}
        </div>
      )}
    </div>
  );
}
