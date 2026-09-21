import { useState } from 'react';
import { 
  GraduationCap, 
  RotateCcw, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertCircle, 
  Info, 
  Plane, 
  Building2, 
  Globe2,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { trackToolUsage } from '../../utils/analytics';

export type Mode = 'bond_service' | 'bond_buyout' | 'overseas_loan';

export interface PenaltyTier {
  category: number;
  minRemainingPct: number;
  maxRemainingPct: number;
  penaltyRate: number; // percentage (10 to 50)
  label: string;
}

// Official 9-tier penalty categories from TSLS Scholarship Policies Handbook (2026–2027)
// Enforced under the Tertiary Scholarships and Loans Service (Budget Amendment) Act 2026
export const TSLS_PENALTY_TIERS: PenaltyTier[] = [
  { category: 1, minRemainingPct: 1, maxRemainingPct: 11, penaltyRate: 10, label: '1% – 11% Remaining Service' },
  { category: 2, minRemainingPct: 12, maxRemainingPct: 22, penaltyRate: 15, label: '12% – 22% Remaining Service' },
  { category: 3, minRemainingPct: 23, maxRemainingPct: 33, penaltyRate: 20, label: '23% – 33% Remaining Service' },
  { category: 4, minRemainingPct: 34, maxRemainingPct: 44, penaltyRate: 25, label: '34% – 44% Remaining Service' },
  { category: 5, minRemainingPct: 45, maxRemainingPct: 55, penaltyRate: 30, label: '45% – 55% Remaining Service' },
  { category: 6, minRemainingPct: 56, maxRemainingPct: 66, penaltyRate: 35, label: '56% – 66% Remaining Service' },
  { category: 7, minRemainingPct: 67, maxRemainingPct: 77, penaltyRate: 40, label: '67% – 77% Remaining Service' },
  { category: 8, minRemainingPct: 78, maxRemainingPct: 88, penaltyRate: 45, label: '78% – 88% Remaining Service' },
  { category: 9, minRemainingPct: 89, maxRemainingPct: 100, penaltyRate: 50, label: '89% – 100% Remaining Service' },
];

export function getStatutoryPenaltyTier(remainingPct: number, isNonCompleter = false): {
  tier: PenaltyTier | null;
  rate: number;
  categoryNumber: number;
  description: string;
} {
  if (remainingPct <= 0) {
    return {
      tier: null,
      rate: 0,
      categoryNumber: 0,
      description: 'Bond Obligation Fully Completed (0% Penalty & $0 Clearance)',
    };
  }

  if (isNonCompleter) {
    return {
      tier: TSLS_PENALTY_TIERS[8],
      rate: 50,
      categoryNumber: 9,
      description: 'Course Termination / Non-Completer Default (Statutory 50% Maximum Penalty)',
    };
  }

  const rounded = Math.round(remainingPct);
  const matched = TSLS_PENALTY_TIERS.find(
    (t) => rounded >= t.minRemainingPct && rounded <= t.maxRemainingPct
  ) || TSLS_PENALTY_TIERS[8];

  return {
    tier: matched,
    rate: matched.penaltyRate,
    categoryNumber: matched.category,
    description: `Category ${matched.category}: ${matched.label} (${matched.penaltyRate}% Penalty)`,
  };
}

export default function FijiTslsCalculator() {
  // Mode selection:
  // 1. bond_service: Fiji Domestic Service Bond (Working in Fiji - $0 cash deduction)
  // 2. bond_buyout: Repayment in Lieu of Bond / Migration Travel Clearance
  // 3. overseas_loan: Overseas Resident Cash Repayment Plan
  const [mode, setMode] = useState<Mode>('bond_service');

  // Input states
  const [awardAmount, setAwardAmount] = useState<string>('24000'); // Total TSLS / TELS funded award
  const [studyYears, setStudyYears] = useState<string>('3'); // Duration of study in years
  const [studyScheme, setStudyScheme] = useState<'local' | 'overseas'>('local'); // Local = 1.5x multiplier, Overseas = 2.5x multiplier
  const [monthsServed, setMonthsServed] = useState<string>('18'); // Months worked in Fiji (verified via FNPF)
  
  // Clearance / Buyout specific options
  const [clearanceType, setClearanceType] = useState<'permanent_migration' | 'temporary_travel' | 'non_completer'>('permanent_migration');
  const [repaymentTermMonths, setRepaymentTermMonths] = useState<string>('24'); // Repayment schedule term in months
  const [monthlyIncome, setMonthlyIncome] = useState<string>('2500'); // Optional monthly gross salary for affordability comparison

  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Calculation logic based on verified legislation & TSLS Handbook (2026–2027)
  const calculateResults = () => {
    const award = parseFloat(awardAmount);
    const years = parseFloat(studyYears);
    const served = parseFloat(monthsServed) || 0;
    const term = parseInt(repaymentTermMonths, 10) || 1;
    const income = parseFloat(monthlyIncome) || 0;

    if (isNaN(award) || award <= 0) {
      return null;
    }

    if (mode === 'bond_service' || mode === 'bond_buyout') {
      if (isNaN(years) || years <= 0) {
        return null;
      }

      // Multiplier: 1.5 for local programs, 2.5 for overseas scholarships
      const multiplier = studyScheme === 'local' ? 1.5 : 2.5;
      const totalRequiredMonths = Math.round(years * 12 * multiplier);
      const totalRequiredYears = (totalRequiredMonths / 12).toFixed(1);

      // Clamped served months
      const safeServedMonths = Math.min(served, totalRequiredMonths);
      const remainingServiceMonths = Math.max(0, totalRequiredMonths - safeServedMonths);
      const completionPercentage = totalRequiredMonths > 0 
        ? Math.min(100, Math.round((safeServedMonths / totalRequiredMonths) * 100)) 
        : 0;
      const remainingPercentage = totalRequiredMonths > 0
        ? Math.max(0, 100 - completionPercentage)
        : 0;

      // Value of service delivered
      const deliveredValue = (safeServedMonths / totalRequiredMonths) * award;
      const baseUnservedBalance = (remainingServiceMonths / totalRequiredMonths) * award;

      // Determine Statutory Penalty under TSLS 9-tier system or Temporary Release
      let penaltyRate = 0;
      let penaltyCategory = 0;
      let penaltyDescription = '';
      let isExemptTemporaryTravel = false;

      if (mode === 'bond_buyout') {
        if (clearanceType === 'temporary_travel') {
          isExemptTemporaryTravel = true;
          penaltyRate = 0;
          penaltyCategory = 0;
          penaltyDescription = 'Temporary Travel Release (Bond remains active under registered guarantors; no buyout or penalty assessed)';
        } else if (clearanceType === 'non_completer') {
          const tierInfo = getStatutoryPenaltyTier(remainingPercentage, true);
          penaltyRate = tierInfo.rate;
          penaltyCategory = tierInfo.categoryNumber;
          penaltyDescription = tierInfo.description;
        } else {
          const tierInfo = getStatutoryPenaltyTier(remainingPercentage, false);
          penaltyRate = tierInfo.rate;
          penaltyCategory = tierInfo.categoryNumber;
          penaltyDescription = tierInfo.description;
        }
      }

      const penaltyAmount = isExemptTemporaryTravel ? 0 : baseUnservedBalance * (penaltyRate / 100);
      const totalBuyoutObligation = isExemptTemporaryTravel ? 0 : baseUnservedBalance + penaltyAmount;

      // Installment breakdown
      const monthlyPayment = term > 0 ? totalBuyoutObligation / term : totalBuyoutObligation;
      const annualPayment = monthlyPayment * 12;

      // Affordability
      const salaryPercentage = income > 0 ? (monthlyPayment / income) * 100 : null;

      return {
        award,
        years,
        multiplier,
        totalRequiredMonths,
        totalRequiredYears,
        servedMonths: safeServedMonths,
        remainingServiceMonths,
        completionPercentage,
        remainingPercentage,
        deliveredValue,
        baseUnservedBalance,
        penaltyRate,
        penaltyCategory,
        penaltyDescription,
        penaltyAmount,
        totalBuyoutObligation,
        isExemptTemporaryTravel,
        monthlyPayment,
        annualPayment,
        repaymentTermMonths: term,
        salaryPercentage,
        monthlyIncome: income,
      };
    } else {
      // Direct Overseas Cash Loan Repayment (Pre-2023 TELS Overseas Debt)
      const termMonths = term > 0 ? term : 24;
      const monthlyPayment = award / termMonths;
      const annualPayment = monthlyPayment * 12;
      const salaryPercentage = income > 0 ? (monthlyPayment / income) * 100 : null;

      return {
        award,
        totalBuyoutObligation: award,
        monthlyPayment,
        annualPayment,
        repaymentTermMonths: termMonths,
        salaryPercentage,
        monthlyIncome: income,
      };
    }
  };

  const results = calculateResults();

  const handleCopy = () => {
    if (!results) return;

    let text = '';
    if (mode === 'bond_service') {
      text = `Fiji TSLS Service Bond Summary:
• Study Scheme: ${studyScheme === 'local' ? 'Local Institution (1.5x Bond Multiplier)' : 'Overseas Scholarship (2.5x Bond Multiplier)'}
• Total Funded Award: FJD $${results.award.toLocaleString('en-US', { minimumFractionDigits: 2 })}
• Estimated Total Required Service: ${results.totalRequiredMonths} months (${results.totalRequiredYears} years)
• Service Completed (FNPF Verified): ${results.servedMonths} months (${results.completionPercentage}% fulfilled)
• Remaining Service to Fulfill: ${results.remainingServiceMonths} months (${results.remainingPercentage}% unserved)
• Estimated Monthly Cash Salary Deduction: FJD $0.00 / month (100% fulfilled through service in Fiji)
• Value of Service Delivered: FJD $${results.deliveredValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}

*Disclaimer: Educational mathematical estimate. Subject to official verification by the Tertiary Scholarships and Loans Service (TSLS) under the TSLS (Budget Amendment) Act 2026.*`;
    } else if (mode === 'bond_buyout') {
      if (results.isExemptTemporaryTravel) {
        text = `Fiji TSLS Temporary Travel Release Estimate:
• Status: Approved Temporary Travel Release (Vacation / Medical / Business)
• Original Funded Award: FJD $${results.award.toLocaleString('en-US', { minimumFractionDigits: 2 })}
• Bond Service Completed: ${results.servedMonths} of ${results.totalRequiredMonths} months (${results.completionPercentage}%)
• Clearance Buyout Amount: FJD $0.00 (No buyout required; bond remains active)
• Requirement: Must register approved guarantors on the TSLS Travel Portal before departure.

*Disclaimer: Official travel approval must be obtained from TSLS.*`;
      } else {
        text = `Fiji TSLS Repayment in Lieu of Bond (Migration / Clearance Buyout):
• Total Funded Award: FJD $${results.award.toLocaleString('en-US', { minimumFractionDigits: 2 })}
• Required Service Duration: ${results.totalRequiredMonths} months (${results.multiplier}x multiplier)
• Service Completed: ${results.servedMonths} months (${results.completionPercentage}%)
• Remaining Unserved Service: ${results.remainingServiceMonths} months (${results.remainingPercentage}%)
• Base Amount Payable in Lieu of Service: FJD $${results.baseUnservedBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
• Statutory Penalty (${results.penaltyDescription}): FJD $${results.penaltyAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
• Estimated Total Clearance Obligation: FJD $${results.totalBuyoutObligation.toLocaleString('en-US', { minimumFractionDigits: 2 })}
• Proposed Repayment Term: ${results.repaymentTermMonths} months
• Estimated Monthly Installment: FJD $${results.monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2 })} / month
• Estimated Annual Repayment: FJD $${results.annualPayment.toLocaleString('en-US', { minimumFractionDigits: 2 })}

*Disclaimer: Educational mathematical estimate based on the TSLS 9-tier penalty system (TSLS Act 2026). Official clearance must be obtained via the TSLS Travel & Bond Clearance Portal.*`;
      }
    } else {
      text = `Fiji TSLS / TELS Overseas Repayment Plan:
• Total Outstanding Balance: FJD $${results.award.toLocaleString('en-US', { minimumFractionDigits: 2 })}
• Repayment Term: ${results.repaymentTermMonths} months
• Estimated Monthly Payment: FJD $${results.monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2 })}
• Estimated Annual Payment: FJD $${results.annualPayment.toLocaleString('en-US', { minimumFractionDigits: 2 })}

*Disclaimer: Estimate only. Subject to official arrangements with TSLS / FRCS.*`;
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    trackToolUsage('fiji-tsls-calculator', 'Fiji TSLS Calculator', 'Fiji Tools', 'copy_results');
  };

  const handleReset = () => {
    setAwardAmount('24000');
    setStudyYears('3');
    setStudyScheme('local');
    setMonthsServed('18');
    setClearanceType('permanent_migration');
    setRepaymentTermMonths('24');
    setMonthlyIncome('2500');
    setError(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Disclaimer / Regulatory Status Banner */}
      <div className="border-4 border-black p-4 bg-emerald-100 flex items-start gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <Scale className="w-6 h-6 text-black shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-black">
          <p className="font-black uppercase tracking-tight mb-1">
            Official Regulatory Framework: Service Bond Conversion &amp; 2026 Budget Amendment Act
          </p>
          <p className="font-medium leading-relaxed">
            Under Fiji legislation (including the <em>Tertiary Scholarships and Loans Service (Budget Amendment) Act 2023</em> and{' '}
            <em>Act No. 25 of 2026</em>), domestic student loans were <strong>converted into service bonds</strong>. 
            Graduates working in Fiji have <strong>$0.00 cash salary deductions</strong>. 
            Financial clearance repayments and statutory penalties (the official 9-tier system ranging from 10% to 50%) 
            apply when buying out a bond for permanent migration, default, or course termination.
          </p>
        </div>
      </div>

      {/* Main Calculator Card */}
      <div className="border-4 border-black p-4 sm:p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b-4 border-black pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-yellow-400 border-2 border-black">
              <GraduationCap className="w-7 h-7 text-black" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Fiji TSLS Loan &amp; Bond Calculator</h2>
              <p className="text-xs sm:text-sm font-bold text-gray-700">Official 2026–2027 statutory rules &bull; 9-tier penalty schedule &bull; Bond tracker</p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={handleReset}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-200 border-2 border-black font-black text-xs uppercase hover:bg-neutral-300 active:translate-x-0.5 active:translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            {results && (
              <button
                onClick={handleCopy}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-yellow-400 border-2 border-black font-black text-xs uppercase hover:bg-yellow-300 active:translate-x-0.5 active:translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-800" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Summary'}
              </button>
            )}
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="mb-6">
          <label className="block text-xs font-black uppercase mb-2">Select Your Scenario</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => { setMode('bond_service'); setError(null); }}
              className={`p-3 text-left border-3 border-black font-black text-xs sm:text-sm uppercase transition-all flex items-start gap-2 ${
                mode === 'bond_service'
                  ? 'bg-yellow-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
              }`}
            >
              <Building2 className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <div>Working in Fiji</div>
                <div className="text-[10px] font-bold opacity-80 normal-case">Service Bond ($0.00 Salary Deductions)</div>
              </div>
            </button>

            <button
              onClick={() => { setMode('bond_buyout'); setError(null); }}
              className={`p-3 text-left border-3 border-black font-black text-xs sm:text-sm uppercase transition-all flex items-start gap-2 ${
                mode === 'bond_buyout'
                  ? 'bg-yellow-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
              }`}
            >
              <Plane className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <div>Bond Buyout / Clearance</div>
                <div className="text-[10px] font-bold opacity-80 normal-case">Repay in Lieu &bull; 9-Tier Penalty Calculator</div>
              </div>
            </button>

            <button
              onClick={() => { setMode('overseas_loan'); setError(null); }}
              className={`p-3 text-left border-3 border-black font-black text-xs sm:text-sm uppercase transition-all flex items-start gap-2 ${
                mode === 'overseas_loan'
                  ? 'bg-yellow-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
              }`}
            >
              <Globe2 className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <div>Overseas Repayment</div>
                <div className="text-[10px] font-bold opacity-80 normal-case">Pre-2023 TELS Overseas Debt Plan</div>
              </div>
            </button>
          </div>
        </div>

        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Column 1: Financial & Award Details */}
          <div className="space-y-4">
            <h3 className="font-black uppercase text-xs bg-black text-white px-2.5 py-1 inline-block">
              1. Award / Study Details
            </h3>

            <div>
              <label className="block text-xs font-black uppercase mb-1">
                Total Original Funded Award (FJD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 font-black text-base">$</span>
                <input
                  type="number"
                  min="1"
                  step="100"
                  value={awardAmount}
                  onChange={(e) => { setAwardAmount(e.target.value); setError(null); }}
                  placeholder="24000"
                  className="w-full pl-8 pr-3 py-2.5 border-3 border-black font-black text-base focus:bg-yellow-50 focus:outline-none"
                />
              </div>
              <p className="text-[11px] font-bold text-gray-600 mt-1">
                Total tuition + allowances funded by TSLS / former TELS scheme.
              </p>
            </div>

            {mode !== 'overseas_loan' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase mb-1">
                    Study Duration (Years)
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    max="10"
                    value={studyYears}
                    onChange={(e) => { setStudyYears(e.target.value); setError(null); }}
                    placeholder="3"
                    className="w-full p-2.5 border-3 border-black font-black text-base focus:bg-yellow-50 focus:outline-none"
                  />
                  <p className="text-[11px] font-bold text-gray-600 mt-1">E.g. 3 years for Bachelor degree.</p>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase mb-1">
                    Scholarship Scheme
                  </label>
                  <select
                    value={studyScheme}
                    onChange={(e) => setStudyScheme(e.target.value as 'local' | 'overseas')}
                    className="w-full p-2.5 border-3 border-black font-black text-sm focus:bg-yellow-50 focus:outline-none bg-white"
                  >
                    <option value="local">Local Study (1.5x Bond Multiplier)</option>
                    <option value="overseas">Overseas Study (2.5x Bond Multiplier)</option>
                  </select>
                  <p className="text-[11px] font-bold text-gray-600 mt-1">
                    {studyScheme === 'local' ? '1.5 × study duration (Local)' : '2.5 × study duration (Overseas)'}
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-black uppercase mb-1">
                Your Gross Monthly Income (Optional FJD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 font-black text-base">$</span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  placeholder="2500"
                  className="w-full pl-8 pr-3 py-2.5 border-3 border-black font-black text-base focus:bg-yellow-50 focus:outline-none"
                />
              </div>
              <p className="text-[11px] font-bold text-gray-600 mt-1">
                Used to calculate installment affordability as a % of your salary.
              </p>
            </div>
          </div>

          {/* Column 2: Service & Repayment Terms */}
          <div className="space-y-4">
            <h3 className="font-black uppercase text-xs bg-black text-white px-2.5 py-1 inline-block">
              2. Service &amp; Repayment Options
            </h3>

            {mode !== 'overseas_loan' ? (
              <>
                <div>
                  <label className="block text-xs font-black uppercase mb-1">
                    Months Served in Fiji (Employment)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={monthsServed}
                    onChange={(e) => { setMonthsServed(e.target.value); setError(null); }}
                    placeholder="18"
                    className="w-full p-2.5 border-3 border-black font-black text-base focus:bg-yellow-50 focus:outline-none"
                  />
                  <p className="text-[11px] font-bold text-gray-600 mt-1">
                    Verified employment months logged in Fiji (via FNPF / TSLS records).
                  </p>
                </div>

                {mode === 'bond_buyout' && (
                  <>
                    <div>
                      <label className="block text-xs font-black uppercase mb-1">
                        Clearance &amp; Release Type
                      </label>
                      <select
                        value={clearanceType}
                        onChange={(e) => setClearanceType(e.target.value as 'permanent_migration' | 'temporary_travel' | 'non_completer')}
                        className="w-full p-2.5 border-3 border-black font-black text-sm focus:bg-yellow-50 focus:outline-none bg-white"
                      >
                        <option value="permanent_migration">Permanent Migration / Early Buyout (Official 9-Tier Penalty Scale)</option>
                        <option value="temporary_travel">Approved Temporary Travel (Holiday / Medical / Business with Guarantors)</option>
                        <option value="non_completer">Course Termination / Non-Completer (Statutory 50% Maximum Penalty)</option>
                      </select>
                      <p className="text-[11px] font-bold text-gray-600 mt-1">
                        {clearanceType === 'permanent_migration' && 'Statutory penalty tier is automatically calculated from remaining unserved bond.'}
                        {clearanceType === 'temporary_travel' && 'No cash buyout or penalty required; bond remains active under registered guarantors.'}
                        {clearanceType === 'non_completer' && 'Under TSLS rules, students who drop out or fail to finish face a statutory 50% penalty.'}
                      </p>
                    </div>

                    {clearanceType !== 'temporary_travel' && (
                      <div>
                        <label className="block text-xs font-black uppercase mb-1">
                          Proposed Installment Term
                        </label>
                        <select
                          value={repaymentTermMonths}
                          onChange={(e) => setRepaymentTermMonths(e.target.value)}
                          className="w-full p-2.5 border-3 border-black font-black text-sm focus:bg-yellow-50 focus:outline-none bg-white"
                        >
                          <option value="1">Lump Sum Settlement (1 Payment)</option>
                          <option value="12">12 Months (1 Year Plan)</option>
                          <option value="24">24 Months (2 Year Plan)</option>
                          <option value="36">36 Months (3 Year Plan)</option>
                          <option value="60">60 Months (5 Year Plan)</option>
                        </select>
                        <p className="text-[11px] font-bold text-gray-600 mt-1">
                          Installment term for clearance repayment schedule.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <div>
                <label className="block text-xs font-black uppercase mb-1">
                  Repayment Schedule Term
                </label>
                <select
                  value={repaymentTermMonths}
                  onChange={(e) => setRepaymentTermMonths(e.target.value)}
                  className="w-full p-2.5 border-3 border-black font-black text-sm focus:bg-yellow-50 focus:outline-none bg-white"
                >
                  <option value="12">12 Months (1 Year)</option>
                  <option value="24">24 Months (2 Years)</option>
                  <option value="36">36 Months (3 Years)</option>
                  <option value="60">60 Months (5 Years)</option>
                  <option value="120">120 Months (10 Years)</option>
                </select>
                <p className="text-[11px] font-bold text-gray-600 mt-1">
                  Amortized cash repayment agreement with FRCS / TSLS.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Validation Error Message */}
        {error && (
          <div className="p-3 bg-red-100 border-2 border-black mb-6 flex items-center gap-2 text-xs font-black text-red-900">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Results Card */}
        {results ? (
          <div className="space-y-6 pt-4 border-t-4 border-black">
            {/* Primary Headline Result */}
            {mode === 'bond_service' ? (
              <div className="p-5 sm:p-6 bg-emerald-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider bg-black text-white px-2 py-0.5">
                      Estimated Monthly Cash Deduction
                    </span>
                    <div className="text-3xl sm:text-5xl font-black mt-1">FJD $0.00 / month</div>
                    <p className="text-xs sm:text-sm font-bold text-neutral-900 mt-1">
                      No monetary deduction. Your bond is fulfilled 100% through verified employment in Fiji.
                    </p>
                  </div>
                  <div className="text-right border-l-0 sm:border-l-2 sm:border-black sm:pl-6">
                    <span className="text-xs font-black uppercase text-neutral-900">Bond Service Progress</span>
                    <div className="text-2xl sm:text-3xl font-black">{results.completionPercentage}%</div>
                    <span className="text-xs font-bold">{results.servedMonths} / {results.totalRequiredMonths} Months</span>
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="mt-4 pt-3 border-t-2 border-black">
                  <div className="w-full bg-white h-4 border-2 border-black overflow-hidden">
                    <div
                      className="bg-black h-full transition-all duration-500"
                      style={{ width: `${results.completionPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-black uppercase mt-1">
                    <span>0 Mos</span>
                    <span>{results.servedMonths} Months Served</span>
                    <span>{results.totalRequiredMonths} Months Total</span>
                  </div>
                </div>
              </div>
            ) : mode === 'bond_buyout' ? (
              <div className="p-5 sm:p-6 bg-yellow-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {results.isExemptTemporaryTravel ? (
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider bg-black text-white px-2 py-0.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Approved Temporary Travel Release
                    </div>
                    <div className="text-3xl sm:text-4xl font-black mt-1">FJD $0.00 Buyout Required</div>
                    <p className="text-xs sm:text-sm font-bold text-neutral-900">
                      Under TSLS rules, graduates approved for temporary travel (vacations, short-term training, medical trips) 
                      are <strong>not required to buy out their bond</strong>. Your bond service remains active and you must 
                      register approved guarantors on the TSLS Portal before departing Fiji.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider bg-black text-white px-2 py-0.5">
                        {results.repaymentTermMonths === 1 ? 'Estimated Total Buyout Lump Sum' : 'Estimated Monthly Installment'}
                      </span>
                      <div className="text-3xl sm:text-5xl font-black mt-1">
                        FJD ${results.monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        {results.repaymentTermMonths > 1 && <span className="text-base font-bold"> / mo</span>}
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-neutral-900 mt-1">
                        Estimated Total Clearance Obligation: <strong>FJD ${results.totalBuyoutObligation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                        {results.penaltyRate > 0 && ` (includes ${results.penaltyRate}% statutory penalty: FJD $${results.penaltyAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`}
                      </p>
                    </div>
                    {results.salaryPercentage !== null && results.monthlyIncome > 0 && (
                      <div className="text-left sm:text-right border-l-0 sm:border-l-2 sm:border-black sm:pl-6">
                        <span className="text-xs font-black uppercase text-neutral-900">% of Monthly Income</span>
                        <div className="text-2xl sm:text-3xl font-black">{results.salaryPercentage.toFixed(1)}%</div>
                        <span className="text-xs font-bold">of FJD ${results.monthlyIncome.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-5 sm:p-6 bg-yellow-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider bg-black text-white px-2 py-0.5">
                      Monthly Overseas Installment
                    </span>
                    <div className="text-3xl sm:text-5xl font-black mt-1">
                      FJD ${results.monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <span className="text-base font-bold"> / mo</span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-neutral-900 mt-1">
                      Annual Repayment: FJD ${results.annualPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} across {results.repaymentTermMonths} months
                    </p>
                  </div>
                  {results.salaryPercentage !== null && results.monthlyIncome > 0 && (
                    <div className="text-left sm:text-right border-l-0 sm:border-l-2 sm:border-black sm:pl-6">
                      <span className="text-xs font-black uppercase text-neutral-900">% of Income</span>
                      <div className="text-2xl sm:text-3xl font-black">{results.salaryPercentage.toFixed(1)}%</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Metrics Breakdown Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {mode !== 'overseas_loan' ? (
                <>
                  <div className="p-3 bg-neutral-100 border-2 border-black">
                    <span className="text-[10px] font-black uppercase text-gray-600 block">Estimated Bond Period</span>
                    <span className="text-base sm:text-lg font-black">{results.totalRequiredMonths} Months</span>
                    <span className="text-[10px] block text-gray-600 font-bold">({results.totalRequiredYears} Years &bull; {results.multiplier}x)</span>
                  </div>

                  <div className="p-3 bg-neutral-100 border-2 border-black">
                    <span className="text-[10px] font-black uppercase text-gray-600 block">Remaining Service</span>
                    <span className="text-base sm:text-lg font-black">{results.remainingServiceMonths} Months</span>
                    <span className="text-[10px] block text-gray-600 font-bold">({(results.remainingServiceMonths / 12).toFixed(1)} Years left &bull; {results.remainingPercentage}%)</span>
                  </div>

                  <div className="p-3 bg-neutral-100 border-2 border-black">
                    <span className="text-[10px] font-black uppercase text-gray-600 block">Service Value Delivered</span>
                    <span className="text-base sm:text-lg font-black text-emerald-800">
                      ${Math.round(results.deliveredValue).toLocaleString()}
                    </span>
                    <span className="text-[10px] block text-gray-600 font-bold">Fulfilled via work in Fiji</span>
                  </div>

                  <div className="p-3 bg-neutral-100 border-2 border-black">
                    <span className="text-[10px] font-black uppercase text-gray-600 block">Payable in Lieu of Service</span>
                    <span className="text-base sm:text-lg font-black text-red-800">
                      ${Math.round(results.baseUnservedBalance).toLocaleString()}
                    </span>
                    <span className="text-[10px] block text-gray-600 font-bold">Base pro-rata amount</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 bg-neutral-100 border-2 border-black">
                    <span className="text-[10px] font-black uppercase text-gray-600 block">Total Principal</span>
                    <span className="text-base sm:text-lg font-black">${results.award.toLocaleString()}</span>
                  </div>
                  <div className="p-3 bg-neutral-100 border-2 border-black">
                    <span className="text-[10px] font-black uppercase text-gray-600 block">Monthly Payment</span>
                    <span className="text-base sm:text-lg font-black">${results.monthlyPayment.toFixed(2)}</span>
                  </div>
                  <div className="p-3 bg-neutral-100 border-2 border-black">
                    <span className="text-[10px] font-black uppercase text-gray-600 block">Annual Payment</span>
                    <span className="text-base sm:text-lg font-black">${results.annualPayment.toFixed(2)}</span>
                  </div>
                  <div className="p-3 bg-neutral-100 border-2 border-black">
                    <span className="text-[10px] font-black uppercase text-gray-600 block">Term Duration</span>
                    <span className="text-base sm:text-lg font-black">{results.repaymentTermMonths} Months</span>
                  </div>
                </>
              )}
            </div>

            {/* Official 9-Tier Penalty Table (Visible in Buyout Mode) */}
            {mode === 'bond_buyout' && !results.isExemptTemporaryTravel && (
              <div className="border-3 border-black p-4 bg-neutral-50 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-tight flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-black" />
                    TSLS Official 9-Tier Penalty Schedule (Handbook 2026–2027)
                  </h4>
                  <span className="text-[11px] font-black uppercase bg-yellow-300 border border-black px-2 py-0.5">
                    Your Tier: Category {results.penaltyCategory} ({results.penaltyRate}%)
                  </span>
                </div>
                <p className="text-[11px] font-medium text-gray-700">
                  Under the <em>Tertiary Scholarships and Loans Service (Budget Amendment) Act 2026</em> and the TSLS Handbook, 
                  penalties are structured into <strong>nine statutory tiers</strong> based on the percentage of unserved bond service remaining. 
                  The more service you complete in Fiji, the lower your statutory penalty:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {TSLS_PENALTY_TIERS.map((tier) => {
                    const isCurrentTier = results.penaltyCategory === tier.category;
                    return (
                      <div 
                        key={tier.category} 
                        className={`p-2 border-2 border-black flex items-center justify-between ${
                          isCurrentTier ? 'bg-yellow-400 font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white font-medium text-gray-800'
                        }`}
                      >
                        <div>
                          <span className="block font-black text-[11px]">Cat {tier.category}: {tier.minRemainingPct}%–{tier.maxRemainingPct}%</span>
                          <span className="text-[10px] text-gray-600">Remaining Service</span>
                        </div>
                        <span className={`text-sm font-black px-1.5 py-0.5 border border-black ${isCurrentTier ? 'bg-black text-white' : 'bg-neutral-100'}`}>
                          {tier.penaltyRate}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Plain English Explanation */}
            <div className="p-4 bg-white border-3 border-black space-y-2">
              <h4 className="text-xs font-black uppercase tracking-tight flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Plain English Breakdown of Your Calculation
              </h4>
              <div className="text-xs sm:text-sm text-neutral-800 space-y-2 leading-relaxed font-medium">
                {mode === 'bond_service' && (
                  <>
                    <p>
                      <strong>1. Bond Duration:</strong> Because you studied in a{' '}
                      {studyScheme === 'local' ? 'local Fiji institution' : 'overseas scholarship program'}, 
                      the official statutory bond multiplier is <strong>{results.multiplier}×</strong> your study duration. 
                      For {results.years} years of study, your estimated total required service in Fiji is{' '}
                      <strong>{results.totalRequiredMonths} months ({results.totalRequiredYears} years)</strong>.
                    </p>
                    <p>
                      <strong>2. Service Credit:</strong> You have logged <strong>{results.servedMonths} months</strong> of 
                      verified employment in Fiji ({results.completionPercentage}% of your obligation). This equates to 
                      <strong> FJD ${Math.round(results.deliveredValue).toLocaleString()}</strong> in fulfilled service value.
                    </p>
                    <p>
                      <strong>3. Salary Deductions:</strong> As long as you remain employed in Fiji and keep your records 
                      updated with TSLS, your cash salary deduction is <strong>FJD $0.00</strong>. 
                      You have <strong>{results.remainingServiceMonths} months</strong> ({results.remainingPercentage}%) of service remaining before full bond discharge.
                    </p>
                  </>
                )}

                {mode === 'bond_buyout' && (
                  <>
                    {results.isExemptTemporaryTravel ? (
                      <p>
                        <strong>Temporary Travel Release:</strong> Because you selected temporary travel, no buyout obligation or 
                        penalty is assessed. Your bond remains active. You must submit guarantor documentation through the TSLS Portal 
                        to obtain border clearance from Fiji Immigration.
                      </p>
                    ) : (
                      <>
                        <p>
                          <strong>1. Pro-Rata Base Liability:</strong> Out of {results.totalRequiredMonths} required bond months, 
                          you have {results.remainingServiceMonths} unserved months remaining ({results.remainingPercentage}% unserved). 
                          Your base amount payable in lieu of remaining service is{' '}
                          <strong>FJD ${results.baseUnservedBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>.
                        </p>
                        <p>
                          <strong>2. Statutory Penalty ({results.penaltyDescription}):</strong> Based on the official 9-tier schedule 
                          under the <em>Tertiary Scholarships and Loans Service (Budget Amendment) Act 2026</em>, a statutory penalty of{' '}
                          <strong>FJD ${results.penaltyAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong> ({results.penaltyRate}%) is assessed, 
                          bringing your estimated total clearance obligation to{' '}
                          <strong>FJD ${results.totalBuyoutObligation.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>.
                        </p>
                        <p>
                          <strong>3. Proposed Installments:</strong> Repaying over {results.repaymentTermMonths} months results in an estimated payment of{' '}
                          <strong>FJD ${results.monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2 })} / month</strong>{' '}
                          (FJD ${results.annualPayment.toLocaleString('en-US', { minimumFractionDigits: 2 })} per year).
                        </p>
                      </>
                    )}
                  </>
                )}

                {mode === 'overseas_loan' && (
                  <p>
                    For graduates residing abroad with pre-2023 TELS direct loans, your total balance of{' '}
                    <strong>FJD ${results.award.toLocaleString()}</strong> amortized across {results.repaymentTermMonths} months 
                    equals <strong>FJD ${results.monthlyPayment.toFixed(2)} per month</strong>.
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 font-bold">
            Please enter your award details and study duration to view results.
          </div>
        )}
      </div>

      {/* Official Source Transparency & Statutory Links */}
      <div className="border-4 border-black p-5 bg-neutral-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
        <h4 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
          <Calendar className="w-4 h-4 text-black" />
          Official Statutory Sources &amp; Transparency (Current as of September 2026)
        </h4>
        <p className="text-xs text-neutral-800 leading-relaxed font-medium">
          The calculation formulas, service bond ratios, 9-tier penalty categories, and travel release rules in this tool are directly 
          derived from official Fiji Government legislation and TSLS executive regulations:
        </p>
        <ul className="text-xs space-y-1.5 font-bold list-disc pl-5 text-neutral-900">
          <li>
            <a 
              href="https://www.tsls.com.fj" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-black underline hover:bg-yellow-300 inline-flex items-center gap-1"
            >
              Tertiary Scholarships and Loans Service (TSLS) Official Portal <ExternalLink className="w-3 h-3" />
            </a> &bull; Travel and Bond Clearance Portal
          </li>
          <li>
            <strong>Tertiary Scholarships and Loans Service (Budget Amendment) Act 2026 (Act No. 25 of 2026):</strong> Enacted by Parliament and commenced August 1, 2026; modernizes scheme schedules, recovery procedures, and administrative delegation under the TSLS Handbook.
          </li>
          <li>
            <strong>TSLS Scholarship Policies Handbook (2026–2027 Financial Year):</strong> Officially establishes the 9-tier penalty scale (10% to 50% based on remaining unserved bond percentage) and the 2.5× overseas scholarship multiplier.
          </li>
          <li>
            <strong>Tertiary Scholarships and Loans Service (Budget Amendment) Act 2025 (Act No. 17 of 2025):</strong> Solidified the service bond operational framework and enforcement mechanisms.
          </li>
          <li>
            <strong>Tertiary Scholarships and Loans Service (Budget Amendment) Act 2024:</strong> Transferred direct enforcement from FRCS to TSLS and established statutory default penalties up to 50% on unserved bonds.
          </li>
          <li>
            <strong>Tertiary Scholarships and Loans Service (Budget Amendment) Act 2023:</strong> Converted domestic TELS student loans into service bonds (1.5× multiplier for local institutions) with $0 cash salary deductions.
          </li>
        </ul>
        <div className="pt-2 border-t border-neutral-300 text-[11px] font-bold text-gray-600">
          <strong>Statutory Disclaimer:</strong> This calculator provides an educational mathematical estimate. Official bond clearance, 
          travel release approvals, guarantor waivers, and exact balance statements must be formally confirmed directly with the 
          Tertiary Scholarships and Loans Service (TSLS) in Suva or via the official TSLS online clearance portal. Figures generated 
          herein do not constitute a legal discharge or binding debt quotation.
        </div>
      </div>
    </div>
  );
}

