import { useGsap } from "../lib/motion";
import { LinesReveal } from "./primitives";

export default function Manifesto() {
  const root = useGsap(({ self: el, gsap }) => {
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    gsap.to("[data-drift-a]", {
      xPercent: -2.4,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
    });
    gsap.to("[data-drift-b]", {
      xPercent: 2.8,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
    });
    gsap.fromTo(
      "[data-vline]",
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 75%", end: "bottom 60%", scrub: true },
      }
    );
  }, []);

  return (
    <section
      ref={root}
      className="relative bg-bone px-6 py-[22vh] text-ink md:px-10"
      aria-label="Manifesto"
    >
      <div
        data-vline
        className="absolute top-0 left-6 h-full w-px origin-top bg-ink/15 md:left-10"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-[1680px]">
        <div className="mb-[14vh] flex items-baseline gap-6 pl-8 md:pl-16">
          <span className="u-eyebrow text-ink/65">(Manifesto)</span>
          <span className="h-px w-16 bg-ink/20" />
        </div>

        <div className="pl-8 md:pl-16">
          <div data-drift-a>
            <LinesReveal
              as="h2"
              className="u-display text-ink"
              lineClassName="text-[clamp(2.4rem,8.4vw,9rem)] leading-[0.92] tracking-[-0.03em]"
              lines={["O direito não começa", "na resposta."]}
            />
          </div>

          <div data-drift-b className="mt-[10vh] flex justify-end">
            <LinesReveal
              as="p"
              className="u-display text-right text-ink"
              lineClassName="text-[clamp(2.4rem,8.4vw,9rem)] leading-[0.92] tracking-[-0.03em]"
              lines={[
                "Começa na",
                <>
                  <span className="font-sans text-[0.68em] font-semibold tracking-[-0.04em]">
                    pergunta
                  </span>{" "}
                  <em className="italic text-champagne">certa.</em>
                </>,
              ]}
            />
          </div>
        </div>

        <div className="mt-[16vh] grid gap-10 pl-8 md:grid-cols-12 md:pl-16">
          <p className="u-eyebrow text-ink/65 md:col-span-3">Posicionamento</p>
          <p className="max-w-[52ch] text-[15px] leading-[1.85] text-ink/70 md:col-span-6 md:text-[17px]">
            Trabalhamos com um número reduzido de clientes por escolha. Cada
            demanda recebe leitura própria, tempo próprio e uma estratégia que
            não se repete. Clareza antes de conselho — e conselho antes de
            movimento.
          </p>
          <p className="u-eyebrow self-end text-ink/65 md:col-span-3 md:text-right">
            Clareza para
            <br />
            decisões que importam
          </p>
        </div>
      </div>
    </section>
  );
}
