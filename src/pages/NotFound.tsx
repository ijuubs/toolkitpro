import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '../config/site';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 px-4">
      <Helmet>
        <title>404 - Page Not Found | ToolKitPro</title>
        <meta name="description" content="The requested tool or page could not be found on ToolKitPro. Explore our collection of free online developer and utility tools." />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={`${SITE_URL}/404`} />
      </Helmet>
      
      <div className="w-24 h-24 bg-red-500 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-white text-5xl font-black italic">
        !
      </div>
      
      <div className="space-y-4">
        <h1 className="text-6xl font-black uppercase tracking-tighter">404 Error</h1>
        <p className="text-xl font-bold bg-yellow-200 border-2 border-black px-4 py-2 inline-block">
          The tool or page you are looking for does not exist.
        </p>
      </div>
      
      <p className="max-w-md text-[var(--muted)] font-medium">
        It seems the URL was mistyped or the tool has been moved. We recommend heading back to our toolkit gallery to find what you need.
      </p>

      <Link 
        to="/" 
        className="px-8 py-4 bg-black text-white font-black uppercase tracking-widest border-4 border-black shadow-[8px_8px_0px_0px_rgba(251,191,36,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
      >
        Back to Tools
      </Link>
    </div>
  );
}
