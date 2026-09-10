import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { BLOG_POSTS } from '../data/blogData';

export default function BlogPage() {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-12">
      <Helmet>
        <title>Blog | ToolKitPro Insights</title>
        <meta name="description" content="Stay updated with the latest in health metrics, web development utilities, and data security from the ToolKitPro editorial team." />
        <link rel="canonical" href="https://toolkitpro.app/blog" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "ToolKitPro Blog",
            "url": "https://toolkitpro.app/blog",
            "description": "Deep dives into the science, math, and technology behind our utility suite."
          })}
        </script>
      </Helmet>
      
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-black uppercase tracking-tighter italic bg-black text-white inline-block px-8 py-4 shadow-[12px_12px_0px_0px_rgba(251,191,36,1)]">
          The ToolKit Blog
        </h1>
        <p className="text-xl font-bold max-w-2xl mx-auto pt-6">Deep dives into the science, math, and technology behind our utility suite.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BLOG_POSTS.map((post) => (
          <article key={post.id} className="group border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex flex-col">
            <div className="p-6 space-y-4 flex-1">
                <div className="flex justify-between items-center text-xs font-black uppercase">
                    <span className="bg-yellow-400 px-2 py-1">{post.category}</span>
                    <span>{post.readTime}</span>
                </div>
                <h2 className="text-2xl font-black uppercase leading-none group-hover:underline">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="text-[var(--muted)] font-medium leading-relaxed">{post.excerpt}</p>
            </div>
            <div className="p-6 border-t-4 border-black bg-white flex items-center justify-between">
                <span className="text-sm font-bold italic">{post.date}</span>
                <Link to={`/blog/${post.slug}`} className="font-black uppercase text-sm hover:bg-yellow-400 hover:text-black px-1 underline transition-colors">Read Article →</Link>
            </div>
          </article>
        ))}
      </div>

      <div className="bg-yellow-100 border-4 border-black p-12 text-center space-y-6">
          <h3 className="text-3xl font-black uppercase">Want more insights?</h3>
          <p className="text-xl font-medium">Get the latest tools and articles delivered straight to your inbox once a month.</p>
          {subscribed ? (
            <div className="bg-green-100 border-4 border-green-500 p-4 max-w-lg mx-auto">
              <p className="font-black text-green-700 uppercase">Thanks for subscribing!</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-4 justify-center max-w-lg mx-auto">
                <input required type="email" placeholder="email@example.com" className="flex-1 border-4 border-black p-4 font-bold outline-none focus:bg-white" />
                <button type="submit" className="bg-black text-white font-black uppercase px-8 py-4 hover:bg-yellow-400 hover:text-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">Subscribe</button>
            </form>
          )}
      </div>
    </div>
  );
}
