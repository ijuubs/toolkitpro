import { useState } from 'react';
import ShareResultActions from '../ShareResultActions';

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState<number>(100000);
  const [rate, setRate] = useState<number>(5);
  const [years, setYears] = useState<number>(30);

  const calculateLoan = () => {
    const p = principal;
    const r = (rate / 100) / 12;
    const n = years * 12;

    if (p <= 0 || rate <= 0 || years <= 0) return { payment: 0, totalPayment: 0, totalInterest: 0 };

    const payment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = payment * n;
    const totalInterest = totalPayment - p;

    return { payment, totalPayment, totalInterest };
  };

  const { payment, totalPayment, totalInterest } = calculateLoan();

  const shareSummary = payment > 0 ? `Loan Repayment Calculation (ToolKitPro):
• Monthly Payment: $${payment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Loan Principal: $${principal.toLocaleString('en-US')}
• Interest Rate: ${rate}% p.a.
• Loan Term: ${years} Years
• Total Interest: $${totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Total Payment: $${totalPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '';

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-black uppercase mb-1">Principal Amount ($)</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full p-3 border-4 border-black font-bold text-lg focus:outline-none focus:border-yellow-400"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-black uppercase mb-1">Interest Rate (% per year)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full p-3 border-4 border-black font-bold text-lg focus:outline-none focus:border-yellow-400"
            min="0"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-sm font-black uppercase mb-1">Loan Term (Years)</label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full p-3 border-4 border-black font-bold text-lg focus:outline-none focus:border-yellow-400"
            min="1"
          />
        </div>
      </div>

      <div className="bg-yellow-100 border-4 border-black p-6 space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-black uppercase">Monthly Payment</h3>
            <p className="text-4xl font-black text-black">
              ${payment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          {payment > 0 && (
            <ShareResultActions
              title="Loan Repayment Calculation"
              summary={shareSummary}
            />
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-black">
          <div>
            <span className="block text-sm font-bold uppercase">Total Interest</span>
            <span className="text-xl font-bold">${totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div>
            <span className="block text-sm font-bold uppercase">Total Payment</span>
            <span className="text-xl font-bold">${totalPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
