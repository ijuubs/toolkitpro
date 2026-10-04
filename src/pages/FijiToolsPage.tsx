import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { TOOLS, Tool } from '../data/toolsData';
import Breadcrumbs from '../components/Breadcrumbs';
import { generateCategorySEO } from '../utils/seo';
import { getRecentTools } from '../utils/recentTools';
import { useState } from 'react';
import { 
  CircleDollarSign, 
  Briefcase, 
  Receipt, 
  Car, 
  Home, 
  GraduationCap,
  ChevronRight,
  Info,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function FijiToolsPage() {
  const fijiTools = TOOLS.filter(t => t.category === 'Fiji Tools');
  const [recentFijiTools] = useState<Tool[]>(() => 
    getRecentTools().filter(t => t.category === 'Fiji Tools')
  );
  
  const seo = generateCategorySEO(
    'Fiji Tools',
    '/fiji-tools',
    fijiTools
  );

  const groups = [
    {
      title: 'Finance',
      icon: <CircleDollarSign className="w-6 h-6 text-emerald-600" />,
      description: 'Manage personal loans, mortgages, and investment imports with localized Fiji bank rates.',
      toolIds: ['fiji-loan-repayment-calculator', 'fiji-mortgage-calculator', 'fiji-duty-import-calculator']
    },
    {
      title: 'Employment',
      icon: <Briefcase className="w-6 h-6 text-blue-600" />,
      description: 'Calculate take-home pay, overtime entitlements, annual leave, and FNPF retirement projections.',
      toolIds: ['fiji-salary-calculator', 'fiji-overtime-calculator', 'fiji-annual-leave-calculator', 'fiji-fnpf-calculator']
    },
    {
      title: 'Taxes',
      icon: <Receipt className="w-6 h-6 text-orange-600" />,
      description: 'Break down FRCS VAT (12.5% & 15%), PAYE income tax, and statutory import duties.',
      toolIds: ['fiji-vat-calculator', 'fiji-salary-calculator', 'fiji-duty-import-calculator']
    },
    {
      title: 'Transport',
      icon: <Car className="w-6 h-6 text-neutral-700" />,
      description: 'Estimate Viti Levu taxi fares under FCCC regulations and calculate vehicle running costs.',
      toolIds: ['fiji-taxi-fare-calculator', 'fiji-vehicle-cost-calculator']
    },
    {
      title: 'Household',
      icon: <Home className="w-6 h-6 text-amber-700" />,
      description: 'Budget for family groceries and estimate Energy Fiji Limited (EFL) electricity bills.',
      toolIds: ['fiji-grocery-budget-calculator', 'fiji-electricity-bill-calculator']
    },
    {
      title: 'Education',
      icon: <GraduationCap className="w-6 h-6 text-purple-600" />,
      description: 'Calculate TSLS and TELS student loan repayments and bond service periods.',
      toolIds: ['fiji-tsls-calculator']
    }
  ];

  return (
    <div className="space-y-8 sm:space-y-12">
      <Helmet>
        <title>{seo.titleTag}</title>
        <meta name="description" content={seo.metaDescription} />
        <link rel="canonical" href={seo.canonicalUrl} />
        <meta property="og:title" content={seo.titleTag} />
        <meta property="og:description" content={seo.metaDescription} />
        <meta property="og:url" content={seo.canonicalUrl} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify(seo.structuredData)}
        </script>
      </Helmet>

      <Breadcrumbs skipSchema items={[{ label: 'Home', path: '/' }, { label: 'Fiji Tools' }]} />

      {/* Hero Section */}
      <div className="border-b-4 sm:border-b-8 border-black pb-8 space-y-6">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="bg-black text-white text-xs font-black uppercase px-2.5 py-1 tracking-wider inline-block">
            Topical Hub
          </span>
          <span className="bg-yellow-300 text-black border-2 border-black text-xs font-black uppercase px-2.5 py-0.5 inline-block">
            {fijiTools.length} Localized Calculators
          </span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-black leading-tight">
          Fiji Calculators &amp; Utilities
        </h1>
        
        <div className="max-w-4xl space-y-4">
          <p className="text-base sm:text-lg md:text-xl text-neutral-700 font-bold leading-relaxed">
            A comprehensive suite of localized tools built specifically for the people, workers, and businesses of the Republic of Fiji. 
          </p>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-medium">
            Every calculator is aligned with current Fiji statutory regulations and market standards, including FRCS tax scales, FNPF contribution rates, TSLS bond conversion rules, and FCCC regulated tariffs. All calculations are performed 100% in your browser for total privacy.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {seo.keyFeatures.map((feat, i) => (
            <span key={i} className="text-xs font-black uppercase bg-white border-2 border-black px-3 py-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {feat}
            </span>
          ))}
        </div>
      </div>

      {/* RECENTLY USED SECTION */}
      {recentFijiTools.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b-4 border-black pb-2">
            <Clock className="w-5 h-5 text-black" />
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter">Your Recent Fiji Tools</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
            {recentFijiTools.map(tool => (
              <Link 
                key={tool.id} 
                to={`/tools/${tool.slug}`}
                className="p-3 bg-emerald-50 border-2 border-black hover:bg-emerald-100 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] flex flex-col justify-between min-h-[80px]"
              >
                <span className="font-black uppercase text-[10px] leading-tight line-clamp-2">{tool.name}</span>
                <div className="mt-2 text-[10px] font-bold text-neutral-500 flex justify-between items-center">
                  <span>Open</span>
                  <ArrowRight size={10} className="w-2.5 h-2.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Logical Grouping Section */}
      <div className="space-y-12">
        {groups.map((group, idx) => {
          const groupTools = fijiTools.filter(t => group.toolIds.includes(t.id));
          if (groupTools.length === 0) return null;

          return (
            <section key={idx} className="space-y-6">
              <div className="flex items-center gap-3 border-l-8 border-black pl-4">
                {group.icon}
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">{group.title}</h2>
                  <p className="text-sm font-bold text-neutral-500 uppercase tracking-wide">{group.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {groupTools.map(tool => (
                  <Link 
                    key={tool.id} 
                    to={`/tools/${tool.slug}`} 
                    className="group p-5 sm:p-6 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-yellow-50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-lg sm:text-xl font-black uppercase mb-2 leading-tight group-hover:text-neutral-800">
                        {tool.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 font-medium line-clamp-2 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t-2 border-black/10 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-neutral-400 group-hover:text-black">
                      <span>Launch Calculator</span>
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Privacy & Regulatory Notice */}
      <div className="bg-neutral-100 border-4 border-black p-6 sm:p-8 space-y-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-2 text-black">
          <Info size={24} />
          <h3 className="text-xl font-black uppercase tracking-tight">Accuracy & Reliability</h3>
        </div>
        <div className="space-y-3 text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
          <p>
            These tools are maintained as an independent resource. While we strive to ensure every formula reflects the latest <strong>2026/2027 Fiji National Budget</strong> and regulatory determinations, calculations are for informational purposes only.
          </p>
          <p>
            For official tax assessments, legal filings, or clinical medical results, always consult with the relevant statutory body (FRCS, FNPF, TSLS, or LTA) or a qualified professional in Fiji.
          </p>
        </div>
        <div className="pt-2">
          <Link to="/disclaimer" className="text-xs font-black uppercase underline hover:bg-yellow-300 transition-colors">
            Read Full Disclaimer
          </Link>
        </div>
      </div>
    </div>
  );
}
