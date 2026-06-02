"use client";
import { useEffect, useRef } from "react";

// graphicmill → text-overflow のようなスクロール連動の縦テキスト出現。
// Aboutセクション手前まではGITLOGの後ろに隠れていて、
// スクロールするにつれGITLOGの右から黒い文字が現れて縦に流れる。

const COL1 = [
  "feat: patient daily record SOAP",
  "fix: billing off-by-one monthly",
  "feat: AI copy-text for notes",
  "refactor: schedule performance",
  "chore: upgrade Next.js 15.5",
  "feat: staff shift management",
  "fix: duplicate patient ID",
  "feat: offline-first caching",
  "refactor: dashboard widgets",
  "feat: export monthly CSV",
  "fix: timezone edge case",
  "feat: prescription tracking",
];

const COL2 = [
  "refactor: db connection pool",
  "feat: mobile horizontal scroll",
  "fix: dark mode billing panel",
  "feat: patient progress chart",
  "docs: update API reference",
  "feat: appointment reminders",
  "fix: monthly rounding error",
  "refactor: record validation",
  "feat: staff role permissions",
  "fix: SOAP copy encoding",
  "feat: real-time schedule sync",
  "chore: E2E billing flow tests",
];

export default function VerticalFlowText() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) return;

    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      // 初期状態: GITLOGの後ろに隠れている（左にオフセット + 不可視）
      gsap.set(containerRef.current, { x: -55, opacity: 0 });

      // AboutセクションへのスクロールでGITLOGの右から現れる
      gsap.to(containerRef.current, {
        x: 0,
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#about",
          start: "top 70%",
          end: "top 10%",
          scrub: 1.2,
        },
      });

      // ページ全体スクロールの約38%速度で上に流れる（parallax）
      gsap.to(containerRef.current, {
        y: "-40vh",
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    };

    let cleanup: (() => void) | undefined;
    init().then((c) => { if (typeof c === "function") cleanup = c; });
    return () => cleanup?.();
  }, []);

  const colStyle: React.CSSProperties = {
    writingMode: "vertical-rl",
    transform: "rotate(180deg)",
    mixBlendMode: "difference",
    color: "white",
    display: "flex",
    flexDirection: "column",
    gap: "22px",
  };

  const lineStyle: React.CSSProperties = {
    fontFamily: "'DM Mono', 'Courier New', monospace",
    fontSize: "9px",
    letterSpacing: "0.05em",
    opacity: 0.28,
    whiteSpace: "nowrap",
    display: "block",
  };

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        left: "38px",
        top: "20vh",
        zIndex: 6,
        pointerEvents: "none",
        display: "flex",
        gap: "18px",
      }}
    >
      {/* 1列目 */}
      <div style={colStyle}>
        {COL1.map((commit, i) => (
          <span key={i} style={lineStyle}>{commit}</span>
        ))}
      </div>

      {/* 2列目：少し上にオフセットして段差をつける */}
      <div style={{ ...colStyle, marginTop: "60px" }}>
        {COL2.map((commit, i) => (
          <span key={i} style={lineStyle}>{commit}</span>
        ))}
      </div>
    </div>
  );
}
