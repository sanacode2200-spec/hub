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
  { id: "all", label: "すべて" },
  { id: "video", label: "動画" },
  { id: "image", label: "画像" },
  { id: "generate", label: "生成" },
  { id: "dev", label: "開発" },
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
    description: "iPhoneのMOV動画を一瞬でMP4に変換",
    category: "video",
    icon: "🎬",
    status: "live",
    url: MOV_BASE,
  },
  {
    slug: "qr-generator",
    name: "QRコード生成",
    description: "AI Neonなどのカラーパレットで作るQRコードジェネレーター",
    category: "generate",
    icon: "◼",
    status: "live",
    url: QR_BASE,
  },
  {
    slug: "heic-to-jpg",
    name: "HEIC → JPG変換",
    description: "iPhoneの写真を汎用フォーマットに変換",
    category: "image",
    icon: "⬡",
    status: "soon",
    url: "",
  },
  {
    slug: "image-compress",
    name: "画像圧縮",
    description: "画質を落とさずファイルサイズを削減",
    category: "image",
    icon: "◈",
    status: "soon",
    url: "",
  },
  {
    slug: "ogp-generator",
    name: "OGP画像生成",
    description: "1200×630のOGPシェア画像を作成",
    category: "generate",
    icon: "▣",
    status: "live",
    url: OGP_BASE,
  },
  {
    slug: "json-formatter",
    name: "JSON整形",
    description: "JSONを整形・検証",
    category: "dev",
    icon: "⟨⟩",
    status: "soon",
    url: "",
  },
  {
    slug: "github-contributions",
    name: "GitHub Contributions（草）",
    description: "GitHubユーザーのContributionsを月・年単位で可視化",
    category: "dev",
    icon: "▦",
    status: "live",
    url: GH_BASE,
  },
];
