import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '../config/site';
import { Tool, TOOLS } from '../data/toolsData';
import { BlogPost, BLOG_POSTS } from '../data/blogData';
import { getToolCategoryInfo, CategoryInfo } from './relatedTools';

export { getToolCategoryInfo };
export type { CategoryInfo };

/**
 * Options for generic page SEO generation
 */
export interface PageSEOOptions {
  title?: string;
  description?: string;
  path: string;
  type?: 'website' | 'article';
  image?: string;
  noindex?: boolean;
}

/**
 * Cleanly strips markdown, HTML tags, and excessive whitespace from text
 */
export function stripMarkdownAndHtml(text: string): string {
  if (!text) return '';
  return text
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove image syntax
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '')
    // Remove link syntax but keep text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove markdown headings, bold, italic, lists, blockquotes
    .replace(/^[#*>-]+\s+/gm, '')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/~~(.*?)~~/g, '$1')
    // Collapse multiple whitespaces and newlines
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Dynamically generates an absolute canonical URL from any route or slug.
 * Ensures consistent protocol, domain, normalized path, and no trailing slashes (except root).
 *
 * @param path - Relative route path (e.g. '/tools/word-counter' or 'blog/post-1')
 * @returns Fully qualified canonical URL
 */
export function generateCanonicalUrl(path: string = ''): string {
  const baseUrl = SITE_URL.replace(/\/+$/, '');
  
  // Clean path: remove query params, hashes, and extra leading/trailing slashes
  const cleanPath = path
    .split('?')[0]
    .split('#')[0]
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');

  if (!cleanPath) {
    return `${baseUrl}/`;
  }

  return `${baseUrl}/${cleanPath}`;
}

/**
 * Dynamically generates an SEO-optimized meta description.
 * Strips formatting, truncates cleanly at word boundaries, and appends ellipsis if needed.
 *
 * @param content - Source text or markdown
 * @param maxLength - Maximum character length (default: 155 for optimal Google SERP display)
 * @param fallback - Fallback string if content is empty
 * @returns Clean, truncated meta description
 */
export function generateMetaDescription(
  content: string,
  maxLength: number = 155,
  fallback: string = SITE_DESCRIPTION
): string {
  const clean = stripMarkdownAndHtml(content || '');
  if (!clean) return fallback;

  if (clean.length <= maxLength) {
    return clean;
  }

  // Truncate to the nearest full word before maxLength
  const truncated = clean.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');

  if (lastSpaceIndex > maxLength * 0.7) {
    return `${truncated.substring(0, lastSpaceIndex).trim()}...`;
  }

  return `${truncated.trim()}...`;
}

/**
 * Helper to generate complete SEO metadata & structured data for a Tool template page
 */
export function generateToolSEO(tool: Tool, currentSlug?: string) {
  const isAlias = Boolean(currentSlug && tool.aliases?.includes(currentSlug));
  
  // Derive display title (e.g., handling SEO alias variations like mortgage-calculator)
  const displayTitle = isAlias && currentSlug
    ? currentSlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : tool.name;

  const titleTag = tool.titleTag || `${displayTitle} | 100% Free & Private | ${SITE_NAME}`;
  
  // Prefer custom meta description if available, otherwise generate one from tool description/howTo
  const metaDescription = generateMetaDescription(
    tool.metaDescription || `${tool.description} Fast, secure, and runs 100% client-side in your browser.`,
    155
  );

  const canonicalUrl = generateCanonicalUrl(`/tools/${tool.slug}`);
  const currentUrl = currentSlug ? generateCanonicalUrl(`/tools/${currentSlug}`) : canonicalUrl;
  const categoryInfo = getToolCategoryInfo(tool);

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${SITE_URL}/`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: categoryInfo.name,
          item: `${SITE_URL}/${categoryInfo.slug}`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: displayTitle,
          item: currentUrl
        }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: displayTitle,
      url: currentUrl,
      description: metaDescription,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All Modern Web Browsers',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      },
      featureList: tool.description
    },
    ...(tool.faqs && tool.faqs.length > 0
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: tool.faqs.map(faq => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
              }
            }))
          }
        ]
      : [])
  ];

  return {
    displayTitle,
    titleTag,
    metaDescription,
    canonicalUrl,
    currentUrl,
    structuredData,
    isAlias
  };
}

/**
 * Helper to generate complete SEO metadata & structured data for a Blog post page
 */
export function generateBlogSEO(post: BlogPost) {
  const titleTag = `${post.title} | ${SITE_NAME} Blog`;
  const metaDescription = generateMetaDescription(post.excerpt || post.content, 155);
  const canonicalUrl = generateCanonicalUrl(`/blog/${post.slug}`);
  const logoUrl = `${SITE_URL.replace(/\/+$/, '')}/toolkitpro-logo.jpg`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: metaDescription,
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl
    },
    author: {
      '@type': 'Person',
      name: post.author
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: logoUrl
    }
  };

  return {
    titleTag,
    metaDescription,
    canonicalUrl,
    structuredData
  };
}

export interface CategoryMeta {
  name: string;
  title: string;
  description: string;
  intro: string;
  keyFeatures: string[];
}

export const CATEGORY_METAS: Record<string, CategoryMeta> = {
  'calculators': {
    name: 'Calculators',
    title: `Free Online Calculators | Finance, Health & Math | ${SITE_NAME}`,
    description: 'Calculate loans, compound interest, ROI, SIP, BMI, TDEE, percentages, and age. Fast, accurate, client-side online calculators with zero data collection.',
    intro: 'Explore our complete suite of financial, health, and mathematical calculators. Every calculator uses verified mathematical formulas—such as standard compound interest frequencies, loan amortization schedules, WHO Body Mass Index classifications, and Mifflin-St Jeor metabolic equations. Compute everything instantly in your browser with zero latency and complete privacy.',
    keyFeatures: ['Loan & Mortgage Amortization', 'Compound Interest & SIP Projections', 'WHO-Standard Health Metrics (BMI & TDEE)', 'Everyday Percentages & Chronological Math']
  },
  'developer-tools': {
    name: 'Developer Tools',
    title: `Developer Tools | Free Online Web, Code & Security Utilities | ${SITE_NAME}`,
    description: 'Format JSON, inspect diffs, encode/decode Base64 and URLs, generate secure passwords and QR codes. 100% private, client-side browser developer tools.',
    intro: 'Engineered specifically for software developers, system administrators, and security professionals. Parse and validate JSON payloads, calculate Myers diff differences between code snippets, encode UTF-8 Base64 strings, safely encode query parameters, and generate high-entropy passwords. Because all computation runs in your local browser sandbox, confidential API keys, tokens, and proprietary configurations never touch external servers.',
    keyFeatures: ['100% Client-Side Privacy (Zero Server Logs)', 'RFC 8259 Compliant JSON Validation', 'Side-by-Side & Unified Diff Inspection', 'Cryptographically Secure Entropy Generation']
  },
  'text-tools': {
    name: 'Text Tools',
    title: `Text Tools | Word Counter, Diff Checker & Markdown Converter | ${SITE_NAME}`,
    description: 'Analyze word and character counts, compare text differences side-by-side, convert Markdown to HTML, and generate placeholder text. 100% in-browser.',
    intro: 'Streamline your copywriting, editing, and content formatting workflows. Accurately count words, characters, sentences, and paragraphs, inspect revision changes with character-level diffing, convert Markdown into sanitized HTML with live previews, and generate clean placeholder copy. No text is ever uploaded or stored.',
    keyFeatures: ['Live Character & Word Metric Analysis', 'Inline & Side-by-Side Text Comparison', 'GitHub-Flavored Markdown Preview & HTML Export', 'Zero Server Transmission']
  },
  'converters': {
    name: 'Converters',
    title: `Online File & Unit Converters | PDF Compressor & Image Resizer | ${SITE_NAME}`,
    description: 'Compress PDF documents, resize images, and convert metric/imperial measurements. Process files securely in your browser without uploading to remote servers.',
    intro: 'Transform documents, digital media, and measurement units without sacrificing speed or security. Compress heavy PDF files locally using browser-side object stream optimization, resize visual graphics with Lanczos edge-resampling, and convert between metric and imperial dimensions seamlessly. Enjoy rapid local processing without waiting for cloud upload queues.',
    keyFeatures: ['Private Client-Side PDF Re-compression', 'High-Fidelity Lanczos Image Resizing', 'Metric & Imperial Measurement Conversion', 'Instant Download with Zero Cloud Retention']
  },
  'color-tools': {
    name: 'Color Tools',
    title: `Color Tools | Online Color Picker, HEX & RGB Palette Tool | ${SITE_NAME}`,
    description: 'Inspect colors, extract HEX, RGB, and HSL values, preview high-contrast palettes, and generate CSS color codes for web design and UI development.',
    intro: 'A focused utility suite for digital designers, front-end engineers, and UI creators. Extract color codes across HEX, RGB, HSL, and CMYK formats, inspect contrast ratios for WCAG compliance, and generate copy-ready CSS color declarations. Everything updates in real time with intuitive visual sliders and hex inputs.',
    keyFeatures: ['Real-Time HEX, RGB, HSL & CMYK Conversion', 'Instant CSS Snippet Generation', 'WCAG Contrast Verification', 'High-Contrast Neu-Brutalist Palette Testing']
  },
  'fiji-tools': {
    name: 'Fiji Tools',
    title: `Fiji Calculators & Utilities | VAT, FNPF, TSLS, Salary & Taxi Tools | ${SITE_NAME}`,
    description: 'Comprehensive suite of official calculators for Fiji. Estimate 15% VAT, FNPF superannuation, TSLS student loans, PAYE salary tax, taxi fares, and electricity bills.',
    intro: 'Built specifically for the people, businesses, and workers of the Republic of Fiji. Access localized calculators aligned with current statutory regulations: FRCS Value Added Tax (standard 12.5% and historical 15%), mandatory FNPF pension contributions, TSLS/TELS student loan and bond repayment policies, ERA overtime and annual leave rules, LTA taxi meter tariffs, and Energy Fiji Limited (EFL) residential electricity tariffs. Transparent, fast, and always localized in Fiji Dollars (FJD).',
    keyFeatures: ['FRCS 12.5% & 15% VAT Breakdown', 'FNPF 8% Employee & 8%/10% Employer Pension Modeling', 'TSLS / TELS Student Debt & Bond Payback Schedules', 'LTA Regulated Taxi Meter Estimations']
  },
  'image-tools': {
    name: 'Image Tools',
    title: `Image Tools | Online Image Resizer & Color Utilities | ${SITE_NAME}`,
    description: 'Resize photos for social media or web performance, optimize dimensions, and inspect color palettes locally in your browser with zero server uploads.',
    intro: 'Optimize your digital visual assets for web speed, social media packaging, and mobile display. Adjust image pixel dimensions with aspect-ratio locking, leverage high-order resampling to maintain edge clarity, and inspect image colors. All graphic manipulation is powered by your local browser Canvas and Web Workers, keeping your private photos 100% on your device.',
    keyFeatures: ['Custom Width & Height Rescaling', 'Standard Social Media Presets', 'Aspect Ratio Lock & Lanczos Filtering', 'Local Memory Processing (Zero Server Uploads)']
  }
};

/**
 * Helper to generate SEO metadata & structured data for a Category page
 */
export function generateCategorySEO(categoryName: string, path: string, tools: Tool[]) {
  const cleanSlug = path.replace(/^\/+/, '').replace(/\/+$/, '');
  const meta = CATEGORY_METAS[cleanSlug];

  const titleTag = meta?.title || `${categoryName} | Free Online Utilities | ${SITE_NAME}`;
  const metaDescription = meta?.description || generateMetaDescription(
    `Explore our collection of free ${categoryName.toLowerCase()} utilities, calculators, and tools. Fast, secure, and client-side processing.`,
    155
  );
  const canonicalUrl = generateCanonicalUrl(path);

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${SITE_URL}/`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: categoryName,
          item: canonicalUrl
        }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: tools.map((tool, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: tool.name,
        url: `${SITE_URL}/tools/${tool.slug}`
      }))
    }
  ];

  return {
    titleTag,
    metaDescription,
    canonicalUrl,
    structuredData,
    intro: meta?.intro || '',
    keyFeatures: meta?.keyFeatures || []
  };
}

/**
 * Helper to generate SEO metadata for static or utility pages
 */
export function generatePageSEO({
  title,
  description,
  path,
  type = 'website',
  image
}: PageSEOOptions) {
  const formattedTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - High-Performance Web Utilities`;
  const formattedDescription = generateMetaDescription(description || SITE_DESCRIPTION, 155);
  const canonicalUrl = generateCanonicalUrl(path);

  return {
    title: formattedTitle,
    description: formattedDescription,
    canonicalUrl,
    type,
    image: image || `${SITE_URL.replace(/\/+$/, '')}/toolkitpro-logo.jpg`
  };
}

/**
 * Generates a complete, valid XML sitemap string strictly adhering to sitemaps.org standards
 * using the configured canonical base URL (VITE_SITE_URL or fallback).
 *
 * @param customBaseUrl - Optional custom canonical base URL to override the default
 * @returns Fully formatted sitemap.xml string with exact absolute canonical URLs
 */
export function generateXmlSitemap(customBaseUrl?: string): string {
  const baseUrl = (customBaseUrl || SITE_URL).replace(/\/+$/, '');
  const today = new Date().toISOString().split('T')[0];

  const staticRoutes = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/blog', priority: '0.9', changefreq: 'weekly' },
    { path: '/about', priority: '0.8', changefreq: 'monthly' },
    { path: '/contact', priority: '0.7', changefreq: 'monthly' },
    { path: '/faq', priority: '0.8', changefreq: 'monthly' },
    { path: '/analytics', priority: '0.8', changefreq: 'daily' },
    { path: '/sitemap', priority: '0.5', changefreq: 'monthly' },
    { path: '/privacy', priority: '0.3', changefreq: 'monthly' },
    { path: '/terms', priority: '0.3', changefreq: 'monthly' },
    { path: '/disclaimer', priority: '0.3', changefreq: 'monthly' },
  ];

  const categoryRoutes = [
    { path: '/calculators', priority: '0.8', changefreq: 'weekly' },
    { path: '/image-tools', priority: '0.8', changefreq: 'weekly' },
    { path: '/text-tools', priority: '0.8', changefreq: 'weekly' },
    { path: '/developer-tools', priority: '0.8', changefreq: 'weekly' },
    { path: '/converters', priority: '0.8', changefreq: 'weekly' },
    { path: '/fiji-tools', priority: '0.8', changefreq: 'weekly' },
    { path: '/color-tools', priority: '0.8', changefreq: 'weekly' },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static routes
  staticRoutes.forEach(route => {
    const loc = route.path === '/' ? `${baseUrl}/` : `${baseUrl}${route.path}`;
    xml += `  <url>\n`;
    xml += `    <loc>${loc}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  // Category routes
  categoryRoutes.forEach(route => {
    const loc = `${baseUrl}${route.path}`;
    xml += `  <url>\n`;
    xml += `    <loc>${loc}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  // Tools
  TOOLS.forEach(tool => {
    const loc = `${baseUrl}/tools/${tool.slug}`;
    xml += `  <url>\n`;
    xml += `    <loc>${loc}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.9</priority>\n`;
    xml += `  </url>\n`;
  });

  // Blog Posts
  BLOG_POSTS.forEach(post => {
    const loc = `${baseUrl}/blog/${post.slug}`;
    const lastmod = post.date || today;
    xml += `  <url>\n`;
    xml += `    <loc>${loc}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>\n`;
  return xml;
}

