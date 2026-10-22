# Implementation Plan: Fiji VAT Lodgement & Reconciliation Calculator (FRCS Form IRS024)

Build an interactive, high-precision statutory VAT Lodgement Calculator tailored for Fiji businesses, tax agents, and sole proprietors complying with the Fiji Revenue and Customs Service (FRCS) VAT Return framework (Form IRS024 / VTS guidelines).

## 1. Core Architecture & Features

### A. Form IRS024 Complete Structure & Calculations
1. **Taxpayer & Return Period Details**:
   - Business / Trading Name, Taxpayer Identification Number (TIN), Branch Number.
   - Filing Frequency: Monthly or Quarterly.
   - Return Period Ending Date with automatic statutory statutory FRCS due date calculation (last day of the calendar month following the period end).
2. **Output Tax (Sales & Supplies)**:
   - **Line 1 - Standard Rated Supplies (12.5% VAT)**: Gross sales inclusive of 12.5% VAT. Computes Output Tax using the FRCS tax fraction $12.5 / 112.5$ (or $1/9$).
   - **Line 2 - Zero-Rated Supplies (0% VAT)**: Eligible exports, qualifying basic consumer staples (rice, flour, tinned fish, edible oil, etc.), prescribed pharmaceuticals.
   - **Line 3 - Exempt Supplies**: Non-taxable supplies (residential accommodation rent, financial services, education).
   - **Line 4 - Total Supplies**: Sum of Lines 1, 2, and 3.
   - **Line 5 - Adjustments & Output Tax Total**: Output tax payable on standard supplies plus any debit notes, bad debt recoveries, or adjustments.
3. **Input Tax Credits (Purchases, Imports & Expenses)**:
   - **Line 6 - Local Standard Rated Purchases / Expenses**: Operating expenses with valid FRCS Tax Invoices ($12.5 / 112.5$).
   - **Line 7 - Capital Asset Acquisitions**: Qualifying business machinery, equipment, motor vehicles.
   - **Line 8 - Customs Import VAT**: VAT paid directly on FRCS Customs Single Administrative Documents (SAD).
   - **Line 9 - Input Tax Adjustments**: Supplier credit notes, allowable Section 24 bad debt write-offs, prior-period allowable adjustments.
   - **Line 10 - Total Allowable Input Tax**: Sum of claimable input VAT.
4. **Net VAT Determination**:
   - **Line 11 - Net VAT Position**: Line 5 minus Line 10.
   - High-contrast visual status: **PAYABLE TO FRCS** (dark red/amber badge) or **REFUND CLAIMABLE / CREDIT FORWARD** (emerald/cyan badge).

### B. Statutory Late Filing & Payment Penalty Calculator
- Interactive due date check comparing statutory FRCS due date against actual/planned lodgement date.
- Days overdue counter.
- FRCS statutory penalty modeling (Tax Administration Act 2009):
  - Late Lodgement Penalty: Estimated 20% on net unpaid tax + 5% per month (or fraction of month) overdue.
  - Late Payment Penalty: Estimated statutory late payment interest/penalty.
  - Clear statutory disclaimer regarding official FRCS assessment notices.

### C. Export & Practical Workflow Tools
- **Printable Official Return Worksheet**: Print-optimized stylesheet (`@media print`) rendering a clean, professional Form IRS024 reconciliation report with taxpayer details, line-item numbers, and signature section.
- **CSV Data Export**: Formatted spreadsheet download with line numbers, descriptions, taxable amounts, and calculated tax for accounting ledgers.
- **Instant Pre-fill Presets**:
  - "Load Retail Store Sample" (standard sales, local purchases, modest import VAT).
  - "Load Tourism / Export Operator Sample" (high zero-rated export sales, input tax refund scenario).
  - "Clear All Fields" button.

## 2. Design System & Compliance (Neu-Brutalism & AGENTS.md)
- **Visuals**: Stark high-contrast borders (`border-4 border-black`), sharp corners, drop shadows (`shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`), `#F5F5F5` canvas, and bold accents (`bg-yellow-400`, `bg-yellow-300`, `bg-black text-white`).
- **Interactive Feedback**: Hover button press animations (`active:translate-x-0.5 active:translate-y-0.5 active:shadow-none`).
- **Zero Pill / Anti-AI Slop**: Hard corners, uppercase bold headers, authentic Fijian currency formatting (`FJD $`).
- **AdSlot Integration**: Proper placement outside primary calculation and export controls to avoid CLS.

## 3. SEO & Application Integration
1. **Tool Component**: `src/components/tools/FijiVatLodgementCalculator.tsx`.
2. **Metadata & Content** (`src/data/toolsData.ts`):
   - Slug: `fiji-vat-lodgement-calculator`
   - Aliases: `fiji-vat-return-calculator`, `frcs-vat-calculator`, `fiji-irs024-calculator`, `fiji-vat-filing-tool`.
   - Comprehensive `howTo` guide (1,200+ words) covering FRCS Form IRS024 line-by-line instructions, tax fractions ($12.5 / 112.5$), zero-rated vs exempt distinctions, input tax invoice substantiation rules, and lodgement calendars.
   - Rich FAQs answering 6+ specific questions on penalties, VTS compliance, and refunds.
   - Schema.org `WebApplication` structured data.
3. **Routing & Dynamic Loading** (`src/pages/ToolTemplate.tsx`):
   - Lazy load `FijiVatLodgementCalculator` component.
4. **Internal Linking** (`src/utils/relatedTools.ts`):
   - Cross-link with `fiji-vat-calculator`, `fiji-paye-calculator`, `freight-calculator`, `invoice-generator`, etc.
5. **Audits & Verification**:
   - Update `scripts/seo-audit.ts` expected tools count and list.
   - Run `npm run lint` and `npm run build` (`compile_applet`).
