<script lang="ts">
  import * as QRCodeLib from "qrcode";

  type InputType = "url" | "text" | "email" | "phone";
  type ECLevel = "L" | "M" | "Q" | "H";
  type DotStyle = "square" | "round";
  type ScanStatus = "idle" | "scanning" | "success" | "error";
  type ColorMode = "solid" | "gradient";

  type Palette = {
    name: string;
    fg: string;
    bg: string;
    gradient: [string, string];
  };

  function buildQRValue(type: InputType, value: string): string {
    const v = value.trim();
    if (!v) return "";
    switch (type) {
      case "url":
        return v.match(/^https?:\/\//) ? v : `https://${v}`;
      case "text":
        return v;
      case "email":
        return `mailto:${v}`;
      case "phone":
        return `tel:${v.replace(/\s+/g, "")}`;
    }
  }

  function buildSVG(
    text: string,
    ecLevel: ECLevel,
    dotStyle: DotStyle,
    fgColor: string,
    bgColor: string,
    colorMode: ColorMode,
    gradient: [string, string],
    logo: string | null
  ): string | null {
    if (!text) return null;
    try {
      const qr = QRCodeLib.create(text, { errorCorrectionLevel: ecLevel });
      const n = qr.modules.size;
      const cell = 10;
      const pad = 4 * cell;
      const total = n * cell + pad * 2;
      const parts: string[] = [];
      const gradientId = "qrGradient";
      const fill = colorMode === "gradient" ? `url(#${gradientId})` : fgColor;
      const defs =
        colorMode === "gradient"
          ? `<defs><linearGradient id="${gradientId}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${total}" y2="${total}"><stop offset="0%" stop-color="${gradient[0]}"/><stop offset="100%" stop-color="${gradient[1]}"/></linearGradient></defs>`
          : "";
      for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
          if (qr.modules.get(r, c)) {
            const x = pad + c * cell;
            const y = pad + r * cell;
            parts.push(
              dotStyle === "round"
                ? `<circle cx="${x + cell / 2}" cy="${y + cell / 2}" r="${cell * 0.44}" fill="${fill}"/>`
                : `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="${fill}"/>`
            );
          }
        }
      }
      let logoEl = "";
      if (logo) {
        const ls = total * 0.22;
        const lx = (total - ls) / 2;
        const ly = (total - ls) / 2;
        logoEl = `<rect x="${lx - 6}" y="${ly - 6}" width="${ls + 12}" height="${ls + 12}" fill="${bgColor}" rx="4"/><image href="${logo}" x="${lx}" y="${ly}" width="${ls}" height="${ls}" preserveAspectRatio="xMidYMid meet"/>`;
      }
      return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${total} ${total}" width="${total}" height="${total}" style="max-width:100%;height:auto;display:block;">${defs}<rect width="${total}" height="${total}" fill="${bgColor}"/>${parts.join("")}${logoEl}</svg>`;
    } catch {
      return null;
    }
  }

  const EC_HINTS: Record<ECLevel, string> = {
    L: "復元率7% - 最小サイズ",
    M: "復元率15% - おすすめ",
    Q: "復元率25% - ロゴ向き",
    H: "復元率30% - 最大",
  };

  const INPUT_TYPE_LABELS: Record<InputType, string> = {
    url: "URL",
    text: "テキスト",
    email: "メール",
    phone: "電話",
  };

  const PLACEHOLDERS: Record<InputType, string> = {
    url: "https://instagram.com/yourbrand",
    text: "テキストを入力...",
    email: "you@example.com",
    phone: "090-1234-5678",
  };

  const DEFAULT_INPUTS: Record<InputType, string> = {
    url: "https://instagram.com/yourbrand",
    text: "Hello from ToolBox",
    email: "you@example.com",
    phone: "090-1234-5678",
  };

  const PALETTES: Palette[] = [
    { name: "AI Neon", fg: "#4F46E5", bg: "#F8FAFC", gradient: ["#4F46E5", "#06B6D4"] },
    { name: "Aurora", fg: "#60A5FA", bg: "#F8FAFC", gradient: ["#60A5FA", "#A78BFA"] },
    { name: "Mesh", fg: "#FF6B6B", bg: "#FFFDF7", gradient: ["#FF6B6B", "#4D96FF"] },
    { name: "Mono", fg: "#111111", bg: "#FFFFFF", gradient: ["#111111", "#6B7280"] },
    { name: "Social", fg: "#7C3AED", bg: "#F8FAFC", gradient: ["#7C3AED", "#F0ABFC"] },
  ];

  let inputType = $state<InputType>("url");
  let input = $state(DEFAULT_INPUTS.url);
  let ecLevel = $state<ECLevel>("M");
  let dotStyle = $state<DotStyle>("square");
  let fgColor = $state("#4F46E5");
  let bgColor = $state("#F8FAFC");
  let colorMode = $state<ColorMode>("gradient");
  let gradient = $state<[string, string]>(["#4F46E5", "#06B6D4"]);
  let activePalette = $state<string | null>("AI Neon");
  let logo = $state<string | null>(null);
  let scanStatus = $state<ScanStatus>("idle");
  let scannedValue = $state<string | null>(null);

  let videoEl: HTMLVideoElement | null = $state(null);
  let scanCanvas: HTMLCanvasElement | null = $state(null);
  let rafId = 0;
  let stream: MediaStream | null = null;
  let logoInput: HTMLInputElement | null = $state(null);

  const qrValue = $derived(buildQRValue(inputType, input));
  const svgString = $derived(
    buildSVG(qrValue, ecLevel, dotStyle, fgColor, bgColor, colorMode, gradient, logo)
  );

  function selectInputType(type: InputType) {
    inputType = type;
    input = DEFAULT_INPUTS[type];
  }

  function applyPalette(palette: Palette) {
    fgColor = palette.fg;
    bgColor = palette.bg;
    gradient = palette.gradient;
    colorMode = "gradient";
    activePalette = palette.name;
  }

  function handleLogoUpload(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => (logo = ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function removeLogo() {
    logo = null;
    if (logoInput) logoInput.value = "";
  }

  function downloadSVG() {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "qr-code.svg";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function downloadPNG() {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = 4;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const a = document.createElement("a");
      a.download = "qr-code.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = url;
  }

  function stopScan() {
    cancelAnimationFrame(rafId);
    stream?.getTracks().forEach((t) => t.stop());
    stream = null;
    scanStatus = "idle";
  }

  async function startScan() {
    scanStatus = "scanning";
    scannedValue = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      const video = videoEl!;
      video.srcObject = stream;
      await video.play();
      const tick = async () => {
        const canvas = scanCanvas;
        if (!canvas || !video.videoWidth) {
          rafId = requestAnimationFrame(tick);
          return;
        }
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(video, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const jsQR = (await import("jsqr")).default;
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          scannedValue = code.data;
          scanStatus = "success";
          stream?.getTracks().forEach((t) => t.stop());
          stream = null;
          return;
        }
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    } catch {
      scanStatus = "error";
    }
  }

  $effect(() => {
    return () => {
      cancelAnimationFrame(rafId);
      stream?.getTracks().forEach((t) => t.stop());
    };
  });
</script>

<div class="qr-layout glass-card">
  <div class="qr-panel">
    <div>
      <span class="qr-section-label">コンテンツの種類</span>
      <div class="option-tabs">
        {#each ["url", "text", "email", "phone"] as t (t)}
          <button
            type="button"
            class="option-tab"
            class:is-active={inputType === t}
            onclick={() => selectInputType(t as InputType)}
          >
            {INPUT_TYPE_LABELS[t as InputType]}
          </button>
        {/each}
      </div>
    </div>

    <input
      type="text"
      class="qr-field"
      bind:value={input}
      placeholder={PLACEHOLDERS[inputType]}
    />

    <div class="qr-divider"></div>

    <div>
      <span class="qr-section-label">誤り訂正レベル</span>
      <div class="option-tabs">
        {#each ["L", "M", "Q", "H"] as lv (lv)}
          <button
            type="button"
            class="option-tab"
            class:is-active={ecLevel === lv}
            onclick={() => (ecLevel = lv as ECLevel)}
          >
            {lv}
          </button>
        {/each}
      </div>
      <p class="option-hint">{EC_HINTS[ecLevel]}</p>
    </div>

    <div>
      <span class="qr-section-label">ドットのスタイル</span>
      <div class="option-tabs">
        <button type="button" class="option-tab" class:is-active={dotStyle === "square"} onclick={() => (dotStyle = "square")}>
          ■ Square
        </button>
        <button type="button" class="option-tab" class:is-active={dotStyle === "round"} onclick={() => (dotStyle = "round")}>
          ● Round
        </button>
      </div>
    </div>

    <div>
      <span class="qr-section-label">カラー</span>
      <div class="palette-grid">
        {#each PALETTES as palette (palette.name)}
          <button type="button" class="palette-card" class:is-active={activePalette === palette.name} onclick={() => applyPalette(palette)}>
            <span class="palette-swatch" style={`background:${palette.bg}`}>
              <span class="palette-swatch-inner" style={`background: linear-gradient(135deg, ${palette.gradient[0]} 0%, ${palette.gradient[1]} 100%)`}></span>
            </span>
            {palette.name}
          </button>
        {/each}
      </div>

      <div class="option-tabs">
        <button type="button" class="option-tab" class:is-active={colorMode === "solid"} onclick={() => (colorMode = "solid")}>Solid</button>
        <button type="button" class="option-tab" class:is-active={colorMode === "gradient"} onclick={() => (colorMode = "gradient")}>Gradient</button>
      </div>

      <div class="color-controls">
        <div class="color-control">
          <div class="color-control-label">Foreground</div>
          <label class="color-control-input">
            <span class="color-control-swatch" style={`background:${fgColor}`}></span>
            <span class="color-control-value">{fgColor}</span>
            <input type="color" bind:value={fgColor} />
          </label>
        </div>
        <div class="color-control">
          <div class="color-control-label">Background</div>
          <label class="color-control-input">
            <span class="color-control-swatch" style={`background:${bgColor}`}></span>
            <span class="color-control-value">{bgColor}</span>
            <input type="color" bind:value={bgColor} />
          </label>
        </div>
      </div>

      {#if colorMode === "gradient"}
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
      <span class="qr-section-label">ロゴ（任意）</span>
      <div class="logo-row">
        <button type="button" class="logo-button" onclick={() => logoInput?.click()}>
          {logo ? "ロゴを変更" : "画像をアップロード"}
        </button>
        {#if logo}
          <button type="button" class="logo-button remove" onclick={removeLogo}>削除</button>
        {/if}
      </div>
      <input bind:this={logoInput} type="file" accept="image/*" onchange={handleLogoUpload} style="display:none" />
      {#if logo && ecLevel === "L"}
        <p class="option-hint">ヒント: ロゴを追加する場合は誤り訂正レベルをQまたはHにしてください</p>
      {/if}
    </div>
  </div>

  <aside class="tool-preview" aria-label="QRコードのプレビュー">
    <div class="qr-preview-box" class:is-empty={!svgString} style={svgString ? `background:${bgColor}` : ""}>
      {#if svgString}
        {@html svgString}
      {:else}
        <div class="qr-preview-empty">
          <div class="glyph">◼</div>
          <div class="label">内容を入力すると生成されます</div>
        </div>
      {/if}
    </div>

    {#if svgString}
      <div class="qr-download-row">
        <button type="button" class="qr-action" onclick={downloadSVG}>↓ SVG</button>
        <button type="button" class="qr-action" onclick={downloadPNG}>↓ PNG</button>
      </div>

      {#if scanStatus === "idle"}
        <button type="button" class="qr-action secondary" onclick={startScan}>📷 カメラでテスト</button>
      {/if}

      {#if scanStatus === "scanning"}
        <div class="scan-panel">
          <video bind:this={videoEl} muted playsinline></video>
          <canvas bind:this={scanCanvas} style="display:none"></canvas>
          <div class="scan-panel-bar">
            <span>QRコードにカメラを向けてください</span>
            <button type="button" class="scan-stop" onclick={stopScan}>停止</button>
          </div>
        </div>
      {/if}

      {#if scanStatus === "success" && scannedValue}
        <div class="scan-result">
          <div class="scan-result-title">✓ スキャン成功</div>
          <div class="scan-result-value">{scannedValue}</div>
          <button type="button" class="scan-result-retry" onclick={() => { scanStatus = "idle"; scannedValue = null; }}>
            もう一度試す →
          </button>
        </div>
      {/if}

      {#if scanStatus === "error"}
        <div class="scan-error">
          <span>カメラが利用できません。モバイル端末でお試しください。</span>
          <button type="button" onclick={() => (scanStatus = "idle")}>✕</button>
        </div>
      {/if}
    {/if}
  </aside>
</div>
