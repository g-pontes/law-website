import { useRef, useState } from "react";
import { useGsap } from "../lib/motion";
import { IMG } from "../lib/images";
import { LinesReveal } from "./primitives";
import { cn } from "../utils/cn";
import EditorialImage from "./EditorialImage";

const AREAS = [
  {
    n: "01",
    title: "EMPRESARIAL",
    desc: "Societário, governança e estrutura de operações.",
  },
  { n: "02", title: "CONTRATOS", desc: "Redação, revisão e negociação de instrumentos." },
  { n: "03", title: "CÍVEL", desc: "Conflitos, responsabilidade e composição." },
  { n: "04", title: "PATRIMONIAL", desc: "Organização, proteção e sucessão de patrimônio." },
  { n: "05", title: "FAMÍLIA", desc: "Acordos, planejamento e transições familiares." },
];

export default function Practice() {
  const follower = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [previewReady, setPreviewReady] = useState(false);

  const root = useGsap(({ self: container, gsap }) => {
    const el = follower.current;
    if (!el || !window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches) return;

    gsap.set(el, { xPercent: -50, yPercent: -50 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.85, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.85, ease: "power3.out" });
    const rTo = gsap.quickTo(el, "rotation", { duration: 1.1, ease: "power3.out" });

    let last = 0;
    const move = (e: MouseEvent) => {
      setPreviewReady(true);
      const r = container.getBoundingClientRect();
      xTo(e.clientX - r.left);
      yTo(e.clientY - r.top);
      const dx = e.clientX - last;
      last = e.clientX;
      rTo(gsap.utils.clamp(-6, 6, dx * 0.35) + 2);
    };
    container.addEventListener("mousemove", move);
    return () => {
      container.removeEventListener("mousemove", move);
      setPreviewReady(false);
    };
  }, []);

  return (
    <section
      id="atuacao"
      ref={root}
      className="relative overflow-hidden bg-ink px-6 py-[16vh] text-bone md:px-10"
      aria-label="Áreas de atuação"
    >
      <div className="mx-auto max-w-[1680px]">
        <div className="mb-[10vh] flex flex-wrap items-end justify-between gap-8">
          <LinesReveal
            as="h2"
            className="u-display"
            lineClassName="text-[clamp(2.6rem,7vw,7rem)] leading-[0.9]"
            lines={["ÁREAS DE", <em key="a" className="italic text-champagne">ATUAÇÃO</em>]}
          />
          <p className="max-w-[34ch] text-[13px] leading-relaxed text-bone/70">
            Cinco frentes de trabalho conectadas por um mesmo método: entender o
            cenário antes de propor o caminho.
          </p>
        </div>

        <ul className="relative">
          {AREAS.map((a, i) => (
            <li key={a.n}>
              <a
                href="#contato"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                data-cursor="explore"
                aria-label={`Conversar sobre ${a.title.toLowerCase()}. ${a.desc}`}
                className="group relative block w-full border-t border-bone/12 py-7 text-left last:border-b md:py-9"
              >
                {/* champagne wash */}
                <span
                  className={cn(
                    "pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-champagne transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                    active === i ? "scale-x-100" : "scale-x-0"
                  )}
                />
                <div className="relative flex items-baseline gap-6 md:gap-12">
                  <span
                    className={cn(
                      "u-eyebrow w-8 shrink-0 transition-colors duration-500",
                      active === i ? "text-champagne/80" : "text-bone/65"
                    )}
                  >
                    {a.n}
                  </span>
                  <span
                    className={cn(
                      "u-display flex-1 text-[clamp(2rem,7.6vw,7.4rem)] leading-[0.95] transition-[transform,color,opacity] duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                      active === i
                        ? "translate-x-[1.4vw] text-bone"
                        : active !== null
                          ? "text-bone/65"
                          : "text-bone"
                    )}
                  >
                    {a.title}
                  </span>
                  <span
                    className={cn(
                      "hidden max-w-[26ch] text-[12px] leading-relaxed lg:block",
                      "text-bone/70"
                    )}
                  >
                    {a.desc}
                  </span>
                </div>
                <p className="mt-3 pl-14 text-[12px] leading-relaxed text-bone/70 lg:hidden">
                  {a.desc}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* cursor-following preview */}
      <div
        ref={follower}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 z-20 hidden h-[26vw] max-h-[380px] w-[19vw] max-w-[280px] lg:block"
      >
        {AREAS.map((a, i) => (
          <div
            key={a.n}
            className="absolute inset-0 overflow-hidden transition-[opacity,transform] duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              opacity: active === i && previewReady ? 1 : 0,
              transform: active === i ? "scale(1)" : "scale(0.8)",
            }}
          >
            <EditorialImage
              src={IMG.practice[i].src}
              alt=""
              loading="lazy"
              sizes="280px"
              decoding="async"
              className="h-full w-full object-cover"
            />
            <span className="absolute inset-0 bg-ink/15" />
          </div>
        ))}
      </div>
    </section>
  );
}
