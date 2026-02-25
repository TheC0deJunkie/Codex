"use client";

import ImageTracer from "imagetracerjs";
import { useMemo, useState } from "react";

type PresetName = "logo" | "posterized1" | "curvy";

const PRESET_HINTS: Record<PresetName, string> = {
  logo: "Best default for most logos with balanced edge quality and shape precision.",
  posterized1: "Strong color blocks for flat icon styles and simplified marks.",
  curvy: "Smoother curves for calligraphic or rounded logos."
};

export function VectorizerStudio() {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [svgMarkup, setSvgMarkup] = useState<string>("");
  const [preset, setPreset] = useState<PresetName>("logo");
  const [numberOfColors, setNumberOfColors] = useState(8);
  const [pathOmit, setPathOmit] = useState(4);
  const [lineThreshold, setLineThreshold] = useState(1);
  const [cornerThreshold, setCornerThreshold] = useState(60);

  const metrics = useMemo(() => {
    if (!svgMarkup) return null;
    const sizeKb = new Blob([svgMarkup], { type: "image/svg+xml" }).size / 1024;
    const pathCount = (svgMarkup.match(/<path\b/g) || []).length;
    return { sizeKb: sizeKb.toFixed(1), pathCount };
  }, [svgMarkup]);

  const vectorize = (imageDataUrl: string) => {
    const options = {
      ...ImageTracer.checkoptions(preset),
      numberofcolors: numberOfColors,
      pathomit: pathOmit,
      ltres: lineThreshold,
      qtres: cornerThreshold
    };

    ImageTracer.imageToSVG(
      imageDataUrl,
      (svgString: string) => {
        setSvgMarkup(svgString);
      },
      options
    );
  };

  const handleFileUpload = (file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      setSourceImage(result);
      vectorize(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (!svgMarkup) return;

    const blob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "vectorized-logo.svg";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="grid">
      <div className="card controls">
        <label>
          Upload image
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={(event) => handleFileUpload(event.target.files?.[0] ?? null)}
          />
        </label>

        <label>
          Vectorization preset
          <select value={preset} onChange={(event) => setPreset(event.target.value as PresetName)}>
            <option value="logo">Logo (recommended)</option>
            <option value="posterized1">Posterized</option>
            <option value="curvy">Curvy</option>
          </select>
        </label>
        <p className="tip">{PRESET_HINTS[preset]}</p>

        <label>
          Number of colors: {numberOfColors}
          <input
            type="range"
            min={2}
            max={32}
            value={numberOfColors}
            onChange={(event) => setNumberOfColors(Number(event.target.value))}
            onMouseUp={() => sourceImage && vectorize(sourceImage)}
            onTouchEnd={() => sourceImage && vectorize(sourceImage)}
          />
        </label>

        <label>
          Path detail (lower = more precise): {pathOmit}
          <input
            type="range"
            min={0}
            max={24}
            value={pathOmit}
            onChange={(event) => setPathOmit(Number(event.target.value))}
            onMouseUp={() => sourceImage && vectorize(sourceImage)}
            onTouchEnd={() => sourceImage && vectorize(sourceImage)}
          />
        </label>

        <label>
          Line threshold: {lineThreshold}
          <input
            type="range"
            min={0}
            max={8}
            step={0.1}
            value={lineThreshold}
            onChange={(event) => setLineThreshold(Number(event.target.value))}
            onMouseUp={() => sourceImage && vectorize(sourceImage)}
            onTouchEnd={() => sourceImage && vectorize(sourceImage)}
          />
        </label>

        <label>
          Corner threshold: {cornerThreshold}
          <input
            type="range"
            min={0}
            max={100}
            value={cornerThreshold}
            onChange={(event) => setCornerThreshold(Number(event.target.value))}
            onMouseUp={() => sourceImage && vectorize(sourceImage)}
            onTouchEnd={() => sourceImage && vectorize(sourceImage)}
          />
        </label>

        <button type="button" onClick={() => sourceImage && vectorize(sourceImage)}>
          Re-vectorize with current settings
        </button>
        <button type="button" onClick={handleDownload} disabled={!svgMarkup}>
          Download SVG
        </button>
      </div>

      <div className="card">
        <div className="preview-columns">
          <div>
            <h2 className="preview-title">Original</h2>
            <div className="preview-panel">
              {sourceImage ? <img src={sourceImage} alt="Uploaded source logo" /> : <span>Upload an image to begin.</span>}
            </div>
          </div>

          <div>
            <h2 className="preview-title">Vector output</h2>
            <div className="preview-panel">
              {svgMarkup ? <div dangerouslySetInnerHTML={{ __html: svgMarkup }} /> : <span>SVG preview appears here.</span>}
            </div>
          </div>
        </div>

        {metrics ? (
          <p className="metrics">
            Output: {metrics.pathCount} paths · {metrics.sizeKb} KB
          </p>
        ) : null}
      </div>
    </section>
  );
}
