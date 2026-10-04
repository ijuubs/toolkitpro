import { useState } from 'react';
import ShareResultActions from '../ShareResultActions';

export default function FijiLoanRepaymentCalculator() {
  const [amount, setAmount] = useState<string>('15000');
  const [rate, setRate] = useState<string>('7.5'); // typical Fiji commercial bank loan rate (HFC, BSP, Westpac, ANZ)
  const [term, setTerm] = useState<string>('5'); // 5 years
  const [frequency, setFrequency] = useState<string>('monthly'); // monthly or fortnightly
  const [loading, setLoading] = useState<boolean>(false);

  const calculate = () => {
    const principal = parseFloat(amount) || 0;
    const interestRate = (parseFloat(rate) || 0) / 100;
    const years = parseFloat(term) || 0;

    if (principal <= 0 || interestRate <= 0 || years <= 0) {
      return null;
    }

    const periodsPerYear = frequency === 'fortnightly' ? 26 : 12;
    const ratePerPeriod = interestRate / periodsPerYear;
    const totalPeriods = years * periodsPerYear;

    const repayment = (principal * ratePerPeriod * Math.pow(1 + ratePerPeriod, totalPeriods)) / 
                      (Math.pow(1 + ratePerPeriod, totalPeriods) - 1);

    const totalRepay = repayment * totalPeriods;
    const totalInterest = totalRepay - principal;

    return {
      repayment,
      totalRepay,
      totalInterest,
      totalPeriods,
      frequencyLabel: frequency === 'fortnightly' ? 'Fortnightly' : 'Monthly'
    };
  };

  const results = calculate();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="border-4 border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-black uppercase mb-4 border-b-2 border-black pb-2">Loan Repayment Calculator</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-black uppercase mb-1">Loan Amount (FJD)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100"
              placeholder="15000"
            />
          </div>
          <div>
            <label className="block text-sm font-black uppercase mb-1">Annual Interest Rate (%)</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              step="0.1"
              min="0"
              className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100"
              placeholder="7.5"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-black uppercase mb-1">Loan Term (Years)</label>
            <input
              type="number"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              min="1"
              className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100"
              placeholder="5"
            />
          </div>
          <div>
            <label className="block text-sm font-black uppercase mb-1">Repayment Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100 bg-white"
            >
              <option value="monthly">Monthly</option>
              <option value="fortnightly">Fortnightly</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 200);
          }}
          className="w-full py-4 bg-black text-white font-black uppercase text-xl shadow-[6px_6px_0px_0px_rgba(251,191,36,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
        >
          {loading ? 'Re-amortizing...' : 'Calculate Repayments'}
        </button>
      </div>

      {results && (
        <div className="border-4 border-black bg-yellow-100 p-6 space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-sm font-black uppercase text-gray-600 block">Your Scheduled {results.frequencyLabel} Repayment</span>
              <span className="text-4xl sm:text-5xl font-black text-black">
                FJD ${results.repayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <ShareResultActions
              title="Fiji Loan Repayment Estimate"
              summary={`Fiji Loan Repayment Calculation (ToolKitPro):
• Scheduled ${results.frequencyLabel} Repayment: FJD $${results.repayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Loan Amount: FJD $${Number(amount).toLocaleString()}
• Interest Rate: ${rate}% p.a.
• Loan Term: ${term} Years
• Total Interest to Pay: FJD $${results.totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Total Loan Cost: FJD $${results.totalRepay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t-4 border-black pt-4">
            <div className="bg-white border-2 border-black p-4">
              <span className="block text-xs font-black uppercase text-gray-600">Total Interest to Pay</span>
              <span className="text-xl font-black text-rose-700">FJD ${results.totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="bg-white border-2 border-black p-4">
              <span className="block text-xs font-black uppercase text-gray-600">Total Loan Cost</span>
              <span className="text-xl font-black text-black">FJD ${results.totalRepay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
