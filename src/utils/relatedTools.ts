import { Tool, TOOLS } from '../data/toolsData';

export interface CategoryInfo {
  slug: string;
  name: string;
}

/**
 * Maps any tool to its official live category route and display name.
 * Prevents 404s in breadcrumbs and Schema.org BreadcrumbList.
 */
export function getToolCategoryInfo(tool: Tool): CategoryInfo {
  if (tool.category === 'Fiji Tools' || tool.slug.startsWith('fiji-')) {
    return { slug: 'fiji-tools', name: 'Fiji Tools' };
  }

  if (['Finance Tools', 'Health', 'Health Tools', 'Math Tools'].includes(tool.category)) {
    return { slug: 'calculators', name: 'Calculators' };
  }

  if (['Web Tools', 'Security'].includes(tool.category) || tool.slug === 'diff-checker') {
    return { slug: 'developer-tools', name: 'Developer Tools' };
  }

  if (tool.category === 'Text Tools') {
    return { slug: 'text-tools', name: 'Text Tools' };
  }

  if (tool.slug === 'image-resizer' || tool.category === 'Image Tools') {
    return { slug: 'image-tools', name: 'Image Tools' };
  }

  if (tool.category === 'Converter' || tool.category === 'Converters') {
    return { slug: 'converters', name: 'Converters' };
  }

  if (tool.category === 'Color Tools' || tool.slug === 'color-picker') {
    return { slug: 'color-tools', name: 'Color Tools' };
  }

  return { slug: 'calculators', name: 'Calculators' };
}

/**
 * Curated, semantic relationship graph for all tools.
 * Prioritizes functional relevance and real user workflow transitions.
 */
const RELATED_TOOLS_MAP: Record<string, string[]> = {
  // Text & Developer Tools
  'diff-checker': ['markdown-to-html', 'word-counter', 'json-formatter', 'base64-encoder-decoder'],
  'markdown-to-html': ['diff-checker', 'word-counter', 'lorem-ipsum', 'base64-encoder-decoder'],
  'word-counter': ['diff-checker', 'markdown-to-html', 'lorem-ipsum', 'json-formatter'],
  'lorem-ipsum': ['word-counter', 'markdown-to-html', 'diff-checker', 'qr-code-generator'],
  'json-formatter': ['diff-checker', 'base64-encoder-decoder', 'url-encoder', 'qr-code-generator'],
  'base64-encoder-decoder': ['url-encoder', 'json-formatter', 'diff-checker', 'password-generator'],
  'url-encoder': ['base64-encoder-decoder', 'json-formatter', 'qr-code-generator', 'diff-checker'],
  'password-generator': ['qr-code-generator', 'base64-encoder-decoder', 'url-encoder', 'diff-checker'],
  'qr-code-generator': ['url-encoder', 'password-generator', 'color-picker', 'image-resizer'],
  
  // Converters & Image
  'pdf-compressor': ['image-resizer', 'unit-converter', 'word-counter', 'markdown-to-html'],
  'image-resizer': ['pdf-compressor', 'color-picker', 'unit-converter', 'qr-code-generator'],
  'color-picker': ['image-resizer', 'qr-code-generator', 'base64-encoder-decoder', 'markdown-to-html'],
  'unit-converter': ['percentage-calculator', 'pdf-compressor', 'image-resizer', 'loan-calculator'],

  // Fiji Tools Suite
  'fiji-vat-calculator': ['fiji-salary-calculator', 'fiji-grocery-budget-calculator', 'fiji-duty-import-calculator', 'fiji-electricity-bill-calculator'],
  'fiji-fnpf-calculator': ['fiji-salary-calculator', 'fiji-tsls-calculator', 'fiji-mortgage-calculator', 'fiji-annual-leave-calculator'],
  'fiji-tsls-calculator': ['fiji-salary-calculator', 'fiji-fnpf-calculator', 'fiji-loan-repayment-calculator', 'fiji-mortgage-calculator'],
  'fiji-salary-calculator': ['fiji-fnpf-calculator', 'fiji-vat-calculator', 'fiji-overtime-calculator', 'fiji-tsls-calculator'],
  'fiji-taxi-fare-calculator': ['fiji-vehicle-cost-calculator', 'fiji-grocery-budget-calculator', 'fiji-electricity-bill-calculator', 'fiji-vat-calculator'],
  'fiji-grocery-budget-calculator': ['fiji-vat-calculator', 'fiji-salary-calculator', 'fiji-electricity-bill-calculator', 'fiji-taxi-fare-calculator'],
  'fiji-loan-repayment-calculator': ['fiji-mortgage-calculator', 'fiji-tsls-calculator', 'fiji-salary-calculator', 'fiji-vehicle-cost-calculator'],
  'fiji-mortgage-calculator': ['fiji-loan-repayment-calculator', 'fiji-salary-calculator', 'fiji-fnpf-calculator', 'fiji-vehicle-cost-calculator'],
  'fiji-electricity-bill-calculator': ['fiji-grocery-budget-calculator', 'fiji-taxi-fare-calculator', 'fiji-salary-calculator', 'fiji-vat-calculator'],
  'fiji-overtime-calculator': ['fiji-salary-calculator', 'fiji-annual-leave-calculator', 'fiji-fnpf-calculator', 'fiji-vat-calculator'],
  'fiji-annual-leave-calculator': ['fiji-overtime-calculator', 'fiji-salary-calculator', 'fiji-fnpf-calculator', 'fiji-tsls-calculator'],
  'fiji-vehicle-cost-calculator': ['fiji-taxi-fare-calculator', 'fiji-duty-import-calculator', 'fiji-loan-repayment-calculator', 'fiji-vat-calculator'],
  'fiji-duty-import-calculator': ['fiji-vat-calculator', 'fiji-vehicle-cost-calculator', 'fiji-grocery-budget-calculator', 'fiji-loan-repayment-calculator'],

  // Standard Calculators
  'loan-calculator': ['compound-interest-calculator', 'roi-calculator', 'sip-calculator', 'percentage-calculator'],
  'percentage-calculator': ['loan-calculator', 'roi-calculator', 'compound-interest-calculator', 'unit-converter'],
  'compound-interest-calculator': ['sip-calculator', 'roi-calculator', 'loan-calculator', 'percentage-calculator'],
  'sip-calculator': ['compound-interest-calculator', 'roi-calculator', 'loan-calculator', 'percentage-calculator'],
  'roi-calculator': ['compound-interest-calculator', 'sip-calculator', 'loan-calculator', 'percentage-calculator'],
  'bmi-calculator': ['tdee-calculator', 'age-calculator', 'percentage-calculator', 'unit-converter'],
  'tdee-calculator': ['bmi-calculator', 'age-calculator', 'percentage-calculator', 'unit-converter'],
  'age-calculator': ['bmi-calculator', 'tdee-calculator', 'percentage-calculator', 'unit-converter'],
};

/**
 * Deterministically returns genuinely related tools for any given tool.
 * Never uses Math.random() so search engine crawls remain stable.
 */
export function getRelatedTools(tool: Tool, limit = 4): Tool[] {
  const toolMap = new Map(TOOLS.map(t => [t.slug, t]));
  const curatedSlugs = RELATED_TOOLS_MAP[tool.slug] || [];
  const results: Tool[] = [];
  const addedSlugs = new Set<string>([tool.slug]);

  // 1. Add curated related tools first
  for (const slug of curatedSlugs) {
    const candidate = toolMap.get(slug);
    if (candidate && !addedSlugs.has(candidate.slug)) {
      results.push(candidate);
      addedSlugs.add(candidate.slug);
      if (results.length >= limit) return results;
    }
  }

  // 2. Add tools from the same category
  for (const candidate of TOOLS) {
    if (candidate.category === tool.category && !addedSlugs.has(candidate.slug)) {
      results.push(candidate);
      addedSlugs.add(candidate.slug);
      if (results.length >= limit) return results;
    }
  }

  // 3. Fallback to broad category info
  const categoryInfo = getToolCategoryInfo(tool);
  for (const candidate of TOOLS) {
    if (getToolCategoryInfo(candidate).slug === categoryInfo.slug && !addedSlugs.has(candidate.slug)) {
      results.push(candidate);
      addedSlugs.add(candidate.slug);
      if (results.length >= limit) return results;
    }
  }

  // 4. Fill remaining slots if necessary
  for (const candidate of TOOLS) {
    if (!addedSlugs.has(candidate.slug)) {
      results.push(candidate);
      addedSlugs.add(candidate.slug);
      if (results.length >= limit) return results;
    }
  }

  return results;
}
