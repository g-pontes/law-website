import { IMG } from "../lib/images";
import { ArrowCTA, LinesReveal, Rise } from "./primitives";
import EditorialImage from "./EditorialImage";

const CHANNELS = [
  { label: "WhatsApp", value: "Canal não informado", note: "A definir antes da publicação" },
  { label: "E-mail", value: "Endereço não informado", note: "A definir antes da publicação" },
  { label: "São Paulo", value: "Localização de referência", note: "Endereço de atendimento não informado" },
];

export default function Contact({ onOpen }: { onOpen: () => void }) {
  return (
    <section
      id="contato"
      className="u-grain relative overflow-hidden bg-ink px-6 pt-[18vh] pb-[12vh] text-bone md:px-10"
      aria-label="Contato"
    >
      <EditorialImage
        src={IMG.contact.src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover opacity-[0.12]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/85 to-ink" />

      <div className="relative mx-auto max-w-[1680px]">
        <span className="u-eyebrow text-bone/70">(Contato)</span>

        <LinesReveal
          as="h2"
          className="u-display mt-8"
          lineClassName="text-[clamp(2.8rem,14vw,15rem)] leading-[0.96] tracking-[-0.035em]"
          lines={["VAMOS", <em key="c" className="italic text-champagne">CONVERSAR?</em>]}
        />

        <div className="mt-14 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[40ch] font-display text-[clamp(1.15rem,2.2vw,1.9rem)] leading-[1.3] text-bone/65">
            Conte brevemente o que você precisa. A primeira conversa começa
            aqui.
          </p>
          <ArrowCTA label="Iniciar conversa" onClick={onOpen} />
        </div>

        <div className="mt-[14vh] grid gap-px bg-bone/12 md:grid-cols-3">
          {CHANNELS.map((c, i) => (
            <div key={c.label} className="bg-ink px-1 py-8 md:px-6">
              <Rise delay={i * 0.06}>
                <span className="u-eyebrow text-champagne/70">{c.label}</span>
                <p className="mt-4 font-display text-[clamp(1.2rem,2.2vw,1.8rem)] leading-[1.15]">
                  {c.value}
                </p>
                <p className="u-eyebrow mt-3 text-bone/65">{c.note}</p>
              </Rise>
            </div>
          ))}
        </div>

        <p className="mt-10 text-xs leading-relaxed text-bone/65">
          Projeto demonstrativo. Os canais reais de atendimento ainda não foram fornecidos.
        </p>
      </div>
    </section>
  );
}
