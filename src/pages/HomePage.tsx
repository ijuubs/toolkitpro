import { Fragment, useState, type ComponentType } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { TOOLS } from '../data/toolsData';
import { BLOG_POSTS } from '../data/blogData';
import HeroMiniTool from '../components/HeroMiniTool';
import { SITE_URL } from '../config/site';
import { getRecentTools } from '../utils/recentTools';
import { 
  Code2, 
  HardHat, 
  TrendingUp, 
  HeartPulse, 
  Compass, 
  LayoutGrid, 
  ShieldCheck, 
  Search, 
  Zap, 
  Lock,
  ArrowRight,
  Palette,
  Clock,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Tool } from '../data/toolsData';


export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentTools] = useState<Tool[]>(() => getRecentTools());


  const filteredTools = TOOLS.filter(tool => {
    return !searchQuery.trim() || (
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.aliases?.some(alias => alias.replace(/-/g, ' ').includes(searchQuery.toLowerCase()))
    );
  });


  const getToolBadge = (tool: typeof TOOLS[0]) => {
    if (['json-formatter', 'url-encoder', 'qr-code-generator', 'password-generator', 'color-picker', 'lorem-ipsum'].includes(tool.id)) {
      return 'Developer';
    }
    if (['unit-converter', 'fiji-mortgage-calculator', 'fiji-electricity-bill-calculator'].includes(tool.id)) {
      return 'Construction & Home';
    }
    if (['compound-interest-calculator', 'roi-calculator', 'sip-calculator', 'loan-calculator'].includes(tool.id)) {
      return 'Finance';
    }
    if (['bmi-calculator', 'tdee-calculator', 'age-calculator'].includes(tool.id)) {
      return 'Health & Lifestyle';
    }
    if (tool.id.startsWith('fiji-')) {
      return 'Fiji Utility';
    }
    return tool.category.replace(' Tools', '');
  };

  return (
    <div className="space-y-12 md:space-y-20">
        <Helmet>
          <title>Free Online Utility Tools & Calculators | ToolKitPro</title>
          <meta name="description" content="Access a massive collection of free online utility tools, developer utilities, calculators, and productivity apps. Process everything instantly and securely in your browser." />
          
          <link rel="canonical" href={`${SITE_URL}/`} />
          <meta property="og:title" content="Free Online Utility Tools & Calculators | ToolKitPro" />
          <meta property="og:description" content="Access a massive collection of free online utility tools, developer utilities, calculators, and productivity apps. Process everything instantly and securely in your browser." />
          <meta property="og:url" content={`${SITE_URL}/`} />
          <meta property="og:type" content="website" />
          
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Free Online Utility Tools & Calculators | ToolKitPro" />
          <meta name="twitter:description" content="Access a massive collection of free online utility tools, developer utilities, calculators, and productivity apps. Process everything instantly and securely in your browser." />

          <script type="application/ld+json">
            {JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "ToolKitPro",
                "url": `${SITE_URL}/`,
                "description": "Free online utility tools, developer utilities, calculators, and productivity apps."
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "ToolKitPro",
                "url": `${SITE_URL}/`,
                "logo": `${SITE_URL}/toolkitpro-logo.jpg`
              }
            ])}
          </script>
        </Helmet>
        
        {/* HERO SECTION */}
        <div className="text-center md:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-300 border-2 border-black font-black uppercase text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <ShieldCheck className="w-4 h-4 text-black" />
              <span>Inputs are processed in your browser and not uploaded</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] text-[var(--g6)]">
              Browser-Native <br className="hidden md:block" /> Utilities
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[var(--muted)] font-bold max-w-3xl leading-relaxed">
              Professional-grade tools for developers, finance, and daily productivity. 100% private, instant, and secure.
            </p>

            {/* SEARCH BAR (Hierarchy #1) */}
            <div className="pt-4">
              <div className="bg-white border-4 border-black p-2 sm:p-3 flex flex-col sm:flex-row gap-2 sm:gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-w-2xl">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Search className="w-5 h-5 text-black shrink-0 ml-2" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Find a tool..." 
                      className="w-full text-sm sm:text-base md:text-lg font-bold px-2 py-1 border-2 border-transparent focus:border-black focus:outline-none placeholder-neutral-500"
                    />
                  </div>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="bg-black text-white px-8 py-2 font-black uppercase tracking-wider hover:bg-yellow-400 hover:text-black transition-all border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 shrink-0 min-h-[44px]"
                  >
                    {searchQuery ? 'Clear' : 'Search'}
                  </button>
              </div>
            </div>
        </div>

        {/* RECENTLY USED SECTION */}
        {recentTools.length > 0 && !searchQuery && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b-4 border-black pb-2">
              <Clock className="w-5 h-5 text-black" />
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter">Continue Working</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
              {recentTools.map(tool => (
                <Link 
                  key={tool.id} 
                  to={`/tools/${tool.slug}`}
                  className="p-3 bg-yellow-50 border-2 border-black hover:bg-yellow-200 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] flex flex-col justify-between min-h-[80px]"
                >
                  <span className="font-black uppercase text-[10px] leading-tight line-clamp-2">{tool.name}</span>
                  <div className="mt-2 text-[10px] font-bold text-neutral-500 flex justify-between items-center">
                    <span>Open</span>
                    <ArrowRight size={10} />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FEATURED TOOLS (Hierarchy #2) */}
        {!searchQuery && (
          <section className="space-y-6">
              <div className="flex items-center justify-between border-b-4 border-black pb-2">
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter">Featured Tools</h2>
                <div className="flex items-center gap-2 text-xs font-black uppercase bg-black text-white px-2 py-0.5">
                  <Zap size={12} className="text-yellow-400 fill-yellow-400" /> Essential
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {TOOLS.filter(t => ['word-counter', 'json-formatter', 'qr-code-generator', 'loan-calculator'].includes(t.id)).map(tool => (
                      <Link 
                          key={tool.id} 
                          to={`/tools/${tool.slug}`} 
                          className="group p-5 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-yellow-50 transition-all flex flex-col justify-between h-full"
                      >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-black text-white">{getToolBadge(tool)}</span>
                              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-black uppercase mb-2 leading-tight">{tool.name}</h3>
                            <p className="font-medium text-xs text-[var(--muted)] line-clamp-2">{tool.description}</p>
                          </div>
                      </Link>
                  ))}
              </div>
          </section>
        )}

        {/* FIJI TOOLS SPOTLIGHT (Hierarchy #3) */}
        {!searchQuery && (
          <section className="bg-emerald-50 border-4 border-black p-6 sm:p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(16,185,129,1)]">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div className="space-y-2">
                  <span className="inline-block bg-black text-white text-[10px] font-black uppercase px-2 py-1 tracking-widest">Localized Hub</span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter">Fiji Utility Suite</h2>
                  <p className="text-sm sm:text-base font-bold text-emerald-800 max-w-2xl">Official calculators for Fiji workers & businesses. Aligned with current FRCS, FNPF, and FCCC statutory regulations.</p>
                </div>
                <Link to="/fiji-tools" className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-black uppercase text-sm border-2 border-black hover:bg-emerald-600 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 shrink-0">
                  Explore Fiji Tools <ArrowRight size={18} />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {TOOLS.filter(t => ['fiji-vat-calculator', 'fiji-salary-calculator', 'fiji-taxi-fare-calculator'].includes(t.id)).map(tool => (
                      <Link 
                          key={tool.id} 
                          to={`/tools/${tool.slug}`} 
                          className="p-4 bg-white border-2 border-black hover:bg-emerald-100 transition-colors flex items-center justify-between"
                      >
                          <span className="font-black uppercase text-sm">{tool.name}</span>
                          <ChevronRight size={18} className="text-emerald-600" />
                      </Link>
                  ))}
              </div>
          </section>
        )}

        {/* CATEGORY SECTION (Hierarchy #4) */}
        {!searchQuery && (
          <section className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter border-b-4 border-black pb-2">Popular Categories</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3 md:gap-4">
                  {[
                      { name: 'Calculators', slug: 'calculators', icon: TrendingUp },
                      { name: 'Image Tools', slug: 'image-tools', icon: LayoutGrid },
                      { name: 'Text Tools', slug: 'text-tools', icon: Code2 },
                      { name: 'Developer Tools', slug: 'developer-tools', icon: Code2 },
                      { name: 'Converters', slug: 'converters', icon: Compass },
                      { name: 'Fiji Tools', slug: 'fiji-tools', icon: HardHat },
                      { name: 'Color Tools', slug: 'color-tools', icon: Palette },
                  ].map(cat => (
                      <Link key={cat.slug} to={`/${cat.slug}`} className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white border-4 border-black hover:bg-yellow-100 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] min-h-[72px]">
                          <cat.icon className="w-6 h-6 sm:w-8 sm:h-8 mb-1.5 sm:mb-2 text-[var(--ink)]" />
                          <span className="font-black uppercase text-[11px] sm:text-xs text-center leading-tight">{cat.name}</span>
                      </Link>
                  ))}
              </div>
          </section>
        )}

        {/* PRIVACY & CLIENT-SIDE PROCESSING (Hierarchy #5) */}
        {!searchQuery && (
          <section className="bg-black text-white p-8 sm:p-12 md:p-16 border-4 border-black shadow-[10px_10px_0px_0px_rgba(250,204,21,1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Lock size={120} />
              </div>
              <div className="relative z-10 max-w-3xl space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400 text-black font-black uppercase text-[10px] tracking-widest">Privacy First</div>
                <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-[0.95]">Your data never leaves your device.</h2>
                <p className="text-lg sm:text-xl font-bold text-neutral-300 leading-relaxed">Unlike traditional tools that upload your files and data to their servers, ToolKitPro uses <span className="text-yellow-400">WebAssembly and Browser-Native APIs</span>. Everything stays 100% local, guaranteed.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-yellow-400 shrink-0" size={24} />
                    <span className="text-xs font-black uppercase tracking-wider">Zero Uploads</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-yellow-400 shrink-0" size={24} />
                    <span className="text-xs font-black uppercase tracking-wider">Zero Retention</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-yellow-400 shrink-0" size={24} />
                    <span className="text-xs font-black uppercase tracking-wider">100% Private</span>
                  </div>
                </div>
              </div>
          </section>
        )}

        {/* PWA INSTALLATION (Hierarchy #6) */}
        {!searchQuery && (
          <section className="bg-yellow-400 border-4 border-black p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="bg-black text-white p-3 border-2 border-black hidden sm:block">
                <Zap size={32} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">ToolkitPro Desktop & Mobile</h2>
                <p className="text-sm font-bold text-black opacity-80 uppercase tracking-wide">Install as a lightweight app for offline access and instant loading.</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <div className="px-4 py-2 bg-white border-2 border-black font-black uppercase text-[10px]">PWA Ready</div>
              <div className="px-4 py-2 bg-white border-2 border-black font-black uppercase text-[10px]">Offline Support</div>
            </div>
          </section>
        )}

        {/* USEFUL GUIDES (Hierarchy #7) */}
        {!searchQuery && (
          <section className="space-y-8">
            <div className="flex justify-between items-end border-b-8 border-black pb-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight">Useful Guides</h2>
              <Link to="/blog" className="hidden sm:block text-lg font-black uppercase underline hover:bg-yellow-400 hover:text-black px-2 py-1 transition-colors">View All &rarr;</Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {BLOG_POSTS.slice(0, 3).map(post => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="block border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(250,204,21,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col h-full">
                  <div className="p-4 sm:p-6 flex flex-col flex-grow">
                    <div className="text-xs font-black uppercase text-neutral-900 dark:text-neutral-100 mb-2">{post.category}</div>
                    <h3 className="text-xl sm:text-2xl font-black uppercase mb-3 leading-tight">{post.title}</h3>
                    <p className="font-medium text-sm sm:text-base text-neutral-900 dark:text-neutral-100 flex-grow line-clamp-3">{post.excerpt}</p>
                    <div className="mt-4 pt-4 border-t-2 border-black flex justify-between items-center text-xs font-bold uppercase">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ALL TOOLS SECTION */}
        <div className="space-y-6 pt-10">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b-4 border-black pb-2 gap-2">
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter">
                {searchQuery ? 'Search Results' : 'Full Tool Directory'}
              </h2>
              {!searchQuery && <span className="text-xs font-bold uppercase text-neutral-500">{TOOLS.length} Utilities Available</span>}
            </div>
            {filteredTools.length === 0 ? (
                <div className="text-center py-12 border-4 border-black border-dashed bg-white p-8">
                    <p className="text-xl sm:text-2xl font-black uppercase mb-3">No tools found matching your criteria</p>
                    <p className="text-sm font-medium text-[var(--muted)] mb-6">Try searching for generic terms like "calculator", "converter", or select "All Tools".</p>
                    <button 
                      onClick={() => { setSearchQuery(''); }}
                      className="px-6 py-3 bg-black text-white font-black uppercase text-sm border-2 border-black hover:bg-yellow-400 hover:text-black transition-all min-h-[44px]"
                    >
                      Show All Tools
                    </button>
                </div>
            ) : (
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.04 }
                    }
                  }}
                >
                    {filteredTools.map((tool) => (
                      <motion.div
                        key={tool.id}
                        variants={{
                          hidden: { opacity: 0, y: 12 },
                          visible: { opacity: 1, y: 0 }
                        }}
                        className="flex flex-col"
                      >
                        <Link 
                          to={`/tools/${tool.slug}`} 
                          className="group p-5 sm:p-6 md:p-8 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between h-full min-w-0 overflow-hidden"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border border-black bg-yellow-300 text-black inline-block">
                                {getToolBadge(tool)}
                              </span>
                              <span className="text-xs font-black uppercase group-hover:translate-x-1 transition-transform">
                                →
                              </span>
                            </div>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-black mb-2 uppercase leading-tight break-words text-[var(--g6)]">
                              {tool.name}
                            </h3>
                            <p className="font-medium text-xs sm:text-sm md:text-base text-[var(--muted)] leading-relaxed line-clamp-3">
                              {tool.description}
                            </p>
                          </div>
                          <div className="mt-5 pt-3 border-t-2 border-black flex items-center justify-between text-xs font-black uppercase">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-300 text-black border-2 border-black font-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:bg-black group-hover:text-yellow-300 transition-colors">
                              Launch Tool <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                              Instant
                            </span>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                </motion.div>
            )}
        </div>

        {/* SEO CONTENT SECTION */}
        {!searchQuery && (
          <section className="space-y-8 md:space-y-12 bg-white p-6 sm:p-8 md:p-12 border-4 border-black border-dashed" itemScope itemType="https://schema.org/Article">
              <div className="max-w-4xl space-y-6 md:space-y-8">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter border-b-4 md:border-b-8 border-black pb-3 md:pb-4 leading-tight">ToolKitPro Philosophy</h2>
                <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none text-black leading-relaxed space-y-4 md:space-y-6">
                    <p className="font-bold text-lg md:text-xl">
                      Welcome to ToolKitPro, your comprehensive destination for high-quality, professional-grade online utility tools. Whether you are a developer formatting JSON payloads, a student counting words for an essay, or a business owner calculating profit margins, our suite of tools is designed to accelerate your workflow.
                    </p>
                    
                    <h3 className="text-xl md:text-2xl font-black uppercase mt-6 md:mt-8 mb-2 md:mb-4">Why Local Browser Processing?</h3>
                    <p className="text-sm md:text-base">
                      The traditional web model of uploading sensitive files or data to a server for processing is outdated and insecure. ToolKitPro leverages modern browser technologies to process your data right where it lives—on your computer. 
                    </p>
                    <ul className="list-disc pl-5 md:pl-6 space-y-2 md:space-y-3 font-medium text-sm md:text-base">
                        <li><strong>100% Free:</strong> No subscriptions or paywalls.</li>
                        <li><strong>Client-Side:</strong> Your data never touches our servers.</li>
                        <li><strong>Offline Ready:</strong> Many tools work without an active internet connection.</li>
                        <li><strong>Zero Friction:</strong> No sign-ups or logins required.</li>
                    </ul>
                </div>
              </div>
          </section>
        )}
    </div>
  );
}
