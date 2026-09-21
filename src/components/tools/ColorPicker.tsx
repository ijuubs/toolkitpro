import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const PRESET_COLORS = [
  '#FACC15', // Yellow 400 (Neu-brutalist primary)
  '#F59E0B', // Amber 500
  '#EF4444', // Red 500
  '#EC4899', // Pink 500
  '#A855F7', // Purple 500
  '#3B82F6', // Blue 500
  '#06B6D4', // Cyan 500
  '#10B981', // Emerald 500
  '#84CC16', // Lime 500
  '#181922', // Slate dark
  '#71717A', // Zinc
  '#FFFFFF', // White
];

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  return [r, g, b];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrast(lum1: number, lum2: number): number {
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

export default function ColorPicker() {
  const [color, setColor] = useState('#FACC15');
  const [alpha, setAlpha] = useState(1);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const hex = color.toUpperCase();
  const [r, g, b] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r, g, b);

  const rgbString = `rgb(${r}, ${g}, ${b})`;
  const rgbaString = `rgba(${r}, ${g}, ${b}, ${alpha})`;
  const hslString = `hsl(${h}, ${s}%, ${l}%)`;
  const lum = getLuminance(r, g, b);
  const contrastBlack = getContrast(lum, 0); // 0 = black
  const contrastWhite = getContrast(lum, 1); // 1 = white

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Primary Picker & Big Swatch */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-5 flex flex-col gap-3">
          <div
            className="h-44 sm:h-52 w-full border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative flex items-end p-4 transition-colors"
            style={{ backgroundColor: hex }}
          >
            <span
              className="px-3 py-1 text-xs font-black uppercase border-2 border-black"
              style={{
                backgroundColor: contrastBlack > contrastWhite ? '#000' : '#FFF',
                color: contrastBlack > contrastWhite ? '#FFF' : '#000',
              }}
            >
              Active Color
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="color" 
              value={color} 
              onChange={(e) => setColor(e.target.value)} 
              className="w-14 h-12 p-0.5 border-2 border-black cursor-pointer bg-white" 
            />
            <input
              type="text"
              value={color}
              onChange={(e) => {
                const val = e.target.value;
                setColor(val.startsWith('#') ? val : `#${val}`);
              }}
              placeholder="#HEX"
              className="flex-1 p-2.5 font-mono font-black text-sm uppercase border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>

        {/* Color Formats */}
        <div className="md:col-span-7 space-y-3">
          {[
            { label: 'HEX', val: hex, key: 'hex' },
            { label: 'RGB', val: rgbString, key: 'rgb' },
            { label: 'RGBA', val: rgbaString, key: 'rgba' },
            { label: 'HSL', val: hslString, key: 'hsl' },
          ].map((item) => (
            <div key={item.key} className="p-3 border-2 border-black bg-white flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div>
                <p className="text-[10px] font-black uppercase text-neutral-500">{item.label}</p>
                <p className="font-mono font-black text-sm sm:text-base text-neutral-900">{item.val}</p>
              </div>
              <button 
                type="button"
                onClick={() => copyToClipboard(item.val, item.key)}
                className="flex items-center gap-1 bg-black text-white hover:bg-yellow-400 hover:text-black font-black uppercase text-xs px-3 py-1.5 border-2 border-black transition-all active:translate-x-0.5 active:translate-y-0.5"
              >
                {copiedKey === item.key ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" strokeWidth={3} />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" strokeWidth={2.5} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          ))}

          {/* Alpha Slider */}
          <div className="p-3 border-2 border-black bg-white">
              <label className="text-[10px] font-black uppercase text-neutral-500 block mb-2">Alpha: {alpha.toFixed(2)}</label>
              <input type="range" min="0" max="1" step="0.01" value={alpha} onChange={(e) => setAlpha(parseFloat(e.target.value))} className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-black" />
          </div>

          {/* WCAG Contrast Assessment */}
          <div className="p-3 border-2 border-black bg-neutral-50 dark:bg-[#181922] grid grid-cols-2 gap-3 text-xs">
            <div className="p-2 border border-black bg-black text-white flex justify-between items-center">
              <span className="font-bold uppercase">vs Black:</span>
              <span className="font-mono font-black text-yellow-400">{contrastBlack.toFixed(1)}:1 {contrastBlack >= 4.5 ? '✓ AA' : '✗'}</span>
            </div>
            <div className="p-2 border border-black bg-white text-black flex justify-between items-center">
              <span className="font-bold uppercase">vs White:</span>
              <span className="font-mono font-black text-neutral-900">{contrastWhite.toFixed(1)}:1 {contrastWhite >= 4.5 ? '✓ AA' : '✗'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Swatches Palette */}
      <div>
        <p className="text-xs font-black uppercase tracking-wider mb-2 text-[var(--g6)]">
          Curated Palette Swatches
        </p>
        <div className="flex flex-wrap gap-2.5">
          {PRESET_COLORS.map((preset) => (
            <button
              key={preset}
              onClick={() => setColor(preset)}
              title={preset}
              className={`w-9 h-9 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-110 active:translate-x-0.5 active:translate-y-0.5 transition-all ${
                color.toLowerCase() === preset.toLowerCase() ? 'ring-2 ring-black scale-105' : ''
              }`}
              style={{ backgroundColor: preset }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
