import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Code2, 
  List, 
  Search, 
  CheckCircle2, 
  Globe, 
  ArrowLeft 
} from 'lucide-react';
import { TOOLS } from '../data/toolsData';
import { BLOG_POSTS } from '../data/blogData';
import { SITE_URL, SITE_NAME } from '../config/site';
import { generateCanonicalUrl, generateXmlSitemap } from '../utils/seo';

interface ParsedUrlEntry {
  loc: string;
  path: string;
  lastmod: string;
  changefreq: string;
  priority: string;
  type: 'static' | 'category' | 'tool' | 'blog';
  label: string;
}

export default function XmlSitemapPage() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'xml' | 'list'>('xml');
  const [filterQuery, setFilterQuery] = useState('');

  const canonicalUrl = generateCanonicalUrl('/sitemap.xml');
  const xmlContent = useMemo(() => generateXmlSitemap(), []);

  // Parse structured entries for the interactive list view
  const parsedUrls: ParsedUrlEntry[] = useMemo(() => {
    const entries: ParsedUrlEntry[] = [];
    const baseUrl = SITE_URL.replace(/\/+$/, '');
    const today = new Date().toISOString().split('T')[0];

    // Static pages
    const staticMeta: Record<string, { priority: string; changefreq: string; label: string }> = {
      '/': { priority: '1.0', changefreq: 'daily', label: 'Home Page' },
      '/blog': { priority: '0.9', changefreq: 'weekly', label: 'Blog & Technical Guides' },
      '/about': { priority: '0.8', changefreq: 'monthly', label: 'About Platform' },
      '/contact': { priority: '0.7', changefreq: 'monthly', label: 'Contact & Support' },
      '/faq': { priority: '0.8', changefreq: 'monthly', label: 'FAQ Directory' },
      '/analytics': { priority: '0.8', changefreq: 'daily', label: 'Live Web Analytics' },
      '/sitemap': { priority: '0.5', changefreq: 'monthly', label: 'HTML Directory Sitemap' },
      '/privacy': { priority: '0.3', changefreq: 'monthly', label: 'Privacy Policy' },
      '/terms': { priority: '0.3', changefreq: 'monthly', label: 'Terms & Conditions' },
      '/disclaimer': { priority: '0.3', changefreq: 'monthly', label: 'Legal Disclaimer' }
    };

    Object.entries(staticMeta).forEach(([path, meta]) => {
      entries.push({
        loc: path === '/' ? `${baseUrl}/` : `${baseUrl}${path}`,
        path,
        lastmod: today,
        changefreq: meta.changefreq,
        priority: meta.priority,
        type: 'static',
        label: meta.label
      });
    });

    // Categories
    const categoryMeta: Record<string, string> = {
      '/calculators': 'Calculators Hub',
      '/image-tools': 'Image Tools Hub',
      '/text-tools': 'Text Tools Hub',
      '/developer-tools': 'Developer Tools Hub',
      '/converters': 'Converters Hub',
      '/fiji-tools': 'Fiji Local Utilities Hub',
      '/color-tools': 'Color Tools Hub'
    };

    Object.entries(categoryMeta).forEach(([path, label]) => {
      entries.push({
        loc: `${baseUrl}${path}`,
        path,
        lastmod: today,
        changefreq: 'weekly',
        priority: '0.8',
        type: 'category',
        label
      });
    });

    // Tools
    TOOLS.forEach(tool => {
      entries.push({
        loc: `${baseUrl}/tools/${tool.slug}`,
        path: `/tools/${tool.slug}`,
        lastmod: today,
        changefreq: 'monthly',
        priority: '0.7',
        type: 'tool',
        label: tool.name
      });
    });

    // Blog
    BLOG_POSTS.forEach(post => {
      entries.push({
        loc: `${baseUrl}/blog/${post.slug}`,
        path: `/blog/${post.slug}`,
        lastmod: today,
        changefreq: 'monthly',
        priority: '0.6',
        type: 'blog',
        label: post.title
      });
    });

    return entries;
  }, []);

  const filteredUrls = useMemo(() => {
    if (!filterQuery.trim()) return parsedUrls;
    const q = filterQuery.toLowerCase();
    return parsedUrls.filter(u => 
      u.label.toLowerCase().includes(q) || 
      u.path.toLowerCase().includes(q) || 
      u.loc.toLowerCase().includes(q) ||
      u.type.toLowerCase().includes(q)
    );
  }, [parsedUrls, filterQuery]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(xmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
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

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
      <Helmet>
        <title>XML Sitemap (sitemap.xml) | {SITE_NAME}</title>
        <meta 
          name="description" 
          content={`Valid sitemaps.org 0.9 XML index for ${SITE_NAME} containing ${parsedUrls.length} verified canonical URLs for search engines.`} 
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`XML Sitemap | ${SITE_NAME}`} />
        <meta 
          property="og:description" 
          content={`Complete sitemaps.org XML sitemap index for ${SITE_NAME}.`} 
        />
        <meta property="og:url" content={canonicalUrl} />
      </Helmet>

      {/* Top Navigation & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-black pb-3 sm:pb-4">
        <Link 
          to="/sitemap"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-black uppercase underline hover:bg-yellow-400 px-2 py-1 border border-transparent hover:border-black transition-all"
        >
          <ArrowLeft size={16} />
          Back to HTML Sitemap
        </Link>
        <div className="flex items-center gap-2 text-xs font-mono font-bold bg-neutral-100 dark:bg-neutral-800 px-3 py-1 border-2 border-black">
          <Globe size={14} className="text-yellow-500 shrink-0" />
          <span className="truncate max-w-[280px] sm:max-w-none">Target: {SITE_URL}/sitemap.xml</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-yellow-400 border-4 border-black p-4 sm:p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-black text-white text-xs font-black uppercase px-2.5 py-1 tracking-wider">
            sitemaps.org 0.9
          </span>
          <span className="bg-white text-black text-xs font-black uppercase px-2.5 py-1 border-2 border-black flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-green-600" />
            W3C Valid XML
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-black leading-tight flex items-center gap-3">
          <FileCode className="shrink-0 stroke-[2.5]" size={36} />
          XML Sitemap Index
        </h1>
        <p className="font-bold text-black text-sm sm:text-base md:text-lg max-w-3xl">
          Search engine protocol index specifying canonical endpoints, crawl frequencies, priorities, and last modified timestamps for all {parsedUrls.length} published routes.
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-2">
          <div className="bg-white border-2 border-black p-2.5 text-center">
            <span className="text-[10px] font-black uppercase text-neutral-600 block">Total URLs</span>
            <span className="text-xl sm:text-2xl font-black font-mono text-black">{parsedUrls.length}</span>
          </div>
          <div className="bg-white border-2 border-black p-2.5 text-center">
            <span className="text-[10px] font-black uppercase text-neutral-600 block">Web Utilities</span>
            <span className="text-xl sm:text-2xl font-black font-mono text-black">{TOOLS.length}</span>
          </div>
          <div className="bg-white border-2 border-black p-2.5 text-center">
            <span className="text-[10px] font-black uppercase text-neutral-600 block">Guides & Articles</span>
            <span className="text-xl sm:text-2xl font-black font-mono text-black">{BLOG_POSTS.length}</span>
          </div>
          <div className="bg-white border-2 border-black p-2.5 text-center">
            <span className="text-[10px] font-black uppercase text-neutral-600 block">Static & Hubs</span>
            <span className="text-xl sm:text-2xl font-black font-mono text-black">17</span>
          </div>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
        <button
          onClick={handleDownload}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-yellow-400 text-black font-black text-xs sm:text-sm uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer min-h-[44px]"
        >
          <Download size={16} className="stroke-[2.5]" />
          Download sitemap.xml
        </button>

        <button
          onClick={handleCopy}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white dark:bg-black text-black dark:text-white font-black text-xs sm:text-sm uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer min-h-[44px]"
        >
          {copied ? <Check size={16} className="text-green-500 stroke-[3]" /> : <Copy size={16} />}
          {copied ? 'XML Copied to Clipboard!' : 'Copy Raw XML'}
        </button>

        <a
          href="/sitemap.xml"
          download="sitemap.xml"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white font-black text-xs sm:text-sm uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all min-h-[44px]"
        >
          <ExternalLink size={16} />
          Direct File Download
        </a>

        {/* View Switcher */}
        <div className="flex border-4 border-black sm:ml-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <button
            onClick={() => setActiveTab('xml')}
            className={`px-4 py-2 text-xs font-black uppercase flex items-center gap-1.5 transition-colors cursor-pointer min-h-[40px] ${
              activeTab === 'xml' 
                ? 'bg-black text-white dark:bg-yellow-400 dark:text-black' 
                : 'bg-white dark:bg-neutral-800 text-black dark:text-white'
            }`}
          >
            <Code2 size={14} />
            Raw XML
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 text-xs font-black uppercase flex items-center gap-1.5 border-l-2 border-black transition-colors cursor-pointer min-h-[40px] ${
              activeTab === 'list' 
                ? 'bg-black text-white dark:bg-yellow-400 dark:text-black' 
                : 'bg-white dark:bg-neutral-800 text-black dark:text-white'
            }`}
          >
            <List size={14} />
            URL Index ({parsedUrls.length})
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'xml' ? (
        <div className="bg-neutral-900 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-black border-b-2 border-neutral-700 text-xs font-mono text-neutral-300">
            <span className="font-bold text-yellow-400">sitemap.xml (UTF-8)</span>
            <div className="flex items-center gap-3">
              <span>{xmlContent.length.toLocaleString()} bytes</span>
              <span>{parsedUrls.length} records</span>
            </div>
          </div>
          <pre className="p-4 sm:p-6 text-yellow-300 font-mono text-xs sm:text-sm overflow-x-auto max-h-[550px] leading-relaxed select-all">
            {xmlContent}
          </pre>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#181922] border-4 border-black p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black pb-3">
            <div>
              <h2 className="text-xl font-black uppercase">Indexed Canonical URLs</h2>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                All {parsedUrls.length} destinations registered in this XML sitemap
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={14} />
              <input
                type="text"
                value={filterQuery}
                onChange={e => setFilterQuery(e.target.value)}
                placeholder="Filter sitemap URLs..."
                className="w-full pl-9 pr-3 py-1.5 text-xs font-bold border-2 border-black bg-neutral-50 dark:bg-neutral-900"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b-4 border-black bg-neutral-100 dark:bg-neutral-800 text-xs font-black uppercase">
                  <th className="p-2.5">Resource Label</th>
                  <th className="p-2.5">Canonical URL Path</th>
                  <th className="p-2.5 text-center">Type</th>
                  <th className="p-2.5 text-center">Changefreq</th>
                  <th className="p-2.5 text-center">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-neutral-200 dark:divide-neutral-800 font-mono text-xs">
                {filteredUrls.map(item => (
                  <tr key={item.path} className="hover:bg-yellow-50 dark:hover:bg-neutral-800/60">
                    <td className="p-2.5 font-sans font-bold text-neutral-900 dark:text-neutral-100">
                      {item.label}
                    </td>
                    <td className="p-2.5">
                      <Link 
                        to={item.path}
                        className="text-blue-600 dark:text-yellow-400 hover:underline break-all"
                      >
                        {item.path}
                      </Link>
                    </td>
                    <td className="p-2.5 text-center">
                      <span className={`px-2 py-0.5 text-[10px] font-sans font-black uppercase border border-black ${
                        item.type === 'static' ? 'bg-blue-200 text-black' :
                        item.type === 'category' ? 'bg-purple-200 text-black' :
                        item.type === 'tool' ? 'bg-yellow-300 text-black' :
                        'bg-green-200 text-black'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="p-2.5 text-center text-neutral-600 dark:text-neutral-400">
                      {item.changefreq}
                    </td>
                    <td className="p-2.5 text-center font-bold text-neutral-900 dark:text-neutral-100">
                      {item.priority}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Informational Guidance Footer */}
      <div className="bg-neutral-100 dark:bg-neutral-800 border-2 border-black p-4 text-xs space-y-1.5">
        <p className="font-black uppercase text-neutral-900 dark:text-neutral-100">
          Search Engine Integration Note:
        </p>
        <p className="text-neutral-700 dark:text-neutral-300">
          This XML sitemap is declared in <code className="font-bold bg-neutral-200 dark:bg-neutral-700 px-1 py-0.5 border border-black">robots.txt</code>. 
          When submitting to Google Search Console or Bing Webmaster Tools, submit <code className="font-bold bg-neutral-200 dark:bg-neutral-700 px-1 py-0.5 border border-black">sitemap.xml</code> as the index path.
        </p>
      </div>
    </div>
  );
}
