import { useState } from 'react';
import ShareResultActions from '../ShareResultActions';

export default function FijiBusinessStartupCostCalculator() {
  // Business Setup
  const [setupReg, setSetupReg] = useState<string>('0');
  const [setupLicenses, setSetupLicenses] = useState<string>('0');
  const [setupLegal, setSetupLegal] = useState<string>('0');

  // Premises
  const [premisesDeposit, setPremisesDeposit] = useState<string>('0');
  const [premisesRent, setPremisesRent] = useState<string>('0');
  const [premisesFitout, setPremisesFitout] = useState<string>('0');

  // Equipment
  const [equipmentMachinery, setEquipmentMachinery] = useState<string>('0');
  const [equipmentFurniture, setEquipmentFurniture] = useState<string>('0');
  const [equipmentTech, setEquipmentTech] = useState<string>('0');

  // Inventory
  const [inventoryStock, setInventoryStock] = useState<string>('0');
  const [inventorySupplies, setInventorySupplies] = useState<string>('0');

  // Operations
  const [opsUtilities, setOpsUtilities] = useState<string>('0');
  const [opsInsurance, setOpsInsurance] = useState<string>('0');
  const [opsMarketing, setOpsMarketing] = useState<string>('0');
  const [opsTransport, setOpsTransport] = useState<string>('0');
  const [opsOther, setOpsOther] = useState<string>('0');

  // Working Capital
  const [workingCapital, setWorkingCapital] = useState<string>('0');

  const parseNum = (val: string) => {
    const num = parseFloat(val);
    return isNaN(num) || num < 0 ? 0 : num;
  };

  const businessSetupTotal = parseNum(setupReg) + parseNum(setupLicenses) + parseNum(setupLegal);
  const premisesTotal = parseNum(premisesDeposit) + parseNum(premisesRent) + parseNum(premisesFitout);
  const equipmentTotal = parseNum(equipmentMachinery) + parseNum(equipmentFurniture) + parseNum(equipmentTech);
  const inventoryTotal = parseNum(inventoryStock) + parseNum(inventorySupplies);
  const operationsTotal = parseNum(opsUtilities) + parseNum(opsInsurance) + parseNum(opsMarketing) + parseNum(opsTransport) + parseNum(opsOther);
  const workingCapitalTotal = parseNum(workingCapital);

  const nonWorkingCapitalTotal = businessSetupTotal + premisesTotal + equipmentTotal + inventoryTotal + operationsTotal;
  const totalStartupCost = nonWorkingCapitalTotal + workingCapitalTotal;
  const workingCapitalPercentage = totalStartupCost > 0 ? (workingCapitalTotal / totalStartupCost) * 100 : 0;

  const handleReset = () => {
    setSetupReg('0');
    setSetupLicenses('0');
    setSetupLegal('0');
    setPremisesDeposit('0');
    setPremisesRent('0');
    setPremisesFitout('0');
    setEquipmentMachinery('0');
    setEquipmentFurniture('0');
    setEquipmentTech('0');
    setInventoryStock('0');
    setInventorySupplies('0');
    setOpsUtilities('0');
    setOpsInsurance('0');
    setOpsMarketing('0');
    setOpsTransport('0');
    setOpsOther('0');
    setWorkingCapital('0');
  };

  const formatFJD = (amt: number) => {
    return `FJD $${amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="bg-white border-4 border-black p-4 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-4 border-black pb-4 mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-black uppercase">Fiji Business Startup Estimator</h3>
            <p className="text-xs sm:text-sm font-bold text-gray-600 mt-1">
              Estimate initial capital requirements across setup, premises, equipment, stock, and working capital.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="bg-yellow-300 hover:bg-yellow-400 border-3 border-black px-4 py-2 font-black uppercase text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all shrink-0"
          >
            Reset Values
          </button>
        </div>

        <div className="space-y-6">
          {/* Category 1: Business Setup */}
          <div className="border-3 border-black p-4 bg-neutral-50">
            <h4 className="font-black uppercase text-sm mb-3 bg-black text-white px-2 py-1 inline-block">
              1. Business Setup & Compliance
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-black uppercase mb-1">Registration / Setup (FJD)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={setupReg}
                  onChange={(e) => setSetupReg(e.target.value)}
                  className="w-full p-2.5 border-3 border-black font-black text-base focus:outline-none focus:bg-yellow-100 bg-white"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase mb-1">Licences & Permits (FJD)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={setupLicenses}
                  onChange={(e) => setSetupLicenses(e.target.value)}
                  className="w-full p-2.5 border-3 border-black font-black text-base focus:outline-none focus:bg-yellow-100 bg-white"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase mb-1">Professional / Legal Fees (FJD)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={setupLegal}
                  onChange={(e) => setSetupLegal(e.target.value)}
                  className="w-full p-2.5 border-3 border-black font-black text-base focus:outline-none focus:bg-yellow-100 bg-white"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Category 2: Premises */}
          <div className="border-3 border-black p-4 bg-neutral-50">
            <h4 className="font-black uppercase text-sm mb-3 bg-black text-white px-2 py-1 inline-block">
              2. Premises & Commercial Property
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-black uppercase mb-1">Security Deposit (FJD)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={premisesDeposit}
                  onChange={(e) => setPremisesDeposit(e.target.value)}
                  className="w-full p-2.5 border-3 border-black font-black text-base focus:outline-none focus:bg-yellow-100 bg-white"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase mb-1">Advance Rent (FJD)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={premisesRent}
                  onChange={(e) => setPremisesRent(e.target.value)}
                  className="w-full p-2.5 border-3 border-black font-black text-base focus:outline-none focus:bg-yellow-100 bg-white"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase mb-1">Renovation / Fit-out (FJD)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={premisesFitout}
                  onChange={(e) => setPremisesFitout(e.target.value)}
                  className="w-full p-2.5 border-3 border-black font-black text-base focus:outline-none focus:bg-yellow-100 bg-white"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Category 3: Equipment */}
          <div className="border-3 border-black p-4 bg-neutral-50">
            <h4 className="font-black uppercase text-sm mb-3 bg-black text-white px-2 py-1 inline-block">
              3. Equipment & Technology
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-black uppercase mb-1">Machinery / Equipment (FJD)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={equipmentMachinery}
                  onChange={(e) => setEquipmentMachinery(e.target.value)}
                  className="w-full p-2.5 border-3 border-black font-black text-base focus:outline-none focus:bg-yellow-100 bg-white"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase mb-1">Furniture & Fixtures (FJD)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={equipmentFurniture}
                  onChange={(e) => setEquipmentFurniture(e.target.value)}
                  className="w-full p-2.5 border-3 border-black font-black text-base focus:outline-none focus:bg-yellow-100 bg-white"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase mb-1">Computer / POS / Tech (FJD)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={equipmentTech}
                  onChange={(e) => setEquipmentTech(e.target.value)}
                  className="w-full p-2.5 border-3 border-black font-black text-base focus:outline-none focus:bg-yellow-100 bg-white"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Category 4: Inventory */}
          <div className="border-3 border-black p-4 bg-neutral-50">
            <h4 className="font-black uppercase text-sm mb-3 bg-black text-white px-2 py-1 inline-block">
              4. Inventory & Supplies
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase mb-1">Initial Stock / Inventory (FJD)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={inventoryStock}
                  onChange={(e) => setInventoryStock(e.target.value)}
                  className="w-full p-2.5 border-3 border-black font-black text-base focus:outline-none focus:bg-yellow-100 bg-white"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase mb-1">Packaging / Supplies (FJD)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={inventorySupplies}
                  onChange={(e) => setInventorySupplies(e.target.value)}
                  className="w-full p-2.5 border-3 border-black font-black text-base focus:outline-none focus:bg-yellow-100 bg-white"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Category 5: Operations */}
          <div className="border-3 border-black p-4 bg-neutral-50">
            <h4 className="font-black uppercase text-sm mb-3 bg-black text-white px-2 py-1 inline-block">
              5. Operations & Launch Setup
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-black uppercase mb-1">Utilities Setup (EFL/WAF) (FJD)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={opsUtilities}
                  onChange={(e) => setOpsUtilities(e.target.value)}
                  className="w-full p-2.5 border-3 border-black font-black text-base focus:outline-none focus:bg-yellow-100 bg-white"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase mb-1">Insurance Policies (FJD)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={opsInsurance}
                  onChange={(e) => setOpsInsurance(e.target.value)}
                  className="w-full p-2.5 border-3 border-black font-black text-base focus:outline-none focus:bg-yellow-100 bg-white"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase mb-1">Marketing / Advertising (FJD)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={opsMarketing}
                  onChange={(e) => setOpsMarketing(e.target.value)}
                  className="w-full p-2.5 border-3 border-black font-black text-base focus:outline-none focus:bg-yellow-100 bg-white"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase mb-1">Transport / Delivery Setup (FJD)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={opsTransport}
                  onChange={(e) => setOpsTransport(e.target.value)}
                  className="w-full p-2.5 border-3 border-black font-black text-base focus:outline-none focus:bg-yellow-100 bg-white"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase mb-1">Other Startup Costs (FJD)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={opsOther}
                  onChange={(e) => setOpsOther(e.target.value)}
                  className="w-full p-2.5 border-3 border-black font-black text-base focus:outline-none focus:bg-yellow-100 bg-white"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Category 6: Working Capital */}
          <div className="border-3 border-black p-4 bg-yellow-50">
            <h4 className="font-black uppercase text-sm mb-3 bg-black text-white px-2 py-1 inline-block">
              6. Working Capital Reserve
            </h4>
            <div className="max-w-md">
              <label className="block text-xs font-black uppercase mb-1">Initial Cash Buffer / Working Capital (FJD)</label>
              <input
                type="number"
                min="0"
                step="any"
                value={workingCapital}
                onChange={(e) => setWorkingCapital(e.target.value)}
                className="w-full p-3 border-3 border-black font-black text-lg focus:outline-none focus:bg-yellow-200 bg-white"
                placeholder="0"
              />
              <p className="text-xs font-bold text-gray-700 mt-1">
                Recommended: 3 to 6 months of operating expenses to cover cash flow gaps.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Display */}
      <div className="border-4 border-black bg-yellow-100 p-6 space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-black bg-yellow-300 px-2 py-1 border border-black inline-block mb-1">
              Estimated Total Startup Budget
            </span>
            <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
              {formatFJD(totalStartupCost)}
            </h3>
          </div>
          <ShareResultActions
            title="Fiji Business Startup Cost Estimate"
            summary={`Fiji Business Startup Cost Estimate (ToolKitPro):
• Total Estimated Startup Cost: ${formatFJD(totalStartupCost)}
• Non-Working-Capital Startup Cost: ${formatFJD(nonWorkingCapitalTotal)}
• Working Capital Reserve: ${formatFJD(workingCapitalTotal)} (${workingCapitalPercentage.toFixed(1)}%)
• Business Setup & Compliance: ${formatFJD(businessSetupTotal)}
• Premises & Commercial Property: ${formatFJD(premisesTotal)}
• Equipment & Technology: ${formatFJD(equipmentTotal)}
• Inventory & Supplies: ${formatFJD(inventoryTotal)}
• Operations & Launch Setup: ${formatFJD(operationsTotal)}`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-white border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-xs font-black uppercase text-gray-600 block">Non-Working-Capital Cost</span>
            <span className="text-xl font-black uppercase">{formatFJD(nonWorkingCapitalTotal)}</span>
          </div>
          <div className="p-4 bg-white border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-xs font-black uppercase text-gray-600 block">Working Capital Reserve</span>
            <span className="text-xl font-black uppercase">{formatFJD(workingCapitalTotal)}</span>
          </div>
          <div className="p-4 bg-white border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-xs font-black uppercase text-gray-600 block">Working Capital Allocation</span>
            <span className="text-xl font-black uppercase">{workingCapitalPercentage.toFixed(1)}%</span>
          </div>
        </div>

        <div className="border-t-2 border-black pt-4">
          <h4 className="font-black uppercase text-sm mb-3">Category Breakdown (FJD)</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-bold">
            <div className="p-2.5 bg-white border-2 border-black">
              <span className="text-gray-600 block uppercase">Business Setup</span>
              <span className="text-sm font-black">{formatFJD(businessSetupTotal)}</span>
            </div>
            <div className="p-2.5 bg-white border-2 border-black">
              <span className="text-gray-600 block uppercase">Premises</span>
              <span className="text-sm font-black">{formatFJD(premisesTotal)}</span>
            </div>
            <div className="p-2.5 bg-white border-2 border-black">
              <span className="text-gray-600 block uppercase">Equipment</span>
              <span className="text-sm font-black">{formatFJD(equipmentTotal)}</span>
            </div>
            <div className="p-2.5 bg-white border-2 border-black">
              <span className="text-gray-600 block uppercase">Inventory</span>
              <span className="text-sm font-black">{formatFJD(inventoryTotal)}</span>
            </div>
            <div className="p-2.5 bg-white border-2 border-black">
              <span className="text-gray-600 block uppercase">Operations</span>
              <span className="text-sm font-black">{formatFJD(operationsTotal)}</span>
            </div>
            <div className="p-2.5 bg-white border-2 border-black">
              <span className="text-gray-600 block uppercase">Working Capital</span>
              <span className="text-sm font-black">{formatFJD(workingCapitalTotal)}</span>
            </div>
          </div>
        </div>

        <p className="text-xs font-bold text-black border-t-2 border-black pt-3">
          Disclaimer: This calculator provides an initial budgetary estimate for launching a business venture in Fiji. Actual expenses vary based on business sector, municipal council licensing, commercial real estate location, and supplier pricing.
        </p>
      </div>
    </div>
  );
}
