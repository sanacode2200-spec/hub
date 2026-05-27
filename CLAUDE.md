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
| フレームワーク | Next.js 15 + TypeScript + React 19 |
| スタイリング | Tailwind CSS（インラインスタイル併用） |
| モノレポ | Turborepo (`npm@11.12.1`) |
| フォント | Instrument Serif（italic）+ DM Mono |
| 変換エンジン | `@ffmpeg/ffmpeg@0.12` + `@ffmpeg/core@0.12.6` |

---

## ディレクトリ構造

```
hub/
├── apps/
│   ├── hub/                          # ハブサイト（port 3000）
│   │   ├── app/
│   │   │   ├── page.tsx              # → <HubClient />
│   │   │   ├── layout.tsx            # フォント読み込み・メタデータ
│   │   │   ├── globals.css
│   │   │   └── tools/
│   │   │       └── mov-to-mp4/
│   │   │           └── page.tsx      # → <MovToMp4Converter />（SEO metadata付き）
│   │   ├── components/
│   │   │   ├── HubClient.tsx         # ハブUI本体（"use client"）
│   │   │   └── tools/
│   │   │       └── MovToMp4Converter.tsx  # hub内埋め込み版コンバーター
│   │   └── lib/
│   │       └── tools-registry.ts     # ツール一覧の定義（ここを編集してツール追加）
│   └── mov-to-mp4/                   # スタンドアロン版（port 3001）
│       ├── app/
│       │   └── page.tsx              # → <ConverterPage hubUrl="..." />
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
npm run dev              # 全アプリ起動
npm run dev:hub          # hub のみ（port 3000）
npm run dev:mov-to-mp4   # スタンドアロン版のみ（port 3001）
npm run build            # 全ビルド
```

---

## ツール一覧（tools-registry.ts）

| slug | 名前 | カテゴリ | ステータス |
|------|------|----------|-----------|
| `mov-to-mp4` | MOV → MP4 | video | **live** |
| `qr-generator` | QR Generator | generate | soon |
| `heic-to-jpg` | HEIC → JPG | image | soon |
| `image-compress` | Image Compress | image | soon |
| `ogp-generator` | OGP Generator | generate | soon |
| `json-formatter` | JSON Formatter | dev | soon |

**新ツール追加の手順：**
1. `tools-registry.ts` にエントリを追加
2. `apps/hub/app/tools/<slug>/page.tsx` を作成
3. `apps/hub/components/tools/<ComponentName>.tsx` に実装

---

## ハブサイト（apps/hub）

### デザイン仕様

- 背景：`#080808`（ほぼ黒）
- カーソル追従のアンビエントグロー（radial-gradient 600px）
- grain texture overlay（SVG feTurbulence、opacity 0.35、128px repeat）
- カードホバー：アイコン浮く + "Open tool →" スライドイン
- スクロールでカードがスタッガーフェードイン（IntersectionObserver）
- カテゴリフィルタータブ（All / Video / Image / Generate / Dev）
- `_design/toolhub.jsx` が元デザイン参照ファイル

### カードコンポーネント

`ToolCard` in `HubClient.tsx`：
- `status: "live"` → `<Link>` でラップ
- `status: "soon"` → クリック不可、"Soon" バッジ表示
- アニメーション delay：`index * 0.07s`

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
| `apps/hub/components/tools/MovToMp4Converter.tsx` | hub内 `/tools/mov-to-mp4` ルート | Next.js `<Link href="/">` |
| `apps/mov-to-mp4/components/ConverterPage.tsx` | スタンドアロンアプリ（port 3001） | `hubUrl` prop で `<a href>` |

### Status の型

```typescript
type Status = "idle" | "loading-ffmpeg" | "converting" | "done" | "error"
```

---

## デザイン言語

### hub
- ダーク・ミニマル・grain texture
- フォント：Instrument Serif italic（見出し）+ DM Mono（本文・ラベル）
- カラー：白 `rgba(255,255,255,0.xx)` の透明度で階層表現

### 各ツールページ
- hub とは独立したデザイン言語でOK
- MOV→MP4：ダークパープル系グラデ背景、アクセント `#7c3aff` → `#3b82f6`
- 構成：ヒーロー → ツール本体 → 使い方 → 特徴 → ハブへの導線（他ツールへの回遊CTA）

### SEO戦略
- 各ツールページが集客の主役（ユーザーはツールページに直接着地）
- ハブサイトは回遊の場（使ってよかったらハブへ）
- ヒーローセクションで3秒以内に価値を伝える
- 各ページ単体でキーワード上位を狙う（例：「MOV to MP4 converter free」）
- ページ末尾に "Explore more free tools →" CTA でハブへ誘導

---

## 次に実装するツール

優先度順：
1. **QR Generator** — `qrcode.js`
2. **HEIC → JPG** — `heic2any`、iPhoneの写真変換
3. **Image Compress** — `browser-image-compression`
4. **OGP Generator** — ライブラリ不要
5. **JSON Formatter** — ライブラリ不要

### QR Generator 実装仕様

**差別化ポイント：**
- 完全無料・スキャン上限なし・有効期限なし・広告なし・登録不要
- 生成直後にスキャン確認機能（カメラで読み取りテスト）

**機能：**
- 入力タイプ：URL / テキスト / メール / 電話番号
- エラー訂正レベル選択（L / M / Q / H）
- リアルタイム生成
- ドット形状変更（丸・四角）
- 前景色・背景色カスタム
- ロゴ・アイコン埋め込み
- SVG / PNG ダウンロード（両方無料）

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
