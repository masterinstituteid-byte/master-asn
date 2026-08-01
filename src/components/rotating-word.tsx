"use client";

import { useEffect, useState } from "react";

/** Rotating highlighted word, à la ayocpns hero. */
export function RotatingWord({
  words,
  interval = 2200,
}: {
  words: string[];
  interval?: number;
}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  return (
    <span className="relative inline-block align-baseline">
      <span key={i} className="animate-word inline-block text-brand-600">
        {words[i]}
      </span>
      <span className="absolute inset-x-0 bottom-1 -z-10 h-3 rounded bg-gold-100" />
    </span>
  );
}
