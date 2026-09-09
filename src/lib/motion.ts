import { createContext, useContext, useEffect, useRef, useState, type RefObject } from "react";
import type Lenis from "lenis";

export const MotionContext = createContext(false);
export const useMotionEnabled = () => useContext(MotionContext);

export function prefersReducedMotion() {
  return typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useMediaQuery(query: string) {
  const read = () => typeof window !== "undefined" &&
    typeof window.matchMedia === "function" && window.matchMedia(query).matches;
  const [matches, setMatches] = useState(read);
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }
    media.addListener(update);
    return () => media.removeListener(update);
  }, [query]);
  return matches;
}

type MotionRuntime = {
  gsap: typeof import("gsap")["gsap"];
  ScrollTrigger: typeof import("gsap/ScrollTrigger")["ScrollTrigger"];
};
let runtime: MotionRuntime | null = null;
let runtimePromise: Promise<MotionRuntime | null> | undefined;
let refreshFrame = 0;

// Optional engines never participate in rendering the content or opening a dialog.
async function loadMotion() {
  runtimePromise ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
    .then(([engine, plugin]) => {
      engine.gsap.registerPlugin(plugin.ScrollTrigger);
      plugin.ScrollTrigger.config({ ignoreMobileResize: true });
      runtime = { gsap: engine.gsap, ScrollTrigger: plugin.ScrollTrigger };
      return runtime;
    })
    .catch(() => null);
  return runtimePromise;
}

export function requestMotionRefresh() {
  if (!runtime || refreshFrame) return;
  refreshFrame = requestAnimationFrame(() => {
    refreshFrame = 0;
    try { runtime?.ScrollTrigger.refresh(); } catch { /* Native scroll remains available. */ }
  });
}

type MotionSetup = (context: MotionRuntime & { self: HTMLElement }) => void | (() => void);

export function useGsap<T extends HTMLElement = HTMLDivElement>(
  setup: MotionSetup,
  deps: unknown[] = [],
  options: { desktopOnly?: boolean } = {}
) {
  const scope = useRef<T>(null);
  const enabled = useMotionEnabled();
  const desktop = useMediaQuery("(min-width: 1024px) and (pointer: fine)");
  const desktopOnly = options.desktopOnly ?? true;
  const latestSetup = useRef(setup);
  latestSetup.current = setup;

  useEffect(() => {
    if (!enabled || (desktopOnly && !desktop) || prefersReducedMotion()) return;
    let disposed = false;
    let context: ReturnType<MotionRuntime["gsap"]["context"]> | undefined;
    let cleanup: void | (() => void);
    const revert = () => {
      try { context?.revert(); } catch { /* Never propagate engine cleanup errors into React. */ }
      try { cleanup?.(); } catch { /* A failed enhancement cannot unmount the document. */ }
      cleanup = undefined;
      context = undefined;
    };

    void loadMotion().then((engine) => {
      const self = scope.current;
      if (!engine || !self || disposed) return;
      try {
        // Capture partially initialized animations as well as successful ones.
        context = engine.gsap.context(() => {}, self);
        context.add(() => { cleanup = latestSetup.current({ ...engine, self }); });
        requestMotionRefresh();
      } catch {
        revert();
      }
    });

    return () => { disposed = true; revert(); };
  }, [enabled, desktop, desktopOnly, ...deps]);

  return scope;
}

type RevealOptions = {
  kind?: "lines" | "rise" | "image";
  selector?: string;
  delay?: number;
  stagger?: number;
  y?: number;
  direction?: "up" | "down" | "left";
  trigger?: boolean;
  play?: boolean;
};

export function useReveal<T extends HTMLElement>(root: RefObject<T | null>, {
  kind = "rise", selector, delay = 0, stagger = 0.1, y = 24,
  direction = "up", trigger = true, play = true,
}: RevealOptions = {}) {
  const enabled = useMotionEnabled();

  useEffect(() => {
    const el = root.current;
    if (!el || !enabled || !play || prefersReducedMotion() || typeof el.animate !== "function") return;
    let observer: IntersectionObserver | undefined;
    let watchdog = 0;
    let started = false;
    const animations: Animation[] = [];
    const restore = () => {
      window.clearTimeout(watchdog);
      animations.forEach((animation) => animation.cancel());
      el.removeAttribute("data-revealing");
    };

    const start = () => {
      if (started || document.hidden) return;
      started = true;
      observer?.disconnect();
      const targets = selector
        ? Array.from(el.querySelectorAll<HTMLElement>(selector))
        : kind === "lines"
          ? Array.from(el.querySelectorAll<HTMLElement>("[data-line]"))
          : [el];
      if (!targets.length || targets.some((target) => target.contains(document.activeElement))) return;

      const duration = kind === "image" ? 1250 : 950;
      // No inline hidden state or forwards fill. Cancellation restores the visible DOM.
      watchdog = window.setTimeout(restore, duration + delay * 1000 + targets.length * stagger * 1000 + 400);
      el.setAttribute("data-revealing", "true");
      try {
        targets.forEach((target, index) => {
          const from: Keyframe = kind === "image"
            ? { clipPath: direction === "left" ? "inset(0 100% 0 0)" : direction === "down" ? "inset(0 0 100% 0)" : "inset(100% 0 0 0)" }
            : { opacity: 0, transform: kind === "lines" ? "translateY(105%)" : `translateY(${y}px)` };
          const to: Keyframe = kind === "image"
            ? { clipPath: "inset(0 0 0 0)" }
            : { opacity: 1, transform: "translateY(0)" };
          animations.push(target.animate([from, to], {
            duration, delay: (delay + index * stagger) * 1000,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards",
          }));
        });
        if (kind === "image") {
          const imageLayer = el.querySelector<HTMLElement>("[data-image-scale]");
          if (imageLayer) animations.push(imageLayer.animate(
            [{ transform: "scale(1.1)" }, { transform: "scale(1)" }],
            { duration: 1500, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "none" },
          ));
        }
        void Promise.all(animations.map((animation) => animation.finished)).then(restore, restore);
      } catch { restore(); }
    };

    if (!trigger) start();
    else if (typeof IntersectionObserver !== "undefined") {
      try {
        observer = new IntersectionObserver((entries) => {
          if (entries.some((entry) => entry.isIntersecting)) start();
        }, { threshold: 0.01 });
        observer.observe(el);
      } catch { /* A failed observer must not hide any content. */ }
    }

    const onFocus = () => { started = true; observer?.disconnect(); restore(); };
    const onVisibility = () => { if (document.hidden) restore(); };
    el.addEventListener("focusin", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer?.disconnect();
      el.removeEventListener("focusin", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      restore();
    };
  }, [root, enabled, kind, selector, delay, stagger, y, direction, trigger, play]);
}

export function useSmoothScroll(enabled: boolean, blocked: boolean) {
  const lenisRef = useRef<Lenis | null>(null);
  const desktop = useMediaQuery("(min-width: 1024px) and (pointer: fine)");

  useEffect(() => {
    if (!enabled || !desktop || prefersReducedMotion() || blocked) return;
    let disposed = false;
    let frame = 0;
    let lenis: Lenis | null = null;
    const destroy = () => {
      cancelAnimationFrame(frame);
      try { lenis?.destroy(); } catch {
        document.documentElement.classList.remove("lenis", "lenis-smooth", "lenis-stopped");
      }
      lenis = null;
      lenisRef.current = null;
    };
    void import("lenis").then(({ default: Engine }) => {
      if (disposed) return;
      try {
        lenis = new Engine({
          duration: 1.05, smoothWheel: true, syncTouch: false,
          anchors: { offset: -80 },
          prevent: (node) => Boolean(node.closest("dialog, [data-native-scroll]")),
        });
        lenisRef.current = lenis;
        const tick = (time: number) => {
          if (disposed || !lenis) return;
          try { lenis.raf(time); } catch { destroy(); return; }
          frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      } catch { destroy(); }
    }).catch(() => { /* The browser's own scrolling is the fallback. */ });
    return () => { disposed = true; destroy(); };
  }, [enabled, desktop, blocked]);

  return lenisRef;
}
