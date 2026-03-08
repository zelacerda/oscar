"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

type RankingEntry = {
  position: number;
  userId: string;
  name: string | null;
  image: string | null;
  score: number;
  hits: number;
};

type Props = {
  poolId: string;
  currentUserId: string;
};

const MEDAL: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export default function RankingTable({ poolId, currentUserId }: Props) {
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchRanking = useCallback(async () => {
    try {
      const res = await fetch(`/api/pools/${poolId}/ranking`);
      if (!res.ok) return;
      const data: RankingEntry[] = await res.json();
      setRanking(data);
      setLastUpdated(new Date());
    } catch {
      // silently fail on refresh
    } finally {
      setLoading(false);
    }
  }, [poolId]);

  useEffect(() => {
    fetchRanking();
    const interval = setInterval(fetchRanking, 60_000);
    return () => clearInterval(interval);
  }, [fetchRanking]);

  if (loading) {
    return (
      <div className="admin-card p-6">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-md bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  if (ranking.length === 0) {
    return (
      <div className="admin-card p-6 text-center text-sm text-oscar-text-secondary">
        Nenhum participante encontrado.
      </div>
    );
  }

  return (
    <div className="admin-card overflow-hidden p-0">
      <table className="admin-table w-full">
        <thead>
          <tr>
            <th className="w-12 text-center">#</th>
            <th>Participante</th>
            <th className="text-right">Pontos</th>
            <th className="text-right">Acertos</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((entry) => {
            const isCurrentUser = entry.userId === currentUserId;
            return (
              <tr
                key={entry.userId}
                className={isCurrentUser ? "bg-oscar-gold/10 font-semibold" : ""}
              >
                <td className="text-center text-base">
                  {MEDAL[entry.position] ?? entry.position}
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    {entry.image ? (
                      <Image
                        src={entry.image}
                        alt={entry.name ?? ""}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-oscar-gold text-xs font-bold text-white">
                        {(entry.name ?? "?")[0].toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm">
                      {entry.name}
                      {isCurrentUser && (
                        <span className="ml-1 text-xs font-normal text-oscar-text-muted">
                          (você)
                        </span>
                      )}
                    </span>
                  </div>
                </td>
                <td className="text-right text-sm font-mono">{entry.score}</td>
                <td className="text-right text-sm text-oscar-text-muted">{entry.hits}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {lastUpdated && (
        <p className="px-4 py-2 text-right text-xs text-oscar-text-muted">
          Atualizado às {lastUpdated.toLocaleTimeString("pt-BR")} · atualiza a cada 60s
        </p>
      )}
    </div>
  );
}
