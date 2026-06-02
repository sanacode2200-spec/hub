"use client";
import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { id: "hero",    num: "01" },
  { id: "about",   num: "02" },
  { id: "reflow",  num: "03" },
  { id: "tools",   num: "04" },
  { id: "writing", num: "05" },
  { id: "contact", num: "07" },
];

const CHARS = "0123456789";

export default function SectionCounter() {
  const [display, setDisplay] = useState("01");
  const sectionNum = useRef("01");
  const scrambleTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // セクション追跡（スクロール）
    const onScroll = () => {
      const scrollY = window.scrollY + window.innerHeight * 0.45;
      let num = "01";
      for (const { id, num: n } of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) num = n;
      }
      if (num !== sectionNum.current) {
        sectionNum.current = num;
        // セクション変化時もスクランブル
        triggerScramble();
      }
    };

    // マウス移動でスクランブル
    const onMouseMove = () => triggerScramble();

    const triggerScramble = () => {
      if (scrambleTimer.current) clearInterval(scrambleTimer.current);
      if (settleTimer.current) clearTimeout(settleTimer.current);

      scrambleTimer.current = setInterval(() => {
        const scrambled = sectionNum.current
          .split("")
          .map(() => CHARS[Math.floor(Math.random() * CHARS.length)])
          .join("");
        setDisplay(scrambled);
      }, 45);

      settleTimer.current = setTimeout(() => {
        if (scrambleTimer.current) clearInterval(scrambleTimer.current);
        scrambleTimer.current = null;
        setDisplay(sectionNum.current);
      }, 380);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      if (scrambleTimer.current) clearInterval(scrambleTimer.current);
      if (settleTimer.current) clearTimeout(settleTimer.current);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        left: "-1vw",
        bottom: "6vh",
        zIndex: 5,
        pointerEvents: "none",
        display: "flex",
        gap: "0.01em",
      }}
    >
      {display.split("").map((digit, i) => (
        <span
          key={i}
          style={{
            fontFamily: "var(--font-apoc), Georgia, serif",
            fontSize: "clamp(80px, 12vw, 160px)",
            lineHeight: 0.9,
            letterSpacing: "-0.06em",
            fontWeight: 400,
            color: "rgba(128,128,128,0.09)",
            display: "block",
          }}
        >
          {digit}
        </span>
      ))}
    </div>
  );
}
