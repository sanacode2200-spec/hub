"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";

type Status = "idle" | "loading-ffmpeg" | "converting" | "done" | "error";

const FFMPEG_CORE_URL =
  "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";

export default function MovToMp4Converter() {
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputName, setOutputName] = useState("");
  const [stats, setStats] = useState<{ size: string; time: string } | null>(
    null
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ffmpegRef = useRef<any>(null);
  const startTimeRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFFmpeg = async () => {
    const { FFmpeg } = await import("@ffmpeg/ffmpeg");
    const { toBlobURL } = await import("@ffmpeg/util");

    const ffmpeg = new FFmpeg();
    ffmpeg.on("progress", ({ progress: p }: { progress: number }) => {
      setProgress(Math.round(p * 100));
    });
    await ffmpeg.load({
      coreURL: await toBlobURL(
        `${FFMPEG_CORE_URL}/ffmpeg-core.js`,
        "text/javascript"
      ),
      wasmURL: await toBlobURL(
        `${FFMPEG_CORE_URL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });
    ffmpegRef.current = ffmpeg;
    return ffmpeg;
  };

  const convert = async (file: File) => {
    if (!file.name.match(/\.(mov|MOV)$/i) && file.type !== "video/quicktime") {
      setErrorMsg("Please choose a MOV file.");
      return;
    }
    setErrorMsg(null);
    setOutputUrl(null);
    setStatus("loading-ffmpeg");
    setProgress(0);
    startTimeRef.current = Date.now();

    try {
      const { fetchFile } = await import("@ffmpeg/util");
      const ffmpeg = ffmpegRef.current ?? (await loadFFmpeg());

      setStatus("converting");
      await ffmpeg.writeFile("input.mov", await fetchFile(file));
      await ffmpeg.exec(["-i", "input.mov", "-c", "copy", "output.mp4"]);
      const raw = (await ffmpeg.readFile("output.mp4")) as Uint8Array;

      await ffmpeg.deleteFile("input.mov");
      await ffmpeg.deleteFile("output.mp4");

      const data = new Uint8Array(raw);
      const blob = new Blob([data], { type: "video/mp4" });
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);

      const baseName = file.name.replace(/\.[^.]+$/, "");
      setOutputName(`${baseName}.mp4`);

      const elapsed = ((Date.now() - startTimeRef.current) / 1000).toFixed(1);
      const sizeMB = (blob.size / 1024 / 1024).toFixed(1);
      setStats({ size: `${sizeMB} MB`, time: `${elapsed}s` });
      setStatus("done");
    } catch (err) {
      console.error(err);
      setErrorMsg(
        "We could not convert this file. Try another MOV video."
      );
      setStatus("error");
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) convert(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) convert(file);
  };

  const reset = () => {
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setOutputUrl(null);
    setStatus("idle");
    setProgress(0);
    setStats(null);
    setErrorMsg(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0a0010 0%, #0e0025 35%, #06001a 65%, #080808 100%)",
        color: "white",
        fontFamily: "var(--font-dm-mono, system-ui), monospace",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Purple ambient glow */}
      <div
        style={{
          position: "fixed",
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "600px",
          background:
            "radial-gradient(ellipse, rgba(110,50,255,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "960px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Nav */}
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "28px 0",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-instrument-serif, serif), serif",
              fontSize: "18px",
              fontStyle: "italic",
              color: "rgba(255,255,255,0.55)",
              textDecoration: "none",
              letterSpacing: "-0.02em",
              transition: "color 0.2s",
            }}
          >
            toolbox
          </Link>
          <span
            style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Free · No signup · Browser only
          </span>
        </nav>

        {/* Hero */}
        <div style={{ padding: "74px 0 34px", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 18px",
              border: "1px solid rgba(140,108,255,0.28)",
              borderRadius: "999px",
              background: "rgba(124,58,255,0.13)",
              boxShadow: "0 0 32px rgba(124,58,255,0.14)",
              fontSize: "12px",
              letterSpacing: "0.02em",
              color: "rgba(202,190,255,0.88)",
              marginBottom: "24px",
              fontFamily: "var(--font-dm-mono), monospace",
              fontWeight: 700,
            }}
          >
            <span
              style={{
                padding: "2px 7px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.12)",
                color: "white",
                fontSize: "10px",
                letterSpacing: "0.04em",
              }}
            >
              NEW
            </span>
            iPhone video compatibility
          </div>
          <h1
            style={{
              fontSize: "clamp(58px, 9.2vw, 96px)",
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              color: "white",
              marginBottom: "26px",
              fontFamily:
                "system-ui, -apple-system, 'Segoe UI', sans-serif",
            }}
          >
            Drop videos. Get
            <br />
            <span
              style={{
                background:
                  "linear-gradient(100deg, #d8c8ff 0%, #9f7cff 42%, #4f8cff 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}
            >
              MP4.
            </span>
          </h1>
          <p
            style={{
              fontSize: "17px",
              color: "rgba(226,220,255,0.62)",
              maxWidth: "650px",
              margin: "0 auto",
              lineHeight: 1.65,
              letterSpacing: "0",
              fontFamily: "var(--font-dm-mono), monospace",
            }}
          >
            iPhone MOV, HEVC, HDR, and 4K videos into Windows-friendly MP4
            files - without uploading anything.
          </p>
        </div>

        {/* Converter area */}
        <div style={{ marginBottom: "80px" }}>
          {(status === "idle" || status === "error") && (
            <>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                style={{
                  border: "1px solid",
                  borderColor: isDragOver
                    ? "rgba(125,105,255,0.92)"
                    : "rgba(125,105,255,0.42)",
                  borderRadius: "26px",
                  padding: "44px 40px",
                  minHeight: "292px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  cursor: "pointer",
                  background: isDragOver
                    ? "linear-gradient(135deg, rgba(44,30,92,0.92), rgba(7,53,76,0.86))"
                    : "linear-gradient(135deg, rgba(12,12,27,0.94), rgba(4,37,55,0.78))",
                  boxShadow:
                    "0 28px 90px rgba(20,7,48,0.42), inset 0 0 48px rgba(80,130,255,0.05)",
                  transition: "all 0.2s ease",
                }}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".mov,.MOV,video/quicktime"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <div
                  style={{
                    width: "66px",
                    height: "66px",
                    borderRadius: "20px",
                    border: "1px solid rgba(140,108,255,0.44)",
                    background: "rgba(124,58,255,0.13)",
                    color: "rgba(255,255,255,0.88)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "38px",
                    lineHeight: 1,
                    marginBottom: "22px",
                  }}
                >
                  ↑
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    color: "rgba(255,255,255,0.88)",
                    marginBottom: "8px",
                    fontWeight: 800,
                    fontFamily:
                      "system-ui, -apple-system, 'Segoe UI', sans-serif",
                  }}
                >
                  Drop iPhone videos here
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "rgba(223,220,255,0.58)",
                    letterSpacing: "0",
                    fontWeight: 700,
                    marginBottom: "22px",
                  }}
                >
                  MOV · HEVC · HDR · 4K · local processing
                </div>
                <button
                  type="button"
                  style={{
                    border: 0,
                    borderRadius: "999px",
                    padding: "13px 22px",
                    background:
                      "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)",
                    color: "white",
                    fontWeight: 800,
                    fontSize: "13px",
                    cursor: "pointer",
                    boxShadow: "0 14px 36px rgba(91,88,255,0.38)",
                  }}
                >
                  Choose a file
                </button>
              </div>
              {errorMsg && (
                <div
                  style={{
                    marginTop: "16px",
                    fontSize: "13px",
                    color: "rgba(255,90,90,0.85)",
                    background: "rgba(255,0,0,0.04)",
                    padding: "12px 16px",
                    borderRadius: "2px",
                    border: "1px solid rgba(255,80,80,0.18)",
                    textAlign: "center",
                  }}
                >
                  {errorMsg}
                </div>
              )}
            </>
          )}

          {status === "loading-ffmpeg" && (
            <div
              style={{
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "4px",
                padding: "80px 40px",
                textAlign: "center",
                background: "rgba(255,255,255,0.015)",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.4)",
                  marginBottom: "24px",
                  letterSpacing: "0.06em",
                }}
              >
                Loading FFmpeg...
              </div>
              <div
                style={{
                  width: "100%",
                  maxWidth: "320px",
                  height: "2px",
                  background: "rgba(255,255,255,0.07)",
                  borderRadius: "1px",
                  margin: "0 auto",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background:
                      "linear-gradient(90deg, #7c3aff, #3b82f6)",
                    animation: "shimmer 1.6s ease-in-out infinite",
                    width: "50%",
                  }}
                />
              </div>
            </div>
          )}

          {status === "converting" && (
            <div
              style={{
                border: "1px solid rgba(120,60,255,0.2)",
                borderRadius: "4px",
                padding: "80px 40px",
                textAlign: "center",
                background: "rgba(120,60,255,0.03)",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.4)",
                  marginBottom: "12px",
                  letterSpacing: "0.06em",
                }}
              >
                Converting...
              </div>
              <div
                style={{
                  fontSize: "40px",
                  fontWeight: 700,
                  color: "rgba(160,110,255,0.95)",
                  marginBottom: "28px",
                  fontFamily:
                    "system-ui, -apple-system, sans-serif",
                  letterSpacing: "-0.02em",
                }}
              >
                {progress}%
              </div>
              <div
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  height: "3px",
                  background: "rgba(255,255,255,0.07)",
                  borderRadius: "2px",
                  margin: "0 auto",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progress}%`,
                    background:
                      "linear-gradient(90deg, #7c3aff, #3b82f6)",
                    transition: "width 0.3s ease",
                    borderRadius: "2px",
                  }}
                />
              </div>
            </div>
          )}

          {status === "done" && outputUrl && (
            <div
              style={{
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: "4px",
                padding: "56px 40px",
                textAlign: "center",
                background: "rgba(255,255,255,0.015)",
              }}
            >
              <div
                style={{
                  fontSize: "36px",
                  marginBottom: "16px",
                  color: "rgba(140,255,140,0.85)",
                }}
              >
                ✓
              </div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.9)",
                  marginBottom: "8px",
                }}
              >
                Your MP4 is ready
              </div>
              {stats && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.3)",
                    marginBottom: "36px",
                    letterSpacing: "0.06em",
                  }}
                >
                  {stats.size} · {stats.time}
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <a
                  href={outputUrl}
                  download={outputName}
                  style={{
                    display: "inline-block",
                    background:
                      "linear-gradient(135deg, #7c3aff, #3b82f6)",
                    color: "white",
                    textDecoration: "none",
                    padding: "14px 36px",
                    borderRadius: "2px",
                    fontSize: "13px",
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                    fontFamily: "var(--font-dm-mono), monospace",
                  }}
                >
                  Download MP4
                </a>
                <button
                  onClick={reset}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.14)",
                    color: "rgba(255,255,255,0.45)",
                    cursor: "pointer",
                    padding: "14px 28px",
                    borderRadius: "2px",
                    fontSize: "13px",
                    letterSpacing: "0.06em",
                    transition: "all 0.2s",
                    fontFamily: "var(--font-dm-mono), monospace",
                  }}
                >
                  Convert another file
                </button>
              </div>
            </div>
          )}
        </div>

        {/* How it works */}
        <section style={{ marginBottom: "72px" }}>
          <h2
            style={{
              fontSize: "11px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
              marginBottom: "32px",
            }}
          >
            How it works
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1px",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            {[
              {
                step: "01",
                title: "Choose a video",
                desc: "Drop a MOV file from your iPhone or click to browse.",
              },
              {
                step: "02",
                title: "Convert locally",
                desc: "ffmpeg.wasm runs in your browser, so your video never leaves your device.",
              },
              {
                step: "03",
                title: "Download MP4",
                desc: "Save the finished MP4 and use it on Windows, Android, or the web.",
              },
            ].map((item) => (
              <div
                key={item.step}
                style={{
                  padding: "28px 24px",
                  background: "rgba(255,255,255,0.015)",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    color: "rgba(120,60,255,0.7)",
                    letterSpacing: "0.1em",
                    marginBottom: "12px",
                    fontFamily: "var(--font-dm-mono), monospace",
                  }}
                >
                  {item.step}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.7)",
                    marginBottom: "8px",
                    fontWeight: 500,
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.3)",
                    lineHeight: 1.65,
                    fontFamily: "var(--font-dm-mono), monospace",
                  }}
                >
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section style={{ marginBottom: "72px" }}>
          <h2
            style={{
              fontSize: "11px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
              marginBottom: "24px",
            }}
          >
            Features
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "8px",
            }}
          >
            {[
              "🔒 Files stay in your browser",
              "⚡ Fast remuxing for H.264 + AAC",
              "🆓 Free, with no signup",
              "📵 No ads or tracking",
              "♾️ No server-side upload limit",
              "📱 Built for iPhone videos",
            ].map((f) => (
              <div
                key={f}
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.38)",
                  padding: "12px 16px",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "2px",
                  letterSpacing: "0.02em",
                  fontFamily: "var(--font-dm-mono), monospace",
                }}
              >
                {f}
              </div>
            ))}
          </div>
        </section>

        {/* Hub CTA */}
        <section
          style={{
            marginBottom: "80px",
            padding: "40px",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "4px",
            textAlign: "center",
            background: "rgba(255,255,255,0.01)",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.28)",
              marginBottom: "16px",
              letterSpacing: "0.06em",
              fontFamily: "var(--font-dm-mono), monospace",
            }}
          >
            More free browser tools are coming soon
          </div>
          <Link
            href="/"
            style={{
              display: "inline-block",
              border: "1px solid rgba(255,255,255,0.14)",
              color: "rgba(255,255,255,0.65)",
              textDecoration: "none",
              padding: "12px 28px",
              borderRadius: "2px",
              fontSize: "13px",
              letterSpacing: "0.06em",
              transition: "all 0.2s",
              fontFamily: "var(--font-dm-mono), monospace",
            }}
          >
            View all tools →
          </Link>
        </section>

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "32px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "11px",
            color: "rgba(255,255,255,0.18)",
            letterSpacing: "0.06em",
            fontFamily: "var(--font-dm-mono), monospace",
          }}
        >
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
            toolbox
          </Link>
          <span>No tracking. No ads. No signup.</span>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-150%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}
