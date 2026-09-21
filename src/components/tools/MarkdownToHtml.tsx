import { useState, useEffect, useMemo } from 'react';
import { trackToolUsage } from '../../utils/analytics';
import { Copy, Check, RotateCcw, Download, Lock, FileText, Code, Eye } from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export default function MarkdownToHtml() {
  const [markdown, setMarkdown] = useState<string>('# Hello Markdown\n\nWelcome to the **Markdown to HTML Converter**.\n\n- Write markdown here\n- See live preview\n- Get clean HTML code\n\n> This is a quote.\n\n```js\nconsole.log("Hello!");\n```');
  const [activeTab, setActiveTab] = useState<'preview' | 'html'>('preview');
  const [copied, setCopied] = useState(false);

  // Parse markdown and sanitize HTML safely
  const { rawHtml, safeHtml, charCount, wordCount } = useMemo(() => {
    try {
      // 1. Convert to raw HTML string using marked
      const parsed = marked.parse(markdown, { gfm: true, breaks: true }) as string;
      
      // 2. Sanitize HTML
      const sanitized = DOMPurify.sanitize(parsed);

      // Simple counts
      const chars = markdown.length;
      const words = markdown.trim() === '' ? 0 : markdown.trim().split(/\s+/).length;

      return { rawHtml: sanitized, safeHtml: sanitized, charCount: chars, wordCount: words };
    } catch (e) {
      return { rawHtml: '', safeHtml: '<p>Error rendering markdown</p>', charCount: 0, wordCount: 0 };
    }
  }, [markdown]);

  const handleCopy = () => {
    if (!rawHtml) return;
    navigator.clipboard.writeText(rawHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    trackToolUsage('markdown-to-html', 'Markdown Tool', 'Text Tools', 'copy_html');
  };

  const handleDownload = () => {
    if (!rawHtml) return;
    const blob = new Blob([rawHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'document.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    trackToolUsage('markdown-to-html', 'Markdown Tool', 'Text Tools', 'download_html');
  };

  const handleClear = () => {
    setMarkdown('');
    setActiveTab('preview');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-4 items-center">
          <div className="flex bg-neutral-200 border-2 border-black p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="px-3 py-1 font-bold text-sm">
              <span className="text-black">{wordCount}</span> <span className="text-gray-600">words</span>
            </div>
            <div className="px-3 py-1 font-bold text-sm border-l-2 border-black">
              <span className="text-black">{charCount}</span> <span className="text-gray-600">chars</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleClear}
          className="flex items-center gap-1 text-sm bg-white px-4 py-2 border-2 border-black hover:bg-neutral-100 active:translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all font-bold uppercase"
        >
          <RotateCcw className="w-4 h-4" /> Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Editor Area */}
        <div className="flex flex-col h-full">
          <div className="bg-black text-white px-4 py-3 font-black uppercase flex items-center gap-2 border-4 border-black border-b-0">
            <FileText className="w-5 h-5" /> Markdown Input
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="w-full h-[500px] p-4 border-4 border-black font-mono text-sm focus:outline-none focus:bg-yellow-50 transition-colors resize-y shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            placeholder="Type your markdown here..."
            spellCheck={false}
          />
        </div>

        {/* Output/Preview Area */}
        <div className="flex flex-col h-[500px] lg:h-auto">
          {/* Tabs */}
          <div className="flex font-black uppercase text-sm border-4 border-black border-b-0">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-r-4 border-black transition-colors ${
                activeTab === 'preview' ? 'bg-yellow-300 text-black' : 'bg-neutral-100 hover:bg-neutral-200'
              }`}
            >
              <Eye className="w-4 h-4" /> Live Preview
            </button>
            <button
              onClick={() => setActiveTab('html')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 transition-colors ${
                activeTab === 'html' ? 'bg-yellow-300 text-black' : 'bg-neutral-100 hover:bg-neutral-200'
              }`}
            >
              <Code className="w-4 h-4" /> Raw HTML
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col relative h-[500px]">
            {activeTab === 'preview' ? (
              <div 
                className="flex-1 p-6 overflow-y-auto markdown-body [&>h1]:text-3xl [&>h1]:font-black [&>h1]:mb-4 [&>h1]:border-b-4 [&>h1]:border-black [&>h1]:pb-2 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-3 [&>h2]:mt-6 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mt-4 [&>h3]:mb-2 [&>p]:mb-4 [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-4 [&>blockquote]:border-l-4 [&>blockquote]:border-black [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:mb-4 [&>pre]:bg-neutral-100 [&>pre]:p-4 [&>pre]:border-2 [&>pre]:border-black [&>pre]:mb-4 [&>pre]:overflow-x-auto [&>p>code]:bg-neutral-100 [&>p>code]:px-1 [&>p>code]:border [&>p>code]:border-black [&>table]:w-full [&>table]:mb-4 [&>table]:border-collapse [&_th]:border-2 [&_th]:border-black [&_th]:p-2 [&_td]:border-2 [&_td]:border-black [&_td]:p-2"
                dangerouslySetInnerHTML={{ __html: safeHtml }}
              />
            ) : (
              <div className="flex-1 flex flex-col relative overflow-hidden bg-neutral-50">
                <textarea
                  value={rawHtml}
                  readOnly
                  className="flex-1 w-full p-4 font-mono text-sm focus:outline-none bg-transparent resize-none"
                  spellCheck={false}
                />
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button
                    onClick={handleCopy}
                    title="Copy HTML to clipboard"
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 font-black uppercase text-sm hover:bg-yellow-400 hover:text-black border-2 border-black transition-all active:translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:shadow-none"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    title="Download HTML file"
                    className="flex items-center justify-center bg-white text-black w-10 h-10 font-black hover:bg-neutral-200 border-2 border-black transition-all active:translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:shadow-none"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="p-3 bg-neutral-100 border-2 border-black flex gap-3 items-start max-w-3xl">
        <Lock className="w-5 h-5 shrink-0 mt-0.5 text-gray-700" />
        <p className="text-xs font-bold leading-relaxed text-gray-700">
          <strong>Secure Processing:</strong> Your Markdown is converted entirely inside your browser. This tool does not track your keystrokes, and your sensitive documents are never uploaded to our servers.
        </p>
      </div>
    </div>
  );
}
