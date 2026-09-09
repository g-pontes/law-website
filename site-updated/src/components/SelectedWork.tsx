import { useState } from "react";
import { requestMotionRefresh, useGsap, useMediaQuery, useMotionEnabled } from "../lib/motion";
import { IMG } from "../lib/images";
import { LinesReveal, RevealImage } from "./primitives";

const WORK = [
  {
    n: "01",
    title: "ESTRUTURA EMPRESARIAL",
    desc: "Reorganização estratégica de uma operação em expansão.",
    meta: "Societário · Governança",
  },
  {
    n: "02",
    title: "PLANEJAMENTO PATRIMONIAL",
    desc: "Estratégia para proteção e continuidade patrimonial.",
    meta: "Patrimônio · Sucessão",
  },
  {
    n: "03",
    title: "NEGOCIAÇÃO",
    desc: "Construção de uma solução jurídica em cenário de alta complexidade.",
    meta: "Contratos · Conflito",
  },
];

export default function SelectedWork() {
  const desktop = useMediaQuery("(min-width: 1024px) and (min-height: 680px) and (pointer: fine)");
  const motionEnabled = useMotionEnabled();
  const [linear, setLinear] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  const root = useGsap(({ self, ScrollTrigger }) => {
    if (!desktop || linear) return;
    const gallery = self.querySelector<HTMLElement>("[data-work-gallery]");
    if (!gallery) return;
    let resizeObserver: ResizeObserver | undefined;
    const reset = () => {
      resizeObserver?.disconnect();
      self.removeAttribute("data-horizontal");
      self.style.removeProperty("--work-travel");
      gallery.scrollLeft = 0;
      setEnhanced(false);
      requestMotionRefresh();
    };

    try {
      self.dataset.horizontal = "true";
      const distance = () => Math.max(0, gallery.scrollWidth - gallery.clientWidth);
      const measure = () => self.style.setProperty("--work-travel", `${distance()}px`);
      measure();
      ScrollTrigger.create({
        trigger: self, start: "top 80px", end: () => `+=${distance()}`,
        onUpdate: (trigger) => { gallery.scrollLeft = trigger.progress * distance(); },
        onRefreshInit: measure,
      });
      if (typeof ResizeObserver !== "undefined") {
        let lastWidth = gallery.clientWidth;
        resizeObserver = new ResizeObserver(() => {
          if (lastWidth === gallery.clientWidth) return;
          lastWidth = gallery.clientWidth;
          measure();
          requestMotionRefresh();
        });
        resizeObserver.observe(gallery);
      }
      setEnhanced(true);
    } catch (error) { reset(); throw error; }
    return reset;
  }, [desktop, linear]);

  return (
    <section ref={root} id="work" className="work-section relative bg-bone text-ink" aria-labelledby="work-title">
      <div className="work-stage">
        <div className="work-heading flex flex-wrap items-end justify-between gap-6 px-6 md:px-10">
          <div>
            <span className="u-eyebrow text-ink/60">(Selected work)</span>
            <div id="work-title">
              <LinesReveal as="h2" className="u-display mt-4" lineClassName="text-[clamp(2.2rem,6vw,5.6rem)] leading-[1.02]"
                lines={["PROJETOS", <em key="c" className="italic text-[#897a5e]">CONCEITUAIS</em>]} />
            </div>
          </div>
          {desktop && motionEnabled && <button type="button" disabled={!enhanced && !linear} onClick={() => {
            setLinear(!linear);
            requestAnimationFrame(() => root.current?.scrollIntoView({ behavior: "instant", block: "start" }));
          }} className="u-eyebrow border-b border-ink/40 py-3 text-ink/75 disabled:border-transparent">
            {linear ? "Exploração horizontal →" : enhanced ? "Ver em lista ↓" : "Leitura vertical"}
          </button>}
        </div>

        <div data-work-gallery data-native-scroll className="work-gallery" tabIndex={0} aria-label="Projetos conceituais. Use as setas para explorar quando a visualização for horizontal.">
          <div className="work-track">
            {WORK.map((work, index) => (
              <article key={work.n} className="work-project">
                <RevealImage src={IMG.work[index].src} alt={IMG.work[index].alt} className="work-image aspect-[4/5]" sizes="(max-width: 767px) 100vw, 45vw" />
                <div className="work-description">
                  <span className="u-eyebrow text-ink/60">{work.n}</span>
                  <h3 className="mt-4 font-sans text-[clamp(1.05rem,2vw,1.65rem)] font-medium leading-tight tracking-[-0.02em]">{work.title}</h3>
                  <p className="mt-4 max-w-[32ch] font-display text-[clamp(1.2rem,2vw,1.8rem)] leading-[1.3] text-ink/75">{work.desc}</p>
                  <p className="u-eyebrow mt-6 text-ink/60">{work.meta}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <p className="work-note px-6 text-xs leading-relaxed text-ink/65 md:px-10">
          Exercícios conceituais. Não representam clientes, casos reais ou resultados judiciais.
          {enhanced && <span className="ml-4">Scroll to explore →</span>}
        </p>
      </div>
    </section>
  );
}
