import { LinesReveal } from "./primitives";

export default function Footer({ motionDisabled, systemReduced, onToggleMotion }: {
  motionDisabled: boolean;
  systemReduced: boolean;
  onToggleMotion: () => void;
}) {
  return (
    <footer className="relative overflow-hidden bg-ink px-6 pt-[10vh] pb-8 text-bone md:px-10">
      <div className="mx-auto max-w-[1680px]">
        <div className="grid gap-12 border-b border-bone/12 pb-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <span className="font-display text-4xl leading-none">MV</span>
            <p className="u-eyebrow mt-5 text-bone/70">
              Marina Valença
              <br />
              <span className="text-bone/65">Advocacia</span>
            </p>
          </div>

          <nav className="md:col-span-4" aria-label="Links institucionais">
            <ul className="grid gap-4">
              <li className="u-eyebrow text-bone/65">Instagram · Canal não informado</li>
              <li className="u-eyebrow text-bone/65">LinkedIn · Canal não informado</li>
              <li><a href="https://cna.oab.org.br/" target="_blank" rel="noopener noreferrer" className="u-eyebrow text-bone/80 hover:text-champagne">Consulta pública da OAB ↗</a></li>
              <li>
                <details className="max-w-[42ch]">
                  <summary className="u-eyebrow cursor-pointer py-1 text-bone/80">Privacidade</summary>
                  <p className="mt-4 text-xs leading-relaxed text-bone/70">
                    O formulário é demonstrativo e não envia dados. A preferência
                    de movimento é salva apenas neste navegador. Fotografias
                    ainda não hospedadas localmente são solicitadas ao Pexels,
                    que recebe os dados técnicos da conexão. Não adicionamos
                    ferramentas de análise de visitantes a este projeto.
                  </p>
                </details>
              </li>
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="text-xs leading-relaxed text-bone/65">
              Marca fictícia criada para fins de demonstração de projeto
              digital. A trajetória, os projetos e o depoimento são ilustrativos.
              Nenhuma credencial profissional real foi fornecida.
            </p>
          </div>
        </div>

        <LinesReveal
          as="div"
          className="u-display py-[6vh]"
          lineClassName="text-[clamp(3rem,16vw,17rem)] leading-[0.96] tracking-[-0.04em] text-bone/90"
          lines={["SÃO PAULO", <em key="b" className="italic text-champagne/70">— BRASIL</em>]}
        />

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-bone/12 pt-6">
          <span className="u-eyebrow text-bone/65">
            © 2026 Marina Valença Advocacia
          </span>
          <button
            type="button"
            onClick={onToggleMotion}
            disabled={systemReduced}
            aria-pressed={motionDisabled}
            className="u-eyebrow min-h-11 text-bone/75 underline-offset-4 hover:underline disabled:cursor-default"
          >
            {systemReduced ? "Movimento reduzido pelo sistema" : motionDisabled ? "Ativar movimento" : "Reduzir movimento"}
          </button>
          <a
            href="#top"
            data-cursor="open"
            className="u-eyebrow group flex items-center gap-3 text-bone/70 transition-colors hover:text-champagne"
          >
            Voltar ao topo
            <span className="inline-block transition-transform duration-500 group-hover:-translate-y-1">
              ↑
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
