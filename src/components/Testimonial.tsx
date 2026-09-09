import { LinesReveal } from "./primitives";

export default function Testimonial() {
  return (
    <section
      className="u-grain relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-ink px-6 py-[18vh] text-bone md:px-10"
      aria-label="Depoimento ilustrativo"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <span
          aria-hidden="true"
          className="u-display block text-[10rem] leading-[0.4] text-champagne/25 select-none md:text-[16rem]"
        >
          “
        </span>

        <LinesReveal
          as="blockquote"
          className="u-display mt-10"
          lineClassName="text-[clamp(1.9rem,6.4vw,6.4rem)] leading-[1.02] tracking-[-0.025em]"
          lines={[
            "Em um momento decisivo,",
            "precisávamos de alguém que",
            <em key="c" className="italic text-champagne">enxergasse além do problema.</em>,
          ]}
        />

        <div className="mt-16 flex flex-wrap items-end justify-between gap-6 border-t border-bone/12 pt-6">
          <span className="u-eyebrow text-bone/55">— Cliente</span>
          <span className="u-eyebrow text-bone/70">
            Depoimento ilustrativo · conteúdo fictício
          </span>
        </div>
      </div>
    </section>
  );
}
