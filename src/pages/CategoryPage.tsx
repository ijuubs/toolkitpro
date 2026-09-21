import { useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { TOOLS } from '../data/toolsData';
import Breadcrumbs from '../components/Breadcrumbs';
import { generateCategorySEO } from '../utils/seo';

export default function CategoryPage() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\//, '').replace(/\/$/, '');

  // Map slugs to category names
  const categoryMapping: Record<string, string> = {
    'calculators': 'Calculators', 
    'text-tools': 'Text Tools',
    'developer-tools': 'Developer Tools',
    'converters': 'Converters',
    'color-tools': 'Color Tools',
    'fiji-tools': 'Fiji Tools',
    'image-tools': 'Image Tools',
  };

  // Helper to get category tools
  const getToolsForCategory = (slug: string) => {
    const categoryName = categoryMapping[slug] || '';
    return TOOLS.filter(t => 
        (slug === 'calculators' && ['Finance Tools', 'Health', 'Health Tools', 'Math Tools'].includes(t.category)) ||
        (slug === 'developer-tools' && (['Web Tools', 'Security'].includes(t.category) || t.slug === 'diff-checker')) ||
        (slug === 'converters' && ['Converter'].includes(t.category)) ||
        (slug === 'image-tools' && ['image-resizer', 'color-picker'].includes(t.slug)) ||
        (slug === 'color-tools' && ['color-picker'].includes(t.slug)) ||
        t.category === categoryName ||
        t.category === slug.replace('-', ' ') // fallback
    );
  };

  const tools = getToolsForCategory(slug || '');
  const safeSlug = slug || '';
  const categoryName = categoryMapping[safeSlug] || safeSlug.replace('-', ' ');

  const { titleTag, metaDescription, canonicalUrl, structuredData, intro, keyFeatures } = generateCategorySEO(
    categoryName,
    `/${slug}`,
    tools
  );

  if (tools.length === 0) {
    return (
        <div className="max-w-4xl mx-auto py-20 px-4 text-center">
            <Helmet>
              <title>Category Not Found | ToolKitPro</title>
              <meta name="robots" content="noindex, follow" />
            </Helmet>
            <h1 className="text-4xl font-black uppercase tracking-tight mb-4">Category Not Found</h1>
            <p className="text-base text-[var(--muted)] font-medium mb-6">The tool category you requested does not exist or has been relocated.</p>
            <Link to="/" className="inline-block px-6 py-3 bg-black text-white font-black uppercase text-sm border-2 border-black hover:bg-yellow-400 hover:text-black transition-all">
              Return to Homepage
            </Link>
        </div>
    );
  }

  // Related sibling categories for internal linking
  const otherCategories = Object.entries(categoryMapping).filter(([catSlug]) => catSlug !== safeSlug);

  return (
    <div className="space-y-6 sm:space-y-8">
      <Helmet>
        <title>{titleTag}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={titleTag} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={titleTag} />
        <meta name="twitter:description" content={metaDescription} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: categoryName }]} />

      {/* Header & Editorial Intro */}
      <div className="border-b-4 border-black pb-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="bg-black text-white text-xs font-black uppercase px-2.5 py-1 tracking-wider">
            Verified Category
          </span>
          <span className="bg-yellow-300 text-black border-2 border-black text-xs font-black uppercase px-2.5 py-0.5">
            {tools.length} Free {tools.length === 1 ? 'Tool' : 'Tools'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-[var(--g6)] leading-tight break-words">
          {categoryName}
        </h1>
        {intro && (
          <p className="text-sm sm:text-base md:text-lg text-[var(--muted)] font-medium leading-relaxed max-w-4xl">
            {intro}
          </p>
        )}
        {keyFeatures && keyFeatures.length > 0 && (
          <div className="pt-2 flex flex-wrap gap-2">
            {keyFeatures.map((feat, i) => (
              <span key={i} className="text-xs font-bold uppercase bg-white border-2 border-black px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                ✓ {feat}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Tools Grid */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
          Available {categoryName} ({tools.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {tools.map(tool => (
            <Link 
              key={tool.id} 
              to={`/tools/${tool.slug}`} 
              className="p-5 sm:p-6 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-yellow-50 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="inline-block bg-black text-white text-[10px] font-black uppercase px-1.5 py-0.5 mb-2">
                  {tool.category}
                </span>
                <h3 className="text-lg sm:text-xl font-black uppercase mb-2 leading-snug">{tool.name}</h3>
                <p className="text-xs sm:text-sm text-[var(--muted)] font-medium line-clamp-3 leading-relaxed">{tool.description}</p>
              </div>
              <div className="mt-4 pt-3 border-t-2 border-black/10 flex items-center justify-between text-xs font-black uppercase">
                <span>Launch Tool</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Sibling Category Discovery Section */}
      <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t-4 border-black">
        <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight mb-4">
          Browse Other Tool Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 sm:gap-3">
          {otherCategories.map(([catSlug, catTitle]) => (
            <Link
              key={catSlug}
              to={`/${catSlug}`}
              className="p-3 text-center border-2 border-black bg-white hover:bg-yellow-200 text-xs font-black uppercase tracking-tight transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] min-h-[44px] flex items-center justify-center"
            >
              {catTitle}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
