import { useState } from 'react';
import { trackToolUsage, trackDownload } from '../../utils/analytics';

export default function JsonFormatter() {
  const [json, setJson] = useState('');
  const [error, setError] = useState('');

  const formatJson = (minify: boolean) => {
    try {
      setError('');
      const parsed = JSON.parse(json);
      const formatted = minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2);
      setJson(formatted);

      trackToolUsage('json-formatter', 'JSON Formatter', 'Developer Tools', minify ? 'minify_json' : 'prettify_json', {
        size: formatted.length,
        minify
      });
    } catch (e: any) {
      setError(e.message);
    }
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4">
        <label className="block font-black uppercase text-sm">Paste JSON payload below</label>
        <textarea 
          className="w-full h-64 p-4 border-4 border-black font-mono text-sm focus:outline-none focus:bg-yellow-50"
          placeholder='{"name": "ToolKitPro", "status": "active"}'
          value={json}
          onChange={(e) => setJson(e.target.value)}
        />
        {error && (
          <div className="p-3 bg-red-100 border-2 border-black text-red-700 font-bold text-xs">
            Syntax Error: {error}
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => formatJson(false)} 
            className="px-6 py-3 bg-black text-white font-black uppercase text-sm border-2 border-black hover:bg-yellow-400 hover:text-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            Prettify JSON
          </button>
          <button 
            onClick={() => formatJson(true)} 
            className="px-6 py-3 bg-white text-black font-black uppercase text-sm border-2 border-black hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            Minify JSON
          </button>
          {json && !error && (
            <button 
              onClick={handleDownload} 
              className="px-6 py-3 bg-green-400 text-black font-black uppercase text-sm border-2 border-black hover:bg-green-500 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Download .json File
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
