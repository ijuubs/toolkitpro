import { useState } from 'react';
import { Copy, Check, ArrowDownUp, RefreshCw } from 'lucide-react';

export default function UrlEncoder() {
  const [input, setInput] = useState('https://toolkitpro.dev/search?query=hello world & safe=true');
  const [mode, setMode] = useState<'component' | 'uri' | 'base64'>('component');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const getEncoded = () => {
    setError('');
    try {
      if (mode === 'component') return encodeURIComponent(input);
      if (mode === 'uri') return encodeURI(input);
      if (mode === 'base64') return btoa(unescape(encodeURIComponent(input)));
      return '';
    } catch {
      setError('Encoding error: Invalid string input');
      return '';
    }
  };

  const getDecoded = () => {
    setError('');
    try {
      if (mode === 'component') return decodeURIComponent(input);
      if (mode === 'uri') return decodeURI(input);
      if (mode === 'base64') return decodeURIComponent(escape(atob(input)));
      return '';
    } catch {
      setError('Decoding error: Malformed URI or Base64 sequence');
      return '';
    }
  };

  const [output, setOutput] = useState(() => encodeURIComponent('https://toolkitpro.dev/search?query=hello world & safe=true'));

  const handleEncode = () => {
    const res = getEncoded();
    setOutput(res);
  };

  const handleDecode = () => {
    const res = getDecoded();
    setOutput(res);
  };

  const handleSwap = () => {
    if (output) {
      setInput(output);
      setOutput(input);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-wrap gap-2 sm:gap-3 items-center justify-between pb-2 border-b-2 border-black">
        <div className="flex gap-2">
          {(['component', 'uri', 'base64'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 font-black text-xs uppercase border-2 border-black transition-all ${
                mode === m
                  ? 'bg-yellow-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-black hover:bg-neutral-100'
              }`}
            >
              {m === 'component' ? 'encodeURIComponent' : m === 'uri' ? 'encodeURI' : 'Base64 URL'}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            setInput('');
            setOutput('');
            setError('');
          }}
          className="px-3 py-1.5 font-black text-xs uppercase border-2 border-black bg-white hover:bg-red-50 text-red-600 transition-all"
        >
          Clear
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border-2 border-red-600 text-red-900 font-bold text-xs uppercase">
          {error}
        </div>
      )}

      {/* Input */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider mb-2 text-[var(--g6)]">
          Input String or URL
        </label>
        <textarea
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste or type URL string here..."
          className="w-full p-3 font-mono text-sm border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleEncode}
          className="flex-1 min-w-[140px] py-2.5 px-4 bg-yellow-400 text-black font-black uppercase text-sm border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-1 active:translate-y-1 transition-all"
        >
          Encode
        </button>
        <button
          onClick={handleDecode}
          className="flex-1 min-w-[140px] py-2.5 px-4 bg-black text-white font-black uppercase text-sm border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-1 active:translate-y-1 transition-all"
        >
          Decode
        </button>
        <button
          onClick={handleSwap}
          title="Swap input and output"
          className="p-2.5 bg-white border-2 border-black hover:bg-neutral-100 active:translate-x-0.5 active:translate-y-0.5 transition-all"
        >
          <ArrowDownUp className="w-5 h-5" strokeWidth={2.5} />
        </button>
      </div>

      {/* Output */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-xs font-black uppercase tracking-wider text-[var(--g6)]">
            Result Output
          </label>
          <button
            onClick={handleCopy}
            disabled={!output}
            className="flex items-center gap-1.5 px-3 py-1 bg-yellow-300 border-2 border-black font-black text-xs uppercase hover:bg-yellow-400 active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-700" strokeWidth={3} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" strokeWidth={2.5} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <textarea
          readOnly
          rows={4}
          value={output}
          placeholder="Result will appear here..."
          className="w-full p-3 font-mono text-sm border-2 border-black bg-neutral-50 text-[var(--ink)] focus:outline-none"
        />
      </div>
    </div>
  );
}
