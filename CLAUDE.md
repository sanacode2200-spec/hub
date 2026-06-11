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
| QR Generator (`apps/qr-generator`) | Astro 6 + Svelte 5（`@astrojs/svelte`） |
| hub / 各ツール (`apps/hub`, `apps/mov-to-mp4`) | Next.js 15 + TypeScript + React 19 |
| スタイリング | Tailwind CSS（hub系）/ プレーンCSS（Astro系、`.glass-card`デザイン） |
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
| `apps/hub` | 旧トップページ（Next.js）。現在は `/tools/mov-to-mp4` などツールページの置き場として残存 | 3000 | `npm run dev:hub` |
| `apps/mov-to-mp4` | MOV→MP4 スタンドアロン版 | 3001 | `npm run dev:mov-to-mp4` |

各アプリ間のリンクは `import.meta.env.PUBLIC_*` 環境変数で制御（未設定時はlocalhostにフォールバック）：
- `apps/landing`: `PUBLIC_TOOLS_URL`（既定 `http://localhost:3000`、mov-to-mp4等の参照先）, `PUBLIC_QR_URL`（既定 `http://localhost:4322`）
- `apps/qr-generator`: `PUBLIC_HUB_URL`（既定 `http://localhost:4321`、Nav/Footer/CTAの戻り先）

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
│   ├── hub/                          # 旧トップページ（Next.js, port 3000）
│   │   ├── app/
│   │   │   ├── page.tsx              # → <HubClient />（現在は未使用扱い）
│   │   │   ├── globals.css
│   │   │   └── tools/
│   │   │       └── mov-to-mp4/
│   │   │           └── page.tsx      # → <MovToMp4Converter />（SEO metadata付き）
│   │   ├── components/
│   │   │   ├── HubClient.tsx
│   │   │   └── tools/
│   │   │       └── MovToMp4Converter.tsx
│   │   └── lib/
│   │       └── tools-registry.ts     # hub内部用（qr-generatorは削除済み）
│   └── mov-to-mp4/                   # スタンドアロン版（port 3001）
│       ├── app/
│       │   └── page.tsx              # → <ConverterPage hubUrl="http://localhost:4321" />
│       └── components/
│           └── ConverterPage.tsx     # hubUrl propsでリンク先を制御
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
npm run dev:hub           # 旧hub / mov-to-mp4ツールページ（port 3000）
npm run dev:mov-to-mp4    # スタンドアロン版（port 3001）
npm run build             # 全ビルド
```

---

## ツール一覧（apps/landing/src/data/tools.ts が正）

| slug | 名前 | カテゴリ | ステータス | 実体 |
|------|------|----------|-----------|------|
| `mov-to-mp4` | MOV → MP4 | video | **live** | `apps/hub` `/tools/mov-to-mp4`（Next.js） |
| `qr-generator` | QR Generator | generate | **live** | `apps/qr-generator`（Astro+Svelte, port 4322） |
| `heic-to-jpg` | HEIC → JPG | image | soon | 未実装 |
| `image-compress` | Image Compress | image | soon | 未実装 |
| `ogp-generator` | OGP Generator | generate | soon | 未実装 |
| `json-formatter` | JSON Formatter | dev | soon | 未実装 |

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
- `apps/hub` の `HubClient.tsx`（旧実装）からロジックを移植したもの。`apps/hub` 自体は変更不要

---

## MOV→MP4 コンバーター

### 実装の注意点

- ffmpeg.wasm は **初回のみロード**（`ffmpegRef` でキャッシュ）
- 変換コマンド：`ffmpeg -i input.mov -c copy output.mp4`（remuxing、再エンコードなし）
- WASM/JSは `https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd` から `toBlobURL` で取得
- ファイルはメモリ上のみ（`ffmpeg.writeFile` / `readFile`）、変換後に `deleteFile`

### 2つの実装

| ファイル | 用途 | ハブへのリンク |
|---------|------|--------------|
| `apps/hub/components/tools/MovToMp4Converter.tsx` | hub内 `/tools/mov-to-mp4` ルート | Next.js `<Link href="/">`（注：リンク先は旧hub） |
| `apps/mov-to-mp4/components/ConverterPage.tsx` | スタンドアロンアプリ（port 3001） | `hubUrl="http://localhost:4321"` prop で `<a href>`（apps/landingへ） |

### Status の型

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

## デザイン言語

### apps/landing（トップページ）
- ダーク・ミニマル・grain texture・背景写真 + ガラスカード
- フォント：Instrument Serif italic（見出し）+ DM Mono（本文・ラベル）+ Apoc Revelations（ワードマーク）
- カラー：白 `rgba(255,255,255,0.xx)` の透明度で階層表現

### 各ツールページ
- トップページとトンマナを揃える場合は `apps/landing/src/styles/global.css` の `.glass-card` 系を流用
- MOV→MP4（`apps/mov-to-mp4`）：ダークパープル系グラデ背景、アクセント `#7c3aff` → `#3b82f6`（独自デザイン言語のまま）
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
3. **OGP Generator** — ライブラリ不要
4. **JSON Formatter** — ライブラリ不要

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
