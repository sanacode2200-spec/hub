"use client";
import { useEffect, useRef } from "react";

type Props = {
  text: string;
  size?: number;
  opacity?: number;
};

export default function CircularText({ text, size = 140, opacity = 0.6 }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce || !svgRef.current) return;

    let angle = 0;
    let raf: number;
    const tick = () => {
      angle += 0.15;
      if (svgRef.current) {
        svgRef.current.style.transform = `rotate(${angle}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={{ opacity, display: "block" }}
      aria-hidden="true"
    >
      <defs>
        <path
          id="circlePath"
          d="M100,100 m-75,0 a75,75 0 1,1 150,0 a75,75 0 1,1 -150,0"
        />
      </defs>
      <text
        style={{
          fontSize: "13px",
          fontFamily: "Inter, system-ui, sans-serif",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          fill: "currentColor",
        }}
      >
        <textPath href="#circlePath">{text}</textPath>
      </text>
    </svg>
  );
}
