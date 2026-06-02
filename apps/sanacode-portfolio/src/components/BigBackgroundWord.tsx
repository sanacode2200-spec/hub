type Props = {
  children: string;
  align?: "left" | "right" | "center";
};

export default function BigBackgroundWord({ children, align = "left" }: Props) {
  const alignMap = {
    left: "-0.05em",
    right: "auto",
    center: "50%",
  };

  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        left: align === "left" ? alignMap.left : align === "center" ? "50%" : "auto",
        right: align === "right" ? "-0.05em" : "auto",
        top: "50%",
        transform: align === "center" ? "translate(-50%, -50%)" : "translateY(-50%)",
        fontFamily: "var(--font-apoc), Georgia, serif",
        fontSize: "clamp(120px, 22vw, 360px)",
        lineHeight: 0.8,
        letterSpacing: "-0.08em",
        opacity: 0.05,
        pointerEvents: "none",
        userSelect: "none",
        whiteSpace: "nowrap",
        color: "currentColor",
        zIndex: 0,
      }}
    >
      {children}
    </span>
  );
}
