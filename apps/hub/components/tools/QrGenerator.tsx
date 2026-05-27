"use client"

import { useState, useRef, useCallback, useMemo, useEffect } from "react"
import Link from "next/link"
import * as QRCodeLib from "qrcode"

type InputType = "url" | "text" | "email" | "phone"
type ECLevel = "L" | "M" | "Q" | "H"
type DotStyle = "square" | "round"
type ScanStatus = "idle" | "scanning" | "success" | "error"
type ColorMode = "solid" | "gradient"

type Palette = {
  name: string
  fg: string
  bg: string
  gradient: [string, string]
}

function buildQRValue(type: InputType, value: string): string {
  const v = value.trim()
  if (!v) return ""
  switch (type) {
    case "url":    return v.match(/^https?:\/\//) ? v : `https://${v}`
    case "text":   return v
    case "email":  return `mailto:${v}`
    case "phone":  return `tel:${v.replace(/\s+/g, "")}`
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
  if (!text) return null
  try {
    const qr = QRCodeLib.create(text, { errorCorrectionLevel: ecLevel })
    const n = qr.modules.size
    const cell = 10
    const pad = 4 * cell
    const total = n * cell + pad * 2
    const parts: string[] = []
    const gradientId = "qrGradient"
    const fill = colorMode === "gradient" ? `url(#${gradientId})` : fgColor
    const defs = colorMode === "gradient"
      ? `<defs><linearGradient id="${gradientId}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${total}" y2="${total}"><stop offset="0%" stop-color="${gradient[0]}"/><stop offset="100%" stop-color="${gradient[1]}"/></linearGradient></defs>`
      : ""
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (qr.modules.get(r, c)) {
          const x = pad + c * cell
          const y = pad + r * cell
          parts.push(
            dotStyle === "round"
              ? `<circle cx="${x + cell / 2}" cy="${y + cell / 2}" r="${cell * 0.44}" fill="${fill}"/>`
              : `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="${fill}"/>`
          )
        }
      }
    }
    let logoEl = ""
    if (logo) {
      const ls = total * 0.22
      const lx = (total - ls) / 2
      const ly = (total - ls) / 2
      logoEl = `<rect x="${lx - 6}" y="${ly - 6}" width="${ls + 12}" height="${ls + 12}" fill="${bgColor}" rx="4"/><image href="${logo}" x="${lx}" y="${ly}" width="${ls}" height="${ls}" preserveAspectRatio="xMidYMid meet"/>`
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${total} ${total}" width="${total}" height="${total}" style="max-width:100%;height:auto;display:block;">${defs}<rect width="${total}" height="${total}" fill="${bgColor}"/>${parts.join("")}${logoEl}</svg>`
  } catch {
    return null
  }
}

const MONO = "var(--font-dm-mono), monospace"

const EC_HINTS: Record<ECLevel, string> = {
  L: "7% recovery — smallest QR",
  M: "15% recovery — recommended",
  Q: "25% recovery — good for logos",
  H: "30% recovery — maximum",
}

const PLACEHOLDERS: Record<InputType, string> = {
  url: "https://instagram.com/yourbrand",
  text: "Enter any text...",
  email: "you@example.com",
  phone: "+1 234 567 8900",
}

const DEFAULT_INPUTS: Record<InputType, string> = {
  url: "https://instagram.com/yourbrand",
  text: "Hello from Toolbox",
  email: "you@example.com",
  phone: "+1 234 567 8900",
}

const PALETTES: Palette[] = [
  { name: "AI Neon", fg: "#4F46E5", bg: "#F8FAFC", gradient: ["#4F46E5", "#06B6D4"] },
  { name: "Aurora", fg: "#60A5FA", bg: "#F8FAFC", gradient: ["#60A5FA", "#A78BFA"] },
  { name: "Mesh", fg: "#FF6B6B", bg: "#FFFDF7", gradient: ["#FF6B6B", "#4D96FF"] },
  { name: "Mono", fg: "#111111", bg: "#FFFFFF", gradient: ["#111111", "#6B7280"] },
  { name: "Social", fg: "#7C3AED", bg: "#F8FAFC", gradient: ["#7C3AED", "#F0ABFC"] },
]

export default function QrGenerator() {
  const [inputType, setInputType] = useState<InputType>("url")
  const [input, setInput] = useState(DEFAULT_INPUTS.url)
  const [ecLevel, setEcLevel] = useState<ECLevel>("M")
  const [dotStyle, setDotStyle] = useState<DotStyle>("square")
  const [fgColor, setFgColor] = useState("#4F46E5")
  const [bgColor, setBgColor] = useState("#F8FAFC")
  const [colorMode, setColorMode] = useState<ColorMode>("gradient")
  const [gradient, setGradient] = useState<[string, string]>(["#4F46E5", "#06B6D4"])
  const [logo, setLogo] = useState<string | null>(null)
  const [scanStatus, setScanStatus] = useState<ScanStatus>("idle")
  const [scannedValue, setScannedValue] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const scanCanvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const streamRef = useRef<MediaStream | null>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  const qrValue = useMemo(() => buildQRValue(inputType, input), [inputType, input])
  const svgString = useMemo(
    () => buildSVG(qrValue, ecLevel, dotStyle, fgColor, bgColor, colorMode, gradient, logo),
    [qrValue, ecLevel, dotStyle, fgColor, bgColor, colorMode, gradient, logo]
  )

  const applyPalette = (palette: Palette) => {
    setFgColor(palette.fg)
    setBgColor(palette.bg)
    setGradient(palette.gradient)
    setColorMode("gradient")
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setLogo(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const downloadSVG = () => {
    if (!svgString) return
    const blob = new Blob([svgString], { type: "image/svg+xml" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = "qr-code.svg"
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const downloadPNG = () => {
    if (!svgString) return
    const blob = new Blob([svgString], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      const scale = 4
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      const ctx = canvas.getContext("2d")!
      ctx.scale(scale, scale)
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
      const a = document.createElement("a")
      a.download = "qr-code.png"
      a.href = canvas.toDataURL("image/png")
      a.click()
    }
    img.src = url
  }

  const stopScan = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setScanStatus("idle")
  }, [])

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current)
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  const startScan = useCallback(async () => {
    setScanStatus("scanning")
    setScannedValue(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      streamRef.current = stream
      const video = videoRef.current!
      video.srcObject = stream
      await video.play()
      const tick = async () => {
        const canvas = scanCanvasRef.current
        if (!canvas || !video.videoWidth) { rafRef.current = requestAnimationFrame(tick); return }
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext("2d")!
        ctx.drawImage(video, 0, 0)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const jsQR = (await import("jsqr")).default
        const code = jsQR(imageData.data, imageData.width, imageData.height)
        if (code) {
          setScannedValue(code.data)
          setScanStatus("success")
          streamRef.current?.getTracks().forEach((t) => t.stop())
          streamRef.current = null
          return
        }
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    } catch {
      setScanStatus("error")
    }
  }, [])

  const tabStyle = (active: boolean) => ({
    flex: 1, padding: "8px 4px", borderRadius: "2px", border: "1px solid",
    borderColor: active ? "rgba(6,182,212,0.46)" : "rgba(255,255,255,0.07)",
    background: active ? "rgba(79,70,229,0.18)" : "rgba(255,255,255,0.02)",
    color: active ? "rgba(224,242,254,0.96)" : "rgba(255,255,255,0.3)",
    fontSize: "11px", letterSpacing: "0.04em", cursor: "pointer", transition: "all 0.2s", fontFamily: MONO,
  } as React.CSSProperties)

  const sectionLabel = {
    fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" as const,
    color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "10px",
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #050816 0%, #0B1020 38%, #111827 68%, #020617 100%)", color: "white", fontFamily: MONO, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, background: "linear-gradient(115deg, rgba(79,70,229,0.18) 0%, transparent 34%, rgba(6,182,212,0.12) 62%, rgba(124,58,237,0.14) 100%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1040px", margin: "0 auto", padding: "0 24px" }}>
        {/* Nav */}
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "28px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Link href="/" style={{ fontFamily: "var(--font-instrument-serif), serif", fontSize: "18px", fontStyle: "italic", color: "rgba(255,255,255,0.55)", textDecoration: "none", letterSpacing: "-0.02em" }}>
            toolbox
          </Link>
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Free · No signup · Browser only
          </span>
        </nav>

        {/* Hero */}
        <div style={{ padding: "64px 0 48px", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", border: "1px solid rgba(6,182,212,0.34)", borderRadius: "999px", background: "rgba(79,70,229,0.16)", fontSize: "11px", letterSpacing: "0.06em", color: "rgba(224,242,254,0.92)", marginBottom: "24px", boxShadow: "0 0 36px rgba(6,182,212,0.14)" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#06B6D4", display: "inline-block", boxShadow: "0 0 14px #06B6D4" }} />
            Social-ready AI neon QR maker
          </div>
          <h1 style={{ fontSize: "clamp(48px, 8vw, 86px)", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.03em", color: "white", marginBottom: "20px", fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
            Make QR codes
            <br />
            <span style={{ background: "linear-gradient(100deg, #99F6E4 0%, #60A5FA 32%, #A78BFA 68%, #F0ABFC 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>
              people share.
            </span>
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.65 }}>
            Generate QR codes for links, profiles, campaigns, and contact points. Export crisp SVG or PNG assets for posts, reels, decks, and landing pages.
          </p>
        </div>

        {/* Tool */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "4px", marginBottom: "80px", overflow: "hidden" }}>

          {/* Left: Settings */}
          <div style={{ padding: "32px 28px", background: "#0d0d0b" }}>
            {/* Input type */}
            <div style={{ marginBottom: "20px" }}>
              <label style={sectionLabel}>Content Type</label>
              <div style={{ display: "flex", gap: "4px" }}>
                {(["url", "text", "email", "phone"] as InputType[]).map((t) => (
                  <button key={t} onClick={() => { setInputType(t); setInput(DEFAULT_INPUTS[t]) }} style={tabStyle(inputType === t)}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div style={{ marginBottom: "24px" }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={PLACEHOLDERS[inputType]}
                style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "2px", padding: "12px 14px", color: "rgba(255,255,255,0.85)", fontSize: "13px", outline: "none", fontFamily: MONO, transition: "border-color 0.2s" }}
                onFocus={(e) => { e.target.style.borderColor = "rgba(6,182,212,0.48)" }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.09)" }}
              />
            </div>

            <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "24px" }} />

            {/* Error correction */}
            <div style={{ marginBottom: "20px" }}>
              <label style={sectionLabel}>Error Correction</label>
              <div style={{ display: "flex", gap: "4px" }}>
                {(["L", "M", "Q", "H"] as ECLevel[]).map((lv) => (
                  <button key={lv} onClick={() => setEcLevel(lv)} style={{ ...tabStyle(ecLevel === lv), fontSize: "12px", fontWeight: 600 }}>
                    {lv}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", margin: "6px 0 0", lineHeight: 1.5 }}>{EC_HINTS[ecLevel]}</p>
            </div>

            {/* Dot style */}
            <div style={{ marginBottom: "20px" }}>
              <label style={sectionLabel}>Dot Style</label>
              <div style={{ display: "flex", gap: "4px" }}>
                <button onClick={() => setDotStyle("square")} style={tabStyle(dotStyle === "square")}>■ Square</button>
                <button onClick={() => setDotStyle("round")} style={tabStyle(dotStyle === "round")}>● Round</button>
              </div>
            </div>

            {/* Colors */}
            <div style={{ marginBottom: "20px" }}>
              <label style={sectionLabel}>Colors</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(74px, 1fr))", gap: "6px", marginBottom: "12px" }}>
                {PALETTES.map((palette) => (
                  <button
                    key={palette.name}
                    onClick={() => applyPalette(palette)}
                    style={{
                      padding: "8px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "4px",
                      color: "rgba(255,255,255,0.48)",
                      cursor: "pointer",
                      fontSize: "10px",
                      fontFamily: MONO,
                      textAlign: "left",
                    }}
                  >
                    <span style={{ display: "block", height: "28px", borderRadius: "4px", marginBottom: "7px", background: palette.bg, border: "1px solid rgba(255,255,255,0.14)", padding: "4px", boxSizing: "border-box" }}>
                      <span style={{ display: "block", height: "100%", borderRadius: "2px", background: `linear-gradient(135deg, ${palette.gradient[0]} 0%, ${palette.gradient[1]} 100%)`, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.12)" }} />
                    </span>
                    {palette.name}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: "4px", marginBottom: "10px" }}>
                <button onClick={() => setColorMode("solid")} style={tabStyle(colorMode === "solid")}>Solid</button>
                <button onClick={() => setColorMode("gradient")} style={tabStyle(colorMode === "gradient")}>Gradient</button>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                {[
                  { label: "Foreground", id: "qr-fg", color: fgColor, onChange: setFgColor },
                  { label: "Background", id: "qr-bg", color: bgColor, onChange: setBgColor },
                ].map((c) => (
                  <div key={c.id} style={{ flex: 1 }}>
                    <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", marginBottom: "6px" }}>{c.label}</div>
                    <label htmlFor={c.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "2px", cursor: "pointer" }}>
                      <div style={{ width: "14px", height: "14px", borderRadius: "2px", background: c.color, border: "1px solid rgba(255,255,255,0.2)", flexShrink: 0 }} />
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)" }}>{c.color}</span>
                      <input id={c.id} type="color" value={c.color} onChange={(e) => c.onChange(e.target.value)} style={{ display: "none" }} />
                    </label>
                  </div>
                ))}
              </div>
              {colorMode === "gradient" && (
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  {[
                    { label: "Start", id: "qr-gradient-start", color: gradient[0], onChange: (value: string) => setGradient([value, gradient[1]]) },
                    { label: "End", id: "qr-gradient-end", color: gradient[1], onChange: (value: string) => setGradient([gradient[0], value]) },
                  ].map((c) => (
                    <div key={c.id} style={{ flex: 1 }}>
                      <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", marginBottom: "6px" }}>{c.label}</div>
                      <label htmlFor={c.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "2px", cursor: "pointer" }}>
                        <div style={{ width: "14px", height: "14px", borderRadius: "2px", background: c.color, border: "1px solid rgba(255,255,255,0.2)", flexShrink: 0 }} />
                        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)" }}>{c.color}</span>
                        <input id={c.id} type="color" value={c.color} onChange={(e) => c.onChange(e.target.value)} style={{ display: "none" }} />
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Logo */}
            <div>
              <label style={sectionLabel}>Logo (optional)</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => logoInputRef.current?.click()} style={{ padding: "8px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "2px", color: "rgba(255,255,255,0.45)", fontSize: "11px", cursor: "pointer", letterSpacing: "0.04em", fontFamily: MONO }}>
                  {logo ? "Change logo" : "Upload image"}
                </button>
                {logo && (
                  <button onClick={() => { setLogo(null); if (logoInputRef.current) logoInputRef.current.value = "" }} style={{ padding: "8px 12px", background: "transparent", border: "1px solid rgba(255,80,80,0.2)", borderRadius: "2px", color: "rgba(255,100,100,0.6)", fontSize: "11px", cursor: "pointer", fontFamily: MONO }}>
                    Remove
                  </button>
                )}
              </div>
              <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: "none" }} />
              {logo && ecLevel === "L" && (
                <p style={{ fontSize: "10px", color: "rgba(255,190,50,0.7)", margin: "8px 0 0" }}>
                  Tip: use Q or H error correction when adding a logo
                </p>
              )}
            </div>
          </div>

          {/* Right: Preview */}
          <div style={{ padding: "32px 28px", background: "#0b0b0a", display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* QR preview */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: svgString ? bgColor : "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px", aspectRatio: "1", overflow: "hidden", transition: "background 0.2s" }}>
              {svgString ? (
                <div dangerouslySetInnerHTML={{ __html: svgString }} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }} />
              ) : (
                <div style={{ textAlign: "center", color: "rgba(255,255,255,0.1)" }}>
                  <div style={{ fontSize: "52px", marginBottom: "10px" }}>◼</div>
                  <div style={{ fontSize: "11px", letterSpacing: "0.06em" }}>Enter content to generate</div>
                </div>
              )}
            </div>

            {svgString && (
              <>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={downloadSVG} style={{ flex: 1, padding: "11px", background: "rgba(79,70,229,0.22)", border: "1px solid rgba(6,182,212,0.34)", borderRadius: "2px", color: "rgba(224,242,254,0.95)", fontSize: "12px", fontWeight: 600, cursor: "pointer", letterSpacing: "0.04em", fontFamily: MONO, boxShadow: "0 0 22px rgba(79,70,229,0.12)" }}>
                    ↓ SVG
                  </button>
                  <button onClick={downloadPNG} style={{ flex: 1, padding: "11px", background: "rgba(79,70,229,0.22)", border: "1px solid rgba(6,182,212,0.34)", borderRadius: "2px", color: "rgba(224,242,254,0.95)", fontSize: "12px", fontWeight: 600, cursor: "pointer", letterSpacing: "0.04em", fontFamily: MONO, boxShadow: "0 0 22px rgba(6,182,212,0.12)" }}>
                    ↓ PNG
                  </button>
                </div>

                {scanStatus === "idle" && (
                  <button onClick={startScan} style={{ width: "100%", padding: "11px", background: "transparent", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "2px", color: "rgba(255,255,255,0.35)", fontSize: "12px", cursor: "pointer", letterSpacing: "0.04em", fontFamily: MONO }}>
                    📷 Test with camera
                  </button>
                )}

                {scanStatus === "scanning" && (
                  <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: "4px", overflow: "hidden" }}>
                    <video ref={videoRef} muted playsInline style={{ width: "100%", display: "block" }} />
                    <canvas ref={scanCanvasRef} style={{ display: "none" }} />
                    <div style={{ padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0,0,0,0.5)" }}>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em" }}>Point camera at the QR code</span>
                      <button onClick={stopScan} style={{ background: "transparent", border: "1px solid rgba(255,80,80,0.25)", borderRadius: "2px", color: "rgba(255,100,100,0.65)", fontSize: "11px", cursor: "pointer", padding: "4px 10px", fontFamily: MONO }}>
                        Stop
                      </button>
                    </div>
                  </div>
                )}

                {scanStatus === "success" && scannedValue && (
                  <div style={{ padding: "16px", background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.24)", borderRadius: "4px" }}>
                    <div style={{ fontSize: "11px", color: "rgba(224,242,254,0.78)", marginBottom: "8px", letterSpacing: "0.04em" }}>✓ Scanned successfully</div>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", wordBreak: "break-all", lineHeight: 1.6 }}>{scannedValue}</div>
                    <button onClick={() => { setScanStatus("idle"); setScannedValue(null) }} style={{ marginTop: "10px", background: "none", border: "none", color: "rgba(125,211,252,0.58)", fontSize: "10px", cursor: "pointer", padding: 0, letterSpacing: "0.06em", fontFamily: MONO }}>
                      Test again →
                    </button>
                  </div>
                )}

                {scanStatus === "error" && (
                  <div style={{ padding: "12px 14px", background: "rgba(255,0,0,0.04)", border: "1px solid rgba(255,80,80,0.18)", borderRadius: "2px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "rgba(255,100,100,0.7)" }}>Camera not available. Try on a mobile device.</span>
                    <button onClick={() => setScanStatus("idle")} style={{ background: "none", border: "none", color: "rgba(255,100,100,0.45)", fontSize: "16px", cursor: "pointer", padding: "0 0 0 8px" }}>✕</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* How it works */}
        <section style={{ marginBottom: "72px" }}>
          <h2 style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "32px" }}>How it works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1px", background: "rgba(255,255,255,0.04)" }}>
            {[
              { step: "01", title: "Paste a social link", desc: "Use a profile, campaign URL, landing page, email address, or phone number." },
              { step: "02", title: "Style the asset", desc: "Pick AI neon, aurora, mesh, or mono colors and optionally embed a logo." },
              { step: "03", title: "Export & publish", desc: "Download SVG or high-res PNG for posts, stories, flyers, and decks." },
            ].map((item) => (
              <div key={item.step} style={{ padding: "28px 24px", background: "rgba(255,255,255,0.015)" }}>
                <div style={{ fontSize: "11px", color: "rgba(6,182,212,0.62)", letterSpacing: "0.1em", marginBottom: "12px" }}>{item.step}</div>
                <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", marginBottom: "8px", fontWeight: 500 }}>{item.title}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", lineHeight: 1.65 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section style={{ marginBottom: "72px" }}>
          <h2 style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "24px" }}>Features</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "8px" }}>
            {["∞  No scan limits, ever", "✓  SVG & PNG, both free", "📷  Built-in camera scan test", "AI neon, aurora, mesh, mono", "🖼  Logo / icon embedding", "Social profile ready"].map((f) => (
              <div key={f} style={{ fontSize: "12px", color: "rgba(255,255,255,0.38)", padding: "12px 16px", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "2px", letterSpacing: "0.02em" }}>{f}</div>
            ))}
          </div>
        </section>

        {/* Hub CTA */}
        <section style={{ marginBottom: "80px", padding: "40px", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px", textAlign: "center", background: "rgba(255,255,255,0.01)" }}>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", marginBottom: "16px", letterSpacing: "0.06em" }}>More free browser tools</div>
          <Link href="/" style={{ display: "inline-block", border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.65)", textDecoration: "none", padding: "12px 28px", borderRadius: "2px", fontSize: "13px", letterSpacing: "0.06em" }}>
            Explore all tools →
          </Link>
        </section>

        {/* Footer */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 0", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "rgba(255,255,255,0.18)", letterSpacing: "0.06em" }}>
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>toolbox</Link>
          <span>No tracking. No ads. No signup.</span>
        </div>
      </div>
    </div>
  )
}
