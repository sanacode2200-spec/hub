"use client";
import { useEffect } from "react";

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) return;

    let lenis: import("lenis").default;

    const init = async () => {
      const Lenis = (await import("lenis")).default;
      lenis = new Lenis({
        duration: 1.6,
        smoothWheel: true,
        wheelMultiplier: 0.75,
        touchMultiplier: 1.0,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = (await import("gsap")).default;
      gsap.registerPlugin(ScrollTrigger);

      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    };

    init();
    return () => {
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
