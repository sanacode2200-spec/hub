<script lang="ts">
  // OGP / social share image generator — 1200x630 canvas is the single source of truth
  type BgMode = "solid" | "gradient";
  type FontKind = "serif" | "mono" | "sans";
  type Align = "left" | "center";

  type Preset = {
    name: string;
    bgMode: BgMode;
    bgColor: string;
    gradient: [string, string];
    textColor: string;
    accent: string;
    font: FontKind;
    align: Align;
  };

  // フォント種別 → canvas font-family 文字列
  const FONT_FAMILY: Record<FontKind, string> = {
    serif: '"Instrument Serif"',
    mono: '"DM Mono"',
    sans: "system-ui, -apple-system, Segoe UI, sans-serif",
  };

  // タイトルは serif のみ italic にすると映える
  function titleStyle(font: FontKind): string {
    return font === "serif" ? "italic 700" : "700";
  }

  function bodyStyle(): string {
    return "400";
  }

  const PRESETS: Preset[] = [
    {
      name: "Minimal",
      bgMode: "solid",
      bgColor: "#0f1115",
      gradient: ["#0f1115", "#1b1f27"],
      textColor: "#f5f3ee",
      accent: "#e2d0b0",
      font: "serif",
      align: "left",
    },
    {
      name: "Gradient",
      bgMode: "gradient",
      bgColor: "#4f46e5",
      gradient: ["#4f46e5", "#06b6d4"],
      textColor: "#ffffff",
      accent: "#ffe27a",
      font: "sans",
      align: "left",
    },
    {
      name: "Editorial",
      bgMode: "solid",
      bgColor: "#f5f1e8",
      gradient: ["#f5f1e8", "#e7ded0"],
      textColor: "#1a1714",
      accent: "#b4533a",
      font: "serif",
      align: "center",
    },
    {
      name: "Terminal",
      bgMode: "solid",
      bgColor: "#0a0c0a",
      gradient: ["#0a0c0a", "#11160f"],
      textColor: "#d6ffd0",
      accent: "#7cf08a",
      font: "mono",
      align: "left",
    },
  ];

  const OG_W = 1200;
  const OG_H = 630;

  let activePreset = $state<string | null>("Minimal");
  let title = $state("無料のブラウザツールで、もっと速く");
  let subtitle = $state(
    "登録不要・アップロード不要・上限なし。すべてブラウザ内で完結します。"
  );
  let eyebrow = $state("ToolBox / OGP");
  let bgMode = $state<BgMode>("solid");
  let bgColor = $state("#0f1115");
  let gradient = $state<[string, string]>(["#0f1115", "#1b1f27"]);
  let textColor = $state("#f5f3ee");
  let accent = $state("#e2d0b0");
  let font = $state<FontKind>("serif");
  let align = $state<Align>("left");

  let canvasEl: HTMLCanvasElement | null = $state(null);

  function applyPreset(preset: Preset) {
    bgMode = preset.bgMode;
    bgColor = preset.bgColor;
    gradient = [preset.gradient[0], preset.gradient[1]];
    textColor = preset.textColor;
    accent = preset.accent;
    font = preset.font;
    align = preset.align;
    activePreset = preset.name;
  }

  // 16進カラーの相対輝度から、薄い色を重ねるか暗い色を重ねるか決める
  function relativeLuminance(hex: string): number {
    const c = hex.replace("#", "");
    const full =
      c.length === 3
        ? c
            .split("")
            .map((ch) => ch + ch)
            .join("")
        : c;
    const r = parseInt(full.slice(0, 2), 16) / 255;
    const g = parseInt(full.slice(2, 4), 16) / 255;
    const b = parseInt(full.slice(4, 6), 16) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  // 背景に対して読みやすい本文色を選ぶ（指定色が背景と近すぎる場合のみ補正）
  function readableTextColor(chosen: string, bgAvgLum: number): string {
    const chosenLum = relativeLuminance(chosen);
    const contrast = Math.abs(chosenLum - bgAvgLum);
    if (contrast > 0.32) return chosen;
    return bgAvgLum > 0.5 ? "#15120e" : "#f7f4ee";
  }

  // 手動ワードラップ：maxWidth を超えない行配列を返す（最大行数で打ち切り）
  function wrapLines(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
    maxLines: number
  ): string[] {
    const words = text.replace(/\s+/g, " ").trim().split(" ");
    const lines: string[] = [];
    let current = "";
    for (const word of words) {
      const test = current ? current + " " + word : word;
      if (ctx.measureText(test).width <= maxWidth || !current) {
        current = test;
      } else {
        lines.push(current);
        current = word;
        if (lines.length === maxLines - 1) break;
      }
    }
    if (current && lines.length < maxLines) lines.push(current);
    // 全単語が収まらず打ち切った場合は末尾を省略記号に
    const consumed = lines.join(" ").split(" ").filter(Boolean).length;
    if (lines.length === maxLines && consumed < words.length) {
      let last = lines[maxLines - 1];
      while (
        last &&
        ctx.measureText(last + "…").width > maxWidth &&
        last.includes(" ")
      ) {
        last = last.slice(0, last.lastIndexOf(" "));
      }
      lines[maxLines - 1] = last + "…";
    }
    return lines;
  }

  function draw(ctx: CanvasRenderingContext2D, scale: number) {
    const w = OG_W * scale;
    const h = OG_H * scale;
    ctx.clearRect(0, 0, w, h);

    // 背景
    if (bgMode === "gradient") {
      const g = ctx.createLinearGradient(0, 0, w, h); // 135deg 相当（左上→右下）
      g.addColorStop(0, gradient[0]);
      g.addColorStop(1, gradient[1]);
      ctx.fillStyle = g;
    } else {
      ctx.fillStyle = bgColor;
    }
    ctx.fillRect(0, 0, w, h);

    // 控えめなラジアルヴィネット
    const vignette = ctx.createRadialGradient(
      w * 0.5,
      h * 0.42,
      h * 0.2,
      w * 0.5,
      h * 0.5,
      h * 0.95
    );
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(0,0,0,0.18)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);

    // 背景平均輝度（読みやすい色を選ぶため）
    const bgLum =
      bgMode === "gradient"
        ? (relativeLuminance(gradient[0]) + relativeLuminance(gradient[1])) / 2
        : relativeLuminance(bgColor);
    const bodyColor = readableTextColor(textColor, bgLum);
    const subColor =
      bgLum > 0.5 ? "rgba(20,16,12,0.62)" : "rgba(255,255,255,0.6)";

    const pad = 96 * scale;
    const contentW = w - pad * 2;
    const isCenter = align === "center";
    const anchorX = isCenter ? w / 2 : pad;
    ctx.textAlign = isCenter ? "center" : "left";
    ctx.textBaseline = "alphabetic";

    const family = FONT_FAMILY[font];

    // 縦位置を中央寄せに組むため、先にブロックの高さを概算
    let cursorY = pad + 14 * scale;

    // Eyebrow（小さく・字間広め・大文字・アクセント色）
    const eyebrowText = eyebrow.trim().toUpperCase();
    const eyebrowSize = 24 * scale;
    if (eyebrowText) {
      ctx.font = `500 ${eyebrowSize}px "DM Mono"`;
      ctx.fillStyle = accent;
      // letter-spacing を手動で表現
      drawSpacedText(ctx, eyebrowText, anchorX, cursorY + eyebrowSize, isCenter, 4 * scale);
      cursorY += eyebrowSize + 16 * scale;

      // アクセントの細いルール
      const ruleW = 64 * scale;
      const ruleY = cursorY + 6 * scale;
      ctx.fillStyle = accent;
      if (isCenter) {
        ctx.fillRect(anchorX - ruleW / 2, ruleY, ruleW, 3 * scale);
      } else {
        ctx.fillRect(anchorX, ruleY, ruleW, 3 * scale);
      }
      cursorY = ruleY + 3 * scale + 34 * scale;
    } else {
      cursorY += 6 * scale;
    }

    // Title（大きく・太く・ワードラップ・最大4行）
    const titleSize = 78 * scale;
    const titleLineH = titleSize * 1.08;
    ctx.font = `${titleStyle(font)} ${titleSize}px ${family}`;
    ctx.fillStyle = bodyColor;
    const titleLines = wrapLines(ctx, title || " ", contentW * 0.96, 4);
    for (const line of titleLines) {
      cursorY += titleLineH;
      ctx.fillText(line, anchorX, cursorY);
    }

    // Subtitle（小さめ・ミュート・ワードラップ）
    const subText = subtitle.trim();
    if (subText) {
      const subSize = 30 * scale;
      const subLineH = subSize * 1.42;
      ctx.font = `${bodyStyle()} ${subSize}px ${family === '"Instrument Serif"' ? '"DM Mono"' : family}`;
      ctx.fillStyle = subColor;
      const subLines = wrapLines(ctx, subText, contentW * 0.88, 3);
      cursorY += 30 * scale;
      for (const line of subLines) {
        cursorY += subLineH;
        ctx.fillText(line, anchorX, cursorY);
      }
    }
  }

  // letter-spacing を手動で適用してテキストを描画
  function drawSpacedText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    center: boolean,
    spacing: number
  ) {
    if (spacing <= 0) {
      ctx.fillText(text, x, y);
      return;
    }
    const chars = text.split("");
    const widths = chars.map((ch) => ctx.measureText(ch).width);
    const total =
      widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1);
    let cx = center ? x - total / 2 : x;
    const prevAlign = ctx.textAlign;
    ctx.textAlign = "left";
    for (let i = 0; i < chars.length; i++) {
      ctx.fillText(chars[i], cx, y);
      cx += widths[i] + spacing;
    }
    ctx.textAlign = prevAlign;
  }

  function redraw() {
    const canvas = canvasEl;
    if (!canvas) return;
    canvas.width = OG_W;
    canvas.height = OG_H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    draw(ctx, 1);
  }

  function download(scale: number, filename: string) {
    const off = document.createElement("canvas");
    off.width = OG_W * scale;
    off.height = OG_H * scale;
    const ctx = off.getContext("2d");
    if (!ctx) return;
    draw(ctx, scale);
    off.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      URL.revokeObjectURL(a.href);
    }, "image/png");
  }

  function downloadPNG() {
    download(1, "og-image.png");
  }

  function downloadPNG2x() {
    download(2, "og-image@2x.png");
  }

  // 状態が変わるたびに再描画。フォント読み込み完了後にも再描画
  $effect(() => {
    // 依存を明示的に参照してリアクティブに
    void [
      title,
      subtitle,
      eyebrow,
      bgMode,
      bgColor,
      gradient[0],
      gradient[1],
      textColor,
      accent,
      font,
      align,
      canvasEl,
    ];
    redraw();
  });

  $effect(() => {
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => redraw());
    }
  });
</script>

<div class="qr-layout glass-card">
  <div class="qr-panel">
    <div>
      <span class="qr-section-label">テンプレート</span>
      <div class="palette-grid">
        {#each PRESETS as preset (preset.name)}
          <button
            type="button"
            class="palette-card"
            class:is-active={activePreset === preset.name}
            onclick={() => applyPreset(preset)}
          >
            <span class="palette-swatch" style={`background:${preset.bgColor}`}>
              <span
                class="palette-swatch-inner"
                style={`background: linear-gradient(135deg, ${preset.gradient[0]} 0%, ${preset.gradient[1]} 100%)`}
              ></span>
            </span>
            {preset.name}
          </button>
        {/each}
      </div>
    </div>

    <div class="qr-divider"></div>

    <div>
      <span class="qr-section-label">ラベル（アイキャッチ）</span>
      <input
        type="text"
        class="qr-field"
        bind:value={eyebrow}
        placeholder="ブランド名やカテゴリ"
      />
    </div>

    <div>
      <span class="qr-section-label">タイトル</span>
      <textarea
        class="qr-field ogp-textarea"
        rows="2"
        bind:value={title}
        placeholder="メインの見出し"
      ></textarea>
    </div>

    <div>
      <span class="qr-section-label">サブタイトル・説明文</span>
      <textarea
        class="qr-field ogp-textarea"
        rows="2"
        bind:value={subtitle}
        placeholder="補足の説明文"
      ></textarea>
    </div>

    <div class="qr-divider"></div>

    <div>
      <span class="qr-section-label">背景</span>
      <div class="option-tabs">
        <button
          type="button"
          class="option-tab"
          class:is-active={bgMode === "solid"}
          onclick={() => (bgMode = "solid")}>Solid</button
        >
        <button
          type="button"
          class="option-tab"
          class:is-active={bgMode === "gradient"}
          onclick={() => (bgMode = "gradient")}>Gradient</button
        >
      </div>

      {#if bgMode === "solid"}
        <div class="color-controls">
          <div class="color-control">
            <div class="color-control-label">Background</div>
            <label class="color-control-input">
              <span class="color-control-swatch" style={`background:${bgColor}`}></span>
              <span class="color-control-value">{bgColor}</span>
              <input type="color" bind:value={bgColor} />
            </label>
          </div>
        </div>
      {:else}
        <div class="color-controls">
          <div class="color-control">
            <div class="color-control-label">Start</div>
            <label class="color-control-input">
              <span class="color-control-swatch" style={`background:${gradient[0]}`}></span>
              <span class="color-control-value">{gradient[0]}</span>
              <input type="color" bind:value={gradient[0]} />
            </label>
          </div>
          <div class="color-control">
            <div class="color-control-label">End</div>
            <label class="color-control-input">
              <span class="color-control-swatch" style={`background:${gradient[1]}`}></span>
              <span class="color-control-value">{gradient[1]}</span>
              <input type="color" bind:value={gradient[1]} />
            </label>
          </div>
        </div>
      {/if}
    </div>

    <div>
      <span class="qr-section-label">テキスト・アクセント</span>
      <div class="color-controls">
        <div class="color-control">
          <div class="color-control-label">Text</div>
          <label class="color-control-input">
            <span class="color-control-swatch" style={`background:${textColor}`}></span>
            <span class="color-control-value">{textColor}</span>
            <input type="color" bind:value={textColor} />
          </label>
        </div>
        <div class="color-control">
          <div class="color-control-label">Accent</div>
          <label class="color-control-input">
            <span class="color-control-swatch" style={`background:${accent}`}></span>
            <span class="color-control-value">{accent}</span>
            <input type="color" bind:value={accent} />
          </label>
        </div>
      </div>
    </div>

    <div>
      <span class="qr-section-label">フォント</span>
      <div class="option-tabs">
        <button
          type="button"
          class="option-tab"
          class:is-active={font === "serif"}
          onclick={() => (font = "serif")}>Serif</button
        >
        <button
          type="button"
          class="option-tab"
          class:is-active={font === "mono"}
          onclick={() => (font = "mono")}>Mono</button
        >
        <button
          type="button"
          class="option-tab"
          class:is-active={font === "sans"}
          onclick={() => (font = "sans")}>Sans</button
        >
      </div>
    </div>

    <div>
      <span class="qr-section-label">配置</span>
      <div class="option-tabs">
        <button
          type="button"
          class="option-tab"
          class:is-active={align === "left"}
          onclick={() => (align = "left")}>Left</button
        >
        <button
          type="button"
          class="option-tab"
          class:is-active={align === "center"}
          onclick={() => (align = "center")}>Center</button
        >
      </div>
    </div>
  </div>

  <aside class="tool-preview" aria-label="OG画像のプレビュー">
    <div class="ogp-canvas-frame">
      <canvas
        bind:this={canvasEl}
        width="1200"
        height="630"
        style="width:100%;height:auto;display:block;border-radius:0.6rem"
      ></canvas>
    </div>

    <div class="ogp-size-tag">1200 × 630 — OGP標準サイズ</div>

    <div class="qr-download-row">
      <button type="button" class="qr-action" onclick={downloadPNG}>↓ PNG</button>
      <button type="button" class="qr-action" onclick={downloadPNG2x}>↓ PNG @2x</button>
    </div>
  </aside>
</div>
