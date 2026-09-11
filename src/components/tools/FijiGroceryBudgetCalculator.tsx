import { useState } from 'react';
import { Salad, Wheat, Utensils, Coffee } from 'lucide-react';

export default function FijiGroceryBudgetCalculator() {
  const [familySize, setFamilySize] = useState<string>('4');
  const [weeklyBudget, setWeeklyBudget] = useState<string>('150');
  const [loading, setLoading] = useState<boolean>(false);

  const calculate = () => {
    const size = parseFloat(familySize) || 1;
    const weekly = parseFloat(weeklyBudget) || 0;

    const monthlyBudget = weekly * 4.333;
    const annualBudget = weekly * 52;

    // Fiji local staple breakdown suggestion
    const produce = weekly * 0.25; // Dalo, Cassava, local vegetables (Rourou, Bele, Eggplants)
    const grains = weekly * 0.25; // Rice, Flour, Noodles, Sugar, Oil
    const proteins = weekly * 0.30; // Fish, Chicken, Canned Tuna / Mackerel, Lamb, Eggs, Milk
    const pantryEssentials = weekly * 0.20; // Tea, Spices, Soap, Toiletries, Matches

    return {
      monthlyBudget,
      annualBudget,
      size,
      produce,
      grains,
      proteins,
      pantryEssentials,
      perPersonWeekly: weekly / size
    };
  };

  const results = calculate();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="border-4 border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-black uppercase mb-4 border-b-2 border-black pb-2">Family Grocery Budgeting Tool</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-black uppercase mb-1">Family Size (Persons)</label>
            <input
              type="number"
              value={familySize}
              onChange={(e) => setFamilySize(e.target.value)}
              min="1"
              className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-101 bg-white"
              placeholder="4"
            />
          </div>
          <div>
            <label className="block text-sm font-black uppercase mb-1">Weekly Grocery Budget (FJD)</label>
            <input
              type="number"
              value={weeklyBudget}
              onChange={(e) => setWeeklyBudget(e.target.value)}
              min="1"
              className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-101 bg-white"
              placeholder="150"
            />
          </div>
        </div>

        <button
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 200);
          }}
          className="w-full py-4 bg-black text-white font-black uppercase text-xl shadow-[6px_6px_0px_0px_rgba(251,191,36,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
        >
          {loading ? 'Analyzing Budget Portions...' : 'Analyze Grocery Budget'}
        </button>
      </div>

      {results && (
        <div className="border-4 border-black bg-yellow-100 p-6 space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-black uppercase text-gray-600 block">Monthly Allocation</span>
              <span className="text-3xl sm:text-4xl font-black text-black">
                FJD ${results.monthlyBudget.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className="text-sm font-black uppercase text-gray-600 block">Annual Spend Projection</span>
              <span className="text-3xl sm:text-4xl font-black text-emerald-800">
                FJD ${results.annualBudget.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>

          <div className="border-t-4 border-black pt-4 space-y-3">
            <h4 className="font-black uppercase text-sm mb-3">Suggested Weekly Staple Breakdown (In FJD)</h4>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center font-bold text-sm bg-white p-2 border-2 border-black">
                <span className="flex items-center gap-2">
                  <Salad className="w-4 h-4 stroke-[2.5]" />
                  <span>Roots & Fresh Greens (25%)</span>
                </span>
                <span>FJD ${results.produce.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-gray-600 font-bold pl-2">Dalo, Cassava, Bele, Rourou, Tomatoes, Eggplants & Bananas bought from Suva or Lautoka municipal markets.</p>

              <div className="flex justify-between items-center font-bold text-sm bg-white p-2 border-2 border-black">
                <span className="flex items-center gap-2">
                  <Wheat className="w-4 h-4 stroke-[2.5]" />
                  <span>Staple Grains & Cooking Oils (25%)</span>
                </span>
                <span>FJD ${results.grains.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-gray-600 font-bold pl-2">Rice, Punjas flour, Punjas oil, sugar, dry noodles, yeast, and salt.</p>

              <div className="flex justify-between items-center font-bold text-sm bg-white p-2 border-2 border-black">
                <span className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 stroke-[2.5]" />
                  <span>Proteins, Seafood & Canned Goods (30%)</span>
                </span>
                <span>FJD ${results.proteins.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-gray-600 font-bold pl-2">Fresh reef fish, chicken, canned corned beef, canned mackerel, eggs, and milk.</p>

              <div className="flex justify-between items-center font-bold text-sm bg-white p-2 border-2 border-black">
                <span className="flex items-center gap-2">
                  <Coffee className="w-4 h-4 stroke-[2.5]" />
                  <span>Beverages & Household Essentials (20%)</span>
                </span>
                <span>FJD ${results.pantryEssentials.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-gray-600 font-bold pl-2">Fiji tea, coffee, morning glory biscuits, spices, washing soap, toothpaste.</p>
            </div>
          </div>

          <div className="text-center text-xs font-bold text-gray-600 pt-2 border-t border-black">
            That is about <strong className="text-black text-sm">FJD ${results.perPersonWeekly.toFixed(2)}</strong> weekly spend per family member.
          </div>
        </div>
      )}
    </div>
  );
}
