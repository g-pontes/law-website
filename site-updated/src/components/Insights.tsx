import { useRef, useState } from "react";
import { IMG } from "../lib/images";
import { LinesReveal } from "./primitives";
import { cn } from "../utils/cn";
import EditorialImage from "./EditorialImage";

const POSTS = [
  {
    n: "01",
    cat: "Contratos",
    title: "O que existe por trás de um bom contrato",
    date: "12.02.2026",
    read: "6 min",
    excerpt: "Um bom contrato começa antes da redação. Compreender o contexto, as responsabilidades de cada parte e os pontos de incerteza ajuda a transformar intenções em regras claras. A revisão de um modelo não substitui a análise da relação que ele pretende organizar.",
  },
  {
    n: "02",
    cat: "Patrimônio",
    title: "Planejamento patrimonial além da burocracia",
    date: "28.01.2026",
    read: "8 min",
    excerpt: "Organizar o patrimônio envolve objetivos, relações familiares e expectativas de continuidade. Documentos são parte desse processo, mas não seu ponto de partida. Cada estrutura exige uma avaliação própria de riscos, custos e consequências.",
  },
  {
    n: "03",
    cat: "Estratégia",
    title: "Estratégia jurídica em momentos de mudança",
    date: "09.01.2026",
    read: "5 min",
    excerpt: "Mudanças tornam visíveis questões que antes pareciam secundárias. Reunir informações, revisar compromissos e identificar alternativas permite decidir com mais consciência. A estratégia jurídica deve acompanhar o contexto, não apenas reagir a ele.",
  },
  {
    n: "04",
    cat: "Empresarial",
    title: "Quando uma decisão empresarial exige cautela",
    date: "17.12.2025",
    read: "7 min",
    excerpt: "Uma decisão empresarial merece análise cuidadosa quando cria obrigações duradouras, altera responsabilidades ou compromete recursos relevantes. Perguntar quem decide, quais riscos assume e como pode rever o caminho é parte de uma escolha informada.",
  },
];

export default function Insights() {
  const [active, setActive] = useState<number | null>(null);
  const list = useRef<HTMLUListElement>(null);

  return (
    <section
      id="insights"
      className="relative overflow-hidden bg-bone px-6 py-[16vh] text-ink md:px-10"
      aria-label="Insights"
    >
      <div className="mx-auto max-w-[1680px]">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <span className="u-eyebrow text-ink/65">(Editorial)</span>
            <LinesReveal
              as="h2"
              className="u-display mt-5"
              lineClassName="text-[clamp(3rem,11vw,10rem)] leading-[0.84] tracking-[-0.03em]"
              lines={["INSIGHTS"]}
            />
          </div>
          <p className="self-end font-display text-[clamp(1.15rem,2.2vw,1.8rem)] leading-[1.3] text-ink/60 md:col-span-5">
            Pensamento jurídico para decisões mais conscientes.
          </p>
        </div>

        <ul ref={list} className="mt-[10vh] xl:pr-[22vw]">
          {POSTS.map((p, i) => (
            <li key={p.n}>
              <details
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="group border-t border-ink/15 last:border-b"
              >
                <summary data-cursor="open" className="grid cursor-pointer list-none grid-cols-12 items-baseline gap-4 py-7 md:gap-6 md:py-9">
                <span
                  className={cn(
                    "u-eyebrow col-span-2 transition-colors duration-500 md:col-span-1",
                    active === i ? "text-champagne" : "text-ink/65"
                  )}
                >
                  {p.n}
                </span>
                <span className="u-eyebrow col-span-10 text-ink/65 md:col-span-2">
                  {p.cat}
                </span>
                <h3
                  className={cn(
                    "col-span-12 font-display text-[clamp(1.4rem,3.4vw,2.9rem)] leading-[1.05] transition-[transform,opacity] duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] md:col-span-6",
                    active === i
                      ? "translate-x-[0.8vw] text-ink"
                      : active !== null
                        ? "text-ink/70"
                        : "text-ink"
                  )}
                >
                  {p.title}
                </h3>
                <span className="u-eyebrow col-span-6 text-ink/65 md:col-span-2 md:text-right">
                  {p.date}
                </span>
                <span className="u-eyebrow col-span-6 text-ink/65 md:col-span-1 md:text-right">
                  {p.read}
                </span>
                </summary>
                <div className="max-w-[65ch] pb-9 md:ml-[25%]">
                  <p className="text-sm leading-[1.9] text-ink/80">{p.excerpt}</p>
                  <p className="mt-5 text-xs leading-relaxed text-ink/60">Texto demonstrativo e informativo. Não substitui uma orientação jurídica individual.</p>
                </div>
              </details>
            </li>
          ))}
        </ul>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-6">
          <p className="max-w-[56ch] text-xs leading-relaxed text-ink/65">
            Conteúdo editorial, datas e tempos de leitura ilustrativos. Selecione um título para ler a prévia.
          </p>
          <span className="u-eyebrow text-ink/65">Arquivo — 2026</span>
        </div>
      </div>

      {/* floating preview */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-1/2 right-[4vw] hidden aspect-[4/5] w-[16vw] -translate-y-1/2 overflow-hidden transition-[opacity,transform] duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] xl:block",
          active !== null ? "scale-100 opacity-100" : "scale-90 opacity-0"
        )}
      >
        <EditorialImage
          src={IMG.insights.src}
          alt=""
          loading="lazy"
          sizes="20vw"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  );
}
