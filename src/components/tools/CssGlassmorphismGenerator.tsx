import { useState } from 'react';
import { Sparkles, Copy, Check, Palette } from 'lucide-react';
import { trackToolUsage } from '../../utils/analytics';
import ShareResultActions from '../ShareResultActions';
import AdSlot from '../AdSlot';

export default function CssGlassmorphismGenerator() {
  const [blur, setBlur] = useState<number>(12);
  const [opacity, setOpacity] = useState<number>(25);
  const [borderRadius, setBorderRadius] = useState<number>(16);
  const [borderWidth, setBorderWidth] = useState<number>(1);
  const [borderOpacity, setBorderOpacity] = useState<number>(40);
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [copied, setCopied] = useState<boolean>(false);

  // Convert hex to rgba
  const hexToRgba = (hex: string, alphaPercent: number) => {
    let clean = hex.replace('#', '');
    if (clean.length === 3) {
      clean = clean.split('').map(c => c + c).join('');
    }
    const r = parseInt(clean.substring(0, 2), 16) || 255;
    const g = parseInt(clean.substring(2, 4), 16) || 255;
    const b = parseInt(clean.substring(4, 6), 16) || 255;
    return `rgba(${r}, ${g}, ${b}, ${alphaPercent / 100})`;
  };

  const backgroundRgba = hexToRgba(bgColor, opacity);
  const borderRgba = hexToRgba(bgColor, borderOpacity);

  const cssCode = `/* Glassmorphism CSS Generated with ToolKitPro */
background: ${backgroundRgba};
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border-radius: ${borderRadius}px;
border: ${borderWidth}px solid ${borderRgba};
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    trackToolUsage('css-glassmorphism-generator', 'CSS Glassmorphism Generator', 'Developer Tools', 'copy_css');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Tool Header */}
      <div className="border-4 border-black p-6 sm:p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b-4 border-black mb-6">
          <div>
            <div className="inline-block bg-yellow-400 border-2 border-black px-2 py-0.5 text-xs font-black uppercase mb-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              UI / CSS Generator
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              CSS Glassmorphism Generator
            </h2>
          </div>
        </div>

        {/* Live Preview Area */}
        <div className="relative h-64 sm:h-80 border-4 border-black mb-8 overflow-hidden flex items-center justify-center bg-gradient-to-tr from-purple-600 via-pink-500 to-yellow-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6">
          {/* Decorative background shapes */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-yellow-300 rounded-full blur-xl opacity-70" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500 rounded-full blur-xl opacity-70" />

          {/* Glass Card */}
          <div 
            className="w-full max-w-md p-6 sm:p-8 text-black transition-all"
            style={{
              background: backgroundRgba,
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              borderRadius: `${borderRadius}px`,
              border: `${borderWidth}px solid ${borderRgba}`,
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-black" />
              <span className="font-black uppercase text-sm">Glassmorphic Card</span>
            </div>
            <p className="text-xs sm:text-sm font-bold opacity-90 leading-relaxed mb-4">
              Modern frosted glass UI effect generated instantly with CSS backdrop-filter.
            </p>
            <div className="flex gap-2">
              <span className="bg-black text-white text-[10px] font-black uppercase px-2 py-1">Blur: {blur}px</span>
              <span className="bg-black text-white text-[10px] font-black uppercase px-2 py-1">Opacity: {opacity}%</span>
            </div>
          </div>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="p-4 border-3 border-black bg-neutral-50">
            <label className="block text-xs font-black uppercase mb-2">Backdrop Blur ({blur}px)</label>
            <input 
              type="range" 
              min="0" 
              max="40" 
              value={blur} 
              onChange={(e) => setBlur(Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
          </div>

          <div className="p-4 border-3 border-black bg-neutral-50">
            <label className="block text-xs font-black uppercase mb-2">Background Opacity ({opacity}%)</label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={opacity} 
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
          </div>

          <div className="p-4 border-3 border-black bg-neutral-50">
            <label className="block text-xs font-black uppercase mb-2">Corner Radius ({borderRadius}px)</label>
            <input 
              type="range" 
              min="0" 
              max="48" 
              value={borderRadius} 
              onChange={(e) => setBorderRadius(Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
          </div>

          <div className="p-4 border-3 border-black bg-neutral-50">
            <label className="block text-xs font-black uppercase mb-2">Border Opacity ({borderOpacity}%)</label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={borderOpacity} 
              onChange={(e) => setBorderOpacity(Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
          </div>

          <div className="p-4 border-3 border-black bg-neutral-50">
            <label className="block text-xs font-black uppercase mb-2">Border Width ({borderWidth}px)</label>
            <input 
              type="range" 
              min="0" 
              max="6" 
              value={borderWidth} 
              onChange={(e) => setBorderWidth(Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
          </div>

          <div className="p-4 border-3 border-black bg-neutral-50 flex items-center justify-between">
            <label className="block text-xs font-black uppercase">Base Tint Color</label>
            <div className="flex items-center gap-2">
              <input 
                type="color" 
                value={bgColor} 
                onChange={(e) => setBgColor(e.target.value)}
                className="w-10 h-10 border-2 border-black cursor-pointer p-0 bg-transparent"
              />
              <span className="font-mono text-xs font-black">{bgColor}</span>
            </div>
          </div>
        </div>

        {/* CSS Code Output */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-black uppercase text-sm">Generated CSS Code</h3>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 font-black uppercase text-xs bg-yellow-400 hover:bg-yellow-300 px-3 py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-green-700" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied CSS!' : 'Copy CSS Code'}
            </button>
          </div>
          <pre className="p-4 bg-neutral-900 text-yellow-300 font-mono text-xs sm:text-sm border-3 border-black overflow-x-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <code>{cssCode}</code>
          </pre>
        </div>
      </div>

      <div className="no-print">
        <AdSlot adSlot="9791142997" minHeight="250px" />
      </div>

      <div className="no-print">
        <ShareResultActions 
          title="CSS Glassmorphism Generator"
          summary="Generated frosted glass CSS styles instantly."
        />
      </div>
    </div>
  );
}
