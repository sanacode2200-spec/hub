<script lang="ts">
  import { onDestroy } from "svelte";
  import type { FFmpeg } from "@ffmpeg/ffmpeg";

  type Status = "idle" | "loading-ffmpeg" | "converting" | "done" | "error";
  type InputFormat = {
    extension: "mov" | "webm";
    mimeType: string;
    command: (inputName: string) => string[];
  };

  const FFMPEG_CORE_URL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
  const OUTPUT_FILE = "output.mp4";
  const INPUT_FORMATS: InputFormat[] = [
    {
      extension: "mov",
      mimeType: "video/quicktime",
      command: (inputName) => ["-i", inputName, "-c", "copy", OUTPUT_FILE],
    },
    {
      extension: "webm",
      mimeType: "video/webm",
      command: (inputName) => [
        "-i", inputName,
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "23",
        "-c:a", "aac",
        "-b:a", "128k",
        OUTPUT_FILE,
      ],
    },
  ];

  let status = $state<Status>("idle");
  let progress = $state(0);
  let outputUrl = $state<string | null>(null);
  let outputName = $state("");
  let stats = $state<{ size: string; time: string } | null>(null);
  let isDragOver = $state(false);
  let errorMsg = $state<string | null>(null);

  let ffmpeg: FFmpeg | null = null;
  let startTime = 0;
  let fileInput: HTMLInputElement | null = $state(null);

  function getInputFormat(file: File) {
    return INPUT_FORMATS.find(
      ({ extension, mimeType }) =>
        file.type === mimeType || file.name.toLowerCase().endsWith(`.${extension}`)
    );
  }

  function clearOutputUrl() {
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    outputUrl = null;
  }

  async function deleteFile(instance: FFmpeg, fileName: string) {
    try {
      await instance.deleteFile(fileName);
    } catch {
      // The file may not exist if conversion failed before it was created.
    }
  }

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
    const format = getInputFormat(file);
    if (!format) {
      errorMsg = "MOVまたはWebMファイルを選択してください。";
      return;
    }
    errorMsg = null;
    clearOutputUrl();
    status = "loading-ffmpeg";
    progress = 0;
    startTime = Date.now();

    let instance: FFmpeg | null = null;
    const inputName = `input.${format.extension}`;

    try {
      const { fetchFile } = await import("@ffmpeg/util");
      instance = ffmpeg ?? (await loadFFmpeg());

      status = "converting";
      await instance.writeFile(inputName, await fetchFile(file));
      await instance.exec(format.command(inputName));
      const raw = (await instance.readFile(OUTPUT_FILE)) as Uint8Array;

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
      errorMsg = "このファイルは変換できませんでした。別のファイルでお試しください。";
      status = "error";
    } finally {
      if (instance) {
        await Promise.all([
          deleteFile(instance, inputName),
          deleteFile(instance, OUTPUT_FILE),
        ]);
      }
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
    clearOutputUrl();
    status = "idle";
    progress = 0;
    stats = null;
    errorMsg = null;
    if (fileInput) fileInput.value = "";
  }

  onDestroy(() => {
    clearOutputUrl();
    ffmpeg?.terminate();
  });
</script>

<div class="glass-card mov-tool" aria-label="MOV / WebM to MP4 コンバーター">
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
        accept=".mov,.MOV,.webm,.WEBM,video/quicktime,video/webm"
        onchange={handleFileChange}
        style="display:none"
      />
      <div class="mov-dropzone-icon">↑</div>
      <div class="mov-dropzone-title">MOV / WebMファイルをここにドロップ</div>
      <div class="mov-dropzone-hint">またはクリックして選択 — ブラウザ内で変換されます</div>
    </div>

    {#if errorMsg}
      <div class="mov-error">{errorMsg}</div>
    {/if}
  {/if}

  {#if status === "loading-ffmpeg"}
    <div class="mov-state">
      <div class="mov-state-label">FFmpegを読み込み中…</div>
      <div class="mov-progress-track">
        <div class="mov-progress-bar is-indeterminate"></div>
      </div>
    </div>
  {/if}

  {#if status === "converting"}
    <div class="mov-state">
      <div class="mov-state-label">変換中…</div>
      <div class="mov-progress-value">{progress}%</div>
      <div class="mov-progress-track">
        <div class="mov-progress-bar" style={`width:${progress}%`}></div>
      </div>
    </div>
  {/if}

  {#if status === "done" && outputUrl}
    <div class="mov-state">
      <div class="mov-result-icon">✓</div>
      <div class="mov-result-title">MP4の準備ができました</div>
      {#if stats}
        <div class="mov-result-meta">{stats.size} · {stats.time}</div>
      {/if}
      <div class="mov-action-row">
        <a class="mov-action" href={outputUrl} download={outputName}>↓ MP4をダウンロード</a>
        <button type="button" class="mov-action secondary" onclick={reset}>別のファイルを変換</button>
      </div>
    </div>
  {/if}
</div>
