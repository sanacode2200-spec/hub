"use client";

// GITLOG: 大きなアウトライン文字、rotate(90deg)で文字の上が右向き、
// 文字の下(= スクリーン左側)が隠れ、縁だけ見えて中が透明
export default function SideLabel() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        // left値はフォントサイズに合わせて調整:
        // 120px font → 文字の高さ120px → 右半分(60px)だけ見せる
        // transform-originがelement中心なので: left = -(textWidth/2) + (120/2 - visible)
        // 120px font, 文字の右側(上部)35px程度だけ見せる
        // center = left + textWidth/2 ≈ left + 220
        // 見せたい量 = 35px → center = 35 - 60 = -25 → left = -245
        left: "-245px",
        top: "50%",
        transform: "translateY(-50%) rotate(90deg)",
        transformOrigin: "center center",
        zIndex: 40,
        pointerEvents: "none",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-apoc), Georgia, serif",
          fontSize: "120px",
          lineHeight: 1,
          letterSpacing: "0.04em",
          // 中が透明・縁だけ表示
          WebkitTextStroke: "1px rgba(255,255,255,0.55)",
          color: "transparent",
          display: "block",
          mixBlendMode: "difference",
        }}
      >
        GITLOG
      </span>
    </div>
  );
}
