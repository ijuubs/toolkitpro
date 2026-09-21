import { Fragment, useState, type ComponentType } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { TOOLS } from '../data/toolsData';
import { BLOG_POSTS } from '../data/blogData';
import AdSlot from '../components/AdSlot';
import HeroMiniTool from '../components/HeroMiniTool';
import { SITE_URL } from '../config/site';
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
  Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';


export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');


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
              <span>100% Client-Side Privacy • Zero Server Uploads</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase leading-[0.95] text-[var(--g6)]">
              Free Online Utilities & Everyday Calculators
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[var(--muted)] font-bold max-w-3xl leading-relaxed">
              ToolkitPro provides professional-grade online utility tools for developers, businesses, and everyday productivity. Process data instantly and securely in your browser—no sign-ups required.
            </p>

            {/* Interactive Live Mini-Tool Sandbox */}
            <HeroMiniTool />
        </div>

        {/* SEARCH BAR */}
        <div className="space-y-6">
          <div className="bg-white border-4 border-black p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Search className="w-5 h-5 text-black shrink-0" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a tool... (e.g. JSON Formatter, Word Counter, Loan Calculator)" 
                  className="w-full text-sm sm:text-base md:text-lg font-bold px-2 py-1 border-2 border-transparent focus:border-black focus:outline-none placeholder-neutral-600 dark:placeholder-neutral-400"
                />
              </div>
              <button 
                onClick={() => setSearchQuery('')}
                className="bg-black text-white px-6 py-2.5 font-black uppercase tracking-wider hover:bg-yellow-400 hover:text-black transition-all border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 shrink-0 min-h-[44px]"
              >
                {searchQuery ? 'Clear' : 'Search'}
              </button>
          </div>
        </div>

        {/* CATEGORY SECTION */}
        <section className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter border-b-4 border-black pb-2">Browse by Category</h2>
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

        {/* ALL TOOLS SECTION */}
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b-4 border-black pb-2 gap-2">
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter">
                Tool Directory
              </h2>
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
                    {filteredTools.map((tool, index) => (
                      <Fragment key={tool.id}>
                        <motion.div
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
                        {/* Insert an ad after every 6 tools for in-feed monetization */}
                        {(index + 1) % 6 === 0 && (
                          <div key={`ad-${index}`} className="sm:col-span-2 lg:col-span-1 min-h-[300px]">
                            <AdSlot adSlot="9791142997" adFormat="rectangle" minHeight="300px" className="my-0 h-full" />
                          </div>
                        )}
                      </Fragment>
                    ))}
                </motion.div>
            )}
        </div>

        <section className="bg-black text-white p-5 sm:p-8 md:p-12 border-4 border-black shadow-[6px_6px_0px_0px_rgba(251,191,36,1)] md:shadow-[12px_12px_0px_0px_rgba(251,191,36,1)]">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 sm:mb-6 md:mb-8 uppercase text-yellow-300 tracking-tighter">Essential Workflows</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                {TOOLS.slice(0, 4).map(tool => (
                    <Link 
                        key={tool.id} 
                        to={`/tools/${tool.slug}`} 
                        className="p-4 sm:p-5 md:p-6 bg-white text-black border-4 border-black hover:bg-yellow-100 transition-colors"
                    >
                        <h3 className="text-lg sm:text-xl md:text-2xl font-black mb-1 md:mb-2 uppercase">{tool.name}</h3>
                        <p className="font-medium text-xs sm:text-sm md:text-base">{tool.description}</p>
                    </Link>
                ))}
            </div>
        </section>

        <section className="space-y-8 md:space-y-12 bg-white p-6 sm:p-8 md:p-12 border-4 border-black border-dashed" itemScope itemType="https://schema.org/Article">
            <div className="max-w-4xl space-y-6 md:space-y-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter border-b-4 md:border-b-8 border-black pb-3 md:pb-4 leading-tight">Your Ultimate Hub for Utility Tools</h2>
              <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none text-black leading-relaxed space-y-4 md:space-y-6">
                  <p className="font-bold text-lg md:text-xl">
                    Welcome to ToolKitPro, your comprehensive destination for high-quality, professional-grade online utility tools. Whether you are a developer formatting JSON payloads, a student counting words for an essay, or a business owner calculating profit margins, our suite of tools is designed to accelerate your workflow.
                  </p>
                  
                  <h3 className="text-xl md:text-2xl font-black uppercase mt-6 md:mt-8 mb-2 md:mb-4">What Are Free Online Utility Tools?</h3>
                  <p className="text-sm md:text-base">
                    Online utility tools are specialized, single-purpose web applications designed to solve specific problems quickly. Instead of downloading heavy software suites or dealing with complex configurations, you simply open your browser and get the job done. From developers who need quick <strong>URL Encoding</strong> or <strong>JSON Formatting</strong>, to writers who need instantaneous <strong>Word Counters</strong>, online tools provide immediate value with zero friction.
                  </p>

                  <h3 className="text-xl md:text-2xl font-black uppercase mt-6 md:mt-8 mb-2 md:mb-4">Developer & Programmer Tools</h3>
                  <p className="text-sm md:text-base">
                    Software engineering requires precision. Our developer tools are built to help programmers debug, format, and convert data structures without relying on questionable third-party cloud processors. All our developer tools like the JSON Formatter and URL Encoder operate 100% locally in your browser to maintain the highest standard of data privacy. No data is sent to our servers.
                  </p>

                  <h3 className="text-xl md:text-2xl font-black uppercase mt-6 md:mt-8 mb-2 md:mb-4">Business & Financial Calculators</h3>
                  <p className="text-sm md:text-base">
                    Time is money in the business world. ToolKitPro offers a growing suite of financial calculators designed to help entrepreneurs and professionals make data-driven decisions. Whether you are forecasting with a <strong>Compound Interest Calculator</strong>, analyzing a new venture with an <strong>ROI Calculator</strong>, or determining your retail pricing with our upcoming <strong>Profit Margin Calculator</strong>, we provide accurate, instant calculations.
                  </p>
                  
                  <h3 className="text-xl md:text-2xl font-black uppercase mt-6 md:mt-8 mb-2 md:mb-4">Everyday Productivity Tools</h3>
                  <p className="text-sm md:text-base">
                    You don't need to be a software engineer to benefit from utility tools. Our platform includes essential productivity instruments for daily tasks. Generate robust security credentials with our <strong>Password Generator</strong>, compress heavy documents with our <strong>PDF Compressor</strong>, or effortlessly convert metrics with our <strong>Unit Converter</strong>. Every tool is optimized for mobile and desktop, ensuring you can work efficiently from anywhere.
                  </p>

                  <h3 className="text-xl md:text-2xl font-black uppercase mt-6 md:mt-8 mb-2 md:mb-4">The Benefits of Using ToolKitPro</h3>
                  <ul className="list-disc pl-5 md:pl-6 space-y-2 md:space-y-3 font-medium text-sm md:text-base">
                      <li><strong>100% Free to Use:</strong> No subscriptions, no hidden fees, and absolutely no paywalls.</li>
                      <li><strong>Client-Side Processing:</strong> Your data security is our priority. Tools run directly in your browser's memory, guaranteeing zero server retention.</li>
                      <li><strong>Instant Results:</strong> Because processing happens locally, you circumvent upload times and server latency. Get your results in milliseconds.</li>
                      <li><strong>No Sign-Up Required:</strong> Skip the annoying registration flows. Open the tool, input your data, and get instant results.</li>
                  </ul>
              </div>
            </div>
        </section>

        <section className="space-y-8 md:space-y-12 bg-yellow-50 p-6 sm:p-8 md:p-12 border-4 border-black">
          <div className="max-w-4xl space-y-6 md:space-y-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 md:mb-6 leading-tight">Built For Professionals</h2>
            <div className="grid sm:grid-cols-2 gap-8 md:gap-10">
              <div className="space-y-2 md:space-y-4">
                <h3 className="text-xl md:text-2xl font-black uppercase border-b-4 border-black pb-1 md:pb-2">100% Privacy</h3>
                <p className="font-medium text-black text-sm md:text-base">Unlike competing sites, we don't store your data. PDF compression, Image resizing, and JSON formatting all happen directly in your browser. Your sensitive information never leaves your machine.</p>
              </div>
              <div className="space-y-2 md:space-y-4">
                <h3 className="text-xl md:text-2xl font-black uppercase border-b-4 border-black pb-1 md:pb-2">Technical Rigor</h3>
                <p className="font-medium text-black text-sm md:text-base">Our calculators are built on verified scientific formulas (like WHO-standard BMI) and industrial-grade algorithms (like Lanczos resampling for image scaling).</p>
              </div>
              <div className="space-y-2 md:space-y-4">
                <h3 className="text-xl md:text-2xl font-black uppercase border-b-4 border-black pb-1 md:pb-2">Zero Friction</h3>
                <p className="font-medium text-black text-sm md:text-base">No accounts. No sign-ups. We provide a clean, Neu-Brutalist utility experience supported by unobtrusive ads, keeping the tools free for high-performance users.</p>
              </div>
              <div className="space-y-2 md:space-y-4">
                <h3 className="text-xl md:text-2xl font-black uppercase border-b-4 border-black pb-1 md:pb-2">Expert Insights</h3>
                <p className="font-medium text-black text-sm md:text-base">Every tool is accompanied by deep technical guides and FAQs, ensuring you not only get the result you need but also understand the math and logic behind it.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8 md:space-y-12 bg-white p-6 sm:p-8 md:p-12 border-4 border-black border-dashed">
          <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
            <div className="flex justify-between items-end border-b-8 border-black pb-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight">Latest Articles</h2>
              <Link to="/blog" className="hidden sm:block text-lg font-black uppercase underline hover:bg-yellow-400 hover:text-black px-2 py-1 transition-colors">View All &rarr;</Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {BLOG_POSTS.slice(0, 3).map(post => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="block border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(250,204,21,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col h-full">
                  <div className="p-4 sm:p-6 flex flex-col flex-grow">
                    <div className="text-xs font-black uppercase text-neutral-900 dark:text-neutral-100 mb-2">{post.category}</div>
                    <h3 className="text-xl sm:text-2xl font-black uppercase mb-3 leading-tight">{post.title}</h3>
                    <p className="font-medium text-sm sm:text-base text-neutral-900 dark:text-neutral-100 flex-grow">{post.excerpt}</p>
                    <div className="mt-4 pt-4 border-t-2 border-black flex justify-between items-center text-xs font-bold uppercase">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="sm:hidden mt-6 text-center">
              <Link to="/blog" className="inline-block px-8 py-3 bg-black text-white text-lg font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all">View All Articles</Link>
            </div>
          </div>
          
          <div className="border-t-4 border-black pt-8 md:pt-12 flex flex-col items-center text-center space-y-4 md:space-y-6">
            <h3 className="text-2xl md:text-3xl font-black uppercase italic leading-tight">Ready to optimize your workflow?</h3>
            <Link to="/about" className="px-8 py-3 md:px-12 md:py-4 bg-black text-white text-lg md:text-xl font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black border-4 border-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-1 active:translate-y-1">Learn More About Us</Link>
          </div>
        </section>
    </div>
  );
}
