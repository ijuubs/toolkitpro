import { useState } from 'react';
import ShareResultActions from '../ShareResultActions';

export default function FijiOvertimeCalculator() {
  const [hourlyRate, setHourlyRate] = useState<string>('6.50'); // standard entry level rate or typical rate
  const [regularHours, setRegularHours] = useState<string>('45'); // standard Fiji work week is usually 40-48 hours
  const [ot15Hours, setOt15Hours] = useState<string>('5'); // time-and-a-half (1.5x)
  const [ot20Hours, setOt20Hours] = useState<string>('2'); // double time (2x, e.g. Sunday or public holiday)
  const [loading, setLoading] = useState<boolean>(false);

  const calculate = () => {
    const rate = parseFloat(hourlyRate) || 0;
    const regHrs = parseFloat(regularHours) || 0;
    const ot15Combined = parseFloat(ot15Hours) || 0;
    const ot20Combined = parseFloat(ot20Hours) || 0;

    const regularPay = rate * regHrs;
    const ot15Pay = rate * 1.5 * ot15Combined;
    const ot20Pay = rate * 2.0 * ot20Combined;
    const totalPay = regularPay + ot15Pay + ot20Pay;

    return {
      regularPay,
      ot15Pay,
      ot20Pay,
      totalPay,
      totalHours: regHrs + ot15Combined + ot20Combined
    };
  };

  const results = calculate();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="border-4 border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-black uppercase mb-4 border-b-2 border-black pb-2">Overtime & Pay Estimator</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-black uppercase mb-1">Hourly Base Rate (FJD)</label>
            <input
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              step="0.1"
              min="0"
              className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100"
              placeholder="6.50"
            />
          </div>
          <div>
            <label className="block text-sm font-black uppercase mb-1">Regular Hours worked</label>
            <input
              type="number"
              value={regularHours}
              onChange={(e) => setRegularHours(e.target.value)}
              min="0"
              className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100"
              placeholder="45"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-black uppercase mb-1">Overtime Hours (Time-and-a-half 1.5x)</label>
            <input
              type="number"
              value={ot15Hours}
              onChange={(e) => setOt15Hours(e.target.value)}
              min="0"
              className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100"
              placeholder="5"
            />
            <span className="text-xs font-bold text-gray-600 mt-1 block">Standard Fiji weekday OT multiplier.</span>
          </div>
          <div>
            <label className="block text-sm font-black uppercase mb-1">Double Time Hours (Sunday / Holidays 2x)</label>
            <input
              type="number"
              value={ot20Hours}
              onChange={(e) => setOt20Hours(e.target.value)}
              min="0"
              className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100"
              placeholder="2"
            />
            <span className="text-xs font-bold text-gray-600 mt-1 block">Work on Sundays/Public holidays under ERP.</span>
          </div>
        </div>

        <button
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 200);
          }}
          className="w-full py-4 bg-black text-white font-black uppercase text-xl shadow-[6px_6px_0px_0px_rgba(251,191,36,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
        >
          {loading ? 'Recalculating...' : 'Refresh Earnings Breakdown'}
        </button>
      </div>

      {results.totalPay > 0 && (
        <div className="border-4 border-black bg-yellow-100 p-6 space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-sm font-black uppercase text-gray-600 block">Total Estimated Earnings</span>
              <span className="text-4xl sm:text-5xl font-black text-black">
                FJD ${results.totalPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="block text-xs font-bold text-gray-600 mt-1">For a total of {results.totalHours} clocked hours.</span>
            </div>
            <ShareResultActions
              title="Fiji Overtime Earnings Estimate"
              summary={`Fiji Overtime Earnings Breakdown (ToolKitPro):
• Total Estimated Earnings: FJD $${results.totalPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Base Rate: FJD $${Number(hourlyRate).toFixed(2)}/hr
• Normal Hours (1.0x): ${regularHours} hrs (FJD $${results.regularPay.toFixed(2)})
• Overtime (1.5x): ${ot15Hours} hrs (FJD $${results.ot15Pay.toFixed(2)})
• Double Time (2.0x): ${ot20Hours} hrs (FJD $${results.ot20Pay.toFixed(2)})
• Total Clocked Hours: ${results.totalHours} hrs`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t-4 border-black pt-4">
            <div className="bg-white border-2 border-black p-3">
              <span className="block text-xs font-black uppercase text-gray-600">Normal (1.0x)</span>
              <span className="text-lg font-black text-black">
                FJD ${results.regularPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="bg-white border-2 border-black p-3">
              <span className="block text-xs font-black uppercase text-gray-600">Overtime (1.5x)</span>
              <span className="text-lg font-black text-rose-700">
                FJD ${results.ot15Pay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="bg-white border-2 border-black p-3">
              <span className="block text-xs font-black uppercase text-gray-600">Double Time (2.0x)</span>
              <span className="text-lg font-black text-rose-800">
                FJD ${results.ot20Pay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
