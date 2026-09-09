import { useCallback, useEffect, useState } from "react";
import { MotionContext, requestMotionRefresh, useMediaQuery, useSmoothScroll } from "./lib/motion";

import Loader from "./components/Loader";
import Cursor from "./components/Cursor";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Manifesto from "./components/Manifesto";
import Pillars from "./components/Pillars";
import Practice from "./components/Practice";
import About from "./components/About";
import CityScape from "./components/CityScape";
import SelectedWork from "./components/SelectedWork";
import Insights from "./components/Insights";
import Testimonial from "./components/Testimonial";
import Contact from "./components/Contact";
import ContactPanel from "./components/ContactPanel";
import Footer from "./components/Footer";
import SoundToggle from "./components/SoundToggle";

export default function App() {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [motionOff, setMotionOff] = useState(() => {
    if (typeof window === "undefined") return true;
    if (new URLSearchParams(window.location.search).get("motion") === "off") return true;
    try { return localStorage.getItem("mv-motion") === "off"; } catch { return false; }
  });
  const allowMotion = !reducedMotion && !motionOff;
  const [ready, setReady] = useState(() => !allowMotion || (typeof window !== "undefined" && Boolean(window.location.hash)));
  const [panel, setPanel] = useState(false);
  const [menu, setMenu] = useState(false);
  useSmoothScroll(allowMotion && ready, panel || menu);

  // The opening has a hard deadline and never owns a body-scroll lock.
  useEffect(() => {
    if (ready) return;
    if (!allowMotion) { setReady(true); return; }
    const deadline = window.setTimeout(() => setReady(true), 2300);
    return () => clearTimeout(deadline);
  }, [ready, allowMotion]);

  const handleReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    document.documentElement.dataset.motion = allowMotion ? "on" : "off";
    return () => { delete document.documentElement.dataset.motion; };
  }, [allowMotion]);

  useEffect(() => {
    let active = true;
    void document.fonts?.ready.then(() => { if (active) requestMotionRefresh(); });
    const onPageShow = () => requestMotionRefresh();
    window.addEventListener("pageshow", onPageShow);
    return () => {
      active = false;
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [ready]);

  const openPanel = useCallback(() => setPanel(true), []);
  const closePanel = useCallback(() => setPanel(false), []);
  const closeMenu = useCallback(() => setMenu(false), []);
  const toggleMotion = () => {
    const next = !motionOff;
    setMotionOff(next);
    try { localStorage.setItem("mv-motion", next ? "off" : "on"); } catch { /* Session preference still works. */ }
  };

  return (
    <MotionContext.Provider value={allowMotion && ready}>
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
      <Cursor suspended={panel || menu} />
      {!ready && <Loader onDone={handleReady} />}

      <Header open={menu} onOpen={() => setMenu(true)} onClose={closeMenu} />
      <SoundToggle />

      <main id="conteudo" tabIndex={-1}>
        <Hero ready={ready} onCta={openPanel} />

        <div data-nav-theme="light">
          <Manifesto />
          <Pillars />
        </div>

        <Practice />

        <div data-nav-theme="light">
          <About />
        </div>

        <CityScape />

        <div data-nav-theme="light">
          <SelectedWork />
          <Insights />
        </div>

        <Testimonial />
        <Contact onOpen={openPanel} />
      </main>

      <Footer motionDisabled={!allowMotion} systemReduced={reducedMotion} onToggleMotion={toggleMotion} />
      <ContactPanel open={panel} onClose={closePanel} />
    </MotionContext.Provider>
  );
}
