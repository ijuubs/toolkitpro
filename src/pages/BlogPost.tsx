import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BLOG_POSTS } from '../data/blogData';
import Breadcrumbs from '../components/Breadcrumbs';
import ReactMarkdown from 'react-markdown';
import { generateBlogSEO } from '../utils/seo';

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

  const { titleTag, metaDescription, canonicalUrl, structuredData } = generateBlogSEO(post);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <Helmet>
        <title>{titleTag}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={titleTag} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={titleTag} />
        <meta name="twitter:description" content={metaDescription} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
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
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[var(--g6)] mt-8 mb-4 border-b-2 border-black pb-1">{children}</h3>,
                h2: ({ children }) => <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[var(--g6)] mt-8 mb-3 border-b-2 border-black pb-1">{children}</h3>,
                h3: ({ children }) => <h4 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[var(--g6)] mt-6 mb-2">{children}</h4>,
                h4: ({ children }) => <h5 className="text-base sm:text-lg font-bold uppercase tracking-tight text-[var(--g6)] mt-4 mb-2">{children}</h5>,
                p: ({ children }) => <p className="mb-4 text-[var(--muted)] leading-relaxed font-medium text-base sm:text-lg">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-outside ml-6 space-y-2 mb-6 text-[var(--muted)] font-medium text-base sm:text-lg">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-outside ml-6 space-y-2 mb-6 text-[var(--muted)] font-medium text-base sm:text-lg">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
                strong: ({ children }) => <strong className="font-black text-[var(--g6)]">{children}</strong>,
                code: ({ children }) => <code className="px-2 py-0.5 bg-yellow-200 border border-black font-mono text-xs sm:text-sm font-bold text-black">{children}</code>,
                blockquote: ({ children }) => <blockquote className="border-l-4 border-black bg-yellow-100 p-4 my-6 italic font-bold text-base">{children}</blockquote>
              }}
            >
              {post.content}
            </ReactMarkdown>
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
