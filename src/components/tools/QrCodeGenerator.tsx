import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { trackToolUsage, trackDownload } from '../../utils/analytics';

export default function QrCodeGenerator() {
  const [text, setText] = useState('');
  const [src, setSrc] = useState('');

  useEffect(() => {
    if (text.trim()) {
      QRCode.toDataURL(text, { width: 400, margin: 2 }, (err, url) => {
        if (!err && url) {
          setSrc(url);
          trackToolUsage('qr-code-generator', 'QR Code Generator', 'Developer Tools', 'generate_qr', {
            length: text.length
          });
        }
      });
    } else {
      setSrc('');
    }
  }, [text]);

  const handleDownload = () => {
    if (!src) return;
    trackDownload('qr-code-generator', 'QR Code Generator', 'qrcode.png', 'png');
    const link = document.createElement('a');
    link.href = src;
    link.download = 'qrcode.png';
    link.click();
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4">
        <label className="block font-black uppercase text-sm">Enter URL or text to encode</label>
        <input 
          type="text" 
          className="w-full p-4 border-4 border-black font-bold focus:outline-none focus:bg-yellow-50"
          placeholder="https://example.com or any text..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      {src && (
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center space-y-6">
          <div className="p-4 bg-gray-50 border-2 border-black inline-block">
            <img src={src} alt="Generated QR Code" className="max-w-[260px] mx-auto border-2 border-black" />
          </div>
          <div>
            <button
              onClick={handleDownload}
              className="w-full bg-black text-white p-4 font-black uppercase text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-yellow-400 hover:text-black transition-all"
            >
              Download QR Code (.png)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
