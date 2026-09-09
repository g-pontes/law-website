import { useRef } from "react";
import { useGsap, useReveal } from "../lib/motion";
import { Magnetic } from "./primitives";
import EditorialImage from "./EditorialImage";
import heroSplit from "../assets/hero-split.jpg";

const LINES = [
  { text: "ESTRATÉGIA", big: true },
  { text: "PARA DECISÕES", big: false },
  { text: "QUE IMPORTAM.", big: false },
];

export default function Hero({
  ready,
  onCta,
}: {
  ready: boolean;
  onCta: () => void;
}) {
  const text = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  /* Scroll transition: tall sticky stage, panel expands to full width,
     text and chrome dissolve, backdrop warms to bone. Enhancement only —
     the tall track is enabled after setup succeeds. */
  const section = useGsap(
    ({ self, gsap }) => {
      const sticky = self.querySelector<HTMLElement>("[data-hero-sticky]");
      const panelEl = self.querySelector<HTMLElement>("[data-hero-panel]");
      const imgWrap = self.querySelector<HTMLElement>("[data-hero-imgwrap]");
      const textEl = self.querySelector<HTMLElement>("[data-hero-text]");
      if (!sticky || !panelEl || !imgWrap || !textEl) return;

      self.dataset.heroScrub = "on";
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: self,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        tl.to(panelEl, { width: () => window.innerWidth, ease: "none" }, 0)
          .to(imgWrap, { scale: 1.08, ease: "none" }, 0)
          .to(textEl, { autoAlpha: 0, y: -70, ease: "none" }, 0)
          .to(sticky, { backgroundColor: "#F2F0EA", ease: "none" }, 0.35)
          .to("[data-hero-chrome-wrap]", { opacity: 0, ease: "none" }, 0);
        return () => {
          tl.revert();
        };
      });

      mm.add("(max-width: 767px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: self,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        });
        tl.to(imgWrap, { scale: 1.1, ease: "none" }, 0)
          .to(textEl, { autoAlpha: 0, y: -40, ease: "none" }, 0)
          .to(sticky, { backgroundColor: "#F2F0EA", ease: "none" }, 0.4)
          .to("[data-hero-chrome-wrap]", { opacity: 0, ease: "none" }, 0);
        return () => {
          tl.revert();
        };
      });

      /* Subtle camera drift on fine pointers. Shares imgWrap with the scrub
         scale — GSAP merges x/y/scale on one element without conflict. */
      let removeCamera: (() => void) | undefined;
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        const xTo = gsap.quickTo(imgWrap, "x", { duration: 1.4, ease: "power3" });
        const yTo = gsap.quickTo(imgWrap, "y", { duration: 1.4, ease: "power3" });
        const move = (e: MouseEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          xTo(nx * 26);
          yTo(ny * 18);
        };
        window.addEventListener("mousemove", move, { passive: true });
        removeCamera = () => window.removeEventListener("mousemove", move);
      }

      return () => {
        removeCamera?.();
        mm.revert();
        delete self.dataset.heroScrub;
      };
    },
    [],
    { desktopOnly: false }
  );

  /* Intro: WAAPI enhancement only — content is visible by default. */
  useReveal(text, {
    kind: "lines",
    selector: "[data-hero-line]",
    play: ready,
    trigger: false,
    delay: 0.35,
    stagger: 0.12,
  });
  useReveal(section, {
    selector: "[data-hero-fade], [data-hero-chrome]",
    play: ready,
    trigger: false,
    delay: 1.0,
    stagger: 0.09,
  });
  useReveal(panel, { kind: "image", direction: "left", play: ready, trigger: false });

  return (
    <section
      ref={section}
      id="top"
      className="hero-outer relative w-full bg-ink"
      aria-label="Abertura"
    >
      <div
        data-hero-sticky
        className="hero-sticky u-grain w-full overflow-hidden bg-ink"
      >
        {/* ——— Portrait panel: 58% right on desktop, expands to full width ——— */}
        <div
          ref={panel}
          data-hero-panel
          data-cursor="view"
          className="absolute inset-0 overflow-hidden md:inset-y-0 md:right-0 md:left-auto md:h-full md:w-[58%]"
        >
          <div data-image-scale className="absolute inset-0">
            <div
              data-hero-imgwrap
              className="absolute -inset-x-[3%] -inset-y-[4%]"
            >
              <EditorialImage
                src={heroSplit}
                alt="Retrato editorial ilustrativo de uma advogada em seu escritório em São Paulo"
                fetchPriority="high"
                loading="eager"
                sizes="100vw"
                className="h-full w-full object-cover object-top md:object-center"
              />
            </div>
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 z-[2] bg-gradient-to-t from-ink/85 via-ink/25 to-ink/45 md:bg-gradient-to-r md:from-ink/80 md:via-ink/25 md:to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 z-[2] h-28 bg-gradient-to-b from-ink/55 to-transparent"
          />
        </div>

        {/* ——— Headline + subtext + CTA ——— */}
        <div
          ref={text}
          data-hero-text
          className="absolute inset-x-0 bottom-[9vh] z-10 px-6 md:bottom-[11vh] md:left-10 md:right-auto md:px-0"
        >
          <h1 className="u-display text-bone">
            <span className="sr-only">Estratégia para decisões que importam</span>
            {LINES.map((l) => (
              <span key={l.text} className="u-line-mask" aria-hidden="true">
                <span
                  data-hero-line
                  className="block md:whitespace-nowrap"
                  style={
                    l.big
                      ? {
                          fontSize: "clamp(3.4rem, 13vw, 12.5rem)",
                          lineHeight: 0.9,
                          letterSpacing: "-0.03em",
                        }
                      : {
                          fontSize: "clamp(1.6rem, 5.4vw, 5rem)",
                          lineHeight: 1.02,
                          letterSpacing: "-0.02em",
                        }
                  }
                >
                  {l.text}
                </span>
              </span>
            ))}
          </h1>

          <div
            data-hero-fade
            className="mt-8 flex max-w-[38rem] flex-col gap-7 md:mt-10 md:flex-row md:items-end md:gap-12"
          >
            <p className="max-w-[26rem] text-[15px] leading-[1.7] text-bone/70 md:text-base">
              Advocacia boutique para pessoas e negócios que não podem tratar
              decisões importantes como algo comum.
            </p>
            <Magnetic
              onClick={onCta}
              ariaLabel="Iniciar conversa"
              className="group shrink-0 items-center gap-5 border-b border-bone/25 pb-4 transition-colors duration-500 hover:border-champagne"
            >
              <span className="u-eyebrow text-left leading-[1.9] text-bone transition-colors duration-500 group-hover:text-champagne">
                Iniciar
                <br />
                conversa
              </span>
              <span
                aria-hidden="true"
                className="block overflow-hidden text-lg text-bone transition-colors duration-500 group-hover:text-champagne"
              >
                <span className="flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
                  →
                </span>
              </span>
            </Magnetic>
          </div>
        </div>

        {/* ——— Corner chrome: dissolves first on scroll ——— */}
        <div
          data-hero-chrome-wrap
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10"
        >
          <div
            data-hero-chrome
            className="u-eyebrow absolute bottom-6 left-6 text-bone/70 md:bottom-8 md:left-10"
          >
            São Paulo
            <span className="ml-3 text-champagne">Brasil</span>
            <span className="mt-2 block text-bone/40">Imagem ilustrativa</span>
          </div>
          <div
            data-hero-chrome
            className="u-eyebrow absolute right-6 bottom-6 flex items-center gap-3 text-bone/70 md:right-10 md:bottom-8"
          >
            Scroll to explore
            <span className="block h-6 w-px bg-bone/30">
              <span className="block h-2 w-px animate-pulse bg-champagne" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
