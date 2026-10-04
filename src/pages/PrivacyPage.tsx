import { Helmet } from 'react-helmet-async';
import { SITE_URL, SITE_NAME, CONTACT_EMAIL } from '../config/site';
import Breadcrumbs from '../components/Breadcrumbs';
import { OPEN_CONSENT_EVENT } from '../components/CookieConsent';

export default function PrivacyPage() {
  const canonicalUrl = `${SITE_URL}/privacy`;

  const handleOpenConsent = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(OPEN_CONSENT_EVENT));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-16">
      <Helmet>
        <title>Privacy Policy | {SITE_NAME}</title>
        <meta name="description" content={`Privacy Policy for ${SITE_NAME}. Disclosures on in-browser data processing, Google AdSense cookies, Google Analytics, GDPR, CCPA, and your privacy choices.`} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`Privacy Policy | ${SITE_NAME}`} />
        <meta property="og:description" content={`Privacy Policy for ${SITE_NAME}. Disclosures on in-browser data processing, Google AdSense cookies, Google Analytics, and privacy choices.`} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": `Privacy Policy - ${SITE_NAME}`,
            "url": canonicalUrl,
            "description": `Privacy Policy, Google AdSense disclosures, and GDPR/CCPA user rights for ${SITE_NAME}.`
          })}
        </script>
      </Helmet>

      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Privacy Policy' }]} />
      
      <div className="border-b-4 sm:border-b-8 border-black pb-4 sm:pb-6">
        <span className="bg-black text-white text-xs font-black uppercase px-2.5 py-1 tracking-wider inline-block mb-2">
          Legal & Privacy Disclosures
        </span>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-black leading-tight">
          Privacy Policy
        </h1>
        <p className="font-bold text-xs sm:text-sm text-neutral-600 mt-2">
          Last updated: October 4, 2026
        </p>
      </div>
      
      <div className="prose prose-lg max-w-none text-neutral-800 space-y-6 text-sm sm:text-base leading-relaxed">
        <div className="bg-yellow-50 border-4 border-black p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-lg sm:text-xl font-black uppercase text-black mb-2">
            Overview: In-Browser Tool Processing
          </h2>
          <p className="font-medium text-xs sm:text-sm text-neutral-700 leading-relaxed">
            At <strong>{SITE_NAME}</strong> (accessible at <a href={SITE_URL} className="underline font-bold text-black">{SITE_URL}</a>), all file modifications, text manipulation, and calculation tool inputs are processed locally in your browser and not uploaded to our servers. This policy explains what information is collected, how cookies and third-party advertising partners operate, and how you can manage your privacy choices.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-black uppercase pt-2">
            1. Tool Inputs & Local Processing
          </h2>
          <p>
            When you use the utilities and calculators on {SITE_NAME}:
          </p>
          <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 font-medium">
            <li><strong>Files & Text:</strong> Files selected for compression or resizing, and text entered into tools like the Word Counter, JSON Formatter, or Diff Checker, are processed locally in your web browser. They are not uploaded to, inspected by, or stored on our servers.</li>
            <li><strong>Calculators:</strong> Numerical inputs entered into financial, tax, and health calculators are computed directly on your device.</li>
            <li><strong>No User Accounts:</strong> We do not require account creation, logins, or passwords to use the website.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-black uppercase pt-2">
            2. Google AdSense & Advertising Cookies
          </h2>
          <p>
            We display advertisements served by Google AdSense to help fund the hosting and maintenance of this website.
          </p>
          <ul className="list-disc pl-5 sm:pl-6 space-y-2 font-medium">
            <li>
              Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites.
            </li>
            <li>
              Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to {SITE_NAME} and/or other sites on the Internet.
            </li>
            <li>
              To understand how Google uses data when you use partner sites, please visit <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="underline font-bold text-black break-all">How Google uses information from sites or apps that use our services (policies.google.com/technologies/partner-sites)</a>.
            </li>
            <li>
              <strong>Opt-Out Options:</strong> You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="underline font-bold text-black break-all">Google Ads Settings (google.com/settings/ads)</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="underline font-bold text-black break-all">aboutads.info/choices/</a>.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-black uppercase pt-2">
            3. Cookie Consent & Settings
          </h2>
          <p>
            When you first visit {SITE_NAME}, a cookie consent banner presents the option to Accept or Decline analytics and advertising cookies.
          </p>
          <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 font-medium">
            <li><strong>If you Decline:</strong> Non-personalised ads may still be shown, and advertising/analytics storage is set to denied.</li>
            <li><strong>If you Accept:</strong> Cookies may be used for personalized ads and traffic measurement.</li>
            <li>
              You can change your consent choice at any time by clicking:{' '}
              <button 
                type="button" 
                onClick={handleOpenConsent} 
                className="inline-block bg-yellow-400 text-black border-2 border-black px-3 py-1 font-black text-xs uppercase hover:bg-black hover:text-white transition-all cursor-pointer"
              >
                Open Cookie Settings
              </button>
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-black uppercase pt-2">
            4. Analytics (GA4 & Google Tag Manager)
          </h2>
          <p>
            We use Google Analytics 4 (GA4) and Google Tag Manager to understand general website traffic trends (such as page views, device types, and aggregate referral sources).
          </p>
          <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 font-medium">
            <li>Analytics cookies are only enabled if you have accepted cookies.</li>
            <li>Tool inputs, uploaded file contents, and sensitive calculation data are never sent to Google Analytics.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-black uppercase pt-2">
            5. Local Storage (localStorage)
          </h2>
          <p>
            We use your browser's standard <code className="bg-neutral-100 px-1.5 py-0.5 border border-black font-mono text-xs">localStorage</code> to save a small number of local preferences directly on your device:
          </p>
          <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 font-medium">
            <li><strong>Cookie Consent Preference:</strong> Stores whether you selected 'granted' or 'denied' (<code className="bg-neutral-100 px-1 py-0.5 font-mono text-xs">toolkitpro_cookie_consent</code>).</li>
            <li><strong>Theme Preference:</strong> Stores your chosen display theme (light or dark mode).</li>
            <li><strong>Local Usage Counters:</strong> Records local tool interaction counters displayed on your own device.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-black uppercase pt-2">
            6. Hosting & Server Logs (Vercel)
          </h2>
          <p>
            This website is hosted on Vercel. Like most web hosting platforms, Vercel servers automatically collect standard technical access logs (such as IP address, browser user-agent, request timestamps, and requested URL paths) for network security, DDoS mitigation, and server diagnostics. We do not use hosting logs to identify individual visitors.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-black uppercase pt-2">
            7. No Sale of Personal Information
          </h2>
          <p>
            {SITE_NAME} does not sell, rent, or trade your personal information to third parties for monetary or other consideration.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-black uppercase pt-2">
            8. GDPR (European Users)
          </h2>
          <p>
            If you are located in the European Economic Area (EEA) or UK, you have statutory rights under the General Data Protection Regulation (GDPR), including the right to access, rectify, or erase personal data, and the right to object to or restrict certain processing. Because we do not maintain user accounts or store tool inputs on servers, we hold no personal data profiles. You can control cookies and withdraw consent at any time via the <button type="button" onClick={handleOpenConsent} className="underline font-bold text-black cursor-pointer">Cookie Settings</button>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-black uppercase pt-2">
            9. CCPA / CPRA (California Residents)
          </h2>
          <p>
            Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), California consumers have the right to know what personal data categories are collected and the right to request deletion. We do not sell personal information. You may opt out of third-party cookie-based tracking via your browser settings or our cookie consent banner.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-black uppercase pt-2">
            10. Children's Privacy (COPPA)
          </h2>
          <p>
            {SITE_NAME} does not knowingly collect any personal identifiable information from children under the age of 13. If you believe that a child has provided personal information to us, please contact us so we can take appropriate measures.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-black uppercase pt-2">
            11. Contact Us
          </h2>
          <p>
            If you have questions or inquiries regarding this Privacy Policy, please contact:
          </p>
          <div className="bg-neutral-100 border-2 border-black p-4 font-mono text-xs sm:text-sm space-y-1">
            <p><strong>Website:</strong> <a href={SITE_URL} className="underline">{SITE_URL}</a></p>
            <p><strong>Contact Email:</strong> <a href={`mailto:${CONTACT_EMAIL}`} className="underline">{CONTACT_EMAIL}</a></p>
            <p><strong>Contact Form:</strong> <a href={`${SITE_URL}/contact`} className="underline">{SITE_URL}/contact</a></p>
          </div>
        </section>
      </div>
    </div>
  );
}
