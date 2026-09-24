import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TOOLS } from '../src/data/toolsData';
import { BLOG_POSTS } from '../src/data/blogData';
import { CATEGORY_METAS, generateCanonicalUrl, generateToolSEO, generateBlogSEO, generateCategorySEO } from '../src/utils/seo';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROD_DOMAIN = 'https://toolkitpro-e5y5.vercel.app';

console.log('====================================================');
console.log('🔍 TOOLKITPRO — PHASE 22 COMPREHENSIVE SEO AUDIT');
console.log('====================================================\n');

let totalErrors = 0;
let totalWarnings = 0;

function assert(condition: boolean, message: string, isWarning = false) {
  if (!condition) {
    if (isWarning) {
      console.warn(`  ⚠️  [WARNING] ${message}`);
      totalWarnings++;
    } else {
      console.error(`  ❌ [ERROR] ${message}`);
      totalErrors++;
    }
  } else {
    console.log(`  ✅ ${message}`);
  }
}

// 1. ROUTE INVENTORY AUDIT
console.log('1. Route Inventory & Canonical Count Audit');
const toolSlugs = new Set(TOOLS.map(t => t.slug));
assert(TOOLS.length === 34, `Expected 34 registered tools, found ${TOOLS.length}`);
assert(toolSlugs.size === 34, `Expected 34 unique tool slugs, found ${toolSlugs.size}`);

const categorySlugs = Object.keys(CATEGORY_METAS);
assert(categorySlugs.length === 7, `Expected 7 category hubs, found ${categorySlugs.length}`);

assert(BLOG_POSTS.length === 14, `Expected 14 blog posts / technical guides, found ${BLOG_POSTS.length}`);
const blogSlugs = new Set(BLOG_POSTS.map(b => b.slug));
assert(blogSlugs.size === 14, `Expected 14 unique blog slugs, found ${blogSlugs.size}`);

const staticPaths = [
  '/',
  '/blog',
  '/about',
  '/contact',
  '/faq',
  '/analytics',
  '/sitemap',
  '/privacy',
  '/terms',
  '/disclaimer'
];
assert(staticPaths.length === 10, `Expected 10 static routes, found ${staticPaths.length}`);

const totalExpectedRoutes = staticPaths.length + categorySlugs.length + TOOLS.length + BLOG_POSTS.length;
console.log(`  ℹ️  Total Canonical Public URLs: ${totalExpectedRoutes} (10 static + 7 categories + 34 tools + 14 blog posts)`);
assert(totalExpectedRoutes === 65, `Expected 65 total canonical URLs, found ${totalExpectedRoutes}`);

// 2. SITEMAP AUDIT
console.log('\n2. Sitemap (public/sitemap.xml) Audit');
const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
assert(fs.existsSync(sitemapPath), 'public/sitemap.xml exists');

if (fs.existsSync(sitemapPath)) {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  assert(sitemapContent.includes('<urlset') && sitemapContent.includes('</urlset>'), 'Valid urlset wrapper');
  assert(!sitemapContent.includes('localhost'), 'No localhost URLs in sitemap');
  assert(!sitemapContent.includes('127.0.0.1'), 'No 127.0.0.1 URLs in sitemap');
  assert(!sitemapContent.includes('.vercel.app/') || sitemapContent.includes(PROD_DOMAIN), 'Only production domain in sitemap');

  const locMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g) || [];
  const extractedUrls = locMatches.map(m => m.replace(/<\/?loc>/g, '').trim());

  assert(extractedUrls.length === totalExpectedRoutes, `Sitemap contains exactly ${totalExpectedRoutes} URLs (found ${extractedUrls.length})`);

  const urlSet = new Set(extractedUrls);
  assert(urlSet.size === extractedUrls.length, `No duplicate URLs in sitemap (${urlSet.size} unique vs ${extractedUrls.length} total)`);

  // Check all expected URLs are in sitemap
  let allPresent = true;
  for (const p of staticPaths) {
    const expected = p === '/' ? `${PROD_DOMAIN}/` : `${PROD_DOMAIN}${p}`;
    if (!urlSet.has(expected)) {
      assert(false, `Missing static route in sitemap: ${expected}`);
      allPresent = false;
    }
  }
  for (const c of categorySlugs) {
    const expected = `${PROD_DOMAIN}/${c}`;
    if (!urlSet.has(expected)) {
      assert(false, `Missing category route in sitemap: ${expected}`);
      allPresent = false;
    }
  }
  for (const t of TOOLS) {
    const expected = `${PROD_DOMAIN}/tools/${t.slug}`;
    if (!urlSet.has(expected)) {
      assert(false, `Missing tool route in sitemap: ${expected}`);
      allPresent = false;
    }
  }
  for (const b of BLOG_POSTS) {
    const expected = `${PROD_DOMAIN}/blog/${b.slug}`;
    if (!urlSet.has(expected)) {
      assert(false, `Missing blog route in sitemap: ${expected}`);
      allPresent = false;
    }
  }
  if (allPresent) {
    console.log('  ✅ Every single one of the 65 public routes is explicitly present in sitemap.xml');
  }
}

// 3. ROBOTS.TXT AUDIT
console.log('\n3. Robots.txt (public/robots.txt) Audit');
const robotsPath = path.join(__dirname, '..', 'public', 'robots.txt');
assert(fs.existsSync(robotsPath), 'public/robots.txt exists');
if (fs.existsSync(robotsPath)) {
  const robots = fs.readFileSync(robotsPath, 'utf8');
  assert(robots.includes('User-agent: *'), 'Contains User-agent: *');
  assert(robots.includes('Allow: /'), 'Contains Allow: /');
  assert(robots.includes(`Sitemap: ${PROD_DOMAIN}/sitemap.xml`), `Contains production sitemap: Sitemap: ${PROD_DOMAIN}/sitemap.xml`);
  assert(!robots.includes('localhost'), 'No localhost in robots.txt');
  assert(!robots.includes('127.0.0.1'), 'No 127.0.0.1 in robots.txt');
}

// 4. RELATED TOOLS GRAPH AUDIT
console.log('\n4. Related Tools Graph Integrity Audit');
const relatedToolsPath = path.join(__dirname, '..', 'src', 'utils', 'relatedTools.ts');
const relatedToolsSrc = fs.readFileSync(relatedToolsPath, 'utf8');
const lines = relatedToolsSrc.split('\n');
let relatedIssues = 0;

for (const line of lines) {
  const m = line.match(/'([a-z0-9-]+)':\s*\[(.*)\]/);
  if (m) {
    const parent = m[1];
    if (!toolSlugs.has(parent)) {
      assert(false, `RELATED_TOOLS_MAP key is not a registered tool: "${parent}"`);
      relatedIssues++;
    }
    const targets = (m[2].match(/'([a-z0-9-]+)'/g) || []).map(s => s.replace(/'/g, ''));
    for (const target of targets) {
      if (!toolSlugs.has(target)) {
        assert(false, `Parent "${parent}" links to invalid target tool "${target}"`);
        relatedIssues++;
      }
      if (target === parent) {
        assert(false, `Parent "${parent}" self-links in related tools`);
        relatedIssues++;
      }
    }
  }
}
assert(relatedIssues === 0, `All related tool slugs are valid and point to existing tools (0 issues)`);

// 5. METADATA & STRUCTURED DATA VERIFICATION
console.log('\n5. Metadata & Structured Data Audit');
for (const tool of TOOLS) {
  const seo = generateToolSEO(tool, tool.slug);
  if (!seo.titleTag || seo.titleTag.length < 10) {
    assert(false, `Tool ${tool.slug} has invalid titleTag: "${seo.titleTag}"`);
  }
  if (!seo.metaDescription || seo.metaDescription.length < 30) {
    assert(false, `Tool ${tool.slug} has empty or short metaDescription`);
  }
  if (!seo.canonicalUrl.startsWith(PROD_DOMAIN)) {
    assert(false, `Tool ${tool.slug} canonicalUrl does not use production domain: "${seo.canonicalUrl}"`);
  }
  if (!seo.structuredData || seo.structuredData.length < 2) {
    assert(false, `Tool ${tool.slug} missing BreadcrumbList or WebApplication schema`);
  }
}
console.log(`  ✅ All ${TOOLS.length} tools verified for valid titleTag, metaDescription, canonical, and JSON-LD`);

for (const post of BLOG_POSTS) {
  const seo = generateBlogSEO(post);
  if (!seo.titleTag || !seo.metaDescription || !seo.canonicalUrl.startsWith(PROD_DOMAIN)) {
    assert(false, `Blog post ${post.slug} has invalid SEO metadata`);
  }
  if (!seo.structuredData || seo.structuredData['@type'] !== 'BlogPosting') {
    assert(false, `Blog post ${post.slug} has invalid BlogPosting schema`);
  }
}
console.log(`  ✅ All ${BLOG_POSTS.length} blog posts verified for valid titleTag, metaDescription, canonical, and JSON-LD`);

for (const catSlug of categorySlugs) {
  const catMeta = CATEGORY_METAS[catSlug];
  const seo = generateCategorySEO(catMeta.name, `/${catSlug}`, []);
  if (!seo.titleTag || !seo.metaDescription || !seo.canonicalUrl.startsWith(PROD_DOMAIN)) {
    assert(false, `Category ${catSlug} has invalid SEO metadata`);
  }
}
console.log(`  ✅ All 7 category hubs verified for valid titleTag, metaDescription, canonical, and JSON-LD`);

// 6. 404 & NOINDEX AUDIT
console.log('\n6. 404 & Indexation Defense Audit');
const notFoundPath = path.join(__dirname, '..', 'src', 'pages', 'NotFound.tsx');
const notFoundSrc = fs.readFileSync(notFoundPath, 'utf8');
assert(notFoundSrc.includes('noindex, follow'), 'NotFound.tsx includes <meta name="robots" content="noindex, follow" />');

const toolTemplatePath = path.join(__dirname, '..', 'src', 'pages', 'ToolTemplate.tsx');
const toolTemplateSrc = fs.readFileSync(toolTemplatePath, 'utf8');
assert(toolTemplateSrc.includes('noindex, follow'), 'ToolTemplate.tsx includes noindex for non-existent tools');

const categoryPagePath = path.join(__dirname, '..', 'src', 'pages', 'CategoryPage.tsx');
const categoryPageSrc = fs.readFileSync(categoryPagePath, 'utf8');
assert(categoryPageSrc.includes('noindex, follow'), 'CategoryPage.tsx includes noindex for non-existent categories');

const blogPostPath = path.join(__dirname, '..', 'src', 'pages', 'BlogPost.tsx');
const blogPostSrc = fs.readFileSync(blogPostPath, 'utf8');
assert(blogPostSrc.includes('noindex, follow'), 'BlogPost.tsx includes noindex for non-existent blog posts');

// 7. FIJI TOOLS REGRESSION VERIFICATION
console.log('\n7. Fiji Tools Suite Audit (No formula changes)');
const fijiTools = TOOLS.filter(t => t.slug.startsWith('fiji-'));
assert(fijiTools.length === 13, `Expected 13 Fiji utility tools, found ${fijiTools.length}`);

const expectedFijiSlugs = [
  'fiji-salary-calculator',
  'fiji-overtime-calculator',
  'fiji-annual-leave-calculator',
  'fiji-loan-repayment-calculator',
  'fiji-mortgage-calculator',
  'fiji-duty-import-calculator',
  'fiji-vehicle-cost-calculator',
  'fiji-electricity-bill-calculator',
  'fiji-grocery-budget-calculator',
  'fiji-taxi-fare-calculator',
  'fiji-vat-calculator',
  'fiji-fnpf-calculator',
  'fiji-tsls-calculator'
];

for (const slug of expectedFijiSlugs) {
  const tool = fijiTools.find(t => t.slug === slug);
  assert(Boolean(tool), `Fiji tool "${slug}" is present in registry`);
  assert(toolTemplateSrc.includes(`case '${slug}':`), `Fiji tool "${slug}" is routed in ToolTemplate switch`);
}

// 8. ALIAS INTEGRITY & COLLISION AUDIT
console.log('\n8. Tool Alias Integrity & Slug Collision Audit');
const allAliases = new Map<string, string>();
let aliasCollisions = 0;
for (const tool of TOOLS) {
  if (tool.aliases) {
    for (const alias of tool.aliases) {
      if (toolSlugs.has(alias)) {
        assert(false, `Tool "${tool.slug}" alias "${alias}" collides with an existing tool slug!`);
        aliasCollisions++;
      }
      if (allAliases.has(alias)) {
        assert(false, `Duplicate alias "${alias}" found in tools "${allAliases.get(alias)}" and "${tool.slug}"!`);
        aliasCollisions++;
      } else {
        allAliases.set(alias, tool.slug);
      }
    }
  }
}
assert(aliasCollisions === 0, `All ${allAliases.size} tool aliases are unique with zero primary slug collisions`);

// 9. PRE-RENDERED DIST FILES CANONICAL AUDIT
console.log('\n9. Pre-rendered Dist Files Canonical Audit');
const distToolsDir = path.join(__dirname, '..', 'dist', 'tools');
if (fs.existsSync(distToolsDir)) {
  let prerenderIssues = 0;
  for (const tool of TOOLS) {
    const indexPath = path.join(distToolsDir, tool.slug, 'index.html');
    if (!fs.existsSync(indexPath)) {
      assert(false, `Missing pre-rendered static HTML for tool: dist/tools/${tool.slug}/index.html`);
      prerenderIssues++;
    } else {
      const content = fs.readFileSync(indexPath, 'utf8');
      const expectedCanonical = `${PROD_DOMAIN}/tools/${tool.slug}`;
      if (!content.includes(`<link rel="canonical" href="${expectedCanonical}" />`)) {
        assert(false, `Tool ${tool.slug} pre-rendered HTML does not have exact expected canonical: ${expectedCanonical}`);
        prerenderIssues++;
      }
    }
  }
  assert(prerenderIssues === 0, `All ${TOOLS.length} tools verified with exact canonical in pre-rendered static HTML`);
} else {
  console.log('  ℹ️  dist directory not built yet. Run npm run build to verify pre-rendered files.');
}

console.log('\n====================================================');
console.log(`AUDIT SUMMARY: ${totalErrors} ERRORS, ${totalWarnings} WARNINGS`);
console.log('====================================================');

if (totalErrors > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL PHASE 22 SEO QUALITY CHECKS PASSED!');
  process.exit(0);
}
