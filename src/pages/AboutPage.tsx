import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '../config/site';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      <Helmet>
        <title>About Us | ToolKitPro</title>
        <meta name="description" content="Learn more about ToolKitPro, your premier destination for high-performance, private, and secure online utility tools." />
        <link rel="canonical" href={`${SITE_URL}/about`} />
        <meta property="og:title" content="About Us | ToolKitPro" />
        <meta property="og:description" content="Learn more about ToolKitPro, your premier destination for high-performance, private, and secure online utility tools." />
        <meta property="og:url" content={`${SITE_URL}/about`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | ToolKitPro" />
        <meta name="twitter:description" content="Learn more about ToolKitPro, your premier destination for high-performance, private, and secure online utility tools." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About Us - ToolKitPro",
            "url": `${SITE_URL}/about`,
            "description": "Learn more about ToolKitPro, your premier destination for high-performance, private, and secure online utility tools.",
            "publisher": {
              "@type": "Organization",
              "name": "ToolKitPro",
              "url": `${SITE_URL}/`,
              "logo": `${SITE_URL}/toolkitpro-logo.jpg`
            }
          })}
        </script>
      </Helmet>
      
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter border-b-4 sm:border-b-8 border-black pb-3 sm:pb-4 text-black leading-tight">About ToolKitPro</h1>
      
      <div className="prose prose-xl max-w-none text-[var(--muted)] leading-relaxed space-y-8 sm:space-y-10">
        <div className="space-y-4 sm:space-y-6">
          <p className="font-bold text-black border-l-4 sm:border-l-8 border-yellow-400 pl-4 sm:pl-6 py-3 sm:py-4 bg-yellow-50 text-lg sm:text-2xl italic leading-snug">
            ToolKitPro was built with a single mission: to provide the world with professional-grade utility tools that respect user privacy and deliver instant results.
          </p>
          
          <p className="text-sm sm:text-base md:text-lg">
            In an era where the internet is cluttered with slow, bloated, and invasive "tool" sites, we decided to build something different. ToolKitPro follows a **Neu-Brutalist** design philosophy—sharp, fast, and honest. We don't hide our functions behind complex menus or unnecessary loading states.
          </p>
        </div>

        <section className="space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[var(--g6)] uppercase tracking-tighter">Our Story</h2>
          <p className="text-sm sm:text-base md:text-lg text-[var(--muted)] leading-relaxed">
            Founded in early 2024 by a small team of senior software engineers and product designers, ToolKitPro was born out of frustration. As developers, we found ourselves constantly searching for simple tools—like a high-quality JSON formatter or a fast image resizer—only to be met with sites that required logins, tracking cookies, and overwhelming paywalls.
          </p>
          <p className="text-sm sm:text-base md:text-lg text-[var(--muted)] leading-relaxed">
            We realized that the web needed a "neutral zone"—a place where utilities were built with industrial precision but designed for the modern user who values their time and privacy. With backgrounds in building scalable cloud architectures and accessible UI systems at top-tier tech firms, we combined our expertise to create a platform that is as robust as it is beautiful.
          </p>
        </section>

        <section className="bg-black text-white p-5 sm:p-8 md:p-10 border-4 sm:border-8 border-black shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] sm:shadow-[16px_16px_0px_0px_rgba(251,191,36,1)] space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-3xl font-black uppercase tracking-widest text-yellow-400">The Privacy Manifest</h2>
          <p className="font-medium text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
            Why do standard "free" utility sites want your email? Usually, they're building a list to sell or using trackers to follow you across the web. **ToolKitPro is different.**
          </p>
          <p className="font-medium text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
            Our core architecture is built on the principle of **Client-Side Sovereignty**. This means that for the vast majority of our tools, the math, the processing, and the transformation happen inside *your* browser. Your PDF never leaves your machine. Your image is resized in your local memory. Your password is generated via your device's own entropy source.
          </p>
        </section>

        <section className="space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--g6)] uppercase tracking-tighter">Open Source & Community</h2>
          <p className="text-sm sm:text-base md:text-lg text-[var(--muted)] leading-relaxed">
            We believe that the best tools are built together. ToolKitPro actively contributes to the open-source community by maintaining libraries that power our ecosystem—from high-performance string manipulation to complex health algorithms.
          </p>
          <p className="text-sm sm:text-base md:text-lg text-[var(--muted)] leading-relaxed">
            We also engage deeply with our community of over 50,000 monthly users to refine our tools. Every "feature request" or "bug report" we receive via our contact portal is read by a real engineer, not a bot. We are building ToolKitPro to be the infrastructure for your daily productivity.
          </p>
        </section>

        <h2 className="text-2xl sm:text-3xl font-black text-[var(--g6)] uppercase tracking-tighter">Our Core Philosophy</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 list-none pl-0">
          <li className="border-4 border-black p-4 sm:p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <strong className="block text-lg sm:text-xl uppercase mb-2 text-[var(--g6)]">Privacy First</strong>
            <span className="text-xs sm:text-sm md:text-base text-[var(--muted)]">Most tools run entirely in your browser. Your data stays where it belongs—with you.</span>
          </li>
          <li className="border-4 border-black p-4 sm:p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <strong className="block text-lg sm:text-xl uppercase mb-2 text-[var(--g6)]">Technical Perfection</strong>
            <span className="text-xs sm:text-sm md:text-base text-[var(--muted)]">We use WebAssembly and modern React to ensure tools are lightning fast and mathematically precise.</span>
          </li>
          <li className="border-4 border-black p-4 sm:p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <strong className="block text-lg sm:text-xl uppercase mb-2 text-[var(--g6)]">Zero Friction</strong>
            <span className="text-xs sm:text-sm md:text-base text-[var(--muted)]">No logins, no credit cards, no distraction. Just utilities that work instantly.</span>
          </li>
          
          <li className="border-4 border-black p-4 sm:p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <strong className="block text-lg sm:text-xl uppercase mb-2 text-[var(--g6)]">Educational Value</strong>
            <span className="text-xs sm:text-sm md:text-base text-[var(--muted)]">We don't just give you the answer; we explain the formula and the "why" behind it.</span>
          </li>
        </ul>

        <section className="space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--g6)] uppercase tracking-tighter">Brand Assets</h2>
          <p className="text-sm sm:text-base md:text-lg text-[var(--muted)]">
            Writing an article about ToolKitPro? Need our logo for a partnership? Download our official high-resolution branding assets below.
          </p>
          <div className="border-4 border-black bg-white p-4 sm:p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 sm:gap-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-36 h-36 sm:w-48 sm:h-48 border-4 border-black bg-white flex items-center justify-center p-3 sm:p-4 shrink-0">
              <img src="/toolkitpro-logo.jpg" alt="ToolKitPro Logo" className="max-w-full max-h-full" />
            </div>
            <div className="space-y-3 sm:space-y-4 flex-1 text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-black uppercase text-[var(--g6)]">Official Logo</h3>
              <p className="font-medium text-xs sm:text-sm md:text-base text-[var(--muted)]">High-resolution Neu-Brutalist logo in JPEG format.</p>
              <button
                type="button"
                onClick={async () => {
                  try {
                    const response = await fetch('/toolkitpro-logo.jpg');
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'ToolKitPro_Logo.jpg';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                  } catch (error) {
                    console.error('Download failed:', error);
                  }
                }}
                className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 bg-yellow-400 text-black border-4 border-black font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] text-xs sm:text-sm min-h-[44px]"
              >
                Download Logo
              </button>
            </div>
          </div>
        </section>
      </div>
      <div className="bg-black text-white p-5 sm:p-8 border-4 border-black shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] sm:shadow-[8px_8px_0px_0px_rgba(251,191,36,1)]">
        <h3 className="text-xl sm:text-2xl font-black uppercase mb-2 sm:mb-4 text-yellow-400">Join our journey</h3>
        <p className="text-xs sm:text-sm md:text-base">
          We are constantly adding new tools to our ecosystem. If you have a suggestion for a tool that would make your life easier, feel free to reach out to us.
        </p>
      </div>
    </div>
  );
}
