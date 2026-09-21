import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Copy, Check, Download, ExternalLink, FileCode, Search, Globe, CheckCircle2, ShieldCheck } from 'lucide-react';
import { TOOLS } from '../data/toolsData';
import { BLOG_POSTS } from '../data/blogData';
import { SITE_URL, SITE_NAME } from '../config/site';
import { generateCanonicalUrl, generateXmlSitemap } from '../utils/seo';

export default function SitemapPage() {
  const [copied, setCopied] = useState(false);
  const [showXmlViewer, setShowXmlViewer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Generate canonical URLs and valid XML string strictly using SITE_URL (https://toolkitpro-e5y5.vercel.app)
  const canonicalUrl = generateCanonicalUrl('/sitemap');
  const xmlSitemapUrl = `${SITE_URL.replace(/\/+$/, '')}/sitemap.xml`;
  const xmlContent = useMemo(() => generateXmlSitemap(), []);

  // Calculate indexed totals
  const totalStatic = 10;
  const totalCategories = 7;
  const totalTools = TOOLS.length;
  const totalBlogPosts = BLOG_POSTS.length;
  const totalUrls = totalStatic + totalCategories + totalTools + totalBlogPosts;

  const handleCopyXml = async () => {
    try {
      await navigator.clipboard.writeText(xmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  const handleDownloadXml = () => {
    const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filter tools and blog posts based on search query
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return TOOLS;
    const q = searchQuery.toLowerCase();
    return TOOLS.filter(t => 
      t.name.toLowerCase().includes(q) || 
      t.slug.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.aliases?.some(a => a.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const filteredBlogPosts = useMemo(() => {
    if (!searchQuery.trim()) return BLOG_POSTS;
    const q = searchQuery.toLowerCase();
    return BLOG_POSTS.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.slug.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12">
      <Helmet>
        <title>Sitemap & XML Index | {SITE_NAME}</title>
        <meta 
          name="description" 
          content={`Complete HTML and XML sitemap index for ${SITE_NAME}. Access all ${totalUrls} verified canonical URLs for search engines and visitors.`} 
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`Sitemap & XML Index | ${SITE_NAME}`} />
        <meta property="og:description" content={`Explore all ${totalUrls} verified canonical URLs on ${SITE_NAME}.`} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Sitemap & XML Index | ${SITE_NAME}`} />
        <meta name="twitter:description" content={`Explore all ${totalUrls} verified canonical URLs on ${SITE_NAME}.`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": `Sitemap - ${SITE_NAME}`,
            "url": canonicalUrl,
            "description": `Complete HTML and XML sitemap index for ${SITE_NAME} containing ${totalUrls} canonical URLs.`
          })}
        </script>
      </Helmet>

      {/* Header Banner */}
      <div className="border-b-4 sm:border-b-8 border-black pb-4 sm:pb-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="bg-yellow-400 text-black text-xs font-black uppercase px-3 py-1 border-2 border-black tracking-wider">
            SEO Index & Site Directory
          </span>
          <div className="flex items-center gap-2 text-xs font-black uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-3 py-1 border-2 border-black max-w-full overflow-hidden">
            <Globe size={14} className="text-yellow-500 shrink-0" />
            <span className="truncate">Canonical Host: <span className="font-mono text-black dark:text-yellow-400">{SITE_URL}</span></span>
          </div>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight">
          Website Sitemap
        </h1>
        <p className="font-medium text-sm sm:text-base md:text-lg text-neutral-700 dark:text-neutral-300">
          Complete indexed directory of all {totalUrls} published pages, tools, and technical articles.
        </p>
      </div>

      {/* XML Search Engine Card */}
      <div className="bg-white dark:bg-[#181922] border-4 border-black p-4 sm:p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-4 border-black/10 dark:border-white/10 pb-4 sm:pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileCode className="text-yellow-500 shrink-0" size={24} />
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
                Search Engine XML Sitemap
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Valid XML sitemap formatted to strict sitemaps.org standards for Google Search Console & Bing Webmaster.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center bg-yellow-400 text-black font-black text-xs uppercase px-3 py-1.5 border-2 border-black shrink-0">
            <ShieldCheck size={16} />
            {totalUrls} Canonical URLs
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 bg-neutral-50 dark:bg-neutral-900 border-2 border-black space-y-1">
            <span className="text-xs font-bold uppercase text-neutral-500">Core Routes</span>
            <p className="text-xl sm:text-2xl font-black">{totalStatic}</p>
          </div>
          <div className="p-3 sm:p-4 bg-neutral-50 dark:bg-neutral-900 border-2 border-black space-y-1">
            <span className="text-xs font-bold uppercase text-neutral-500">Browser Utilities</span>
            <p className="text-xl sm:text-2xl font-black">{totalTools}</p>
          </div>
          <div className="p-3 sm:p-4 bg-neutral-50 dark:bg-neutral-900 border-2 border-black space-y-1">
            <span className="text-xs font-bold uppercase text-neutral-500">Articles & Guides</span>
            <p className="text-xl sm:text-2xl font-black">{totalBlogPosts}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
          <a
            href={xmlSitemapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-yellow-400 text-black font-black text-xs sm:text-sm uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all min-h-[44px]"
          >
            <ExternalLink size={16} className="stroke-[2.5]" />
            Open sitemap.xml
          </a>
          <button
            onClick={handleCopyXml}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white dark:bg-black text-black dark:text-white font-black text-xs sm:text-sm uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer min-h-[44px]"
          >
            {copied ? <Check size={16} className="text-green-500 stroke-[3]" /> : <Copy size={16} />}
            {copied ? 'XML Copied!' : 'Copy XML'}
          </button>
          <button
            onClick={handleDownloadXml}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white dark:bg-black text-black dark:text-white font-black text-xs sm:text-sm uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer min-h-[44px]"
          >
            <Download size={16} />
            Download sitemap.xml
          </button>
          <button
            onClick={() => setShowXmlViewer(!showXmlViewer)}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold text-xs uppercase border-2 border-black hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors sm:ml-auto cursor-pointer min-h-[44px]"
          >
            {showXmlViewer ? 'Hide XML Source' : 'View XML Source'}
          </button>
        </div>

        {showXmlViewer && (
          <div className="space-y-2 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono font-bold text-neutral-500">
              <span className="break-all">Canonical target: {xmlSitemapUrl}</span>
              <span>{xmlContent.length} bytes</span>
            </div>
            <pre className="p-3 sm:p-4 bg-neutral-900 text-yellow-300 font-mono text-xs border-4 border-black overflow-x-auto max-h-[350px] leading-relaxed shadow-inner">
              {xmlContent}
            </pre>
          </div>
        )}
      </div>

      {/* Interactive Search Bar for HTML Sitemap */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <h2 className="text-2xl sm:text-3xl font-black uppercase italic border-b-4 border-yellow-400 pb-1 inline-block">
            HTML Directory
          </h2>
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search directory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#181922] border-4 border-black text-sm font-bold placeholder:text-neutral-400 focus:outline-none focus:bg-yellow-50 dark:focus:bg-neutral-800"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-2 sm:pt-4">
          {/* Main Pages */}
          <section className="bg-white dark:bg-[#181922] border-4 border-black p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <h3 className="text-lg sm:text-xl font-black uppercase">Main Pages</h3>
              <span className="text-xs font-black bg-neutral-200 dark:bg-neutral-700 px-2 py-0.5 border border-black">
                {totalStatic}
              </span>
            </div>
            <ul className="space-y-2.5 font-bold uppercase text-xs sm:text-sm">
              {[
                { to: '/', label: 'Home Page' },
                { to: '/blog', label: 'Blog & Guides' },
                { to: '/analytics', label: 'Analytics Dashboard' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact Us' },
                { to: '/faq', label: 'FAQ' },
                { to: '/privacy', label: 'Privacy Policy' },
                { to: '/terms', label: 'Terms of Service' },
                { to: '/disclaimer', label: 'Disclaimer' },
                { to: '/sitemap', label: 'HTML Sitemap' },
              ].map(page => (
                <li key={page.to}>
                  <Link 
                    to={page.to} 
                    className="flex items-center justify-between hover:bg-yellow-400 hover:text-black px-2 py-1 transition-colors border border-transparent hover:border-black"
                  >
                    <span>{page.label}</span>
                    <CheckCircle2 size={12} className="text-yellow-500 shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Category Hubs */}
          <section className="bg-white dark:bg-[#181922] border-4 border-black p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <h3 className="text-lg sm:text-xl font-black uppercase">Category Hubs</h3>
              <span className="text-xs font-black bg-neutral-200 dark:bg-neutral-700 px-2 py-0.5 border border-black">
                {totalCategories}
              </span>
            </div>
            <ul className="space-y-2.5 font-bold uppercase text-xs sm:text-sm">
              {[
                { to: '/calculators', label: 'Calculators' },
                { to: '/image-tools', label: 'Image Tools' },
                { to: '/text-tools', label: 'Text Tools' },
                { to: '/developer-tools', label: 'Developer Tools' },
                { to: '/converters', label: 'Converters' },
                { to: '/fiji-tools', label: 'Fiji Tools' },
                { to: '/color-tools', label: 'Color Tools' },
              ].map(cat => (
                <li key={cat.to}>
                  <Link 
                    to={cat.to} 
                    className="flex items-center justify-between hover:bg-yellow-400 hover:text-black px-2 py-1 transition-colors border border-transparent hover:border-black"
                  >
                    <span>{cat.label}</span>
                    <CheckCircle2 size={12} className="text-yellow-500 shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Tools & Utilities */}
          <section className="bg-white dark:bg-[#181922] border-4 border-black p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3 sm:space-y-4 md:col-span-2">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <h3 className="text-lg sm:text-xl font-black uppercase">Web Utilities ({filteredTools.length})</h3>
              <span className="text-xs font-black bg-yellow-400 text-black px-2 py-0.5 border border-black">
                Client-Side
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-1">
              {filteredTools.map(tool => (
                <div key={tool.id} className="space-y-1">
                  <Link 
                    to={`/tools/${tool.slug}`} 
                    className="block font-black text-xs sm:text-sm uppercase underline hover:bg-yellow-400 hover:text-black px-1.5 py-0.5 transition-colors border border-transparent hover:border-black"
                  >
                    {tool.name}
                  </Link>
                  {tool.aliases && tool.aliases.length > 0 && (
                    <div className="pl-4 flex flex-wrap gap-1 text-[11px] font-bold text-neutral-500 dark:text-neutral-400">
                      {tool.aliases.map(alias => (
                        <Link 
                          key={alias} 
                          to={`/tools/${alias}`} 
                          className="hover:text-black dark:hover:text-white underline decoration-dotted"
                        >
                          +{alias.replace(/-/g, ' ')}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Technical Guides & Articles */}
          <section className="bg-white dark:bg-[#181922] border-4 border-black p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3 sm:space-y-4 md:col-span-3">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <h3 className="text-lg sm:text-xl font-black uppercase">Technical Guides & Articles ({filteredBlogPosts.length})</h3>
              <span className="text-xs font-black bg-neutral-200 dark:bg-neutral-700 px-2 py-0.5 border border-black">
                Verified Content
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
              {filteredBlogPosts.map(post => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="p-3 bg-neutral-50 dark:bg-neutral-900 border-2 border-black hover:bg-yellow-400 hover:text-black transition-all space-y-1"
                >
                  <p className="font-bold text-xs uppercase line-clamp-2">{post.title}</p>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">{post.date}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

