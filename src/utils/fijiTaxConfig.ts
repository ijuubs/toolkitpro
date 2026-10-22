/**
 * Fiji Tax & VAT Configuration Module
 * 
 * Centralizes statutory tax rates, historical reference rates, tax fractions,
 * and compliance metadata. Every rate records its statutory source,
 * effective dates, and verification status.
 */

export interface TaxRateConfig {
  id: string;
  name: string;
  ratePercent: number;
  effectiveFrom: string; // ISO date string YYYY-MM-DD
  effectiveTo: string | null; // null if currently active
  source: string;
  verificationStatus: 'verified' | 'unverified' | 'historical';
  description: string;
}

export const FIJI_VAT_RATES: Record<string, TaxRateConfig> = {
  standard_current: {
    id: 'standard_current',
    name: 'Current Standard VAT (12.5%)',
    ratePercent: 12.5,
    effectiveFrom: '2023-08-01',
    effectiveTo: null,
    source: 'Fiji National Budget 2023-2024 / Value Added Tax (Amendment) Act 2023',
    verificationStatus: 'verified',
    description: 'Unified standard Value Added Tax rate applicable to standard-rated supplies and commercial imports in Fiji from 1 August 2023 onwards.'
  },
  standard_historical_9: {
    id: 'standard_historical_9',
    name: 'Historical Standard VAT (9.0%)',
    ratePercent: 9.0,
    effectiveFrom: '2016-01-01',
    effectiveTo: '2023-07-31',
    source: 'Value Added Tax (Amendment) Act 2015',
    verificationStatus: 'historical',
    description: 'Standard VAT rate applicable to taxable supplies from 1 January 2016 to 31 July 2023.'
  },
  zero_rated: {
    id: 'zero_rated',
    name: 'Zero-Rated Supplies (0%)',
    ratePercent: 0.0,
    effectiveFrom: '1992-07-01',
    effectiveTo: null,
    source: 'Value Added Tax Act 1991, Second Schedule',
    verificationStatus: 'verified',
    description: 'Exports of goods and services, prescribed basic food items, and prescribed medicines. Taxed at 0% with input tax credit eligibility.'
  },
  exempt: {
    id: 'exempt',
    name: 'Exempt Supplies (No VAT)',
    ratePercent: 0.0,
    effectiveFrom: '1992-07-01',
    effectiveTo: null,
    source: 'Value Added Tax Act 1991, First Schedule',
    verificationStatus: 'verified',
    description: 'Residential dwelling rentals, financial and banking services, life insurance, and education. Excluded from VAT; no input tax credit eligibility.'
  }
};

/**
 * Computes the statutory VAT fraction for extracting VAT from a VAT-inclusive amount.
 * Formula: Rate / (100 + Rate)
 * E.g., for 12.5%: 12.5 / 112.5 = 1/9
 */
export function getTaxFraction(ratePercent: number): number {
  if (ratePercent <= 0) return 0;
  return ratePercent / (100 + ratePercent);
}

/**
 * Standard Informational & Compliance Disclaimer
 */
export const FIJI_VAT_DISCLAIMER = 
  'This calculator provides estimates for informational purposes only. Tax rates, eligibility rules, return-box mappings, filing deadlines and other requirements must be verified against the applicable Fiji Revenue and Customs Service guidance. This tool is not an official FRCS filing service, and its output should be reviewed before being used for a tax return.';

export const UNVERIFIED_PENALTY_NOTICE = 
  'Statutory late filing penalties and interest are not calculated — official penalty rules and assessment formulas require formal verification with FRCS.';
