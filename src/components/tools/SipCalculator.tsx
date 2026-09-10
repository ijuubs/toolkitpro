import { useState } from 'react';

export default function SipCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number | ''>(500);
  const [expectedReturn, setExpectedReturn] = useState<number | ''>(12);
  const [timePeriod, setTimePeriod] = useState<number | ''>(10);

  const calculateSIP = () => {
    if (monthlyInvestment === '' || expectedReturn === '' || timePeriod === '') return null;
    if (monthlyInvestment <= 0 || expectedReturn <= 0 || timePeriod <= 0) return null;

    const monthlyRate = expectedReturn / 12 / 100;
    const months = timePeriod * 12;
    
    const futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const totalInvested = monthlyInvestment * months;
    const estimatedReturns = futureValue - totalInvested;

    return { totalInvested, estimatedReturns, futureValue };
  };

  const results = calculateSIP();

  return (
    <div className="space-y-6">
      <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-2xl font-black uppercase mb-4">SIP Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold uppercase mb-2">Monthly Investment ($)</label>
            <input
              type="number"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(e.target.value ? Number(e.target.value) : '')}
              className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-yellow-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase mb-2">Expected Return Rate (p.a %)</label>
            <input
              type="number"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value ? Number(e.target.value) : '')}
              className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-yellow-400 transition-all"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold uppercase mb-2">Time Period (Years)</label>
            <input
              type="number"
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value ? Number(e.target.value) : '')}
              className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-yellow-400 transition-all"
            />
          </div>
        </div>
      </div>

      {results && (
        <div className="bg-yellow-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black uppercase mb-4">Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border-4 border-black p-4 text-center">
              <div className="text-sm font-bold uppercase text-gray-600 mb-1">Total Invested</div>
              <div className="text-xl font-black">
                ${results.totalInvested.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
            </div>
            <div className="bg-white border-4 border-black p-4 text-center">
              <div className="text-sm font-bold uppercase text-neutral-800 dark:text-neutral-200 mb-1">Estimated Returns</div>
              <div className="text-xl font-black text-green-700 dark:text-green-400">
                ${results.estimatedReturns.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
            </div>
            <div className="bg-black border-4 border-black p-4 text-center text-white">
              <div className="text-sm font-bold uppercase text-neutral-300 mb-1">Total Value</div>
              <div className="text-2xl font-black text-yellow-400">
                ${results.futureValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
