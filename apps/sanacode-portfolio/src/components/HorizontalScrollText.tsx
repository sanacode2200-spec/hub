"use client";
import { useEffect, useRef } from "react";

type Props = {
  text?: string;
  background?: string;
  color?: string;
};

const DEFAULT_TEXT =
  "REHABILITATION WORKFLOW — CLINICAL SOFTWARE — REHABILITATION WORKFLOW — CLINICAL SOFTWARE —";

export default function HorizontalScrollText({
  text = DEFAULT_TEXT,
  background = "#f4f4f1",
  color = "rgba(11,11,11,0.08)",
}: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) return;

    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.to(".h-scroll-inner", {
          xPercent: -42,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }, sectionRef);

      return () => ctx.revert();
    };

    let cleanup: (() => void) | undefined;
    init().then((c) => { if (typeof c === "function") cleanup = c; });
    return () => cleanup?.();
  }, []);

  return (
    <div
      ref={sectionRef}
      style={{
        background,
        overflow: "hidden",
        paddingBlock: "24px",
        borderTop: `1px solid ${color}`,
        borderBottom: `1px solid ${color}`,
      }}
    >
      <p
        className="h-scroll-inner"
        style={{
          fontFamily: "var(--font-apoc), Georgia, serif",
          fontSize: "clamp(56px, 8vw, 112px)",
          lineHeight: 1,
          letterSpacing: "-0.04em",
          whiteSpace: "nowrap",
          color,
          margin: 0,
          display: "inline-block",
          paddingLeft: "8vw",
          willChange: "transform",
        }}
      >
        {text}
      </p>
    </div>
  );
}
