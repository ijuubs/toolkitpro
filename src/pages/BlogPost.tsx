import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BLOG_POSTS } from '../data/blogData';
import Breadcrumbs from '../components/Breadcrumbs';
import ReactMarkdown from 'react-markdown';
import { generateBlogSEO } from '../utils/seo';
import AdSlot from '../components/AdSlot';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="text-center py-24">
        <Helmet>
          <title>Post Not Found | ToolKitPro</title>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <h1 className="text-4xl font-black mb-4 uppercase">Post Not Found</h1>
        <Link to="/blog" className="underline font-bold uppercase">Back to Blog</Link>
      </div>
    );
  }

  const { titleTag, metaDescription, canonicalUrl, structuredData } = generateBlogSEO(post);

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-16">
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

      <Link to="/blog" className="inline-block font-black uppercase text-xs sm:text-sm border-2 border-black px-3.5 py-1.5 sm:px-4 sm:py-2 hover:bg-black hover:text-white transition-all">
        ← Back to Blog
      </Link>

      <header className="space-y-3 sm:space-y-4">
        <Breadcrumbs items={[{ label: 'Blog', path: '/blog' }, { label: post.title }]} />
        <div className="flex flex-wrap gap-2 sm:gap-4 items-center text-xs sm:text-sm font-black uppercase">
            <span className="bg-yellow-400 px-2 py-1">{post.category}</span>
            <span className="text-[var(--muted)]">{post.date}</span>
            <span className="text-[var(--muted)]">•</span>
            <span className="text-[var(--muted)]">{post.readTime}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight break-words">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 sm:gap-4 pt-3 sm:pt-4 border-t-4 border-black">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-full flex items-center justify-center text-white font-black italic text-sm sm:text-base shrink-0">
                {post.author[0]}
            </div>
            <div className="font-bold">
                <p className="text-[10px] sm:text-xs uppercase font-black text-[var(--muted)]">Written by</p>
                <p className="uppercase text-xs sm:text-base">{post.author}</p>
            </div>
        </div>
      </header>

      <div className="prose prose-xl max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-black border-4 border-black p-4 sm:p-8 md:p-12 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <p className="text-base sm:text-xl md:text-2xl font-bold italic border-l-4 sm:border-l-8 border-yellow-400 pl-4 sm:pl-6 my-4 sm:my-8">
            {post.excerpt}
        </p>
        
        <div className="markdown-body">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[var(--g6)] mt-8 mb-4 border-b-2 border-black pb-1">{children}</h3>,
                h2: ({ children }) => <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[var(--g6)] mt-8 mb-3 border-b-2 border-black pb-1">{children}</h3>,
                h3: ({ children }) => <h4 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[var(--g6)] mt-6 mb-2">{children}</h4>,
                h4: ({ children }) => <h5 className="text-base sm:text-lg font-bold uppercase tracking-tight text-[var(--g6)] mt-4 mb-2">{children}</h5>,
                p: ({ children }) => <p className="mb-4 text-[var(--muted)] leading-relaxed font-medium text-sm sm:text-base">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-outside ml-6 space-y-1.5 mb-4 text-[var(--muted)] font-medium text-sm sm:text-base">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-outside ml-6 space-y-1.5 mb-4 text-[var(--muted)] font-medium text-sm sm:text-base">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
                strong: ({ children }) => <strong className="font-black text-[var(--g6)]">{children}</strong>,
                code: ({ children }) => <code className="px-2 py-0.5 bg-yellow-200 border border-black font-mono text-xs sm:text-sm font-bold text-black">{children}</code>,
                blockquote: ({ children }) => <blockquote className="border-l-4 border-black bg-yellow-100 p-4 my-6 italic font-bold text-sm sm:text-base">{children}</blockquote>,
                a: ({ href, children }) => {
                  const isInternal = href && (href.startsWith('/') || href.includes('toolkitpro'));
                  if (isInternal) {
                    const targetPath = href.replace(/^https?:\/\/[^/]+/, '');
                    return (
                      <Link 
                        to={targetPath} 
                        className="font-black underline text-black hover:bg-yellow-300 px-1 py-0.5 border-b-2 border-black transition-colors inline-block"
                      >
                        {children}
                      </Link>
                    );
                  }
                  return (
                    <a 
                      href={href} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="font-bold underline text-blue-800 hover:text-black transition-colors"
                    >
                      {children}
                    </a>
                  );
                },
                table: ({ children }) => (
                  <div className="overflow-x-auto my-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm bg-white">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => <thead className="bg-black text-white uppercase font-black">{children}</thead>,
                tbody: ({ children }) => <tbody className="divide-y-2 divide-black">{children}</tbody>,
                tr: ({ children }) => <tr className="hover:bg-yellow-50 transition-colors">{children}</tr>,
                th: ({ children }) => <th className="p-3 border-r-2 border-black last:border-r-0 font-black">{children}</th>,
                td: ({ children }) => <td className="p-3 border-r-2 border-black last:border-r-0 font-medium">{children}</td>
              }}
            >
              {post.content}
            </ReactMarkdown>
        </div>
      </div>

      <div className="border-4 border-black p-5 sm:p-7 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center text-white font-black italic text-xl shrink-0">
            {post.author[0]}
          </div>
          <div>
            <span className="bg-yellow-400 text-black text-[10px] font-black uppercase px-2 py-0.5 inline-block mb-1">
              Author
            </span>
            <h3 className="font-black text-lg uppercase leading-tight">{post.author}</h3>
            <p className="text-xs text-[var(--muted)] font-medium">Written and maintained by the ToolKitPro developer</p>
          </div>
        </div>
        <Link 
          to="/about" 
          className="text-xs font-black uppercase underline hover:bg-yellow-300 px-2 py-1 border-2 border-black transition-colors shrink-0"
        >
          About ToolKitPro →
        </Link>
      </div>

      <AdSlot adSlot="9791142997" adFormat="auto" minHeight="250px" className="mt-8" />
    </div>
  );
}
