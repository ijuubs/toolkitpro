import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Type, Calculator, Copy, Check, ArrowRight, RotateCcw, ShieldCheck } from 'lucide-react';

export default function HeroMiniTool() {
  const [activeTab, setActiveTab] = useState<'text' | 'calc'>('text');
  
  // Text analyzer state
  const [sampleText, setSampleText] = useState('ToolKitPro processes everything directly in your browser. No files or strings ever leave your device.');
  const [copied, setCopied] = useState(false);

  // Quick calc state
  const [percentX, setPercentX] = useState('15');
  const [percentY, setPercentY] = useState('240');

  // Text computations
  const words = sampleText.trim() ? sampleText.trim().split(/\s+/).length : 0;
  const chars = sampleText.length;
  const charsNoSpaces = sampleText.replace(/\s/g, '').length;
  const readingTimeSec = Math.max(1, Math.ceil((words / 200) * 60));

  // Quick calc computation
  const numX = parseFloat(percentX) || 0;
  const numY = parseFloat(percentY) || 0;
  const calcResult = ((numX / 100) * numY).toFixed(2).replace(/\.00$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-3.5 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-4 border-black pb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse border border-black" />
          <span className="text-xs font-black uppercase tracking-wider">Live Interactive Sandbox</span>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-yellow-300 border border-black">
            Client-Side
          </span>
        </div>

        {/* Tab switchers */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex-1 sm:flex-initial px-3 py-2 sm:py-1.5 font-black uppercase text-xs border-2 border-black flex items-center justify-center gap-1.5 transition-all min-h-[40px] sm:min-h-0 ${
              activeTab === 'text'
                ? 'bg-yellow-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
            }`}
          >
            <Type className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Instant Text Inspector</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('calc')}
            className={`flex-1 sm:flex-initial px-3 py-2 sm:py-1.5 font-black uppercase text-xs border-2 border-black flex items-center justify-center gap-1.5 transition-all min-h-[40px] sm:min-h-0 ${
              activeTab === 'calc'
                ? 'bg-yellow-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Quick Percentage</span>
          </button>
        </div>
      </div>

      {activeTab === 'text' ? (
        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={sampleText}
              onChange={(e) => setSampleText(e.target.value)}
              placeholder="Paste or type text to see live instant statistics..."
              rows={3}
              className="w-full p-3 font-mono text-sm border-2 border-black focus:outline-none focus:bg-yellow-50/50 resize-none text-[var(--ink)] bg-[var(--surface)]"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-yellow-100 border-2 border-black text-center">
              <span className="block text-[10px] font-black uppercase text-neutral-600">Words</span>
              <span className="text-xl sm:text-2xl font-black text-black">{words}</span>
            </div>
            <div className="p-2 sm:p-3 bg-white border-2 border-black text-center">
              <span className="block text-[10px] font-black uppercase text-neutral-600">Characters</span>
              <span className="text-xl sm:text-2xl font-black text-black">{chars}</span>
            </div>
            <div className="p-2 sm:p-3 bg-white border-2 border-black text-center">
              <span className="block text-[10px] font-black uppercase text-neutral-600">No Spaces</span>
              <span className="text-xl sm:text-2xl font-black text-black">{charsNoSpaces}</span>
            </div>
            <div className="p-2 sm:p-3 bg-white border-2 border-black text-center">
              <span className="block text-[10px] font-black uppercase text-neutral-600">Read Time</span>
              <span className="text-xl sm:text-2xl font-black text-black">~{readingTimeSec}s</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t-2 border-black text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSampleText(sampleText.toUpperCase())}
                className="px-2.5 py-1 bg-white border border-black font-black uppercase hover:bg-yellow-200 transition-colors"
              >
                UPPERCASE
              </button>
              <button
                onClick={() => setSampleText(sampleText.toLowerCase())}
                className="px-2.5 py-1 bg-white border border-black font-black uppercase hover:bg-yellow-200 transition-colors"
              >
                lowercase
              </button>
              <button
                onClick={() => setSampleText('')}
                className="px-2.5 py-1 bg-neutral-100 border border-black font-bold uppercase hover:bg-neutral-200 flex items-center gap-1"
                title="Clear text"
              >
                <RotateCcw className="w-3 h-3" />
                Clear
              </button>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 bg-white border border-black font-black uppercase hover:bg-yellow-300 flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <Link
              to="/tools/word-counter"
              className="font-black uppercase inline-flex items-center gap-1 text-black hover:text-yellow-600 hover:underline"
            >
              <span>Full Word Counter</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-start gap-2 sm:gap-3 p-3.5 sm:p-4 bg-yellow-50 border-2 border-black">
            <span className="font-black uppercase text-xs sm:text-sm">What is</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={percentX}
                onChange={(e) => setPercentX(e.target.value)}
                className="w-16 sm:w-20 p-1.5 sm:p-2 font-black text-center text-base sm:text-lg border-2 border-black bg-white focus:outline-none"
              />
              <span className="font-black text-base sm:text-lg">%</span>
            </div>
            <span className="font-black uppercase text-xs sm:text-sm">of</span>
            <input
              type="number"
              value={percentY}
              onChange={(e) => setPercentY(e.target.value)}
              className="w-24 sm:w-28 p-1.5 sm:p-2 font-black text-center text-base sm:text-lg border-2 border-black bg-white focus:outline-none"
            />
            <span className="font-black text-base sm:text-lg">=</span>
            <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-yellow-400 border-2 border-black font-black text-lg sm:text-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {calcResult}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t-2 border-black text-xs">
            <span className="flex items-center gap-1.5 text-neutral-600 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zero latency • Calculated instantaneously in RAM</span>
            </span>
            <Link
              to="/tools/percentage-calculator"
              className="font-black uppercase inline-flex items-center gap-1 text-black hover:text-yellow-600 hover:underline min-h-[32px] sm:min-h-0"
            >
              <span>Full Percentage Suite</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
