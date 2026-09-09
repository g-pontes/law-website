import { useEffect, useState } from "react";

export default function Loader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      onDone();
    };
    const deadline = window.setTimeout(finish, 1900);
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1000);
      const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      setCount(Math.round(eased * 100));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const onKey = (event: KeyboardEvent) => {
      if (["Escape", "Tab", "ArrowDown", "PageDown", " "].includes(event.key)) finish();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", finish, { passive: true, once: true });
    window.addEventListener("touchstart", finish, { passive: true, once: true });
    return () => {
      finished = true;
      clearTimeout(deadline);
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", finish);
      window.removeEventListener("touchstart", finish);
    };
  }, [onDone]);

  return (
    <div
      className="intro-curtain u-grain fixed inset-0 z-[200] flex flex-col justify-between bg-ink px-6 py-8 md:px-10 md:py-10"
      aria-label="Abertura da marca"
      onAnimationEnd={(event) => { if (event.target === event.currentTarget) onDone(); }}
    >
      <div className="flex items-center justify-between">
        <span className="u-eyebrow text-bone/65">MV</span>
        <button type="button" onClick={onDone} className="u-eyebrow pointer-events-auto p-2 text-bone/80">
          Pular abertura <span aria-hidden="true">→</span>
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-7">
        <div data-fade className="u-display text-[16vw] leading-none text-bone md:text-[9vw]">
          MV
        </div>
        <div data-fade className="u-eyebrow text-center text-bone/50">
          Marina Valença
          <br />
          <span className="text-bone/30">Advocacia</span>
        </div>
        <div
          data-fade
          className="relative h-px w-[64vw] max-w-[520px] overflow-hidden bg-bone/12"
        >
          <span
            className="absolute inset-0 origin-left bg-champagne transition-transform duration-150 ease-linear"
            style={{ transform: `scaleX(${count / 100})` }}
          />
        </div>
      </div>

      <div data-fade className="flex items-end justify-between">
        <span className="u-eyebrow text-bone/35">São Paulo — Brasil</span>
        <span aria-hidden="true" className="font-display text-[13vw] leading-[0.8] text-bone/90 tabular-nums md:text-[5vw]">
          {String(count).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
