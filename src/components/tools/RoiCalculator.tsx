import { useState } from 'react';
import ShareResultActions from '../ShareResultActions';

export default function RoiCalculator() {
  const [amountInvested, setAmountInvested] = useState<number | ''>('');
  const [amountReturned, setAmountReturned] = useState<number | ''>('');
  const [timePeriod, setTimePeriod] = useState<number | ''>('');

  const calculateROI = () => {
    if (amountInvested === '' || amountReturned === '' || amountInvested <= 0) return null;
    const netProfit = amountReturned - amountInvested;
    const roiPercentage = (netProfit / amountInvested) * 100;
    
    let annualizedRoi = null;
    if (timePeriod && timePeriod > 0) {
      annualizedRoi = (Math.pow(amountReturned / amountInvested, 1 / timePeriod) - 1) * 100;
    }

    return { netProfit, roiPercentage, annualizedRoi };
  };

  const results = calculateROI();

  const shareSummary = results ? `Return on Investment (ROI) Calculation (ToolKitPro):
• Net Profit: $${results.netProfit.toFixed(2)}
• Total ROI: ${results.roiPercentage.toFixed(2)}%
• Amount Invested: $${Number(amountInvested).toLocaleString()}
• Amount Returned: $${Number(amountReturned).toLocaleString()}${results.annualizedRoi !== null ? `\n• Annualized ROI: ${results.annualizedRoi.toFixed(2)}% (${timePeriod} years)` : ''}` : '';

  return (
    <div className="space-y-6">
      <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-2xl font-black uppercase mb-4">Investment Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold uppercase mb-2">Amount Invested ($)</label>
            <input
              type="number"
              value={amountInvested}
              onChange={(e) => setAmountInvested(e.target.value ? Number(e.target.value) : '')}
              className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-yellow-400 transition-all"
              placeholder="e.g. 1000"
            />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase mb-2">Amount Returned ($)</label>
            <input
              type="number"
              value={amountReturned}
              onChange={(e) => setAmountReturned(e.target.value ? Number(e.target.value) : '')}
              className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-yellow-400 transition-all"
              placeholder="e.g. 1500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold uppercase mb-2">Time Period (Years) - Optional</label>
            <input
              type="number"
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value ? Number(e.target.value) : '')}
              className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-yellow-400 transition-all"
              placeholder="e.g. 2"
            />
          </div>
        </div>
      </div>

      {results && (
        <div className="bg-yellow-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-2xl font-black uppercase text-center sm:text-left">Results</h2>
            <ShareResultActions
              title="ROI Calculation Result"
              summary={shareSummary}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border-4 border-black p-4 text-center">
              <div className="text-sm font-bold uppercase text-gray-600 mb-1">Net Profit</div>
              <div className={`text-3xl font-black ${results.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${results.netProfit.toFixed(2)}
              </div>
            </div>
            <div className="bg-white border-4 border-black p-4 text-center">
              <div className="text-sm font-bold uppercase text-gray-600 mb-1">Total ROI</div>
              <div className={`text-3xl font-black ${results.roiPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {results.roiPercentage.toFixed(2)}%
              </div>
            </div>
            {results.annualizedRoi !== null && (
              <div className="bg-white border-4 border-black p-4 text-center sm:col-span-2">
                <div className="text-sm font-bold uppercase text-gray-600 mb-1">Annualized ROI</div>
                <div className={`text-3xl font-black ${results.annualizedRoi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {results.annualizedRoi.toFixed(2)}%
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
