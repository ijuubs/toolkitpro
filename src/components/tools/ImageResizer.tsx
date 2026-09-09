import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { trackToolUsage, trackDownload } from '../../utils/analytics';

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [maxWidth, setMaxWidth] = useState(1200);
  const [maxSizeMB, setMaxSizeMB] = useState(1);
  const [isResizing, setIsResizing] = useState(false);
  const [result, setResult] = useState<{ url: string; size: number; name: string } | null>(null);

  const handleResize = async () => {
    if (!file) return;
    setIsResizing(true);
    setResult(null);

    const options = {
      maxSizeMB: maxSizeMB,
      maxWidthOrHeight: maxWidth,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const url = URL.createObjectURL(compressedFile);
      setResult({
        url: url,
        size: compressedFile.size,
        name: `resized_${file.name}`,
      });

      trackToolUsage('image-resizer', 'Image Resizer', 'Design & Media', 'resize_image', {
        maxWidth,
        maxSizeMB,
        originalSize: file.size,
        resultSize: compressedFile.size
      });
    } catch (error) {
      console.error(error);
      alert('Failed to resize image.');
    } finally {
      setIsResizing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="border-4 border-dashed border-black p-8 text-center bg-white cursor-pointer hover:bg-gray-50 transition-colors">
        <input 
          type="file" 
          id="image-upload"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            setFile(e.target.files?.[0] || null);
            setResult(null);
          }}
        />
        <label htmlFor="image-upload" className="cursor-pointer space-y-2 block">
            <div className="text-4xl text-green-500">🖼️</div>
            <p className="font-black uppercase">{file ? file.name : 'Select Image to Resize'}</p>
        </label>
      </div>

      {file && (
        <div className="bg-white border-4 border-black p-6 space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
           <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="block text-xs font-black uppercase">Max Width/Height (px)</label>
                    <input 
                        type="number" 
                        value={maxWidth} 
                        onChange={(e) => setMaxWidth(Number(e.target.value))}
                        className="w-full border-2 border-black p-2 font-bold"
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-xs font-black uppercase">Max File Size (MB)</label>
                    <input 
                        type="number" 
                        step="0.1"
                        value={maxSizeMB} 
                        onChange={(e) => setMaxSizeMB(Number(e.target.value))}
                        className="w-full border-2 border-black p-2 font-bold"
                    />
                </div>
           </div>

           <button 
             disabled={isResizing}
             onClick={handleResize}
             className="w-full bg-black text-white p-4 font-black uppercase text-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(34,197,94,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] disabled:opacity-50 transition-all"
           >
             {isResizing ? 'Processing...' : 'Resize & Compress Image'}
           </button>
        </div>
      )}

      {result && (
        <div className="bg-green-100 border-4 border-black p-6 space-y-6">
            <div className="flex justify-between items-end border-b-2 border-black pb-4">
                <div>
                   <p className="text-xs font-black uppercase mb-1">Resulting File</p>
                   <p className="font-bold">{result.name}</p>
                </div>
                <div className="text-right">
                   <p className="text-xs font-bold line-through opacity-40">{(file!.size / 1024).toFixed(0)} KB</p>
                   <p className="font-black text-2xl">{(result.size / 1024).toFixed(0)} KB</p>
                </div>
            </div>
            
            <img src={result.url} alt="Result" className="max-h-64 mx-auto border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />

            <a 
              href={result.url} 
              download={result.name}
              onClick={() => trackDownload('image-resizer', 'Image Resizer', result.name, 'image', result.size)}
              className="block text-center bg-black text-white p-4 font-black uppercase border-b-4 border-r-4 border-black active:border-0 hover:bg-green-600 transition-colors"
            >
              Download Resized Image
            </a>
        </div>
      )}
    </div>
  );
}
