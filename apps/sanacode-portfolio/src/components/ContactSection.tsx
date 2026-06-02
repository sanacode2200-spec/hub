"use client";
import { useEffect, useRef } from "react";
import SectionNumber from "./SectionNumber";

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) return;

    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.from(".contact-title", {
          y: 60,
          opacity: 0,
          duration: 1.2,
          ease: "power2.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: ".contact-title",
            start: "top 90%",
          },
        });
        gsap.from(".contact-link", {
          y: 20,
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power2.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: ".contact-link",
            start: "top 95%",
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
      id="contact"
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#0b0b0b",
        padding: "160px 8vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <SectionNumber number="07" />

      <p
        className="contact-title"
        style={{
          fontFamily: "var(--font-apoc), Georgia, serif",
          fontSize: "clamp(40px, 6.5vw, 104px)",
          lineHeight: 0.92,
          letterSpacing: "-0.05em",
          fontWeight: 400,
          margin: 0,
          maxWidth: "900px",
          color: "#0b0b0b",
        }}
      >
        Let's build calmer software.
      </p>

      <p
        className="contact-title"
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "clamp(15px, 1.3vw, 18px)",
          lineHeight: 1.7,
          color: "rgba(11,11,11,0.45)",
          marginTop: "40px",
          maxWidth: "480px",
        }}
      >
        Open to small tools, clinical workflow experiments, and product collaboration.
      </p>

      <div
        style={{
          display: "flex",
          gap: "48px",
          marginTop: "64px",
        }}
      >
        {[
          { label: "GitHub", href: "https://github.com/sanacode2200-spec" },
          { label: "Email", href: "mailto:gragra2200@gmail.com" },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="contact-link"
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "11px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#0b0b0b",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              opacity: 0.6,
              transition: "opacity 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
          >
            {label} →
          </a>
        ))}
      </div>

      {/* Footer note */}
      <p
        style={{
          position: "absolute",
          bottom: "48px",
          left: "8vw",
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "10px",
          letterSpacing: "0.12em",
          color: "rgba(11,11,11,0.2)",
          textTransform: "uppercase",
        }}
      >
        © 2026 Sanacode
      </p>
    </section>
  );
}
