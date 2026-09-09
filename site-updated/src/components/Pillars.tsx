import { useEffect, useRef, useState } from "react";
import { useMotionEnabled } from "../lib/motion";

const PILLARS = [
  {
    n: "01",
    title: "CLAREZA",
    text: "Antes de defender uma posição, é preciso compreender o cenário inteiro.",
  },
  {
    n: "02",
    title: "ESTRATÉGIA",
    text: "Toda decisão jurídica é também uma decisão de negócio, de família ou de vida.",
  },
  {
    n: "03",
    title: "AÇÃO",
    text: "Execução precisa, comunicação direta e acompanhamento próximo do início ao fim.",
  },
];

export default function Pillars() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const motionEnabled = useMotionEnabled();

  useEffect(() => {
    const el = root.current;
    if (!el || !motionEnabled || typeof IntersectionObserver === "undefined") return;
    const rows = Array.from(el.querySelectorAll<HTMLElement>("[data-method-row]"));
    let observer: IntersectionObserver | undefined;
    try {
      observer = new IntersectionObserver(() => {
        const distances = rows.map((row) => Math.abs(row.getBoundingClientRect().top + row.offsetHeight / 2 - window.innerHeight / 2));
        setActive(distances.indexOf(Math.min(...distances)));
      }, { threshold: [0, 0.3, 0.6, 1] });
      rows.forEach((row) => observer?.observe(row));
    } catch { /* The counter is decorative; all three method descriptions stay visible. */ }
    return () => observer?.disconnect();
  }, [motionEnabled]);

  return (
    <section ref={root} className="bg-bone px-6 py-[10vh] text-ink md:px-10" aria-labelledby="method-title">
      <h2 id="method-title" className="sr-only">Nosso método</h2>
      <div className="method-layout mx-auto grid max-w-[1680px] gap-10 md:grid-cols-12">
        <div className="hidden md:col-span-5 md:block" aria-hidden="true">
          <div className="method-counter sticky top-[24vh] py-12">
            <span key={active} className="method-counter-value u-display block text-[22vw] leading-none tracking-[-0.05em]">
              {PILLARS[active].n}
            </span>
            <span className="u-eyebrow mt-8 block text-ink/60">Clareza. Estratégia. Ação.</span>
          </div>
        </div>
        <ol className="md:col-span-7">
          {PILLARS.map((pillar) => (
            <li key={pillar.n} data-method-row className="method-row flex min-h-[42vh] flex-col justify-center border-t border-ink/15 py-12 md:min-h-[64vh]">
              <span className="u-eyebrow text-ink/60">{pillar.n}</span>
              <h3 className="mt-6 font-sans text-[clamp(1.8rem,4.6vw,3.6rem)] font-medium leading-tight tracking-[-0.03em]">{pillar.title}</h3>
              <p className="mt-6 max-w-[34ch] font-display text-[clamp(1.4rem,2.6vw,2.1rem)] leading-[1.3] text-ink/75">{pillar.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
