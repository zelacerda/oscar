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
  const [isFinalized, setIsFinalized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchRanking = useCallback(async () => {
    try {
      const res = await fetch(`/api/pools/${poolId}/ranking`);
      if (!res.ok) return;
      const data: { ranking: RankingEntry[]; isFinalized: boolean } = await res.json();
      setRanking(data.ranking);
      setIsFinalized(data.isFinalized);
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
            <div key={i} className="h-12 animate-pulse rounded-md bg-oscar-dark-accent" />
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

  const winner = isFinalized ? ranking[0] : null;

  return (
    <div>
      {/* Winner highlight */}
      {winner && (
        <div className="gala-card mb-6 overflow-hidden">
          <div className="bg-gradient-to-br from-oscar-gold/20 via-oscar-gold-subtle to-oscar-gold/10 p-6 text-center">
            <p className="text-oscar-gold-light text-sm font-medium uppercase tracking-widest mb-3">
              Resultado Final
            </p>
            <div className="flex justify-center mb-4">
              {winner.image ? (
                <Image
                  src={winner.image}
                  alt={winner.name ?? ""}
                  width={72}
                  height={72}
                  className="rounded-full border-2 border-oscar-gold"
                />
              ) : (
                <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 border-oscar-gold bg-oscar-gold text-2xl font-bold text-white">
                  {(winner.name ?? "?")[0].toUpperCase()}
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold text-oscar-gold-light mb-1">
              {winner.name}
            </h3>
            <p className="text-oscar-text-secondary text-sm mb-3">
              {winner.score} pontos · {winner.hits} acertos
            </p>
            <p className="text-oscar-gold font-semibold">
              Parabéns, {winner.userId === currentUserId ? "você venceu" : winner.name?.split(" ")[0] + " venceu"}!
            </p>
          </div>
        </div>
      )}

      {/* Ranking table */}
      <div className="gala-card overflow-hidden p-0">
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
              const isWinner = isFinalized && entry.position === 1;
              return (
                <tr
                  key={entry.userId}
                  className={
                    isWinner
                      ? "bg-oscar-gold/15 font-semibold"
                      : isCurrentUser
                        ? "bg-oscar-gold/10 font-semibold"
                        : ""
                  }
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
                  <td className="text-right text-sm font-mono text-oscar-gold-light">{entry.score}</td>
                  <td className="text-right text-sm text-oscar-text-muted">{entry.hits}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {lastUpdated && (
          <p className="px-4 py-2 text-right text-xs text-oscar-text-muted">
            {isFinalized
              ? "Resultado final"
              : `Atualizado às ${lastUpdated.toLocaleTimeString("pt-BR")} · atualiza a cada 60s`}
          </p>
        )}
      </div>
    </div>
  );
}
