"use client";
import { useEffect, useRef, useState } from "react";
import { tools } from "@/data/tools";
import SectionNumber from "./SectionNumber";

export default function SelectedToolsSection() {
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
        gsap.from(".tool-row", {
          y: 32,
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power2.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: ".tool-row",
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
      id="tools"
      style={{
        minHeight: "100vh",
        background: "#f4f4f1",
        color: "#0b0b0b",
        padding: "160px 8vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <SectionNumber number="04" />

      <h2
        style={{
          fontFamily: "var(--font-apoc), Georgia, serif",
          fontSize: "clamp(36px, 5vw, 80px)",
          lineHeight: 0.95,
          letterSpacing: "-0.04em",
          fontWeight: 400,
          marginBottom: "80px",
          color: "#0b0b0b",
        }}
      >
        Selected Tools
      </h2>

      <div>
        {tools.map((tool, i) => (
          <div
            key={tool.number}
            className="tool-row"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              display: "grid",
              gridTemplateColumns: "64px 1fr max-content",
              gap: "32px",
              paddingBlock: "36px",
              borderTop: "1px solid rgba(11,11,11,0.15)",
              alignItems: "center",
              cursor: tool.href ? "pointer" : "default",
            }}
            onClick={() => tool.href && window.open(tool.href, "_blank")}
          >
            {/* Number */}
            <span
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: "11px",
                letterSpacing: "0.14em",
                opacity: 0.35,
                textTransform: "uppercase",
              }}
            >
              {tool.number}
            </span>

            {/* Title + description */}
            <div>
              <p
                style={{
                  fontFamily: "var(--font-apoc), Georgia, serif",
                  fontSize: "clamp(20px, 2.2vw, 32px)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  margin: 0,
                  transform: hoveredIndex === i ? "translateX(10px)" : "translateX(0)",
                  transition: "transform 0.4s cubic-bezier(.2,.8,.2,1)",
                }}
              >
                {tool.title}
              </p>
              <p
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: "13px",
                  lineHeight: 1.6,
                  color: "rgba(11,11,11,0.45)",
                  marginTop: "6px",
                }}
              >
                {tool.description}
              </p>
            </div>

            {/* Arrow */}
            <span
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: "20px",
                opacity: hoveredIndex === i ? 0.7 : 0.2,
                transform: hoveredIndex === i ? "translateX(4px)" : "translateX(0)",
                transition: "opacity 0.3s ease, transform 0.4s cubic-bezier(.2,.8,.2,1)",
                color: tool.href ? "#0b0b0b" : "transparent",
              }}
            >
              →
            </span>
          </div>
        ))}

        {/* Bottom border */}
        <div style={{ borderTop: "1px solid rgba(11,11,11,0.15)" }} />
      </div>
    </section>
  );
}
