# Toolbox

無料のシンプルWebツール群を集めたモノレポ。ハブサイトにSEOで集客し収益化するプロジェクト。

## 原則

- 全ツール完全無料・登録不要・ブラウザ完結・データ保存なし
- 広告なし・サーバー処理なし・スキャン上限なし・有効期限なし
- デプロイ：Vercel / ドメイン：Cloudflare
- **ターゲット：英語圏ユーザー（US / UK / AU / CA）**
- **UI言語：全テキスト英語**（コメント・変数名は日本語でOK）

---

## スタック

| 項目 | 内容 |
|------|------|
| ランディング (`apps/landing`) | Astro 6（`output: "static"`）+ vanilla JS（フレームワークなし、最小JS） |
| 各ツール (`apps/qr-generator`, `apps/mov-to-mp4`, `apps/ogp-generator`, `apps/github-contributions`) | Astro 6 + Svelte 5（`@astrojs/svelte`）、すべて独立スタンドアロンアプリ |
| スタイリング | プレーンCSS（全アプリ共通の `.glass-card` デザイン、`apps/qr-generator/src/styles/global.css` がベース） |
| モノレポ | Turborepo (`npm@11.12.1`) |
| フォント | Instrument Serif（italic）+ DM Mono + Apoc Revelations（ワードマーク） |
| QR生成 | `qrcode` + `jsqr`（カメラスキャン確認） |
| 変換エンジン | `@ffmpeg/ffmpeg@0.12` + `@ffmpeg/core@0.12.6` |

---

## アプリ一覧（ポート）

| アプリ | 役割 | dev port | 起動コマンド |
|--------|------|----------|--------------|
| `apps/landing` | **トップページ**（ガラスカード、Astro） | 4321 | `npm run dev:landing` |
| `apps/qr-generator` | QR Generator（ガラスカード + qrpic背景、Astro+Svelte） | 4322 | `npm run dev:qr-generator` |
| `apps/mov-to-mp4` | MOV→MP4（ガラスカード + ancient-city背景、Astro+Svelte） | 3001 | `npm run dev:mov-to-mp4` |
| `apps/ogp-generator` | OGP Generator（ガラスカード + pic4背景、Astro+Svelte） | 4323 | `npm run dev:ogp-generator` |
| `apps/github-contributions` | GitHub Contributions Visualizer（ガラスカード + pic5背景、Astro+Svelte） | 4324 | `npm run dev:github-contributions` |

各アプリ間のリンクは `import.meta.env.PUBLIC_*` 環境変数で制御（未設定時はlocalhostにフォールバック）：
- `apps/landing`: `PUBLIC_QR_URL`（既定 `http://localhost:4322`）, `PUBLIC_MOV_URL`（既定 `http://localhost:3001`）, `PUBLIC_OGP_URL`（既定 `http://localhost:4323`）, `PUBLIC_GH_URL`（既定 `http://localhost:4324`）
- 各ツールアプリ（`apps/qr-generator`, `apps/mov-to-mp4`, `apps/ogp-generator`, `apps/github-contributions`）: `PUBLIC_HUB_URL`（既定 `http://localhost:4321`、Nav/Footer/CTAの戻り先）

---

## ディレクトリ構造

```
hub/
├── apps/
│   ├── landing/                      # トップページ（Astro, port 4321）★現行
│   │   ├── src/
│   │   │   ├── pages/index.astro     # Nav → Hero → GitTicker → ToolsSection → Footer
│   │   │   ├── components/           # Nav/Hero/GitTicker/ToolsSection/Footer (.astro)
│   │   │   ├── data/tools.ts         # ツール一覧の定義（ここを編集してツール追加）
│   │   │   └── styles/global.css     # .glass-card / .hero-title など
│   │   └── public/{images,fonts}/
│   ├── qr-generator/                 # QR Generator（Astro+Svelte, port 4322）★現行
│   │   ├── src/
│   │   │   ├── pages/index.astro     # Nav → QrTool → HowItWorks → Features → CTA → Footer
│   │   │   ├── components/
│   │   │   │   └── QrTool.svelte     # QR生成・カスタマイズ・DL・カメラスキャン (client:load)
│   │   │   └── styles/global.css     # apps/landing由来 + QR専用クラス、背景はqrpic.png
│   │   └── public/{images,fonts}/
│   ├── ogp-generator/                # OGP Generator（Astro+Svelte, port 4323）★現行
│   │   ├── src/
│   │   │   ├── pages/index.astro     # Nav → OgpTool → HowItWorks → Features → CTA → Footer
│   │   │   ├── components/
│   │   │   │   └── OgpTool.svelte    # 1200x630 canvas編集・PNG/@2x DL (client:load)
│   │   │   └── styles/global.css     # qr-generator由来 + OGP専用クラス、背景はogpic.png(pic4)
│   │   └── public/{images,fonts}/
│   ├── github-contributions/         # GitHub Contributions Visualizer（Astro+Svelte, port 4324）★現行
│   │   ├── src/
│   │   │   ├── pages/index.astro     # Nav → ContributionsTool → HowItWorks → Features → CTA → Footer
│   │   │   ├── components/
│   │   │   │   └── ContributionsTool.svelte  # 年/月ヒートマップ・統計 (client:load)
│   │   │   └── styles/global.css     # qr-generator由来 + gh-*専用クラス、背景はghpic.png(pic5)
│   │   └── public/{images,fonts}/
│   └── mov-to-mp4/                   # MOV→MP4（Astro+Svelte, port 3001）★現行
│       ├── src/
│       │   ├── pages/index.astro     # Nav → Hero → ConverterTool → HowItWorks → Features → CTA → Footer
│       │   ├── components/
│       │   │   └── ConverterTool.svelte  # ffmpeg.wasmでremux・進捗表示・DL (client:load)
│       │   └── styles/global.css     # qr-generator由来 + mov-*専用クラス、背景はancient-city.png
│       └── public/{images,fonts}/
├── packages/
│   ├── ui/src/index.ts               # 共通コンポーネント（現在ほぼ空）
│   └── config/
│       ├── tailwind/index.ts         # 共通Tailwind設定
│       └── tsconfig/base.json
├── turbo.json
└── package.json
```

---

## 開発コマンド

```bash
npm run dev               # 全アプリ起動
npm run dev:landing       # トップページ（port 4321）★
npm run dev:qr-generator  # QR Generator（port 4322）★
npm run dev:mov-to-mp4    # MOV→MP4（port 3001）★
npm run dev:ogp-generator         # OGP Generator（port 4323）★
npm run dev:github-contributions  # GitHub Contributions Visualizer（port 4324）★
npm run build             # 全ビルド
```

---

## ツール一覧（apps/landing/src/data/tools.ts が正）

| slug | 名前 | カテゴリ | ステータス | 実体 |
|------|------|----------|-----------|------|
| `mov-to-mp4` | MOV → MP4 | video | **live** | `apps/mov-to-mp4`（Astro+Svelte, port 3001） |
| `qr-generator` | QR Generator | generate | **live** | `apps/qr-generator`（Astro+Svelte, port 4322） |
| `heic-to-jpg` | HEIC → JPG | image | soon | 未実装 |
| `image-compress` | Image Compress | image | soon | 未実装 |
| `ogp-generator` | OGP Generator | generate | **live** | `apps/ogp-generator`（Astro+Svelte, port 4323） |
| `json-formatter` | JSON Formatter | dev | soon | 未実装 |
| `github-contributions` | GitHub Contributions | dev | **live** | `apps/github-contributions`（Astro+Svelte, port 4324） |

**新ツール追加の手順（推奨：独立Astroアプリ方式）：**
1. `apps/<slug>/` に `apps/qr-generator` を参考にAstroアプリを新規作成（インタラクティブ部分が多ければSvelteコンポーネント）
2. `apps/landing/src/data/tools.ts` にエントリを追加（`url` は `PUBLIC_<SLUG>_URL ?? "http://localhost:<port>"`）
3. `apps/landing/src/styles/global.css` の `.glass-card` 系クラスを流用してデザインを揃える
4. ルート `package.json` に `dev:<slug>` スクリプトを追加、`astro.config.mjs` で `server.port` を指定

---

## トップページ（apps/landing）

### デザイン仕様

- 背景：`apps/landing/public/images/background.png` を `.hub-shell::before` に重ね、暗めのグラデーションオーバーレイ
- `.glass-card`：`backdrop-filter: blur(18px) saturate(140%)` + 半透明グラデ背景 + `border: 1px solid rgba(255,255,255,0.13)`
- `.hero-title`（"TOOLBOX"）：`color: transparent` + `-webkit-text-stroke` の透明アウトライン文字
- カーソル追従のアンビエントグロー（`.cursor-light`）+ grain texture overlay（`.grain-layer`）+ `.ambient-*` ぼかし玉
- gitログティッカー（`GitTicker.astro`、GitHub APIから取得、vanilla JS）
- カテゴリフィルター（`.category-button`、ピル型）+ ツール一覧 + プレビューパネル（`ToolsSection.astro`、vanilla JS + IntersectionObserver）

### 実装方針

- React/フレームワーク不使用。すべて `.astro` + `<script>`（vanilla JS）でJSバンドル最小化

---

## MOV→MP4（apps/mov-to-mp4）

- 背景：`apps/mov-to-mp4/public/images/ancient-city.png` + 濃いめのオーバーレイ（`.glass-card`系デザイン）
- ヒーロー（`.mov-hero` / `.mov-hero-title` / `.mov-hero-desc`）→ `ConverterTool.svelte`（`client:load`）→ HowItWorks → Features → CTA → Footer
- インタラクティブ部分は `ConverterTool.svelte` に集約：
  - ドラッグ&ドロップ / ファイル選択（`.mov-dropzone`）
  - ffmpeg.wasm は **初回のみロード**（`ffmpeg`変数でキャッシュ）
  - 変換コマンド：`ffmpeg -i input.mov -c copy output.mp4`（remuxing、再エンコードなし）
  - WASM/JSは `https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd` から `toBlobURL` で取得
  - ファイルはメモリ上のみ（`ffmpeg.writeFile` / `readFile`）、変換後に `deleteFile`
  - 進捗表示：`ffmpeg.on("progress", ...)` でパーセント表示
- Status の型：

```typescript
type Status = "idle" | "loading-ffmpeg" | "converting" | "done" | "error"
```

---

## QR Generator（apps/qr-generator）

- 背景：`apps/qr-generator/public/images/qrpic.png`（パステル系イラスト）+ 濃いめのオーバーレイ
- インタラクティブ部分は `QrTool.svelte`（`client:load`）に集約：
  - Content type（URL/Text/Email/Phone）、Error correction（L/M/Q/H）、Dot style（square/round）
  - カラーパレット5種 + Solid/Gradientカスタム、ロゴ埋め込み（`<image>` SVG埋め込み）
  - SVG生成は `qrcode` の `QRCodeLib.create()` を使い手動でSVG文字列を組み立て（`buildSVG`）
  - ダウンロード：SVGはBlob、PNGはCanvas経由（4倍スケール）
  - カメラスキャン確認：`jsqr` を動的import、`getUserMedia`
- スタイル：`.qr-layout`（2カラム）/ `.option-tab` / `.palette-card` / `.color-control` / `.qr-preview-box` / `.qr-action` / `.scan-panel` など（`apps/landing` の `.glass-card` 系をベースに拡張）

---

## OGP Generator（apps/ogp-generator）

- 背景：`apps/ogp-generator/public/images/ogpic.png`（pic4、パステルグラデ）+ 濃いめのオーバーレイ
- インタラクティブ部分は `OgpTool.svelte`（`client:load`）に集約：
  - テンプレートプリセット4種（Minimal / Gradient / Editorial / Terminal）
  - タイトル・サブタイトル・Eyebrow（バッジ）の入力欄
  - 背景：Solid / Gradient切替 + カラーピッカー、文字色（自動で可読色補正）
  - フォント：Serif（Instrument Serif italic）/ Mono（DM Mono）/ Sans（system-ui）、整列：Left / Center
  - プレビュー＝出力そのもの：`<canvas width="1200" height="630">` を直接描画（`ctx.measureText`で手動折り返し、タイトル最大4行・サブ最大3行）
  - フォント読み込み待ち：`document.fonts.ready.then(redraw)` + `$effect`で状態変化ごとに再描画
  - ダウンロード：`↓ PNG`（1200×630）/ `↓ PNG @2x`（2400×1260、オフスクリーンcanvas）
- スタイル：`.qr-layout`（2カラム）/ `.option-tab` / `.palette-card` / `.color-control` / `.qr-action` など既存クラスを再利用。`global.css`は`qr-generator`からコピーし背景URLのみ`ogpic.png`に変更、`.ogp-*`クラスを末尾に追加

---

## GitHub Contributions Visualizer（apps/github-contributions）

- 背景：`apps/github-contributions/public/images/ghpic.png`（pic5、クリーム地イラスト）+ 濃いめのオーバーレイ
- ツール一覧の **07番**（`apps/landing/src/data/tools.ts` で7番目のエントリ）
- データ取得：`https://github-contributions-api.jogruber.de/v4/<username>?y=<year>`（CORS対応・トークン不要・ブラウザから直接fetch）
  - レスポンス：`{ total: { "<year>": number }, contributions: [{ date, count, level(0-4) }] }`
- インタラクティブ部分は `ContributionsTool.svelte`（`client:load`）に集約：
  - ツールバー：ユーザー名入力（Enter/Loadボタン）、年セレクタ（直近8年）、ビュー切替（Year / Month）、月セレクタ（Monthビュー時）、配色テーマ（Green / Amber / Violet）
  - Yearビュー：GitHub風のweek列×weekday行ヒートマップ（日付ローカル解析、`new Date(y, m-1, d)`で曜日判定）+ 月ラベル
  - Monthビュー：選択月のカレンダー表示、各日をlevelで着色
  - 統計：合計・最多日・最長連続日数・活動日数（`.gh-stats` / `.gh-stat`）
  - 凡例：`.gh-legend`（Less→More、テーマごとの5段階配色）
  - 初期表示：`onMount`で`torvalds`の当年データを自動取得
- スタイル：`.glass-card` + `.qr-field` / `.option-tab` / `.qr-action`など既存クラスを再利用。`global.css`は`qr-generator`からコピーし背景URLのみ`ghpic.png`に変更、`.gh-*`クラスを末尾に追加

---

## デザイン言語

### apps/landing（トップページ）
- ダーク・ミニマル・grain texture・背景写真 + ガラスカード
- フォント：Instrument Serif italic（見出し）+ DM Mono（本文・ラベル）+ Apoc Revelations（ワードマーク）
- カラー：白 `rgba(255,255,255,0.xx)` の透明度で階層表現

### 各ツールページ
- 全ツールアプリ（`apps/qr-generator` / `apps/mov-to-mp4` / `apps/ogp-generator` / `apps/github-contributions`）は `apps/qr-generator/src/styles/global.css` を起点にコピーし、`.hub-shell::before` の背景画像のみ差し替えてトンマナを統一（アクセント `#e2d0b0` 共通）
- 構成：（ヒーロー →）ツール本体 → 使い方 → 特徴 → トップページへの導線（"Explore more free tools →"）

### SEO戦略
- 各ツールページが集客の主役（ユーザーはツールページに直接着地）
- トップページは回遊の場（使ってよかったらトップへ）
- ヒーローセクションで3秒以内に価値を伝える
- 各ページ単体でキーワード上位を狙う（例：「QR code generator free」「MOV to MP4 converter free」）
- ページ末尾に "Explore more free tools →" CTA でトップページへ誘導

---

## 次に実装するツール

優先度順：
1. **HEIC → JPG** — `heic2any`、iPhoneの写真変換
2. **Image Compress** — `browser-image-compression`
3. **JSON Formatter** — ライブラリ不要

新規ツールは `apps/qr-generator` と同じ構成（独立Astroアプリ + 必要に応じてSvelte、`apps/landing` のガラスカードCSSを流用）で作成する。

---

## 収益化ロードマップ

**タイムライン：**
- 0〜3ヶ月：月2〜3本ペースでツール作成（目標10〜15本）
- 3〜6ヶ月：SEO・ハブサイト整備（目標月1,000〜5,000UU）
- 6〜12ヶ月：アフィリエイト導線設置（月数万円）
- 12ヶ月〜：有料プランorスポンサー（月数十万円）

**収益化の順番：**
1. アフィリエイト（ツールのユースケースに紐づく商品）
2. 有料プラン（パワーユーザー向け）
3. スポンサーシップ（月間数万PV以降）
