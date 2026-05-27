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
  title: "Toolbox — Simple free tools, nothing else",
  description:
    "ブラウザだけで使える無料ツール集。登録不要・広告なし・データ保存なし。MOV→MP4変換、QRコード生成など。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body
        className={`${instrumentSerif.variable} ${dmMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
