"use client";
import { useEffect, useRef } from "react";
import BigBackgroundWord from "./BigBackgroundWord";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) return;

    const init = async () => {
      const gsap = (await import("gsap")).default;
      const ctx = gsap.context(() => {
        gsap.from(".hero-line", {
          yPercent: 110,
          opacity: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.1,
        });
        gsap.from(".hero-meta", {
          y: 24,
          opacity: 0,
          duration: 0.9,
          delay: 0.6,
          ease: "power2.out",
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
      id="hero"
      style={{
        minHeight: "100svh",
        background: "#0b0b0b",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        paddingBottom: "10vh",
        paddingLeft: "8vw",
        paddingRight: "8vw",
        paddingTop: "120px",
      }}
    >
      <BigBackgroundWord>SANACODE</BigBackgroundWord>

      {/* Vertical side indicator */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "calc(8vw - 48px)",
          top: "50%",
          transform: "translateY(-50%) rotate(-90deg)",
          transformOrigin: "center center",
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "10px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.25)",
          whiteSpace: "nowrap",
        }}
      >
        01 / 07
      </div>

      {/* Title block */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ overflow: "hidden" }}>
          <h1
            className="hero-line"
            style={{
              fontFamily: "var(--font-apoc-italic), Georgia, serif",
              fontSize: "clamp(64px, 11vw, 176px)",
              lineHeight: 0.86,
              letterSpacing: "-0.05em",
              fontWeight: 400,
              color: "#ffffff",
              margin: 0,
            }}
          >
            SANACODE
          </h1>
        </div>

        <div style={{ height: "0.08em" }} />

        <div style={{ overflow: "hidden" }}>
          <p
            className="hero-line"
            style={{
              fontFamily: "var(--font-apoc), Georgia, serif",
              fontSize: "clamp(36px, 5.5vw, 88px)",
              lineHeight: 0.92,
              letterSpacing: "-0.04em",
              fontWeight: 400,
              color: "rgba(255,255,255,0.8)",
              margin: 0,
            }}
          >
            Clinical Workflow,
          </p>
        </div>

        <div style={{ overflow: "hidden" }}>
          <p
            className="hero-line"
            style={{
              fontFamily: "var(--font-apoc), Georgia, serif",
              fontSize: "clamp(36px, 5.5vw, 88px)",
              lineHeight: 0.92,
              letterSpacing: "-0.04em",
              fontWeight: 400,
              color: "rgba(255,255,255,0.8)",
              margin: 0,
              paddingLeft: "14vw",
            }}
          >
            Redesigned.
          </p>
        </div>

        <div className="hero-meta" style={{ marginTop: "48px" }}>
          <p
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "11px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              margin: 0,
            }}
          >
            Physical Therapist / Software Builder / AI Native Creator
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="hero-meta"
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "48px",
          right: "8vw",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "10px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.25)",
        }}
      >
        Scroll
        <span
          style={{
            display: "block",
            width: "48px",
            height: "1px",
            background: "rgba(255,255,255,0.2)",
          }}
        />
      </div>
    </section>
  );
}
