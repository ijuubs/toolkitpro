import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '../config/site';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  skipSchema?: boolean;
}

export default function Breadcrumbs({ items, skipSchema = false }: BreadcrumbsProps) {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : `${SITE_URL}/`;

  const schemaList = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": `${SITE_URL}/`
    },
    ...items.map((item, index) => {
      const itemUrl = item.path 
        ? (item.path.startsWith('http') ? item.path : `${SITE_URL}${item.path.startsWith('/') ? item.path : `/${item.path}`}`)
        : currentUrl;
      return {
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        "item": itemUrl
      };
    })
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": schemaList
  };

  return (
    <>
      {!skipSchema && (
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify(breadcrumbSchema)}
          </script>
        </Helmet>
      )}
      <nav className="flex items-center space-x-2 text-sm font-black uppercase tracking-wider mb-6 overflow-x-auto no-scrollbar whitespace-nowrap py-2">
        <Link to="/" className="flex items-center gap-1 hover:bg-yellow-400 hover:text-black px-1 transition-colors">
          <Home size={14} />
          <span>Home</span>
        </Link>
        
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <ChevronRight size={14} className="text-black dark:text-white" />
            {item.path ? (
              <Link to={item.path} className="hover:bg-yellow-400 hover:text-black px-1 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-neutral-900 dark:text-neutral-100 font-black cursor-default">{item.label}</span>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}
