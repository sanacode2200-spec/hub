type Props = {
  number: string;
  total?: string;
};

export default function SectionNumber({ number, total = "07" }: Props) {
  return (
    <span
      style={{
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: "11px",
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        opacity: 0.5,
        display: "block",
        marginBottom: "40px",
      }}
    >
      {number} / {total}
    </span>
  );
}
