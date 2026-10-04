import { useState } from 'react';
import { trackToolUsage } from '../../utils/analytics';
import { RotateCcw } from 'lucide-react';
import ShareResultActions from '../ShareResultActions';

export default function FijiVatCalculator() {
  const [amount, setAmount] = useState<string>('');
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  const [vatRate, setVatRate] = useState<string>('12.5'); // Default to current 12.5% rate

  const calculate = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val < 0) return null;

    const rate = parseFloat(vatRate) / 100;
    
    let exclusive = 0;
    let inclusive = 0;
    let vatAmount = 0;

    if (mode === 'add') {
      exclusive = val;
      vatAmount = val * rate;
      inclusive = val + vatAmount;
    } else {
      inclusive = val;
      exclusive = val / (1 + rate);
      vatAmount = val - exclusive;
    }

    return { exclusive, vatAmount, inclusive };
  };

  const results = calculate();

  const handleClear = () => {
    setAmount('');
    setMode('add');
    setVatRate('12.5');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="border-4 border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-black uppercase mb-4 border-b-2 border-black pb-2 flex justify-between items-center">
          <span>VAT Calculator</span>
          <button onClick={handleClear} className="flex items-center gap-1 text-sm bg-neutral-200 px-2 py-1 border-2 border-black hover:bg-neutral-300 active:translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all">
            <RotateCcw className="w-4 h-4" /> Clear
          </button>
        </h3>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-black uppercase mb-2">Price Amount (FJD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-xl">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  trackToolUsage('fiji-vat-calculator', 'Fiji VAT Calculator', 'Fiji Tools', 'calculate_vat');
                }}
                min="0"
                step="0.01"
                className="w-full pl-10 p-4 border-4 border-black font-black text-xl focus:outline-none focus:bg-yellow-100 transition-colors"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-black uppercase mb-2">VAT Rate</label>
            <select
              value={vatRate}
              onChange={(e) => setVatRate(e.target.value)}
              className="w-full p-4 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100 transition-colors appearance-none bg-white cursor-pointer"
            >
              <option value="12.5">12.5% (Current Rate - post Aug 1, 2025)</option>
              <option value="15">15% (Historical Rate - pre Aug 1, 2025)</option>
              <option value="0">0% (Zero-Rated Items)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-black uppercase mb-2">Calculation Mode</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`cursor-pointer border-4 border-black p-4 flex items-center gap-3 transition-colors ${mode === 'add' ? 'bg-yellow-400' : 'bg-white hover:bg-yellow-100'}`}>
                <input
                  type="radio"
                  name="vatMode"
                  value="add"
                  checked={mode === 'add'}
                  onChange={() => setMode('add')}
                  className="w-6 h-6 border-2 border-black accent-black"
                />
                <div>
                  <span className="font-black uppercase block">Add VAT</span>
                  <span className="text-xs font-bold opacity-80 block">Price is VAT Exclusive</span>
                </div>
              </label>

              <label className={`cursor-pointer border-4 border-black p-4 flex items-center gap-3 transition-colors ${mode === 'remove' ? 'bg-yellow-400' : 'bg-white hover:bg-yellow-100'}`}>
                <input
                  type="radio"
                  name="vatMode"
                  value="remove"
                  checked={mode === 'remove'}
                  onChange={() => setMode('remove')}
                  className="w-6 h-6 border-2 border-black accent-black"
                />
                <div>
                  <span className="font-black uppercase block">Remove VAT</span>
                  <span className="text-xs font-bold opacity-80 block">Price is VAT Inclusive</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {results && amount && !isNaN(parseFloat(amount)) && parseFloat(amount) >= 0 && (
        <div className="border-4 border-black bg-emerald-100 p-6 space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="font-black uppercase text-xl">Calculation Results</h3>
            <ShareResultActions
              title="Fiji VAT Calculation Result"
              summary={`Fiji VAT Calculation (ToolKitPro):
• Mode: ${mode === 'add' ? 'Add VAT (Price is Exclusive)' : 'Remove VAT (Price is Inclusive)'}
• VAT Rate: ${vatRate}%
• VAT Exclusive Price: $${results.exclusive.toFixed(2)}
• VAT Amount: $${results.vatAmount.toFixed(2)}
• VAT Inclusive Price: $${results.inclusive.toFixed(2)}`}
            />
          </div>

          <div className="space-y-4">
            <div className={`flex justify-between items-center p-4 border-4 border-black ${mode === 'add' ? 'bg-white' : 'bg-white/50'}`}>
              <span className="font-black uppercase text-sm">VAT Exclusive Price</span>
              <span className="font-black text-xl">$ {results.exclusive.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center p-4 border-4 border-black bg-yellow-200">
              <span className="font-black uppercase text-sm">VAT Amount ({vatRate}%)</span>
              <span className="font-black text-xl text-red-600">+ $ {results.vatAmount.toFixed(2)}</span>
            </div>

            <div className={`flex justify-between items-center p-4 border-4 border-black ${mode === 'remove' ? 'bg-white' : 'bg-white/50'}`}>
              <span className="font-black uppercase text-sm">VAT Inclusive Price</span>
              <span className="font-black text-2xl">$ {results.inclusive.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-xs font-bold text-gray-700 bg-white border-2 border-black p-3 mt-4">
            <strong>How this works:</strong> 
            {mode === 'add' ? 
              ` The formula adds ${vatRate}% to the base price. (Base × ${1 + parseFloat(vatRate)/100})` : 
              ` The formula extracts the ${vatRate}% VAT already included in the price. (Price ÷ ${1 + parseFloat(vatRate)/100})`}
          </div>
          
          <div className="border-2 border-black p-3 bg-neutral-50 text-xs text-neutral-800 space-y-1 mt-4">
            <p><strong>Last reviewed:</strong> Oct 2026</p>
            <p><strong>Applicable period:</strong> 2026/2027 Financial Year</p>
            <p><strong>Reference:</strong> Fiji Revenue and Customs Service (FRCS)</p>
            <p className="italic">Disclaimer: Based on current VAT rates (12.5% standard). Verify with FRCS for specific goods/services.</p>
          </div>
        </div>
      )}
    </div>
  );
}
