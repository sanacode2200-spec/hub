export type ToolStatus = "live" | "soon";
export type ToolCategoryId = "all" | "video" | "image" | "generate" | "dev";

export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: Exclude<ToolCategoryId, "all">;
  icon: string;
  status: ToolStatus;
  url: string;
}

export interface Category {
  id: ToolCategoryId;
  label: string;
}

export const categories: Category[] = [
  { id: "all", label: "All" },
  { id: "video", label: "Video" },
  { id: "image", label: "Image" },
  { id: "generate", label: "Generate" },
  { id: "dev", label: "Dev" },
];

export const tools: Tool[] = [
  {
    slug: "mov-to-mp4",
    name: "MOV → MP4",
    description: "Convert iPhone MOV videos to MP4 instantly",
    category: "video",
    icon: "🎬",
    status: "live",
    url: "/tools/mov-to-mp4",
  },
  {
    slug: "qr-generator",
    name: "QR Generator",
    description: "AI neon QR codes for social links and campaigns",
    category: "generate",
    icon: "◼",
    status: "live",
    url: "/tools/qr-generator",
  },
  {
    slug: "heic-to-jpg",
    name: "HEIC → JPG",
    description: "Convert iPhone photos to a universal format",
    category: "image",
    icon: "⬡",
    status: "soon",
    url: "/tools/heic-to-jpg",
  },
  {
    slug: "image-compress",
    name: "Image Compress",
    description: "Reduce file size without losing quality",
    category: "image",
    icon: "◈",
    status: "soon",
    url: "/tools/image-compress",
  },
  {
    slug: "ogp-generator",
    name: "OGP Generator",
    description: "Preview and generate OGP share images",
    category: "generate",
    icon: "▣",
    status: "soon",
    url: "/tools/ogp-generator",
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    description: "Format and validate JSON instantly",
    category: "dev",
    icon: "⟨⟩",
    status: "soon",
    url: "/tools/json-formatter",
  },
];
