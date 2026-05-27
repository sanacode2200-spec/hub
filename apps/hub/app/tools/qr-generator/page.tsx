import type { Metadata } from "next"
import QrGenerator from "@/components/tools/QrGenerator"

export const metadata: Metadata = {
  title: "AI Neon QR Code Generator for Social Links | Toolbox",
  description:
    "Generate AI-neon QR codes for social profiles, campaigns, landing pages, email, and phone. Download SVG or high-res PNG for free.",
  keywords: [
    "QR code generator",
    "free QR code",
    "QR code maker",
    "social QR code",
    "AI neon QR",
    "no scan limit QR",
    "QR code download PNG SVG",
    "online QR generator",
  ],
  openGraph: {
    title: "AI Neon QR Code Generator for Social Links",
    description:
      "Generate share-ready QR codes with AI neon, aurora, mesh, and mono palettes. Custom colors, logo embed, SVG & PNG download.",
    type: "website",
  },
}

export default function QrGeneratorPage() {
  return <QrGenerator />
}
