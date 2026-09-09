import { useEffect, useRef, useState } from "react";
import { useDialog } from "../lib/useDialog";
import { cn } from "../utils/cn";

const FIELDS = [
  { name: "nome", label: "Nome", type: "text", autoComplete: "name" },
  { name: "email", label: "E-mail", type: "email", autoComplete: "email" },
  { name: "telefone", label: "Telefone", type: "tel", autoComplete: "tel" },
] as const;

export default function ContactPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panel = useRef<HTMLDialogElement>(null);
  const [sent, setSent] = useState(false);
  useDialog(panel, open, onClose);
  useEffect(() => {
    if (!open) {
      setSent(false);
      panel.current?.querySelector("form")?.reset();
    }
  }, [open]);

  return (
    <dialog
      ref={panel}
      aria-modal="true"
      aria-label="Iniciar conversa"
      aria-describedby="contact-demo-notice"
      className="editorial-dialog bg-bone text-ink"
      data-lenis-prevent
    >
      <div className="mx-auto flex min-h-full max-w-[1680px] flex-col px-6 py-8 md:px-10 md:py-10">
        <div className="flex items-start justify-between">
          <span data-f className="u-eyebrow text-ink/65">
            Marina Valença — Advocacia
          </span>
          <button
            type="button"
            onClick={onClose}
            data-cursor="close"
            className="u-eyebrow group flex items-center gap-3 text-ink"
            aria-label="Fechar"
            tabIndex={open ? 0 : -1}
          >
            FECHAR
            <span className="relative block h-3 w-3">
              <span className="absolute top-1/2 left-0 block h-px w-full rotate-45 bg-ink transition-transform duration-500 group-hover:rotate-[135deg]" />
              <span className="absolute top-1/2 left-0 block h-px w-full -rotate-45 bg-ink transition-transform duration-500 group-hover:rotate-[45deg]" />
            </span>
          </button>
        </div>

        <div className="grid flex-1 items-center gap-12 py-[8vh] md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <h2
              data-f
              className="u-display text-[clamp(2.6rem,7vw,6rem)] leading-[0.88] tracking-[-0.03em]"
            >
              Comece
              <br />
              <em className="italic text-[#807052]">pela pergunta.</em>
            </h2>
            <p data-f className="mt-8 max-w-[38ch] text-[14px] leading-[1.9] text-ink/60">
              Este espaço demonstra como seria o primeiro contato com a
              boutique. Use apenas dados de teste, sem documentos ou
              informações pessoais sensíveis.
            </p>
            <p id="contact-demo-notice" data-f className="u-eyebrow mt-10 leading-relaxed text-ink/65">
              Formulário demonstrativo. Nenhum dado é enviado ou armazenado.
            </p>
          </div>

          <form
            className="md:col-span-7"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <div className="grid gap-8 sm:grid-cols-2">
              {FIELDS.map((f) => (
                <label
                  data-f
                  key={f.name}
                  className={cn("group block", f.name === "nome" && "sm:col-span-2")}
                >
                  <span className="u-eyebrow text-ink/65">{f.label}{f.name === "telefone" ? " (opcional)" : ""}</span>
                  <input
                    name={f.name}
                    data-initial-focus={f.name === "nome" ? true : undefined}
                    type={f.type}
                    autoComplete={f.autoComplete}
                    required={f.name !== "telefone"}
                    maxLength={f.name === "telefone" ? 30 : 254}
                    tabIndex={open ? 0 : -1}
                    className="mt-3 w-full border-b border-ink/40 bg-transparent pb-3 font-display text-[clamp(1.2rem,2.2vw,1.7rem)] text-ink transition-colors placeholder:text-ink/40 focus:border-ink focus-visible:outline-ink"
                    placeholder="—"
                  />
                </label>
              ))}

              <label data-f className="block sm:col-span-2">
                <span className="u-eyebrow text-ink/65">Mensagem</span>
                <textarea
                  name="mensagem"
                  rows={4}
                  required
                  maxLength={4000}
                  tabIndex={open ? 0 : -1}
                  className="mt-3 w-full resize-y border-b border-ink/40 bg-transparent pb-3 font-display text-[clamp(1.2rem,2.2vw,1.7rem)] text-ink transition-colors placeholder:text-ink/40 focus:border-ink focus-visible:outline-ink"
                  placeholder="—"
                />
              </label>
            </div>

            <div data-f className="mt-12 flex flex-wrap items-center gap-8">
              <button
                type="submit"
                tabIndex={open ? 0 : -1}
                data-cursor="open"
                className="group relative overflow-hidden rounded-full border border-ink/25 px-9 py-4 transition-colors duration-500 hover:border-ink"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
                <span className="u-eyebrow relative z-10 flex items-center gap-4 transition-colors duration-500 group-hover:text-bone">
                  Enviar solicitação <span>→</span>
                </span>
              </button>
              {sent && (
                <span role="status" className="max-w-[36ch] text-sm leading-relaxed text-ink/75">
                  Demonstração concluída. Nenhuma solicitação foi enviada.
                </span>
              )}
            </div>
          </form>
        </div>

        <div className="u-eyebrow flex flex-wrap justify-between gap-4 border-t border-ink/12 pt-6 text-ink/65">
          <span>São Paulo — Brasil</span>
          <span>Ambiente demonstrativo</span>
        </div>
      </div>
    </dialog>
  );
}
