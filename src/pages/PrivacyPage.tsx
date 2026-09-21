import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '../config/site';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      <Helmet>
        <title>Privacy Policy | ToolKitPro</title>
        <meta name="description" content="Read our Privacy Policy to understand how ToolKitPro handles your data with transparency and security." />
        <link rel="canonical" href={`${SITE_URL}/privacy`} />
        <meta property="og:title" content="Privacy Policy | ToolKitPro" />
        <meta property="og:description" content="Read our Privacy Policy to understand how ToolKitPro handles your data with transparency and security." />
        <meta property="og:url" content={`${SITE_URL}/privacy`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy | ToolKitPro" />
        <meta name="twitter:description" content="Read our Privacy Policy to understand how ToolKitPro handles your data with transparency and security." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Privacy Policy - ToolKitPro",
            "url": `${SITE_URL}/privacy`,
            "description": "Read our Privacy Policy to understand how ToolKitPro handles your data with transparency and security."
          })}
        </script>
      </Helmet>
      
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter border-b-4 sm:border-b-8 border-black pb-3 sm:pb-4 leading-tight">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none text-[var(--muted)] space-y-4 sm:space-y-6 text-sm sm:text-base leading-relaxed">
        <p className="font-bold text-xs sm:text-sm text-neutral-500">Last Updated: April 24, 2026</p>
        
        <p>At **ToolKitPro** (accessible from toolkitpro.io), one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by ToolKitPro and how we use it.</p>

        <h2 className="text-xl sm:text-2xl font-black text-black uppercase pt-2">1. Private Browser-Side Processing</h2>
        <p>A significant number of our tools (e.g., Word Counter, JSON Formatter, PDF Compressor) operate using **Client-Side Technology**. This means your files and data are processed locally in your web browser. Your data is not uploaded to our servers during these operations.</p>

        <h2 className="text-xl sm:text-2xl font-black text-black uppercase pt-2">2. Log Files</h2>
        <p>ToolKitPro follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.</p>

        <h2 className="text-xl sm:text-2xl font-black text-black uppercase pt-2">3. Cookies and Web Beacons</h2>
        <p>Like any other website, ToolKitPro uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>

        <h2 className="text-xl sm:text-2xl font-black text-black uppercase pt-2">4. Google DoubleClick DART Cookie</h2>
        <p>Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" className="underline font-bold text-black break-all">https://policies.google.com/technologies/ads</a></p>

        <h2 className="text-xl sm:text-2xl font-black text-black uppercase pt-2">5. Advertising Partners Privacy Policies</h2>
        <p>You may consult this list to find the Privacy Policy for each of the advertising partners of ToolKitPro. Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on ToolKitPro, which are sent directly to users' browser.</p>

        <h2 className="text-xl sm:text-2xl font-black text-black uppercase pt-2">6. Consent</h2>
        <p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>
      </div>
    </div>
  );
}
