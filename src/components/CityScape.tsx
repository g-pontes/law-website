import { useGsap, useReveal } from "../lib/motion";
import { useRef } from "react";
import { IMG } from "../lib/images";
import EditorialImage from "./EditorialImage";

export default function CityScape() {
  const media = useRef<HTMLDivElement>(null);
  useReveal(media, { kind: "image" });
  const root = useGsap(({ self: el, gsap }) => {
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.5,
      },
    });
    tl.fromTo("[data-city-img]", { scale: 1 }, { scale: 1.15, ease: "none" }, 0)
      .fromTo("[data-city-a]", { yPercent: 16 }, { yPercent: -16, ease: "none" }, 0)
      .fromTo("[data-city-b]", { yPercent: 25 }, { yPercent: -20, ease: "none" }, 0);
  }, []);

  return (
    <section
      ref={root}
      className="city-section relative bg-ink"
      aria-label="São Paulo"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <div ref={media} className="absolute inset-0 overflow-hidden">
          <div data-image-scale className="h-full w-full">
            <EditorialImage data-city-img src={IMG.city.src} alt={IMG.city.alt} sizes="100vw" className="h-full w-full object-cover" />
          </div>
        </div>
        <div className="absolute inset-0 bg-ink/55" />
        <div className="u-grain absolute inset-0" />

        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
          <h2
            data-city-a
            className="u-display text-[clamp(3rem,15vw,16rem)] leading-[0.95] text-bone"
          >
            SÃO PAULO
          </h2>
          <p
            data-city-b
            className="u-display mt-6 text-[clamp(1.4rem,5vw,5rem)] leading-[1.05] text-champagne"
          >
            UMA CIDADE DE
            <br />
            <em className="italic">DECISÕES.</em>
          </p>
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-[18%] text-center"
        >
          <span className="u-eyebrow text-bone/90">
            São Paulo — SP
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-6 pb-8 md:px-10">
          <span className="u-eyebrow text-bone/75">23°33′S 46°38′W</span>
          <span className="u-eyebrow text-bone/75">Atendimento presencial e remoto</span>
        </div>
      </div>
    </section>
  );
}
