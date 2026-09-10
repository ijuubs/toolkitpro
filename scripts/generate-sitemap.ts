import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TOOLS } from '../src/data/toolsData';
import { BLOG_POSTS } from '../src/data/blogData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://toolkitpro-e5y5.vercel.app';

function generateSitemap() {
  const sitemapHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  const sitemapFooter = `\n</urlset>`;

  const urls = [
    { loc: `${BASE_URL}/`, priority: '1.0' },
    { loc: `${BASE_URL}/blog`, priority: '0.9' },
    { loc: `${BASE_URL}/about`, priority: '0.8' },
    { loc: `${BASE_URL}/contact`, priority: '0.7' },
    { loc: `${BASE_URL}/faq`, priority: '0.7' },
  ];

  TOOLS.forEach((tool) => {
    urls.push({
      loc: `${BASE_URL}/tools/${tool.slug}`,
      priority: '0.9',
    });
  });

  BLOG_POSTS.forEach((post) => {
    urls.push({
      loc: `${BASE_URL}/blog/${post.slug}`,
      priority: '0.8',
    });
  });

  const urlNodes = urls
    .map(
      (url) => `
  <url>
    <loc>${url.loc}</loc>
    <priority>${url.priority}</priority>
    <changefreq>weekly</changefreq>
  </url>`
    )
    .join('');

  const sitemapContent = `${sitemapHeader}${urlNodes}${sitemapFooter}`;

  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent, 'utf8');
  console.log('Sitemap successfully generated at public/sitemap.xml');
}

generateSitemap();
