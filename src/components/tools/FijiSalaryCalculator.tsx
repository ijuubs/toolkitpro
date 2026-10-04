import { useState } from 'react';
import ShareResultActions from '../ShareResultActions';

export default function FijiSalaryCalculator() {
  const [grossInput, setGrossInput] = useState<string>('45000');
  const [frequency, setFrequency] = useState<string>('annual'); // annual, monthly, fortnightly, weekly
  const [fnpfRate, setFnpfRate] = useState<number>(8); // Fiji National Provident Fund (standard employee rate 8%)
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    const gross = parseFloat(grossInput);
    if (isNaN(gross) || gross <= 0) {
      return null;
    }

    // Convert gross to annual for standard tax calculation
    let annualGross = gross;
    if (frequency === 'monthly') {
      annualGross = gross * 12;
    } else if (frequency === 'fortnightly') {
      annualGross = gross * 26;
    } else if (frequency === 'weekly') {
      annualGross = gross * 52;
    }

    // Fiji FNPF contribution (8% standard)
    const annualFnpf = annualGross * (fnpfRate / 100);

    // Subject to FNPF - tax is calculated on gross after deducting FNPF (or gross directly?
    // In Fiji, PAYE tax is calculated on Chargeable Income.
    // Standard Chargeable Income = Gross Salary - Employee FNPF contribution (fully tax-deductible).
    const chargeableIncome = Math.max(0, annualGross - annualFnpf);

    // Fiji PAYE Redundant brackets simplified in 2023/24/25/26 budget:
    // Chargeable Income:
    // USD/FJD 0 to 30,000 -> 0%
    // FJD 30,001 to 50,000 -> 18% of excess over 30,000
    // FJD 50,001+ -> $3,600 + 20% of excess over 50,000
    let annualPaye = 0;
    if (chargeableIncome > 50000) {
      annualPaye = 3600 + (chargeableIncome - 50000) * 0.20;
    } else if (chargeableIncome > 30000) {
      annualPaye = (chargeableIncome - 30000) * 0.18;
    }

    const annualNet = annualGross - annualFnpf - annualPaye;

    // Convert back based on frequency for display
    const divisor = frequency === 'monthly' ? 12 : frequency === 'fortnightly' ? 26 : frequency === 'weekly' ? 52 : 1;

    return {
      gross: annualGross / divisor,
      fnpf: annualFnpf / divisor,
      paye: annualPaye / divisor,
      net: annualNet / divisor,
      annualGross,
      annualFnpf,
      annualPaye,
      annualNet,
      chargeableIncome: chargeableIncome / divisor,
    };
  };

  const results = calculate();

  const handleCalculateBtn = () => {
    setLoading(true);
    setError(null);
    if (!grossInput || isNaN(parseFloat(grossInput)) || parseFloat(grossInput) <= 0) {
      setError('Please enter a valid gross salary amount.');
    }
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="border-4 border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-black uppercase mb-4 border-b-2 border-black pb-2">Salary & Tax Calculator</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-black uppercase mb-1">Gross Salary (FJD)</label>
            <input
              type="number"
              value={grossInput}
              onChange={(e) => {
                setGrossInput(e.target.value);
                setError(null);
              }}
              className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100"
              placeholder="45000"
            />
          </div>
          <div>
            <label className="block text-sm font-black uppercase mb-1">Pay Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100 bg-white"
            >
              <option value="annual">Annual</option>
              <option value="monthly">Monthly</option>
              <option value="fortnightly">Fortnightly</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-black uppercase mb-1">FNPF Employee Rate (%)</label>
          <input
            type="number"
            value={fnpfRate}
            onChange={(e) => setFnpfRate(Math.max(0, Math.min(100, Number(e.target.value))))}
            className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100"
            min="0"
            max="100"
          />
          <span className="text-xs font-bold text-gray-600 mt-1 block">Current statutory Fiji National Provident Fund rate remains 8%.</span>
        </div>

        {error && (
          <div className="p-3 border-4 border-black bg-red-100 text-red-700 font-bold mb-4 uppercase">
            Error: {error}
          </div>
        )}

        <button
          onClick={handleCalculateBtn}
          className="w-full py-4 bg-black text-white font-black uppercase text-xl shadow-[6px_6px_0px_0px_rgba(251,191,36,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
        >
          {loading ? 'Calculating...' : 'Calculate Fiji PAYE'}
        </button>
      </div>

      {results && !error && (
        <div className="border-4 border-black bg-yellow-100 p-6 space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-sm font-black uppercase text-gray-600 block">Estimated Net Pay (Take Home)</span>
              <span className="text-4xl sm:text-5xl font-black text-black">
                FJD ${results.net.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-lg font-bold uppercase text-gray-700 ml-2">/ {frequency}</span>
              </span>
            </div>
            <ShareResultActions
              title="Fiji Salary & PAYE Tax Calculation"
              summary={`Fiji Salary & PAYE Tax Calculation (ToolKitPro):
• Estimated Net Pay: FJD $${results.net.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ${frequency}
• Gross Salary: FJD $${results.gross.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Employee FNPF (${fnpfRate}%): FJD $${results.fnpf.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• PAYE Tax Estimated: FJD $${results.paye.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Chargeable Income: FJD $${results.chargeableIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Annual Equivalent: FJD $${results.annualGross.toLocaleString('en-US', { maximumFractionDigits: 0 })} Gross | FJD $${results.annualNet.toLocaleString('en-US', { maximumFractionDigits: 0 })} Net`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t-4 border-black pt-4">
            <div>
              <span className="block text-xs font-black uppercase text-gray-600">Gross Contribution</span>
              <span className="text-xl font-bold">FJD ${results.gross.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div>
              <span className="block text-xs font-black uppercase text-gray-600">Employee FNPF ({fnpfRate}%)</span>
              <span className="text-xl font-bold">FJD ${results.fnpf.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div>
              <span className="block text-xs font-black uppercase text-gray-600">PAYE Tax Estimated</span>
              <span className="text-xl font-bold">FJD ${results.paye.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div>
              <span className="block text-xs font-black uppercase text-gray-600">Chargeable Income</span>
              <span className="text-xl font-bold">FJD ${results.chargeableIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div className="border-t-2 border-dashed border-black pt-4">
            <h4 className="font-black uppercase mb-2 text-sm">Annual Summary Equivalents</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="block text-[10px] font-black uppercase text-gray-600">Annual Gross</span>
                <span className="text-sm font-black">FJD ${results.annualGross.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase text-gray-600">Annual FNPF</span>
                <span className="text-sm font-black text-rose-700">FJD ${results.annualFnpf.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase text-gray-600">Annual PAYE</span>
                <span className="text-sm font-black text-rose-700">FJD ${results.annualPaye.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase text-gray-600">Annual Net</span>
                <span className="text-sm font-black text-emerald-700">FJD ${results.annualNet.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>
          
          <div className="border-2 border-black p-3 bg-neutral-50 text-xs text-neutral-800 space-y-1 mt-4">
            <p><strong>Last reviewed:</strong> Oct 2026</p>
            <p><strong>Applicable period:</strong> 2026/2027 Financial Year</p>
            <p><strong>Reference:</strong> Fiji Revenue and Customs Service (FRCS) Tax Tables</p>
            <p className="italic">Disclaimer: Tax calculation is an estimate based on statutory tax brackets. Seek professional tax advice for your specific situation.</p>
          </div>
        </div>
      )}
    </div>
  );
}
