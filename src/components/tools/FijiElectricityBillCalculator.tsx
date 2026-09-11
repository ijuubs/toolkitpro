import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function FijiElectricityBillCalculator() {
  const [kwhUsage, setKwhUsage] = useState<string>('120'); // Average monthly usage in kWh
  const [loading, setLoading] = useState<boolean>(false);

  const calculate = () => {
    const kwh = parseFloat(kwhUsage) || 0;
    
    // EFL Tariffs & Guidelines:
    // Regular domestic rate: $0.3401 per kWh (excluding VAT or including depending on subsidies)
    // There is a government subsidy in Fiji for residents using 100 kWh or less per month.
    // Let's reflect this.
    // If usage <= 100 kWh, government pays 50% of the cost for standard domestic tariff (approx 17c instead of 34c).
    // Let's define:
    const standardRate = 0.3401; // $0.3401 per kWh
    let baseBill = 0;
    let subsidyAmount = 0;

    if (kwh <= 100) {
      // Under 100kWh gets the 50% government subsidy
      baseBill = kwh * standardRate;
      subsidyAmount = baseBill * 0.5; // Government pays half
    } else {
      baseBill = kwh * standardRate;
    }

    const subtotal = baseBill - subsidyAmount;
    
    // VAT is 15% (EFL tariff rates may have VAT already included or added. We denote VAT separately for structural clarity)
    const vatInclusivePrice = subtotal;
    const estimatedVat = vatInclusivePrice * (15 / 115); // Amount of VAT included (if tariff has it included)

    const monthlyBill = vatInclusivePrice;
    const annualBill = monthlyBill * 12;

    return {
      baseBill,
      subsidyAmount,
      monthlyBill,
      annualBill,
      estimatedVat
    };
  };

  const results = calculate();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="border-4 border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-black uppercase mb-4 border-b-2 border-black pb-2">EFL Electricity Bill Estimator</h3>

        <div className="mb-6">
          <label className="block text-sm font-black uppercase mb-2">Monthly Electricity Consumption (kWh)</label>
          <input
            type="number"
            value={kwhUsage}
            onChange={(e) => setKwhUsage(e.target.value)}
            min="0"
            className="w-full p-4 border-4 border-black font-black text-2xl focus:outline-none focus:bg-yellow-105 bg-white text-black"
            placeholder="120"
          />
          <span className="text-xs font-bold text-gray-600 mt-2 block">
            Tip: Check your recent Energy Fiji Limited (EFL) paper or digital invoice to locate your previous month’s kWh usage.
          </span>
        </div>

        <button
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 200);
          }}
          className="w-full py-4 bg-black text-white font-black uppercase text-xl shadow-[6px_6px_0px_0px_rgba(251,191,36,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
        >
          {loading ? 'Re-calculating Power Bill...' : 'Calculate Electricity Bill'}
        </button>
      </div>

      {results && (
        <div className="border-4 border-black bg-yellow-101 bg-yellow-100 p-6 space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-black uppercase text-gray-600 block">Estimated Monthly Utility Bill</span>
              <span className="text-4xl font-black text-black">
                FJD ${results.monthlyBill.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className="text-sm font-black uppercase text-gray-600 block">Projected Annual Electricity Cost</span>
              <span className="text-4xl font-black text-emerald-800">
                FJD ${results.annualBill.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t-4 border-black pt-4">
            <div className="bg-white border-2 border-black p-3">
              <span className="block text-xs font-bold uppercase text-gray-600">Standard Cost</span>
              <span className="text-base font-black">FJD ${results.baseBill.toFixed(2)}</span>
            </div>
            <div className="bg-white border-2 border-black p-3">
              <span className="block text-xs font-bold uppercase text-gray-600">Gov Subsidy Paid</span>
              <span className="text-base font-black text-emerald-700">FJD ${results.subsidyAmount.toFixed(2)}</span>
            </div>
            <div className="bg-white border-2 border-black p-3">
              <span className="block text-xs font-bold uppercase text-gray-600">Tax Component (15% VAT)</span>
              <span className="text-base font-black font-black">FJD ${results.estimatedVat.toFixed(2)}</span>
            </div>
          </div>

          {parseFloat(kwhUsage) <= 100 && (
            <div className="p-3 bg-emerald-100 border-2 border-dashed border-emerald-800 font-bold text-xs uppercase text-emerald-800 text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>50% Government Electricity Subsidy applied (Usage is under 100 kWh threshold).</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
