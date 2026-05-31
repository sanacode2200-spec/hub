import type { Metadata } from "next";
import { Instrument_Serif, DM_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: "400",
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
        className={`${instrumentSerif.variable} ${dmMono.variable} ${apoc.variable} ${omotenashi.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
