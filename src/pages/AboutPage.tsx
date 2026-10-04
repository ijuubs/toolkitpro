import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { SITE_URL, SITE_NAME, CONTACT_EMAIL } from '../config/site';
import Breadcrumbs from '../components/Breadcrumbs';
import { ShieldCheck, User, BookOpen, AlertTriangle } from 'lucide-react';

export default function AboutPage() {
  const canonicalUrl = `${SITE_URL}/about`;

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-16">
      <Helmet>
        <title>About Us | {SITE_NAME}</title>
        <meta name="description" content={`Learn about ${SITE_NAME}: an independent project built by a developer in Fiji offering free, client-side utility tools and calculators.`} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`About Us | ${SITE_NAME}`} />
        <meta property="og:description" content={`Learn about ${SITE_NAME}: an independent project built by a developer in Fiji offering free, client-side utility tools and calculators.`} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": `About Us - ${SITE_NAME}`,
            "url": canonicalUrl,
            "description": `About ${SITE_NAME}, an independent free tools platform built by a developer in Fiji.`,
            "publisher": {
              "@type": "Organization",
              "name": SITE_NAME,
              "url": `${SITE_URL}/`,
              "logo": `${SITE_URL}/toolkitpro-logo.jpg`
            }
          })}
        </script>
      </Helmet>
      
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'About Us' }]} />

      <div className="border-b-4 sm:border-b-8 border-black pb-4 sm:pb-6">
        <span className="bg-black text-white text-xs font-black uppercase px-2.5 py-1 tracking-wider inline-block mb-2">
          Independent Web Utilities
        </span>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-black leading-tight">
          About {SITE_NAME}
        </h1>
        <p className="font-bold text-xs sm:text-sm text-neutral-600 mt-2">
          Free, practical online calculators and utilities where inputs are processed in your browser and not uploaded.
        </p>
      </div>
      
      <div className="prose prose-xl max-w-none text-neutral-800 leading-relaxed space-y-8 text-sm sm:text-base">
        <div className="bg-yellow-50 border-4 border-black p-5 sm:p-7 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="font-black text-black text-lg sm:text-2xl uppercase tracking-tight mb-2">
            Who We Are
          </p>
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
            {SITE_NAME} is an independent project created and maintained by a software developer based in Fiji. The goal is to provide fast, reliable, everyday utility tools—ranging from developer helpers and text utilities to localized Fiji financial and tax calculators—completely free for anyone to use.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tighter flex items-center gap-2">
            <ShieldCheck size={24} />
            Data Privacy & Technology
          </h2>
          <p className="text-neutral-700 leading-relaxed">
            Whenever possible, our tools run on client-side JavaScript. This means your text inputs, files, and calculation data are processed directly in your web browser. Your confidential entries, document contents, and personal numbers are not uploaded to our backend servers.
          </p>
          <p className="text-neutral-700 leading-relaxed">
            To provide a modern web experience and maintain this free service, we utilize a small number of trusted third-party services:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-neutral-700">
            <li><strong>Analytics:</strong> We use Google Analytics 4 (GA4) and Google Tag Manager to monitor aggregate site traffic and improve performance.</li>
            <li><strong>Advertising:</strong> Google AdSense is used to display non-intrusive advertisements.</li>
            <li><strong>Infrastructure:</strong> Our site is hosted on Vercel, which provides secure, high-performance global delivery.</li>
          </ul>
          <p className="text-neutral-700 leading-relaxed">
            For more information on how we handle user data and third-party advertising, please review our <Link to="/privacy" className="underline font-bold text-black">Privacy Policy</Link>.
          </p>
        </section>

        <section className="bg-black text-white p-6 sm:p-8 border-4 border-black shadow-[6px_6px_0px_0px_rgba(251,191,36,1)] space-y-4">
          <h2 className="text-xl sm:text-2xl font-black uppercase text-yellow-400 flex items-center gap-2">
            <User size={22} />
            How This Site Is Funded
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            ToolKitPro is 100% free to use with no subscriptions or mandatory accounts. To cover ongoing domain hosting, server infrastructure, and development costs, we display advertisements via Google AdSense.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tighter flex items-center gap-2">
            <AlertTriangle size={24} className="text-yellow-600" />
            Accuracy & Limitations
          </h2>
          <p className="text-neutral-700 leading-relaxed">
            We make every reasonable effort to keep calculators up to date with published formulas and official schedules. However:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-neutral-700">
            <li><strong>Statutory Rates Change:</strong> Tax brackets (FRCS PAYE, VAT), superannuation rules (FNPF), and regulatory tariffs (FCCC taxi rates, electricity subsidies) can change with new national budgets or regulatory determinations.</li>
            <li><strong>Informational Estimates:</strong> Calculations provided on this website are for educational and estimation purposes only. They do not constitute formal tax, legal, financial, or medical advice.</li>
            <li><strong>Verification:</strong> For official filings and critical financial decisions, always consult qualified professionals or the relevant statutory authority. Please see our <Link to="/disclaimer" className="underline font-bold text-black">Disclaimer</Link> for details.</li>
          </ul>
        </section>

        <section className="border-4 border-black p-5 sm:p-7 bg-white space-y-3">
          <h3 className="text-lg sm:text-xl font-black uppercase flex items-center gap-2">
            <BookOpen size={20} />
            Feedback & Questions
          </h3>
          <p className="text-neutral-700 leading-relaxed">
            Have feedback on a calculator, noticed an outdated rate, or want to suggest a new tool? Feel free to reach out via our <Link to="/contact" className="underline font-bold text-black">Contact Page</Link> or email us at <a href={`mailto:${CONTACT_EMAIL}`} className="underline font-bold text-black">{CONTACT_EMAIL}</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
