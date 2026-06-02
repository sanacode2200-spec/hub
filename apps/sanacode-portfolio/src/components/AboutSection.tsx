"use client";
import { useEffect, useRef } from "react";
import SectionNumber from "./SectionNumber";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) return;

    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.from(".about-statement", {
          y: 60,
          opacity: 0,
          duration: 1.2,
          ease: "power2.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: ".about-statement",
            start: "top 85%",
          },
        });
        gsap.from(".about-sub", {
          y: 40,
          opacity: 0,
          duration: 1.0,
          ease: "power2.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: ".about-sub",
            start: "top 90%",
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
    <section
      ref={sectionRef}
      id="about"
      style={{
        minHeight: "100vh",
        background: "#f4f4f1",
        color: "#0b0b0b",
        padding: "160px 8vw",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <SectionNumber number="02" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "8vw",
          alignItems: "end",
        }}
      >
        {/* Left: metadata */}
        <div className="about-sub">
          <p
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "11px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              opacity: 0.45,
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            Physical Therapist
            <br />
            Software Builder
            <br />
            AI Native Creator
            <br />
            Based in Japan
          </p>
        </div>

        {/* Right: statement */}
        <div>
          <p
            className="about-statement"
            style={{
              fontFamily: "var(--font-apoc), Georgia, serif",
              fontSize: "clamp(28px, 3.5vw, 56px)",
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              fontWeight: 400,
              margin: 0,
              color: "#0b0b0b",
            }}
          >
            I work in rehabilitation and build software around the invisible friction of clinical workflow.
          </p>

          <p
            className="about-sub"
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "clamp(15px, 1.3vw, 18px)",
              lineHeight: 1.7,
              color: "rgba(11,11,11,0.55)",
              marginTop: "32px",
              maxWidth: "520px",
            }}
          >
            Sanacode is a small practice of turning daily clinical problems into tools — from records and billing to AI-assisted workflows.
          </p>
        </div>
      </div>
    </section>
  );
}
