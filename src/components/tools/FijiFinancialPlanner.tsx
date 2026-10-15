import { useState, useMemo } from 'react';
import ShareResultActions from '../ShareResultActions';
import { Link } from 'react-router-dom';

interface BudgetState {
  // Income
  grossSalary: string;
  payFrequency: 'fortnightly' | 'monthly' | 'weekly' | 'annual';
  fnpfRate: number; // default 8%
  otherIncome: string; // side business, rental, remittances, allowances

  // Housing & Utilities
  housingCost: string; // rent or mortgage
  electricityBill: string; // EFL
  waterBill: string; // WAF
  phoneInternet: string; // Vodafone / Digicel / TFL
  councilRates: string; // municipal rates / housing repairs

  // Living & Food
  groceriesSupermarket: string;
  marketProduce: string; // Municipal market (fruits, veg, root crops, seafood)
  diningOut: string;

  // Transport
  transportPublic: string; // Bus, taxi, minibus
  vehicleFuelMaint: string; // Fuel, servicing, LTA fees, insurance

  // Cultural & Family Obligations
  culturalChurchGiving: string; // Soli, church, reguregu, village, family assistance

  // Health, Education & Personal
  educationCosts: string; // School fees, uniforms, stationery
  medicalCare: string; // Clinics, chemist, dental
  personalMisc: string; // Clothing, entertainment, personal items

  // Debt Payments
  bankLoans: string; // BSP, ANZ, Westpac, HFC, Bred Bank personal/auto loans
  hirePurchase: string; // Courts, Vinod Patel, Carpenters
  creditCards: string; // Credit card monthly payments
  studentLoanTsls: string; // TSLS tertiary repayments

  // Savings & Investments
  emergencyFundMonthly: string;
  voluntaryFnpfOrUtof: string; // Additional FNPF or Unit Trust of Fiji (UTOF)
  otherSavings: string; // Term deposit, savings account

  // Current Savings Balance (for emergency runway calculation)
  existingSavingsBalance: string;
}

const PRESET_PROFILES: Record<string, Partial<BudgetState>> = {
  suvaProfessional: {
    grossSalary: '38000',
    payFrequency: 'annual',
    fnpfRate: 8,
    otherIncome: '200',
    housingCost: '750',
    electricityBill: '120',
    waterBill: '25',
    phoneInternet: '90',
    councilRates: '0',
    groceriesSupermarket: '350',
    marketProduce: '120',
    diningOut: '100',
    transportPublic: '120',
    vehicleFuelMaint: '0',
    culturalChurchGiving: '100',
    educationCosts: '0',
    medicalCare: '40',
    personalMisc: '120',
    bankLoans: '180',
    hirePurchase: '80',
    creditCards: '0',
    studentLoanTsls: '0',
    emergencyFundMonthly: '200',
    voluntaryFnpfOrUtof: '100',
    otherSavings: '100',
    existingSavingsBalance: '2500',
  },
  fijiFamily: {
    grossSalary: '62000',
    payFrequency: 'annual',
    fnpfRate: 8,
    otherIncome: '400',
    housingCost: '1200',
    electricityBill: '220',
    waterBill: '45',
    phoneInternet: '150',
    councilRates: '50',
    groceriesSupermarket: '650',
    marketProduce: '250',
    diningOut: '150',
    transportPublic: '80',
    vehicleFuelMaint: '320',
    culturalChurchGiving: '250',
    educationCosts: '180',
    medicalCare: '90',
    personalMisc: '160',
    bankLoans: '450',
    hirePurchase: '120',
    creditCards: '80',
    studentLoanTsls: '0',
    emergencyFundMonthly: '300',
    voluntaryFnpfOrUtof: '150',
    otherSavings: '150',
    existingSavingsBalance: '5000',
  },
  civilServant: {
    grossSalary: '28000',
    payFrequency: 'annual',
    fnpfRate: 8,
    otherIncome: '0',
    housingCost: '500',
    electricityBill: '95',
    waterBill: '20',
    phoneInternet: '75',
    councilRates: '0',
    groceriesSupermarket: '280',
    marketProduce: '100',
    diningOut: '50',
    transportPublic: '90',
    vehicleFuelMaint: '0',
    culturalChurchGiving: '90',
    educationCosts: '60',
    medicalCare: '30',
    personalMisc: '80',
    bankLoans: '120',
    hirePurchase: '60',
    creditCards: '0',
    studentLoanTsls: '0',
    emergencyFundMonthly: '120',
    voluntaryFnpfOrUtof: '50',
    otherSavings: '50',
    existingSavingsBalance: '1200',
  },
};

const INITIAL_BUDGET: BudgetState = {
  grossSalary: '36000',
  payFrequency: 'annual',
  fnpfRate: 8,
  otherIncome: '0',
  housingCost: '700',
  electricityBill: '110',
  waterBill: '25',
  phoneInternet: '80',
  councilRates: '0',
  groceriesSupermarket: '320',
  marketProduce: '110',
  diningOut: '80',
  transportPublic: '100',
  vehicleFuelMaint: '150',
  culturalChurchGiving: '120',
  educationCosts: '50',
  medicalCare: '35',
  personalMisc: '100',
  bankLoans: '200',
  hirePurchase: '80',
  creditCards: '0',
  studentLoanTsls: '0',
  emergencyFundMonthly: '150',
  voluntaryFnpfOrUtof: '100',
  otherSavings: '50',
  existingSavingsBalance: '2000',
};

export default function FijiFinancialPlanner() {
  const [budget, setBudget] = useState<BudgetState>(INITIAL_BUDGET);
  const [displayView, setDisplayView] = useState<'monthly' | 'fortnightly' | 'weekly' | 'annual'>('monthly');
  const [activeTab, setActiveTab] = useState<'income' | 'housing' | 'living' | 'debts' | 'savings'>('income');
  const [copiedNotification, setCopiedNotification] = useState(false);

  const parseNum = (val: string): number => {
    const num = parseFloat(val);
    return isNaN(num) || num < 0 ? 0 : num;
  };

  const handleInputChange = (field: keyof BudgetState, value: string | number) => {
    setBudget((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const loadPreset = (presetKey: string) => {
    if (PRESET_PROFILES[presetKey]) {
      setBudget((prev) => ({
        ...prev,
        ...PRESET_PROFILES[presetKey],
      }));
    }
  };

  const handleReset = () => {
    setBudget({
      grossSalary: '0',
      payFrequency: 'annual',
      fnpfRate: 8,
      otherIncome: '0',
      housingCost: '0',
      electricityBill: '0',
      waterBill: '0',
      phoneInternet: '0',
      councilRates: '0',
      groceriesSupermarket: '0',
      marketProduce: '0',
      diningOut: '0',
      transportPublic: '0',
      vehicleFuelMaint: '0',
      culturalChurchGiving: '0',
      educationCosts: '0',
      medicalCare: '0',
      personalMisc: '0',
      bankLoans: '0',
      hirePurchase: '0',
      creditCards: '0',
      studentLoanTsls: '0',
      emergencyFundMonthly: '0',
      voluntaryFnpfOrUtof: '0',
      otherSavings: '0',
      existingSavingsBalance: '0',
    });
  };

  // Calculations
  const calculations = useMemo(() => {
    const rawGross = parseNum(budget.grossSalary);
    let annualGross = rawGross;

    if (budget.payFrequency === 'monthly') {
      annualGross = rawGross * 12;
    } else if (budget.payFrequency === 'fortnightly') {
      annualGross = rawGross * 26;
    } else if (budget.payFrequency === 'weekly') {
      annualGross = rawGross * 52;
    } else if (budget.payFrequency === 'annual') {
      annualGross = rawGross;
    }

    // Fiji FNPF Employee statutory contribution (standard 8%)
    const annualFnpf = annualGross * (budget.fnpfRate / 100);

    // Chargeable Income = Gross Salary - Employee FNPF (fully deductible under FRCS regulations)
    const chargeableIncome = Math.max(0, annualGross - annualFnpf);

    // Fiji PAYE Income Tax brackets (FRCS Standard Resident Individual)
    // 0 to $30,000 -> 0%
    // $30,001 to $50,000 -> 18% of excess over $30,000
    // $50,001+ -> $3,600 + 20% of excess over $50,000
    let annualPaye = 0;
    if (chargeableIncome > 50000) {
      annualPaye = 3600 + (chargeableIncome - 50000) * 0.20;
    } else if (chargeableIncome > 30000) {
      annualPaye = (chargeableIncome - 30000) * 0.18;
    }

    const annualNetSalary = annualGross - annualFnpf - annualPaye;
    const annualOtherIncome = parseNum(budget.otherIncome) * 12;
    const annualTotalGross = annualGross + annualOtherIncome;
    const annualTotalNetIncome = annualNetSalary + annualOtherIncome;

    const monthlyGrossSalary = annualGross / 12;
    const monthlyFnpf = annualFnpf / 12;
    const monthlyPaye = annualPaye / 12;
    const monthlyNetSalary = annualNetSalary / 12;
    const monthlyOtherIncome = parseNum(budget.otherIncome);
    const totalMonthlyNetIncome = annualTotalNetIncome / 12;

    // Monthly Expense Group Totals (all budget expense fields are monthly)
    const monthlyHousing =
      parseNum(budget.housingCost) +
      parseNum(budget.electricityBill) +
      parseNum(budget.waterBill) +
      parseNum(budget.phoneInternet) +
      parseNum(budget.councilRates);

    const monthlyFood =
      parseNum(budget.groceriesSupermarket) +
      parseNum(budget.marketProduce) +
      parseNum(budget.diningOut);

    const monthlyTransport =
      parseNum(budget.transportPublic) +
      parseNum(budget.vehicleFuelMaint);

    const monthlyCultural = parseNum(budget.culturalChurchGiving);

    const monthlyPersonal =
      parseNum(budget.educationCosts) +
      parseNum(budget.medicalCare) +
      parseNum(budget.personalMisc);

    const totalMonthlyLivingExpenses =
      monthlyHousing + monthlyFood + monthlyTransport + monthlyCultural + monthlyPersonal;

    // Monthly Debt Servicing
    const totalMonthlyDebt =
      parseNum(budget.bankLoans) +
      parseNum(budget.hirePurchase) +
      parseNum(budget.creditCards) +
      parseNum(budget.studentLoanTsls);

    // Monthly Savings & Investments
    const totalMonthlySavings =
      parseNum(budget.emergencyFundMonthly) +
      parseNum(budget.voluntaryFnpfOrUtof) +
      parseNum(budget.otherSavings);

    // Total Monthly Outflows (Expenses + Debts + Savings)
    const totalMonthlyOutflow = totalMonthlyLivingExpenses + totalMonthlyDebt + totalMonthlySavings;

    // Net Free Cash Flow / Discretionary Buffer (after living expenses, debts, and savings)
    const monthlyDiscretionaryBuffer = totalMonthlyNetIncome - totalMonthlyOutflow;

    // Unallocated Cash flow (income minus living expenses and debts, before savings allocation)
    const unallocatedCashFlow = totalMonthlyNetIncome - (totalMonthlyLivingExpenses + totalMonthlyDebt);

    // Ratios & Financial Health Benchmarks
    const housingRatio = totalMonthlyNetIncome > 0 ? (monthlyHousing / totalMonthlyNetIncome) * 100 : 0;
    const debtToIncomeRatio = totalMonthlyNetIncome > 0 ? (totalMonthlyDebt / totalMonthlyNetIncome) * 100 : 0;
    const savingsRate = totalMonthlyNetIncome > 0 ? (totalMonthlySavings / totalMonthlyNetIncome) * 100 : 0;

    // Emergency runway
    const currentSavings = parseNum(budget.existingSavingsBalance);
    const essentialMonthlyExpenses = monthlyHousing + (parseNum(budget.groceriesSupermarket) + parseNum(budget.marketProduce)) + monthlyTransport + totalMonthlyDebt;
    const emergencyRunwayMonths = essentialMonthlyExpenses > 0 ? currentSavings / essentialMonthlyExpenses : 0;

    // Divisor for display frequency
    const getDivisor = (freq: 'monthly' | 'fortnightly' | 'weekly' | 'annual') => {
      switch (freq) {
        case 'weekly':
          return 52;
        case 'fortnightly':
          return 26;
        case 'annual':
          return 1;
        case 'monthly':
        default:
          return 12;
      }
    };

    const divisor = getDivisor(displayView);

    // Annualized expense equivalents for consistent display scaling
    const annualLivingExpenses = totalMonthlyLivingExpenses * 12;
    const annualHousing = monthlyHousing * 12;
    const annualFood = monthlyFood * 12;
    const annualTransport = monthlyTransport * 12;
    const annualCultural = monthlyCultural * 12;
    const annualPersonal = monthlyPersonal * 12;
    const annualDebt = totalMonthlyDebt * 12;
    const annualSavings = totalMonthlySavings * 12;
    const annualDiscretionaryBuffer = monthlyDiscretionaryBuffer * 12;

    return {
      annualGross,
      annualFnpf,
      annualPaye,
      annualNetSalary,
      monthlyGrossSalary,
      monthlyFnpf,
      monthlyPaye,
      monthlyNetSalary,
      monthlyOtherIncome,
      totalMonthlyNetIncome,

      monthlyHousing,
      monthlyFood,
      monthlyTransport,
      monthlyCultural,
      monthlyPersonal,
      totalMonthlyLivingExpenses,
      totalMonthlyDebt,
      totalMonthlySavings,
      totalMonthlyOutflow,
      monthlyDiscretionaryBuffer,
      unallocatedCashFlow,

      housingRatio,
      debtToIncomeRatio,
      savingsRate,
      emergencyRunwayMonths,
      essentialMonthlyExpenses,

      // Scaled by selected display view
      displayNetIncome: annualTotalNetIncome / divisor,
      displayGrossIncome: annualTotalGross / divisor,
      displayFnpf: annualFnpf / divisor,
      displayPaye: annualPaye / divisor,
      displayLivingExpenses: annualLivingExpenses / divisor,
      displayHousing: annualHousing / divisor,
      displayFood: annualFood / divisor,
      displayTransport: annualTransport / divisor,
      displayCultural: annualCultural / divisor,
      displayPersonal: annualPersonal / divisor,
      displayDebt: annualDebt / divisor,
      displaySavings: annualSavings / divisor,
      displayBuffer: annualDiscretionaryBuffer / divisor,
    };
  }, [budget, displayView]);

  const formatFJD = (amt: number): string => {
    return `FJD $${amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleCopySummary = () => {
    const summaryText = `ToolKitPro Fiji Financial Planner Summary
----------------------------------------
Pay Frequency: ${budget.payFrequency.toUpperCase()}
View Mode: ${displayView.toUpperCase()}
Total Net Take-Home Income: ${formatFJD(calculations.displayNetIncome)}
- Gross Salary: ${formatFJD(calculations.displayGrossIncome)}
- FNPF Contribution (8%): ${formatFJD(calculations.displayFnpf)}
- FRCS PAYE Tax: ${formatFJD(calculations.displayPaye)}

Total Living Expenses: ${formatFJD(calculations.displayLivingExpenses)}
- Housing & Utilities: ${formatFJD(calculations.displayHousing)}
- Food & Groceries: ${formatFJD(calculations.displayFood)}
- Transport: ${formatFJD(calculations.displayTransport)}
- Cultural & Community (Soli/Church): ${formatFJD(calculations.displayCultural)}
- Education & Personal: ${formatFJD(calculations.displayPersonal)}

Total Debt Repayments: ${formatFJD(calculations.displayDebt)}
Total Planned Savings: ${formatFJD(calculations.displaySavings)}
Net Surplus / Discretionary Buffer: ${formatFJD(calculations.displayBuffer)}

Financial Health Check:
- Housing Cost Ratio: ${calculations.housingRatio.toFixed(1)}% (Target: ≤ 30%)
- Debt-to-Income (DTI): ${calculations.debtToIncomeRatio.toFixed(1)}% (Fiji Bank Target: ≤ 35%)
- Savings Rate: ${calculations.savingsRate.toFixed(1)}% (Recommended: ≥ 15%)
- Emergency Fund Runway: ${calculations.emergencyRunwayMonths.toFixed(1)} months
----------------------------------------
Generated on ToolKitPro (https://toolkitpro.app/tools/fiji-financial-planner)`;

    navigator.clipboard.writeText(summaryText).then(() => {
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 3000);
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Card */}
      <div className="bg-white border-4 border-black p-4 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-4 border-black pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl" role="img" aria-label="Fiji Flag">🇫🇯</span>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Fiji Financial Planner</h2>
            </div>
            <p className="text-xs sm:text-sm font-bold text-gray-700">
              Personal & Household Budgeting • FNPF & PAYE Modeling • Cash Flow & Debt Intelligence in FJD
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="bg-yellow-400 border-2 border-black px-3 py-1.5 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
            >
              {copiedNotification ? '✓ Copied Summary!' : '📋 Copy Summary'}
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-100 hover:bg-gray-200 border-2 border-black px-3 py-1.5 text-xs font-bold uppercase transition-all"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mb-6 p-3 bg-yellow-50 border-2 border-black">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-black uppercase text-gray-800">Quick Benchmark Profiles:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => loadPreset('suvaProfessional')}
                className="bg-white hover:bg-yellow-200 border border-black px-2.5 py-1 text-xs font-bold transition-all"
              >
                Suva Professional
              </button>
              <button
                type="button"
                onClick={() => loadPreset('fijiFamily')}
                className="bg-white hover:bg-yellow-200 border border-black px-2.5 py-1 text-xs font-bold transition-all"
              >
                Urban Family of 4
              </button>
              <button
                type="button"
                onClick={() => loadPreset('civilServant')}
                className="bg-white hover:bg-yellow-200 border border-black px-2.5 py-1 text-xs font-bold transition-all"
              >
                Civil Servant
              </button>
            </div>
          </div>
        </div>

        {/* Category Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 border-b-2 border-black pb-4 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('income')}
            className={`px-3 py-2 text-xs sm:text-sm font-black uppercase border-2 border-black text-center transition-all ${
              activeTab === 'income'
                ? 'bg-yellow-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            1. Income & Tax
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('housing')}
            className={`px-3 py-2 text-xs sm:text-sm font-black uppercase border-2 border-black text-center transition-all ${
              activeTab === 'housing'
                ? 'bg-yellow-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            2. Housing & Bills
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('living')}
            className={`px-3 py-2 text-xs sm:text-sm font-black uppercase border-2 border-black text-center transition-all ${
              activeTab === 'living'
                ? 'bg-yellow-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            3. Living & Food
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('debts')}
            className={`px-3 py-2 text-xs sm:text-sm font-black uppercase border-2 border-black text-center transition-all ${
              activeTab === 'debts'
                ? 'bg-yellow-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            4. Debts & Loans
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('savings')}
            className={`col-span-2 sm:col-span-1 px-3 py-2 text-xs sm:text-sm font-black uppercase border-2 border-black text-center transition-all ${
              activeTab === 'savings'
                ? 'bg-yellow-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            5. Savings & Goals
          </button>
        </div>

        {/* Tab 1: Income & Statutory Tax */}
        {activeTab === 'income' && (
          <div className="space-y-4">
            <div className="border-l-4 border-yellow-400 pl-3 py-1">
              <h3 className="font-black uppercase text-base">Primary Income & Statutory Deductions</h3>
              <p className="text-xs text-gray-600 font-medium">
                Models automatic FNPF employee contributions (8%) and FRCS statutory PAYE income tax brackets with the $30,000 tax-free allowance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase mb-1">
                  Gross Salary / Wages (FJD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={budget.grossSalary}
                    onChange={(e) => handleInputChange('grossSalary', e.target.value)}
                    className="w-full bg-white border-2 border-black py-2 pl-7 pr-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="36000"
                  />
                </div>
                <span className="text-[10px] text-gray-500 font-bold block mt-1">
                  Amount per {budget.payFrequency === 'annual' ? 'year' : budget.payFrequency === 'fortnightly' ? 'fortnight' : budget.payFrequency === 'weekly' ? 'week' : 'month'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-1">Pay Frequency</label>
                <select
                  value={budget.payFrequency}
                  onChange={(e) => handleInputChange('payFrequency', e.target.value as BudgetState['payFrequency'])}
                  className="w-full bg-white border-2 border-black py-2 px-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="annual">Annual Total (Per year)</option>
                  <option value="fortnightly">Fortnightly (Every 2 weeks - common in Fiji)</option>
                  <option value="monthly">Monthly (12 times per year)</option>
                  <option value="weekly">Weekly (52 weeks per year)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-1">
                  FNPF Employee Contribution Rate (%)
                </label>
                <select
                  value={budget.fnpfRate}
                  onChange={(e) => handleInputChange('fnpfRate', Number(e.target.value))}
                  className="w-full bg-white border-2 border-black py-2 px-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value={8}>8% (Standard Fiji statutory rate)</option>
                  <option value={10}>10% (Enhanced contribution)</option>
                  <option value={0}>0% (Exempt or informal earner)</option>
                </select>
                <span className="text-[10px] text-gray-500 font-bold block mt-1">
                  * Employers in Fiji legally match with minimum 7%-10% employer contribution.
                </span>
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-1">
                  Other Monthly Income (FJD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="20"
                    value={budget.otherIncome}
                    onChange={(e) => handleInputChange('otherIncome', e.target.value)}
                    className="w-full bg-white border-2 border-black py-2 pl-7 pr-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Side hustle, rental, overseas family remittances"
                  />
                </div>
                <span className="text-[10px] text-gray-500 font-bold block mt-1">
                  Side business, rental income, remittances, or allowances
                </span>
              </div>
            </div>

            {/* Income statutory summary strip */}
            <div className="bg-gray-50 border-2 border-black p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center mt-3">
              <div>
                <span className="text-[10px] font-black uppercase text-gray-500 block">Annual Gross</span>
                <span className="text-xs font-black">{formatFJD(calculations.annualGross)}</span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-gray-500 block">FNPF (8%)</span>
                <span className="text-xs font-black text-rose-600">-{formatFJD(calculations.annualFnpf)}</span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-gray-500 block">PAYE Tax</span>
                <span className="text-xs font-black text-rose-600">-{formatFJD(calculations.annualPaye)}</span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-gray-500 block">Monthly Net Take-Home</span>
                <span className="text-xs font-black text-emerald-700">{formatFJD(calculations.totalMonthlyNetIncome)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Housing & Utilities */}
        {activeTab === 'housing' && (
          <div className="space-y-4">
            <div className="border-l-4 border-yellow-400 pl-3 py-1">
              <h3 className="font-black uppercase text-base">Housing, Accommodation & Utilities</h3>
              <p className="text-xs text-gray-600 font-medium">
                Enter your typical monthly accommodation and essential utility commitments across Fiji.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase mb-1">
                  Monthly Rent or Mortgage Repayment (FJD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="25"
                    value={budget.housingCost}
                    onChange={(e) => handleInputChange('housingCost', e.target.value)}
                    className="w-full bg-white border-2 border-black py-2 pl-7 pr-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-1">
                  EFL Electricity Bill (FJD / month)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={budget.electricityBill}
                    onChange={(e) => handleInputChange('electricityBill', e.target.value)}
                    className="w-full bg-white border-2 border-black py-2 pl-7 pr-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="110"
                  />
                </div>
                <span className="text-[10px] text-gray-500 font-bold block mt-1">
                  Energy Fiji Limited (EFL) residential electricity charges
                </span>
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-1">
                  WAF Water Bill (FJD / month)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={budget.waterBill}
                    onChange={(e) => handleInputChange('waterBill', e.target.value)}
                    className="w-full bg-white border-2 border-black py-2 pl-7 pr-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="25"
                  />
                </div>
                <span className="text-[10px] text-gray-500 font-bold block mt-1">
                  Water Authority of Fiji (WAF) monthly rate
                </span>
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-1">
                  Mobile, Wi-Fi & Internet (FJD / month)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={budget.phoneInternet}
                    onChange={(e) => handleInputChange('phoneInternet', e.target.value)}
                    className="w-full bg-white border-2 border-black py-2 pl-7 pr-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="80"
                  />
                </div>
                <span className="text-[10px] text-gray-500 font-bold block mt-1">
                  Vodafone, Digicel, or Telecom Fiji broadband recharges
                </span>
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-1">
                  Council Rates & Home Maintenance (FJD / month)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={budget.councilRates}
                    onChange={(e) => handleInputChange('councilRates', e.target.value)}
                    className="w-full bg-white border-2 border-black py-2 pl-7 pr-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="0"
                  />
                </div>
                <span className="text-[10px] text-gray-500 font-bold block mt-1">
                  Suva, Lautoka, Nadi, or local town council rates and maintenance
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Living & Food */}
        {activeTab === 'living' && (
          <div className="space-y-4">
            <div className="border-l-4 border-yellow-400 pl-3 py-1">
              <h3 className="font-black uppercase text-base">Groceries, Transport & Cultural Life</h3>
              <p className="text-xs text-gray-600 font-medium">
                Include municipal market produce, public transport, vehicle costs, and traditional church or family obligations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase mb-1">
                  Supermarket Groceries (FJD / month)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="20"
                    value={budget.groceriesSupermarket}
                    onChange={(e) => handleInputChange('groceriesSupermarket', e.target.value)}
                    className="w-full bg-white border-2 border-black py-2 pl-7 pr-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="320"
                  />
                </div>
                <span className="text-[10px] text-gray-500 font-bold block mt-1">
                  Pantry staples (rice, flour, oil, canned tuna, dairy)
                </span>
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-1">
                  Municipal Market Produce & Seafood (FJD / month)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={budget.marketProduce}
                    onChange={(e) => handleInputChange('marketProduce', e.target.value)}
                    className="w-full bg-white border-2 border-black py-2 pl-7 pr-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="110"
                  />
                </div>
                <span className="text-[10px] text-gray-500 font-bold block mt-1">
                  Fresh root crops (dalo, cassava), vegetables, fruits, and seafood
                </span>
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-1">
                  Dining Out & Takeaway (FJD / month)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={budget.diningOut}
                    onChange={(e) => handleInputChange('diningOut', e.target.value)}
                    className="w-full bg-white border-2 border-black py-2 pl-7 pr-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="80"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-1">
                  Public Transport / Bus & Taxis (FJD / month)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={budget.transportPublic}
                    onChange={(e) => handleInputChange('transportPublic', e.target.value)}
                    className="w-full bg-white border-2 border-black py-2 pl-7 pr-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="100"
                  />
                </div>
                <span className="text-[10px] text-gray-500 font-bold block mt-1">
                  Vodafone eTransport bus card recharges, taxis, and minibuses
                </span>
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-1">
                  Private Vehicle Fuel & Running Costs (FJD / month)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="20"
                    value={budget.vehicleFuelMaint}
                    onChange={(e) => handleInputChange('vehicleFuelMaint', e.target.value)}
                    className="w-full bg-white border-2 border-black py-2 pl-7 pr-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="150"
                  />
                </div>
                <span className="text-[10px] text-gray-500 font-bold block mt-1">
                  Fuel, oil changes, LTA wheel tax & fitness renewal
                </span>
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-1">
                  Cultural, Church Giving & Soli (FJD / month)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={budget.culturalChurchGiving}
                    onChange={(e) => handleInputChange('culturalChurchGiving', e.target.value)}
                    className="w-full bg-white border-2 border-black py-2 pl-7 pr-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="120"
                  />
                </div>
                <span className="text-[10px] text-gray-500 font-bold block mt-1">
                  Church tithes, soli, reguregu, weddings, village assistance
                </span>
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-1">
                  Education & Children (FJD / month)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={budget.educationCosts}
                    onChange={(e) => handleInputChange('educationCosts', e.target.value)}
                    className="w-full bg-white border-2 border-black py-2 pl-7 pr-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-1">
                  Healthcare & Medical Care (FJD / month)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={budget.medicalCare}
                    onChange={(e) => handleInputChange('medicalCare', e.target.value)}
                    className="w-full bg-white border-2 border-black py-2 pl-7 pr-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="35"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Debts & Loans */}
        {activeTab === 'debts' && (
          <div className="space-y-4">
            <div className="border-l-4 border-yellow-400 pl-3 py-1">
              <h3 className="font-black uppercase text-base">Debt Servicing & Loan Commitments</h3>
              <p className="text-xs text-gray-600 font-medium">
                Include commercial bank loans, car finance, hire-purchase stores, and student loan debts.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase mb-1">
                  Bank Personal & Auto Loans (FJD / month)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="20"
                    value={budget.bankLoans}
                    onChange={(e) => handleInputChange('bankLoans', e.target.value)}
                    className="w-full bg-white border-2 border-black py-2 pl-7 pr-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="200"
                  />
                </div>
                <span className="text-[10px] text-gray-500 font-bold block mt-1">
                  BSP, ANZ, Westpac, Bred Bank, or HFC Bank personal/vehicle loans
                </span>
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-1">
                  Hire Purchase Accounts (FJD / month)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={budget.hirePurchase}
                    onChange={(e) => handleInputChange('hirePurchase', e.target.value)}
                    className="w-full bg-white border-2 border-black py-2 pl-7 pr-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="80"
                  />
                </div>
                <span className="text-[10px] text-gray-500 font-bold block mt-1">
                  Courts Fiji, Vinod Patel, or Carpenters MH installment accounts
                </span>
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-1">
                  Credit Card Minimum Repayments (FJD / month)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={budget.creditCards}
                    onChange={(e) => handleInputChange('creditCards', e.target.value)}
                    className="w-full bg-white border-2 border-black py-2 pl-7 pr-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-1">
                  TSLS / Student Loan Deductions (FJD / month)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={budget.studentLoanTsls}
                    onChange={(e) => handleInputChange('studentLoanTsls', e.target.value)}
                    className="w-full bg-white border-2 border-black py-2 pl-7 pr-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="0"
                  />
                </div>
                <span className="text-[10px] text-gray-500 font-bold block mt-1">
                  Tertiary Scholarships and Loans Service bond or repayments
                </span>
              </div>
            </div>

            {/* DTI Benchmark Alert */}
            <div className={`p-3 border-2 border-black ${
              calculations.debtToIncomeRatio > 35 ? 'bg-rose-100' : 'bg-emerald-50'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase">
                  Current Debt-to-Income (DTI): {calculations.debtToIncomeRatio.toFixed(1)}%
                </span>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 border border-black ${
                  calculations.debtToIncomeRatio <= 35 ? 'bg-emerald-300' : 'bg-rose-300'
                }`}>
                  {calculations.debtToIncomeRatio <= 35 ? 'Healthy Bank Level (≤35%)' : 'Caution: High Debt Ratio (>35%)'}
                </span>
              </div>
              <p className="text-[11px] text-gray-700 mt-1">
                Fiji commercial banks typically require total monthly loan debt service to stay under 35% of net monthly take-home salary.
              </p>
            </div>
          </div>
        )}

        {/* Tab 5: Savings & Emergency Fund */}
        {activeTab === 'savings' && (
          <div className="space-y-4">
            <div className="border-l-4 border-yellow-400 pl-3 py-1">
              <h3 className="font-black uppercase text-base">Savings, Emergency Buffer & Investments</h3>
              <p className="text-xs text-gray-600 font-medium">
                Set aside monthly savings towards building an emergency fund, voluntary FNPF superannuation, or Unit Trust of Fiji (UTOF).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase mb-1">
                  Monthly Emergency Fund Savings (FJD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="20"
                    value={budget.emergencyFundMonthly}
                    onChange={(e) => handleInputChange('emergencyFundMonthly', e.target.value)}
                    className="w-full bg-white border-2 border-black py-2 pl-7 pr-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="150"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-1">
                  Voluntary FNPF / Unit Trust of Fiji (FJD / month)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="20"
                    value={budget.voluntaryFnpfOrUtof}
                    onChange={(e) => handleInputChange('voluntaryFnpfOrUtof', e.target.value)}
                    className="w-full bg-white border-2 border-black py-2 pl-7 pr-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="100"
                  />
                </div>
                <span className="text-[10px] text-gray-500 font-bold block mt-1">
                  Additional FNPF voluntary contributions or UTOF units
                </span>
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-1">
                  Other Monthly Savings / Term Deposits (FJD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="20"
                    value={budget.otherSavings}
                    onChange={(e) => handleInputChange('otherSavings', e.target.value)}
                    className="w-full bg-white border-2 border-black py-2 pl-7 pr-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-1">
                  Current Liquid Savings / Cash Reserves (FJD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={budget.existingSavingsBalance}
                    onChange={(e) => handleInputChange('existingSavingsBalance', e.target.value)}
                    className="w-full bg-white border-2 border-black py-2 pl-7 pr-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="2000"
                  />
                </div>
                <span className="text-[10px] text-gray-500 font-bold block mt-1">
                  Total cash in bank available for unforeseen emergencies
                </span>
              </div>
            </div>

            {/* Runway card */}
            <div className="bg-yellow-50 border-2 border-black p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-black uppercase block">Emergency Runway Calculation</span>
                <p className="text-xs text-gray-700">
                  Essential monthly commitments: {formatFJD(calculations.essentialMonthlyExpenses)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-black">
                  {calculations.emergencyRunwayMonths.toFixed(1)} Months
                </span>
                <span className="text-[10px] block font-bold text-gray-600">
                  {calculations.emergencyRunwayMonths >= 3 ? '✓ Target Met (3-6 mo)' : '⚠️ Below 3 months safety target'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RESULTS & COMPREHENSIVE CASH FLOW INTELLIGENCE DASHBOARD */}
      <div className="bg-white border-4 border-black p-4 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        {/* View Toggle Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-4 border-black pb-4 mb-6">
          <div>
            <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight">Fiji Cash Flow & Budget Analysis</h3>
            <span className="text-xs font-bold text-gray-600">
              Interactive financial scorecard based on current budget parameters
            </span>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 border-2 border-black p-1">
            <span className="text-[10px] font-black uppercase px-2 text-gray-600">View By:</span>
            {(['monthly', 'fortnightly', 'weekly', 'annual'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setDisplayView(mode)}
                className={`px-2.5 py-1 text-xs font-black uppercase transition-all ${
                  displayView === mode
                    ? 'bg-yellow-400 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                    : 'hover:bg-white'
                }`}
              >
                {mode === 'fortnightly' ? 'Fortnight' : mode}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Cash Flow Big Number Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Net Income */}
          <div className="bg-yellow-50 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-xs font-black uppercase text-gray-700 block mb-1">
              Net Take-Home Pay
            </span>
            <div className="text-xl sm:text-2xl font-black text-black">
              {formatFJD(calculations.displayNetIncome)}
            </div>
            <span className="text-[10px] font-bold text-gray-600 block mt-1">
              After FNPF ({formatFJD(calculations.displayFnpf)}) & Tax ({formatFJD(calculations.displayPaye)})
            </span>
          </div>

          {/* Living Expenses */}
          <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-xs font-black uppercase text-gray-700 block mb-1">
              Living Expenses
            </span>
            <div className="text-xl sm:text-2xl font-black text-rose-600">
              {formatFJD(calculations.displayLivingExpenses)}
            </div>
            <span className="text-[10px] font-bold text-gray-600 block mt-1">
              Housing, food, utilities, transport & soli
            </span>
          </div>

          {/* Debt & Savings */}
          <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-xs font-black uppercase text-gray-700 block mb-1">
              Debts & Savings
            </span>
            <div className="text-xl sm:text-2xl font-black text-blue-600">
              {formatFJD(calculations.displayDebt + calculations.displaySavings)}
            </div>
            <span className="text-[10px] font-bold text-gray-600 block mt-1">
              Debt: {formatFJD(calculations.displayDebt)} | Save: {formatFJD(calculations.displaySavings)}
            </span>
          </div>

          {/* Discretionary Buffer Surplus / Deficit */}
          <div className={`border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
            calculations.displayBuffer >= 0 ? 'bg-emerald-100' : 'bg-rose-200'
          }`}>
            <span className="text-xs font-black uppercase text-gray-700 block mb-1">
              {calculations.displayBuffer >= 0 ? 'Net Surplus Buffer' : 'Net Budget Deficit'}
            </span>
            <div className={`text-xl sm:text-2xl font-black ${
              calculations.displayBuffer >= 0 ? 'text-emerald-800' : 'text-rose-900'
            }`}>
              {formatFJD(calculations.displayBuffer)}
            </div>
            <span className="text-[10px] font-bold block mt-1 text-gray-800">
              {calculations.displayBuffer >= 0
                ? 'Unallocated free cash flow'
                : 'Deficit! Review expenses or debts'}
            </span>
          </div>
        </div>

        {/* Visual Budget Proportional Allocation Bar */}
        <div className="mb-6 p-4 bg-gray-50 border-2 border-black">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-black">Net Income Distribution</span>
            <span className="text-xs font-bold text-gray-600">
              {calculations.totalMonthlyNetIncome > 0
                ? `${((calculations.totalMonthlyOutflow / calculations.totalMonthlyNetIncome) * 100).toFixed(1)}% Allocated`
                : '0% Allocated'}
            </span>
          </div>

          {/* Stacked Proportional Bar */}
          <div className="w-full h-8 bg-gray-200 border-2 border-black flex overflow-hidden">
            {calculations.totalMonthlyNetIncome > 0 ? (
              <>
                <div
                  style={{
                    width: `${Math.min(100, (calculations.monthlyHousing / calculations.totalMonthlyNetIncome) * 100)}%`,
                  }}
                  className="bg-sky-400 h-full border-r border-black relative group"
                  title={`Housing: ${calculations.housingRatio.toFixed(1)}%`}
                />
                <div
                  style={{
                    width: `${Math.min(100, (calculations.monthlyFood / calculations.totalMonthlyNetIncome) * 100)}%`,
                  }}
                  className="bg-amber-400 h-full border-r border-black relative group"
                  title={`Food & Groceries`}
                />
                <div
                  style={{
                    width: `${Math.min(100, ((calculations.monthlyTransport + calculations.monthlyCultural + calculations.monthlyPersonal) / calculations.totalMonthlyNetIncome) * 100)}%`,
                  }}
                  className="bg-purple-300 h-full border-r border-black relative group"
                  title={`Other Living Expenses`}
                />
                <div
                  style={{
                    width: `${Math.min(100, (calculations.totalMonthlyDebt / calculations.totalMonthlyNetIncome) * 100)}%`,
                  }}
                  className="bg-rose-400 h-full border-r border-black relative group"
                  title={`Debt Servicing: ${calculations.debtToIncomeRatio.toFixed(1)}%`}
                />
                <div
                  style={{
                    width: `${Math.min(100, (calculations.totalMonthlySavings / calculations.totalMonthlyNetIncome) * 100)}%`,
                  }}
                  className="bg-emerald-400 h-full border-r border-black relative group"
                  title={`Savings & Investments: ${calculations.savingsRate.toFixed(1)}%`}
                />
                {calculations.monthlyDiscretionaryBuffer > 0 && (
                  <div
                    style={{
                      width: `${Math.min(100, (calculations.monthlyDiscretionaryBuffer / calculations.totalMonthlyNetIncome) * 100)}%`,
                    }}
                    className="bg-yellow-300 h-full relative group"
                    title={`Unallocated Surplus`}
                  />
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">
                Enter income to view distribution bar
              </div>
            )}
          </div>

          {/* Bar Legend */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-[11px] font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-sky-400 border border-black inline-block"></span>
              <span>Housing ({calculations.housingRatio.toFixed(0)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-amber-400 border border-black inline-block"></span>
              <span>Food & Groceries ({calculations.totalMonthlyNetIncome > 0 ? ((calculations.monthlyFood / calculations.totalMonthlyNetIncome) * 100).toFixed(0) : 0}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-purple-300 border border-black inline-block"></span>
              <span>Transport/Cultural/Other ({calculations.totalMonthlyNetIncome > 0 ? (((calculations.monthlyTransport + calculations.monthlyCultural + calculations.monthlyPersonal) / calculations.totalMonthlyNetIncome) * 100).toFixed(0) : 0}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-rose-400 border border-black inline-block"></span>
              <span>Debt ({calculations.debtToIncomeRatio.toFixed(0)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-emerald-400 border border-black inline-block"></span>
              <span>Savings ({calculations.savingsRate.toFixed(0)}%)</span>
            </div>
            {calculations.monthlyDiscretionaryBuffer > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-yellow-300 border border-black inline-block"></span>
                <span>Surplus Buffer ({calculations.totalMonthlyNetIncome > 0 ? ((calculations.monthlyDiscretionaryBuffer / calculations.totalMonthlyNetIncome) * 100).toFixed(0) : 0}%)</span>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Breakdown Tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Outflow Categories Breakdown */}
          <div className="border-2 border-black p-4 bg-white">
            <h4 className="font-black uppercase text-sm border-b-2 border-black pb-2 mb-3">
              Budget Category Breakdown ({displayView.toUpperCase()})
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="font-bold text-gray-700">Housing & Utilities:</span>
                <span className="font-black">{formatFJD(calculations.displayHousing)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="font-bold text-gray-700">Food & Supermarket:</span>
                <span className="font-black">{formatFJD(calculations.displayFood)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="font-bold text-gray-700">Transport (Bus/Fuel/LTA):</span>
                <span className="font-black">{formatFJD(calculations.displayTransport)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="font-bold text-gray-700">Cultural & Soli / Church:</span>
                <span className="font-black">{formatFJD(calculations.displayCultural)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="font-bold text-gray-700">Education & Personal:</span>
                <span className="font-black">{formatFJD(calculations.displayPersonal)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black pt-1">
                <span className="font-black uppercase text-gray-900">Total Living Expenses:</span>
                <span className="font-black text-rose-600">{formatFJD(calculations.displayLivingExpenses)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="font-bold text-gray-700">Total Debt Servicing:</span>
                <span className="font-black text-rose-600">{formatFJD(calculations.displayDebt)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black">
                <span className="font-bold text-gray-700">Planned Savings / Investments:</span>
                <span className="font-black text-emerald-600">{formatFJD(calculations.displaySavings)}</span>
              </div>
              <div className="flex justify-between py-1.5 bg-yellow-100 px-2 border-2 border-black mt-2 font-black">
                <span className="uppercase">Net Free Cash Flow Surplus:</span>
                <span className={calculations.displayBuffer >= 0 ? 'text-black' : 'text-rose-700'}>
                  {formatFJD(calculations.displayBuffer)}
                </span>
              </div>
            </div>
          </div>

          {/* Fiji Financial Health Scorecard */}
          <div className="border-2 border-black p-4 bg-white flex flex-col justify-between">
            <div>
              <h4 className="font-black uppercase text-sm border-b-2 border-black pb-2 mb-3">
                Fiji Financial Health Scorecard
              </h4>
              <div className="space-y-3">
                {/* Metric 1: Housing Ratio */}
                <div className="p-2 border border-black bg-gray-50 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black block">Housing Affordability</span>
                    <span className="text-[11px] text-gray-600 font-medium">Rent/Mortgage vs Net Pay (Target: ≤ 30%)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black">{calculations.housingRatio.toFixed(1)}%</span>
                    <span className={`text-[10px] block font-black uppercase px-1.5 py-0.5 border border-black ${
                      calculations.housingRatio <= 30 ? 'bg-emerald-300' : 'bg-amber-300'
                    }`}>
                      {calculations.housingRatio <= 30 ? 'Excellent' : 'Stretch'}
                    </span>
                  </div>
                </div>

                {/* Metric 2: DTI Ratio */}
                <div className="p-2 border border-black bg-gray-50 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black block">Bank Debt-to-Income (DTI)</span>
                    <span className="text-[11px] text-gray-600 font-medium">Loans & Cards vs Net Pay (Target: ≤ 35%)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black">{calculations.debtToIncomeRatio.toFixed(1)}%</span>
                    <span className={`text-[10px] block font-black uppercase px-1.5 py-0.5 border border-black ${
                      calculations.debtToIncomeRatio <= 35 ? 'bg-emerald-300' : 'bg-rose-300'
                    }`}>
                      {calculations.debtToIncomeRatio <= 35 ? 'Bank Approved' : 'Exceeds Benchmark'}
                    </span>
                  </div>
                </div>

                {/* Metric 3: Savings Rate */}
                <div className="p-2 border border-black bg-gray-50 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black block">Net Savings Rate</span>
                    <span className="text-[11px] text-gray-600 font-medium">Dedicated Savings vs Net Pay (Target: ≥ 15%)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black">{calculations.savingsRate.toFixed(1)}%</span>
                    <span className={`text-[10px] block font-black uppercase px-1.5 py-0.5 border border-black ${
                      calculations.savingsRate >= 15 ? 'bg-emerald-300' : 'bg-amber-300'
                    }`}>
                      {calculations.savingsRate >= 15 ? 'Target Met' : 'Under 15%'}
                    </span>
                  </div>
                </div>

                {/* Metric 4: Emergency Runway */}
                <div className="p-2 border border-black bg-gray-50 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black block">Emergency Safety Buffer</span>
                    <span className="text-[11px] text-gray-600 font-medium">Months of Essential Expenses Covered</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black">{calculations.emergencyRunwayMonths.toFixed(1)} Mo</span>
                    <span className={`text-[10px] block font-black uppercase px-1.5 py-0.5 border border-black ${
                      calculations.emergencyRunwayMonths >= 3 ? 'bg-emerald-300' : 'bg-yellow-300'
                    }`}>
                      {calculations.emergencyRunwayMonths >= 3 ? 'Secure (3-6 mo)' : 'Building Up'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t-2 border-black">
              <p className="text-[11px] text-gray-600 font-medium">
                💡 <strong>Fiji Financial Rule of Thumb:</strong> Aim to divide your take-home pay roughly into 50% essential needs (shelter, groceries, transport), 30% personal & cultural obligations, and 20% debt payoff & investments.
              </p>
            </div>
          </div>
        </div>

        {/* Localized Fiji Resource Links */}
        <div className="p-4 bg-gray-100 border-2 border-black">
          <h4 className="font-black uppercase text-xs text-gray-800 mb-2">Explore Related Fiji Financial Calculators:</h4>
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <Link
              to="/tools/fiji-salary-calculator"
              className="bg-white hover:bg-yellow-200 border border-black px-2.5 py-1.5 transition-colors"
            >
              Fiji Salary & PAYE Tax Calculator →
            </Link>
            <Link
              to="/tools/fiji-fnpf-calculator"
              className="bg-white hover:bg-yellow-200 border border-black px-2.5 py-1.5 transition-colors"
            >
              Fiji FNPF Retirement Calculator →
            </Link>
            <Link
              to="/tools/fiji-loan-repayment-calculator"
              className="bg-white hover:bg-yellow-200 border border-black px-2.5 py-1.5 transition-colors"
            >
              Fiji Loan Repayment Calculator →
            </Link>
            <Link
              to="/tools/fiji-grocery-budget-calculator"
              className="bg-white hover:bg-yellow-200 border border-black px-2.5 py-1.5 transition-colors"
            >
              Fiji Grocery Budget Calculator →
            </Link>
            <Link
              to="/tools/fiji-electricity-bill-calculator"
              className="bg-white hover:bg-yellow-200 border border-black px-2.5 py-1.5 transition-colors"
            >
              Fiji EFL Electricity Calculator →
            </Link>
          </div>
        </div>

        {/* Share Result Actions Component */}
        <div className="mt-6 pt-4 border-t-4 border-black">
          <ShareResultActions
            title="Fiji Financial Planner"
            summary={`Fiji Household Budget Summary: Monthly Net Take-Home ${formatFJD(calculations.totalMonthlyNetIncome)}, Living Expenses ${formatFJD(calculations.totalMonthlyLivingExpenses)}, Debt ${formatFJD(calculations.totalMonthlyDebt)}, Net Surplus ${formatFJD(calculations.monthlyDiscretionaryBuffer)}.`}
          />
        </div>
      </div>
    </div>
  );
}
