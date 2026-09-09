import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { trackToolUsage, trackDownload } from '../../utils/analytics';

export default function PdfCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [result, setResult] = useState<{ name: string; size: number; url: string } | null>(null);

  const compressPdf = async () => {
    if (!file) return;
    setIsCompressing(true);
    setResult(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Basic optimization: re-save with object streams enabled
      // This is a common way to shrink PDF size client-side without lossy image re-compression
      const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      setResult({
        name: `compressed_${file.name}`,
        size: blob.size,
        url: url
      });

      trackToolUsage('pdf-compressor', 'PDF Compressor', 'Utility', 'compress_pdf', {
        originalSize: file.size,
        compressedSize: blob.size,
        reductionPercent: Math.round(((file.size - blob.size) / file.size) * 100)
      });
    } catch (error) {
      console.error('Compression failed:', error);
      alert('Error compressing PDF. Some PDFs may be encrypted or corrupted.');
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="border-4 border-dashed border-black p-8 text-center bg-white">
        <input 
          type="file" 
          id="pdf-upload"
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            setFile(e.target.files?.[0] || null);
            setResult(null);
          }}
        />
        <label htmlFor="pdf-upload" className="cursor-pointer space-y-2 block">
            <div className="text-4xl">📄</div>
            <p className="font-black uppercase">{file ? file.name : 'Select PDF to Compress'}</p>
            {!file && <p className="text-xs font-bold text-gray-600 italic">No files are uploaded to our servers</p>}
        </label>
      </div>

      {file && !result && (
        <button 
          disabled={isCompressing}
          className="w-full bg-black text-white p-4 font-black uppercase text-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(251,191,36,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] disabled:opacity-50 transition-all"
          onClick={compressPdf}
        >
          {isCompressing ? 'Compressing...' : 'Compress PDF Locally'}
        </button>
      )}

      {result && (
        <div className="bg-green-100 border-4 border-black p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
                <p className="font-black uppercase text-sm">Compression Success!</p>
                <p className="font-bold">{result.name}</p>
            </div>
            <div className="text-right">
                <p className="text-xs font-bold uppercase line-through opacity-50">{(file!.size / 1024).toFixed(0)} KB</p>
                <p className="font-black text-lg">{(result.size / 1024).toFixed(0)} KB</p>
            </div>
          </div>
          <a 
            href={result.url} 
            download={result.name}
            onClick={() => trackDownload('pdf-compressor', 'PDF Compressor', result.name, 'pdf', result.size)}
            className="block text-center bg-black text-white p-4 font-black uppercase border-b-4 border-r-4 border-black active:border-0 hover:bg-green-600 transition-colors"
          >
            Download Compressed PDF
          </a>
          <button 
            onClick={() => { setFile(null); setResult(null); }}
            className="w-full text-xs font-black uppercase underline"
          >
            Compress another file
          </button>
        </div>
      )}
    </div>
  );
}
