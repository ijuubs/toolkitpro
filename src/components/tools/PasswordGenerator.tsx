import { useState, useEffect } from 'react';
import { trackToolUsage, trackDownload } from '../../utils/analytics';
import { Copy, Check, Download, RefreshCw, Shield, ShieldCheck, ShieldAlert, Key } from 'lucide-react';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'password' | 'passphrase'>('password');
  
  // Password config
  const [length, setLength] = useState(18);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);

  // Passphrase config
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState('-');

  const sampleWords = [
    'coral', 'falcon', 'matrix', 'timber', 'summit', 'velvet', 'orbit', 'breeze',
    'beacon', 'harbor', 'shadow', 'canyon', 'glacier', 'silver', 'vortex', 'cobalt',
    'echo', 'fathom', 'granite', 'horizon', 'island', 'jungle', 'zenith', 'tundra'
  ];

  const generate = () => {
    if (mode === 'passphrase') {
      const selected: string[] = [];
      const array = new Uint32Array(wordCount);
      window.crypto.getRandomValues(array);
      for (let i = 0; i < wordCount; i++) {
        selected.push(sampleWords[array[i] % sampleWords.length]);
      }
      const pass = selected.join(separator);
      setPassword(pass);
      setCopied(false);
      trackToolUsage('password-generator', 'Password Generator', 'Security', 'generate_passphrase', { wordCount });
      return;
    }

    let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lower = 'abcdefghijklmnopqrstuvwxyz';
    let numbers = '0123456789';
    let symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (excludeAmbiguous) {
      upper = upper.replace(/[IO]/g, '');
      lower = lower.replace(/[lo]/g, '');
      numbers = numbers.replace(/[01]/g, '');
    }

    let charPool = '';
    if (includeUpper) charPool += upper;
    if (includeLower) charPool += lower;
    if (includeNumbers) charPool += numbers;
    if (includeSymbols) charPool += symbols;

    if (!charPool) {
      charPool = lower;
    }

    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);

    let res = '';
    for (let i = 0; i < length; i++) {
      res += charPool[randomValues[i] % charPool.length];
    }

    setPassword(res);
    setCopied(false);

    trackToolUsage('password-generator', 'Password Generator', 'Security', 'generate_password', {
      length
    });
  };

  useEffect(() => {
    generate();
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeAmbiguous, mode, wordCount, separator]);

  // Entropy calculation
  const calculateEntropy = () => {
    if (!password) return 0;
    if (mode === 'passphrase') {
      return Math.round(wordCount * 11.5);
    }
    let pool = 0;
    if (/[a-z]/.test(password)) pool += 26;
    if (/[A-Z]/.test(password)) pool += 26;
    if (/[0-9]/.test(password)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(password)) pool += 32;
    if (pool === 0) return 0;
    return Math.round(password.length * Math.log2(pool));
  };

  const entropy = calculateEntropy();
  const getStrengthLabel = () => {
    if (entropy < 40) return { label: 'Weak', color: 'bg-red-500 text-white', icon: ShieldAlert };
    if (entropy < 65) return { label: 'Moderate', color: 'bg-amber-400 text-black', icon: Shield };
    if (entropy < 85) return { label: 'Strong', color: 'bg-emerald-400 text-black', icon: ShieldCheck };
    return { label: 'Uncrackable (Military Grade)', color: 'bg-emerald-600 text-white', icon: ShieldCheck };
  };

  const strength = getStrengthLabel();
  const StrengthIcon = strength.icon;

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!password) return;
    trackDownload('password-generator', 'Password Generator', 'credentials.txt', 'txt', password.length);
    const blob = new Blob([`Generated Password: ${password}\nEntropy: ${entropy} bits\nDate: ${new Date().toISOString()}\nGenerated via ToolKitPro CSPRNG`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'password.txt';
    a.click();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-5">
        {/* Mode selector */}
        <div className="flex border-2 border-black bg-neutral-100 p-1">
          <button
            onClick={() => setMode('password')}
            className={`flex-1 py-2 font-black uppercase text-xs sm:text-sm transition-all ${
              mode === 'password' ? 'bg-yellow-400 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'hover:bg-neutral-200'
            }`}
          >
            Random Character Password
          </button>
          <button
            onClick={() => setMode('passphrase')}
            className={`flex-1 py-2 font-black uppercase text-xs sm:text-sm transition-all ${
              mode === 'passphrase' ? 'bg-yellow-400 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'hover:bg-neutral-200'
            }`}
          >
            Memorable Passphrase
          </button>
        </div>

        {/* Password Output Box */}
        <div className="space-y-2">
          <div className="p-4 sm:p-5 bg-yellow-100 border-4 border-black font-mono font-black text-xl sm:text-2xl text-center break-all select-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center min-h-[72px]">
            {password}
          </div>

          <div className="flex items-center justify-between text-xs font-black uppercase pt-1">
            <span className="flex items-center gap-1.5">
              <StrengthIcon className="w-4 h-4" />
              <span>Strength:</span>
              <span className={`px-2 py-0.5 border border-black text-[10px] font-black ${strength.color}`}>
                {strength.label}
              </span>
            </span>
            <span className="font-mono text-neutral-600">~{entropy} bits of entropy</span>
          </div>
        </div>

        {/* Primary Actions */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <button 
            onClick={generate} 
            className="col-span-1 py-3 bg-black text-white font-black uppercase text-xs sm:text-sm border-2 border-black hover:bg-yellow-400 hover:text-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Regenerate</span>
          </button>
          <button
            onClick={handleCopy}
            className="col-span-1 py-3 bg-yellow-300 text-black font-black uppercase text-xs sm:text-sm border-2 border-black hover:bg-yellow-400 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-800" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="col-span-1 py-3 bg-white text-black font-black uppercase text-xs sm:text-sm border-2 border-black hover:bg-neutral-100 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Save .txt</span>
          </button>
        </div>

        {/* Settings */}
        {mode === 'password' ? (
          <div className="space-y-4 pt-4 border-t-2 border-black">
            <div className="space-y-2">
              <div className="flex justify-between font-black uppercase text-xs">
                <span>Password Length:</span>
                <span className="bg-yellow-300 px-2 py-0.5 border border-black font-mono font-black">{length} characters</span>
              </div>
              <input 
                type="range" 
                min={8} 
                max={64} 
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full h-3 bg-neutral-200 border-2 border-black rounded-none appearance-none cursor-pointer accent-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-black uppercase">
              <label className="flex items-center gap-2 p-2 border-2 border-black bg-neutral-50 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={includeUpper}
                  onChange={(e) => setIncludeUpper(e.target.checked)}
                  className="w-4 h-4 accent-black"
                />
                <span>Uppercase (A-Z)</span>
              </label>

              <label className="flex items-center gap-2 p-2 border-2 border-black bg-neutral-50 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={includeLower}
                  onChange={(e) => setIncludeLower(e.target.checked)}
                  className="w-4 h-4 accent-black"
                />
                <span>Lowercase (a-z)</span>
              </label>

              <label className="flex items-center gap-2 p-2 border-2 border-black bg-neutral-50 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="w-4 h-4 accent-black"
                />
                <span>Numbers (0-9)</span>
              </label>

              <label className="flex items-center gap-2 p-2 border-2 border-black bg-neutral-50 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="w-4 h-4 accent-black"
                />
                <span>Symbols (!@#$)</span>
              </label>
            </div>

            <label className="flex items-center gap-2 p-2 border-2 border-black bg-neutral-50 cursor-pointer text-xs font-black uppercase">
              <input 
                type="checkbox" 
                checked={excludeAmbiguous}
                onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                className="w-4 h-4 accent-black"
              />
              <span>Exclude Ambiguous Characters (e.g. 0, O, 1, l, I)</span>
            </label>
          </div>
        ) : (
          <div className="space-y-4 pt-4 border-t-2 border-black">
            <div className="space-y-2">
              <div className="flex justify-between font-black uppercase text-xs">
                <span>Number of Words:</span>
                <span className="bg-yellow-300 px-2 py-0.5 border border-black font-mono font-black">{wordCount} words</span>
              </div>
              <input 
                type="range" 
                min={3} 
                max={8} 
                value={wordCount}
                onChange={(e) => setWordCount(Number(e.target.value))}
                className="w-full h-3 bg-neutral-200 border-2 border-black rounded-none appearance-none cursor-pointer accent-black"
              />
            </div>

            <div className="flex items-center justify-between text-xs font-black uppercase">
              <span>Word Separator:</span>
              <div className="flex gap-2">
                {['-', '_', '.', ' '].map((sep) => (
                  <button
                    key={sep}
                    onClick={() => setSeparator(sep)}
                    className={`px-3 py-1 border-2 border-black font-mono font-black ${
                      separator === sep ? 'bg-yellow-300' : 'bg-white'
                    }`}
                  >
                    {sep === ' ' ? 'Space' : sep}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Security badge */}
        <div className="p-3 bg-neutral-100 border-2 border-black text-neutral-600 font-bold text-xs flex items-center gap-2">
          <Key className="w-4 h-4 text-black shrink-0" />
          <span>Generated client-side via Web Cryptography API (`crypto.getRandomValues`). Zero network transmission.</span>
        </div>
      </div>
    </div>
  );
}
