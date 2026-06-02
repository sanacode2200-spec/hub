"use client";
import { useEffect, useRef, useState } from "react";
import { writing } from "@/data/writing";
import SectionNumber from "./SectionNumber";

export default function WritingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) return;

    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.from(".writing-row", {
          y: 32,
          opacity: 0,
          duration: 0.8,
          stagger: 0.07,
          ease: "power2.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: ".writing-row",
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
      id="writing"
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        color: "#ffffff",
        padding: "160px 8vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <SectionNumber number="05" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "8vw",
          alignItems: "start",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "var(--font-apoc), Georgia, serif",
              fontSize: "clamp(36px, 5vw, 80px)",
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              fontWeight: 400,
              color: "#ffffff",
            }}
          >
            Writing
          </h2>
          <p
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "13px",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.35)",
              marginTop: "24px",
              maxWidth: "280px",
            }}
          >
            Notes on clinical workflow, AI tools, rehabilitation, and small software experiments.
          </p>
        </div>

        <div>
          {writing.map((item, i) => (
            <div
              key={item.number}
              className="writing-row"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: "32px",
                paddingBlock: "28px",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                cursor: item.href ? "pointer" : "default",
              }}
            >
              <div style={{ display: "flex", gap: "24px", alignItems: "baseline" }}>
                <span
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: "10px",
                    letterSpacing: "0.14em",
                    color: "rgba(255,255,255,0.25)",
                    flexShrink: 0,
                  }}
                >
                  {item.number}
                </span>
                <p
                  style={{
                    fontFamily: "var(--font-apoc), Georgia, serif",
                    fontSize: "clamp(16px, 1.6vw, 22px)",
                    lineHeight: 1.3,
                    letterSpacing: "-0.02em",
                    margin: 0,
                    color: hoveredIndex === i ? "#ffffff" : "rgba(255,255,255,0.7)",
                    transform: hoveredIndex === i ? "translateX(8px)" : "translateX(0)",
                    transition: "color 0.3s ease, transform 0.4s cubic-bezier(.2,.8,.2,1)",
                  }}
                >
                  {item.title}
                </p>
              </div>
              <span
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: "10px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.2)",
                  flexShrink: 0,
                }}
              >
                {item.topic}
              </span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />
        </div>
      </div>
    </section>
  );
}
