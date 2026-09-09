import { useEffect, useRef, useState } from "react";
import { useReveal } from "../lib/motion";
import { useDialog } from "../lib/useDialog";
import { IMG } from "../lib/images";
import { cn } from "../utils/cn";
import EditorialImage from "./EditorialImage";

const NAV = [
  { label: "ATUAÇÃO", id: "atuacao", img: IMG.menuAtuacao },
  { label: "SOBRE", id: "sobre", img: IMG.menuSobre },
  { label: "INSIGHTS", id: "insights", img: IMG.menuInsights },
  { label: "CONTATO", id: "contato", img: IMG.menuContato },
];

export default function Header({
  open,
  onOpen,
  onClose,
}: {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [light, setLight] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const bar = useRef<HTMLElement>(null);
  const overlay = useRef<HTMLDialogElement>(null);
  useDialog(overlay, open, onClose);
  useReveal(bar, { selector: "[data-h]", trigger: false, y: -14 });

  useEffect(() => {
    let frame = 0;
    const lightSections = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-theme='light']"));
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 40);
      setLight(lightSections.some((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= 64 && rect.bottom > 64;
      }));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <header
        ref={bar}
        className={cn(
          "fixed inset-x-0 top-0 z-[120] transition-[background-color,color,padding] duration-700",
          light && !open ? "text-ink" : "text-bone",
          scrolled && !open
            ? cn(
                "py-4 backdrop-blur-md md:py-5",
                light ? "bg-bone/95" : "bg-ink/90"
              )
            : "bg-transparent py-6 md:py-8"
        )}
      >
        <div className="relative mx-auto flex max-w-[1680px] items-center justify-between px-6 md:px-10">
          <a
            data-h
            href="#top"
            className="group flex items-center gap-3"
            aria-label="Marina Valença Advocacia — início"
            data-cursor="open"
          >
            <span className="font-display text-[26px] leading-none tracking-tight">MV</span>
            <span className="u-eyebrow hidden leading-[1.8] opacity-70 transition-opacity group-hover:opacity-100 sm:block">
              Marina Valença
              <br />
              Advocacia
            </span>
          </a>

          <nav
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 lg:flex"
            aria-label="Navegação principal"
          >
            {[
              { label: "HOME", id: "top" },
              { label: "ATUAÇÃO", id: "atuacao" },
              { label: "SOBRE", id: "sobre" },
              { label: "INSIGHTS", id: "insights" },
              { label: "CONTATO", id: "contato" },
            ].map((n) => (
              <a
                key={n.id}
                data-h
                href={`#${n.id}`}
                data-cursor="open"
                className="u-eyebrow group relative opacity-80 transition-opacity hover:opacity-100"
              >
                {n.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-champagne transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
              </a>
            ))}
          </nav>

          <button
            data-h
            type="button"
            onClick={onOpen}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            data-cursor={open ? "close" : "open"}
            className="u-eyebrow flex items-center gap-3"
          >
            <span className="relative block h-[10px] w-[22px]">
              <span
                className={cn(
                  "absolute left-0 block h-px w-full bg-current transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  open ? "top-[5px] rotate-45" : "top-0"
                )}
              />
              <span
                className={cn(
                  "absolute left-0 block h-px bg-current transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  open ? "top-[5px] w-full -rotate-45" : "top-[9px] w-2/3"
                )}
              />
            </span>
            <span className="hidden sm:block">{open ? "FECHAR" : "MENU"}</span>
          </button>
        </div>
      </header>

      {/* Fullscreen menu */}
      <dialog
        ref={overlay}
        id="site-menu"
        className="editorial-dialog u-grain bg-ink text-bone"
        aria-label="Navegação"
        aria-modal="true"
        data-lenis-prevent
      >
        {/* hover backdrops */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {NAV.map((n, i) => (
            <EditorialImage
              key={n.id}
              src={n.img.src}
              alt=""
              aria-hidden="true"
              loading="lazy"
              sizes="100vw"
              decoding="async"
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                hovered === i ? "scale-100 opacity-[0.30]" : "scale-110 opacity-0"
              )}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/40 to-ink/80" />
        </div>

        <div className="relative flex min-h-full flex-col justify-between gap-10 px-6 pt-24 pb-8 md:px-10 md:pt-28 md:pb-10">
          <div className="absolute inset-x-6 top-7 flex items-center justify-between md:inset-x-10">
            <span className="font-display text-2xl">MV</span>
            <button type="button" onClick={onClose} className="u-eyebrow min-h-11 px-2 text-bone" aria-label="Fechar menu">
              Fechar <span className="ml-3 text-lg" aria-hidden="true">×</span>
            </button>
          </div>
          <nav aria-label="Menu" className="flex flex-col">
            {NAV.map((n, i) => (
              <a
                key={n.id}
                data-menu-item
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                href={`#${n.id}`}
                onClick={onClose}
                data-cursor="open"
                tabIndex={open ? 0 : -1}
                className="group relative block border-b border-bone/15 py-[1.2vh] text-left"
              >
                <span className="u-display block text-[13vw] leading-[0.95] text-bone transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[2vw] md:text-[8.5vw]">
                  <i className="mr-4 align-super font-sans text-[10px] not-italic tracking-[0.28em] text-champagne/70 md:mr-6">
                    0{i + 1}
                  </i>
                  {n.label}
                </span>
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div data-menu-meta className="u-eyebrow text-bone/70">
              São Paulo — Brasil
              <br />
              <span className="text-bone/65">Projeto demonstrativo</span>
            </div>
            <div data-menu-meta className="flex gap-7">
              {["Instagram", "LinkedIn", "E-mail"].map((s) => (
                <span
                  key={s}
                  className="u-eyebrow cursor-default text-bone/65"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
