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

// Tool pages currently live in the apps/hub Next.js app.
const TOOLS_BASE = import.meta.env.PUBLIC_TOOLS_URL ?? "http://localhost:3000";
// QR Generator is a standalone Astro + Svelte app.
const QR_BASE = import.meta.env.PUBLIC_QR_URL ?? "http://localhost:4322";

export const tools: Tool[] = [
  {
    slug: "mov-to-mp4",
    name: "MOV → MP4",
    description: "Convert iPhone MOV videos to MP4 instantly",
    category: "video",
    icon: "🎬",
    status: "live",
    url: `${TOOLS_BASE}/tools/mov-to-mp4`,
  },
  {
    slug: "qr-generator",
    name: "QR Generator",
    description: "AI neon QR codes for social links and campaigns",
    category: "generate",
    icon: "◼",
    status: "live",
    url: QR_BASE,
  },
  {
    slug: "heic-to-jpg",
    name: "HEIC → JPG",
    description: "Convert iPhone photos to a universal format",
    category: "image",
    icon: "⬡",
    status: "soon",
    url: `${TOOLS_BASE}/tools/heic-to-jpg`,
  },
  {
    slug: "image-compress",
    name: "Image Compress",
    description: "Reduce file size without losing quality",
    category: "image",
    icon: "◈",
    status: "soon",
    url: `${TOOLS_BASE}/tools/image-compress`,
  },
  {
    slug: "ogp-generator",
    name: "OGP Generator",
    description: "Preview and generate OGP share images",
    category: "generate",
    icon: "▣",
    status: "soon",
    url: `${TOOLS_BASE}/tools/ogp-generator`,
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    description: "Format and validate JSON instantly",
    category: "dev",
    icon: "⟨⟩",
    status: "soon",
    url: `${TOOLS_BASE}/tools/json-formatter`,
  },
];
