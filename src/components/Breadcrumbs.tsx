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
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const schemaList = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": `${SITE_URL}/`
    },
    ...items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 2,
      "name": item.label,
      "item": item.path ? `${SITE_URL}${item.path}` : undefined
    }))
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": schemaList.filter(item => item.item !== undefined)
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      <nav className="flex items-center space-x-2 text-sm font-black uppercase tracking-wider mb-6 overflow-x-auto no-scrollbar whitespace-nowrap py-2">
        <Link to="/" className="flex items-center gap-1 hover:bg-yellow-400 hover:text-black px-1 transition-colors">
          <Home size={14} />
          <span>Home</span>
        </Link>
        
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <ChevronRight size={14} className="text-gray-500 dark:text-gray-300" />
            {item.path ? (
              <Link to={item.path} className="hover:bg-yellow-400 hover:text-black px-1 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-600 dark:text-gray-300 cursor-default">{item.label}</span>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}
