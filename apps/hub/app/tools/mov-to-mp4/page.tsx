import type { Metadata } from "next";
import MovToMp4Converter from "@/components/tools/MovToMp4Converter";

export const metadata: Metadata = {
  title: "Convert iPhone MOV to MP4 Online — Free Browser Tool | Toolbox",
  description:
    "Convert iPhone MOV videos to MP4 in your browser. Free, no signup, no ads, and no file uploads to a server.",
  keywords: [
    "MOV to MP4",
    "convert MOV to MP4",
    "iPhone video converter",
    "MOV to MP4 online free",
  ],
};

export default function MovToMp4Page() {
  return <MovToMp4Converter />;
}
