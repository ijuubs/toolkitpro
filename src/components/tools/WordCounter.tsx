import { useState } from 'react';
import { trackToolUsage } from '../../utils/analytics';
import { Copy, Check, RotateCcw, FileText, Clock, Volume2, Sparkles, AlertCircle } from 'lucide-react';

export default function WordCounter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  // Computations
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const sentences = (text.match(/[.!?]+(?:\s+|$)/g) || []).length;
  const paragraphs = trimmed ? text.split(/\n+/).filter(p => p.trim().length > 0).length : 0;
  
  // Timing
  const readingTimeMin = Math.ceil(words / 200);
  const speakingTimeMin = Math.ceil(words / 130);

  // Keyword density
  const wordTokens = trimmed.toLowerCase().match(/\b[a-z0-9'-]{3,}\b/g) || [];
  const freqMap: Record<string, number> = {};
  wordTokens.forEach(w => {
    // Ignore common stop words
    if (!['the', 'and', 'for', 'that', 'with', 'this', 'you', 'are', 'was', 'have', 'from'].includes(w)) {
      freqMap[w] = (freqMap[w] || 0) + 1;
    }
  });
  const topKeywords = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    trackToolUsage('word-counter', 'Word Counter', 'Writing', 'copy_text');
  };

  const toTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  const toSentenceCase = (str: string) => {
    return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
  };

  const removeExtraSpaces = () => {
    setText(text.replace(/\s+/g, ' ').trim());
  };

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-neutral-100 border-4 border-black">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setText(text.toUpperCase())}
            className="px-2.5 py-1 bg-white border-2 border-black font-black uppercase text-xs hover:bg-yellow-300 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
          >
            UPPERCASE
          </button>
          <button
            onClick={() => setText(text.toLowerCase())}
            className="px-2.5 py-1 bg-white border-2 border-black font-black uppercase text-xs hover:bg-yellow-300 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
          >
            lowercase
          </button>
          <button
            onClick={() => setText(toTitleCase(text))}
            className="px-2.5 py-1 bg-white border-2 border-black font-black uppercase text-xs hover:bg-yellow-300 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
          >
            Title Case
          </button>
          <button
            onClick={() => setText(toSentenceCase(text))}
            className="px-2.5 py-1 bg-white border-2 border-black font-black uppercase text-xs hover:bg-yellow-300 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
          >
            Sentence case
          </button>
          <button
            onClick={removeExtraSpaces}
            className="px-2.5 py-1 bg-white border-2 border-black font-black uppercase text-xs hover:bg-yellow-300 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
          >
            Clean Spaces
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setText('')}
            className="px-2.5 py-1 bg-neutral-200 border-2 border-black font-black uppercase text-xs hover:bg-red-200 transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </button>
          <button
            onClick={handleCopy}
            className="px-3 py-1 bg-yellow-400 border-2 border-black font-black uppercase text-xs hover:bg-yellow-300 transition-colors flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-800" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>
        </div>
      </div>

      <textarea 
        className="w-full h-64 p-4 border-4 border-black font-medium text-[var(--ink)] bg-[var(--surface)] focus:outline-none focus:bg-yellow-50/20 placeholder-neutral-500 leading-relaxed text-base"
        placeholder="Paste or type your text here for real-time word counting, readability inspection, and density analysis..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* Primary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-3 sm:p-4 bg-yellow-300 border-4 border-black font-black uppercase text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <span className="block text-xs text-black/70">Words</span>
          <span className="text-2xl sm:text-3xl font-black text-black">{words}</span>
        </div>
        <div className="p-3 sm:p-4 bg-white border-4 border-black font-black uppercase text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <span className="block text-xs text-neutral-600">Characters</span>
          <span className="text-2xl sm:text-3xl font-black text-black">{chars}</span>
        </div>
        <div className="p-3 sm:p-4 bg-white border-4 border-black font-black uppercase text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <span className="block text-xs text-neutral-600">No Spaces</span>
          <span className="text-2xl sm:text-3xl font-black text-black">{charsNoSpaces}</span>
        </div>
        <div className="p-3 sm:p-4 bg-white border-4 border-black font-black uppercase text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <span className="block text-xs text-neutral-600">Sentences</span>
          <span className="text-2xl sm:text-3xl font-black text-black">{sentences}</span>
        </div>
        <div className="p-3 sm:p-4 bg-white border-4 border-black font-black uppercase text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] col-span-2 sm:col-span-1">
          <span className="block text-xs text-neutral-600">Paragraphs</span>
          <span className="text-2xl sm:text-3xl font-black text-black">{paragraphs}</span>
        </div>
      </div>

      {/* Estimated Reading & Speaking Times */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Clock className="w-8 h-8 text-black stroke-[2.5]" />
          <div>
            <span className="block text-xs font-black uppercase text-neutral-600">Estimated Reading Time</span>
            <span className="text-lg font-black">{words === 0 ? '0 min' : words < 200 ? '< 1 min' : `~${readingTimeMin} min`}</span>
            <span className="block text-[10px] text-neutral-500 font-bold uppercase">(Based on 200 WPM)</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Volume2 className="w-8 h-8 text-black stroke-[2.5]" />
          <div>
            <span className="block text-xs font-black uppercase text-neutral-600">Estimated Speaking Time</span>
            <span className="text-lg font-black">{words === 0 ? '0 min' : words < 130 ? '< 1 min' : `~${speakingTimeMin} min`}</span>
            <span className="block text-[10px] text-neutral-500 font-bold uppercase">(Based on 130 WPM speech)</span>
          </div>
        </div>
      </div>

      {/* Social Media Character Limits */}
      <div className="p-4 sm:p-6 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
        <h4 className="font-black uppercase text-sm border-b-2 border-black pb-2">Social Media Platform Limits</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-2 border-2 border-black bg-neutral-50">
            <div className="flex justify-between items-center text-xs font-black uppercase">
              <span>X (Twitter)</span>
              <span className={chars > 280 ? 'text-red-600 font-black' : 'text-neutral-700'}>{chars}/280</span>
            </div>
            <div className="w-full bg-neutral-200 h-2 mt-1 border border-black overflow-hidden">
              <div 
                className={`h-full ${chars > 280 ? 'bg-red-500' : 'bg-yellow-400'}`} 
                style={{ width: `${Math.min(100, (chars / 280) * 100)}%` }} 
              />
            </div>
          </div>

          <div className="p-2 border-2 border-black bg-neutral-50">
            <div className="flex justify-between items-center text-xs font-black uppercase">
              <span>SMS Standard</span>
              <span className={chars > 160 ? 'text-red-600 font-black' : 'text-neutral-700'}>{chars}/160</span>
            </div>
            <div className="w-full bg-neutral-200 h-2 mt-1 border border-black overflow-hidden">
              <div 
                className={`h-full ${chars > 160 ? 'bg-red-500' : 'bg-yellow-400'}`} 
                style={{ width: `${Math.min(100, (chars / 160) * 100)}%` }} 
              />
            </div>
          </div>

          <div className="p-2 border-2 border-black bg-neutral-50">
            <div className="flex justify-between items-center text-xs font-black uppercase">
              <span>LinkedIn</span>
              <span className={chars > 3000 ? 'text-red-600 font-black' : 'text-neutral-700'}>{chars}/3000</span>
            </div>
            <div className="w-full bg-neutral-200 h-2 mt-1 border border-black overflow-hidden">
              <div 
                className={`h-full ${chars > 3000 ? 'bg-red-500' : 'bg-yellow-400'}`} 
                style={{ width: `${Math.min(100, (chars / 3000) * 100)}%` }} 
              />
            </div>
          </div>

          <div className="p-2 border-2 border-black bg-neutral-50">
            <div className="flex justify-between items-center text-xs font-black uppercase">
              <span>Instagram</span>
              <span className={chars > 2200 ? 'text-red-600 font-black' : 'text-neutral-700'}>{chars}/2200</span>
            </div>
            <div className="w-full bg-neutral-200 h-2 mt-1 border border-black overflow-hidden">
              <div 
                className={`h-full ${chars > 2200 ? 'bg-red-500' : 'bg-yellow-400'}`} 
                style={{ width: `${Math.min(100, (chars / 2200) * 100)}%` }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top Keywords Analysis */}
      {topKeywords.length > 0 && (
        <div className="p-4 sm:p-6 bg-yellow-50 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
          <h4 className="font-black uppercase text-sm border-b-2 border-black pb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-black" />
            <span>Top Keywords & Frequency Density</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {topKeywords.map(([word, count]) => {
              const density = ((count / words) * 100).toFixed(1);
              return (
                <div key={word} className="px-3 py-1.5 bg-white border-2 border-black flex items-center gap-2 font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span className="font-mono text-black">"{word}"</span>
                  <span className="bg-yellow-300 px-1.5 py-0.5 border border-black text-[10px] font-black">{count}x ({density}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

