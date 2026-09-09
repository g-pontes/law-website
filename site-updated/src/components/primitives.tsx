import { useRef, type CSSProperties, type ReactNode } from "react";
import { useGsap, useReveal } from "../lib/motion";
import EditorialImage from "./EditorialImage";
import { cn } from "../utils/cn";

export function RevealImage({
  src,
  alt,
  className,
  imgClassName,
  direction = "up",
  parallax = 0,
  priority = false,
  cursor = "view",
  style,
  sizes = "(max-width: 767px) 100vw, 50vw",
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  direction?: "up" | "down" | "left";
  parallax?: number;
  priority?: boolean;
  cursor?: string | null;
  style?: CSSProperties;
  sizes?: string;
}) {
  const wrap = useGsap(({ self, gsap }) => {
    if (!parallax || !window.matchMedia("(min-width: 1024px)").matches) return;
    gsap.fromTo("[data-image-parallax]", { yPercent: -Math.min(parallax, 4) }, {
      yPercent: Math.min(parallax, 4), ease: "none",
      scrollTrigger: { trigger: self, start: "top bottom", end: "bottom top", scrub: true },
    });
  }, [parallax]);
  useReveal(wrap, { kind: "image", direction });

  return (
    <div
      ref={wrap}
      className={cn("relative aspect-[4/3] overflow-hidden bg-ink/40", className)}
      style={style}
      data-cursor={cursor ?? undefined}
      data-content-image
    >
      <div data-image-parallax className="absolute inset-[-5%]">
        <div data-image-scale className="h-full w-full">
          <EditorialImage
            src={src}
            alt={alt}
            sizes={sizes}
            loading={priority ? "eager" : "lazy"}
            className={cn("h-full w-full object-cover", imgClassName)}
          />
        </div>
      </div>
    </div>
  );
}

export function LinesReveal({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.11,
  trigger = true,
  play = true,
  as: Tag = "div",
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  trigger?: boolean;
  play?: boolean;
  as?: "div" | "h1" | "h2" | "h3" | "p" | "blockquote";
}) {
  const root = useRef<HTMLElement>(null);
  useReveal(root, { kind: "lines", delay, stagger, trigger, play });

  return (
    <Tag ref={(node: HTMLElement | null) => { root.current = node; }} className={className} data-content-reveal>
      {lines.map((l, i) => (
        <span key={i} className="u-line-mask">
          <span data-line className={cn("block", lineClassName)}>
            {l}
          </span>
        </span>
      ))}
    </Tag>
  );
}

export function Rise({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const el = useRef<HTMLDivElement>(null);
  useReveal(el, { kind: "rise", delay, y });
  return (
    <div ref={el} className={className} data-content-reveal>
      {children}
    </div>
  );
}

export function Magnetic({
  children,
  className,
  strength = 0.32,
  onClick,
  as = "button",
  href,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  as?: "button" | "a";
  href?: string;
  ariaLabel?: string;
}) {
  const ref = useGsap<HTMLElement>(({ self: el, gsap }) => {
    if (!window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "elastic.out(1, 0.5)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "elastic.out(1, 0.5)" });
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, [strength]);

  const shared = {
    "aria-label": ariaLabel,
    "data-cursor": "open",
    onClick,
    className: cn("inline-flex", className),
  };
  return as === "a"
    ? <a {...shared} ref={(node) => { ref.current = node; }} href={href}>{children}</a>
    : <button {...shared} ref={(node) => { ref.current = node; }} type="button">{children}</button>;
}

export function ArrowCTA({
  label,
  onClick,
  href,
  tone = "light",
  className,
}: {
  label: string;
  onClick?: () => void;
  href?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <Magnetic
      as={href ? "a" : "button"}
      href={href}
      onClick={onClick}
      ariaLabel={label}
      className={cn("group relative items-center", className)}
    >
      <span
        className={cn(
          "relative flex items-center gap-5 overflow-hidden rounded-full border px-8 py-4 transition-colors duration-500",
          tone === "light"
            ? "border-bone/25 text-bone hover:border-champagne"
            : "border-ink/20 text-ink hover:border-champagne"
        )}
      >
        <span
          className={cn(
            "absolute inset-0 origin-bottom scale-y-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100",
            tone === "light" ? "bg-champagne" : "bg-ink"
          )}
        />
        <span
          className={cn(
            "u-eyebrow relative z-10 transition-colors duration-500",
            tone === "light" ? "group-hover:text-ink" : "group-hover:text-bone"
          )}
        >
          {label}
        </span>
        <span aria-hidden="true" className="relative z-10 block h-5 w-[26px] overflow-hidden">
          <span
            className={cn(
              "absolute inset-0 flex items-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[130%]",
              tone === "light" ? "group-hover:text-ink" : "group-hover:text-bone"
            )}
          >
            →
          </span>
          <span
            className={cn(
              "absolute inset-0 flex -translate-x-[130%] items-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0",
              tone === "light" ? "group-hover:text-ink" : "group-hover:text-bone"
            )}
          >
            →
          </span>
        </span>
      </span>
    </Magnetic>
  );
}
