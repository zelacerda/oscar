"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  poolId: string;
  isLocked: boolean;
};

export default function LockButton({ poolId, isLocked }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleToggle() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/pools/${poolId}/lock`, { method: "PATCH" });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Erro ao alterar status");
        return;
      }

      router.refresh();
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`text-sm font-medium ${
          isLocked
            ? "text-green-400 hover:text-green-300"
            : "text-oscar-danger hover:text-red-300"
        } disabled:opacity-50`}
      >
        {loading
          ? "..."
          : isLocked
            ? "Reabrir Votações"
            : "Encerrar Votações"}
      </button>
      {error && (
        <p className="mt-1 text-xs text-oscar-danger">{error}</p>
      )}
    </div>
  );
}
