import { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';

export interface ShareResultActionsProps {
  title?: string;
  summary: string;
  url?: string;
  className?: string;
  buttonSize?: 'sm' | 'md';
  align?: 'left' | 'right' | 'between' | 'center';
}

/**
 * Lightweight client-side sharing and copying utility for ToolKitPro calculators.
 * - Does NOT send sensitive inputs or calculations to any server.
 * - Uses Web Share API when supported by the device/browser.
 * - Gracefully falls back to clipboard copying when Web Share is unavailable.
 * - Adheres to ToolKitPro Neu-Brutalist design specifications.
 */
export default function ShareResultActions({
  title = 'Calculation Result',
  summary,
  url,
  className = '',
  buttonSize = 'sm',
  align = 'right',
}: ShareResultActionsProps) {
  const [copiedState, setCopiedState] = useState<'copied' | 'shared' | null>(null);

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // Fallback to legacy document.execCommand if clipboard API fails
    }

    try {
      if (typeof document !== 'undefined') {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        textArea.setAttribute('readonly', '');
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
      }
    } catch {
      return false;
    }
    return false;
  };

  const handleCopy = async () => {
    if (!summary) return;
    const ok = await copyToClipboard(summary);
    if (ok) {
      setCopiedState('copied');
      setTimeout(() => setCopiedState(null), 2500);
    }
  };

  const handleShare = async () => {
    if (!summary) return;
    const targetUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    const shareData: ShareData = {
      title,
      text: summary,
      ...(targetUrl ? { url: targetUrl } : {}),
    };

    if (
      typeof navigator !== 'undefined' &&
      typeof navigator.share === 'function'
    ) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err: unknown) {
        if (err && typeof err === 'object' && 'name' in err && (err as { name: string }).name === 'AbortError') {
          // User cancelled native share sheet; do not show error or fallback
          return;
        }
        // If native share rejected (e.g. permission/unsupported data), fall through to clipboard fallback
      }
    }

    // Gracefully fall back when Web Share is unavailable
    const shareText = targetUrl ? `${summary}\n\nLink: ${targetUrl}` : summary;
    const ok = await copyToClipboard(shareText);
    if (ok) {
      setCopiedState('shared');
      setTimeout(() => setCopiedState(null), 2500);
    }
  };

  const btnPadding = buttonSize === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm';

  const alignmentClass =
    align === 'right'
      ? 'justify-end'
      : align === 'between'
      ? 'justify-between'
      : align === 'center'
      ? 'justify-center'
      : 'justify-start';

  return (
    <div className={`flex flex-wrap items-center gap-2 ${alignmentClass} ${className}`}>
      <button
        type="button"
        onClick={handleCopy}
        className={`flex items-center gap-1.5 bg-white text-black font-black uppercase border-2 border-black ${btnPadding} hover:bg-yellow-200 active:translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all cursor-pointer`}
        title="Copy calculation summary to clipboard"
        aria-label="Copy calculation result to clipboard"
      >
        {copiedState === 'copied' ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
            <span className="text-emerald-700">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Copy Result</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={handleShare}
        className={`flex items-center gap-1.5 bg-black text-white font-black uppercase border-2 border-black ${btnPadding} hover:bg-yellow-400 hover:text-black active:translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all cursor-pointer`}
        title="Share calculation result"
        aria-label="Share calculation result"
      >
        {copiedState === 'shared' ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
            <span className="text-emerald-400">Copied Link!</span>
          </>
        ) : (
          <>
            <Share2 className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Share</span>
          </>
        )}
      </button>
    </div>
  );
}
