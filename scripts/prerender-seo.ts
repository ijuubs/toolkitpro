import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TOOLS, Tool } from '../src/data/toolsData';
import { BLOG_POSTS, BlogPost } from '../src/data/blogData';
import { 
  CATEGORY_METAS, 
  generateCanonicalUrl, 
  generateToolSEO, 
  generateBlogSEO, 
  generateCategorySEO,
  generatePageSEO,
  stripMarkdownAndHtml 
} from '../src/utils/seo';
import { getRelatedTools } from '../src/utils/relatedTools';
import { SITE_URL, SITE_NAME } from '../src/config/site';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, '..', 'dist');

interface PrerenderRoute {
  path: string;
  canonicalUrl: string;
  title: string;
  description: string;
  ogType: 'website' | 'article';
  structuredData: any[];
  contentHtml: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildPrerenderRoutes(): PrerenderRoute[] {
  const routes: PrerenderRoute[] = [];
  const baseUrl = SITE_URL.replace(/\/+$/, '');

  // 1. HOMEPAGE (/)
  routes.push({
    path: '/',
    canonicalUrl: `${baseUrl}/`,
    title: `Free Online Utility Tools & Calculators | ${SITE_NAME}`,
    description: 'Access a massive collection of free online utility tools, developer utilities, calculators, and productivity apps. Process everything instantly and securely in your browser.',
    ogType: 'website',
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: `${baseUrl}/`,
        description: 'Free online utility tools, developer utilities, calculators, and productivity apps.'
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: `${baseUrl}/`,
        logo: `${baseUrl}/toolkitpro-logo.jpg`
      }
    ],
    contentHtml: `
      <header>
        <span class="badge">100% Client-Side Privacy • Zero Server Uploads</span>
        <h1>Free Online Utilities & Everyday Calculators</h1>
        <p>ToolKitPro provides professional-grade online utility tools for developers, businesses, and everyday productivity. Process data instantly and securely in your browser—no sign-ups required.</p>
      </header>
      <section>
        <h2>Popular Browser Utilities</h2>
        <ul>
          ${TOOLS.slice(0, 12).map(t => `<li><a href="/tools/${t.slug}"><strong>${escapeHtml(t.name)}</strong> - ${escapeHtml(t.description)}</a></li>`).join('\n')}
        </ul>
      </section>
      <section>
        <h2>Tool Categories</h2>
        <ul>
          <li><a href="/calculators">Calculators Hub</a></li>
          <li><a href="/developer-tools">Developer Tools Hub</a></li>
          <li><a href="/text-tools">Text Tools Hub</a></li>
          <li><a href="/converters">Converters Hub</a></li>
          <li><a href="/fiji-tools">Fiji Local Tools Hub</a></li>
          <li><a href="/image-tools">Image Tools Hub</a></li>
          <li><a href="/color-tools">Color Tools Hub</a></li>
        </ul>
      </section>
    `
  });

  // 2. STATIC ROUTES
  const staticDefinitions = [
    {
      path: '/blog',
      title: `Technical Articles & Engineering Guides | ${SITE_NAME} Blog`,
      description: 'Explore in-depth technical guides, engineering writeups, privacy deep dives, and mathematical tutorials curated by the ToolKitPro engineering team.',
      heading: 'Technical Guides & Engineering Articles',
      summary: 'Explore detailed tutorials on web cryptography, client-side PDF optimization, financial math, and browser performance.'
    },
    {
      path: '/about',
      title: `About Us | 100% Client-Side RAM Architecture | ${SITE_NAME}`,
      description: 'Learn about ToolKitPro\'s commitment to radical user privacy, zero server storage, and high-performance WebAssembly and Web Worker utilities.',
      heading: 'About ToolKitPro',
      summary: 'ToolKitPro is built on a simple principle: your data belongs to you. All conversions, computations, and transformations run directly in your local browser sandbox.'
    },
    {
      path: '/contact',
      title: `Contact & Support | Feature Requests | ${SITE_NAME}`,
      description: 'Have a feature request, found a bug, or want to suggest a new utility tool? Get in touch with the ToolKitPro developer team.',
      heading: 'Contact the ToolKitPro Engineering Team',
      summary: 'We welcome feedback, tool suggestions, bug reports, and contributions.'
    },
    {
      path: '/faq',
      title: `Frequently Asked Questions (FAQ) | Security & Privacy | ${SITE_NAME}`,
      description: 'Got questions about data security, client-side execution, offline PWA capabilities, or tool accuracy? Find answers here.',
      heading: 'Frequently Asked Questions',
      summary: 'Comprehensive answers regarding how ToolKitPro operates entirely within your browser.'
    },
    {
      path: '/analytics',
      title: `Live Platform Analytics & Performance | ${SITE_NAME}`,
      description: 'Real-time aggregated metrics demonstrating tool usage, client-side computational efficiency, and privacy status across the ToolKitPro platform.',
      heading: 'Live Web Analytics Dashboard',
      summary: 'Transparent, privacy-respecting metrics demonstrating real-time platform performance.'
    },
    {
      path: '/sitemap',
      title: `HTML Sitemap & Directory | Complete URL Index | ${SITE_NAME}`,
      description: `Complete HTML and XML sitemap index for ${SITE_NAME}. Access all verified canonical URLs for search engines and visitors.`,
      heading: 'ToolKitPro Site Directory & Sitemap',
      summary: 'Comprehensive directory of all published utilities, category hubs, and technical articles.'
    },
    {
      path: '/privacy',
      title: `Privacy Policy | Zero Server Logging Guarantee | ${SITE_NAME}`,
      description: 'Our strict privacy policy guarantees that all files, calculations, passwords, and data entered into ToolKitPro remain in your device memory.',
      heading: 'Privacy Policy',
      summary: 'ToolKitPro does not store, log, transmit, or inspect the files or text you process with our utilities.'
    },
    {
      path: '/terms',
      title: `Terms of Service | Acceptable Use Policy | ${SITE_NAME}`,
      description: 'Terms of Service governing use of ToolKitPro online utilities, calculators, and developer tools.',
      heading: 'Terms of Service',
      summary: 'Please review our terms of service regarding fair, safe, and lawful usage of our free web utilities.'
    },
    {
      path: '/disclaimer',
      title: `Legal & Financial Disclaimer | ${SITE_NAME}`,
      description: 'Legal disclaimer for ToolKitPro calculators and tools. All financial, tax, health, and engineering calculations are for informational purposes.',
      heading: 'Legal & Financial Disclaimer',
      summary: 'ToolKitPro calculators provide mathematical estimates based on public formulas and standards.'
    }
  ];

  staticDefinitions.forEach(def => {
    const canonical = generateCanonicalUrl(def.path);
    routes.push({
      path: def.path,
      canonicalUrl: canonical,
      title: def.title,
      description: def.description,
      ogType: 'website',
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: def.heading,
          url: canonical,
          description: def.description
        }
      ],
      contentHtml: `
        <article>
          <h1>${escapeHtml(def.heading)}</h1>
          <p>${escapeHtml(def.summary)}</p>
          <nav><a href="/">← Back to All Tools</a></nav>
        </article>
      `
    });
  });

  // 3. CATEGORY HUBS (7 categories)
  const categorySlugs = Object.keys(CATEGORY_METAS);
  categorySlugs.forEach(slug => {
    const meta = CATEGORY_METAS[slug];
    const canonical = generateCanonicalUrl(`/${slug}`);
    const catTools = TOOLS.filter(t => {
      if (slug === 'calculators') return ['Finance Tools', 'Health', 'Health Tools', 'Math Tools'].includes(t.category);
      if (slug === 'developer-tools') return ['Web Tools', 'Security'].includes(t.category) || t.slug === 'diff-checker';
      if (slug === 'converters') return ['Converter'].includes(t.category);
      if (slug === 'image-tools') return ['image-resizer', 'color-picker'].includes(t.slug);
      if (slug === 'color-tools') return ['color-picker'].includes(t.slug);
      if (slug === 'fiji-tools') return t.slug.startsWith('fiji-');
      return t.category.toLowerCase().includes(slug.replace('-tools', ''));
    });

    const seo = generateCategorySEO(meta.name, `/${slug}`, catTools);

    routes.push({
      path: `/${slug}`,
      canonicalUrl: canonical,
      title: seo.titleTag,
      description: seo.metaDescription,
      ogType: 'website',
      structuredData: seo.structuredData,
      contentHtml: `
        <article>
          <nav aria-label="Breadcrumb">
            <a href="/">Home</a> / <span>${escapeHtml(meta.name)}</span>
          </nav>
          <h1>${escapeHtml(meta.name)}</h1>
          <p>${escapeHtml(meta.intro)}</p>
          <section>
            <h2>Available ${escapeHtml(meta.name)} (${catTools.length})</h2>
            <ul>
              ${catTools.map(t => `
                <li>
                  <a href="/tools/${t.slug}">
                    <strong>${escapeHtml(t.name)}</strong>
                  </a>
                  - ${escapeHtml(t.description)}
                </li>
              `).join('\n')}
            </ul>
          </section>
        </article>
      `
    });
  });

  // 4. TOOLS (34 tools)
  TOOLS.forEach(tool => {
    const seo = generateToolSEO(tool, tool.slug);
    const related = getRelatedTools(tool, 4);
    const cleanHowTo = stripMarkdownAndHtml(tool.howTo);

    routes.push({
      path: `/tools/${tool.slug}`,
      canonicalUrl: seo.canonicalUrl,
      title: seo.titleTag,
      description: seo.metaDescription,
      ogType: 'website',
      structuredData: seo.structuredData,
      contentHtml: `
        <article>
          <nav aria-label="Breadcrumb">
            <a href="/">Home</a> / <a href="/${tool.category.toLowerCase().replace(/\s+/g, '-')}">${escapeHtml(tool.category)}</a> / <span>${escapeHtml(tool.name)}</span>
          </nav>
          <h1>${escapeHtml(tool.name)}</h1>
          <p class="description">${escapeHtml(tool.description)}</p>
          ${tool.usp ? `<div class="usp"><strong>USP:</strong> ${escapeHtml(tool.usp)}</div>` : ''}
          
          <section class="how-to">
            <h2>How to use ${escapeHtml(tool.name)}</h2>
            <p>${escapeHtml(cleanHowTo)}</p>
          </section>

          ${tool.faqs && tool.faqs.length > 0 ? `
            <section class="faqs">
              <h2>Frequently Asked Questions</h2>
              <dl>
                ${tool.faqs.map(f => `
                  <dt><strong>${escapeHtml(f.question)}</strong></dt>
                  <dd>${escapeHtml(f.answer)}</dd>
                `).join('\n')}
              </dl>
            </section>
          ` : ''}

          <section class="related">
            <h2>Related Tools</h2>
            <ul>
              ${related.map(r => `<li><a href="/tools/${r.slug}">${escapeHtml(r.name)}</a> - ${escapeHtml(r.description)}</li>`).join('\n')}
            </ul>
          </section>
        </article>
      `
    });
  });

  // 5. BLOG POSTS (14 posts)
  BLOG_POSTS.forEach(post => {
    const seo = generateBlogSEO(post);
    const cleanContent = stripMarkdownAndHtml(post.content).slice(0, 1000);

    routes.push({
      path: `/blog/${post.slug}`,
      canonicalUrl: seo.canonicalUrl,
      title: seo.titleTag,
      description: seo.metaDescription,
      ogType: 'article',
      structuredData: [seo.structuredData],
      contentHtml: `
        <article>
          <nav aria-label="Breadcrumb">
            <a href="/">Home</a> / <a href="/blog">Blog</a> / <span>${escapeHtml(post.title)}</span>
          </nav>
          <header>
            <span class="category">${escapeHtml(post.category)}</span>
            <h1>${escapeHtml(post.title)}</h1>
            <p class="meta">Published: ${escapeHtml(post.date)} • By ${escapeHtml(post.author)} • ${escapeHtml(post.readTime)}</p>
          </header>
          <section class="article-body">
            <p>${escapeHtml(cleanContent)}...</p>
          </section>
          <footer>
            <a href="/blog">← Back to all articles</a>
          </footer>
        </article>
      `
    });
  });

  return routes;
}

export function prerenderAllRoutes() {
  console.log('\n====================================================');
  console.log('🚀 TOOLKITPRO — STATIC SITE SEO PRE-RENDERING');
  console.log('====================================================\n');

  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error('❌ dist/index.html not found! Run "vite build" first.');
    process.exit(1);
  }

  const baseTemplate = fs.readFileSync(indexPath, 'utf8');
  const routes = buildPrerenderRoutes();

  console.log(`📦 Prerendering SEO tags & static HTML for ${routes.length} canonical routes...`);

  let count = 0;
  routes.forEach(route => {
    let pageHtml = baseTemplate;

    // 1. Replace Title
    pageHtml = pageHtml.replace(
      /<title>.*?<\/title>/i,
      `<title>${escapeHtml(route.title)}</title>`
    );

    // 2. Replace Meta Description
    pageHtml = pageHtml.replace(
      /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
      `<meta name="description" content="${escapeHtml(route.description)}" />`
    );

    // 3. Remove existing canonical or og:url if present
    pageHtml = pageHtml.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/gi, '');
    pageHtml = pageHtml.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/gi, '');
    pageHtml = pageHtml.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/gi, '');
    pageHtml = pageHtml.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/gi, '');
    pageHtml = pageHtml.replace(/<meta\s+property="og:type"\s+content=".*?"\s*\/?>/gi, '');

    // 4. Inject Verified Canonical & OpenGraph & Twitter Tags into <head>
    const headInjection = `
    <!-- Verified Canonical URL for Googlebot & Search Engines -->
    <link rel="canonical" href="${route.canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(route.title)}" />
    <meta property="og:description" content="${escapeHtml(route.description)}" />
    <meta property="og:url" content="${route.canonicalUrl}" />
    <meta property="og:type" content="${route.ogType}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(route.title)}" />
    <meta name="twitter:description" content="${escapeHtml(route.description)}" />
    ${route.structuredData.map(data => `<script type="application/ld+json">${JSON.stringify(data)}</script>`).join('\n    ')}
    `;

    pageHtml = pageHtml.replace('</head>', `${headInjection}\n  </head>`);

    // 5. Inject Semantic Pre-rendered Content into <div id="root">
    // This ensures search engine crawlers that do not execute JS immediately receive complete, indexable page content
    const semanticFallback = `
      <div id="static-prerender-content" style="max-width: 1200px; margin: 0 auto; padding: 20px;">
        ${route.contentHtml}
      </div>
    `;

    pageHtml = pageHtml.replace(
      '<div id="root"></div>',
      `<div id="root">${semanticFallback}</div>`
    );

    // 6. Write to destination
    if (route.path === '/') {
      fs.writeFileSync(indexPath, pageHtml, 'utf8');
    } else {
      const cleanSubPath = route.path.replace(/^\/+/, '').replace(/\/+$/, '');
      const targetDir = path.join(distDir, cleanSubPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      fs.writeFileSync(path.join(targetDir, 'index.html'), pageHtml, 'utf8');
    }

    count++;
  });

  // Ensure sitemap_index.xml exists in dist
  const sitemapDist = path.join(distDir, 'sitemap.xml');
  const sitemapIndexDist = path.join(distDir, 'sitemap_index.xml');
  if (fs.existsSync(sitemapDist)) {
    fs.copyFileSync(sitemapDist, sitemapIndexDist);
  }

  console.log(`✅ Successfully generated static SEO HTML for all ${count} canonical URLs!`);
  console.log(`✅ Verified canonical URL baked into every page's initial HTTP response.`);
  console.log('====================================================\n');
}

prerenderAllRoutes();
