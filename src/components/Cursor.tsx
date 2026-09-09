import { useEffect, useRef, useState } from "react";
import { useMediaQuery, useMotionEnabled } from "../lib/motion";

const LABELS: Record<string, string> = {
  view: "VIEW",
  open: "OPEN",
  explore: "EXPLORE",
  close: "CLOSE",
  drag: "DRAG",
};

export default function Cursor({ suspended = false }: { suspended?: boolean }) {
  const dot = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<string | null>(null);
  const fine = useMediaQuery("(min-width: 1024px) and (pointer: fine)");
  const motionEnabled = useMotionEnabled();
  const enabled = fine && motionEnabled && !suspended;

  useEffect(() => {
    if (!enabled) return;
    const el = dot.current;
    if (!el) return;

    let frame = 0;
    let x = -100;
    let y = -100;
    let targetX = x;
    let targetY = y;
    const draw = () => {
      x += (targetX - x) * 0.35;
      y += (targetY - y) * 0.35;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      el.style.visibility = "visible";
      frame = Math.abs(targetX - x) + Math.abs(targetY - y) > 0.1 ? requestAnimationFrame(draw) : 0;
    };
    const move = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!frame) frame = requestAnimationFrame(draw);
      document.documentElement.classList.add("u-hide-cursor");
      const target = (e.target as HTMLElement | null)?.closest?.(
        "[data-cursor],a,button,input,textarea"
      ) as HTMLElement | null;
      if (!target) return setMode(null);
      const explicit = target.getAttribute("data-cursor");
      if (explicit) return setMode(explicit);
      setMode("hover");
    };
    const restore = () => {
      document.documentElement.classList.remove("u-hide-cursor");
      el.style.visibility = "hidden";
      cancelAnimationFrame(frame);
      frame = 0;
    };
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("blur", restore);
    document.documentElement.addEventListener("mouseleave", restore);
    return () => {
      restore();
      window.removeEventListener("mousemove", move);
      window.removeEventListener("blur", restore);
      document.documentElement.removeEventListener("mouseleave", restore);
    };
  }, [enabled]);

  if (!enabled) return null;

  const label = mode ? LABELS[mode] : null;
  const big = Boolean(label);
  const hover = mode === "hover";

  return (
    <div ref={dot} className="cursor-root" aria-hidden="true" style={{ visibility: "hidden" }}>
      <div
        className="flex items-center justify-center rounded-full border border-bone bg-bone text-ink transition-[width,height,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          width: big ? 74 : hover ? 30 : 9,
          height: big ? 74 : hover ? 30 : 9,
          backgroundColor: big ? "#F2F0EA" : hover ? "transparent" : "#F2F0EA",
        }}
      >
        <span
          className="u-eyebrow select-none transition-opacity duration-300"
          style={{ opacity: big ? 1 : 0, fontSize: 9 }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
