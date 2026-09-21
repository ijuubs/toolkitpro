import { useState } from 'react';

export default function FijiTaxiFareCalculator() {
  const [distance, setDistance] = useState<string>('8'); // default 8 km
  const [waitingTime, setWaitingTime] = useState<string>('5'); // 5 minutes waiting time
  const [isNightTime, setIsNightTime] = useState<boolean>(false); // Daytime by default
  const [loading, setLoading] = useState<boolean>(false);

  const calculate = () => {
    const d = parseFloat(distance) || 0;
    const w = parseFloat(waitingTime) || 0;

    // LTA regulated fare structure:
    // Temporary adjustment effective July 1, 2026 - Sept 30, 2026 (Verified FCCC)
    // - Daytime: $2.00 FJD
    // - Nighttime: $3.00 FJD
    // NOTE: Rates scheduled to revert on October 1, 2026.
    const flagDrop = isNightTime ? 3.00 : 2.00;

    // Regulated rate per Kilometer: $1.40 FJD (14 cents per 100 meters)
    const ratePerKm = 1.40;

    // Regulated waiting time charge: $0.20 per minute
    const ratePerMinWait = 0.20;

    const baseFare = flagDrop;
    const distanceFare = d * ratePerKm;
    const waitingFare = w * ratePerMinWait;
    
    const totalFare = baseFare + distanceFare + waitingFare;

    return {
      baseFare,
      distanceFare,
      waitingFare,
      totalFare
    };
  };

  const results = calculate();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="border-4 border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-black uppercase mb-4 border-b-2 border-black pb-2">Taxi Fare Meter Estimator</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-black uppercase mb-1">Estimated Travel Distance (km)</label>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              min="0"
              step="0.1"
              className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100"
              placeholder="8"
            />
          </div>
          <div>
            <label className="block text-sm font-black uppercase mb-1">Estimated Waiting / Traffic Time (mins)</label>
            <input
              type="number"
              value={waitingTime}
              onChange={(e) => setWaitingTime(e.target.value)}
              min="0"
              className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100"
              placeholder="5"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer user-select-none">
            <input
              type="checkbox"
              checked={isNightTime}
              onChange={(e) => setIsNightTime(e.target.checked)}
              className="w-6 h-6 border-4 border-black checked:bg-yellow-400 cursor-pointer"
            />
            <div>
              <span className="font-black uppercase text-sm block">Night Rate tariff (10:00 PM - 6:00 AM)</span>
              <span className="text-xs text-gray-600 font-bold block">Applies a base drop of FJD $3.00 instead of FJD $2.00</span>
            </div>
          </label>
        </div>

        <button
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 200);
          }}
          className="w-full py-4 bg-black text-white font-black uppercase text-xl shadow-[6px_6px_0px_0px_rgba(251,191,36,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
        >
          {loading ? 'Re-metering Fare...' : 'Calculate Estimated Fare'}
        </button>
      </div>

      {results && (
        <div className="border-4 border-black bg-yellow-100 p-6 space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div>
            <span className="text-sm font-black uppercase text-gray-600 block">Estimated TAXI Fare</span>
            <span className="text-4xl sm:text-5xl font-black text-black">
              FJD ${results.totalFare.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="block text-[10px] font-bold text-gray-600 mt-2">Adjusted based on regulated standards set by the Land Transport Authority (LTA) of Fiji.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t-4 border-black pt-4">
            <div className="bg-white border-2 border-black p-3 text-center">
              <span className="block text-[8px] font-bold uppercase text-gray-600">Base Drop</span>
              <span className="text-sm font-black">FJD ${results.baseFare.toFixed(2)}</span>
            </div>
            <div className="bg-white border-2 border-black p-3 text-center">
              <span className="block text-[8px] font-bold uppercase text-gray-600">Distance Fare</span>
              <span className="text-sm font-black">FJD ${results.distanceFare.toFixed(2)}</span>
            </div>
            <div className="bg-white border-2 border-black p-3 text-center">
              <span className="block text-[8px] font-bold uppercase text-gray-600">Waiting/Idling Fee</span>
              <span className="text-sm font-black text-rose-700">FJD ${results.waitingFare.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
