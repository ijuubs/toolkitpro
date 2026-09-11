import { useState, useEffect } from 'react';
import { Copy, Check, FileText, Code2, RefreshCw } from 'lucide-react';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea',
  'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'in',
  'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla',
  'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident',
  'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id',
  'est', 'laborum', 'curabitur', 'pretium', 'tincidunt', 'lacus', 'nulla',
  'gravida', 'orci', 'a', 'odio', 'nullam', 'varius', 'turpis', 'et', 'commodo',
  'pharetra', 'est', 'eros', 'bibendum', 'elit', 'nec', 'luctus', 'magna',
  'felis', 'sollicitudin', 'mauris', 'integer', 'in', 'mauris', 'eu', 'nibh',
  'euismod', 'gravida', 'duis', 'ac', 'tellus', 'et', 'risus', 'vulputate'
];

function generateSentence(isFirstSentence: boolean): string {
  const length = Math.floor(Math.random() * 10) + 8;
  const words: string[] = [];
  
  if (isFirstSentence) {
    words.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet,', 'consectetur', 'adipiscing', 'elit');
  } else {
    for (let i = 0; i < length; i++) {
      const w = LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
      words.push(i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w);
    }
  }

  return words.join(' ') + '.';
}

function generateParagraph(isFirstPara: boolean): string {
  const sentenceCount = Math.floor(Math.random() * 4) + 4;
  const sentences: string[] = [];
  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(generateSentence(isFirstPara && i === 0));
  }
  return sentences.join(' ');
}

export default function LoremIpsumGenerator() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [format, setFormat] = useState<'plain' | 'html'>('plain');
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let result = '';
    if (type === 'paragraphs') {
      const paras: string[] = [];
      for (let i = 0; i < count; i++) {
        paras.push(generateParagraph(startWithLorem && i === 0));
      }
      if (format === 'html') {
        result = paras.map(p => `<p>${p}</p>`).join('\n\n');
      } else {
        result = paras.join('\n\n');
      }
    } else if (type === 'sentences') {
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        sentences.push(generateSentence(startWithLorem && i === 0));
      }
      result = sentences.join(' ');
    } else {
      const words: string[] = [];
      if (startWithLorem && count >= 5) {
        words.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
        for (let i = 5; i < count; i++) {
          words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
        }
      } else {
        for (let i = 0; i < count; i++) {
          words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
        }
      }
      result = words.join(' ');
    }

    setText(result);
  };

  useEffect(() => {
    generate();
  }, [count, type, format, startWithLorem]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const wordCount = text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = text ? text.length : 0;

  return (
    <div className="space-y-6">
      {/* Configuration Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border-2 border-black bg-neutral-50 dark:bg-[#1f1e14]">
        {/* Count Selector */}
        <div>
          <label className="block text-xs font-black uppercase mb-1 text-[var(--g6)]">
            Quantity ({type})
          </label>
          <input 
            type="number" 
            min="1" 
            max={type === 'words' ? 500 : 25} 
            value={count} 
            onChange={(e) => setCount(Math.max(1, Number(e.target.value)))} 
            className="w-full p-2.5 border-2 border-black font-black text-base bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400" 
          />
        </div>

        {/* Type Selector */}
        <div>
          <label className="block text-xs font-black uppercase mb-1 text-[var(--g6)]">
            Unit Type
          </label>
          <div className="flex border-2 border-black">
            {(['paragraphs', 'sentences', 'words'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setType(t);
                  if (t === 'words' && count < 20) setCount(50);
                  if (t === 'paragraphs' && count > 10) setCount(3);
                }}
                className={`flex-1 py-2 text-xs font-black uppercase transition-all ${
                  type === t ? 'bg-yellow-400 text-black' : 'bg-white text-black hover:bg-neutral-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Output Format */}
        <div>
          <label className="block text-xs font-black uppercase mb-1 text-[var(--g6)]">
            Format
          </label>
          <div className="flex border-2 border-black">
            <button
              onClick={() => setFormat('plain')}
              className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-black uppercase transition-all ${
                format === 'plain' ? 'bg-yellow-400 text-black' : 'bg-white text-black hover:bg-neutral-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" strokeWidth={2.5} />
              Plain
            </button>
            <button
              onClick={() => setFormat('html')}
              className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-black uppercase transition-all ${
                format === 'html' ? 'bg-yellow-400 text-black' : 'bg-white text-black hover:bg-neutral-100'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" strokeWidth={2.5} />
              HTML Tags
            </button>
          </div>
        </div>
      </div>

      {/* Checkbox Options & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <label className="flex items-center gap-2 font-bold text-xs uppercase cursor-pointer select-none">
          <input
            type="checkbox"
            checked={startWithLorem}
            onChange={(e) => setStartWithLorem(e.target.checked)}
            className="w-4 h-4 accent-black rounded-none border-2 border-black"
          />
          <span>Start with "Lorem ipsum dolor sit amet..."</span>
        </label>

        <div className="flex gap-2">
          <button 
            type="button"
            onClick={generate} 
            className="flex items-center gap-1.5 px-4 py-2 bg-yellow-400 border-2 border-black font-black uppercase text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" strokeWidth={2.5} />
            Regenerate
          </button>
          
          <button 
            type="button"
            onClick={copyToClipboard} 
            className="flex items-center gap-1.5 px-4 py-2 bg-black text-white border-2 border-black font-black uppercase text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 hover:text-black hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" strokeWidth={3} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" strokeWidth={2.5} />
                <span>Copy Text</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Content Box */}
      <div className="p-4 sm:p-6 border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex justify-between items-center pb-2 mb-3 border-b-2 border-neutral-200">
          <p className="text-xs font-black text-neutral-500 uppercase">Generated Output</p>
          <div className="flex gap-3 text-xs font-bold text-neutral-600">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{charCount} characters</span>
          </div>
        </div>
        <div className="font-mono text-xs sm:text-sm text-neutral-900 whitespace-pre-line leading-relaxed selection:bg-yellow-200 max-h-[400px] overflow-y-auto pr-2">
          {text}
        </div>
      </div>
    </div>
  );
}
