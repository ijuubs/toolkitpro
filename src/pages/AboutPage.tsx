import { Helmet } from 'react-helmet-async';
import { SITE_URL, SITE_NAME } from '../config/site';
import Breadcrumbs from '../components/Breadcrumbs';
import { ShieldCheck, Cpu, Award, BookOpen, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  const canonicalUrl = `${SITE_URL}/about`;

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-16">
      <Helmet>
        <title>About Us | Editorial Standards & Client-Side Architecture | {SITE_NAME}</title>
        <meta name="description" content={`Learn about ${SITE_NAME}: our mission for radical user privacy, 100% client-side WebAssembly tools, mathematical auditing standards, and engineering team.`} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`About Us | ${SITE_NAME}`} />
        <meta property="og:description" content={`Learn about ${SITE_NAME}: our mission for radical user privacy, 100% client-side WebAssembly tools, mathematical auditing standards, and engineering team.`} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": `About Us - ${SITE_NAME}`,
            "url": canonicalUrl,
            "description": `Editorial standards, client-side RAM architecture, and engineering principles behind ${SITE_NAME}.`,
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
          Engineering & Editorial Standards
        </span>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-black leading-tight">
          About {SITE_NAME}
        </h1>
        <p className="font-bold text-xs sm:text-sm text-neutral-600 mt-2">
          Professional-grade utility suite built with industrial precision, radical privacy, and zero server logging.
        </p>
      </div>
      
      <div className="prose prose-xl max-w-none text-neutral-800 leading-relaxed space-y-8">
        <div className="bg-yellow-50 border-4 border-black p-5 sm:p-7 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="font-black text-black text-lg sm:text-2xl uppercase tracking-tight mb-2">
            Our Core Mission
          </p>
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
            {SITE_NAME} was engineered with a clear mandate: to provide the global web community with fast, accessible, and mathematically audited utility tools without compromising user privacy. In an era where online utility portals frequently harvest contact information or upload sensitive documents to remote cloud storage, we provide a trustworthy, serverless computing alternative.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tighter flex items-center gap-2">
            <Cpu size={24} />
            The Client-Side Sovereignty Architecture
          </h2>
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
            Every utility in our catalog—ranging from our PDF Compressor and Image Resizer to our Myers-diff engine and Base64 encoders—leverages modern web standards including WebAssembly, Web Workers, the HTML5 File API, and the Web Crypto API.
          </p>
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
            When you process data on {SITE_NAME}, the computation executes entirely inside your device's memory (RAM). When you close the browser tab, the data evaporates. Zero telemetry logs your sensitive inputs, and zero network calls send your files across the internet.
          </p>
        </section>

        <section className="bg-black text-white p-6 sm:p-8 border-4 border-black shadow-[6px_6px_0px_0px_rgba(251,191,36,1)] space-y-4">
          <h2 className="text-xl sm:text-2xl font-black uppercase text-yellow-400 flex items-center gap-2">
            <Award size={22} />
            Editorial Integrity & Mathematical Verification Standards
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Our calculators and converters are not casual approximations. Every formula implemented in our software undergoes strict technical verification:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-neutral-300">
            <li><strong>Financial Algorithms:</strong> Our loan and mortgage amortization engines adhere to the standard actuarial monthly payment formula, with precision rounding to exact currency cents.</li>
            <li><strong>Health Metrics:</strong> BMI classifications adhere strictly to the World Health Organization (WHO) international guidelines, and metabolic TDEE outputs use the clinically validated Mifflin-St Jeor equation.</li>
            <li><strong>Statutory Fiji Formulas:</strong> Our Fiji tax, VAT, FNPF, and TSLS calculators are referenced against official Fiji Revenue and Customs Service (FRCS) and Fiji National Provident Fund schedules.</li>
            <li><strong>Cryptographic Randomness:</strong> Our password generators utilize the cryptographically secure pseudo-random number generator (CSPRNG) via `crypto.getRandomValues()`.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tighter flex items-center gap-2">
            <BookOpen size={24} />
            Editorial Guidelines & Publication Policy
          </h2>
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
            Our technical articles and how-to guides are authored by software engineers and subject matter specialists. We do not publish automated or unreviewed content. Every tutorial, architectural breakdown, and mathematical guide must:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="border-2 border-black p-4 bg-neutral-50 space-y-1">
              <strong className="block font-black uppercase text-black">1. Primary Source Accuracy</strong>
              <p className="text-neutral-600">Formulas and technical specifications are cited directly from ISO standards, RFCs, and academic journals.</p>
            </div>
            <div className="border-2 border-black p-4 bg-neutral-50 space-y-1">
              <strong className="block font-black uppercase text-black">2. Practical Worked Examples</strong>
              <p className="text-neutral-600">Every guide includes step-by-step arithmetic so readers can manually verify results.</p>
            </div>
            <div className="border-2 border-black p-4 bg-neutral-50 space-y-1">
              <strong className="block font-black uppercase text-black">3. Objective Tool Limitations</strong>
              <p className="text-neutral-600">We clearly document mathematical assumptions, edge cases, and tax year thresholds.</p>
            </div>
            <div className="border-2 border-black p-4 bg-neutral-50 space-y-1">
              <strong className="block font-black uppercase text-black">4. Regular Review Cycles</strong>
              <p className="text-neutral-600">All tools and documentation are audited biannually to maintain alignment with updated browser APIs and statutory rates.</p>
            </div>
          </div>
        </section>

        <section className="border-4 border-black p-5 sm:p-7 bg-white space-y-3">
          <h3 className="text-lg sm:text-xl font-black uppercase">Open Communication & Contact</h3>
          <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
            We value feedback from developers, students, researchers, and financial professionals. If you find a discrepancy in any calculation or wish to suggest an addition to our suite, please contact us via our <a href="/contact" className="underline font-bold text-black">Contact Page</a> or email our technical desk directly.
          </p>
        </section>
      </div>
    </div>
  );
}
