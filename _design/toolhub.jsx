import { useState, useEffect, useRef } from "react";

const tools = [
  { slug: "mov-to-mp4", name: "MOV → MP4", desc: "iPhoneの動画をそのまま変換", category: "video", icon: "🎬", status: "soon" },
  { slug: "qr-generator", name: "QR Generator", desc: "制限なし・SVG対応・広告なし", category: "generate", icon: "◼", status: "soon" },
  { slug: "heic-to-jpg", name: "HEIC → JPG", desc: "iPhoneの写真をどこでも開ける形式に", category: "image", icon: "⬡", status: "soon" },
  { slug: "image-compress", name: "Image Compress", desc: "画質を保ったまま軽量化", category: "image", icon: "◈", status: "soon" },
  { slug: "ogp-generator", name: "OGP Generator", desc: "SNSシェア画像をプレビュー", category: "generate", icon: "▣", status: "soon" },
  { slug: "json-formatter", name: "JSON Formatter", desc: "整形・バリデーション即時実行", category: "dev", icon: "⟨⟩", status: "soon" },
  { slug: "password-gen", name: "Password Gen", desc: "安全なパスワードを即生成", category: "generate", icon: "⬡", status: "soon" },
  { slug: "color-converter", name: "Color Converter", desc: "HEX / RGB / HSL 変換", category: "dev", icon: "◕", status: "soon" },
];

const categories = [
  { id: "all", label: "All" },
  { id: "video", label: "Video" },
  { id: "image", label: "Image" },
  { id: "generate", label: "Generate" },
  { id: "dev", label: "Dev" },
];

function useIntersectionObserver(ref, options = {}) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1, ...options });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return isVisible;
}

function ToolCard({ tool, index }) {
  const ref = useRef(null);
  const isVisible = useIntersectionObserver(ref);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.6s ease ${index * 0.07}s, transform 0.6s ease ${index * 0.07}s`,
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        borderRadius: "2px",
        border: "1px solid",
        borderColor: hovered ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)",
        background: hovered
          ? "rgba(255,255,255,0.04)"
          : "rgba(255,255,255,0.015)",
        padding: "32px 28px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        transition: `all 0.35s cubic-bezier(0.23, 1, 0.32, 1) ${index * 0.07}s, opacity 0.6s ease ${index * 0.07}s, transform 0.6s ease ${index * 0.07}s`,
      }}
    >
      {/* Hover glow */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.03) 0%, transparent 70%)",
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.4s ease",
        pointerEvents: "none",
      }} />

      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{
          fontSize: "22px",
          display: "block",
          transform: hovered ? "scale(1.15) translateY(-2px)" : "scale(1)",
          transition: "transform 0.35s cubic-bezier(0.23, 1, 0.32, 1)",
          lineHeight: 1,
        }}>
          {tool.icon}
        </span>
        <span style={{
          fontSize: "10px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.25)",
          fontFamily: "'DM Mono', monospace",
          border: "1px solid rgba(255,255,255,0.1)",
          padding: "3px 8px",
          borderRadius: "1px",
        }}>
          Soon
        </span>
      </div>

      {/* Name */}
      <div>
        <div style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: "22px",
          color: hovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.75)",
          lineHeight: 1.2,
          marginBottom: "8px",
          transition: "color 0.3s ease",
          fontStyle: "italic",
        }}>
          {tool.name}
        </div>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "12px",
          color: "rgba(255,255,255,0.35)",
          lineHeight: 1.6,
          letterSpacing: "0.02em",
        }}>
          {tool.desc}
        </div>
      </div>

      {/* Arrow */}
      <div style={{
        marginTop: "auto",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        opacity: hovered ? 1 : 0,
        transform: hovered ? "translateX(0)" : "translateX(-8px)",
        transition: "all 0.3s ease",
        fontFamily: "'DM Mono', monospace",
        fontSize: "11px",
        color: "rgba(255,255,255,0.5)",
        letterSpacing: "0.08em",
      }}>
        <span>Open tool</span>
        <span>→</span>
      </div>
    </div>
  );
}

export default function ToolHub() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
    const handleMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const filtered = tools.filter(t => activeCategory === "all" || t.category === activeCategory);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080808",
      color: "white",
      fontFamily: "'DM Mono', monospace",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080808; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }
        body { background: #080808; }
      `}</style>

      {/* Ambient cursor glow */}
      <div style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100vw", height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
        background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.025) 0%, transparent 70%)`,
        transition: "background 0.1s ease",
      }} />

      {/* Grain overlay */}
      <div style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: "none",
        zIndex: 1,
        opacity: 0.35,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px",
      }} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: "1100px", margin: "0 auto", padding: "0 32px" }}>

        {/* Nav */}
        <nav style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "32px 0",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(-12px)",
          transition: "all 0.6s ease",
        }}>
          <div style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "20px",
            fontStyle: "italic",
            color: "rgba(255,255,255,0.9)",
            letterSpacing: "-0.02em",
          }}>
            toolbox
          </div>
          <div style={{
            fontSize: "11px",
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}>
            Free · No signup · Browser only
          </div>
        </nav>

        {/* Hero */}
        <div style={{
          padding: "100px 0 72px",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s ease 0.1s",
        }}>
          <div style={{
            fontSize: "11px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.25)",
            marginBottom: "24px",
            fontFamily: "'DM Mono', monospace",
          }}>
            A collection of small tools
          </div>
          <h1 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(52px, 8vw, 96px)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            color: "rgba(255,255,255,0.92)",
            fontStyle: "italic",
            maxWidth: "700px",
          }}>
            Simple tools,<br />
            <span style={{ color: "rgba(255,255,255,0.35)" }}>nothing else.</span>
          </h1>
        </div>

        {/* Filter tabs */}
        <div style={{
          display: "flex",
          gap: "4px",
          marginBottom: "48px",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.6s ease 0.3s",
        }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                background: activeCategory === cat.id ? "rgba(255,255,255,0.08)" : "transparent",
                border: "1px solid",
                borderColor: activeCategory === cat.id ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)",
                color: activeCategory === cat.id ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.3)",
                padding: "8px 18px",
                borderRadius: "1px",
                cursor: "pointer",
                fontFamily: "'DM Mono', monospace",
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
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.04)",
          marginBottom: "120px",
        }}>
          {filtered.map((tool, i) => (
            <ToolCard key={tool.slug} tool={tool} index={i} />
          ))}
        </div>

        {/* Footer */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "32px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "11px",
          color: "rgba(255,255,255,0.2)",
          letterSpacing: "0.06em",
        }}>
          <span>toolbox — free forever</span>
          <span>No tracking. No ads. No signup.</span>
        </div>
      </div>
    </div>
  );
}
