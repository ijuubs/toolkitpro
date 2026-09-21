import { useState } from 'react';
import { trackToolUsage, trackDownload } from '../../utils/analytics';
import { Copy, Check, Download, Play, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';

export default function JsonFormatter() {
  const [json, setJson] = useState('');
  const [error, setError] = useState('');
  const [validSuccess, setValidSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState<number | 'tab'>(2);

  const sampleJSON = {
    app: "ToolKitPro",
    version: "2.5.0",
    features: ["client-side", "offline-ready", "zero-tracking"],
    privacy: {
      cloudUploads: false,
      memoryOnly: true,
      encryption: "AES-GCM"
    },
    metrics: {
      latencyMs: 0.8,
      toolsCount: 28
    }
  };

  const loadSample = () => {
    setJson(JSON.stringify(sampleJSON, null, 2));
    setError('');
    setValidSuccess(false);
  };

  const formatJson = (minify: boolean, sortKeys = false) => {
    if (json.length > 5 * 1024 * 1024) { // 5MB limit
        setError('JSON too large (max 5MB) for formatting.');
        return;
    }
    try {
      setError('');
      setValidSuccess(false);
      let parsed = JSON.parse(json);

      if (sortKeys && typeof parsed === 'object' && parsed !== null) {
        parsed = sortObjectKeys(parsed);
      }

      const indent = minify ? 0 : indentSize === 'tab' ? '\t' : indentSize;
      const formatted = minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indent);
      setJson(formatted);

      trackToolUsage('json-formatter', 'JSON Formatter', 'Developer Tools', minify ? 'minify_json' : 'prettify_json', {
        size: formatted.length,
        minify
      });
    } catch (e: any) {
      setError(e.message);
      setValidSuccess(false);
    }
  };

  const sortObjectKeys = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(sortObjectKeys);
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj)
        .sort()
        .reduce((result: any, key: string) => {
          result[key] = sortObjectKeys(obj[key]);
          return result;
        }, {});
    }
    return obj;
  };

  const validateJson = () => {
    try {
      if (!json.trim()) return;
      JSON.parse(json);
      setError('');
      setValidSuccess(true);
      setTimeout(() => setValidSuccess(false), 3000);
    } catch (e: any) {
      setError(e.message);
      setValidSuccess(false);
    }
  };

  const handleCopy = () => {
    if (!json.trim()) return;
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!json.trim()) return;
    trackDownload('json-formatter', 'JSON Formatter', 'formatted.json', 'json', json.length);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'formatted.json';
    link.click();
  };

  // Stats
  const byteSize = new Blob([json]).size;
  const lineCount = json ? json.split('\n').length : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white border-4 border-black p-4 sm:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black pb-3">
          <div className="flex items-center gap-2">
            <span className="font-black uppercase text-xs">Indent:</span>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(e.target.value === 'tab' ? 'tab' : Number(e.target.value))}
              className="p-1 border-2 border-black font-bold text-xs bg-white focus:outline-none"
            >
              <option value={2}>2 Spaces</option>
              <option value={4}>4 Spaces</option>
              <option value="tab">Tab</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={loadSample}
              className="px-2.5 py-1 bg-yellow-200 border-2 border-black font-black uppercase text-xs hover:bg-yellow-300 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Load Sample
            </button>
            <button
              onClick={() => { setJson(''); setError(''); setValidSuccess(false); }}
              className="px-2.5 py-1 bg-neutral-100 border-2 border-black font-bold uppercase text-xs hover:bg-red-100 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
        </div>

        <textarea 
          className="w-full h-80 p-4 border-4 border-black font-mono text-sm focus:outline-none focus:bg-yellow-50/20 text-[var(--ink)] bg-[var(--surface)] leading-relaxed"
          placeholder='{"name": "ToolKitPro", "status": "active"}'
          value={json}
          onChange={(e) => {
            setJson(e.target.value);
            if (error) setError('');
            if (validSuccess) setValidSuccess(false);
          }}
        />

        {error && (
          <div className="p-3 bg-red-100 border-2 border-black text-red-800 font-bold text-xs">
            ⚠️ Syntax Error: {error}
          </div>
        )}

        {validSuccess && (
          <div className="p-3 bg-emerald-100 border-2 border-black text-emerald-800 font-bold text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Valid JSON payload. Syntax conforms to standard RFC 8259.</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-wrap gap-2.5 pt-2">
          <button 
            onClick={() => formatJson(false)} 
            className="px-5 py-2.5 bg-black text-white font-black uppercase text-xs sm:text-sm border-2 border-black hover:bg-yellow-400 hover:text-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
          >
            Prettify JSON
          </button>
          <button 
            onClick={() => formatJson(true)} 
            className="px-5 py-2.5 bg-white text-black font-black uppercase text-xs sm:text-sm border-2 border-black hover:bg-neutral-100 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
          >
            Minify JSON
          </button>
          <button 
            onClick={() => formatJson(false, true)} 
            className="px-5 py-2.5 bg-yellow-200 text-black font-black uppercase text-xs sm:text-sm border-2 border-black hover:bg-yellow-300 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
          >
            Sort Keys A-Z
          </button>
          <button 
            onClick={validateJson} 
            className="px-5 py-2.5 bg-white text-black font-black uppercase text-xs sm:text-sm border-2 border-black hover:bg-emerald-100 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
          >
            Validate Only
          </button>

          {json && (
            <div className="flex gap-2 ml-auto">
              <button 
                onClick={handleCopy} 
                className="px-4 py-2 bg-white text-black font-black uppercase text-xs sm:text-sm border-2 border-black hover:bg-yellow-300 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button 
                onClick={handleDownload} 
                className="px-4 py-2 bg-emerald-400 text-black font-black uppercase text-xs sm:text-sm border-2 border-black hover:bg-emerald-500 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1"
              >
                <Download className="w-4 h-4" />
                <span>Save .json</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {json && (
          <div className="flex flex-wrap items-center gap-4 pt-3 border-t-2 border-black text-xs font-bold text-neutral-600">
            <span>Size: <strong className="text-black font-black font-mono">{(byteSize / 1024).toFixed(2)} KB</strong> ({byteSize} bytes)</span>
            <span>Lines: <strong className="text-black font-black font-mono">{lineCount}</strong></span>
            <span className="text-emerald-700 font-black">✓ Instant Browser Parsing</span>
          </div>
        )}
      </div>
    </div>
  );
}
