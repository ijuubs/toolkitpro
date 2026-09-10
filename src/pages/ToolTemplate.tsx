import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { TOOLS } from '../data/toolsData';
import { Suspense, lazy, useEffect } from 'react';
import { trackToolView } from '../utils/analytics';
import AdSlot from '../components/AdSlot';
import ErrorBoundary from '../components/ErrorBoundary';
import Breadcrumbs from '../components/Breadcrumbs';
import ReactMarkdown from 'react-markdown';
import { SITE_URL } from '../config/site';

// Lazy load tools
const WordCounter = lazy(() => import('../components/tools/WordCounter'));
const JsonFormatter = lazy(() => import('../components/tools/JsonFormatter'));
const PdfCompressor = lazy(() => import('../components/tools/PdfCompressor'));
const ImageResizer = lazy(() => import('../components/tools/ImageResizer'));
const QrCodeGenerator = lazy(() => import('../components/tools/QrCodeGenerator'));
const PasswordGenerator = lazy(() => import('../components/tools/PasswordGenerator'));
const BmiCalculator = lazy(() => import('../components/tools/BmiCalculator'));
const UrlEncoder = lazy(() => import('../components/tools/UrlEncoder'));
const LoremIpsum = lazy(() => import('../components/tools/LoremIpsum'));
const ColorPicker = lazy(() => import('../components/tools/ColorPicker'));
const UnitConverter = lazy(() => import('../components/tools/UnitConverter'));
const LoanCalculator = lazy(() => import('../components/tools/LoanCalculator'));
const PercentageCalculator = lazy(() => import('../components/tools/PercentageCalculator'));
const RoiCalculator = lazy(() => import('../components/tools/RoiCalculator'));
const SipCalculator = lazy(() => import('../components/tools/SipCalculator'));
const AgeCalculator = lazy(() => import('../components/tools/AgeCalculator'));
const TdeeCalculator = lazy(() => import('../components/tools/TdeeCalculator'));
const CompoundInterestCalculator = lazy(() => import('../components/tools/CompoundInterestCalculator'));

// Fiji Tools
const FijiSalaryCalculator = lazy(() => import('../components/tools/FijiSalaryCalculator'));
const FijiOvertimeCalculator = lazy(() => import('../components/tools/FijiOvertimeCalculator'));
const FijiAnnualLeaveCalculator = lazy(() => import('../components/tools/FijiAnnualLeaveCalculator'));
const FijiLoanRepaymentCalculator = lazy(() => import('../components/tools/FijiLoanRepaymentCalculator'));
const FijiMortgageCalculator = lazy(() => import('../components/tools/FijiMortgageCalculator'));
const FijiDutyImportCalculator = lazy(() => import('../components/tools/FijiDutyImportCalculator'));
const FijiVehicleCostCalculator = lazy(() => import('../components/tools/FijiVehicleCostCalculator'));
const FijiElectricityBillCalculator = lazy(() => import('../components/tools/FijiElectricityBillCalculator'));
const FijiGroceryBudgetCalculator = lazy(() => import('../components/tools/FijiGroceryBudgetCalculator'));
const FijiTaxiFareCalculator = lazy(() => import('../components/tools/FijiTaxiFareCalculator'));

export default function ToolTemplate() {
  const { slug } = useParams<{ slug: string }>();
  
  // Find tool by slug or alias
  const tool = TOOLS.find((t) => t.slug === slug || (t.aliases && t.aliases.includes(slug || '')));

  if (!tool) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-6">
        <h1 className="text-6xl font-black uppercase">404</h1>
        <p className="text-2xl font-bold">Tool Not Found</p>
        <Link to="/" className="inline-block bg-yellow-400 border-4 border-black px-6 py-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // Determine if we are on an alias and set dynamic title
  const isAlias = tool.aliases?.includes(slug || '');
  const displayTitle = isAlias && slug 
    ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') 
    : tool.name;

  useEffect(() => {
    if (tool) {
      trackToolView(tool.id, tool.name, tool.category);
    }
  }, [tool?.id]);

  const renderTool = () => {
    switch(tool.id) {
        case 'word-counter': return <WordCounter />;
        case 'json-formatter': return <JsonFormatter />;
        case 'pdf-compressor': return <PdfCompressor />;
        case 'image-resizer': return <ImageResizer />;
        case 'qr-code-generator': return <QrCodeGenerator />;
        case 'password-generator': return <PasswordGenerator />;
        case 'bmi-calculator': return <BmiCalculator />;
        case 'url-encoder': return <UrlEncoder />;
        case 'lorem-ipsum': return <LoremIpsum />;
        case 'color-picker': return <ColorPicker />;
        case 'unit-converter': return <UnitConverter />;
        case 'loan-calculator': return <LoanCalculator />;
        case 'percentage-calculator': return <PercentageCalculator />;
        case 'roi-calculator': return <RoiCalculator />;
        case 'sip-calculator': return <SipCalculator />;
        case 'age-calculator': return <AgeCalculator />;
        case 'tdee-calculator': return <TdeeCalculator />;
        case 'compound-interest-calculator': return <CompoundInterestCalculator />;
        
        // Fiji tools switch mapping
        case 'fiji-salary-calculator': return <FijiSalaryCalculator />;
        case 'fiji-overtime-calculator': return <FijiOvertimeCalculator />;
        case 'fiji-annual-leave-calculator': return <FijiAnnualLeaveCalculator />;
        case 'fiji-loan-repayment-calculator': return <FijiLoanRepaymentCalculator />;
        case 'fiji-mortgage-calculator': return <FijiMortgageCalculator />;
        case 'fiji-duty-import-calculator': return <FijiDutyImportCalculator />;
        case 'fiji-vehicle-cost-calculator': return <FijiVehicleCostCalculator />;
        case 'fiji-electricity-bill-calculator': return <FijiElectricityBillCalculator />;
        case 'fiji-grocery-budget-calculator': return <FijiGroceryBudgetCalculator />;
        case 'fiji-taxi-fare-calculator': return <FijiTaxiFareCalculator />;
        
        default: return <p className="text-center text-[var(--muted)]">Tool interface for {tool.name} coming soon.</p>;
    }
  };

  const relatedTools = TOOLS
    .filter(t => t.id !== tool.id && (t.category === tool.category))
    .slice(0, 4);

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": displayTitle,
      "description": tool.metaDescription || tool.description,
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": tool.description
    },
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": tool.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sticky Sidebar */}
      <aside className="w-full lg:w-64 shrink-0 order-2 lg:order-1">
        <div className="sticky top-8 space-y-6">
          <div className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-black uppercase text-lg mb-4 border-b-2 border-black pb-2">Tools</h3>
            <ul className="space-y-2">
              {TOOLS.map((t) => (
                <li key={t.id}>
                  <Link 
                    to={`/tools/${t.slug}`} 
                    className={`block p-2 text-sm font-bold border-2 border-transparent hover:border-black transition-all ${t.id === tool.id ? 'bg-yellow-200 border-black' : ''}`}
                  >
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {relatedTools.length > 0 && (
            <div className="bg-black text-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(251,191,36,1)] sm:shadow-[8px_8px_0px_0px_rgba(251,191,36,1)]">
              <h3 className="font-black uppercase text-lg mb-4 text-yellow-400 font-bold">Related</h3>
              <ul className="space-y-3">
                {relatedTools.map((t) => (
                  <li key={t.id}>
                    <Link to={`/tools/${t.slug}`} className="block text-sm font-bold hover:text-yellow-400 transition-colors">
                      → {t.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="hidden lg:block border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <AdSlot adSlot="9791142997" adFormat="vertical" minHeight="600px" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-8 min-w-0 order-1 lg:order-2">
        <Helmet>
          <title>{tool.titleTag || `${displayTitle} | ToolKitPro`}</title>
          <meta name="description" content={tool.metaDescription || tool.description} />
          
          <link rel="canonical" href={`${SITE_URL}/tools/${tool.slug}`} />
          <meta property="og:title" content={tool.titleTag || `${displayTitle} | ToolKitPro`} />
          <meta property="og:description" content={tool.metaDescription || tool.description} />
          <meta property="og:url" content={`${SITE_URL}/tools/${tool.slug}`} />
          <meta property="og:type" content="website" />
          
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={tool.titleTag || `${displayTitle} | ToolKitPro`} />
          <meta name="twitter:description" content={tool.metaDescription || tool.description} />

          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        </Helmet>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2 sm:mb-4 text-[var(--g6)] leading-none">
          {displayTitle}
        </h1>

        <Breadcrumbs items={[{ label: 'Tools', path: '/' }, { label: tool.name }]} />

        <div className="bg-[var(--surface)] border-4 border-black p-4 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] min-h-[400px]">
          <ErrorBoundary>
            <Suspense fallback={<div className="text-center font-bold uppercase animate-pulse">Loading tool interface...</div>}>
                {renderTool()}
            </Suspense>
          </ErrorBoundary>
        </div>

        {tool.usp && (
            <div className="bg-black text-white p-4 sm:p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(251,191,36,1)] sm:shadow-[8px_8px_0px_0px_rgba(251,191,36,1)] flex items-start gap-3 sm:gap-4">
                <div className="bg-yellow-400 text-black px-2 py-1 rounded-sm font-black text-xs uppercase shrink-0">USP</div>
                <p className="font-bold text-base sm:text-lg leading-tight uppercase italic">{tool.usp}</p>
            </div>
        )}

        <section className="prose max-w-none mt-10 md:mt-12">
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[var(--g6)] border-b-4 border-black pb-2 leading-tight">How to use {displayTitle}</h2>
          <div className="text-[var(--muted)] leading-relaxed mt-4 sm:mt-6 text-sm sm:text-base markdown-body">
            <ReactMarkdown>{tool.howTo}</ReactMarkdown>
          </div>
          
          <div className="my-8 sm:my-12 p-6 sm:p-10 bg-yellow-400 border-4 sm:border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-xl sm:text-2xl font-black uppercase mb-3 sm:mb-4 leading-tight">Pro Tip</h3>
            <p className="font-bold text-base sm:text-lg">Use keyboard shortcuts (Cmd/Ctrl + V) to instantly paste data into our tools for faster workflow.</p>
          </div>

          <AdSlot adSlot="9791142997" adFormat="auto" minHeight="250px" className="my-8 sm:my-12" />

          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[var(--g6)] mt-12 sm:mt-16 border-b-4 border-black pb-2 leading-tight">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
            {tool.faqs.map((faq, i) => (
                <div key={i} className="p-4 sm:p-6 border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                    <h4 className="font-black uppercase mb-2 text-base sm:text-lg leading-tight">{faq.question}</h4>
                    <p className="text-[var(--muted)] font-medium text-sm sm:text-base">{faq.answer}</p>
                </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
