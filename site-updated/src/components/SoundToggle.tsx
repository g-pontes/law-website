import { useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";

/**
 * Sound is OFF by default and only ever enabled explicitly by the visitor.
 * Generates tiny synthesised ticks — no audio files, no autoplay.
 */
export default function SoundToggle() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!on) return;
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    const ac: AudioContext = ctxRef.current ?? new AC();
    ctxRef.current = ac;

    const blip = (freq: number, gainValue: number) => {
      if (ac.state === "suspended") ac.resume();
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, ac.currentTime);
      g.gain.linearRampToValueAtTime(gainValue, ac.currentTime + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.16);
      o.connect(g).connect(ac.destination);
      o.start();
      o.stop(ac.currentTime + 0.18);
    };

    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement | null)?.closest?.("a,button");
      if (t) blip(880, 0.012);
    };
    const onClick = () => blip(440, 0.02);

    document.addEventListener("mouseover", onOver);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("click", onClick);
    };
  }, [on]);

  return (
    <button
      onClick={() => setOn((v) => !v)}
      aria-pressed={on}
      aria-label={on ? "Desativar som" : "Ativar som"}
      data-cursor="open"
      className="u-eyebrow fixed bottom-5 left-6 z-[100] hidden items-center gap-3 text-bone/40 mix-blend-difference transition-colors hover:text-bone md:flex"
    >
      <span className="flex h-3 items-end gap-[2px]" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn(
              "block w-px bg-current transition-[height] duration-500",
              on ? "animate-pulse" : ""
            )}
            style={{ height: on ? `${5 + i * 3}px` : "3px" }}
          />
        ))}
      </span>
      SOM {on ? "ON" : "OFF"}
    </button>
  );
}
