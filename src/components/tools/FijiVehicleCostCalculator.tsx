import { useState } from 'react';
import ShareResultActions from '../ShareResultActions';

export default function FijiVehicleCostCalculator() {
  const [vehiclePrice, setVehiclePrice] = useState<string>('24000'); // purchase price
  const [monthlyFuel, setMonthlyFuel] = useState<string>('220'); // petrol / diesel cost
  const [annualReg, setAnnualReg] = useState<string>('180'); // LTA road tax / registration
  const [annualInsurance, setAnnualInsurance] = useState<string>('650'); // standard comprehensive
  const [monthlyMaintenance, setMonthlyMaintenance] = useState<string>('60'); // oil changes / general upkeep

  const calculate = () => {
    const fuel = parseFloat(monthlyFuel) || 0;
    const maintenance = parseFloat(monthlyMaintenance) || 0;
    const registration = parseFloat(annualReg) || 0;
    const insurance = parseFloat(annualInsurance) || 0;

    // Convert annual expenses to monthly equivalents
    const monthlyRegEquivalent = registration / 12;
    const monthlyInsEquivalent = insurance / 12;

    const monthlyTotal = fuel + maintenance + monthlyRegEquivalent + monthlyInsEquivalent;
    const annualTotal = monthlyTotal * 12;

    return {
      monthlyTotal,
      annualTotal,
      monthlyFuel: fuel,
      monthlyMaintenance: maintenance,
      monthlyRegEquivalent,
      monthlyInsEquivalent
    };
  };

  const results = calculate();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="border-4 border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-black uppercase mb-4 border-b-2 border-black pb-2">Vehicle Running Cost Estimator</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-black uppercase mb-1">Vehicle Price / Value (FJD)</label>
            <input
              type="number"
              value={vehiclePrice}
              onChange={(e) => setVehiclePrice(e.target.value)}
              className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100"
              placeholder="24000"
            />
          </div>
          <div>
            <label className="block text-sm font-black uppercase mb-1">Estimated Fuel Cost (Monthly FJD)</label>
            <input
              type="number"
              value={monthlyFuel}
              onChange={(e) => setMonthlyFuel(e.target.value)}
              className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100"
              placeholder="220"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-black uppercase mb-1">LTA Registration (Annual)</label>
            <input
              type="number"
              value={annualReg}
              onChange={(e) => setAnnualReg(e.target.value)}
              className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100"
              placeholder="180"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase mb-1">Insurance Premium (Annual)</label>
            <input
              type="number"
              value={annualInsurance}
              onChange={(e) => setAnnualInsurance(e.target.value)}
              className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100"
              placeholder="650"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase mb-1">Upkeep Maintenance (Monthly)</label>
            <input
              type="number"
              value={monthlyMaintenance}
              onChange={(e) => setMonthlyMaintenance(e.target.value)}
              className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100"
              placeholder="60"
            />
          </div>
        </div>

        <p className="text-xs font-bold text-gray-600">
          Under Fiji law, third-party insurance is legally mandatory through the Land Transport Authority (LTA) and integrated accident levies. Fully comprehensive insurance is recommended for privately imported or modern vehicles.
        </p>
      </div>

      {results && (
        <div className="border-4 border-black bg-yellow-100 p-6 space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-4">
            <h3 className="font-black uppercase text-xl">Vehicle Operating Cost Estimate</h3>
            <ShareResultActions
              title="Fiji Vehicle Operating Cost Estimate"
              summary={`Fiji Vehicle Operating Cost Estimate (ToolKitPro):
• Total Monthly Running Cost: FJD $${results.monthlyTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Total Annual Cost Estimate: FJD $${results.annualTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Monthly Fuel: FJD $${results.monthlyFuel.toFixed(0)}
• Monthly Maintenance: FJD $${results.monthlyMaintenance.toFixed(0)}
• LTA Road Tax (Monthly Eq.): FJD $${results.monthlyRegEquivalent.toFixed(0)} (FJD $${annualReg}/yr)
• Insurance (Monthly Eq.): FJD $${results.monthlyInsEquivalent.toFixed(0)} (FJD $${annualInsurance}/yr)`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-black uppercase text-gray-600 block">Total Running Cost (Monthly)</span>
              <span className="text-3xl sm:text-4xl font-black text-rose-800">
                FJD ${results.monthlyTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className="text-xs font-black uppercase text-gray-600 block">Total Cost (Annual Estimate)</span>
              <span className="text-3xl sm:text-4xl font-black text-black">
                FJD ${results.annualTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="border-t-2 border-black border-dashed pt-4">
            <h4 className="font-black uppercase mb-2 text-xs">Expressed Monthly Breakdown</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white border-2 border-black p-2 text-center">
                <span className="block text-[8px] font-bold uppercase text-gray-600">Fuel</span>
                <span className="text-xs font-black">FJD ${results.monthlyFuel.toFixed(0)}</span>
              </div>
              <div className="bg-white border-2 border-black p-2 text-center">
                <span className="block text-[8px] font-bold uppercase text-gray-600">Maintenance</span>
                <span className="text-xs font-black">FJD ${results.monthlyMaintenance.toFixed(0)}</span>
              </div>
              <div className="bg-white border-2 border-black p-2 text-center">
                <span className="block text-[8px] font-bold uppercase text-gray-600">LTA Road Tax</span>
                <span className="text-xs font-black">FJD ${results.monthlyRegEquivalent.toFixed(0)}</span>
              </div>
              <div className="bg-white border-2 border-black p-2 text-center">
                <span className="block text-[8px] font-bold uppercase text-gray-600">Insurance Equivalent</span>
                <span className="text-xs font-black font-black">FJD ${results.monthlyInsEquivalent.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
