"use client";

import { useState, useEffect } from "react";

type Props = {
  inviteCode: string;
  poolName: string;
  poolDescription?: string | null;
};

export default function ShareInviteButton({ inviteCode, poolName, poolDescription }: Props) {
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  function buildMessage() {
    const url = `${window.location.origin}/invite/${inviteCode}`;
    const desc = poolDescription ? ` - ${poolDescription}` : "";
    return `Criei o bolão "${poolName}${desc}" e este é um convite pra participar! Acesse: ${url}`;
  }

  async function handleShare() {
    const text = buildMessage();
    const url = `${window.location.origin}/invite/${inviteCode}`;

    if (canShare) {
      try {
        await navigator.share({ title: poolName, text, url });
      } catch (err) {
        // User cancelled share - ignore
        if ((err as DOMException).name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    } else {
      // Desktop fallback: copy full message
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      onClick={handleShare}
      className="admin-btn-primary text-xs"
    >
      {copied ? "Mensagem copiada!" : "Compartilhar"}
    </button>
  );
}
