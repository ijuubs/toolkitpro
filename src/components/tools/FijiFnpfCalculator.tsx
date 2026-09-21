import { useState } from 'react';
import { trackToolUsage } from '../../utils/analytics';
import { Copy, Check, RotateCcw, AlertTriangle } from 'lucide-react';

export default function FijiFnpfCalculator() {
  const [currentAge, setCurrentAge] = useState<string>('30');
  const [retirementAge, setRetirementAge] = useState<string>('55');
  const [currentBalance, setCurrentBalance] = useState<string>('15000');
  const [monthlySalary, setMonthlySalary] = useState<string>('2000');
  const [employeeRate, setEmployeeRate] = useState<string>('8');
  const [employerRate, setEmployerRate] = useState<string>('10');
  const [salaryGrowth, setSalaryGrowth] = useState<string>('3');
  const [annualReturn, setAnnualReturn] = useState<string>('6');
  
  const [copied, setCopied] = useState<boolean>(false);

  const calculate = () => {
    const age = parseInt(currentAge);
    const retAge = parseInt(retirementAge);
    const balance = parseFloat(currentBalance);
    const salary = parseFloat(monthlySalary);
    const empRate = parseFloat(employeeRate) / 100;
    const emplyrRate = parseFloat(employerRate) / 100;
    const growth = parseFloat(salaryGrowth) / 100;
    const returnRate = parseFloat(annualReturn) / 100;

    if (
      isNaN(age) || isNaN(retAge) || isNaN(balance) || isNaN(salary) ||
      isNaN(empRate) || isNaN(emplyrRate) || isNaN(growth) || isNaN(returnRate) ||
      age >= retAge || age < 16 || salary < 0 || balance < 0
    ) {
      return null;
    }

    let currentYearBalance = balance;
    let currentAnnualSalary = salary * 12;
    
    let totalEmployeeContrib = 0;
    let totalEmployerContrib = 0;
    let totalInterest = 0;

    const years = retAge - age;

    for (let i = 0; i < years; i++) {
      const yearEmployeeContrib = currentAnnualSalary * empRate;
      const yearEmployerContrib = currentAnnualSalary * emplyrRate;
      const totalYearContrib = yearEmployeeContrib + yearEmployerContrib;

      // Approximate interest calculation: opening balance + half of year's contributions
      const yearInterest = (currentYearBalance + (totalYearContrib / 2)) * returnRate;

      totalEmployeeContrib += yearEmployeeContrib;
      totalEmployerContrib += yearEmployerContrib;
      totalInterest += yearInterest;

      currentYearBalance += totalYearContrib + yearInterest;
      currentAnnualSalary *= (1 + growth);
    }

    return {
      finalBalance: currentYearBalance,
      totalEmployeeContrib,
      totalEmployerContrib,
      totalInterest,
      startingBalance: balance,
      years
    };
  };

  const results = calculate();

  const handleCopy = () => {
    if (!results) return;
    const text = `FNPF Retirement Projection:
Years to Retirement: ${results.years}
Starting Balance: $${results.startingBalance.toFixed(2)}
Total Employee Contrib: $${results.totalEmployeeContrib.toFixed(2)}
Total Employer Contrib: $${results.totalEmployerContrib.toFixed(2)}
Total Est. Interest Earned: $${results.totalInterest.toFixed(2)}
Projected Final Balance: $${results.finalBalance.toFixed(2)}

*Estimate only. Not financial advice.*`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    trackToolUsage('fiji-fnpf-calculator', 'Fiji FNPF Calculator', 'Fiji Tools', 'copy_results');
  };

  const handleClear = () => {
    setCurrentAge('');
    setRetirementAge('55');
    setCurrentBalance('');
    setMonthlySalary('');
    setEmployeeRate('8');
    setEmployerRate('10');
    setSalaryGrowth('3');
    setAnnualReturn('6');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="border-4 border-black p-4 sm:p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b-2 border-black pb-4">
          <div>
            <h3 className="text-xl font-black uppercase">FNPF Retirement Estimator</h3>
            <p className="text-sm font-bold text-gray-600">Project your future balance with compound interest</p>
          </div>
          <button onClick={handleClear} className="flex items-center gap-1 text-sm bg-neutral-200 px-3 py-2 border-2 border-black hover:bg-neutral-300 active:translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-black uppercase text-sm bg-black text-white px-2 py-1 inline-block">Personal Details</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase mb-1">Current Age</label>
                <input
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(e.target.value)}
                  className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100 transition-colors"
                  placeholder="30"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase mb-1">Retirement Age</label>
                <input
                  type="number"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(e.target.value)}
                  className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100 transition-colors"
                  placeholder="55"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase mb-1">Current FNPF Balance (FJD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black">$</span>
                <input
                  type="number"
                  value={currentBalance}
                  onChange={(e) => setCurrentBalance(e.target.value)}
                  className="w-full pl-8 p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100 transition-colors"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase mb-1">Current Monthly Gross Salary (FJD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black">$</span>
                <input
                  type="number"
                  value={monthlySalary}
                  onChange={(e) => setMonthlySalary(e.target.value)}
                  className="w-full pl-8 p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100 transition-colors"
                  placeholder="2000"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-black uppercase text-sm bg-black text-white px-2 py-1 inline-block">Growth & Rates</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase mb-1">Employee Rate (%)</label>
                <input
                  type="number"
                  value={employeeRate}
                  onChange={(e) => setEmployeeRate(e.target.value)}
                  className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100 transition-colors"
                  placeholder="8"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase mb-1">Employer Rate (%)</label>
                <select
                  value={employerRate}
                  onChange={(e) => setEmployerRate(e.target.value)}
                  className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100 transition-colors appearance-none bg-white cursor-pointer"
                >
                  <option value="10">10% (Standard)</option>
                  <option value="8">8% (Relief Rate)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase mb-1">Est. Salary Growth (%)</label>
                <input
                  type="number"
                  value={salaryGrowth}
                  onChange={(e) => setSalaryGrowth(e.target.value)}
                  className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100 transition-colors"
                  placeholder="3"
                />
                <span className="text-[10px] font-bold text-gray-500">Annual increase</span>
              </div>
              <div>
                <label className="block text-xs font-black uppercase mb-1">Est. Annual Return (%)</label>
                <input
                  type="number"
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(e.target.value)}
                  className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100 transition-colors"
                  placeholder="6"
                />
                <span className="text-[10px] font-bold text-gray-500">FNPF interest rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!results && currentAge && retirementAge && parseInt(currentAge) >= parseInt(retirementAge) && (
        <div className="p-4 bg-red-100 border-4 border-black flex items-center gap-3">
          <AlertTriangle className="text-red-600 shrink-0" />
          <p className="font-bold text-red-800 text-sm uppercase">Retirement age must be greater than current age.</p>
        </div>
      )}

      {results && (
        <div className="border-4 border-black bg-blue-50 p-4 sm:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black uppercase text-xl">Projection Results</h3>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 font-black uppercase text-sm hover:bg-yellow-400 hover:text-black border-2 border-black transition-all active:translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:shadow-none"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-2 gap-4 border-b-2 border-black pb-4">
              <div>
                <p className="text-xs font-black uppercase text-gray-600">Starting Balance</p>
                <p className="font-black text-lg">$ {results.startingBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase text-gray-600">Years to Grow</p>
                <p className="font-black text-lg">{results.years} Years</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm">Total Employee Contributions</span>
                <span className="font-black text-sm">$ {results.totalEmployeeContrib.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm">Total Employer Contributions</span>
                <span className="font-black text-sm">$ {results.totalEmployerContrib.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between items-center text-green-700">
                <span className="font-bold text-sm">Est. Total Interest Earned</span>
                <span className="font-black text-sm">+ $ {results.totalInterest.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t-4 border-black">
            <p className="text-sm font-black uppercase mb-1">Projected FNPF Balance at Age {retirementAge}</p>
            <p className="text-3xl sm:text-4xl font-black text-blue-700 tracking-tight break-all">
              $ {results.finalBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </p>
          </div>

          <div className="mt-6 p-3 bg-yellow-100 border-2 border-black flex gap-3 items-start">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-xs font-bold leading-relaxed text-gray-800">
              <strong>Disclaimer:</strong> This is an estimate based on constant compound interest, static contribution rates, and steady salary growth over {results.years} years. Actual FNPF returns depend on official annual declarations and economic factors. This is not financial advice.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
