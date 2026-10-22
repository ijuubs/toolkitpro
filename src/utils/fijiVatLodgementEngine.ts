/**
 * Fiji VAT Lodgement & Reconciliation Engine (Form IRS024 Reference Logic)
 * 
 * Provides pure, unit-testable mathematical calculations, date parsing,
 * deadline determinations, and validation without external dependencies or DOM.
 */

import { FIJI_VAT_RATES, getTaxFraction, FIJI_VAT_DISCLAIMER, UNVERIFIED_PENALTY_NOTICE } from './fijiTaxConfig';

export interface LodgementInputValues {
  taxpayerName: string;
  tin: string;
  branch: string;
  frequency: 'monthly' | 'quarterly';
  periodEndDate: string; // YYYY-MM-DD
  actualFilingDate: string; // YYYY-MM-DD
  rateKey: string; // 'standard_current' (12.5%) or 'standard_historical_9' (9.0%)
  
  // Sales / Supplies
  standardSalesGross: string; // VAT-inclusive gross sales
  zeroRatedSales: string;
  exemptSales: string;
  outputAdjustmentType: 'increase' | 'decrease';
  outputAdjustmentAmount: string;
  
  // Purchases / Expenses
  localPurchasesGross: string; // VAT-inclusive gross operating purchases
  capitalPurchasesGross: string; // VAT-inclusive gross capital asset purchases
  customsImportVat: string; // Actual VAT amount paid on Customs SAD entry
  inputAdjustmentType: 'increase' | 'decrease'; // increase = allowable write-off; decrease = supplier credit note
  inputAdjustmentAmount: string;
}

export interface ValidationErrors {
  periodEndDate?: string;
  actualFilingDate?: string;
  standardSalesGross?: string;
  zeroRatedSales?: string;
  exemptSales?: string;
  outputAdjustmentAmount?: string;
  localPurchasesGross?: string;
  capitalPurchasesGross?: string;
  customsImportVat?: string;
  inputAdjustmentAmount?: string;
  general?: string;
}

export interface LodgementCalculationResults {
  // Configured rate metadata
  ratePercent: number;
  taxFraction: number;
  rateSource: string;
  
  // Box 1: Standard Supplies
  standardSalesGross: number;
  box1Vat: number;
  box1Net: number;
  
  // Box 2 & 3
  zeroRatedSales: number;
  exemptSales: number;
  
  // Box 4: Total Supplies
  totalSupplies: number;
  
  // Box 5: Total Output Tax
  outputAdjustmentSigned: number;
  totalOutputTax: number;
  
  // Box 6: Local Purchases
  localPurchasesGross: number;
  box6Vat: number;
  box6Net: number;
  
  // Box 7: Capital Asset Purchases
  capitalPurchasesGross: number;
  box7Vat: number;
  box7Net: number;
  
  // Box 8: Customs Import VAT
  customsImportVat: number;
  
  // Box 9: Input Tax Adjustments
  inputAdjustmentSigned: number;
  
  // Box 10: Total Allowable Input Tax Credits
  totalInputTax: number;
  
  // Box 11: Net VAT Determination
  netBalanceSigned: number; // positive = payable; negative = credit
  netAmountAbsolute: number;
  positionStatus: 'payable' | 'credit' | 'nil';
  positionLabel: string;
  
  // Filing Dates & Deadlines
  isPeriodDateValid: boolean;
  statutoryDueDate: string; // YYYY-MM-DD
  isOverdue: boolean;
  calendarDaysOverdue: number;
  
  // Penalty Status (Strictly unverified safeguard)
  penaltyStatusMessage: string;
  
  // Validation
  errors: ValidationErrors;
  isValid: boolean;
}

/**
 * Standard Cent-Precision Monetary Rounding
 * Prevents floating-point accumulation errors ($0.1 + $0.2 = $0.30000000000000004)
 */
export function roundCurrency(val: number): number {
  if (!isFinite(val)) return 0;
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

/**
 * Formats a numeric currency value as standard Fijian Dollars ($ #,##0.00)
 */
export function formatFjdCurrency(val: number): string {
  if (!isFinite(val)) return '$0.00';
  return '$' + val.toLocaleString('en-FJ', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Parses and validates a calendar date string (YYYY-MM-DD)
 * Pure string parsing without timezone offsets to prevent shifting calendar days.
 */
export function parseDateParts(dateStr: string): { year: number; month: number; day: number } | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const match = dateStr.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);
  
  if (year < 1990 || year > 2100) return null;
  if (month < 1 || month > 12) return null;
  
  const daysInMonth = getDaysInCalendarMonth(year, month);
  if (day < 1 || day > daysInMonth) return null;
  
  return { year, month, day };
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

export function getDaysInCalendarMonth(year: number, month: number): number {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  if ([4, 6, 9, 11].includes(month)) return 30;
  return 31;
}

/**
 * Calculates statutory filing deadline for Fiji VAT returns:
 * - Monthly: Last calendar day of the month following the taxable period.
 * - Quarterly: Last calendar day of the month following the calendar quarter end.
 */
export function calculateStatutoryDueDate(
  periodEndDateStr: string,
  frequency: 'monthly' | 'quarterly'
): string | null {
  const parts = parseDateParts(periodEndDateStr);
  if (!parts) return null;
  
  const { year, month } = parts;
  
  if (frequency === 'monthly') {
    let nextMonth = month + 1;
    let targetYear = year;
    if (nextMonth > 12) {
      nextMonth = 1;
      targetYear += 1;
    }
    const daysInNextMonth = getDaysInCalendarMonth(targetYear, nextMonth);
    return `${targetYear}-${String(nextMonth).padStart(2, '0')}-${String(daysInNextMonth).padStart(2, '0')}`;
  } else {
    // Quarterly frequency
    // Identify quarter end month: Q1 -> 3, Q2 -> 6, Q3 -> 9, Q4 -> 12
    let quarterEndMonth = 3;
    if (month > 3 && month <= 6) quarterEndMonth = 6;
    else if (month > 6 && month <= 9) quarterEndMonth = 9;
    else if (month > 9) quarterEndMonth = 12;
    
    let dueMonth = quarterEndMonth + 1;
    let dueYear = year;
    if (dueMonth > 12) {
      dueMonth = 1;
      dueYear += 1;
    }
    const days = getDaysInCalendarMonth(dueYear, dueMonth);
    return `${dueYear}-${String(dueMonth).padStart(2, '0')}-${String(days).padStart(2, '0')}`;
  }
}

/**
 * Calculates pure calendar day difference without UTC/timezone shift
 */
export function calculateCalendarDaysDifference(dateStrA: string, dateStrB: string): number | null {
  const a = parseDateParts(dateStrA);
  const b = parseDateParts(dateStrB);
  if (!a || !b) return null;
  
  const utcA = Date.UTC(a.year, a.month - 1, a.day);
  const utcB = Date.UTC(b.year, b.month - 1, b.day);
  
  return Math.round((utcA - utcB) / (1000 * 60 * 60 * 24));
}

/**
 * Safely parses and validates a monetary string input
 */
export function parseMonetaryInput(val: string): { amount: number; error?: string } {
  if (val === undefined || val === null || val.trim() === '') {
    return { amount: 0 };
  }
  const clean = val.trim();
  const num = Number(clean);
  if (isNaN(num) || !isFinite(num)) {
    return { amount: 0, error: 'Please enter a valid numeric amount' };
  }
  if (num < 0) {
    return { amount: 0, error: 'Amount cannot be negative. Use adjustment controls for reductions.' };
  }
  return { amount: roundCurrency(num) };
}

/**
 * Main Calculation Engine for Fiji VAT Lodgement & Reconciliation
 */
export function calculateFijiVatLodgement(inputs: LodgementInputValues): LodgementCalculationResults {
  const errors: ValidationErrors = {};
  
  // 1. Resolve Tax Rate Configuration
  const rateConfig = FIJI_VAT_RATES[inputs.rateKey] || FIJI_VAT_RATES.standard_current;
  const ratePercent = rateConfig.ratePercent;
  const taxFraction = getTaxFraction(ratePercent);
  
  // 2. Validate Monetary Inputs
  const parsedStandardSales = parseMonetaryInput(inputs.standardSalesGross);
  if (parsedStandardSales.error) errors.standardSalesGross = parsedStandardSales.error;
  
  const parsedZeroRated = parseMonetaryInput(inputs.zeroRatedSales);
  if (parsedZeroRated.error) errors.zeroRatedSales = parsedZeroRated.error;
  
  const parsedExempt = parseMonetaryInput(inputs.exemptSales);
  if (parsedExempt.error) errors.exemptSales = parsedExempt.error;
  
  const parsedOutputAdj = parseMonetaryInput(inputs.outputAdjustmentAmount);
  if (parsedOutputAdj.error) errors.outputAdjustmentAmount = parsedOutputAdj.error;
  
  const parsedLocalPurchases = parseMonetaryInput(inputs.localPurchasesGross);
  if (parsedLocalPurchases.error) errors.localPurchasesGross = parsedLocalPurchases.error;
  
  const parsedCapitalPurchases = parseMonetaryInput(inputs.capitalPurchasesGross);
  if (parsedCapitalPurchases.error) errors.capitalPurchasesGross = parsedCapitalPurchases.error;
  
  const parsedCustomsVat = parseMonetaryInput(inputs.customsImportVat);
  if (parsedCustomsVat.error) errors.customsImportVat = parsedCustomsVat.error;
  
  const parsedInputAdj = parseMonetaryInput(inputs.inputAdjustmentAmount);
  if (parsedInputAdj.error) errors.inputAdjustmentAmount = parsedInputAdj.error;
  
  // 3. Validate Dates
  const periodParts = parseDateParts(inputs.periodEndDate);
  if (!periodParts) {
    errors.periodEndDate = 'Please enter a valid period end date (YYYY-MM-DD)';
  }
  
  let statutoryDueDate = 'N/A';
  let isOverdue = false;
  let calendarDaysOverdue = 0;
  
  if (periodParts) {
    const calculatedDue = calculateStatutoryDueDate(inputs.periodEndDate, inputs.frequency);
    if (calculatedDue) {
      statutoryDueDate = calculatedDue;
      
      const filingParts = parseDateParts(inputs.actualFilingDate);
      if (filingParts) {
        const daysDiff = calculateCalendarDaysDifference(inputs.actualFilingDate, calculatedDue);
        if (daysDiff !== null && daysDiff > 0) {
          isOverdue = true;
          calendarDaysOverdue = daysDiff;
        }
      } else if (inputs.actualFilingDate) {
        errors.actualFilingDate = 'Please enter a valid actual filing date (YYYY-MM-DD)';
      }
    }
  }
  
  // 4. Output Tax Calculations (Part A)
  // Standard-Rated Output VAT: Gross * Rate / (100 + Rate)
  const standardSalesGross = parsedStandardSales.amount;
  const box1Vat = roundCurrency(standardSalesGross * taxFraction);
  const box1Net = roundCurrency(standardSalesGross - box1Vat);
  
  const zeroRatedSales = parsedZeroRated.amount;
  const exemptSales = parsedExempt.amount;
  
  // Box 4: Total Supplies (Gross sum of standard, zero-rated, and exempt)
  const totalSupplies = roundCurrency(standardSalesGross + zeroRatedSales + exemptSales);
  
  // Output Adjustment
  const outputAdjustmentAmount = parsedOutputAdj.amount;
  const outputAdjustmentSigned = inputs.outputAdjustmentType === 'increase'
    ? outputAdjustmentAmount
    : -outputAdjustmentAmount;
    
  // Box 5: Total Output Tax Payable
  const totalOutputTax = roundCurrency(Math.max(0, box1Vat + outputAdjustmentSigned));
  
  // 5. Input Tax Credits Calculations (Part B)
  // Box 6: Local Purchases VAT: Gross * Rate / (100 + Rate)
  const localPurchasesGross = parsedLocalPurchases.amount;
  const box6Vat = roundCurrency(localPurchasesGross * taxFraction);
  const box6Net = roundCurrency(localPurchasesGross - box6Vat);
  
  // Box 7: Capital Asset Purchases VAT: Gross * Rate / (100 + Rate)
  const capitalPurchasesGross = parsedCapitalPurchases.amount;
  const box7Vat = roundCurrency(capitalPurchasesGross * taxFraction);
  const box7Net = roundCurrency(capitalPurchasesGross - box7Vat);
  
  // Box 8: Customs Import VAT (Entered directly as VAT amount paid on SAD)
  const customsImportVat = parsedCustomsVat.amount;
  
  // Box 9: Input Tax Adjustments
  const inputAdjustmentAmount = parsedInputAdj.amount;
  const inputAdjustmentSigned = inputs.inputAdjustmentType === 'increase'
    ? inputAdjustmentAmount
    : -inputAdjustmentAmount; // e.g. supplier credit note reducing claimable credit
    
  // Box 10: Total Allowable Input Tax Credits
  const totalInputTax = roundCurrency(Math.max(0, box6Vat + box7Vat + customsImportVat + inputAdjustmentSigned));
  
  // 6. Box 11: Final Net VAT Determination
  const netBalanceSigned = roundCurrency(totalOutputTax - totalInputTax);
  const netAmountAbsolute = Math.abs(netBalanceSigned);
  
  let positionStatus: 'payable' | 'credit' | 'nil' = 'nil';
  let positionLabel = 'Estimated Nil Balance ($0.00)';
  
  if (netBalanceSigned > 0.004) {
    positionStatus = 'payable';
    positionLabel = 'Estimated Net VAT Payable';
  } else if (netBalanceSigned < -0.004) {
    positionStatus = 'credit';
    positionLabel = 'Estimated Credit Balance (Subject to FRCS Verification / Audit)';
  }
  
  const isValid = Object.keys(errors).length === 0;
  
  return {
    ratePercent,
    taxFraction,
    rateSource: rateConfig.source,
    
    standardSalesGross,
    box1Vat,
    box1Net,
    
    zeroRatedSales,
    exemptSales,
    
    totalSupplies,
    
    outputAdjustmentSigned,
    totalOutputTax,
    
    localPurchasesGross,
    box6Vat,
    box6Net,
    
    capitalPurchasesGross,
    box7Vat,
    box7Net,
    
    customsImportVat,
    
    inputAdjustmentSigned,
    totalInputTax,
    
    netBalanceSigned,
    netAmountAbsolute,
    positionStatus,
    positionLabel,
    
    isPeriodDateValid: Boolean(periodParts),
    statutoryDueDate,
    isOverdue,
    calendarDaysOverdue,
    
    penaltyStatusMessage: UNVERIFIED_PENALTY_NOTICE,
    
    errors,
    isValid
  };
}
