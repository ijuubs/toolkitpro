import { useState, useMemo } from 'react';
import { 
  Printer, 
  Download, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  Building2, 
  DollarSign, 
  Copy, 
  Check, 
  Info,
  Clock,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { trackToolUsage } from '../../utils/analytics';
import ShareResultActions from '../ShareResultActions';
import { 
  calculateFijiVatLodgement, 
  formatFjdCurrency, 
  LodgementInputValues,
  ValidationErrors
} from '../../utils/fijiVatLodgementEngine';
import { 
  FIJI_VAT_RATES, 
  FIJI_VAT_DISCLAIMER, 
  UNVERIFIED_PENALTY_NOTICE 
} from '../../utils/fijiTaxConfig';

const INITIAL_FORM: LodgementInputValues = {
  taxpayerName: '',
  tin: '',
  branch: '00',
  frequency: 'monthly',
  periodEndDate: '2026-03-31',
  actualFilingDate: '2026-04-25',
  rateKey: 'standard_current',
  standardSalesGross: '',
  zeroRatedSales: '',
  exemptSales: '',
  outputAdjustmentType: 'increase',
  outputAdjustmentAmount: '',
  localPurchasesGross: '',
  capitalPurchasesGross: '',
  customsImportVat: '',
  inputAdjustmentType: 'decrease',
  inputAdjustmentAmount: '',
};

const PRESET_RETAIL: LodgementInputValues = {
  taxpayerName: 'Pacific Supermarket & Hardware Pte Ltd',
  tin: '50-98432-0-1',
  branch: '01',
  frequency: 'monthly',
  periodEndDate: '2026-03-31',
  actualFilingDate: '2026-04-28',
  rateKey: 'standard_current',
  standardSalesGross: '85400',
  zeroRatedSales: '14200',
  exemptSales: '0',
  outputAdjustmentType: 'increase',
  outputAdjustmentAmount: '0',
  localPurchasesGross: '42500',
  capitalPurchasesGross: '8900',
  customsImportVat: '2450',
  inputAdjustmentType: 'decrease',
  inputAdjustmentAmount: '0',
};

const PRESET_EXPORTER: LodgementInputValues = {
  taxpayerName: 'Coral Coast Fisheries & Marine Export Ltd',
  tin: '60-12876-0-0',
  branch: '00',
  frequency: 'monthly',
  periodEndDate: '2026-03-31',
  actualFilingDate: '2026-04-20',
  rateKey: 'standard_current',
  standardSalesGross: '12000',
  zeroRatedSales: '148000',
  exemptSales: '0',
  outputAdjustmentType: 'increase',
  outputAdjustmentAmount: '0',
  localPurchasesGross: '35000',
  capitalPurchasesGross: '24000',
  customsImportVat: '4100',
  inputAdjustmentType: 'decrease',
  inputAdjustmentAmount: '0',
};

export default function FijiVatLodgementCalculator() {
  const [form, setForm] = useState<LodgementInputValues>(INITIAL_FORM);
  const [copied, setCopied] = useState<boolean>(false);
  const [showWorksheetPreview, setShowWorksheetPreview] = useState<boolean>(false);

  const updateField = (field: keyof LodgementInputValues, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    return calculateFijiVatLodgement(form);
  }, [form]);

  const handlePrint = () => {
    trackToolUsage('fiji-vat-lodgement-calculator', 'Fiji VAT Lodgement Calculator', 'Fiji Tools', 'print');
    window.print();
  };

  const handleDownloadCsv = () => {
    trackToolUsage('fiji-vat-lodgement-calculator', 'Fiji VAT Lodgement Calculator', 'Fiji Tools', 'csv_export');
    const rows = [
      ['FIJI VAT LODGEMENT & RECONCILIATION WORKSHEET (IRS024 REFERENCE)', ''],
      ['Notice', FIJI_VAT_DISCLAIMER],
      ['', ''],
      ['Taxpayer Name', form.taxpayerName || 'Not Specified'],
      ['TIN', form.tin || 'Not Specified'],
      ['Branch', form.branch || '00'],
      ['Filing Frequency', form.frequency.toUpperCase()],
      ['Taxable Period Ending', form.periodEndDate],
      ['Applicable Standard Rate', `${results.ratePercent}% (${results.rateSource})`],
      ['Statutory Due Date', results.statutoryDueDate],
      ['Actual Lodgement Date', form.actualFilingDate],
      ['Filing Status', results.isOverdue ? `Overdue by ${results.calendarDaysOverdue} calendar days` : 'Within statutory deadline'],
      ['', ''],
      ['LINE ITEM / BOX', 'GROSS / TAXABLE AMOUNT (FJD)', 'CALCULATED VAT (FJD)'],
      ['Box 1: Standard-Rated Supplies (VAT Incl)', results.standardSalesGross.toFixed(2), results.box1Vat.toFixed(2)],
      ['Box 2: Zero-Rated Supplies (0%)', results.zeroRatedSales.toFixed(2), '0.00'],
      ['Box 3: Exempt Supplies (0%)', results.exemptSales.toFixed(2), '0.00'],
      ['Box 4: Total Supplies (Boxes 1 + 2 + 3)', results.totalSupplies.toFixed(2), '-'],
      ['Box 5: Total Output Tax Payable', '-', results.totalOutputTax.toFixed(2)],
      ['Box 6: Local Taxable Operating Purchases (VAT Incl)', results.localPurchasesGross.toFixed(2), results.box6Vat.toFixed(2)],
      ['Box 7: Capital Asset Purchases (VAT Incl)', results.capitalPurchasesGross.toFixed(2), results.box7Vat.toFixed(2)],
      ['Box 8: Customs Import VAT Paid on SAD Entry', '-', results.customsImportVat.toFixed(2)],
      ['Box 9: Input Tax Adjustments (Signed)', '-', results.inputAdjustmentSigned.toFixed(2)],
      ['Box 10: Total Allowable Input Tax Credits', '-', results.totalInputTax.toFixed(2)],
      ['Box 11: Final Net VAT Position', '-', results.netBalanceSigned.toFixed(2)],
      ['Position Classification', results.positionLabel, ''],
      ['', ''],
      ['STATUTORY PENALTY STATUS', ''],
      ['Penalty Assessment Note', UNVERIFIED_PENALTY_NOTICE],
      ['Penalties Included in Balance', '0.00 (Exempt from balance until verified with FRCS)'],
      ['', ''],
      ['Generated by ToolKitPro', new Date().toISOString()]
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.map(item => `"${String(item).replace(/"/g, '""')}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Fiji_VAT_Lodgement_${form.tin || 'Worksheet'}_${form.periodEndDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopySummary = () => {
    trackToolUsage('fiji-vat-lodgement-calculator', 'Fiji VAT Lodgement Calculator', 'Fiji Tools', 'copy_summary');
    const text = `================================================
FIJI VAT LODGEMENT WORKSHEET (IRS024 REFERENCE)
================================================
Taxpayer: ${form.taxpayerName || 'N/A'}
TIN: ${form.tin || 'N/A'} | Branch: ${form.branch || '00'}
Taxable Period Ending: ${form.periodEndDate}
Rate: ${results.ratePercent}% Standard VAT
Statutory Due Date: ${results.statutoryDueDate}
Actual Filing Date: ${form.actualFilingDate} (${results.isOverdue ? `Overdue by ${results.calendarDaysOverdue} days` : 'Within Deadline'})

--- PART A: OUTPUT TAX (SALES) ---
Box 1: Standard Supplies (Gross): ${formatFjdCurrency(results.standardSalesGross)}
  -> Output VAT (${results.ratePercent}%): ${formatFjdCurrency(results.box1Vat)}
Box 2: Zero-Rated Supplies: ${formatFjdCurrency(results.zeroRatedSales)}
Box 3: Exempt Supplies: ${formatFjdCurrency(results.exemptSales)}
Box 4: Total Supplies: ${formatFjdCurrency(results.totalSupplies)}
Box 5: Total Output Tax: ${formatFjdCurrency(results.totalOutputTax)}

--- PART B: INPUT TAX (PURCHASES & EXPENSES) ---
Box 6: Local Operating Purchases: ${formatFjdCurrency(results.localPurchasesGross)} (VAT: ${formatFjdCurrency(results.box6Vat)})
Box 7: Capital Asset Purchases: ${formatFjdCurrency(results.capitalPurchasesGross)} (VAT: ${formatFjdCurrency(results.box7Vat)})
Box 8: Customs Import VAT (SAD): ${formatFjdCurrency(results.customsImportVat)}
Box 9: Input Tax Adjustments: ${formatFjdCurrency(results.inputAdjustmentSigned)}
Box 10: Total Allowable Input Tax: ${formatFjdCurrency(results.totalInputTax)}

--- RECONCILIATION (BOX 11) ---
Final Position: ${results.positionLabel}
Amount: ${formatFjdCurrency(results.netAmountAbsolute)}

--- STATUTORY PENALTY STATUS ---
${UNVERIFIED_PENALTY_NOTICE}

DISCLAIMER:
${FIJI_VAT_DISCLAIMER}
================================================
ToolKitPro: https://toolkitpro-e5y5.vercel.app/tools/fiji-vat-lodgement-calculator`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const loadPreset = (preset: LodgementInputValues) => {
    setForm(preset);
    trackToolUsage('fiji-vat-lodgement-calculator', 'Fiji VAT Lodgement Calculator', 'Fiji Tools', 'load_preset');
  };

  const handleClear = () => {
    setForm(INITIAL_FORM);
    trackToolUsage('fiji-vat-lodgement-calculator', 'Fiji VAT Lodgement Calculator', 'Fiji Tools', 'clear');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Print Stylesheet Hook */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #official-frcs-print-sheet, #official-frcs-print-sheet * {
            visibility: visible;
          }
          #official-frcs-print-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            background: white !important;
            color: black !important;
            border: none !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Main Tool Container */}
      <div className="border-4 border-black p-5 sm:p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] no-print">
        {/* Header & Reset Action */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b-4 border-black mb-6">
          <div>
            <div className="inline-block bg-yellow-400 border-2 border-black px-2 py-0.5 text-xs font-black uppercase mb-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Form IRS024 Reference Layout
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              Fiji VAT Lodgement & Reconciliation Calculator
            </h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 text-xs font-black uppercase bg-neutral-100 hover:bg-neutral-200 px-3 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Form
            </button>
          </div>
        </div>

        {/* Mandatory Informational Disclaimer Banner */}
        <div className="bg-amber-50 border-3 border-black p-4 mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
          <div className="text-xs text-neutral-800 leading-relaxed font-medium">
            <strong className="font-black uppercase block text-neutral-900 mb-0.5">Informational Estimation Notice:</strong>
            {FIJI_VAT_DISCLAIMER}
          </div>
        </div>

        {/* Quick Test Presets Bar */}
        <div className="bg-yellow-100 border-3 border-black p-3.5 mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-black shrink-0" />
            <span className="text-xs font-black uppercase">Quick Test Scenarios:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => loadPreset(PRESET_RETAIL)}
              className="text-xs font-black uppercase bg-white hover:bg-yellow-300 px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              Retail Supermarket (Payable)
            </button>
            <button
              onClick={() => loadPreset(PRESET_EXPORTER)}
              className="text-xs font-black uppercase bg-white hover:bg-yellow-300 px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              Marine Exporter (Credit Balance)
            </button>
          </div>
        </div>

        {/* Section 1: Taxpayer & Period Configuration */}
        <div className="mb-8">
          <h3 className="text-lg font-black uppercase mb-4 flex items-center gap-2 border-b-2 border-black pb-2">
            <Building2 className="w-5 h-5" /> 1. Taxpayer & Filing Period Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase mb-1">
                Taxpayer / Trading Name
              </label>
              <input
                type="text"
                placeholder="e.g. Pacific Island Traders Ltd"
                value={form.taxpayerName}
                onChange={(e) => updateField('taxpayerName', e.target.value)}
                className="w-full bg-neutral-50 border-2 border-black p-2.5 font-bold text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase mb-1">
                TIN (Taxpayer Identification No.)
              </label>
              <input
                type="text"
                placeholder="e.g. 50-12345-0-1"
                value={form.tin}
                onChange={(e) => updateField('tin', e.target.value)}
                className="w-full bg-neutral-50 border-2 border-black p-2.5 font-bold text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase mb-1">
                Branch No.
              </label>
              <input
                type="text"
                placeholder="00"
                value={form.branch}
                onChange={(e) => updateField('branch', e.target.value)}
                className="w-full bg-neutral-50 border-2 border-black p-2.5 font-bold text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase mb-1">
                Filing Frequency
              </label>
              <select
                value={form.frequency}
                onChange={(e) => updateField('frequency', e.target.value as 'monthly' | 'quarterly')}
                className="w-full bg-neutral-50 border-2 border-black p-2.5 font-bold text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="monthly">Monthly (Standard)</option>
                <option value="quarterly">Quarterly (Approved Small Business)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black uppercase mb-1">
                Applicable Tax Rate
              </label>
              <select
                value={form.rateKey}
                onChange={(e) => updateField('rateKey', e.target.value)}
                className="w-full bg-neutral-50 border-2 border-black p-2.5 font-bold text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="standard_current">Current Standard (12.5% - Post Aug 2023)</option>
                <option value="standard_historical_9">Historical Standard (9.0% - 2016 to Jul 2023)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase mb-1">
                Taxable Period Ending Date (YYYY-MM-DD)
              </label>
              <input
                type="date"
                value={form.periodEndDate}
                onChange={(e) => updateField('periodEndDate', e.target.value)}
                className={`w-full bg-neutral-50 border-2 ${results.errors.periodEndDate ? 'border-red-600 bg-red-50' : 'border-black'} p-2.5 font-bold text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400`}
              />
              {results.errors.periodEndDate && (
                <p className="text-xs text-red-600 font-bold mt-1">{results.errors.periodEndDate}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-black uppercase mb-1">
                Actual / Planned Lodgement Date
              </label>
              <input
                type="date"
                value={form.actualFilingDate}
                onChange={(e) => updateField('actualFilingDate', e.target.value)}
                className={`w-full bg-neutral-50 border-2 ${results.errors.actualFilingDate ? 'border-red-600 bg-red-50' : 'border-black'} p-2.5 font-bold text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400`}
              />
              {results.errors.actualFilingDate && (
                <p className="text-xs text-red-600 font-bold mt-1">{results.errors.actualFilingDate}</p>
              )}
            </div>
          </div>

          {/* Statutory Filing Dates Verification Banner */}
          <div className="mt-4 p-3.5 bg-neutral-100 border-2 border-black text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-black shrink-0" />
              <span>
                <strong>Statutory Filing Deadline:</strong>{' '}
                <span className="font-mono font-black underline bg-yellow-200 px-1 py-0.5">
                  {results.statutoryDueDate}
                </span>{' '}
                ({form.frequency === 'monthly' ? 'Last calendar day of next month' : 'Last day of month following quarter end'})
              </span>
            </div>
            <div className="text-neutral-600 text-[11px] font-mono">
              Rate: {results.ratePercent}% | Fraction: {results.ratePercent} / {(100 + results.ratePercent).toFixed(1)}
            </div>
          </div>
        </div>

        {/* Section 2: Output Tax (Sales & Supplies) */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
            <h3 className="text-lg font-black uppercase flex items-center gap-2">
              <DollarSign className="w-5 h-5" /> 2. Part A: Output Tax on Supplies (Box 1 - 5)
            </h3>
            <span className="text-xs bg-yellow-400 border border-black font-black px-2 py-0.5">
              {results.ratePercent}% Standard Rate
            </span>
          </div>

          <div className="space-y-4">
            {/* Box 1 */}
            <div className="p-4 border-2 border-black bg-neutral-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <label className="text-sm font-black uppercase">
                    Box 1: Standard-Rated Supplies (Gross Sales, VAT Inclusive)
                  </label>
                  <p className="text-xs text-neutral-600">
                    Gross sales subject to {results.ratePercent}% VAT. Tax is extracted using tax fraction {results.ratePercent} / {(100 + results.ratePercent).toFixed(1)}.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-black uppercase text-neutral-600">Calculated Output Tax</span>
                  <div className="text-sm font-black font-mono bg-yellow-200 border border-black px-2 py-0.5">
                    {formatFjdCurrency(results.box1Vat)}
                  </div>
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={form.standardSalesGross}
                  onChange={(e) => updateField('standardSalesGross', e.target.value)}
                  className={`w-full bg-white border-2 ${results.errors.standardSalesGross ? 'border-red-600' : 'border-black'} pl-8 pr-3 py-2 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                />
              </div>
              {results.errors.standardSalesGross && (
                <p className="text-xs text-red-600 font-bold mt-1">{results.errors.standardSalesGross}</p>
              )}
              {results.standardSalesGross > 0 && !results.errors.standardSalesGross && (
                <div className="mt-2 text-xs text-neutral-500 font-mono">
                  Net (excl. VAT): {formatFjdCurrency(results.box1Net)} | Extracted VAT: {formatFjdCurrency(results.box1Vat)}
                </div>
              )}
            </div>

            {/* Box 2 & Box 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border-2 border-black bg-neutral-50">
                <label className="block text-xs font-black uppercase mb-1">
                  Box 2: Zero-Rated Supplies (0% VAT)
                </label>
                <p className="text-xs text-neutral-600 mb-2">
                  Eligible exports, prescribed basic food staples, and approved medicines. Does not generate standard output VAT.
                </p>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-sm">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={form.zeroRatedSales}
                    onChange={(e) => updateField('zeroRatedSales', e.target.value)}
                    className={`w-full bg-white border-2 ${results.errors.zeroRatedSales ? 'border-red-600' : 'border-black'} pl-8 pr-3 py-2 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                  />
                </div>
                {results.errors.zeroRatedSales && (
                  <p className="text-xs text-red-600 font-bold mt-1">{results.errors.zeroRatedSales}</p>
                )}
              </div>

              <div className="p-4 border-2 border-black bg-neutral-50">
                <label className="block text-xs font-black uppercase mb-1">
                  Box 3: Exempt Supplies (No VAT)
                </label>
                <p className="text-xs text-neutral-600 mb-2">
                  Residential rental accommodation, domestic financial/banking services, education. Non-taxable; no input tax recovery.
                </p>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-sm">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={form.exemptSales}
                    onChange={(e) => updateField('exemptSales', e.target.value)}
                    className={`w-full bg-white border-2 ${results.errors.exemptSales ? 'border-red-600' : 'border-black'} pl-8 pr-3 py-2 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                  />
                </div>
                {results.errors.exemptSales && (
                  <p className="text-xs text-red-600 font-bold mt-1">{results.errors.exemptSales}</p>
                )}
              </div>
            </div>

            {/* Output Adjustments with Explicit Direction */}
            <div className="p-4 border-2 border-black bg-neutral-50">
              <label className="block text-xs font-black uppercase mb-1">
                Output Tax Adjustments (Box 5 Adjustment)
              </label>
              <p className="text-xs text-neutral-600 mb-2">
                Specify adjustment direction: Addition (debit notes to customers, bad debt recoveries) or Deduction (credit notes issued, corrections).
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={form.outputAdjustmentType}
                  onChange={(e) => updateField('outputAdjustmentType', e.target.value as 'increase' | 'decrease')}
                  className="bg-white border-2 border-black px-3 py-2 font-bold text-xs shrink-0"
                >
                  <option value="increase">(+) Add to Output Tax (Debit Note / Recovery)</option>
                  <option value="decrease">(-) Deduct from Output Tax (Credit Note / Reversal)</option>
                </select>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-sm">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={form.outputAdjustmentAmount}
                    onChange={(e) => updateField('outputAdjustmentAmount', e.target.value)}
                    className={`w-full bg-white border-2 ${results.errors.outputAdjustmentAmount ? 'border-red-600' : 'border-black'} pl-8 pr-3 py-2 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                  />
                </div>
              </div>
              {results.errors.outputAdjustmentAmount && (
                <p className="text-xs text-red-600 font-bold mt-1">{results.errors.outputAdjustmentAmount}</p>
              )}
            </div>

            {/* Box 4 & Box 5 Totals Summary */}
            <div className="bg-yellow-200 border-2 border-black p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
              <div>
                <span className="text-xs font-black uppercase text-neutral-800">Box 4: Total Supplies (Boxes 1 + 2 + 3)</span>
                <div className="text-lg font-black">{formatFjdCurrency(results.totalSupplies)}</div>
              </div>
              <div>
                <span className="text-xs font-black uppercase text-neutral-800">Box 5: Total Output Tax Payable</span>
                <div className="text-lg font-black text-black">{formatFjdCurrency(results.totalOutputTax)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Input Tax Credits (Purchases, Imports & Expenses) */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
            <h3 className="text-lg font-black uppercase flex items-center gap-2">
              <DollarSign className="w-5 h-5" /> 3. Part B: Input Tax Credits (Box 6 - 10)
            </h3>
            <span className="text-xs bg-black text-white font-black px-2 py-0.5">
              Eligible Business Purchases
            </span>
          </div>

          <div className="space-y-4">
            {/* Box 6: Local Purchases */}
            <div className="p-4 border-2 border-black bg-neutral-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <label className="text-sm font-black uppercase">
                    Box 6: Local Operating Purchases / OPEX (Gross, VAT Inclusive)
                  </label>
                  <p className="text-xs text-neutral-600">
                    Allowable business operating expenses supported by valid tax invoices. Credit extracted using {results.ratePercent} / {(100 + results.ratePercent).toFixed(1)}.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-black uppercase text-neutral-600">Input Tax Credit</span>
                  <div className="text-sm font-black font-mono bg-yellow-200 border border-black px-2 py-0.5">
                    {formatFjdCurrency(results.box6Vat)}
                  </div>
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={form.localPurchasesGross}
                  onChange={(e) => updateField('localPurchasesGross', e.target.value)}
                  className={`w-full bg-white border-2 ${results.errors.localPurchasesGross ? 'border-red-600' : 'border-black'} pl-8 pr-3 py-2 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                />
              </div>
              {results.errors.localPurchasesGross && (
                <p className="text-xs text-red-600 font-bold mt-1">{results.errors.localPurchasesGross}</p>
              )}
            </div>

            {/* Box 7: Capital Asset Purchases */}
            <div className="p-4 border-2 border-black bg-neutral-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <label className="text-sm font-black uppercase">
                    Box 7: Capital Asset Purchases (Gross, VAT Inclusive)
                  </label>
                  <p className="text-xs text-neutral-600">
                    Eligible capital machinery, plant, equipment, or business vehicles supported by tax invoices.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-black uppercase text-neutral-600">Input Tax Credit</span>
                  <div className="text-sm font-black font-mono bg-yellow-200 border border-black px-2 py-0.5">
                    {formatFjdCurrency(results.box7Vat)}
                  </div>
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={form.capitalPurchasesGross}
                  onChange={(e) => updateField('capitalPurchasesGross', e.target.value)}
                  className={`w-full bg-white border-2 ${results.errors.capitalPurchasesGross ? 'border-red-600' : 'border-black'} pl-8 pr-3 py-2 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                />
              </div>
              {results.errors.capitalPurchasesGross && (
                <p className="text-xs text-red-600 font-bold mt-1">{results.errors.capitalPurchasesGross}</p>
              )}
            </div>

            {/* Box 8: Customs Import VAT */}
            <div className="p-4 border-2 border-black bg-neutral-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <label className="text-sm font-black uppercase">
                    Box 8: Customs Import VAT Paid on SAD Entry
                  </label>
                  <p className="text-xs text-neutral-600">
                    Enter the actual VAT amount paid directly to FRCS Customs on your Single Administrative Document (do not enter gross imported goods value to avoid double-counting).
                  </p>
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={form.customsImportVat}
                  onChange={(e) => updateField('customsImportVat', e.target.value)}
                  className={`w-full bg-white border-2 ${results.errors.customsImportVat ? 'border-red-600' : 'border-black'} pl-8 pr-3 py-2 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                />
              </div>
              {results.errors.customsImportVat && (
                <p className="text-xs text-red-600 font-bold mt-1">{results.errors.customsImportVat}</p>
              )}
            </div>

            {/* Box 9: Input Tax Adjustments with Direction */}
            <div className="p-4 border-2 border-black bg-neutral-50">
              <label className="block text-xs font-black uppercase mb-1">
                Box 9: Input Tax Adjustments
              </label>
              <p className="text-xs text-neutral-600 mb-2">
                Specify adjustment direction: Deduction (supplier credit notes, purchase returns) or Addition (allowable S.24 bad debts write-offs).
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={form.inputAdjustmentType}
                  onChange={(e) => updateField('inputAdjustmentType', e.target.value as 'increase' | 'decrease')}
                  className="bg-white border-2 border-black px-3 py-2 font-bold text-xs shrink-0"
                >
                  <option value="decrease">(-) Deduct from Credit (Supplier Credit Note / Purchase Return)</option>
                  <option value="increase">(+) Add to Credit (Allowable S.24 Bad Debt / Omission)</option>
                </select>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-sm">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={form.inputAdjustmentAmount}
                    onChange={(e) => updateField('inputAdjustmentAmount', e.target.value)}
                    className={`w-full bg-white border-2 ${results.errors.inputAdjustmentAmount ? 'border-red-600' : 'border-black'} pl-8 pr-3 py-2 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                  />
                </div>
              </div>
              {results.errors.inputAdjustmentAmount && (
                <p className="text-xs text-red-600 font-bold mt-1">{results.errors.inputAdjustmentAmount}</p>
              )}
            </div>

            {/* Box 10 Total Input Tax Summary */}
            <div className="bg-neutral-900 text-white border-2 border-black p-4 font-mono flex justify-between items-center">
              <span className="text-xs font-black uppercase">Box 10: Total Allowable Input Tax Credits</span>
              <div className="text-lg font-black text-yellow-400">{formatFjdCurrency(results.totalInputTax)}</div>
            </div>
          </div>
        </div>

        {/* Section 4: Final Net VAT Position (Box 11) */}
        <div className={`p-6 border-4 border-black mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${
          results.positionStatus === 'payable' 
            ? 'bg-amber-100' 
            : results.positionStatus === 'credit' 
              ? 'bg-emerald-100' 
              : 'bg-neutral-100'
        }`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-neutral-700">
                Form IRS024 Reference — Box 11 Net Position
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase mt-1">
                {results.positionLabel}
              </h3>
              <p className="text-xs text-neutral-700 font-bold mt-1">
                Output Tax ({formatFjdCurrency(results.totalOutputTax)}) minus Total Input Credits ({formatFjdCurrency(results.totalInputTax)})
              </p>
              {results.positionStatus === 'credit' && (
                <p className="text-[11px] text-emerald-800 font-bold mt-1">
                  * Note: Credit balances are subject to statutory verification and documentation review by FRCS prior to any refund or offset.
                </p>
              )}
            </div>
            <div className="text-right shrink-0">
              <div className={`text-3xl sm:text-4xl font-black font-mono border-3 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                results.positionStatus === 'payable' 
                  ? 'bg-amber-300 text-black' 
                  : results.positionStatus === 'credit' 
                    ? 'bg-emerald-300 text-black' 
                    : 'bg-white text-black'
              }`}>
                {formatFjdCurrency(results.netAmountAbsolute)}
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Statutory Deadline & Penalty Safeguard */}
        <div className="p-5 border-3 border-black mb-8 bg-neutral-50">
          <h4 className="text-sm font-black uppercase mb-3 flex items-center gap-2 border-b-2 border-black pb-1.5">
            <Clock className="w-4 h-4" /> Filing Schedule & Penalty Information
          </h4>

          {results.isOverdue ? (
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-amber-900 font-bold text-xs sm:text-sm bg-amber-100 p-2.5 border-2 border-black">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
                <span>
                  <strong>Lodgement Notice:</strong> The selected filing date ({form.actualFilingDate}) is <strong>{results.calendarDaysOverdue} calendar days</strong> past the statutory due date ({results.statutoryDueDate}).
                </span>
              </div>

              <div className="p-3 bg-white border-2 border-black text-xs font-mono">
                <span className="block font-black uppercase text-neutral-800 mb-1">
                  Statutory Penalty & Interest Calculation:
                </span>
                <span className="text-neutral-700 font-medium">
                  {UNVERIFIED_PENALTY_NOTICE}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-800 font-bold text-xs sm:text-sm bg-green-50 p-2.5 border-2 border-black">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <span>
                Filing date ({form.actualFilingDate}) is on or before statutory due date ({results.statutoryDueDate}).
              </span>
            </div>
          )}
        </div>

        {/* Action Controls: Export, Print, Copy */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t-4 border-black">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 font-black uppercase text-xs sm:text-sm bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2.5 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <Printer className="w-4 h-4" /> Print Lodgement Worksheet
          </button>

          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-2 font-black uppercase text-xs sm:text-sm bg-white hover:bg-neutral-100 text-black px-4 py-2.5 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <Download className="w-4 h-4" /> Download CSV Summary
          </button>

          <button
            onClick={handleCopySummary}
            className="flex items-center gap-2 font-black uppercase text-xs sm:text-sm bg-white hover:bg-neutral-100 text-black px-4 py-2.5 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied to Clipboard' : 'Copy Text Summary'}
          </button>

          <button
            onClick={() => setShowWorksheetPreview(!showWorksheetPreview)}
            className="ml-auto text-xs font-black uppercase underline hover:bg-yellow-200 px-2 py-1 border border-transparent hover:border-black transition-all"
          >
            {showWorksheetPreview ? 'Hide Worksheet Preview' : 'Preview Worksheet Layout'}
          </button>
        </div>
      </div>

      {/* Printable Lodgement Worksheet (Print View & Optional On-Screen Preview) */}
      <div 
        id="official-frcs-print-sheet" 
        className={`${showWorksheetPreview ? 'block' : 'hidden'} print:block border-4 border-black p-6 sm:p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}
      >
        <div className="border-b-4 border-black pb-4 mb-4 flex justify-between items-start">
          <div>
            <div className="text-xs font-black tracking-widest uppercase text-neutral-600">
              Taxpayer Working Paper Reference
            </div>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
              Fiji VAT Lodgement & Reconciliation Worksheet
            </h1>
            <p className="text-xs text-neutral-600 font-mono">
              Form IRS024 Reference Layout | Standard Rate: {results.ratePercent}%
            </p>
          </div>
          <div className="text-right border-2 border-black p-2 font-mono text-xs">
            <div><strong>LAYOUT:</strong> IRS024 Ref</div>
            <div><strong>RATE:</strong> {results.ratePercent}%</div>
          </div>
        </div>

        {/* Informational Notice in Worksheet */}
        <div className="p-2.5 bg-neutral-100 border border-black text-[10px] text-neutral-700 mb-4 leading-tight">
          <strong>Notice:</strong> {FIJI_VAT_DISCLAIMER}
        </div>

        {/* Taxpayer Header in Worksheet */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 border-2 border-black bg-neutral-50 mb-6 text-xs font-mono">
          <div>
            <span className="block text-neutral-500 uppercase font-sans font-bold">Taxpayer Name</span>
            <span className="font-bold text-sm">{form.taxpayerName || 'Not Specified'}</span>
          </div>
          <div>
            <span className="block text-neutral-500 uppercase font-sans font-bold">TIN</span>
            <span className="font-bold text-sm">{form.tin || 'Not Specified'}</span>
          </div>
          <div>
            <span className="block text-neutral-500 uppercase font-sans font-bold">Period Ending</span>
            <span className="font-bold text-sm">{form.periodEndDate}</span>
          </div>
          <div>
            <span className="block text-neutral-500 uppercase font-sans font-bold">Statutory Due Date</span>
            <span className="font-bold text-sm">{results.statutoryDueDate}</span>
          </div>
        </div>

        {/* Line Items Table */}
        <table className="w-full text-xs border-collapse border-2 border-black mb-6">
          <thead>
            <tr className="bg-black text-white font-black uppercase">
              <th className="border border-black p-2 text-left w-12">Box</th>
              <th className="border border-black p-2 text-left">Description & Category Reference</th>
              <th className="border border-black p-2 text-right w-36">Gross / Value (FJD)</th>
              <th className="border border-black p-2 text-right w-36">VAT Amount (FJD)</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {/* Output Tax */}
            <tr className="bg-neutral-100 font-sans font-black">
              <td colSpan={4} className="border border-black p-2">PART A: OUTPUT TAX ON SUPPLIES (SALES)</td>
            </tr>
            <tr>
              <td className="border border-black p-2 text-center font-bold">1</td>
              <td className="border border-black p-2 font-sans">
                Standard-Rated Supplies (Gross sales inclusive of {results.ratePercent}% VAT)
              </td>
              <td className="border border-black p-2 text-right">{formatFjdCurrency(results.standardSalesGross)}</td>
              <td className="border border-black p-2 text-right font-bold">{formatFjdCurrency(results.box1Vat)}</td>
            </tr>
            <tr>
              <td className="border border-black p-2 text-center font-bold">2</td>
              <td className="border border-black p-2 font-sans">Zero-Rated Supplies (Exports, prescribed food staples, medicines @ 0%)</td>
              <td className="border border-black p-2 text-right">{formatFjdCurrency(results.zeroRatedSales)}</td>
              <td className="border border-black p-2 text-right font-bold">$0.00</td>
            </tr>
            <tr>
              <td className="border border-black p-2 text-center font-bold">3</td>
              <td className="border border-black p-2 font-sans">Exempt Supplies (Residential rent, financial services @ 0%)</td>
              <td className="border border-black p-2 text-right">{formatFjdCurrency(results.exemptSales)}</td>
              <td className="border border-black p-2 text-right font-bold">$0.00</td>
            </tr>
            <tr className="bg-neutral-50 font-bold">
              <td className="border border-black p-2 text-center">4</td>
              <td className="border border-black p-2 font-sans uppercase">Total Supplies (Boxes 1 + 2 + 3)</td>
              <td className="border border-black p-2 text-right">{formatFjdCurrency(results.totalSupplies)}</td>
              <td className="border border-black p-2 text-right">-</td>
            </tr>
            <tr className="bg-yellow-100 font-bold">
              <td className="border border-black p-2 text-center">5</td>
              <td className="border border-black p-2 font-sans uppercase">Total Output Tax (Box 1 VAT + Adjustments)</td>
              <td className="border border-black p-2 text-right">-</td>
              <td className="border border-black p-2 text-right text-sm">{formatFjdCurrency(results.totalOutputTax)}</td>
            </tr>

            {/* Input Tax */}
            <tr className="bg-neutral-100 font-sans font-black">
              <td colSpan={4} className="border border-black p-2">PART B: INPUT TAX CREDITS (PURCHASES & EXPENSES)</td>
            </tr>
            <tr>
              <td className="border border-black p-2 text-center font-bold">6</td>
              <td className="border border-black p-2 font-sans">Local Operating Purchases ({results.ratePercent}% VAT Inclusive)</td>
              <td className="border border-black p-2 text-right">{formatFjdCurrency(results.localPurchasesGross)}</td>
              <td className="border border-black p-2 text-right font-bold">{formatFjdCurrency(results.box6Vat)}</td>
            </tr>
            <tr>
              <td className="border border-black p-2 text-center font-bold">7</td>
              <td className="border border-black p-2 font-sans">Capital Asset Acquisitions (Commercial equipment, vehicles)</td>
              <td className="border border-black p-2 text-right">{formatFjdCurrency(results.capitalPurchasesGross)}</td>
              <td className="border border-black p-2 text-right font-bold">{formatFjdCurrency(results.box7Vat)}</td>
            </tr>
            <tr>
              <td className="border border-black p-2 text-center font-bold">8</td>
              <td className="border border-black p-2 font-sans">Customs Import VAT Paid on Customs SAD Entry</td>
              <td className="border border-black p-2 text-right">-</td>
              <td className="border border-black p-2 text-right font-bold">{formatFjdCurrency(results.customsImportVat)}</td>
            </tr>
            <tr>
              <td className="border border-black p-2 text-center font-bold">9</td>
              <td className="border border-black p-2 font-sans">Input Tax Adjustments (Credit notes, allowable write-offs)</td>
              <td className="border border-black p-2 text-right">-</td>
              <td className="border border-black p-2 text-right font-bold">{formatFjdCurrency(results.inputAdjustmentSigned)}</td>
            </tr>
            <tr className="bg-yellow-100 font-bold">
              <td className="border border-black p-2 text-center">10</td>
              <td className="border border-black p-2 font-sans uppercase">Total Allowable Input Tax Credits (Boxes 6 to 9)</td>
              <td className="border border-black p-2 text-right">-</td>
              <td className="border border-black p-2 text-right text-sm">{formatFjdCurrency(results.totalInputTax)}</td>
            </tr>

            {/* Reconciliation */}
            <tr className="bg-black text-white font-bold text-sm">
              <td className="border border-black p-3 text-center">11</td>
              <td className="border border-black p-3 font-sans uppercase">
                {results.positionLabel}
              </td>
              <td className="border border-black p-3 text-right">-</td>
              <td className="border border-black p-3 text-right text-yellow-400 font-black">
                {formatFjdCurrency(results.netAmountAbsolute)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Verification and Review Section */}
        <div className="border-2 border-black p-4 text-xs space-y-3">
          <p className="font-bold text-neutral-800 uppercase text-[11px]">
            Preparer / Reviewer Record:
          </p>
          <p className="text-neutral-600 italic text-[11px]">
            This worksheet represents internal reconciliation estimates. Official lodgement must be completed via authorized FRCS taxpayer channels or tax agents in accordance with the Value Added Tax Act.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-3 font-mono text-xs">
            <div className="border-b-2 border-black pb-1">
              <span className="block text-neutral-500 text-[10px] uppercase font-sans">Prepared By</span>
              &nbsp;
            </div>
            <div className="border-b-2 border-black pb-1">
              <span className="block text-neutral-500 text-[10px] uppercase font-sans">Reviewed By</span>
              &nbsp;
            </div>
            <div className="border-b-2 border-black pb-1">
              <span className="block text-neutral-500 text-[10px] uppercase font-sans">Date</span>
              &nbsp;
            </div>
          </div>
        </div>
      </div>

      {/* Social / Direct Link Sharing */}
      <div className="no-print">
        <ShareResultActions 
          title="Fiji VAT Lodgement Calculator (Form IRS024 Reference)"
          summary={`Fiji VAT Position: ${results.positionLabel} - ${formatFjdCurrency(results.netAmountAbsolute)}`}
        />
      </div>
    </div>
  );
}
