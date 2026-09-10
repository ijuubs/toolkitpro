import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { TOOLS } from '../data/toolsData';
import { BLOG_POSTS } from '../data/blogData';

export default function SitemapPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
      <Helmet>
        <title>HTML Sitemap | ToolKitPro</title>
        <meta name="description" content="Sitemap for ToolKitPro. Find all our utility tools and blog posts in one place." />
        <link rel="canonical" href="https://toolkitpro.app/sitemap" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "HTML Sitemap - ToolKitPro",
            "url": "https://toolkitpro.app/sitemap",
            "description": "Sitemap for ToolKitPro. Find all our utility tools and blog posts in one place."
          })}
        </script>
      </Helmet>
      
      <h1 className="text-5xl font-black uppercase tracking-tighter border-b-8 border-black pb-4">HTML Sitemap</h1>

      <div className="bg-yellow-100 border-4 border-black p-4 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="font-black uppercase text-lg mb-2">Are you a search engine?</h3>
        <p className="font-medium text-black">
          This page is an HTML sitemap designed for human visitors. If you are trying to submit this site to Google Search Console or another indexing service, please use our XML Sitemap instead: <br/><br/>
          <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="bg-black text-white px-4 py-2 font-black uppercase text-sm hover:bg-yellow-400 hover:text-black transition-all">View sitemap.xml</a>
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12">
        <section className="space-y-6">
          <h2 className="text-3xl font-black uppercase italic border-b-4 border-yellow-400 pb-2 inline-block">Main Pages</h2>
          <ul className="space-y-3 font-bold uppercase underline">
            <li><Link to="/" className="hover:bg-yellow-400 hover:text-black px-1 transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:bg-yellow-400 hover:text-black px-1 transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:bg-yellow-400 hover:text-black px-1 transition-colors">Contact</Link></li>
            <li><Link to="/blog" className="hover:bg-yellow-400 hover:text-black px-1 transition-colors">Blog</Link></li>
            <li><Link to="/privacy" className="hover:bg-yellow-400 hover:text-black px-1 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:bg-yellow-400 hover:text-black px-1 transition-colors">Terms of Service</Link></li>
            <li><Link to="/disclaimer" className="hover:bg-yellow-400 hover:text-black px-1 transition-colors">Disclaimer</Link></li>
            <li><Link to="/faq" className="hover:bg-yellow-400 hover:text-black px-1 transition-colors">FAQ</Link></li>
          </ul>
        </section>

        <section className="space-y-6 md:col-span-2 lg:col-span-1">
          <h2 className="text-3xl font-black uppercase italic border-b-4 border-yellow-400 pb-2 inline-block">Utility Tools & Variations</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-8 pt-4">
            {TOOLS.map(tool => (
              <div key={tool.id} className="space-y-3">
                <Link to={`/tools/${tool.slug}`} className="block font-black text-xl uppercase underline hover:bg-yellow-400 hover:text-black px-1 transition-colors">
                  {tool.name}
                </Link>
                {tool.aliases && tool.aliases.length > 0 && (
                  <ul className="pl-6 space-y-2 text-xs font-bold uppercase text-[var(--muted)] underline decoration-gray-400">
                    {tool.aliases.map(alias => (
                      <li key={alias}>
                        <Link to={`/tools/${alias}`} className="hover:bg-yellow-400 hover:text-black px-1 transition-colors">
                          {alias.replace(/-/g, ' ')}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-black uppercase italic border-b-4 border-yellow-400 pb-2 inline-block">Blog Posts</h2>
          <ul className="space-y-3 font-bold uppercase underline">
            {BLOG_POSTS.map(post => (
              <li key={post.id}><Link to={`/blog/${post.slug}`} className="hover:bg-yellow-400 hover:text-black px-1 transition-colors">{post.title}</Link></li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
