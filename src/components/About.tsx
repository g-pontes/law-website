import { useGsap } from "../lib/motion";
import { IMG } from "../lib/images";
import { LinesReveal, Rise, RevealImage } from "./primitives";

const TIMELINE = [
  { year: "2014", label: "Formação" },
  { year: "2018", label: "Especialização" },
  { year: "2022", label: "Fundação da boutique" },
  { year: "2026", label: "Expansão" },
];

export default function About() {
  const frame = useGsap(({ self: el, gsap }) => {
    if (!window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches) return;

    const img = el.querySelector("img");
    const caption = el.querySelector("[data-fg]") as HTMLElement | null;
    if (!img) return;

    const ix = gsap.quickTo(img, "x", { duration: 1, ease: "power3.out" });
    const iy = gsap.quickTo(img, "y", { duration: 1, ease: "power3.out" });
    const cx = caption ? gsap.quickTo(caption, "x", { duration: 1.1, ease: "power3.out" }) : null;
    const cy = caption ? gsap.quickTo(caption, "y", { duration: 1.1, ease: "power3.out" }) : null;

    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      ix(nx * -22);
      iy(ny * -16);
      cx?.(nx * 26);
      cy?.(ny * 18);
    };
    const leave = () => {
      ix(0);
      iy(0);
      cx?.(0);
      cy?.(0);
    };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <section
      id="sobre"
      className="relative bg-bone px-6 py-[16vh] text-ink md:px-10"
      aria-label="Sobre"
    >
      <div className="mx-auto grid max-w-[1680px] gap-12 md:grid-cols-12 md:gap-16">
        {/* Portrait */}
        <div className="md:col-span-5">
          <div ref={frame} className="relative">
            <RevealImage
              src={IMG.portrait.src}
              alt={IMG.portrait.alt}
              className="aspect-[3/4.2] w-full"
              cursor="view"
            />
            <div
              data-fg
              className="pointer-events-none absolute -right-3 bottom-6 bg-ink px-5 py-3 md:-right-8"
            >
              <span className="u-eyebrow text-bone/80">Imagem ilustrativa</span>
            </div>
          </div>
          <p className="u-eyebrow mt-6 text-ink/60">Fig. 01 · Retrato editorial de banco de imagens</p>
        </div>

        {/* Copy */}
        <div className="md:col-span-7 md:pl-[6%]">
          <span className="u-eyebrow text-ink/65">(Sobre)</span>

          <LinesReveal
            as="h2"
            className="u-display mt-8"
            lineClassName="text-[clamp(3rem,10vw,9rem)] leading-[0.98] tracking-[-0.03em]"
            lines={["MARINA", <em key="v" className="italic">VALENÇA</em>]}
          />
          <p className="u-eyebrow mt-6 text-ink/65">Advogada · Identidade fictícia</p>

          <LinesReveal
            as="p"
            className="mt-12 font-display text-ink"
            lineClassName="text-[clamp(1.4rem,3.2vw,2.6rem)] leading-[1.22]"
            lines={[
              "Conhecimento jurídico.",
              "Visão estratégica.",
              <em key="c" className="italic text-ink/60">Atuação próxima.</em>,
            ]}
          />

          <Rise className="mt-12 grid max-w-[62ch] gap-6 text-[14px] leading-[1.9] text-ink/65 md:text-[15px]">
            <p>
              A boutique nasce de uma convicção simples: decisões importantes
              merecem atenção integral. Aqui, cada cliente conversa diretamente
              com quem conduz o caso — sem camadas, sem intermediários, sem
              respostas genéricas.
            </p>
            <p>
              O trabalho combina rigor técnico e leitura de contexto. Antes do
              parecer, o diagnóstico. Antes da petição, a pergunta. É esse
              intervalo — entre o problema apresentado e o problema real — que
              define a qualidade de uma estratégia jurídica.
            </p>
          </Rise>

          {/* Timeline */}
          <div className="mt-16">
            <p className="u-eyebrow mb-6 text-ink/65">Trajetória ilustrativa</p>
            <ol className="grid grid-cols-2 gap-px bg-ink/12 md:grid-cols-4">
              {TIMELINE.map((t, i) => (
                <li key={t.year} className="bg-bone">
                  <Rise delay={i * 0.06} className="px-1 py-6">
                    <span className="u-display block text-[clamp(1.7rem,3.4vw,2.6rem)] leading-none">
                      {t.year}
                    </span>
                    <span className="u-eyebrow mt-3 block text-ink/65">{t.label}</span>
                  </Rise>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs leading-relaxed text-ink/60">
              Datas e etapas fictícias. Formação e registro profissional não foram informados.
            </p>
          </div>

          <div className="mt-16">
            <RevealImage
              src={IMG.aboutDetail.src}
              alt={IMG.aboutDetail.alt}
              className="aspect-[16/7] w-full"
              direction="left"
              parallax={5}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
