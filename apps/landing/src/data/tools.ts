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

// QR Generator is a standalone Astro + Svelte app.
const QR_BASE = import.meta.env.PUBLIC_QR_URL ?? "http://localhost:4322";
// MOV to MP4 is a standalone Astro + Svelte app.
const MOV_BASE = import.meta.env.PUBLIC_MOV_URL ?? "http://localhost:3001";
// OG Image Generator is a standalone Astro + Svelte app.
const OGP_BASE = import.meta.env.PUBLIC_OGP_URL ?? "http://localhost:4323";
// GitHub Contributions is a standalone Astro + Svelte app.
const GH_BASE = import.meta.env.PUBLIC_GH_URL ?? "http://localhost:4324";

export const tools: Tool[] = [
  {
    slug: "mov-to-mp4",
    name: "MOV → MP4",
    description: "Convert iPhone MOV videos to MP4 instantly",
    category: "video",
    icon: "🎬",
    status: "live",
    url: MOV_BASE,
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
    url: "",
  },
  {
    slug: "image-compress",
    name: "Image Compress",
    description: "Reduce file size without losing quality",
    category: "image",
    icon: "◈",
    status: "soon",
    url: "",
  },
  {
    slug: "ogp-generator",
    name: "OGP Generator",
    description: "Create 1200×630 Open Graph share images",
    category: "generate",
    icon: "▣",
    status: "live",
    url: OGP_BASE,
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    description: "Format and validate JSON instantly",
    category: "dev",
    icon: "⟨⟩",
    status: "soon",
    url: "",
  },
  {
    slug: "github-contributions",
    name: "GitHub Contributions",
    description: "Visualize any GitHub user's contributions by month and year",
    category: "dev",
    icon: "▦",
    status: "live",
    url: GH_BASE,
  },
];
