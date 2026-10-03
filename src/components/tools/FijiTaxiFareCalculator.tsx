import { useState } from 'react';

export default function FijiTaxiFareCalculator() {
  const [distance, setDistance] = useState<string>('8'); // default 8 km
  const [waitingTime, setWaitingTime] = useState<string>('5'); // 5 minutes waiting time
  const [isNightTime, setIsNightTime] = useState<boolean>(false); // Daytime by default
  const [loading, setLoading] = useState<boolean>(false);

  const calculate = () => {
    const d = parseFloat(distance) || 0;
    const w = parseFloat(waitingTime) || 0;

    // FCCC regulated fare structure in force from 1 October 2026 for general Viti Levu taxis (excluding airport):
    // - Daytime flag fall (6:00 AM - 9:00 PM): $2.00 FJD
    // - Nighttime flag fall (9:00 PM - 6:00 AM): $3.00 FJD
    const flagDrop = isNightTime ? 3.00 : 2.00;

    // Regulated distance rate: $1.00 FJD per km (10 cents per 100 meters)
    const ratePerKm = 1.00;

    // Regulated waiting / traffic idling charge: $0.18 FJD per minute
    const ratePerMinWait = 0.18;

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
        <h3 className="text-xl font-black uppercase mb-1 border-b-2 border-black pb-2">
          Viti Levu Taxi Fare Meter Estimator
        </h3>
        <p className="text-xs font-bold text-neutral-600 mb-4">
          FCCC regulated rates in force from 1 October 2026 for general Viti Levu taxis (excluding airport).
        </p>

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
              <span className="font-black uppercase text-sm block">Night Rate tariff (9:00 PM - 6:00 AM)</span>
              <span className="text-xs text-gray-600 font-bold block">Applies a base drop of FJD $3.00 instead of FJD $2.00</span>
            </div>
          </label>
        </div>

        <button
          type="button"
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 200);
          }}
          className="w-full py-4 bg-black text-white font-black uppercase text-xl shadow-[6px_6px_0px_0px_rgba(251,191,36,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all cursor-pointer"
        >
          {loading ? 'Re-metering Fare...' : 'Calculate Estimated Fare'}
        </button>
      </div>

      {results && (
        <div className="border-4 border-black bg-yellow-100 p-6 space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div>
            <span className="text-sm font-black uppercase text-gray-600 block">Estimated TAXI Fare (Viti Levu)</span>
            <span className="text-4xl sm:text-5xl font-black text-black">
              FJD ${results.totalFare.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="block text-[10px] font-bold text-gray-600 mt-2">
              Based on FCCC & LTA regulated standards in force from 1 October 2026. Covers general Viti Levu taxis only.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t-4 border-black pt-4">
            <div className="bg-white border-2 border-black p-3 text-center">
              <span className="block text-[8px] font-bold uppercase text-gray-600">Base Drop</span>
              <span className="text-sm font-black">FJD ${results.baseFare.toFixed(2)}</span>
            </div>
            <div className="bg-white border-2 border-black p-3 text-center">
              <span className="block text-[8px] font-bold uppercase text-gray-600">Distance Fare ($1.00/km)</span>
              <span className="text-sm font-black">FJD ${results.distanceFare.toFixed(2)}</span>
            </div>
            <div className="bg-white border-2 border-black p-3 text-center">
              <span className="block text-[8px] font-bold uppercase text-gray-600">Waiting Fee ($0.18/min)</span>
              <span className="text-sm font-black text-rose-700">FJD ${results.waitingFare.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
