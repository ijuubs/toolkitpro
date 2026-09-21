import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Menu, X, ChevronRight, LayoutGrid, BarChart3, BookOpen, Info, HelpCircle, Mail, Map } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';
import CookieConsent from './CookieConsent';
import BackToTop from './BackToTop';
import { SITE_URL } from '../config/site';

const CATEGORIES = [
  { name: 'Calculators', slug: 'calculators' },
  { name: 'Image Tools', slug: 'image-tools' },
  { name: 'Text Tools', slug: 'text-tools' },
  { name: 'Developer Tools', slug: 'developer-tools' },
  { name: 'Converters', slug: 'converters' },
  { name: 'Fiji Tools', slug: 'fiji-tools' },
  { name: 'Color Tools', slug: 'color-tools' },
];

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ToolKitPro",
    "url": `${SITE_URL}/`,
    "logo": `${SITE_URL}/toolkitpro-logo.jpg`,
    "description": "Premium browser-side utility ecosystem. Fast, private, and professional."
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ToolKitPro",
    "url": `${SITE_URL}/`,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="min-h-screen bg-[var(--g0)] text-[var(--ink)] font-sans transition-colors duration-300 flex flex-col overflow-x-hidden">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(orgSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
      </Helmet>
      <header className="sticky top-0 z-50 bg-[rgba(244,250,244,0.92)] dark:bg-[#1a1a1a]/90 backdrop-blur-lg border-b-4 border-black">
        <nav className="max-w-[1200px] mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 font-black text-lg sm:text-2xl md:text-3xl uppercase tracking-tighter shrink-0">
            <Logo size="sm" />
            <span className="text-lg sm:text-2xl md:text-3xl text-[var(--g6)]">ToolKitPro</span>
          </Link>
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-yellow-300 text-black border-2 border-black font-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse inline-block" />
            <span>100% Client-Side RAM Processing</span>
          </div>
          <div className="flex gap-1.5 sm:gap-3 md:gap-6 items-center">
            <Link to="/" className="hidden md:block text-sm font-black uppercase px-2 py-1 hover:bg-yellow-400 hover:text-black transition-colors">Tools</Link>
            <Link to="/analytics" className="hidden md:block text-sm font-black uppercase px-2 py-1 hover:bg-yellow-400 hover:text-black transition-colors">Analytics</Link>
            <Link to="/blog" className="hidden md:block text-sm font-black uppercase px-2 py-1 hover:bg-yellow-400 hover:text-black transition-colors">Blog</Link>
            <Link to="/about" className="hidden md:block text-sm font-black uppercase px-2 py-1 hover:bg-yellow-400 hover:text-black transition-colors">About</Link>
            <ThemeToggle />
            <Link to="/" className="hidden sm:inline-flex bg-black text-white px-4 py-2 sm:px-6 sm:py-2 border-2 border-black font-black uppercase text-xs sm:text-sm hover:bg-yellow-400 hover:text-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5">
              All Tools
            </Link>

            {/* Mobile / Tablet Menu Trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-11 h-11 border-2 border-black bg-white dark:bg-[#181922] hover:bg-yellow-400 hover:text-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} className="stroke-[2.5]" /> : <Menu size={22} className="stroke-[2.5]" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-[64px] sm:top-[80px] bottom-0 z-40 bg-black/60 backdrop-blur-sm">
            <div className="bg-[var(--surface)] border-b-4 border-black max-h-[calc(100vh-64px)] sm:max-h-[calc(100vh-80px)] overflow-y-auto p-4 sm:p-6 space-y-6 shadow-[0px_8px_0px_0px_rgba(0,0,0,1)]">
              {/* Core Links */}
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-neutral-500 mb-2">Main Navigation</p>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-3 bg-white dark:bg-[#202020] border-2 border-black font-black uppercase text-xs hover:bg-yellow-300 hover:text-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 min-h-[44px]"
                  >
                    <LayoutGrid size={16} />
                    <span>All Tools</span>
                  </Link>
                  <Link
                    to="/analytics"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-3 bg-white dark:bg-[#202020] border-2 border-black font-black uppercase text-xs hover:bg-yellow-300 hover:text-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 min-h-[44px]"
                  >
                    <BarChart3 size={16} />
                    <span>Analytics</span>
                  </Link>
                  <Link
                    to="/blog"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-3 bg-white dark:bg-[#202020] border-2 border-black font-black uppercase text-xs hover:bg-yellow-300 hover:text-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 min-h-[44px]"
                  >
                    <BookOpen size={16} />
                    <span>Articles</span>
                  </Link>
                  <Link
                    to="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-3 bg-white dark:bg-[#202020] border-2 border-black font-black uppercase text-xs hover:bg-yellow-300 hover:text-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 min-h-[44px]"
                  >
                    <Info size={16} />
                    <span>About Us</span>
                  </Link>
                </div>
              </div>

              {/* Category Links */}
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-neutral-500 mb-2">Tool Categories</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CATEGORIES.map(cat => (
                    <Link
                      key={cat.slug}
                      to={`/${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-[#252525] border-2 border-black font-black uppercase text-xs hover:bg-yellow-200 hover:text-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 min-h-[44px]"
                    >
                      <span>{cat.name}</span>
                      <ChevronRight size={16} />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Utility & Help Links */}
              <div className="pt-4 border-t-2 border-black/20 flex flex-wrap gap-2 text-xs font-black uppercase">
                <Link
                  to="/faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-white dark:bg-[#202020] border-2 border-black hover:bg-yellow-300 hover:text-black transition-colors min-h-[44px]"
                >
                  <HelpCircle size={14} />
                  <span>FAQ</span>
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-white dark:bg-[#202020] border-2 border-black hover:bg-yellow-300 hover:text-black transition-colors min-h-[44px]"
                >
                  <Mail size={14} />
                  <span>Contact</span>
                </Link>
                <Link
                  to="/sitemap"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-white dark:bg-[#202020] border-2 border-black hover:bg-yellow-300 hover:text-black transition-colors min-h-[44px]"
                >
                  <Map size={14} />
                  <span>Sitemap</span>
                </Link>
              </div>

              {/* Privacy Badge */}
              <div className="p-3 bg-yellow-300 text-black border-2 border-black font-black text-xs text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                🛡️ 100% Client-Side Privacy • Zero Server Logging
              </div>
            </div>
          </div>
        )}
      </header>
      
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 md:py-12 flex-1 w-full">
        <Outlet />
      </main>

      <footer className="bg-black text-white py-12 md:py-16 px-4 sm:px-6 border-t-8 border-yellow-400">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div className="space-y-4 sm:col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-white">
              <Logo size="md" theme="dark" />
              ToolKitPro
            </Link>
            <p className="text-neutral-400 font-medium text-sm leading-relaxed">
              Open browser-based utility platform. All operations execute locally in your computer's memory. Zero tracking, zero server uploads.
            </p>
            <div className="inline-block px-2.5 py-1 bg-neutral-900 border border-neutral-700 text-xs text-yellow-300 font-mono font-bold">
              v2.5.0 • PWA Ready
            </div>
          </div>

          <div>
            <h4 className="font-black uppercase text-base mb-4 text-yellow-400 tracking-wider">Top Utilities</h4>
            <ul className="space-y-2.5 font-bold uppercase text-xs text-neutral-300">
              <li><Link to="/tools/word-counter" className="hover:text-yellow-400 transition-colors">Word Counter</Link></li>
              <li><Link to="/tools/json-formatter" className="hover:text-yellow-400 transition-colors">JSON Formatter</Link></li>
              <li><Link to="/tools/password-generator" className="hover:text-yellow-400 transition-colors">Password Generator</Link></li>
              <li><Link to="/tools/pdf-compressor" className="hover:text-yellow-400 transition-colors">PDF Compressor</Link></li>
              <li><Link to="/tools/image-resizer" className="hover:text-yellow-400 transition-colors">Image Resizer</Link></li>
              <li><Link to="/tools/qr-code-generator" className="hover:text-yellow-400 transition-colors">QR Code Generator</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase text-base mb-4 text-yellow-400 tracking-wider">Platform</h4>
            <ul className="space-y-2.5 font-bold uppercase text-xs text-neutral-300">
              <li><Link to="/analytics" className="hover:text-yellow-400 transition-colors">Real-Time Analytics</Link></li>
              <li><Link to="/blog" className="hover:text-yellow-400 transition-colors">Articles & Guides</Link></li>
              <li><Link to="/about" className="hover:text-yellow-400 transition-colors">About ToolKitPro</Link></li>
              <li><Link to="/contact" className="hover:text-yellow-400 transition-colors">Feedback & Contact</Link></li>
              <li><Link to="/faq" className="hover:text-yellow-400 transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/sitemap" className="hover:text-yellow-400 transition-colors">HTML Sitemap</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase text-base mb-4 text-yellow-400 tracking-wider">Privacy & Trust</h4>
            <ul className="space-y-2.5 font-bold uppercase text-xs text-neutral-300">
              <li><Link to="/privacy" className="hover:text-yellow-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-yellow-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/disclaimer" className="hover:text-yellow-400 transition-colors">Disclaimer</Link></li>
              <li><Link to="/sitemap.xml" className="hover:text-yellow-400 transition-colors">XML Sitemap Index</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-[1200px] mx-auto mt-12 pt-6 border-t border-neutral-800 text-xs font-bold uppercase tracking-wider text-neutral-400 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} ToolKitPro. Built for speed, privacy, and utility.</p>
          <div className="flex gap-4 text-xs font-black uppercase text-yellow-400">
            <Link to="/about" className="hover:underline">About</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:underline">Privacy</Link>
            <span>•</span>
            <Link to="/contact" className="hover:underline">Support</Link>
          </div>
        </div>
      </footer>
      <CookieConsent />
      <BackToTop />
    </div>
  );
}
