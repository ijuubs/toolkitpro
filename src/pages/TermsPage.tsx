import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '../config/site';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <Helmet>
        <title>Terms & Conditions | ToolKitPro</title>
        <meta name="description" content="View the Terms and Conditions for using the ToolKitPro utility platform." />
        <link rel="canonical" href={`${SITE_URL}/terms`} />
        <meta property="og:title" content="Terms & Conditions | ToolKitPro" />
        <meta property="og:description" content="View the Terms and Conditions for using the ToolKitPro utility platform." />
        <meta property="og:url" content={`${SITE_URL}/terms`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Terms & Conditions | ToolKitPro" />
        <meta name="twitter:description" content="View the Terms and Conditions for using the ToolKitPro utility platform." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Terms & Conditions - ToolKitPro",
            "url": `${SITE_URL}/terms`,
            "description": "View the Terms and Conditions for using the ToolKitPro utility platform."
          })}
        </script>
      </Helmet>
      
      <h1 className="text-5xl font-black uppercase tracking-tighter border-b-8 border-black pb-4">Terms & Conditions</h1>
      
      <div className="prose prose-lg max-w-none text-[var(--muted)] space-y-6">
        <p>Welcome to ToolKitPro!</p>
        
        <p>These terms and conditions outline the rules and regulations for the use of ToolKitPro's Website, located at toolkitpro.io.</p>

        <h2 className="text-2xl font-black text-black uppercase">1. Terms</h2>
        <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use ToolKitPro if you do not agree to take all of the terms and conditions stated on this page.</p>

        <h2 className="text-2xl font-black text-black uppercase">2. License</h2>
        <p>Unless otherwise stated, ToolKitPro and/or its licensors own the intellectual property rights for all material on ToolKitPro. All intellectual property rights are reserved. You may access this from ToolKitPro for your own personal use subjected to restrictions set in these terms and conditions.</p>

        <h2 className="text-2xl font-black text-black uppercase">3. User Restrictions</h2>
        <p>You are specifically restricted from all of the following:</p>
        <ul className="list-disc pl-6">
          <li>Publishing any Website material in any other media;</li>
          <li>Selling, sublicensing and/or otherwise commercializing any Website material;</li>
          <li>Publicly performing and/or showing any Website material;</li>
          <li>Using this Website in any way that is or may be damaging to this Website;</li>
          <li>Using this Website in any way that impacts user access to this Website.</li>
        </ul>

        <h2 className="text-2xl font-black text-black uppercase">4. Disclaimer</h2>
        <p>The tools provided on this website are for informational and utility purposes only. ToolKitPro does not guarantee the accuracy or reliability of the results produced by the tools. Use of the tools is at your own risk.</p>

        <h2 className="text-2xl font-black text-black uppercase">5. Variations of Terms</h2>
        <p>ToolKitPro is permitted to revise these terms at any time as it sees fit, and by using this Website you are expected to review these terms on a regular basis.</p>
      </div>
    </div>
  );
}
