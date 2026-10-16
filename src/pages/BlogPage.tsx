import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { BLOG_POSTS } from '../data/blogData';
import { generateCanonicalUrl, getBlogPostImage } from '../utils/seo';
import { SITE_URL } from '../config/site';

export default function BlogPage() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const canonicalUrl = generateCanonicalUrl('/blog');
  const ogImageUrl = `${SITE_URL.replace(/\/+$/, '')}/images/blog/developer_tools_hero.jpg`;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    console.log('Newsletter subscription submitted for:', email);
    setSubscribed(true);
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      <Helmet>
        <title>Engineering, Finance & Tech Blog | ToolKitPro</title>
        <meta name="description" content="Stay updated with deep technical guides, Fiji statutory tax insights, client-side utility architecture, and health metrics from ToolKitPro." />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Engineering, Finance & Tech Blog | ToolKitPro" />
        <meta property="og:description" content="Stay updated with deep technical guides, Fiji statutory tax insights, client-side utility architecture, and health metrics from ToolKitPro." />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="675" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Engineering, Finance & Tech Blog | ToolKitPro" />
        <meta name="twitter:description" content="Stay updated with deep technical guides, Fiji statutory tax insights, client-side utility architecture, and health metrics from ToolKitPro." />
        <meta name="twitter:image" content={ogImageUrl} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "ToolKitPro Blog",
            "url": canonicalUrl,
            "description": "Deep dives into the science, math, and technology behind our utility suite."
          })}
        </script>
      </Helmet>
      
      <div className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter italic bg-black text-white inline-block px-4 sm:px-8 py-2.5 sm:py-4 shadow-[6px_6px_0px_0px_rgba(251,191,36,1)] sm:shadow-[12px_12px_0px_0px_rgba(251,191,36,1)]">
          The ToolKit Blog
        </h1>
        <p className="text-sm sm:text-base md:text-xl font-bold max-w-2xl mx-auto pt-2 sm:pt-4">Deep dives into the science, math, and technology behind our utility suite.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {BLOG_POSTS.map((post) => {
          const imgInfo = getBlogPostImage(post);
          return (
            <article key={post.id} className="group border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex flex-col overflow-hidden">
              {/* Flagship 3D Render Thumbnail */}
              <Link to={`/blog/${post.slug}`} className="block aspect-[16/9] border-b-4 border-black bg-black overflow-hidden relative">
                <img 
                  src={imgInfo.url} 
                  alt={imgInfo.alt} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  width="600"
                  height="338"
                />
                <span className="absolute bottom-2 left-2 bg-yellow-400 text-black border-2 border-black font-black uppercase text-[10px] px-2 py-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {post.category}
                </span>
              </Link>
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 flex-1">
                  <div className="flex justify-between items-center text-xs font-black uppercase text-[var(--muted)]">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase leading-tight group-hover:underline">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="text-[var(--muted)] font-medium text-xs sm:text-sm leading-relaxed">{post.excerpt}</p>
              </div>
              <div className="p-4 sm:p-6 border-t-4 border-black bg-white flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold italic">{post.author}</span>
                  <Link to={`/blog/${post.slug}`} className="font-black uppercase text-xs sm:text-sm bg-yellow-400 text-black border-2 border-black px-2.5 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-all">
                    Read Article →
                  </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="bg-yellow-100 border-4 border-black p-5 sm:p-8 md:p-12 text-center space-y-4 sm:space-y-6">
          <h3 className="text-2xl sm:text-3xl font-black uppercase">Want more insights?</h3>
          <p className="text-base sm:text-xl font-medium">Get the latest tools and articles delivered straight to your inbox once a month.</p>
          {subscribed ? (
            <div className="bg-green-100 border-4 border-green-500 p-4 max-w-lg mx-auto">
              <p className="font-black text-green-700 uppercase">Thanks! Interest noted.</p>
              <p className="text-sm font-bold text-green-800">The subscription service is currently in development. You are not yet added to a mailing list.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-lg mx-auto">
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="flex-1 border-4 border-black p-3 sm:p-4 font-bold outline-none focus:bg-white text-sm sm:text-base" />
                <button type="submit" className="bg-black text-white font-black uppercase px-6 sm:px-8 py-3 sm:py-4 hover:bg-yellow-400 hover:text-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] min-h-[44px]">Subscribe</button>
            </form>
          )}
      </div>
    </div>
  );
}
