import { useState } from 'react';
import { trackToolUsage } from '../../utils/analytics';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import ShareResultActions from '../ShareResultActions';

export default function FijiFnpfCalculator() {
  const [currentAge, setCurrentAge] = useState<string>('30');
  const [retirementAge, setRetirementAge] = useState<string>('55');
  const [currentBalance, setCurrentBalance] = useState<string>('15000');
  const [monthlySalary, setMonthlySalary] = useState<string>('2000');
  const [employeeRate, setEmployeeRate] = useState<string>('8');
  const [employerRate, setEmployerRate] = useState<string>('10');
  const [salaryGrowth, setSalaryGrowth] = useState<string>('3');
  const [annualReturn, setAnnualReturn] = useState<string>('6');

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b-2 border-black pb-3">
            <h3 className="font-black uppercase text-xl">Projection Results</h3>
            <ShareResultActions
              title="Fiji FNPF Savings Projection"
              summary={`Fiji FNPF Savings Projection (ToolKitPro):
• Projected Final Balance: FJD $${results.finalBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
• Years to Retirement: ${results.years} Years (Age ${currentAge} to ${retirementAge})
• Starting Balance: FJD $${results.startingBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
• Total Employee Contributions (${employeeRate}%): FJD $${results.totalEmployeeContrib.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
• Total Employer Contributions (${employerRate}%): FJD $${results.totalEmployerContrib.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
• Total Estimated Interest Earned (${annualReturn}% return): FJD $${results.totalInterest.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
• Monthly Salary: FJD $${Number(monthlySalary).toLocaleString()}`}
            />
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
          
          <div className="border-2 border-black p-3 bg-neutral-50 text-xs text-neutral-800 space-y-1 mt-4">
            <p><strong>Last reviewed:</strong> Oct 2026</p>
            <p><strong>Applicable period:</strong> 2026/2027 Financial Year</p>
            <p><strong>Reference:</strong> Fiji National Provident Fund (FNPF) Guidelines</p>
            <p className="italic">Disclaimer: Projections are estimates and not financial advice. FNPF interest rates and contribution rates are subject to annual change by the Fund.</p>
          </div>
        </div>
      )}
    </div>
  );
}
