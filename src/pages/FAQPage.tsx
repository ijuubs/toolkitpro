import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { SITE_URL, SITE_NAME } from '../config/site';
import Breadcrumbs from '../components/Breadcrumbs';

const FAQS = [
  {
    q: "Are the tools really free?",
    a: "Yes. All tools on ToolKitPro are free for personal and commercial use. To cover domain hosting and infrastructure costs, we display unobtrusive advertisements via Google AdSense."
  },
  {
    q: "How does ToolKitPro protect my data?",
    a: "Our calculators and conversion tools run client-side in your web browser. Your inputs are processed in your browser and not uploaded to our servers. When you close or refresh the page, the data in your browser session is cleared."
  },
  {
    q: "Do I need to create an account?",
    a: "No. You never need an account, password, or login to use our tools. Everything is available directly on the web."
  },
  {
    q: "Are cookies required to use the site?",
    a: "No. The core functionality of all calculators and tools works without cookies. Google Analytics and Google AdSense cookies are optional; you can choose to decline them in our cookie consent banner or Cookie Settings."
  },
  {
    q: "How accurate are the calculator results?",
    a: "We strive to calibrate our tools to official standards—such as WHO guidelines for BMI, standard actuarial formulas for loans, and official FRCS/FNPF/FCCC schedules for Fiji calculators. However, statutory rates and tax laws change periodically, so all outputs are informational estimates and should be verified with relevant professionals or authorities."
  },
  {
    q: "Can I use the tools offline?",
    a: "Offline support is only partial. Once a tool page has finished loading in your browser, its JavaScript calculations can continue working locally, but loading new tools or pages requires an active internet connection."
  }
];

export default function FAQPage() {
  const canonicalUrl = `${SITE_URL}/faq`;

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-16">
      <Helmet>
        <title>Frequently Asked Questions (FAQ) | {SITE_NAME}</title>
        <meta name="description" content="Frequently Asked Questions about ToolKitPro tools, browser-based processing, cookies, and ads." />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`FAQ | ${SITE_NAME}`} />
        <meta property="og:description" content="Frequently Asked Questions about ToolKitPro tools, browser-based processing, cookies, and ads." />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "name": `FAQ - ${SITE_NAME}`,
            "url": canonicalUrl,
            "mainEntity": FAQS.map(faq => ({
              "@type": "Question",
              "name": faq.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a
              }
            }))
          })}
        </script>
      </Helmet>
      
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'FAQ' }]} />

      <div className="border-b-4 sm:border-b-8 border-black pb-3 sm:pb-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight">
          Frequently Asked Questions
        </h1>
        <p className="font-bold text-xs sm:text-sm text-neutral-600 mt-2">
          Common questions about how our tools work, privacy, ads, and accuracy.
        </p>
      </div>
      
      <div className="space-y-4 sm:space-y-6 md:space-y-8">
        {FAQS.map((faq, i) => (
          <div key={i} className="border-4 border-black p-4 sm:p-6 md:p-8 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-2 sm:space-y-4">
            <h3 className="text-lg sm:text-2xl font-black uppercase italic border-b-2 border-yellow-400 pb-2 leading-snug">{faq.q}</h3>
            <p className="text-xs sm:text-base md:text-lg font-medium text-[var(--muted)] leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
