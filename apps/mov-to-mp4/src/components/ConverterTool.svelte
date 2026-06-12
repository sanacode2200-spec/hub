<script lang="ts">
  type Status = "idle" | "loading-ffmpeg" | "converting" | "done" | "error";

  const FFMPEG_CORE_URL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";

  let status = $state<Status>("idle");
  let progress = $state(0);
  let outputUrl = $state<string | null>(null);
  let outputName = $state("");
  let stats = $state<{ size: string; time: string } | null>(null);
  let isDragOver = $state(false);
  let errorMsg = $state<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let ffmpeg: any = null;
  let startTime = 0;
  let fileInput: HTMLInputElement | null = $state(null);

  async function loadFFmpeg() {
    const { FFmpeg } = await import("@ffmpeg/ffmpeg");
    const { toBlobURL } = await import("@ffmpeg/util");

    const instance = new FFmpeg();
    instance.on("progress", ({ progress: p }: { progress: number }) => {
      progress = Math.round(p * 100);
    });
    await instance.load({
      coreURL: await toBlobURL(`${FFMPEG_CORE_URL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${FFMPEG_CORE_URL}/ffmpeg-core.wasm`, "application/wasm"),
    });
    ffmpeg = instance;
    return instance;
  }

  async function convert(file: File) {
    if (!file.name.match(/\.(mov)$/i) && file.type !== "video/quicktime") {
      errorMsg = "Please choose a MOV file.";
      return;
    }
    errorMsg = null;
    outputUrl = null;
    status = "loading-ffmpeg";
    progress = 0;
    startTime = Date.now();

    try {
      const { fetchFile } = await import("@ffmpeg/util");
      const instance = ffmpeg ?? (await loadFFmpeg());

      status = "converting";
      await instance.writeFile("input.mov", await fetchFile(file));
      await instance.exec(["-i", "input.mov", "-c", "copy", "output.mp4"]);
      const raw = (await instance.readFile("output.mp4")) as Uint8Array;

      await instance.deleteFile("input.mov");
      await instance.deleteFile("output.mp4");

      const data = new Uint8Array(raw);
      const blob = new Blob([data], { type: "video/mp4" });
      outputUrl = URL.createObjectURL(blob);

      const baseName = file.name.replace(/\.[^.]+$/, "");
      outputName = `${baseName}.mp4`;

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const sizeMB = (blob.size / 1024 / 1024).toFixed(1);
      stats = { size: `${sizeMB} MB`, time: `${elapsed}s` };
      status = "done";
    } catch (err) {
      console.error(err);
      errorMsg = "We could not convert this file. Try another MOV video.";
      status = "error";
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    isDragOver = false;
    const file = e.dataTransfer?.files[0];
    if (file) convert(file);
  }

  function handleFileChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) convert(file);
  }

  function reset() {
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    outputUrl = null;
    status = "idle";
    progress = 0;
    stats = null;
    errorMsg = null;
    if (fileInput) fileInput.value = "";
  }
</script>

<div class="glass-card mov-tool" aria-label="MOV to MP4 converter">
  {#if status === "idle" || status === "error"}
    <div
      class="mov-dropzone"
      class:is-drag={isDragOver}
      role="button"
      tabindex="0"
      ondragover={(e) => { e.preventDefault(); isDragOver = true; }}
      ondragleave={() => (isDragOver = false)}
      ondrop={handleDrop}
      onclick={() => fileInput?.click()}
      onkeydown={(e) => { if (e.key === "Enter" || e.key === " ") fileInput?.click(); }}
    >
      <input
        bind:this={fileInput}
        type="file"
        accept=".mov,.MOV,video/quicktime"
        onchange={handleFileChange}
        style="display:none"
      />
      <div class="mov-dropzone-icon">↑</div>
      <div class="mov-dropzone-title">Drop your MOV file here</div>
      <div class="mov-dropzone-hint">or click to browse — converted locally in your browser</div>
    </div>

    {#if errorMsg}
      <div class="mov-error">{errorMsg}</div>
    {/if}
  {/if}

  {#if status === "loading-ffmpeg"}
    <div class="mov-state">
      <div class="mov-state-label">Loading FFmpeg…</div>
      <div class="mov-progress-track">
        <div class="mov-progress-bar is-indeterminate"></div>
      </div>
    </div>
  {/if}

  {#if status === "converting"}
    <div class="mov-state">
      <div class="mov-state-label">Converting…</div>
      <div class="mov-progress-value">{progress}%</div>
      <div class="mov-progress-track">
        <div class="mov-progress-bar" style={`width:${progress}%`}></div>
      </div>
    </div>
  {/if}

  {#if status === "done" && outputUrl}
    <div class="mov-state">
      <div class="mov-result-icon">✓</div>
      <div class="mov-result-title">Your MP4 is ready</div>
      {#if stats}
        <div class="mov-result-meta">{stats.size} · {stats.time}</div>
      {/if}
      <div class="mov-action-row">
        <a class="mov-action" href={outputUrl} download={outputName}>↓ Download MP4</a>
        <button type="button" class="mov-action secondary" onclick={reset}>Convert another file</button>
      </div>
    </div>
  {/if}
</div>
