import { useState } from 'react';

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState<number | ''>(1000);
  const [contribution, setContribution] = useState<number | ''>(100);
  const [years, setYears] = useState<number | ''>(10);
  const [rate, setRate] = useState<number | ''>(8);
  const [compoundFrequency, setCompoundFrequency] = useState<number>(12); // Monthly default
  const [contributionFrequency, setContributionFrequency] = useState<number>(12); // Monthly default

  const compoundOptions = [
    { value: 1, label: 'Annually (1/yr)' },
    { value: 2, label: 'Semi-Annually (2/yr)' },
    { value: 4, label: 'Quarterly (4/yr)' },
    { value: 12, label: 'Monthly (12/yr)' },
    { value: 365, label: 'Daily (365/yr)' }
  ];

  const calculateCompoundInterest = () => {
    if (principal === '' || years === '' || rate === '' || contribution === '') return null;
    if (years <= 0 || rate < 0) return null;

    const p = principal;
    const r = rate / 100;
    const t = years;
    const n = compoundFrequency;
    const c = contribution;
    const f = contributionFrequency;

    // We'll calculate year by year to handle different contribution frequencies easily, 
    // or use a discrete compounding formula. 
    // For exact math matching the inputs, let's step through each contribution period.
    
    let currentBalance = p;
    const totalPeriods = t * f;
    const ratePerPeriod = Math.pow(1 + r/n, n/f) - 1; // effective rate per contribution period

    let totalContributions = p;

    for (let i = 0; i < totalPeriods; i++) {
      currentBalance = currentBalance * (1 + ratePerPeriod) + c;
      totalContributions += c;
    }

    const totalInterest = currentBalance - totalContributions;

    return { 
      futureValue: currentBalance, 
      totalContributions, 
      totalInterest 
    };
  };

  const results = calculateCompoundInterest();

  return (
    <div className="space-y-6">
      <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-2xl font-black uppercase mb-4">Investment Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold uppercase mb-2">Initial Principal ($)</label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value ? Number(e.target.value) : '')}
              className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-yellow-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase mb-2">Interest Rate (Annual %)</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value ? Number(e.target.value) : '')}
              className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-yellow-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase mb-2">Time Horizon (Years)</label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value ? Number(e.target.value) : '')}
              className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-yellow-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase mb-2">Compounding Frequency</label>
            <select
              value={compoundFrequency}
              onChange={(e) => setCompoundFrequency(Number(e.target.value))}
              className="w-full border-4 border-black p-3 font-bold bg-white focus:outline-none focus:ring-4 focus:ring-yellow-400 transition-all appearance-none cursor-pointer"
            >
              {compoundOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <h3 className="text-xl font-black uppercase mt-6 mb-4">Regular Contributions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold uppercase mb-2">Contribution Amount ($)</label>
            <input
              type="number"
              value={contribution}
              onChange={(e) => setContribution(e.target.value ? Number(e.target.value) : '')}
              className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-yellow-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase mb-2">Contribution Frequency</label>
            <select
              value={contributionFrequency}
              onChange={(e) => setContributionFrequency(Number(e.target.value))}
              className="w-full border-4 border-black p-3 font-bold bg-white focus:outline-none focus:ring-4 focus:ring-yellow-400 transition-all appearance-none cursor-pointer"
            >
              <option value={1}>Annually</option>
              <option value={12}>Monthly</option>
              <option value={52}>Weekly</option>
            </select>
          </div>
        </div>
      </div>

      {results && (
        <div className="bg-yellow-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black uppercase mb-4 text-center">Growth Projection</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border-4 border-black p-4 text-center flex flex-col justify-center">
              <div className="text-sm font-bold uppercase text-neutral-800 dark:text-neutral-200 mb-1">Total Principal</div>
              <div className="text-xl font-black">${Math.round(results.totalContributions).toLocaleString()}</div>
            </div>
            <div className="bg-white border-4 border-black p-4 text-center flex flex-col justify-center">
              <div className="text-sm font-bold uppercase text-neutral-800 dark:text-neutral-200 mb-1">Total Interest Earned</div>
              <div className="text-xl font-black text-green-700 dark:text-green-400">${Math.round(results.totalInterest).toLocaleString()}</div>
            </div>
            <div className="bg-black border-4 border-black p-4 text-center text-white flex flex-col justify-center">
              <div className="text-sm font-bold uppercase text-neutral-300 mb-1">Future Value</div>
              <div className="text-3xl font-black text-yellow-400">${Math.round(results.futureValue).toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
