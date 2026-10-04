import { useState } from 'react';
import ShareResultActions from '../ShareResultActions';

export default function FijiDutyImportCalculator() {
  const [itemCost, setItemCost] = useState<string>('500');
  const [shippingCost, setShippingCost] = useState<string>('80');
  const [dutyRate, setDutyRate] = useState<string>('15'); // default 15% (general rate or common clothing category)
  const [vatRate] = useState<number>(15); // Fiji general VAT rate is fixed at 15% since August 1st, 2023

  const categories = [
    { label: 'Custom Duty Rate', value: 'custom' },
    { label: 'Personal Computers & Tablets (0% Duty)', value: '0' },
    { label: 'Books & Educational Material (0% Duty)', value: '0' },
    { label: 'Mobile Phones & Accessories (5% Duty)', value: '5' },
    { label: 'Clothing & Footwear (15% Duty)', value: '15' },
    { label: 'Auto Parts & Mechanical (15% Duty)', value: '15' },
    { label: 'General Manufactured Goods (32% Duty)', value: '32' },
  ];

  const [selectedCategory, setSelectedCategory] = useState<string>('15');

  const calculate = () => {
    const cost = parseFloat(itemCost) || 0;
    const shipping = parseFloat(shippingCost) || 0;
    
    // Determine duty rate to apply
    const activeDutyRate = selectedCategory === 'custom' 
      ? (parseFloat(dutyRate) || 0) 
      : (parseFloat(selectedCategory) || 0);

    // Value for duty is usually CIF (Value of Goods + Insurance + Freight)
    // We assume insurance is negligible, so Cost + Shipping forms CIF base
    const cifValue = cost + shipping;

    // Fiscal duty
    const fiscalDuty = cifValue * (activeDutyRate / 100);

    // VAT is calculated on the value of goods + shipping + duty
    const vatBase = cifValue + fiscalDuty;
    const importVat = vatBase * (vatRate / 100);

    const totalCharges = fiscalDuty + importVat;
    const totalLandedCost = cifValue + totalCharges;

    return {
      cifValue,
      fiscalDuty,
      importVat,
      totalCharges,
      totalLandedCost,
      appliedDutyRate: activeDutyRate
    };
  };

  const results = calculate();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="border-4 border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-black uppercase mb-4 border-b-2 border-black pb-2">Duty & Import VAT Calculator</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-black uppercase mb-1">Item Purchase Cost (FJD equivalent)</label>
            <input
              type="number"
              value={itemCost}
              onChange={(e) => setItemCost(e.target.value)}
              min="0"
              className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100"
              placeholder="500"
            />
          </div>
          <div>
            <label className="block text-sm font-black uppercase mb-1">Shipping & Freight Cost (FJD)</label>
            <input
              type="number"
              value={shippingCost}
              onChange={(e) => setShippingCost(e.target.value)}
              min="0"
              className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100"
              placeholder="80"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-black uppercase mb-1">Item Category (Fiji Tariff)</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                if (e.target.value !== 'custom') {
                  setDutyRate(e.target.value);
                }
              }}
              className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100 bg-white"
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          {selectedCategory === 'custom' && (
            <div>
              <label className="block text-sm font-black uppercase mb-1">Custom Duty Rate (%)</label>
              <input
                type="number"
                value={dutyRate}
                onChange={(e) => setDutyRate(e.target.value)}
                min="0"
                className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100 bg-white"
                placeholder="15"
              />
            </div>
          )}
        </div>

        <p className="text-xs font-bold text-gray-600">
          Note: Fiji Revenue & Customs Service (FRCS) assesses imports on CIF value. Import VAT rate is 15%. Minor packages under FJD $400 may occasionally qualify for concessions depending on standard passenger allowances.
        </p>
      </div>

      {results && (
        <div className="border-4 border-black bg-yellow-100 p-6 space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase text-gray-600 block">Estimated Import Charges Payable</span>
              <span className="text-4xl sm:text-5xl font-black text-rose-800">
                FJD ${results.totalCharges.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <ShareResultActions
              title="Fiji Customs Duty & Import VAT Estimate"
              summary={`Fiji Customs Duty & Import Tax Estimate (ToolKitPro):
• Estimated Import Charges: FJD $${results.totalCharges.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Total Landed Cost: FJD $${results.totalLandedCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Item FOB Value: FJD $${Number(itemCost).toLocaleString()}
• Shipping & Freight: FJD $${Number(shippingCost).toLocaleString()}
• Customs CIF Value: FJD $${results.cifValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Applied Fiscal Duty (${results.appliedDutyRate}%): FJD $${results.fiscalDuty.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Import VAT (15%): FJD $${results.importVat.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t-4 border-black pt-4">
            <div className="bg-white border-2 border-black p-3">
              <span className="block text-[10px] font-black uppercase text-gray-600">Applied Fiscal Duty ({results.appliedDutyRate}%)</span>
              <span className="text-sm font-black">FJD ${results.fiscalDuty.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="bg-white border-2 border-black p-3">
              <span className="block text-[10px] font-black uppercase text-gray-600">Import VAT (15%)</span>
              <span className="text-sm font-black text-black">FJD ${results.importVat.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="bg-white border-2 border-black p-3">
              <span className="block text-[10px] font-black uppercase text-gray-600 font-black">Total Landed Cost</span>
              <span className="text-sm font-black text-emerald-800">FJD ${results.totalLandedCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
