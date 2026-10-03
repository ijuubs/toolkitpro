import { Helmet } from 'react-helmet-async';
import { SITE_URL, SITE_NAME } from '../config/site';
import Breadcrumbs from '../components/Breadcrumbs';

export default function PrivacyPage() {
  const canonicalUrl = `${SITE_URL}/privacy`;

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-16">
      <Helmet>
        <title>Privacy Policy | Google AdSense & GDPR Compliance | {SITE_NAME}</title>
        <meta name="description" content={`Official Privacy Policy for ${SITE_NAME}. Complete disclosures on client-side data processing, Google AdSense cookies, GDPR, CCPA, and your privacy rights.`} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`Privacy Policy | ${SITE_NAME}`} />
        <meta property="og:description" content={`Official Privacy Policy for ${SITE_NAME}. Complete disclosures on client-side processing, Google AdSense advertising, and privacy rights.`} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": `Privacy Policy - ${SITE_NAME}`,
            "url": canonicalUrl,
            "description": `Comprehensive Privacy Policy, Google AdSense disclosures, and GDPR/CCPA user rights for ${SITE_NAME}.`
          })}
        </script>
      </Helmet>

      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Privacy Policy' }]} />
      
      <div className="border-b-4 sm:border-b-8 border-black pb-4 sm:pb-6">
        <span className="bg-black text-white text-xs font-black uppercase px-2.5 py-1 tracking-wider inline-block mb-2">
          Legal & Privacy Compliance
        </span>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-black leading-tight">
          Privacy Policy
        </h1>
        <p className="font-bold text-xs sm:text-sm text-neutral-600 mt-2">
          Effective Date: January 1, 2026 • Last Reviewed: October 3, 2026
        </p>
      </div>
      
      <div className="prose prose-lg max-w-none text-neutral-800 space-y-6 text-sm sm:text-base leading-relaxed">
        <div className="bg-yellow-50 border-4 border-black p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-lg sm:text-xl font-black uppercase text-black mb-2">
            Executive Summary: 100% Client-Side Privacy Architecture
          </h2>
          <p className="font-medium text-xs sm:text-sm text-neutral-700 leading-relaxed">
            At <strong>{SITE_NAME}</strong> (accessible at <a href={SITE_URL} className="underline font-bold text-black">{SITE_URL}</a>), our fundamental engineering principle is that <strong>your data belongs to you</strong>. All file transformations, PDF compressions, image resizings, cryptographic password generations, and financial calculations execute entirely in your local browser memory (RAM) via client-side JavaScript and WebAssembly. Your files, inputs, and documents are <strong>never uploaded to or stored on our servers</strong>.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-black uppercase pt-2">
            1. Information We Do Not Collect
          </h2>
          <p>
            Unlike conventional online utility portals, {SITE_NAME} operates with zero server-side data retention:
          </p>
          <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 font-medium">
            <li><strong>No File Uploads:</strong> When you compress a PDF or resize an image, the file is read locally via the HTML5 File API and processed in your browser memory. No copy is transmitted to our infrastructure.</li>
            <li><strong>No Input Logging:</strong> Text entered into our Word Counter, JSON Formatter, or Diff Checker stays strictly within your client session.</li>
            <li><strong>No Financial / Personal Identifiers:</strong> Financial inputs (salary, loan principal, mortgage interest rates) and health inputs (weight, height, age) are never saved to any database.</li>
            <li><strong>No User Accounts:</strong> {SITE_NAME} requires no registration, login credentials, or personal email address to access any utility tool.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-black uppercase pt-2">
            2. Google AdSense & Third-Party Advertising Disclosures
          </h2>
          <p>
            We use Google AdSense to serve advertisements when you visit our website. To maintain compliance with Google's Advertising Policies and requirements, please review the following:
          </p>
          <ul className="list-disc pl-5 sm:pl-6 space-y-2 font-medium">
            <li>
              <strong>Third-Party Vendors & Cookies:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to {SITE_NAME} or other websites on the Internet.
            </li>
            <li>
              <strong>DoubleClick DART Cookie:</strong> Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to {SITE_NAME} and/or other sites on the Internet.
            </li>
            <li>
              <strong>Opting Out of Personalized Advertising:</strong> Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="underline font-bold text-black break-all">Google Ads Settings (https://www.google.com/settings/ads)</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="underline font-bold text-black break-all">www.aboutads.info/choices/</a> or the <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="underline font-bold text-black break-all">Network Advertising Initiative Consumer Opt-Out Page</a>.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-black uppercase pt-2">
            3. Web Analytics & Aggregated Telemetry
          </h2>
          <p>
            {SITE_NAME} maintains an integrated real-time analytics dashboard (`/analytics`) to monitor aggregate site performance, page load latency, and tool operational health.
          </p>
          <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 font-medium">
            <li><strong>Anonymized Metrics:</strong> We track aggregate counters such as total page views, tool execution counts, and download conversion rates. These counts are stored in aggregate format in your local browser `localStorage` and optionally mirrored via Google Analytics 4 (Measurement ID: `G-QR3WP8T7T6`).</li>
            <li><strong>No Cross-Site Tracking:</strong> Analytics data is never cross-referenced with personal identities or sold to third-party data brokers.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-black uppercase pt-2">
            4. General Data Protection Regulation (GDPR) Compliance
          </h2>
          <p>
            If you are a resident of the European Economic Area (EEA), you have specific data protection rights under the General Data Protection Regulation (GDPR):
          </p>
          <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 font-medium">
            <li><strong>The Right to Access:</strong> You have the right to request copies of any personal data we hold about you. Because {SITE_NAME} operates client-side without user accounts or server storage, we do not hold personal identification profiles.</li>
            <li><strong>The Right to Rectification / Erasure:</strong> You can purge all client-side cached data, local telemetry, and offline assets at any time by clearing your browser cache and cookies, or clicking "Reset to 0" on our Web Analytics page.</li>
            <li><strong>The Right to Object / Restrict Processing:</strong> You may disable cookies in your browser settings at any time without impeding the computational functionality of our tools.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-black uppercase pt-2">
            5. California Consumer Privacy Act (CCPA / CPRA)
          </h2>
          <p>
            Under the California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA), California residents have specific statutory rights:
          </p>
          <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 font-medium">
            <li><strong>We Do Not Sell Personal Information:</strong> {SITE_NAME} does not sell, rent, or trade your personal information to third parties for monetary or other valuable consideration.</li>
            <li><strong>Right to Know & Delete:</strong> You have the right to request information regarding the categories of personal data collected. As noted, our computation architecture operates locally in memory.</li>
            <li><strong>Non-Discrimination:</strong> We will never discriminate against you for exercising your privacy rights under California law.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-black uppercase pt-2">
            6. Children's Information (COPPA)
          </h2>
          <p>
            Protecting the privacy of children on the Internet is especially critical. {SITE_NAME} does not knowingly collect any personally identifiable information from children under the age of 13. If you believe that your child provided personal information on our website, please contact us immediately and we will take immediate steps to remove such information.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-black uppercase pt-2">
            7. Contacting Our Data Protection Officer
          </h2>
          <p>
            If you have questions, feedback, or requests regarding this Privacy Policy or our client-side architecture, please contact our engineering team:
          </p>
          <div className="bg-neutral-100 border-2 border-black p-4 font-mono text-xs sm:text-sm space-y-1">
            <p><strong>Entity:</strong> {SITE_NAME} Engineering & Privacy Team</p>
            <p><strong>Website:</strong> <a href={SITE_URL} className="underline">{SITE_URL}</a></p>
            <p><strong>Contact Form:</strong> <a href={`${SITE_URL}/contact`} className="underline">{SITE_URL}/contact</a></p>
            <p><strong>Support Email:</strong> privacy@{SITE_URL.replace(/https?:\/\//, '').replace(/\/+$/, '')}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
