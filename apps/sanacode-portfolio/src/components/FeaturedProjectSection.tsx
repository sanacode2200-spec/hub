"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { projects } from "@/data/projects";
import SectionNumber from "./SectionNumber";
import BigBackgroundWord from "./BigBackgroundWord";

const project = projects[0];

export default function FeaturedProjectSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) return;

    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.from(".reflow-title", {
          y: 80,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: ".reflow-title",
            start: "top 85%",
          },
        });

        const img = sectionRef.current?.querySelector(".reflow-image") as HTMLElement;
        if (img) {
          gsap.fromTo(
            img,
            { y: 80, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.2,
              ease: "power2.out",
              immediateRender: false,
              scrollTrigger: { trigger: img, start: "top 90%" },
            }
          );
          gsap.to(img, {
            y: -80,
            ease: "none",
            scrollTrigger: {
              trigger: img,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          });
        }
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
      id="reflow"
      style={{
        background: "#0b0b0b",
        color: "#ffffff",
        paddingTop: "160px",
        paddingBottom: "200px",
        paddingLeft: "8vw",
        paddingRight: "8vw",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <BigBackgroundWord>REFLOW</BigBackgroundWord>

      {/* Header */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <SectionNumber number="03" />

        <div className="reflow-title">
          <h2
            style={{
              fontFamily: "var(--font-apoc-italic), Georgia, serif",
              fontSize: "clamp(56px, 9vw, 144px)",
              lineHeight: 0.9,
              letterSpacing: "-0.05em",
              fontWeight: 400,
              margin: 0,
              color: "#ffffff",
            }}
          >
            ReFlow
          </h2>
          <p
            style={{
              fontFamily: "var(--font-apoc), Georgia, serif",
              fontSize: "clamp(24px, 3vw, 48px)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "rgba(255,255,255,0.5)",
              marginTop: "12px",
              maxWidth: "640px",
            }}
          >
            Rehabilitation workflow,
            <br />
            from record to billing.
          </p>
        </div>

        <p
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "clamp(15px, 1.3vw, 18px)",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.4)",
            marginTop: "40px",
            maxWidth: "480px",
          }}
        >
          {project.description}
        </p>
      </div>

      {/* Main dashboard image — large, right-offset */}
      <div
        style={{
          marginTop: "100px",
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <div
          className="reflow-image"
          style={{ width: "min(84vw, 1200px)" }}
        >
          <Image
            src={project.panels[0].src}
            alt={project.panels[0].alt}
            width={1400}
            height={900}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "16px",
              boxShadow: "0 48px 140px rgba(0,0,0,0.6)",
              transform: `rotate(${project.panels[0].rotate}deg)`,
            }}
            priority
          />
          <p
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "11px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
              marginTop: "20px",
              textAlign: "right",
            }}
          >
            {project.panels[0].caption}
          </p>
        </div>
      </div>
    </section>
  );
}
