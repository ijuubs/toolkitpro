import { useState } from 'react';
import { trackToolUsage, trackDownload } from '../../utils/analytics';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let res = '';
    for (let i = 0; i < 16; i++) {
        res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(res);
    setCopied(false);

    trackToolUsage('password-generator', 'Password Generator', 'Security', 'generate_password', {
      length: 16
    });
  };

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!password) return;
    trackDownload('password-generator', 'Password Generator', 'credentials.txt', 'txt', password.length);
    const blob = new Blob([`Generated Password: ${password}\nDate: ${new Date().toISOString()}\nGenerated via ToolKitPro`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'password.txt';
    a.click();
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4">
        <button 
          onClick={generate} 
          className="w-full py-4 bg-black text-white font-black uppercase text-lg border-4 border-black hover:bg-yellow-400 hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(251,191,36,1)]"
        >
          Generate Secure 16-Char Password
        </button>

        <div className="p-4 bg-yellow-100 border-4 border-black font-mono font-black text-xl text-center break-all select-all">
          {password || 'Click above to generate'}
        </div>

        {password && (
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 py-3 bg-white text-black font-black uppercase text-sm border-2 border-black hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              {copied ? 'Copied to Clipboard!' : 'Copy Password'}
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 py-3 bg-green-400 text-black font-black uppercase text-sm border-2 border-black hover:bg-green-500 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Download .txt
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
