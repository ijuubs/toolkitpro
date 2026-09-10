import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '../config/site';
import { Tool, TOOLS } from '../data/toolsData';
import { BlogPost, BLOG_POSTS } from '../data/blogData';

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

  const structuredData = [
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

