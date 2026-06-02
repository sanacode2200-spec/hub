# Sanacode Portfolio Specs

Claude Code / Codex に読ませるためのポートフォリオ設計ファイル群です。

## 使い方

プロジェクトのルートに以下を置いてください。

```txt
CLAUDE.md
DESIGN_SYSTEM.md
SITE_ARCHITECTURE.md
COMPONENT_LIBRARY.md
ANIMATION_SPEC.md
CONTENT_SPEC.md
IMPLEMENTATION_GUIDE.md
```

まず Claude Code / Codex にこう指示します。

```txt
このリポジトリの Markdown 仕様書をすべて読んで、Sanacode のポートフォリオサイトを Next.js + TypeScript + Tailwind + GSAP + Lenis で実装してください。
特に CLAUDE.md を最上位指示として扱ってください。
```

## 目的

参考サイトの完全コピーではなく、以下の良いところだけを取り入れるための仕様です。

```txt
MOMOTARO: editorial / minimal / gallery / typography
Laugh Mind: strong typography / interaction / contrast
M-TRUST: immersive fullscreen mood
```

推奨比率：

```txt
MOMOTARO 70%
Laugh Mind 20%
M-TRUST 10%
```

## 最初に作るべきもの

- 1ページ構成
- ReFlow中心
- 大きなタイポグラフィ
- 黒白ベース
- 静かなGSAPスクロール演出
- 余白多め
- SaaSテンプレ感なし

## ファイル内容

- `CLAUDE.md`: 最上位のAI向け設計憲法
- `DESIGN_SYSTEM.md`: 配色・余白・文字・画像ルール
- `SITE_ARCHITECTURE.md`: ページ構成
- `COMPONENT_LIBRARY.md`: コンポーネント仕様
- `ANIMATION_SPEC.md`: GSAP / Lenis の動き仕様
- `CONTENT_SPEC.md`: コピー文言
- `IMPLEMENTATION_GUIDE.md`: 実装手順

