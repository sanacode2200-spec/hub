"use client";

import { useEffect, useRef, useState } from "react";
import { categories, tools, type Tool } from "@/lib/tools-registry";
import { GitActivity } from "./GitActivity";

function useIntersectionObserver(ref: React.RefObject<Element | null>) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.12 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return isVisible;
}

function ToolRow({
  tool,
  index,
  selected,
  onSelect,
}: {
  tool: Tool;
  index: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(
    tool.status === "live" ? linkRef : divRef
  );
  const className = `tool-row ${selected ? "is-selected" : ""}`;
  const style = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0)" : "translateY(24px)",
    transitionDelay: `${index * 70}ms`,
  };
  const content = (
    <>
      <span className="tool-row-index">{String(index + 1).padStart(2, "0")}</span>
      <span className="tool-row-main">
        <span className="tool-row-name">{tool.name}</span>
        <span className="tool-row-desc">{tool.description}</span>
      </span>
      <span className={`tool-status ${tool.status}`}>{tool.status}</span>
    </>
  );

  if (tool.status === "live") {
    return (
      <a
        ref={linkRef}
        href={tool.url}
        className={className}
        style={style}
        onMouseEnter={onSelect}
        onFocus={onSelect}
      >
        {content}
      </a>
    );
  }

  return (
    <div
      ref={divRef}
      className={className}
      style={style}
      onMouseEnter={onSelect}
    >
      {content}
    </div>
  );
}

export default function HubClient() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedSlug, setSelectedSlug] = useState(tools[0]?.slug ?? "");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 120);
    const handleMouse = (event: MouseEvent) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouse);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  const filtered = tools.filter(
    (tool) => activeCategory === "all" || tool.category === activeCategory
  );
  const selectedTool =
    filtered.find((tool) => tool.slug === selectedSlug) ?? filtered[0] ?? tools[0];
  const liveCount = tools.filter((tool) => tool.status === "live").length;
  const soonCount = tools.length - liveCount;

  return (
    <main className={`hub-shell ${loaded ? "is-loaded" : ""}`}>
      <div
        className="cursor-light"
        style={{
          background: `radial-gradient(520px circle at ${mousePos.x}px ${mousePos.y}px, rgba(180,145,90,0.09), transparent 68%)`,
        }}
      />
      <div className="grain-layer" />
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <div className="hub-frame">
        <nav className="hub-nav glass-card" aria-label="Primary">
          <a href="/" className="hub-wordmark">
            ToolBox
          </a>
          <span className="hub-nav-note">Free / No signup / Browser only</span>
        </nav>

        <section className="hub-hero glass-card" aria-labelledby="home-title">
          <div className="hero-copy">
            <p className="hero-kicker">Small utilities for impatient work</p>
            <h1 id="home-title" className="hero-title">
              TOOLBOX
              <span>sanacode</span>
            </h1>
            <p className="hero-concept">
              Medical background. Zero-friction code.
              <span>医療のバックグラウンドから、摩擦ゼロのコードを。</span>
            </p>
          </div>

          <div className="hero-meta" aria-label="Tool summary">
            <div>
              <span className="meta-number">{String(liveCount).padStart(2, "0")}</span>
              <span className="meta-label">Live tools</span>
            </div>
            <div>
              <span className="meta-number">{String(soonCount).padStart(2, "0")}</span>
              <span className="meta-label">Coming next</span>
            </div>
            <p>
              File conversion, generation, and developer helpers that stay in
              the browser.
            </p>
          </div>
        </section>

        <div className="glass-card">
          <GitActivity />
        </div>

        <section className="tool-section" aria-label="Tools">
          <div className="category-bar" role="list" aria-label="Filter tools">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`category-button ${
                  activeCategory === category.id ? "is-active" : ""
                }`}
                onClick={() => {
                  setActiveCategory(category.id);
                  const firstTool = tools.find(
                    (tool) => category.id === "all" || tool.category === category.id
                  );
                  if (firstTool) setSelectedSlug(firstTool.slug);
                }}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="tool-layout glass-card">
            <div className="tool-list">
              {filtered.map((tool, index) => (
                <ToolRow
                  key={tool.slug}
                  tool={tool}
                  index={index}
                  selected={selectedTool?.slug === tool.slug}
                  onSelect={() => setSelectedSlug(tool.slug)}
                />
              ))}
            </div>

            {selectedTool ? (
              <aside className="tool-preview" aria-label={`${selectedTool.name} preview`}>
                <span className="preview-icon" aria-hidden="true">
                  {selectedTool.icon}
                </span>
                <span className={`tool-status ${selectedTool.status}`}>
                  {selectedTool.status}
                </span>
                <h2>{selectedTool.name}</h2>
                <p>{selectedTool.description}</p>
                {selectedTool.status === "live" ? (
                  <a href={selectedTool.url} className="preview-action">
                    Open tool
                  </a>
                ) : (
                  <span className="preview-action disabled">Coming soon</span>
                )}
              </aside>
            ) : null}
          </div>
        </section>

        <footer className="hub-footer glass-card">
          <span>ToolBox</span>
          <span>No tracking. No ads. No signup.</span>
        </footer>
      </div>
    </main>
  );
}
