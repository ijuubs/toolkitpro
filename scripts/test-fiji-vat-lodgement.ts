/**
 * Automated Regression & Verification Tests: Fiji VAT Lodgement Engine
 * 
 * Verifies all Phase 7 test scenarios specified in the ToolkitPro task list:
 * - Gross taxable sales at verified 12.5% rate
 * - Zero-rated and exempt supply separation
 * - Nil transaction handling
 * - Eligible local purchases and capital asset input credits
 * - Payable vs credit balance handling
 * - Adjustment reversals and directionality
 * - Calendar date and deadline handling (monthly vs quarterly)
 * - Leap year and month-end boundary conditions
 * - Unverified penalty safeguard
 */

import { 
  calculateFijiVatLodgement, 
  calculateStatutoryDueDate, 
  parseDateParts, 
  roundCurrency,
  formatFjdCurrency,
  LodgementInputValues 
} from '../src/utils/fijiVatLodgementEngine';
import { FIJI_VAT_RATES, FIJI_VAT_DISCLAIMER, UNVERIFIED_PENALTY_NOTICE } from '../src/utils/fijiTaxConfig';

console.log('====================================================');
console.log('🧪 FIJI VAT LODGEMENT CALCULATOR — AUTOMATED TEST SUITE');
console.log('====================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assertTest(condition: boolean, testName: string, details?: string) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${testName}${details ? ` -> ${details}` : ''}`);
    failedTests++;
  }
}

const DEFAULT_BASE_INPUT: LodgementInputValues = {
  taxpayerName: 'Test Business',
  tin: '50-12345-0-1',
  branch: '00',
  frequency: 'monthly',
  periodEndDate: '2026-03-31',
  actualFilingDate: '2026-04-15',
  rateKey: 'standard_current',
  standardSalesGross: '0',
  zeroRatedSales: '0',
  exemptSales: '0',
  outputAdjustmentType: 'increase',
  outputAdjustmentAmount: '0',
  localPurchasesGross: '0',
  capitalPurchasesGross: '0',
  customsImportVat: '0',
  inputAdjustmentType: 'increase',
  inputAdjustmentAmount: '0',
};

// 1. Gross taxable sales of FJD 1,125 at a verified 12.5% rate -> Output VAT of FJD 125
console.log('1. Output Tax: Standard-Rated Supplies');
{
  const res = calculateFijiVatLodgement({
    ...DEFAULT_BASE_INPUT,
    standardSalesGross: '1125',
  });
  // 1125 * (12.5 / 112.5) = 1125 * (1/9) = 125.00
  assertTest(res.box1Vat === 125.00, 'Gross sales of FJD 1,125 yields Output VAT of FJD 125.00', `Got ${res.box1Vat}`);
  assertTest(res.box1Net === 1000.00, 'Net sales excludes VAT correctly at FJD 1,000.00', `Got ${res.box1Net}`);
  assertTest(res.totalOutputTax === 125.00, 'Total Output Tax equals FJD 125.00', `Got ${res.totalOutputTax}`);
}

// 2. Zero-rated supplies -> No standard-rated output VAT
console.log('\n2. Output Tax: Zero-Rated Supplies');
{
  const res = calculateFijiVatLodgement({
    ...DEFAULT_BASE_INPUT,
    standardSalesGross: '0',
    zeroRatedSales: '50000',
  });
  assertTest(res.box1Vat === 0, 'Zero-rated supplies generate $0 Output VAT', `Got ${res.box1Vat}`);
  assertTest(res.totalOutputTax === 0, 'Total Output Tax is 0 for zero-rated sales', `Got ${res.totalOutputTax}`);
  assertTest(res.totalSupplies === 50000.00, 'Total supplies reflects zero-rated gross', `Got ${res.totalSupplies}`);
}

// 3. Exempt supplies -> No standard-rated output VAT
console.log('\n3. Output Tax: Exempt Supplies');
{
  const res = calculateFijiVatLodgement({
    ...DEFAULT_BASE_INPUT,
    standardSalesGross: '0',
    exemptSales: '25000',
  });
  assertTest(res.box1Vat === 0, 'Exempt supplies generate $0 Output VAT', `Got ${res.box1Vat}`);
  assertTest(res.totalOutputTax === 0, 'Total Output Tax is 0 for exempt sales', `Got ${res.totalOutputTax}`);
  assertTest(res.totalSupplies === 25000.00, 'Total supplies reflects exempt gross', `Got ${res.totalSupplies}`);
}

// 4. No transactions -> Zero VAT balance
console.log('\n4. Nil Transactions');
{
  const res = calculateFijiVatLodgement({
    ...DEFAULT_BASE_INPUT,
    standardSalesGross: '0',
    zeroRatedSales: '0',
    exemptSales: '0',
    localPurchasesGross: '0',
    capitalPurchasesGross: '0',
    customsImportVat: '0',
  });
  assertTest(res.totalOutputTax === 0, 'Total Output Tax is 0', `Got ${res.totalOutputTax}`);
  assertTest(res.totalInputTax === 0, 'Total Input Tax is 0', `Got ${res.totalInputTax}`);
  assertTest(res.positionStatus === 'nil', 'Status is nil balance', `Got ${res.positionStatus}`);
  assertTest(res.netAmountAbsolute === 0, 'Net amount is $0.00', `Got ${res.netAmountAbsolute}`);
}

// 5. Eligible purchase of FJD 450 including VAT at 12.5% -> Potential input credit of FJD 50
console.log('\n5. Input Tax Credits: Local Purchases');
{
  const res = calculateFijiVatLodgement({
    ...DEFAULT_BASE_INPUT,
    localPurchasesGross: '450',
  });
  // 450 * (12.5 / 112.5) = 450 * (1/9) = 50.00
  assertTest(res.box6Vat === 50.00, 'Eligible purchase of FJD 450 yields input credit of FJD 50.00', `Got ${res.box6Vat}`);
  assertTest(res.box6Net === 400.00, 'Net purchase cost is FJD 400.00', `Got ${res.box6Net}`);
  assertTest(res.totalInputTax === 50.00, 'Total input credit equals FJD 50.00', `Got ${res.totalInputTax}`);
}

// 6. Eligible capital asset of FJD 225 including VAT at 12.5% -> Potential input credit of FJD 25
console.log('\n6. Input Tax Credits: Capital Asset Purchases');
{
  const res = calculateFijiVatLodgement({
    ...DEFAULT_BASE_INPUT,
    capitalPurchasesGross: '225',
  });
  // 225 * (12.5 / 112.5) = 225 * (1/9) = 25.00
  assertTest(res.box7Vat === 25.00, 'Eligible capital asset of FJD 225 yields input credit of FJD 25.00', `Got ${res.box7Vat}`);
  assertTest(res.box7Net === 200.00, 'Net capital asset cost is FJD 200.00', `Got ${res.box7Net}`);
  assertTest(res.totalInputTax === 25.00, 'Total input credit equals FJD 25.00', `Got ${res.totalInputTax}`);
}

// 7. Output VAT exceeds eligible input credits -> Correct payable balance
console.log('\n7. Final Reconciliation: Payable Balance');
{
  const res = calculateFijiVatLodgement({
    ...DEFAULT_BASE_INPUT,
    standardSalesGross: '1125', // Output VAT = 125
    localPurchasesGross: '450', // Input VAT = 50
  });
  // Net balance = 125 - 50 = +75 (Payable)
  assertTest(res.netBalanceSigned === 75.00, 'Net balance is +$75.00', `Got ${res.netBalanceSigned}`);
  assertTest(res.positionStatus === 'payable', 'Position status is payable', `Got ${res.positionStatus}`);
  assertTest(res.positionLabel === 'Estimated Net VAT Payable', 'Position label correctly indicates estimated payable', `Got ${res.positionLabel}`);
}

// 8. Eligible input credits exceed output VAT -> Correct credit balance without automatically promising a refund
console.log('\n8. Final Reconciliation: Credit Balance (No Guaranteed Refund)');
{
  const res = calculateFijiVatLodgement({
    ...DEFAULT_BASE_INPUT,
    standardSalesGross: '450',  // Output VAT = 50
    localPurchasesGross: '1125', // Input VAT = 125
  });
  // Net balance = 50 - 125 = -75 (Credit)
  assertTest(res.netBalanceSigned === -75.00, 'Net balance is -$75.00', `Got ${res.netBalanceSigned}`);
  assertTest(res.positionStatus === 'credit', 'Position status is credit', `Got ${res.positionStatus}`);
  assertTest(res.netAmountAbsolute === 75.00, 'Absolute credit amount is $75.00', `Got ${res.netAmountAbsolute}`);
  assertTest(!res.positionLabel.includes('Approved Refund'), 'Label does NOT promise approved refund', `Got ${res.positionLabel}`);
  assertTest(res.positionLabel.includes('Credit Balance (Subject to FRCS Verification / Audit)'), 'Label clearly indicates credit balance subject to verification', `Got ${res.positionLabel}`);
}

// 9. Input-tax reversal or supplier credit note -> Correct direction of adjustment
console.log('\n9. Adjustments & Directionality');
{
  // Supplier credit note of $20 reducing input credits:
  const resReduction = calculateFijiVatLodgement({
    ...DEFAULT_BASE_INPUT,
    localPurchasesGross: '450', // Input VAT = 50
    inputAdjustmentType: 'decrease',
    inputAdjustmentAmount: '20',
  });
  assertTest(resReduction.totalInputTax === 30.00, 'Supplier credit note decreases claimable input tax from 50 to 30', `Got ${resReduction.totalInputTax}`);

  // Bad debt write-off of $15 increasing input credits:
  const resAddition = calculateFijiVatLodgement({
    ...DEFAULT_BASE_INPUT,
    localPurchasesGross: '450', // Input VAT = 50
    inputAdjustmentType: 'increase',
    inputAdjustmentAmount: '15',
  });
  assertTest(resAddition.totalInputTax === 65.00, 'Allowable Section 24 bad debt increases claimable input tax from 50 to 65', `Got ${resAddition.totalInputTax}`);
}

// 10. Distinct Customs SAD import VAT handling
console.log('\n10. Customs Import VAT Handling');
{
  const res = calculateFijiVatLodgement({
    ...DEFAULT_BASE_INPUT,
    localPurchasesGross: '450', // Input VAT = 50
    customsImportVat: '120.50',  // Customs VAT entered directly
  });
  assertTest(res.customsImportVat === 120.50, 'Customs import VAT is preserved without distortion', `Got ${res.customsImportVat}`);
  assertTest(res.totalInputTax === 170.50, 'Total input tax sums local purchase VAT and Customs SAD VAT (50 + 120.50 = 170.50)', `Got ${res.totalInputTax}`);
}

// 11. Validation: Malformed and negative input rejection
console.log('\n11. Input Validation & Error Handling');
{
  const resNegative = calculateFijiVatLodgement({
    ...DEFAULT_BASE_INPUT,
    standardSalesGross: '-500',
  });
  assertTest(!resNegative.isValid, 'Negative standard sales is rejected', `isValid: ${resNegative.isValid}`);
  assertTest(Boolean(resNegative.errors.standardSalesGross), 'Clear error message on negative standard sales', resNegative.errors.standardSalesGross);

  const resMalformed = calculateFijiVatLodgement({
    ...DEFAULT_BASE_INPUT,
    localPurchasesGross: 'abc',
  });
  assertTest(!resMalformed.isValid, 'Malformed string is rejected', `isValid: ${resMalformed.isValid}`);
  assertTest(Boolean(resMalformed.errors.localPurchasesGross), 'Clear error message on malformed string', resMalformed.errors.localPurchasesGross);
}

// 12. Month-end and timezone boundary tests
console.log('\n12. Calendar Date Semantics & Month-End Boundaries');
{
  // February in leap year 2024 vs non-leap 2025
  const leapDue = calculateStatutoryDueDate('2024-01-31', 'monthly');
  assertTest(leapDue === '2024-02-29', 'January 2024 (leap year) due date is 2024-02-29', `Got ${leapDue}`);

  const nonLeapDue = calculateStatutoryDueDate('2025-01-31', 'monthly');
  assertTest(nonLeapDue === '2025-02-28', 'January 2025 (non-leap year) due date is 2025-02-28', `Got ${nonLeapDue}`);

  // Year boundary (December 31 -> January 31 of next year)
  const yearEndDue = calculateStatutoryDueDate('2025-12-31', 'monthly');
  assertTest(yearEndDue === '2026-01-31', 'December 2025 monthly return due date is 2026-01-31', `Got ${yearEndDue}`);

  // String parsing without timezone shift
  const parsed = parseDateParts('2026-03-31');
  assertTest(parsed !== null && parsed.year === 2026 && parsed.month === 3 && parsed.day === 31, 'Date 2026-03-31 parsed purely as calendar day 31 without timezone shift');
}

// 13. Monthly vs Quarterly Frequency
console.log('\n13. Statutory Due Date: Monthly vs Quarterly');
{
  // Q1 ending March 31 -> Due April 30
  const q1Due = calculateStatutoryDueDate('2026-03-31', 'quarterly');
  assertTest(q1Due === '2026-04-30', 'Quarterly Q1 (March 31) due date is April 30', `Got ${q1Due}`);

  // Q2 ending June 30 -> Due July 31
  const q2Due = calculateStatutoryDueDate('2026-06-30', 'quarterly');
  assertTest(q2Due === '2026-07-31', 'Quarterly Q2 (June 30) due date is July 31', `Got ${q2Due}`);

  // Q4 ending December 31 -> Due January 31 of next year
  const q4Due = calculateStatutoryDueDate('2026-12-31', 'quarterly');
  assertTest(q4Due === '2027-01-31', 'Quarterly Q4 (Dec 31) due date is January 31 of next year', `Got ${q4Due}`);
}

// 14. Unverified Penalty Safeguard: No Authoritative Penalty Amount Displayed
console.log('\n14. Unverified Penalty Safeguard');
{
  const resOverdue = calculateFijiVatLodgement({
    ...DEFAULT_BASE_INPUT,
    periodEndDate: '2026-03-31',
    actualFilingDate: '2026-06-15', // Overdue past April 30
    standardSalesGross: '1125',    // Output VAT = 125
  });
  assertTest(resOverdue.isOverdue === true, 'Correctly flags overdue lodgement', `isOverdue: ${resOverdue.isOverdue}`);
  assertTest(resOverdue.calendarDaysOverdue > 0, 'Computes pure calendar days overdue', `Days: ${resOverdue.calendarDaysOverdue}`);
  assertTest(resOverdue.penaltyStatusMessage === UNVERIFIED_PENALTY_NOTICE, 'Safeguard message displayed for penalties', resOverdue.penaltyStatusMessage);
  // Must NOT include unverified penalties in the payable VAT balance!
  assertTest(resOverdue.netBalanceSigned === 125.00, 'Payable balance strictly reflects pure tax liability ($125.00) without unverified penalties added', `Got ${resOverdue.netBalanceSigned}`);
}

// 15. Compliance Disclaimer Presence
console.log('\n15. Neutral Compliance Disclaimer Check');
{
  assertTest(FIJI_VAT_DISCLAIMER.includes('informational purposes only'), 'Disclaimer contains "informational purposes only"');
  assertTest(FIJI_VAT_DISCLAIMER.includes('not an official FRCS filing service'), 'Disclaimer explicitly states "not an official FRCS filing service"');
}

console.log('\n====================================================');
console.log(`TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED out of ${totalTests} total tests`);
console.log('====================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL FIJI VAT LODGEMENT TESTS PASSED PERFECTLY!\n');
}
