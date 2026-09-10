import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BLOG_POSTS } from '../data/blogData';
import Breadcrumbs from '../components/Breadcrumbs';
import ReactMarkdown from 'react-markdown';
import { SITE_URL } from '../config/site';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="text-center py-24">
        <h1 className="text-4xl font-black mb-4 uppercase">Post Not Found</h1>
        <Link to="/blog" className="underline font-bold uppercase">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <Helmet>
        <title>{post.title} | ToolKitPro Blog</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={`${SITE_URL}/blog/${post.slug}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "datePublished": post.date,
            "author": {
              "@type": "Person",
              "name": post.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "ToolKitPro",
              "url": `${SITE_URL}/`,
              "logo": `${SITE_URL}/toolkitpro-logo.jpg`
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `${SITE_URL}/blog/${post.slug}`
            }
          })}
        </script>
      </Helmet>

      <Link to="/blog" className="inline-block font-black uppercase text-sm border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-all">
        ← Back to Blog
      </Link>

      <header className="space-y-4">
        <Breadcrumbs items={[{ label: 'Blog', path: '/blog' }, { label: post.title }]} />
        <div className="flex gap-4 items-center text-sm font-black uppercase">
            <span className="bg-yellow-400 px-2 py-1">{post.category}</span>
            <span className="text-[var(--muted)]">{post.date}</span>
            <span className="text-[var(--muted)]">•</span>
            <span className="text-[var(--muted)]">{post.readTime}</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 pt-4 border-t-4 border-black">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-black italic">
                {post.author[0]}
            </div>
            <div className="font-bold">
                <p className="text-xs uppercase font-black text-[var(--muted)]">Written by</p>
                <p className="uppercase">{post.author}</p>
            </div>
        </div>
      </header>

      <div className="prose prose-xl max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-black border-4 border-black p-8 md:p-12 bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <p className="text-2xl font-bold italic border-l-8 border-yellow-400 pl-6 my-10">
            {post.excerpt}
        </p>
        
        <div className="markdown-body">
            <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </div>

      <div className="bg-black text-white p-12 border-4 border-black shadow-[12px_12px_0px_0px_rgba(251,191,36,1)]">
          <h2 className="text-3xl font-black uppercase text-yellow-400 mb-4">Sharing is Caring</h2>
          <p className="text-xl mb-8">If you found this guide helpful, consider sharing it with your network or following us for more updates.</p>
          <div className="flex gap-4">
              <button className="flex-1 bg-white text-black font-black uppercase py-4 border-4 border-white hover:bg-yellow-400 hover:border-black transition-all">Twitter</button>
              <button className="flex-1 bg-white text-black font-black uppercase py-4 border-4 border-white hover:bg-yellow-400 hover:border-black transition-all">Facebook</button>
              <button className="flex-1 bg-white text-black font-black uppercase py-4 border-4 border-white hover:bg-yellow-400 hover:border-black transition-all">LinkedIn</button>
          </div>
      </div>
    </div>
  );
}
