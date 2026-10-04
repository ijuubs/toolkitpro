import { useState } from 'react';
import ShareResultActions from '../ShareResultActions';

export default function FijiMortgageCalculator() {
  const [housePrice, setHousePrice] = useState<string>('250000');
  const [deposit, setDeposit] = useState<string>('25000'); // Standard 10% or 20%
  const [rate, setRate] = useState<string>('6.5'); // typical Fiji home lending rates
  const [term, setTerm] = useState<string>('25'); // standard 25-30 year term
  const [loading, setLoading] = useState<boolean>(false);

  const calculate = () => {
    const price = parseFloat(housePrice) || 0;
    const dep = parseFloat(deposit) || 0;
    const interestRate = (parseFloat(rate) || 0) / 100;
    const years = parseFloat(term) || 0;

    const loanAmount = Math.max(0, price - dep);

    if (loanAmount <= 0 || interestRate <= 0 || years <= 0) {
      return null;
    }

    const monthlyRate = interestRate / 12;
    const totalMonths = years * 12;

    const repayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const totalRepay = repayment * totalMonths;
    const totalInterest = totalRepay - loanAmount;

    return {
      loanAmount,
      repayment,
      totalRepay,
      totalInterest,
      depositPercentage: price > 0 ? (dep / price) * 100 : 0
    };
  };

  const results = calculate();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="border-4 border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-black uppercase mb-4 border-b-2 border-black pb-2">Home Mortgage Estimator</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-black uppercase mb-1">House Purchase Price (FJD)</label>
            <input
              type="number"
              value={housePrice}
              onChange={(e) => setHousePrice(e.target.value)}
              min="0"
              className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100"
              placeholder="250000"
            />
          </div>
          <div>
            <label className="block text-sm font-black uppercase mb-1">Deposit Contribution (Cash/FNPF)</label>
            <input
              type="number"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
              min="0"
              className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100"
              placeholder="25000"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-black uppercase mb-1">Mortgage Interest Rate (%)</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              step="0.1"
              min="0"
              className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100"
              placeholder="6.5"
            />
            <span className="text-xs font-bold text-gray-600 mt-1 block">Fiji commercial banking home rates vary between 5.5% - 8%.</span>
          </div>
          <div>
            <label className="block text-sm font-black uppercase mb-1">Mortgage Term (Years)</label>
            <input
              type="number"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              min="1"
              className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100"
              placeholder="25"
            />
          </div>
        </div>

        <button
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 200);
          }}
          className="w-full py-4 bg-black text-white font-black uppercase text-xl shadow-[6px_6px_0px_0px_rgba(251,191,36,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
        >
          {loading ? 'Evaluating Mortgage Terms...' : 'Calculate Home Loan Monthly Repayment'}
        </button>
      </div>

      {results && (
        <div className="border-4 border-black bg-yellow-100 p-6 space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-sm font-black uppercase text-gray-600 block">Estimated Monthly Payment</span>
              <span className="text-4xl sm:text-5xl font-black text-black">
                FJD ${results.repayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-lg font-bold uppercase text-gray-700 ml-2">/ Month</span>
              </span>
            </div>
            <ShareResultActions
              title="Fiji Mortgage & Home Loan Estimate"
              summary={`Fiji Home Loan & Mortgage Estimate (ToolKitPro):
• Estimated Monthly Payment: FJD $${results.repayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / Month
• Property Price: FJD $${Number(housePrice).toLocaleString()}
• Deposit: FJD $${Number(deposit).toLocaleString()} (${results.depositPercentage.toFixed(1)}%)
• Net Loan Amount: FJD $${results.loanAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
• Interest Rate: ${rate}% p.a.
• Loan Term: ${term} Years
• Total Interest Payable: FJD $${results.totalInterest.toLocaleString('en-US', { maximumFractionDigits: 0 })}
• Absolute Total Cost: FJD $${results.totalRepay.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t-4 border-black pt-4">
            <div className="bg-white border-2 border-black p-3">
              <span className="block text-[10px] font-black uppercase text-gray-600">Net Loan Amount</span>
              <span className="text-base font-black">FJD ${results.loanAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              <span className="block text-[10px] font-bold text-gray-600">({results.depositPercentage.toFixed(1)}% deposit)</span>
            </div>
            <div className="bg-white border-2 border-black p-3">
              <span className="block text-[10px] font-black uppercase text-gray-600">Total Interest Payable</span>
              <span className="text-base font-black text-rose-700">FJD ${results.totalInterest.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="bg-white border-2 border-black p-3">
              <span className="block text-[10px] font-black uppercase text-gray-600">Absolute Total Cost</span>
              <span className="text-base font-black text-black">FJD ${results.totalRepay.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
