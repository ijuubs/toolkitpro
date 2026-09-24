import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TOOLS } from '../src/data/toolsData';
import { BLOG_POSTS } from '../src/data/blogData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getBaseUrl = () => {
  const envUrl = process.env.VITE_SITE_URL || process.env.SITE_URL;
  if (envUrl && envUrl.trim() !== '' && !envUrl.includes('utility-tools-eta')) {
    return envUrl.replace(/\/+$/, '');
  }
  return 'https://toolkitpro-e5y5.vercel.app';
};

const BASE_URL = getBaseUrl();
const TODAY = new Date().toISOString().split('T')[0];

function generateSitemap() {
  const sitemapHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  const sitemapFooter = `\n</urlset>\n`;

const categoryRoutes = [
    { path: '/calculators', priority: '0.8', changefreq: 'weekly' },
    { path: '/image-tools', priority: '0.8', changefreq: 'weekly' },
    { path: '/text-tools', priority: '0.8', changefreq: 'weekly' },
    { path: '/developer-tools', priority: '0.8', changefreq: 'weekly' },
    { path: '/converters', priority: '0.8', changefreq: 'weekly' },
    { path: '/fiji-tools', priority: '0.8', changefreq: 'weekly' },
    { path: '/color-tools', priority: '0.8', changefreq: 'weekly' },
  ];
  
  const staticRoutes = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/blog', priority: '0.9', changefreq: 'weekly' },
    { path: '/about', priority: '0.8', changefreq: 'monthly' },
    { path: '/contact', priority: '0.7', changefreq: 'monthly' },
    { path: '/faq', priority: '0.7', changefreq: 'weekly' },
    { path: '/analytics', priority: '0.6', changefreq: 'monthly' },
    { path: '/sitemap', priority: '0.5', changefreq: 'weekly' },
    { path: '/privacy', priority: '0.3', changefreq: 'monthly' },
    { path: '/terms', priority: '0.3', changefreq: 'monthly' },
    { path: '/disclaimer', priority: '0.3', changefreq: 'monthly' },
    ...categoryRoutes,
  ];

  const urls: Array<{ loc: string; priority: string; changefreq: string; lastmod: string }> = [];

  staticRoutes.forEach(route => {
    urls.push({
      loc: route.path === '/' ? `${BASE_URL}/` : `${BASE_URL}${route.path}`,
      priority: route.priority,
      changefreq: route.changefreq,
      lastmod: TODAY,
    });
  });

  TOOLS.forEach((tool) => {
    urls.push({
      loc: `${BASE_URL}/tools/${tool.slug}`,
      priority: '0.9',
      changefreq: 'weekly',
      lastmod: TODAY,
    });
  });

  BLOG_POSTS.forEach((post) => {
    urls.push({
      loc: `${BASE_URL}/blog/${post.slug}`,
      priority: '0.8',
      changefreq: 'monthly',
      lastmod: TODAY,
    });
  });

  const urlNodes = urls
    .map(
      (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join('\n');

  const sitemapContent = `${sitemapHeader}\n${urlNodes}${sitemapFooter}`;

  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'sitemap_index.xml'), sitemapContent, 'utf8');

  // Also update robots.txt with current base URL
  const robotsTxtContent = `User-agent: *
Allow: /

# Allow Google AdSense crawler
User-agent: Mediapartners-Google
Allow: /

# Allow AI Search Crawlers
User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxtContent, 'utf8');

  const distDir = path.join(__dirname, '..', 'dist');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapContent, 'utf8');
    fs.writeFileSync(path.join(distDir, 'sitemap_index.xml'), sitemapContent, 'utf8');
    fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxtContent, 'utf8');
  }

  console.log(`Sitemap generated successfully (${urls.length} URLs, domain: ${BASE_URL})`);
}

generateSitemap();
