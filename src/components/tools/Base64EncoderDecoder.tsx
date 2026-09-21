import { useState, useEffect } from 'react';
import { trackToolUsage } from '../../utils/analytics';
import { Copy, Check, RotateCcw, ArrowRightLeft, Lock } from 'lucide-react';

export default function Base64EncoderDecoder() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // UTF-8 safe encode
  const encodeBase64 = (str: string): string => {
    try {
      return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
          return String.fromCharCode(Number('0x' + p1));
        }));
    } catch (e) {
      throw new Error('Failed to encode input.');
    }
  };

  // UTF-8 safe decode
  const decodeBase64 = (str: string): string => {
    try {
      return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    } catch (e) {
      throw new Error('Invalid Base64 string.');
    }
  };

  useEffect(() => {
    if (!input) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      setError(null);
      if (mode === 'encode') {
        setOutput(encodeBase64(input));
      } else {
        setOutput(decodeBase64(input));
      }
    } catch (err) {
      setOutput('');
      setError((err as Error).message);
    }
  }, [input, mode]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    trackToolUsage('base64-encoder-decoder', 'Base64 Tool', 'Web Tools', 'copy_results');
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const toggleMode = (newMode: 'encode' | 'decode') => {
    if (newMode === mode) return;
    
    // Attempt swap if transitioning and output is valid (for encode -> decode or decode -> encode)
    if (output && !error) {
      const prevOutput = output;
      setMode(newMode);
      setInput(prevOutput);
    } else {
      setMode(newMode);
    }
  };

  const handleSwap = () => {
    if (output && !error) {
      const currentOutput = output;
      setMode(mode === 'encode' ? 'decode' : 'encode');
      setInput(currentOutput);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-4 border-black p-4 sm:p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b-4 border-black pb-4">
          <div className="flex bg-neutral-200 border-2 border-black p-1">
            <button
              onClick={() => toggleMode('encode')}
              className={`px-4 py-2 font-black uppercase text-sm transition-colors ${
                mode === 'encode' ? 'bg-black text-white' : 'hover:bg-neutral-300'
              }`}
            >
              Encode
            </button>
            <button
              onClick={() => toggleMode('decode')}
              className={`px-4 py-2 font-black uppercase text-sm transition-colors ${
                mode === 'decode' ? 'bg-black text-white' : 'hover:bg-neutral-300'
              }`}
            >
              Decode
            </button>
          </div>
          <button 
            onClick={handleClear}
            className="flex items-center gap-1 text-sm bg-neutral-100 px-3 py-2 border-2 border-black hover:bg-neutral-200 active:translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all font-bold"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>

        {/* Input Area */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between items-end">
            <label htmlFor="base64-input" className="block text-sm font-black uppercase bg-black text-white px-2 py-1 inline-block">
              Input {mode === 'encode' ? '(Text)' : '(Base64)'}
            </label>
            <span className="text-xs font-bold text-gray-500">
              {input.length} characters
            </span>
          </div>
          <textarea
            id="base64-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-40 p-4 border-4 border-black font-mono text-sm focus:outline-none focus:bg-yellow-50 transition-colors resize-y"
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
            spellCheck={false}
          />
        </div>

        {/* Action Button (Swap) */}
        <div className="flex justify-center -my-9 relative z-10 mb-6">
          <button
            onClick={handleSwap}
            disabled={!output || !!error}
            title="Swap Input & Output"
            className="bg-yellow-300 p-3 border-4 border-black hover:bg-yellow-400 active:translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-yellow-300 disabled:active:translate-y-0 disabled:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-full"
          >
            <ArrowRightLeft className="w-5 h-5 rotate-90 sm:rotate-0" />
          </button>
        </div>

        {/* Output Area */}
        <div className="space-y-2">
          <label htmlFor="base64-output" className="block text-sm font-black uppercase bg-black text-white px-2 py-1 inline-block">
            Output {mode === 'encode' ? '(Base64)' : '(Text)'}
          </label>
          
          <div className="relative">
            <textarea
              id="base64-output"
              value={error ? '' : output}
              readOnly
              className={`w-full h-40 p-4 border-4 border-black font-mono text-sm focus:outline-none transition-colors resize-y ${
                error ? 'bg-red-50' : 'bg-neutral-50'
              }`}
              placeholder={error || 'Result will appear here...'}
              spellCheck={false}
            />
            
            {error && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4 text-center">
                <span className="bg-red-100 text-red-800 font-bold border-2 border-red-800 px-4 py-2 uppercase text-sm">
                  {error}
                </span>
              </div>
            )}

            {!error && output && (
              <button
                onClick={handleCopy}
                className="absolute bottom-4 right-4 flex items-center gap-2 bg-black text-white px-4 py-2 font-black uppercase text-sm hover:bg-yellow-400 hover:text-black border-2 border-black transition-all active:translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:shadow-none"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>
        </div>

      </div>
      
      {/* Privacy Notice */}
      <div className="p-3 bg-neutral-100 border-2 border-black flex gap-3 items-start max-w-2xl mx-auto">
        <Lock className="w-5 h-5 shrink-0 mt-0.5 text-gray-700" />
        <p className="text-xs font-bold leading-relaxed text-gray-700">
          <strong>Privacy Note:</strong> All encoding and decoding happens completely in your browser. Your input is never transmitted over the internet or stored on our servers.
        </p>
      </div>

    </div>
  );
}
