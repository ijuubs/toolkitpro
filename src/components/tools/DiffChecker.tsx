import React, { useState, useMemo } from 'react';
import { 
  Copy, 
  Check, 
  RotateCcw, 
  ArrowLeftRight, 
  FileText, 
  Split, 
  AlignLeft, 
  CheckCircle2, 
  Sparkles, 
  Trash2, 
  ShieldCheck, 
  Info,
  Type,
  Code
} from 'lucide-react';
import { 
  diffLines, 
  diffWordsWithSpace, 
  diffChars, 
  Change 
} from 'diff';
import { trackToolUsage } from '../../utils/analytics';

export type DiffMode = 'lines' | 'words' | 'chars';
export type ViewLayout = 'split' | 'unified';

interface SideBySideLine {
  id: string;
  leftNum?: number;
  leftText?: string;
  leftType: 'unchanged' | 'removed' | 'empty';
  rightNum?: number;
  rightText?: string;
  rightType: 'unchanged' | 'added' | 'empty';
}

const SAMPLE_TEXT_A = `// ToolkitPro Utility Framework v1.0
function calculateDiscount(price, customerType) {
  if (price <= 0) {
    return 0;
  }
  
  let discountRate = 0.05;
  if (customerType === "vip") {
    discountRate = 0.20;
  } else if (customerType === "member") {
    discountRate = 0.10;
  }

  const finalTotal = price - (price * discountRate);
  console.log("Calculated total:", finalTotal);
  return finalTotal;
}`;

const SAMPLE_TEXT_B = `// ToolkitPro Utility Framework v2.0
// Enhanced with Tiered Loyalty Rewards
function calculateDiscount(price, customerType, isHolidayPromo = false) {
  if (price <= 0) {
    throw new Error("Price must be greater than zero");
  }
  
  let discountRate = 0.05;
  if (customerType === "vip") {
    discountRate = 0.25; // Increased VIP bonus
  } else if (customerType === "member") {
    discountRate = 0.12;
  }

  if (isHolidayPromo) {
    discountRate += 0.05;
  }

  const discountAmount = price * discountRate;
  const finalTotal = Math.round((price - discountAmount) * 100) / 100;
  return { finalTotal, discountRate, savings: discountAmount };
}`;

export default function DiffChecker() {
  const [textA, setTextA] = useState<string>('');
  const [textB, setTextB] = useState<string>('');
  
  // Settings
  const [diffMode, setDiffMode] = useState<DiffMode>('lines');
  const [viewLayout, setViewLayout] = useState<ViewLayout>('split');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState<boolean>(false);
  const [ignoreCase, setIgnoreCase] = useState<boolean>(false);
  
  // UI States
  const [copied, setCopied] = useState<boolean>(false);
  const [hasCompared, setHasCompared] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'a' | 'b' | 'diff'>('diff');

  // Input statistics
  const statsA = useMemo(() => {
    const chars = textA.length;
    const trimmed = textA.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const lines = textA ? textA.split('\n').length : 0;
    return { chars, words, lines };
  }, [textA]);

  const statsB = useMemo(() => {
    const chars = textB.length;
    const trimmed = textB.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const lines = textB ? textB.split('\n').length : 0;
    return { chars, words, lines };
  }, [textB]);

  // Size limit warning check (e.g. > 200,000 characters)
  const isTooLarge = statsA.chars > 250000 || statsB.chars > 250000;

  // Pre-process strings based on options
  const processedStrings = useMemo(() => {
    let a = textA;
    let b = textB;

    if (ignoreWhitespace && diffMode === 'lines') {
      // Trim trailing spaces from each line for clean line diffing
      a = a.split('\n').map(l => l.trimEnd()).join('\n');
      b = b.split('\n').map(l => l.trimEnd()).join('\n');
    }

    return { a, b };
  }, [textA, textB, ignoreWhitespace, diffMode]);

  // Compute diff
  const diffResult = useMemo(() => {
    if (!textA && !textB) {
      return {
        changes: [] as Change[],
        sideBySideLines: [] as SideBySideLine[],
        linesAdded: 0,
        linesRemoved: 0,
        linesUnchanged: 0,
        wordsAdded: 0,
        wordsRemoved: 0,
        isIdentical: false,
        totalChanges: 0,
      };
    }

    if (isTooLarge) {
      return {
        changes: [] as Change[],
        sideBySideLines: [] as SideBySideLine[],
        linesAdded: 0,
        linesRemoved: 0,
        linesUnchanged: 0,
        wordsAdded: 0,
        wordsRemoved: 0,
        isIdentical: false,
        totalChanges: 0,
      };
    }

    const { a, b } = processedStrings;
    const options = {
      ignoreCase,
      ignoreWhitespace: ignoreWhitespace && diffMode === 'lines',
    };

    let rawChanges: Change[] = [];
    if (diffMode === 'lines') {
      rawChanges = diffLines(a, b, options);
    } else if (diffMode === 'words') {
      rawChanges = diffWordsWithSpace(a, b, options);
    } else {
      rawChanges = diffChars(a, b, options);
    }

    let linesAdded = 0;
    let linesRemoved = 0;
    let linesUnchanged = 0;
    let wordsAdded = 0;
    let wordsRemoved = 0;
    let totalChanges = 0;

    // Word counts calculation
    for (const change of rawChanges) {
      const lineCount = change.value.replace(/\n$/, '').split('\n').length;
      const wordCount = change.value.trim() ? change.value.trim().split(/\s+/).length : 0;

      if (change.added) {
        linesAdded += lineCount;
        wordsAdded += wordCount;
        totalChanges++;
      } else if (change.removed) {
        linesRemoved += lineCount;
        wordsRemoved += wordCount;
        totalChanges++;
      } else {
        linesUnchanged += lineCount;
      }
    }

    // Build side-by-side paired rows for line mode
    const sideBySide: SideBySideLine[] = [];
    if (diffMode === 'lines') {
      let leftCounter = 1;
      let rightCounter = 1;

      for (let i = 0; i < rawChanges.length; i++) {
        const change = rawChanges[i];
        // Split value into lines without trailing newline artifact
        const linesArr = change.value.endsWith('\n') 
          ? change.value.slice(0, -1).split('\n') 
          : change.value.split('\n');

        if (!change.added && !change.removed) {
          for (let idx = 0; idx < linesArr.length; idx++) {
            const line = linesArr[idx];
            sideBySide.push({
              id: `unchanged-${leftCounter}-${rightCounter}-${idx}`,
              leftNum: leftCounter++,
              leftText: line,
              leftType: 'unchanged',
              rightNum: rightCounter++,
              rightText: line,
              rightType: 'unchanged',
            });
          }
        } else if (change.removed) {
          const nextChange = rawChanges[i + 1];
          if (nextChange && nextChange.added) {
            const nextLines = nextChange.value.endsWith('\n') 
              ? nextChange.value.slice(0, -1).split('\n') 
              : nextChange.value.split('\n');
            const maxLen = Math.max(linesArr.length, nextLines.length);

            for (let j = 0; j < maxLen; j++) {
              const lText = linesArr[j];
              const rText = nextLines[j];
              sideBySide.push({
                id: `replace-${leftCounter}-${rightCounter}-${j}`,
                leftNum: lText !== undefined ? leftCounter++ : undefined,
                leftText: lText,
                leftType: lText !== undefined ? 'removed' : 'empty',
                rightNum: rText !== undefined ? rightCounter++ : undefined,
                rightText: rText,
                rightType: rText !== undefined ? 'added' : 'empty',
              });
            }
            i++; // skip nextChange
          } else {
            for (let idx = 0; idx < linesArr.length; idx++) {
              const line = linesArr[idx];
              sideBySide.push({
                id: `removed-${leftCounter}-${idx}`,
                leftNum: leftCounter++,
                leftText: line,
                leftType: 'removed',
                rightNum: undefined,
                rightText: undefined,
                rightType: 'empty',
              });
            }
          }
        } else if (change.added) {
          for (let idx = 0; idx < linesArr.length; idx++) {
            const line = linesArr[idx];
            sideBySide.push({
              id: `added-${rightCounter}-${idx}`,
              leftNum: undefined,
              leftText: undefined,
              leftType: 'empty',
              rightNum: rightCounter++,
              rightText: line,
              rightType: 'added',
            });
          }
        }
      }
    }

    const isIdentical = totalChanges === 0 && (textA.length > 0 || textB.length > 0);

    return {
      changes: rawChanges,
      sideBySideLines: sideBySide,
      linesAdded,
      linesRemoved,
      linesUnchanged,
      wordsAdded,
      wordsRemoved,
      isIdentical,
      totalChanges,
    };
  }, [processedStrings, diffMode, ignoreCase, ignoreWhitespace, textA, textB, isTooLarge]);

  // Actions
  const handleCompare = () => {
    setHasCompared(true);
    setMobileTab('diff');
    trackToolUsage('diff-checker', 'Diff Checker', 'Text Tools', 'compare_texts');
  };

  const handleSwap = () => {
    const tempA = textA;
    setTextA(textB);
    setTextB(tempA);
    setHasCompared(true);
    trackToolUsage('diff-checker', 'Diff Checker', 'Text Tools', 'swap_inputs');
  };

  const handleReset = () => {
    setTextA('');
    setTextB('');
    setHasCompared(false);
    setMobileTab('diff');
    trackToolUsage('diff-checker', 'Diff Checker', 'Text Tools', 'reset');
  };

  const handleLoadSample = () => {
    setTextA(SAMPLE_TEXT_A);
    setTextB(SAMPLE_TEXT_B);
    setHasCompared(true);
    setMobileTab('diff');
    trackToolUsage('diff-checker', 'Diff Checker', 'Text Tools', 'load_sample');
  };

  const handleCopyDiff = () => {
    if (diffResult.changes.length === 0) return;

    let exportText = `--- Version A (Original)\n+++ Version B (Modified)\n`;
    exportText += `@@ Summary: +${diffResult.linesAdded} lines, -${diffResult.linesRemoved} lines @@\n\n`;

    if (diffMode === 'lines') {
      diffResult.changes.forEach((c) => {
        const prefix = c.added ? '+ ' : c.removed ? '- ' : '  ';
        const lines = c.value.replace(/\n$/, '').split('\n');
        lines.forEach(line => {
          exportText += `${prefix}${line}\n`;
        });
      });
    } else {
      diffResult.changes.forEach((c) => {
        const marker = c.added ? '[+ ' : c.removed ? '[- ' : '';
        const endMarker = c.added ? ' +]' : c.removed ? ' -]' : '';
        exportText += `${marker}${c.value}${endMarker}`;
      });
    }

    navigator.clipboard.writeText(exportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    trackToolUsage('diff-checker', 'Diff Checker', 'Text Tools', 'copy_diff');
  };

  return (
    <div id="diff-checker-container" className="space-y-8">
      {/* Action & Options Bar */}
      <div 
        id="diff-checker-toolbar"
        className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Main Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="diff-btn-compare"
              onClick={handleCompare}
              className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 border-2 border-black font-black uppercase text-sm tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Compare Now
            </button>

            <button
              id="diff-btn-swap"
              onClick={handleSwap}
              title="Swap Text A and Text B"
              className="px-4 py-2.5 bg-white hover:bg-neutral-100 border-2 border-black font-black uppercase text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span className="hidden sm:inline">Swap</span> A ↔ B
            </button>

            <button
              id="diff-btn-sample"
              onClick={handleLoadSample}
              className="px-4 py-2.5 bg-white hover:bg-neutral-100 border-2 border-black font-black uppercase text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2"
            >
              <Code className="w-4 h-4" />
              Load Sample
            </button>

            <button
              id="diff-btn-reset"
              onClick={handleReset}
              className="px-4 py-2.5 bg-neutral-200 hover:bg-red-200 border-2 border-black font-black uppercase text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Clear
            </button>
          </div>

          {/* Copy Result */}
          {hasCompared && (textA || textB) && (
            <button
              id="diff-btn-copy"
              onClick={handleCopyDiff}
              className="px-4 py-2.5 bg-green-400 hover:bg-green-300 border-2 border-black font-black uppercase text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Diff!' : 'Copy Diff'}
            </button>
          )}
        </div>

        {/* Comparison Modes & Filters */}
        <div className="pt-3 border-t-2 border-black flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm font-bold">
          {/* Comparison Mode */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-black uppercase text-neutral-600 mr-1">Diff Mode:</span>
            <button
              id="diff-mode-lines"
              onClick={() => setDiffMode('lines')}
              className={`px-3 py-1.5 border-2 border-black font-black uppercase transition-all ${
                diffMode === 'lines' 
                  ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                  : 'bg-white hover:bg-neutral-100'
              }`}
            >
              Line-by-Line
            </button>
            <button
              id="diff-mode-words"
              onClick={() => setDiffMode('words')}
              className={`px-3 py-1.5 border-2 border-black font-black uppercase transition-all ${
                diffMode === 'words' 
                  ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                  : 'bg-white hover:bg-neutral-100'
              }`}
            >
              Words
            </button>
            <button
              id="diff-mode-chars"
              onClick={() => setDiffMode('chars')}
              className={`px-3 py-1.5 border-2 border-black font-black uppercase transition-all ${
                diffMode === 'chars' 
                  ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                  : 'bg-white hover:bg-neutral-100'
              }`}
            >
              Characters
            </button>
          </div>

          {/* View Layout (Side-by-Side vs Unified) */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 border-2 border-black p-0.5 bg-neutral-100">
              <button
                id="diff-view-split"
                onClick={() => setViewLayout('split')}
                disabled={diffMode !== 'lines'}
                title={diffMode !== 'lines' ? 'Split view is only available for Line-by-Line mode' : 'Side-by-side split view'}
                className={`px-2.5 py-1 flex items-center gap-1 font-black uppercase text-xs transition-all ${
                  viewLayout === 'split' && diffMode === 'lines'
                    ? 'bg-yellow-400 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                    : 'text-neutral-700 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed'
                }`}
              >
                <Split className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Split</span>
              </button>
              <button
                id="diff-view-unified"
                onClick={() => setViewLayout('unified')}
                className={`px-2.5 py-1 flex items-center gap-1 font-black uppercase text-xs transition-all ${
                  viewLayout === 'unified' || diffMode !== 'lines'
                    ? 'bg-yellow-400 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                    : 'text-neutral-700 hover:bg-white'
                }`}
              >
                <AlignLeft className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Unified</span>
              </button>
            </div>

            {/* Checkbox Options */}
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                id="diff-opt-whitespace"
                type="checkbox"
                checked={ignoreWhitespace}
                onChange={(e) => setIgnoreWhitespace(e.target.checked)}
                className="w-4 h-4 border-2 border-black accent-black rounded-none cursor-pointer"
              />
              <span className="uppercase text-xs font-bold">Ignore Whitespace</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                id="diff-opt-case"
                type="checkbox"
                checked={ignoreCase}
                onChange={(e) => setIgnoreCase(e.target.checked)}
                className="w-4 h-4 border-2 border-black accent-black rounded-none cursor-pointer"
              />
              <span className="uppercase text-xs font-bold">Ignore Case</span>
            </label>
          </div>
        </div>
      </div>

      {/* Large Input Warning */}
      {isTooLarge && (
        <div id="diff-warning-banner" className="p-4 bg-red-100 border-4 border-black font-bold flex items-center gap-3">
          <Info className="w-6 h-6 text-red-700 flex-shrink-0" />
          <p className="text-sm text-red-900">
            <strong>Input limit exceeded:</strong> One or both texts exceed 250,000 characters. To prevent browser memory exhaustion and freeze states, please reduce text volume.
          </p>
        </div>
      )}

      {/* Input Editors (Side by Side on Desktop, Stacked on Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Version A / Original */}
        <div 
          id="diff-editor-a" 
          className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col"
        >
          <div className="p-3 bg-neutral-100 border-b-4 border-black flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 border border-black inline-block"></span>
              <h2 className="font-black uppercase text-sm tracking-wide">Version A (Original)</h2>
            </div>
            {textA && (
              <button
                id="diff-clear-a"
                onClick={() => setTextA('')}
                className="text-xs font-bold text-neutral-600 hover:text-red-700 flex items-center gap-1 uppercase"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear A
              </button>
            )}
          </div>

          <textarea
            id="diff-textarea-a"
            value={textA}
            onChange={(e) => {
              setTextA(e.target.value);
              setHasCompared(true);
            }}
            placeholder="Paste or type original text here..."
            className="w-full h-64 md:h-80 p-3 font-mono text-sm resize-y focus:outline-none focus:bg-yellow-50/40"
            spellCheck={false}
          />

          <div className="p-2.5 bg-neutral-100 border-t-2 border-black flex flex-wrap items-center justify-between text-xs font-bold text-neutral-700">
            <div className="flex items-center gap-3">
              <span>{statsA.lines} Lines</span>
              <span>•</span>
              <span>{statsA.words} Words</span>
              <span>•</span>
              <span>{statsA.chars} Characters</span>
            </div>
            <span className="text-neutral-500 uppercase">Text A</span>
          </div>
        </div>

        {/* Version B / Modified */}
        <div 
          id="diff-editor-b" 
          className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col"
        >
          <div className="p-3 bg-neutral-100 border-b-4 border-black flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 border border-black inline-block"></span>
              <h2 className="font-black uppercase text-sm tracking-wide">Version B (Modified)</h2>
            </div>
            {textB && (
              <button
                id="diff-clear-b"
                onClick={() => setTextB('')}
                className="text-xs font-bold text-neutral-600 hover:text-red-700 flex items-center gap-1 uppercase"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear B
              </button>
            )}
          </div>

          <textarea
            id="diff-textarea-b"
            value={textB}
            onChange={(e) => {
              setTextB(e.target.value);
              setHasCompared(true);
            }}
            placeholder="Paste or type modified text here..."
            className="w-full h-64 md:h-80 p-3 font-mono text-sm resize-y focus:outline-none focus:bg-yellow-50/40"
            spellCheck={false}
          />

          <div className="p-2.5 bg-neutral-100 border-t-2 border-black flex flex-wrap items-center justify-between text-xs font-bold text-neutral-700">
            <div className="flex items-center gap-3">
              <span>{statsB.lines} Lines</span>
              <span>•</span>
              <span>{statsB.words} Words</span>
              <span>•</span>
              <span>{statsB.chars} Characters</span>
            </div>
            <span className="text-neutral-500 uppercase">Text B</span>
          </div>
        </div>
      </div>

      {/* Comparison Output Section */}
      <div id="diff-output-section" className="space-y-4">
        {/* Results Summary Banner */}
        {hasCompared && (textA || textB) && (
          <div 
            id="diff-summary-card" 
            className="p-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 border-2 border-black ${diffResult.isIdentical ? 'bg-green-400' : 'bg-yellow-400'}`}>
                  {diffResult.isIdentical ? <CheckCircle2 className="w-6 h-6" /> : <Split className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase">
                    {diffResult.isIdentical ? 'Texts Are Identical' : 'Comparison Summary'}
                  </h3>
                  <p className="text-xs font-bold text-neutral-600">
                    {diffResult.isIdentical 
                      ? 'No differences found between Version A and Version B.' 
                      : `Found ${diffResult.totalChanges} difference chunk${diffResult.totalChanges === 1 ? '' : 's'}.`}
                  </p>
                </div>
              </div>

              {/* Stat Chips */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1.5 bg-green-100 border-2 border-black text-green-900 font-mono font-bold text-xs">
                  +{diffResult.linesAdded} lines added
                </span>
                <span className="px-3 py-1.5 bg-red-100 border-2 border-black text-red-900 font-mono font-bold text-xs">
                  -{diffResult.linesRemoved} lines removed
                </span>
                <span className="px-3 py-1.5 bg-neutral-100 border-2 border-black text-neutral-800 font-mono font-bold text-xs">
                  {diffResult.linesUnchanged} unchanged
                </span>
                <span className="px-3 py-1.5 bg-yellow-100 border-2 border-black text-neutral-900 font-mono font-bold text-xs">
                  +{diffResult.wordsAdded} / -{diffResult.wordsRemoved} words
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Visual Difference Viewer */}
        {(!textA && !textB) ? (
          /* Empty State */
          <div 
            id="diff-empty-state"
            className="p-12 bg-white border-4 border-black text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4"
          >
            <div className="w-16 h-16 bg-yellow-300 border-3 border-black mx-auto flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <FileText className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-xl font-black uppercase">Ready to Compare</h3>
            <p className="text-sm font-bold text-neutral-600 max-w-md mx-auto">
              Paste or type text into Version A and Version B above, or click below to load a sample code snippet and see the diff in action.
            </p>
            <button
              id="diff-btn-load-sample-empty"
              onClick={handleLoadSample}
              className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 border-3 border-black font-black uppercase text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Load Sample Comparison
            </button>
          </div>
        ) : diffResult.isIdentical ? (
          /* Identical State */
          <div 
            id="diff-identical-banner"
            className="p-8 bg-green-50 border-4 border-black text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2"
          >
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
            <h3 className="text-xl font-black uppercase text-green-900">100% Match — Texts Are Identical</h3>
            <p className="text-sm font-bold text-green-800">
              There are no additions, removals, or modifications between the two versions.
            </p>
          </div>
        ) : (
          /* Active Diff Views */
          <div 
            id="diff-viewer-wrapper"
            className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
          >
            {/* Viewer Header */}
            <div className="p-3 bg-neutral-900 text-white flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-yellow-400 font-bold uppercase">
                  {diffMode.toUpperCase()} DIFF VIEWER ({viewLayout.toUpperCase()})
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-green-400">
                  <span className="w-3 h-3 bg-green-500 border border-black inline-block"></span> + Additions
                </span>
                <span className="flex items-center gap-1.5 text-red-400">
                  <span className="w-3 h-3 bg-red-500 border border-black inline-block"></span> - Removals
                </span>
              </div>
            </div>

            {/* Split View (Side by Side) - Line Mode only */}
            {viewLayout === 'split' && diffMode === 'lines' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-200 border-b-2 border-black uppercase font-black text-neutral-800">
                      <th className="w-12 px-2 py-1.5 text-right border-r border-neutral-300">#A</th>
                      <th className="w-1/2 px-3 py-1.5 border-r-2 border-black">Original (A)</th>
                      <th className="w-12 px-2 py-1.5 text-right border-r border-neutral-300">#B</th>
                      <th className="w-1/2 px-3 py-1.5">Modified (B)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {diffResult.sideBySideLines.map((row) => (
                      <tr key={row.id} className="border-b border-neutral-200 hover:bg-neutral-50/50">
                        {/* Left Number */}
                        <td className={`px-2 py-1 text-right select-none border-r border-neutral-300 font-mono text-neutral-500 ${
                          row.leftType === 'removed' ? 'bg-red-100/60 font-bold text-red-800' : 'bg-neutral-50'
                        }`}>
                          {row.leftNum ?? ''}
                        </td>
                        {/* Left Content */}
                        <td className={`px-3 py-1 border-r-2 border-black whitespace-pre-wrap break-all ${
                          row.leftType === 'removed' 
                            ? 'bg-red-100 text-red-950 font-medium' 
                            : row.leftType === 'empty' 
                            ? 'bg-neutral-100/40' 
                            : 'bg-white text-neutral-900'
                        }`}>
                          {row.leftText !== undefined ? row.leftText : ' '}
                        </td>

                        {/* Right Number */}
                        <td className={`px-2 py-1 text-right select-none border-r border-neutral-300 font-mono text-neutral-500 ${
                          row.rightType === 'added' ? 'bg-green-100/60 font-bold text-green-800' : 'bg-neutral-50'
                        }`}>
                          {row.rightNum ?? ''}
                        </td>
                        {/* Right Content */}
                        <td className={`px-3 py-1 whitespace-pre-wrap break-all ${
                          row.rightType === 'added' 
                            ? 'bg-green-100 text-green-950 font-medium' 
                            : row.rightType === 'empty' 
                            ? 'bg-neutral-100/40' 
                            : 'bg-white text-neutral-900'
                        }`}>
                          {row.rightText !== undefined ? row.rightText : ' '}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : diffMode === 'lines' ? (
              /* Unified View (Lines) */
              <div className="overflow-x-auto p-4 font-mono text-xs sm:text-sm space-y-0.5 bg-neutral-50">
                {diffResult.changes.map((change, cIdx) => {
                  const lines = change.value.endsWith('\n') 
                    ? change.value.slice(0, -1).split('\n') 
                    : change.value.split('\n');

                  return lines.map((line, lIdx) => {
                    const isAdded = change.added;
                    const isRemoved = change.removed;
                    const prefix = isAdded ? '+' : isRemoved ? '-' : ' ';

                    let rowStyle = 'bg-white text-neutral-800 border-l-4 border-transparent';
                    if (isAdded) {
                      rowStyle = 'bg-green-100 text-green-950 border-l-4 border-green-600 font-semibold';
                    } else if (isRemoved) {
                      rowStyle = 'bg-red-100 text-red-950 border-l-4 border-red-600 font-semibold';
                    }

                    return (
                      <div 
                        key={`unified-${cIdx}-${lIdx}`} 
                        className={`flex items-start px-3 py-1 whitespace-pre-wrap break-all ${rowStyle}`}
                      >
                        <span className="w-6 select-none font-bold opacity-75">{prefix}</span>
                        <span className="flex-1">{line || ' '}</span>
                      </div>
                    );
                  });
                })}
              </div>
            ) : (
              /* Word or Char Inline Diff */
              <div className="p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words bg-white">
                {diffResult.changes.map((change, idx) => {
                  if (change.added) {
                    return (
                      <span 
                        key={`inline-added-${idx}`}
                        className="bg-green-200 text-green-950 font-bold px-1 mx-0.5 border border-green-600"
                        title="Added in Version B"
                      >
                        {change.value}
                      </span>
                    );
                  }
                  if (change.removed) {
                    return (
                      <span 
                        key={`inline-removed-${idx}`}
                        className="bg-red-200 text-red-950 line-through px-1 mx-0.5 border border-red-600 opacity-80"
                        title="Removed from Version A"
                      >
                        {change.value}
                      </span>
                    );
                  }
                  return <span key={`inline-unchanged-${idx}`}>{change.value}</span>;
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Security & Local Processing Guarantee Banner */}
      <div 
        id="diff-privacy-banner"
        className="p-4 bg-neutral-100 border-4 border-black flex items-center justify-between gap-4 text-xs font-bold"
      >
        <div className="flex items-center gap-2 text-neutral-800">
          <ShieldCheck className="w-5 h-5 text-black flex-shrink-0" />
          <span>
            <strong>100% Private & Client-Side:</strong> All text comparison algorithms execute directly in your browser. Your confidential source code, legal agreements, and documents are never uploaded, logged, or sent across the network.
          </span>
        </div>
      </div>
    </div>
  );
}
