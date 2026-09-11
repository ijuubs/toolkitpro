import { Outlet, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';
import CookieConsent from './CookieConsent';
import BackToTop from './BackToTop';
import { SITE_URL } from '../config/site';

export default function Layout() {
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
    <div className="min-h-screen bg-[var(--g0)] text-[var(--ink)] font-sans transition-colors duration-300 flex flex-col">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(orgSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
      </Helmet>
      <header className="sticky top-0 z-50 bg-[rgba(244,250,244,0.88)] dark:bg-[#1a1a1a]/80 backdrop-blur-lg border-b-4 border-black">
        <nav className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 font-black text-xl sm:text-3xl uppercase tracking-tighter shrink-0">
            <Logo size="sm" />
            <span className="text-xl sm:text-3xl text-[var(--g6)]">ToolKitPro</span>
          </Link>
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-yellow-300 text-black border-2 border-black font-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse inline-block" />
            <span>100% Client-Side RAM Processing</span>
          </div>
          <div className="flex gap-2 sm:gap-4 md:gap-6 items-center">
            <Link to="/" className="hidden md:block text-sm font-black uppercase px-2 py-1 hover:bg-yellow-400 hover:text-black transition-colors">Tools</Link>
            <Link to="/analytics" className="hidden md:block text-sm font-black uppercase px-2 py-1 hover:bg-yellow-400 hover:text-black transition-colors">Analytics</Link>
            <Link to="/blog" className="hidden md:block text-sm font-black uppercase px-2 py-1 hover:bg-yellow-400 hover:text-black transition-colors">Blog</Link>
            <Link to="/about" className="hidden md:block text-sm font-black uppercase px-2 py-1 hover:bg-yellow-400 hover:text-black transition-colors">About</Link>
            <ThemeToggle />
            <Link to="/" className="bg-black text-white px-3 py-1.5 sm:px-6 sm:py-2 border-2 border-black font-black uppercase text-xs sm:text-sm hover:bg-yellow-400 hover:text-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5">
              All Tools
            </Link>
          </div>
        </nav>
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
              <li><a href="/sitemap.xml" target="_blank" rel="noreferrer" className="hover:text-yellow-400 transition-colors">XML Sitemap Index</a></li>
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
