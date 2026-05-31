import type { Metadata } from "next";
import { Instrument_Serif, DM_Mono, Noto_Serif_JP, Yuji_Mai } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: "400",
});

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["400"],
  preload: false,
});

const yujiMai = Yuji_Mai({
  variable: "--font-yuji-mai",
  subsets: ["latin"],
  weight: "400",
  preload: false,
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const apoc = localFont({
  src: "./fonts/Apoc-Revelations.woff2",
  variable: "--font-apoc",
  display: "swap",
});

const omotenashi = localFont({
  src: "./fonts/OmotenashiMincho.otf",
  variable: "--font-omotenashi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Toolbox — Simple free tools, nothing else",
  description:
    "A collection of free browser tools. No signup, no ads, no data stored. MOV to MP4, QR generator, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSerif.variable} ${dmMono.variable} ${apoc.variable} ${omotenashi.variable} ${notoSerifJP.variable} ${yujiMai.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
