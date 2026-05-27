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
    description: "iPhoneの動画をそのまま変換",
    category: "video",
    icon: "🎬",
    status: "live",
    url: "/tools/mov-to-mp4",
  },
  {
    slug: "qr-generator",
    name: "QR Generator",
    description: "制限なし・SVG対応・広告なし",
    category: "generate",
    icon: "◼",
    status: "soon",
    url: "/tools/qr-generator",
  },
  {
    slug: "heic-to-jpg",
    name: "HEIC → JPG",
    description: "iPhoneの写真をどこでも開ける形式に",
    category: "image",
    icon: "⬡",
    status: "soon",
    url: "/tools/heic-to-jpg",
  },
  {
    slug: "image-compress",
    name: "Image Compress",
    description: "画質を保ったまま軽量化",
    category: "image",
    icon: "◈",
    status: "soon",
    url: "/tools/image-compress",
  },
  {
    slug: "ogp-generator",
    name: "OGP Generator",
    description: "SNSシェア画像をプレビュー",
    category: "generate",
    icon: "▣",
    status: "soon",
    url: "/tools/ogp-generator",
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    description: "整形・バリデーション即時実行",
    category: "dev",
    icon: "⟨⟩",
    status: "soon",
    url: "/tools/json-formatter",
  },
  {
    slug: "password-gen",
    name: "Password Gen",
    description: "安全なパスワードを即生成",
    category: "generate",
    icon: "⬡",
    status: "soon",
    url: "/tools/password-gen",
  },
  {
    slug: "color-converter",
    name: "Color Converter",
    description: "HEX / RGB / HSL 変換",
    category: "dev",
    icon: "◕",
    status: "soon",
    url: "/tools/color-converter",
  },
];
