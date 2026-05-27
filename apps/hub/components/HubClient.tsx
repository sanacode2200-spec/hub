"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { tools, categories, type Tool } from "@/lib/tools-registry";

function useIntersectionObserver(ref: React.RefObject<Element | null>) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return isVisible;
}

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(ref);
  const [hovered, setHovered] = useState(false);

  const cardInner = (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(32px)",
        cursor: tool.status === "live" ? "pointer" : "default",
        position: "relative",
        overflow: "hidden",
        borderRadius: "2px",
        border: "1px solid",
        borderColor: hovered
          ? "rgba(255,255,255,0.15)"
          : "rgba(255,255,255,0.06)",
        background: hovered
          ? "rgba(255,255,255,0.04)"
          : "rgba(255,255,255,0.015)",
        padding: "32px 28px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        transition: `all 0.35s cubic-bezier(0.23,1,0.32,1) ${index * 0.07}s, opacity 0.6s ease ${index * 0.07}s, transform 0.6s ease ${index * 0.07}s`,
        height: "100%",
      }}
    >
      {/* Hover glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.03) 0%, transparent 70%)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
        }}
      />

      {/* Top row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <span
          style={{
            fontSize: "22px",
            display: "block",
            transform: hovered
              ? "scale(1.15) translateY(-2px)"
              : "scale(1)",
            transition: "transform 0.35s cubic-bezier(0.23,1,0.32,1)",
            lineHeight: 1,
          }}
        >
          {tool.icon}
        </span>
        <span
          style={{
            fontSize: "10px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color:
              tool.status === "live"
                ? "rgba(255,255,255,0.5)"
                : "rgba(255,255,255,0.25)",
            fontFamily: "var(--font-dm-mono), monospace",
            border: "1px solid",
            borderColor:
              tool.status === "live"
                ? "rgba(255,255,255,0.25)"
                : "rgba(255,255,255,0.1)",
            padding: "3px 8px",
            borderRadius: "1px",
          }}
        >
          {tool.status === "live" ? "Live" : "Soon"}
        </span>
      </div>

      {/* Name + description */}
      <div>
        <div
          style={{
            fontFamily: "var(--font-instrument-serif), serif",
            fontSize: "22px",
            color: hovered
              ? "rgba(255,255,255,0.95)"
              : "rgba(255,255,255,0.75)",
            lineHeight: 1.2,
            marginBottom: "8px",
            transition: "color 0.3s ease",
            fontStyle: "italic",
          }}
        >
          {tool.name}
        </div>
        <div
          style={{
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: "12px",
            color: "rgba(255,255,255,0.35)",
            lineHeight: 1.6,
            letterSpacing: "0.02em",
          }}
        >
          {tool.description}
        </div>
      </div>

      {/* Arrow (live only) */}
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          opacity: hovered && tool.status === "live" ? 1 : 0,
          transform: hovered ? "translateX(0)" : "translateX(-8px)",
          transition: "all 0.3s ease",
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: "11px",
          color: "rgba(255,255,255,0.5)",
          letterSpacing: "0.08em",
        }}
      >
        <span>Open tool</span>
        <span>→</span>
      </div>
    </div>
  );

  if (tool.status === "live") {
    return (
      <Link href={tool.url} style={{ textDecoration: "none", display: "block" }}>
        {cardInner}
      </Link>
    );
  }
  return cardInner;
}

export default function HubClient() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    const handleMouse = (e: MouseEvent) =>
      setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouse);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  const filtered = tools.filter(
    (t) => activeCategory === "all" || t.category === activeCategory
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080808",
        color: "white",
        fontFamily: "var(--font-dm-mono), monospace",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient cursor glow */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 0,
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.025) 0%, transparent 70%)`,
          transition: "background 0.1s ease",
        }}
      />

      {/* Grain overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          zIndex: 1,
          opacity: 0.35,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 32px",
        }}
      >
        {/* Nav */}
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "32px 0",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(-12px)",
            transition: "all 0.6s ease",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-instrument-serif), serif",
              fontSize: "20px",
              fontStyle: "italic",
              color: "rgba(255,255,255,0.9)",
              letterSpacing: "-0.02em",
            }}
          >
            toolbox
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Free · No signup · Browser only
          </div>
        </nav>

        {/* Hero */}
        <div
          style={{
            padding: "100px 0 72px",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s ease 0.1s",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
              marginBottom: "24px",
              fontFamily: "var(--font-dm-mono), monospace",
            }}
          >
            A collection of small tools
          </div>
          <h1
            style={{
              fontFamily: "var(--font-instrument-serif), serif",
              fontSize: "clamp(52px, 8vw, 96px)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              color: "rgba(255,255,255,0.92)",
              fontStyle: "italic",
              maxWidth: "700px",
            }}
          >
            Simple tools,
            <br />
            <span style={{ color: "rgba(255,255,255,0.35)" }}>
              nothing else.
            </span>
          </h1>
        </div>

        {/* Category filter tabs */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            marginBottom: "48px",
            flexWrap: "wrap",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.6s ease 0.3s",
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                background:
                  activeCategory === cat.id
                    ? "rgba(255,255,255,0.08)"
                    : "transparent",
                border: "1px solid",
                borderColor:
                  activeCategory === cat.id
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(255,255,255,0.06)",
                color:
                  activeCategory === cat.id
                    ? "rgba(255,255,255,0.85)"
                    : "rgba(255,255,255,0.3)",
                padding: "8px 18px",
                borderRadius: "1px",
                cursor: "pointer",
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: "11px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                transition: "all 0.2s ease",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Tool grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.04)",
            marginBottom: "120px",
          }}
        >
          {filtered.map((tool, i) => (
            <ToolCard key={tool.slug} tool={tool} index={i} />
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "32px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "11px",
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.06em",
          }}
        >
          <span>toolbox — free forever</span>
          <span>No tracking. No ads. No signup.</span>
        </div>
      </div>
    </div>
  );
}
