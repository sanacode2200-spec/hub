import type { Metadata } from "next";
import { Instrument_Serif, DM_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Convert iPhone MOV to MP4 Online — Free Browser Tool",
  description:
    "Convert iPhone MOV videos to MP4 in your browser. Free, no signup, no ads, and no file uploads to a server.",
  keywords: [
    "MOV to MP4",
    "convert MOV to MP4",
    "iPhone video converter",
    "MOV to MP4 online free",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSerif.variable} ${dmMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
