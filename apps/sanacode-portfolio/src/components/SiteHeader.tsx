"use client";
import { useEffect, useRef, useState } from "react";

export default function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      ref={headerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 50,
        padding: "28px 8vw",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mixBlendMode: "difference",
        color: "white",
        transition: "padding 0.4s ease",
      }}
    >
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{
          fontFamily: "var(--font-apoc), Georgia, serif",
          fontSize: "15px",
          letterSpacing: "0.06em",
          color: "white",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
      >
        Sanacode
      </button>

      <nav style={{ display: "flex", gap: "40px" }}>
        {[
          { label: "Work", target: "reflow" },
          { label: "Tools", target: "tools" },
          { label: "Contact", target: "contact" },
        ].map(({ label, target }) => (
          <button
            key={label}
            onClick={() => scrollTo(target)}
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "11px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "white",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              opacity: 0.8,
            }}
          >
            {label}
          </button>
        ))}
      </nav>
    </header>
  );
}
