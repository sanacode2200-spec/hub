"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";

// 位置固定・スクロール速度と回転が連動するバッジ
// 中心に sana3.png の丸いアイコン、外周に循環テキスト
// 全体が一緒に回転する

const SIZE = 148;
const CENTER = SIZE / 2;
const RADIUS = 58; // テキストパスの半径

export default function CircularBadge() {
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) return;

    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      // ページ全体のスクロールに合わせて540度回転（1.5周）
      // scrub で速度が直接連動
      gsap.to(badgeRef.current, {
        rotation: 540,
        ease: "none",
        transformOrigin: "center center",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });
    };

    let cleanup: (() => void) | undefined;
    init().then((c) => { if (typeof c === "function") cleanup = c; });
    return () => cleanup?.();
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: "32px",
        right: "8vw",
        zIndex: 50,
        pointerEvents: "none",
        mixBlendMode: "difference",
      }}
    >
      <div
        ref={badgeRef}
        style={{
          width: SIZE,
          height: SIZE,
          position: "relative",
        }}
      >
        {/* 循環テキスト */}
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{ position: "absolute", inset: 0 }}
          aria-hidden="true"
        >
          <defs>
            <path
              id="badgeCirclePath"
              d={`M${CENTER},${CENTER}
                  m-${RADIUS},0
                  a${RADIUS},${RADIUS} 0 1,1 ${RADIUS * 2},0
                  a${RADIUS},${RADIUS} 0 1,1 -${RADIUS * 2},0`}
            />
          </defs>
          <text
            style={{
              fontSize: "11px",
              fontFamily: "Inter, system-ui, sans-serif",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fill: "white",
            }}
          >
            <textPath href="#badgeCirclePath">
              SANACODE — CLINICAL WORKFLOW — SOFTWARE —
            </textPath>
          </text>
        </svg>

        {/* 中心: sana3.png 丸アイコン */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 52,
            height: 52,
            borderRadius: "50%",
            overflow: "hidden",
            background: "white",
          }}
        >
          <Image
            src="/images/sana3.png"
            alt="Sanacode"
            width={52}
            height={52}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      </div>
    </div>
  );
}
