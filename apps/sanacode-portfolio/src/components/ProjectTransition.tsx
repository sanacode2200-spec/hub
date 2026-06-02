"use client";
import { useEffect, useRef } from "react";
import CircularText from "./CircularText";

export default function ProjectTransition() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) return;

    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".transition-title",
          { opacity: 0, scale: 0.96, y: 40 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            immediateRender: false,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              end: "center center",
              scrub: 0.8,
            },
          }
        );
      }, sectionRef);

      return () => ctx.revert();
    };

    let cleanup: (() => void) | undefined;
    init().then((c) => { if (typeof c === "function") cleanup = c; });
    return () => cleanup?.();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#0b0b0b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: "160px 8vw",
      }}
    >
      <div className="transition-title" style={{ textAlign: "center" }}>
        <p
          style={{
            fontFamily: "var(--font-apoc), Georgia, serif",
            fontSize: "clamp(40px, 6vw, 96px)",
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            fontWeight: 400,
            margin: 0,
          }}
        >
          Scroll Down
          <br />
          to Next Project
        </p>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "64px",
          right: "8vw",
          color: "rgba(11,11,11,0.4)",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
        aria-hidden="true"
      >
        <CircularText text="SANACODE — SELECTED WORK —" size={100} opacity={0.4} />
        <span
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "40px",
            fontWeight: 200,
            lineHeight: 1,
            transform: "rotate(45deg)",
            display: "block",
          }}
        >
          ↓
        </span>
      </div>
    </section>
  );
}
